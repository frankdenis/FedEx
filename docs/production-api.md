# Production Database & API Architecture

## Architecture

- Supabase Auth handles identity and client sessions.
- Express owns privileged business operations and validates requests.
- Supabase PostgreSQL is the operational database.
- React calls /api/*; service-role credentials never enter the browser.
- Stripe, FedEx, customs, notifications, and other provider integrations are server-side boundaries.

## PostgreSQL tables

- profiles — customer/admin profile and account state.
- shipments — shipment, parties, package, status, events, route and payment state.
- shipping_rates — active service/country rate configuration.
- carrier_jobs — durable carrier work queue.
- idempotency_keys — idempotent shipment-creation responses.
- stripe_events — processed Stripe webhook event IDs.
- audit_logs — operational audit records.

## API

- GET /api/health — service health.
- GET /api/me — authenticated profile.
- GET /api/shipments — customer-owned shipments or administrator shipment list.
- GET /api/shipments/:trackingNumber — sanitized public tracking lookup.
- POST /api/quotes — quote from configured production rates only.
- POST /api/shipments — authenticated shipment creation with server-generated identifiers.
- POST /api/payments/checkout — creates a Stripe Checkout Session from the server-stored shipment amount.
- POST /api/payments/webhook — verifies and processes Stripe events.
- POST /api/carrier/track — server-side FedEx tracking request.
- POST /api/admin/shipments/:shipmentId/carrier-sync — administrator carrier retry.
- POST /api/shipments/:trackingNumber/events — administrator status event.
- POST /api/internal/carrier-jobs/process — trusted worker endpoint.

## Security

1. Supabase Auth bearer tokens are verified server-side.
2. Customer shipment reads are scoped by the authenticated owner.
3. Administrative access requires profiles.role = admin.
4. The Supabase service-role key remains server-only.
5. Public tracking omits contact details, full addresses, payment information, internal references, and raw carrier event descriptions.
6. Stripe webhooks require a valid Stripe signature.
7. Shipment creation requires an Idempotency-Key.
8. Carrier work is claimed transactionally before the FedEx request.
9. Rate limiting and security headers are applied at the API boundary.

## Required environment

Client:
- VITE_SUPABASE_URL
- VITE_SUPABASE_PUBLISHABLE_KEY
- VITE_API_BASE_URL when frontend and API are deployed separately

Server:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- API_PORT
- APP_BASE_URL
- CORS_ORIGIN
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- FEDEX_API_KEY
- FEDEX_API_SECRET
- FEDEX_ACCOUNT_NUMBER
- FEDEX_BASE_URL
- FEDEX_SERVICE_EXPRESS
- FEDEX_SERVICE_PRIORITY
- FEDEX_SERVICE_STANDARD
- CARRIER_WORKER_SECRET

Do not commit credentials. Leave FedEx service mappings unset until they are verified for the production account and route requirements.

## Payment flow

1. An authenticated customer creates a shipment with payment pending.
2. The API creates a hosted Stripe Checkout Session using the server-stored shipment amount and an idempotent request key.
3. The Checkout Session includes a per-session `integration_identifier` for Stripe Dashboard flow identification.
4. The browser is redirected to Stripe.
5. Stripe calls POST /api/payments/webhook.
6. The server verifies the Stripe signature.
7. The webhook handles both completed and asynchronous-success events.
8. Only a verified paid Checkout Session changes the shipment to Paid.
9. The webhook handles both `checkout.session.completed` and `checkout.session.async_payment_succeeded`, and only fulfills sessions whose `payment_status` is `paid`.
8. Stripe event claims are atomic in Supabase, with a short processing lease so concurrent webhook deliveries cannot double-fulfill a shipment.
9. Failed webhook processing is marked retryable; the event is only marked processed after shipment payment state and carrier-job enqueue succeed.
10. Duplicate Stripe events do not create duplicate application shipments or duplicate carrier work.

## Carrier job processing

A trusted scheduler/worker calls POST /api/internal/carrier-jobs/process with x-carrier-worker-secret and a bounded limit of 1–20.

Each carrier job is claimed transactionally. The shipment retains a deterministic carrier transaction ID, and a short processing lease prevents concurrent application-level carrier creation.

Provider-specific idempotency must still be confirmed against the production FedEx account/API behavior; the application must not assume that a transaction ID alone guarantees provider-side idempotency.

## Supabase

The complete initial schema, indexes, RLS policies, authentication profile trigger, and transactional RPCs are in supabase/schema.sql.

The browser receives only the publishable key. The service-role key is server-only.
