# FedEx Global Logistics — Enterprise Freight, Air Fleet & Operations Platform

[![Live App](https://img.shields.io/badge/Live%20App-Online-success?style=flat&logo=google-cloud)](https://ais-dev-7i7ieykzgxrced2yjxskjo-776938156199.europe-west2.run.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646cff?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-purple)]()

> 🌐 **Live Deployed Application**: [https://ais-dev-7i7ieykzgxrced2yjxskjo-776938156199.europe-west2.run.app](https://ais-dev-7i7ieykzgxrced2yjxskjo-776938156199.europe-west2.run.app)

A mission-critical enterprise web application simulating the global logistics infrastructure, widebody air cargo fleet, heavy ground handling equipment, automated superhubs, real-time shipment telemetry, and dispatch command operations of **FedEx Corporation**.

---

## 🌐 Live Application URL

Access the interactive live platform directly in your browser:
**[https://ais-dev-7i7ieykzgxrced2yjxskjo-776938156199.europe-west2.run.app](https://ais-dev-7i7ieykzgxrced2yjxskjo-776938156199.europe-west2.run.app)**

---

## Key Modules & Capabilities

### 1. Global Air Fleet & Heavy Equipment System (`/equipment`)
- **Widebody Air Cargo Fleet**: Interactive specifications, max gross takeoff weight (MTOW), intercontinental range, main deck pallet configurations, and active tail registry numbers for:
  - **Boeing 777F** (Memphis World SuperHub Flagship)
  - **McDonnell Douglas MD-11F** (Transpacific Heavy Freighter)
  - **Boeing 767-300F** (Transcontinental Medium Haul)
  - **Airbus A300-600F** (High-Density European Feeder)
  - **Cessna 408 SkyCourier** (Regional Feeder & Island Network)
- **High-Throughput Global Sorting SuperHubs**:
  - **Memphis World SuperHub (MEM)**: 450,000+ packages/hour peak throughput
  - **Indianapolis Air Hub (IND)**: Secondary US express hub
  - **Paris Charles de Gaulle (CDG)**: European express gateway
  - **Guangzhou Baiyun (CAN)**: Asia-Pacific logistics center
- **Heavy Ground Support Equipment (GSE)**:
  - FMC Commander 30i Main-Deck Container Loaders
  - TUG MA-50 High-Drawbar Tow Tractors
  - Goldhofer Electric Heavy Cargo Transporters
- **Last-Mile & Linehaul Vehicles**:
  - BrightDrop Zevo 600 Zero-Emission All-Electric Delivery Vans
  - Freightliner Custom MT55 Walk-in Step Vans
  - Volvo VNL 860 Sleeper Tandem-Axle Linehaul Tractors
  - Cryogenic Liquid Nitrogen Life Sciences Dry Shippers (-150°C)

### 2. Multi-Point Shipment Tracking & Telemetry (`/track`)
- **Real-Time Consignment Lookup**: Query by 11-digit airway tracking number (e.g., `NX839204715`, `NX839204716`, `NX839204717`).
- **Live Telemetry & Diagnostics**:
  - Ambient container temperature logging
  - Dual-axis tilt and shock detection
  - Barometric pressure and GPS waypoint progression
  - Flight altitude and ground speed telemetry
- **Dynamic Status Progression**: Timeline tracking with event locations, timestamps, and customs clearance checkpoints.

### 3. Dispatch Operations & Airway Bill Generator (`/ship`)
- **Commercial Airway Bill Generation**:
  - Sender and recipient international origin/destination address validation
  - Dimensional and gross weight calculation with volumetric tare
  - Dangerous goods & customs declaration documentation
  - Live 11-digit barcode generation and printable consignment summary receipt

### 4. B2B Rate & Volume Estimator (`/quote`)
- Interactive volumetric weight calculation (Length × Width × Height / 5,000 cm³/kg)
- Dynamic rate breakdown across FedEx service tiers:
  - **FedEx Express® (Priority Air)**
  - **FedEx Ground® (Regional Linehaul)**
  - **FedEx Freight® (Palletized LTL & Air Cargo)**
  - **FedEx Custom Critical® (Temperature-Controlled Life Sciences)**

### 5. Dispatch Command Console (`/admin`)
- Administrative control room to inspect consignments across worldwide gateways
- Update active statuses (`Created`, `Picked Up`, `In Transit`, `Out for Delivery`, `Delivered`, `Exception`)
- Assign localized delivery couriers and vehicles
- Flag statutory customs inspection holds and clearance releases
- Immutable chronological audit logging with facility tracking

### 6. Customer Operations Portal (`/dashboard`)
- Authenticated customer view with active shipments, historical delivery records, downloadable invoices, and dock pickup bookings.

### 7. AI Virtual Dispatch Assistant
- Interactive floating assistant capable of resolving shipment queries, providing customs compliance advice, and routing users to relevant services.

### 8. Google Chat Workspace Dispatch Integration (`/chat`)
- **Direct Workspace Connectivity**: Authenticates via Google Workspace OAuth with in-memory token lifecycle.
- **Spaces Exploration**: Browse, monitor, and create enterprise Google Chat rooms (e.g. Memphis SuperHub Ops, Transpacific Ramp Crew, Customs Rapid Response).
- **Logistics Alert Broadcast**: Dispatch pre-formatted airway bill telemetry, aircraft ramp assignments, and customs holds directly into team Google Chat channels.
- **Explicit Verification Dialogs**: Built with mandatory confirmation checks before executing any outbound communication.

### 9. Google Drive Cargo Documents & Waybill Archive (`/drive`)
- **Direct Drive v3 API Connectivity**: Synchronizes directly with Google Drive with in-memory OAuth tokens.
- **Instant Air Waybill Cloud Archive**: One-click generation of official standardized FedEx International Air Waybills (AWB) and Commercial Cargo Manifests saved directly to Google Drive.
- **Logistics Document Management**: Create logistics folders, search across folders, view file size and modified timestamps, and open files directly in Google Drive.
- **Mandatory User Confirmation Security**: Strict explicit verification modals with full payload review before executing any file upload, folder creation, or file deletion.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 8.x with HMR support |
| **Styling** | Tailwind CSS v4 with custom FedEx color palette (`#4D148C` FedEx Purple, `#FF6600` FedEx Orange) |
| **Icons** | Lucide React |
| **Animations** | Motion (Framer Motion v12) |
| **State Management** | Local reactive store with cross-tab and custom event synchronization |

---

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher (or Bun / pnpm)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/fedex-global-logistics.git

# Navigate into project directory
cd fedex-global-logistics

# Install dependencies
npm install
```

### Development Server

Run the development server on `http://localhost:3000`:

```bash
npm run dev
```

### Production Build

Create an optimized, minified production build in the `dist` directory:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Type Checking & Linting

Verify TypeScript types across the entire project:

```bash
npm run lint
```

---

## Project Structure

```
├── public/                 # Static assets and icons
├── src/
│   ├── components/
│   │   ├── common/         # Navbar, Footer, LiveChatModal, GlobalSearchModal, Logo
│   │   ├── equipment/      # Air fleet and ground equipment modals and cards
│   │   └── tracking/       # Tracking timeline, telemetry stats, barcode renderers
│   ├── data/
│   │   └── mockData.ts     # Enterprise fleet catalog, global hubs, initial shipments, GSE
│   ├── lib/
│   │   └── store.ts        # Reactive state store, persistence, audit logging
│   ├── pages/
│   │   ├── HomePage.tsx               # Primary hub landing page with fast track & fleet spotlight
│   │   ├── FleetEquipmentPage.tsx     # Comprehensive aircraft, hubs, GSE & vehicle catalog
│   │   ├── TrackingPage.tsx           # Telemetry tracking & consignment journey
│   │   ├── ShipNowPage.tsx            # Airway bill creation & barcode generator
│   │   ├── QuoteCalculatorPage.tsx    # Volumetric rate quoting engine
│   │   ├── ServicesPage.tsx           # FedEx service portfolio details
│   │   ├── LocationsPage.tsx          # Global service centers and hub directory
│   │   ├── BusinessSolutionsPage.tsx  # Enterprise supply chain solutions
│   │   ├── ResourcesGuidesPage.tsx    # Customs, packaging & dangerous goods manuals
│   │   ├── CustomerDashboardPage.tsx  # Client consignment portal
│   │   ├── AdminDashboardPage.tsx     # Operations command & dispatch center
│   │   ├── SupportCenterPage.tsx      # Support ticket desk & FAQ
│   │   └── AuthPages.tsx              # B2B & personal account authentication
│   ├── types.ts            # Global TypeScript definitions
│   ├── App.tsx             # Main router & layout shell
│   ├── main.tsx            # React application root
│   └── index.css           # Tailwind CSS imports & global styles
├── index.html              # HTML5 entry point with OpenGraph & Schema.org JSON-LD
├── metadata.json           # Application manifest
├── package.json            # Project dependencies and npm scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build pipeline
```

---

## Color System

- **FedEx Purple**: `#4D148C`
- **FedEx Express Orange**: `#FF6600`
- **Surface Dark**: `#1F0838` / `#130324`
- **Neutral Surface**: `#F8FAFC` (Slate 50)
- **High-Contrast Text**: `#0F172A` (Slate 900)

---

## Deployment

The application is structured as a standard Vite SPA and can be deployed directly to:
- **Cloud Run / Container Engine**: Serves `dist/` via static reverse proxy or Nginx.
- **Vercel / Netlify**: Configure root directory with build command `npm run build` and publish directory `dist`.
- **GitHub Pages**: Build the project and deploy via GitHub Actions.

---

## License

This project is created for educational and demonstration purposes. All trademark names, logos, and brands (FedEx, Boeing, Airbus, McDonnell Douglas, BrightDrop) are the property of their respective owners.
