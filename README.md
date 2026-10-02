# FedEx Global Logistics Web Platform

A React + TypeScript logistics web application for shipment tracking, shipping workflows, customer operations, fleet information, support, and authenticated administration.

## Production status

The repository has been cleaned of the former demo-runtime architecture. Browser-local mock operational data, seeded accounts, simulated payments, simulated shipment creation, fake labels/invoices, and localStorage operational persistence have been removed.

The current production foundation uses:
- Supabase Auth for identity
- Supabase PostgreSQL with Row Level Security
- Express for privileged server operations
- Stripe Checkout and signed webhooks
- Official FedEx REST APIs
- Durable carrier jobs with idempotent shipment creation
- Motion-based responsive React UI

The application is not considered production-live until a dedicated FedEx Supabase project, production payment/carrier credentials, rate configuration, worker scheduler, and deployment environment are configured and verified.

## Authentication

Authentication uses Supabase Auth for real account creation, sign-in, persistent sessions, and password-reset requests.

Administrative access is determined server-side from the user's Supabase profile role. The client cannot grant itself administrator privileges.

## Production database/API

The Express API and Supabase integration provide the production data boundary. Customer shipment reads are scoped to the authenticated owner, administrative operations require the admin profile role, quotes come only from configured production rate records, and public tracking responses are sanitized.

See docs/production-api.md and supabase/schema.sql for the architecture and database definition.

## Responsive UX

The application supports mobile phones, tablets, desktop displays, touch-friendly controls, responsive forms and dialogs, wide operational tables, and motion-based page/navigation/carousel transitions.

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Motion
- Lucide React
- Express
- Supabase Auth + PostgreSQL
- Stripe
- Official FedEx REST APIs

## Development

npm install
npm run dev

Run the API separately with npm run api, or run frontend and API together with npm run dev:full.

Production frontend build: npm run build
Type check: npm run lint

## Environment

Client configuration uses the Supabase URL and publishable key.

Server-only configuration includes the Supabase service-role key, Stripe secrets, FedEx credentials, application URL/CORS origin, and carrier-worker secret.

Do not commit credentials to the repository.

## Carrier reliability

Successful Stripe payment does not directly call FedEx from the browser. The verified webhook persists payment and queues a carrier job.

A trusted worker calls POST /api/internal/carrier-jobs/process with the configured carrier-worker secret. Jobs are claimed transactionally and use a deterministic FedEx transaction identifier. Provider-side idempotency must still be verified against the production FedEx account before live shipment creation.

## Repository workflow

The default branch is main. Production hardening is reviewed through pull requests before merge.

## Trademark notice

FedEx, FedEx Express, and related marks are trademarks of Federal Express Corporation and its affiliates. This repository should only be used in accordance with applicable rights, permissions, and branding requirements.
