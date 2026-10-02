-- FedEx production schema for Supabase/PostgreSQL.
-- Apply this schema to the dedicated FedEx Supabase project before deployment.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null default '',
  first_name text not null default '',
  last_name text not null default '',
  phone text not null default '',
  role text not null default 'customer' check (role in ('customer','admin')),
  country text not null default '',
  status text not null default 'active' check (status in ('active','suspended')),
  created_at timestamptz not null default now()
);

create table if not exists public.shipping_rates (
  id uuid primary key default gen_random_uuid(),
  service text not null,
  origin_country text not null,
  dest_country text not null,
  base_rate numeric(14,2) not null check (base_rate >= 0),
  per_kg_rate numeric(14,2) not null default 0 check (per_kg_rate >= 0),
  est_days_min integer not null check (est_days_min >= 0),
  est_days_max integer not null check (est_days_max >= est_days_min),
  currency text not null default 'USD',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  tracking_number text unique,
  carrier_tracking_number text,
  internal_reference text not null unique,
  invoice_number text not null unique,
  owner_uid uuid not null references auth.users(id) on delete restrict,
  sender jsonb not null,
  recipient jsonb not null,
  package_info jsonb not null,
  service text not null,
  status text not null,
  estimated_delivery timestamptz,
  created_at timestamptz not null default now(),
  events jsonb not null default '[]'::jsonb,
  route_waypoints jsonb not null default '[]'::jsonb,
  assigned_facility text,
  assigned_driver text,
  cost numeric(14,2) not null check (cost >= 0),
  payment_status text not null default 'Pending',
  currency text not null default 'USD',
  rate_id uuid references public.shipping_rates(id),
  payment_provider text,
  payment_reference text,
  paid_at timestamptz,
  payment_session_id text,
  carrier text,
  carrier_status text,
  carrier_request_id text,
  carrier_job_id text,
  label_url text,
  carrier_attempt_at timestamptz,
  carrier_error_code text,
  carrier_error_at timestamptz
);

create table if not exists public.carrier_jobs (
  shipment_id uuid primary key references public.shipments(id) on delete cascade,
  status text not null check (status in ('queued','processing','completed','failed')),
  attempts integer not null default 0,
  queued_at timestamptz not null default now(),
  started_at timestamptz,
  updated_at timestamptz not null default now(),
  result text
);

