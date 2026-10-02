# FedEx Global Logistics Web Platform

A React + TypeScript logistics web application for shipment tracking, shipping workflows, customer operations, fleet information, support, and authenticated administration.

## Production-cleanup status

This branch removes the previous demo-runtime architecture. Transactional users, shipments, invoices, pickups, tickets, notifications, rates, facilities, and audit records are **not seeded into the browser** and are not treated as authoritative client-side data.

### Removed from the runtime

- Seeded customer/admin accounts and one-click portal access
- Sample shipment and invoice records
- Demo pickup records
- Hard-coded customer identities
- Client-side operational-cache reset/synchronization
- Simulated shipment status progression
- Simulated payment and shipment creation
- Simulated invoice/PDF/label downloads
- localStorage as the operational datastore
- Fake password-reset and registration flows

### Authentication

Authentication now uses Firebase Authentication for real email/password account creation, sign-in, persistent sessions, and password-reset email requests.

Administrative access is based on a Firebase admin custom claim. The client does not grant administrator privileges through a hard-coded account or shortcut.

## Production database/API foundation

A server-side Express API and Firebase Admin integration now provide the first production data boundary:

- Firebase Authentication verifies ID tokens server-side.
- Cloud Firestore stores operational records.
- Customer shipment reads are scoped to the authenticated owner.
- Administrator shipment mutations require the `admin=true` Firebase custom claim.
- Tracking and invoice identifiers are generated server-side.
- Rate quotes are read from active production rate records; missing configuration returns an explicit error.
- Public tracking responses are sanitized and do not expose sender/recipient contact data.
- Firestore client rules deny direct browser access; operational data is accessed through the API.
- Payment, carrier rating/label generation, customs, notifications, and webhooks remain explicit integration boundaries and are not faked.

See `docs/production-api.md` for the database collections, API surface, security model, and required environment variables.

## Responsive UX

The application is structured for:

- Mobile phones
- Tablets
- Desktop and large displays
- Touch-friendly controls
- Horizontal scrolling for wide operational tables
- Mobile-safe form sizing
- Responsive modal/dialog behavior
- Full-width layouts without forced desktop-mode rendering

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Firebase Authentication
- Lucide React
- Motion

## Development

```bash
npm install
npm run dev
```

Run the API separately during development:

```bash
npm run api
```

Or run frontend and API together:

```bash
npm run dev:full
```

Production build:

```bash
npm run build
```

Type check:

```bash
npm run lint
```

## Environment

Firebase client configuration is supplied through the existing Firebase app configuration used by the project. Enable the required Firebase Authentication providers in the Firebase console before accepting production sign-ups.

The AI assistant still requires its configured Gemini runtime secret.

## Repository workflow

Production cleanup work is being developed on the production-cleanup-responsive branch so the existing main branch remains unchanged until the changes are reviewed.

## Trademark notice

FedEx, FedEx Express, and related marks are trademarks of Federal Express Corporation and its affiliates. This repository should only be used in accordance with the applicable rights, permissions, and branding requirements.
