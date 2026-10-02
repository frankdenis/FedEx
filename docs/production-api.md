# Production Database & API Architecture

## Architecture

- Supabase Auth handles identity and client sessions.
- Express owns privileged business operations and validates requests.
- Supabase PostgreSQL is the operational database.
- React calls `/api/*`; service-account credentials never enter the browser.
- Payment, carrier rating/label, customs, and notifications are server-side integration boundaries.

## PostgreSQL collections

- `users/{uid}` — customer/admin profile and account state.
- `shipments/{shipmentId}` — shipment, parties, package, status, events, route and payment state.
- `shippingRates/{rateId}` — active service/country rate configuration.
- `supportTickets/{ticketId}` — customer support conversations.
- `pickups/{pickupId}` — pickup requests and operational status.
- `invoices/{invoiceId}` — invoice and payment-provider references.
- `notifications/{notificationId}` — user notifications.
- `auditLogs/{logId}` — immutable operational audit records.

## API

- `GET /api/health` — service health.
- `GET /api/me` — authenticated profile.
- `GET /api/shipments` — customer-owned shipments or admin operations list.
- `GET /api/shipments/:trackingNumber` — tracking lookup.
- `POST /api/quotes` — quote from configured production rates only.
- `POST /api/shipments` — authenticated shipment creation with server-generated identifiers; payment remains Pending.
- `POST /api/shipments/:trackingNumber/events` — admin-only status event.

## Security

1. Supabase Auth bearer tokens are verified server-side.
2. Customer shipment reads are scoped by `ownerUid`.
3. Admin mutations require `profiles.role = 'admin'`.
4. Service-account credentials remain server-side.
5. Tracking and invoice numbers are generated server-side.
6. The API never reports fake payment, label, delivery, or rate success.

## Required environment

- `FIREBASE_SERVICE_ACCOUNT_JSON` or a server runtime identity with Firebase Admin credentials.
- `API_PORT` (optional; defaults to `8787`).
- `VITE_API_BASE_URL` when API and frontend are deployed separately.
- Payment provider credentials before commercial checkout is enabled.
- Carrier/rating/label provider credentials before operational labels/rates are enabled.


## Payment flow

1. Authenticated customer creates a shipment with paymentStatus Pending.
2. The API creates a Stripe Checkout Session using the server-stored shipment amount.
3. The browser is redirected to Stripe; payment credentials never pass through the React application.
4. Stripe calls POST /api/payments/webhook.
5. The server verifies the Stripe signature before processing the event.
6. Only a verified successful Checkout event changes the shipment to paymentStatus Paid.
7. Payment reference and paid timestamp are persisted and audited.

Required server environment:
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET

Do not mark a shipment Paid from the client. Configure the Stripe webhook endpoint before enabling production checkout.

## Carrier job processing

Stripe payment webhooks only verify payment, persist the Paid state, and enqueue a durable `carrierJobs/{shipmentId}` record. They do not wait for FedEx shipment creation.

A protected worker endpoint processes queued jobs:

- `POST /api/internal/carrier-jobs/process`
- Header: `x-carrier-worker-secret: $CARRIER_WORKER_SECRET`
- Body: `{"limit":5}` (1–20)

Run this endpoint from a trusted scheduler/worker in production. Each job is transactionally claimed before FedEx creation, and the shipment retains its deterministic carrier transaction ID so retries do not intentionally create a second application shipment.

Required environment:
- `CARRIER_WORKER_SECRET`


## Supabase

The application uses Supabase Auth and PostgreSQL. Browser code receives only the publishable key; the service-role key is server-only. RLS is enabled on operational tables and the browser has no direct write access to shipments, payments, carrier jobs, audit logs, or idempotency records.

The complete initial schema, indexes, RLS policies, authentication profile trigger, and transactional RPCs are in `supabase/schema.sql`.

Critical multi-statement operations use PostgreSQL RPCs because Supabase client calls are individually transactional; application-level multi-query transactions are not assumed. The idempotent shipment creation and carrier claim paths therefore execute inside database functions.