create table if not exists public.idempotency_keys (
  key text primary key,
  owner_uid uuid not null references auth.users(id) on delete cascade,
  response jsonb not null,
  shipment_id uuid not null references public.shipments(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.stripe_events (
  id text primary key,
  type text not null,
  received_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_uid uuid,
  actor_email text,
  action text not null,
  shipment_id uuid references public.shipments(id) on delete set null,
  shipment_number text,
  payment_reference text,
  details text,
  timestamp timestamptz not null default now()
);

create index if not exists shipments_owner_created_idx on public.shipments(owner_uid, created_at desc);
create index if not exists shipments_tracking_idx on public.shipments(tracking_number);
create index if not exists shipping_rates_lookup_idx on public.shipping_rates(service, origin_country, dest_country, active);
create index if not exists carrier_jobs_status_idx on public.carrier_jobs(status, queued_at);
create index if not exists audit_logs_shipment_idx on public.audit_logs(shipment_id, timestamp desc);

alter table public.profiles enable row level security;
alter table public.shipping_rates enable row level security;
alter table public.shipments enable row level security;
alter table public.carrier_jobs enable row level security;
alter table public.idempotency_keys enable row level security;
alter table public.stripe_events enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles for select to authenticated using ((select auth.uid()) = id);

drop policy if exists "shipments_owner_select" on public.shipments;
create policy "shipments_owner_select" on public.shipments for select to authenticated using ((select auth.uid()) = owner_uid);

-- Operational mutations are performed by the server using the service-role client.
-- No client policy grants insert/update/delete access to operational tables.

create or replace function public.claim_carrier_job(p_shipment_id uuid)
returns boolean
language plpgsql
security invoker
as $$
declare claimed boolean;
begin
  update public.carrier_jobs
  set status = 'processing',
      attempts = attempts + 1,
      started_at = now(),
      updated_at = now()
  where shipment_id = p_shipment_id and status = 'queued';
  get diagnostics claimed = row_count;
  return claimed = 1;
end;
$$;

create or replace function public.enqueue_carrier_job(p_shipment_id uuid)
returns void
language plpgsql
security invoker
as $$
begin
  insert into public.carrier_jobs (shipment_id, status, attempts, queued_at, updated_at)
  values (p_shipment_id, 'queued', 0, now(), now())
  on conflict (shipment_id) do update
    set status = case when public.carrier_jobs.status in ('queued','processing') then public.carrier_jobs.status else 'queued' end,
        updated_at = now();
end;
$$;

create or replace function public.create_shipment_idempotent(
  p_key text,
  p_owner_uid uuid,
  p_shipment jsonb
)
returns jsonb
language plpgsql
security invoker
as $$
declare existing_response jsonb;
declare new_id uuid;
begin
  select response into existing_response from public.idempotency_keys where key = p_key for update;
  if existing_response is not null then
    return existing_response;
  end if;

  new_id := (p_shipment->>'id')::uuid;
  insert into public.shipments (
    id, tracking_number, carrier_tracking_number, internal_reference, invoice_number,
    owner_uid, sender, recipient, package_info, service, status, estimated_delivery,
    created_at, events, route_waypoints, assigned_facility, assigned_driver, cost,
    payment_status, currency, rate_id
  )
  values (
    new_id, null, null, p_shipment->>'internalReference', p_shipment->>'invoiceNumber',
    p_owner_uid, p_shipment->'sender', p_shipment->'recipient', p_shipment->'packageInfo',
    p_shipment->>'service', p_shipment->>'status', null, (p_shipment->>'createdAt')::timestamptz,
    p_shipment->'events', p_shipment->'routeWaypoints', null, null,
    (p_shipment->>'cost')::numeric, p_shipment->>'paymentStatus', p_shipment->>'currency',
    nullif(p_shipment->>'rateId','')::uuid
  );

  insert into public.idempotency_keys(key, owner_uid, response, shipment_id)
  values (p_key, p_owner_uid, p_shipment, new_id);

  return p_shipment;
exception when unique_violation then
  select response into existing_response from public.idempotency_keys where key = p_key;
  if existing_response is not null then return existing_response; end if;
  raise;
end;
$$;

create or replace function public.claim_carrier_shipment(p_shipment_id uuid)
returns jsonb
language plpgsql
security invoker
as $$
declare s public.shipments%rowtype;
declare request_id text;
begin
  select * into s from public.shipments where id = p_shipment_id for update;
  if not found then return jsonb_build_object('result','skipped'); end if;
  if s.payment_status <> 'Paid' then return jsonb_build_object('result','skipped'); end if;
  if s.tracking_number is not null or s.carrier_status = 'Created' then return jsonb_build_object('result','created'); end if;
  if s.carrier_status = 'Processing' and s.carrier_attempt_at > now() - interval '10 minutes' then return jsonb_build_object('result','processing'); end if;

  request_id := coalesce(s.carrier_request_id, 'fedex-' || s.internal_reference);
  update public.shipments
  set carrier='FedEx', carrier_status='Processing', carrier_request_id=request_id,
      carrier_attempt_at=now(), status='Payment Confirmed',
      carrier_error_code=null, carrier_error_at=null
  where id=p_shipment_id;
  return jsonb_build_object('result','claimed','carrierRequestId',request_id);
end;
$$;

revoke all on public.claim_carrier_job(uuid) from public, anon, authenticated;
revoke all on public.enqueue_carrier_job(uuid) from public, anon, authenticated;
revoke all on public.create_shipment_idempotent(text,uuid,jsonb) from public, anon, authenticated;
revoke all on public.claim_carrier_shipment(uuid) from public, anon, authenticated;


create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles(id,email,first_name,last_name)
  values (
    new.id,
    coalesce(new.email,''),
    coalesce(new.raw_user_meta_data->>'first_name',''),
    coalesce(new.raw_user_meta_data->>'last_name','')
  )
  on conflict (id) do update set email=excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

revoke all on function public.handle_new_user() from public, anon, authenticated;

grant execute on function public.claim_carrier_job(uuid) to service_role;
grant execute on function public.enqueue_carrier_job(uuid) to service_role;
grant execute on function public.create_shipment_idempotent(text,uuid,jsonb) to service_role;
grant execute on function public.claim_carrier_shipment(uuid) to service_role;
