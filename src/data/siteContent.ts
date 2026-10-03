import type { ServiceDetailInfo } from '../types';

export const LOGISTICS_IMAGES = {
  heroAircraft: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=2000&q=80', // Cargo Boeing 747 on tarmac
  cargoFreighter: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80', // Modern warehouse logistics rack
  heroOperator: 'https://images.unsplash.com/photo-1573496799515-eebbb63814f2?auto=format&fit=crop&w=2200&q=92', // Clear premium professional operator portrait
  deliveryVan: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1600&q=80', // Fleet delivery vehicle
  containerShip: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1600&q=80', // Port shipping container crane
  airportTarmac: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80', // Corporate logistics briefing
  distributionHub: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1600&q=80', // Automated parcel sorting line
  courierHandingPackage: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1600&q=80', // Professional courier handoff
  airCargoLoading: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=80', // Air cargo pallet loading
  supplyChainAnalytics: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80', // Analytics monitor
  customsInspection: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1600&q=80', // Modern border inspection logistics
};

export const SERVICES_CATALOG: ServiceDetailInfo[] = [
  {
    id: 'srv_express',
    slug: 'express',
    title: 'Express Shipping',
    tagline: 'Time-critical global parcel & document delivery with priority customs clearance.',
    heroImage: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=1600&q=80',
    icon: 'Zap',
    shortDescription: 'Fast international parcel delivery with end-to-end priority tracking and guaranteed transit windows.',
    overview: 'FedEx Express is engineered for urgent shipments requiring uncompromising reliability and speed. Leveraging dedicated aircraft capacity, expedited customs processing, and 24/7 priority monitoring, your consignments reach major financial and industrial capitals worldwide within 24 to 72 hours.',
    benefits: [
      'Guaranteed delivery windows (Next Flight Out, 10:30 AM, 12:00 PM, and End of Day)',
      'Direct customs clearance pre-manifesting while flight is airborne',
      'Continuous sensor telemetry for temperature, tilt, and shock monitoring',
      'Signature-guaranteed proof of delivery with instant digital receipt',
    ],
    process: [
      { step: 1, title: 'Instant Booking & Smart Label', desc: 'Generate high-speed digital manifests with automated HS code customs validation.' },
      { step: 2, title: 'Dedicated Fleet Courier Pickup', desc: 'On-demand dispatch of dedicated couriers straight to your facility dock.' },
      { step: 3, title: 'Priority Air Transit', desc: 'Loaded into primary cargo bays on scheduled express flights with minimum ground handling.' },
      { step: 4, title: 'Accelerated Final-Mile Handover', desc: 'Delivered directly into the hands of the verified recipient with digital signature.' },
    ],
    pricingOptions: [],
    faqs: [
      { q: 'What is the maximum weight for an Express package?', a: 'Individual packages can weigh up to 68 kg (150 lbs). Shipments exceeding this weight are automatically upgraded to FedEx Freight Priority.' },
      { q: 'How does customs pre-clearance work?', a: 'Our automated EDI engines send digital airway bills and commercial invoices to destination customs authorities while the aircraft is en route, clearing up to 88% of shipments prior to touchdown.' },
    ],
    relatedServices: ['international', 'customs', 'pickup'],
  },
  {
    id: 'srv_international',
    slug: 'international',
    title: 'International Shipping',
    tagline: 'Cross-border transportation connecting over 220 countries and territories.',
    heroImage: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1600&q=80',
    icon: 'Globe',
    shortDescription: 'Cross-border parcel and document transportation backed by deep regulatory expertise.',
    overview: 'Navigate international trade frictionlessly. FedEx International combines global airline agreements, bonded ocean freight, and regional transport networks to bridge continents with complete duty handling, harmonized tariff classifications, and localized delivery partners.',
    benefits: [
      'Comprehensive coverage spanning 220+ countries and autonomous territories',
      'In-house licensed customs brokers managing trade compliance in all major ports',
      'Delivered Duty Paid (DDP) and Delivered At Place (DAP) commercial flexibility',
      'Real-time multi-currency duty and tax estimations at checkout',
    ],
    process: [
      { step: 1, title: 'Trade Classification', desc: 'Identify proper Harmonized System (HS) codes and export regulations.' },
      { step: 2, title: 'Export Customs Handshake', desc: 'Clear source country export requirements seamlessly.' },
      { step: 3, title: 'Multi-Modal Long Haul', desc: 'Transfer via air freight or intermodal corridors with continuous telemetry.' },
      { step: 4, title: 'In-Country Localized Delivery', desc: 'Final mile fulfillment powered by FedEx regional centers and verified carriers.' },
    ],
    pricingOptions: [],
    faqs: [
      { q: 'Can FedEx calculate import duties in advance?', a: 'Yes, our shipping rate engine and API calculate landed costs including destination VAT, tariffs, and clearance fees.' },
      { q: 'What documentation is required for international parcels?', a: 'A Commercial Invoice (3 copies), standard airway bill, and certificate of origin if claiming preferential trade tariffs.' },
    ],
    relatedServices: ['customs', 'freight', 'express'],
  },
  {
    id: 'srv_domestic',
    slug: 'domestic',
    title: 'Domestic Shipping',
    tagline: 'High-density national ground & air networks for swift inland deliveries.',
    heroImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1600&q=80',
    icon: 'Truck',
    shortDescription: 'Reliable deliveries within supported countries and metropolitan regions.',
    overview: 'Our nationwide domestic logistics network connects distribution centers, retail fulfillment, and residential addresses with optimized route dispatching, day-definite schedules, and weekend delivery capabilities.',
    benefits: [
      'Extensive same-day and next-day coverage across metropolitan clusters',
      'Electric and low-emission urban delivery fleet reducing carbon footprint',
      'Flexible drop-off points and automated locker integration',
      'Real-time courier geolocation map with live 30-minute delivery countdowns',
    ],
    process: [
      { step: 1, title: 'Origin Hub Ingestion', desc: 'High-speed automated barcode induction and dimension scanning.' },
      { step: 2, title: 'Trunk Line Movement', desc: 'Nightly line-haul transport between national sortation centers.' },
      { step: 3, title: 'Final Mile Sequencing', desc: 'Dynamic AI route optimization assigning parcels into courier delivery vans.' },
      { step: 4, title: 'Doorstep Verification', desc: 'Contactless delivery with photo verification and timestamped GPS coordinates.' },
    ],
    pricingOptions: [],
    faqs: [
      { q: 'Are Saturday deliveries included?', a: 'Yes, residential deliveries operate on Saturdays across all tier 1 and tier 2 cities without additional surcharges.' },
    ],
    relatedServices: ['pickup', 'ecommerce', 'returns'],
  },
  {
    id: 'srv_freight',
    slug: 'freight',
    title: 'Freight & Cargo Transportation',
    tagline: 'Large-scale commercial cargo solutions across air, ocean, and heavy road freight.',
    heroImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80',
    icon: 'Boxes',
    shortDescription: 'Large-scale commercial cargo transportation for pallets, containers, and oversized industrial goods.',
    overview: 'From chartered full-plane payloads to Less-Than-Truckload (LTL) and Full-Container-Load (FCL) sea freight, FedEx Freight provides industrial manufacturers, retailers, and infrastructure builders with robust supply chain velocity.',
    benefits: [
      'Charter air cargo capabilities for urgent bulk shipments up to 100 tonnes',
      'FCL and LTL consolidations through major world ports',
      'Temperature-controlled reefers and hazardous materials certified transport',
      'Dedicated logistics engineers customizing load plans and intermodal routing',
    ],
    process: [
      { step: 1, title: 'Cargo Assessment & Plan', desc: 'Analyze pallet configurations, weight distribution, and cargo specifications.' },
      { step: 2, title: 'Intermodal Booking', desc: 'Secure air/ocean container space with bonded drayage support.' },
      { step: 3, title: 'Port / Terminal Transfer', desc: 'Manage heavy crane offloading, stevedoring, and transit documentation.' },
      { step: 4, title: 'Destination Yard Delivery', desc: 'Liftgate equipped tractor delivery direct to factory floor or warehouse bay.' },
    ],
    pricingOptions: [],
    faqs: [
      { q: 'What is the minimum weight for freight booking?', a: 'Freight services commence at 68 kg (150 lbs) or single/multi-pallet shipments.' },
    ],
    relatedServices: ['warehousing', 'customs', 'international'],
  },
  {
    id: 'srv_ecommerce',
    slug: 'ecommerce',
    title: 'E-Commerce Logistics',
    tagline: 'End-to-end fulfillment, automated APIs, and customer checkout integrations.',
    heroImage: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1600&q=80',
    icon: 'ShoppingBag',
    shortDescription: 'Shipping infrastructure for modern online businesses, marketplaces, and global DTC brands.',
    overview: 'Scale your digital storefront without logistics friction. FedEx E-Commerce plugs directly into Shopify, WooCommerce, Magento, and custom ERP systems with plug-and-play APIs, automated label printing, and branded customer tracking portals.',
    benefits: [
      'Direct API integrations with automated shipping label generation',
      'White-label branded tracking pages boosting secondary marketing revenue',
      'Pre-negotiated volume discount tiers for high-velocity merchants',
      'Automated address validation reducing returned packages by 94%',
    ],
    process: [
      { step: 1, title: 'Storefront Integration', desc: 'Connect your merchant platform via REST API or one-click marketplace plugins.' },
      { step: 2, title: 'Automated Order Sync', desc: 'Orders ingest automatically, triggering smart rate-shopping and label generation.' },
      { step: 3, title: 'Warehouse Pick & Pack', desc: 'Scan-verified packing ensuring 99.98% fulfillment accuracy.' },
      { step: 4, title: 'Customer Delivery Alerts', desc: 'Branded email and SMS tracking links keeping your buyers informed.' },
    ],
    pricingOptions: [],
    faqs: [
      { q: 'Do you offer Shopify and WooCommerce plugins?', a: 'Yes, our ready-made plugins configure in under 5 minutes with automatic tracking number write-back.' },
    ],
    relatedServices: ['returns', 'warehousing', 'domestic'],
  },
  {
    id: 'srv_returns',
    slug: 'returns',
    title: 'Returns & Reverse Logistics',
    tagline: 'Frictionless return label generation, inspection, and inventory restock.',
    heroImage: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1600&q=80',
    icon: 'RotateCcw',
    shortDescription: 'Simplified return shipment management for e-commerce customers and business supply chains.',
    overview: 'Turn return friction into brand loyalty. FedEx Returns provides self-service return portals, printer-less QR code drop-offs, condition grading, and rapid inventory reintegration for retailers worldwide.',
    benefits: [
      'Self-service digital return portal for end customers',
      'QR code mobile drop-off at over 45,000 retail partner locations',
      'Automated return condition inspection and photo reporting',
      'Cross-border return consolidation lowering return transit expenses',
    ],
    process: [
      { step: 1, title: 'Customer Initiates Return', desc: 'Buyer selects return reason in your branded portal and receives a digital QR code.' },
      { step: 2, title: 'Convenient Drop-Off', desc: 'Customer presents QR code at any FedEx drop-off point or schedules a home pickup.' },
      { step: 3, title: 'Grading & Inspection', desc: 'Consignments pass through intake inspection stations for item verification.' },
      { step: 4, title: 'Restock or Disposition', desc: 'Rapid return to inventory, refurbishment center, or regional warehouse.' },
    ],
    pricingOptions: [],
    faqs: [
      { q: 'Can customers return items without a home printer?', a: 'Yes, our paperless QR code system allows customers to present their phone at any service point for instant label printing.' },
    ],
    relatedServices: ['ecommerce', 'warehousing', 'domestic'],
  },
  {
    id: 'srv_customs',
    slug: 'customs',
    title: 'Customs & Trade Compliance',
    tagline: 'Expert global brokerage, harmonized tariffs, and automated cross-border clearances.',
    heroImage: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1600&q=80',
    icon: 'ShieldCheck',
    shortDescription: 'Essential tools, brokerage support, and compliance frameworks for global cross-border trade.',
    overview: 'Prevent costly border holds and compliance fines. FedEx Trade Networks & Customs integrates in-house licensed customs brokers with real-time tariff databases, ensuring your commercial documentation satisfies regional import mandates across 220+ jurisdictions.',
    benefits: [
      'Licensed in-house customs brokers operating in all major trade corridors',
      'Automated HS code classification and duty rate calculation',
      'Bonded warehouse transit and temporary import carnet support',
      'Electronic advance filing (AMS, ICS2, ACE, and Single Window systems)',
    ],
    process: [
      { step: 1, title: 'Document Verification', desc: 'Audit invoices, packing lists, and export licenses for compliance accuracy.' },
      { step: 2, title: 'Electronic Advance Filing', desc: 'Submit customs entries electronically ahead of vehicle or aircraft arrival.' },
      { step: 3, title: 'Duty & Tax Disbursement', desc: 'Settle governmental fees via automated broker accounts for instant release.' },
      { step: 4, title: 'Border Release Notice', desc: 'Transmit release milestone instantly to tracking timeline and customer portal.' },
    ],
    pricingOptions: [],
    faqs: [
      { q: 'What causes customs delays most frequently?', a: 'Vague cargo descriptions, missing commercial invoices, and incorrect Harmonized System (HS) codes represent over 90% of border delays.' },
    ],
    relatedServices: ['international', 'freight', 'express'],
  },
  {
    id: 'srv_warehousing',
    slug: 'warehousing',
    title: 'Warehousing & Smart Storage',
    tagline: 'Strategic inventory staging, climate-controlled storage, and micro-fulfillment.',
    heroImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80',
    icon: 'Warehouse',
    shortDescription: 'Strategically positioned international storage and distribution hubs for commercial supply chains.',
    overview: 'Position inventory closer to your global demand centers. FedEx Supply Chain Warehousing offers high-bay pallet storage, temperature-regulated facilities, automated pick-pack systems, and real-time inventory visibility across North America, Europe, Asia, Africa, and Latin America.',
    benefits: [
      'Over 4.5 million square meters of secured, bonded warehouse capacity globally',
      'Real-time Warehouse Management System (WMS) integration with API telemetry',
      'Climate-controlled zones for pharmaceuticals, electronics, and luxury goods',
      'Pick, pack, kitting, and custom subscription packaging services',
    ],
    process: [
      { step: 1, title: 'Inbound Pallet Induction', desc: 'Dock receipt, QA inspection, and automated RF barcode slotting.' },
      { step: 2, title: 'Secure Systematic Storage', desc: 'Multi-tier racking with 24/7 CCTV, fire suppression, and temperature logs.' },
      { step: 3, title: 'Automated Pick & Pack', desc: 'Order ingestion directly triggers robotic or optimized pick sequences.' },
      { step: 4, title: 'Outbound Cross-Dock', desc: 'Immediate handoff to scheduled express line-hauls and regional distribution.' },
    ],
    pricingOptions: [],
    faqs: [
      { q: 'Can I view my real-time inventory online?', a: 'Yes, our customer and B2B portals feature live stock visibility with automated reorder threshold alerts.' },
    ],
    relatedServices: ['ecommerce', 'freight', 'returns'],
  },
  {
    id: 'srv_pickup',
    slug: 'pickup',
    title: 'Pickup & Collection Services',
    tagline: 'Convenient doorstep and commercial dock package collection on your schedule.',
    heroImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1600&q=80',
    icon: 'PackageCheck',
    shortDescription: 'Schedule convenient package collection directly from your home, office, or manufacturing facility.',
    overview: 'Never leave your office to send a package. FedEx Pickup allows businesses and individuals to request single or recurring courier collections with selectable pickup windows, driver ETA tracking, and digital receipt issuance right at your doorstep.',
    benefits: [
      'Same-day pickup requests available up to 3:00 PM local time',
      'Recurring daily or weekly commercial scheduled pickups for businesses',
      'Driver arrives equipped with electronic scales, scanners, and label printers',
      'Instant digital pickup receipt sent immediately to sender email',
    ],
    process: [
      { step: 1, title: 'Request Pickup Online', desc: 'Specify address, estimated parcel count, total weight, and ready time.' },
      { step: 2, title: 'Driver Route Assignment', desc: 'Local courier assigned with real-time ETA notification.' },
      { step: 3, title: 'Doorstep Collection', desc: 'Driver scans packages and inspects packaging integrity on site.' },
      { step: 4, title: 'Immediate Induction', desc: 'Shipment immediately begins its transit without waiting in retail queues.' },
    ],
    pricingOptions: [],
    faqs: [
      { q: 'How late can I schedule a same-day pickup?', a: 'Same-day pickup requests can be placed up to 2 hours before your specified closing time or 3:30 PM local time.' },
    ],
    relatedServices: ['express', 'domestic', 'ecommerce'],
  },
];
