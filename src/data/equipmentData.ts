export interface LogisticsEquipment {
  id: string;
  name: string;
  category: 'air' | 'ground' | 'hub' | 'specialized';
  categoryLabel: string;
  tagline: string;
  imageUrl: string;
  secondaryImageUrl?: string;
  specs: {
    label: string;
    value: string;
  }[];
  description: string;
  operationalRole: string;
  keyFeatures: string[];
  activeFleetCount?: string;
  deploymentHubs?: string[];
  status: 'In Active Service' | 'Expanding Fleet' | '24/7 Global Ops';
}

export const FEDEX_EQUIPMENT_FLEET: LogisticsEquipment[] = [
  // AIR FLEET
  {
    id: 'eq-b777f',
    name: 'Boeing 777F Intercontinental Long-Haul Freighter',
    category: 'air',
    categoryLabel: 'Intercontinental Air Cargo',
    tagline: 'The flagship twin-engine heavy cargo lifter connecting continents non-stop.',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=85',
    secondaryImageUrl: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=1600&q=85',
    specs: [
      { label: 'Max Payload', value: '102,010 kg (224,900 lbs)' },
      { label: 'Maximum Range', value: '9,200 km (4,970 nm)' },
      { label: 'Cruise Speed', value: 'Mach 0.84 (905 km/h)' },
      { label: 'Main Deck Cargo', value: '27 Standard 96x125 in Pallets' },
      { label: 'Lower Deck', value: '10 Pallets + Bulk Cargo' },
      { label: 'Powerplant', value: '2x GE90-110B High-Bypass Turbofans' },
    ],
    description:
      'The Boeing 777 Freighter provides unprecedented range and volumetric capacity for intercontinental overnight transit. Capable of flying non-stop from Memphis to Hong Kong or Paris to Tokyo with full cargo payload, it serves as the backbone of high-priority international express.',
    operationalRole: 'Primary intercontinental trunk routes linking Asia-Pacific, North America, and Europe hubs.',
    keyFeatures: [
      'Advanced fly-by-wire flight control architecture',
      'Ultra-precise main-deck climate control for biopharma shipments',
      '18% lower fuel consumption per ton compared to legacy tri-jets',
      'Class-leading environmental noise reduction footprint',
    ],
    activeFleetCount: '58 Aircraft in Global Service',
    deploymentHubs: ['Memphis World Hub (KMEM)', 'Paris Charles de Gaulle (CDG)', 'Hong Kong Gateway (HKG)', 'Dubai International (DXB)'],
    status: '24/7 Global Ops',
  },
  {
    id: 'eq-b767f',
    name: 'Boeing 767-300F Regional & Continental Express',
    category: 'air',
    categoryLabel: 'Continental Air Express',
    tagline: 'High-frequency workhorse powering overnight next-day domestic and regional networks.',
    imageUrl: 'https://images.unsplash.com/photo-1519074069444-1ba4ea16e632?auto=format&fit=crop&w=1600&q=85',
    specs: [
      { label: 'Max Payload', value: '52,700 kg (116,200 lbs)' },
      { label: 'Flight Range', value: '6,025 km (3,255 nm)' },
      { label: 'Cargo Volume', value: '438 m³ (15,469 ft³)' },
      { label: 'Main Deck Positions', value: '24 ULD Containers' },
      { label: 'Turnaround Time', value: '55 Minutes on Tarmac' },
    ],
    description:
      'Engineered for rapid turnarounds and exceptional dispatch reliability, the Boeing 767-300F links secondary airport gateways directly to major sortation super-hubs every single night, ensuring 10:30 AM delivery commitments across the continent.',
    operationalRole: 'High-density overnight point-to-point routes and hub feeder flights.',
    keyFeatures: [
      'Automated cargo loading system (CLS) with hydraulic floor locks',
      'Optimized short-field performance for secondary regional hubs',
      'Full glass cockpit modern avionics and head-up display guidance',
    ],
    activeFleetCount: '130+ Aircraft in Dedicated Service',
    deploymentHubs: ['Indianapolis Hub (IND)', 'Guangzhou Hub (CAN)', 'Cologne Bonn (CGN)', 'Dallas Fort Worth (DFW)'],
    status: 'In Active Service',
  },
  {
    id: 'eq-md11f',
    name: 'McDonnell Douglas MD-11F Heavy Tri-Jet Cargo',
    category: 'air',
    categoryLabel: 'Heavy Cargo Lifter',
    tagline: 'Legendary tri-jet heavy lifter built for ultra-heavy volumetric cargo loads.',
    imageUrl: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1600&q=85',
    specs: [
      { label: 'Max Payload', value: '90,700 kg (200,000 lbs)' },
      { label: 'Max Range', value: '6,725 km (3,630 nm)' },
      { label: 'Engines', value: '3x GE CF6-80C2 High-Thrust Turbofans' },
      { label: 'Cargo Positions', value: '26 Main Deck + 32 Lower Deck' },
    ],
    description:
      'The MD-11F offers an unmatched combination of payload capacity and cabin diameter, making it ideal for outsized machinery, aerospace turbines, high-volume seasonal parcel surges, and emergency relief deployments.',
    operationalRole: 'High-capacity transpacific freight and heavy industrial express.',
    keyFeatures: [
      'Outsized main-deck side cargo door (140 x 102 inches)',
      'Heavy floor loading capacity of up to 4,200 kg per pallet station',
      'Independent auxiliary power unit (APU) for self-sufficient remote operations',
    ],
    activeFleetCount: '35 Heavy Aircraft',
    deploymentHubs: ['Memphis SuperHub', 'Oakland Air Hub (OAK)', 'Anchorage Gateway (ANC)'],
    status: 'In Active Service',
  },
  {
    id: 'eq-cessna408',
    name: 'Cessna 408 SkyCourier Twin-Turboprop Feeder',
    category: 'air',
    categoryLabel: 'Feeder Air Network',
    tagline: 'Next-generation clean-sheet twin-engine feeder cargo aircraft designed specifically for express.',
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1600&q=85',
    specs: [
      { label: 'Payload Capacity', value: '2,722 kg (6,000 lbs)' },
      { label: 'Range', value: '1,667 km (900 nm)' },
      { label: 'Cargo Capacity', value: 'Up to 3 LD3 Containers' },
      { label: 'Engines', value: '2x Pratt & Whitney PT6A-65SC' },
    ],
    description:
      'Designed in close collaboration with express logistics operators, the SkyCourier features a large 87 x 69 inch cargo door and a flat floor capable of loading pre-packed LD3 shipping containers directly from regional airports without break-bulk handling.',
    operationalRole: 'Fast regional feeder flights connecting remote communities to main sort hubs.',
    keyFeatures: [
      'Direct containerized loading with built-in roller floor',
      'Rugged landing gear for unimproved airstrips',
      'Garmin G1000 NXi integrated glass flight deck',
    ],
    activeFleetCount: '50+ Delivered & Deploying',
    deploymentHubs: ['North American Feeder Network', 'Central America Routes'],
    status: 'Expanding Fleet',
  },

  // GROUND & EV FLEET
  {
    id: 'eq-zevo600',
    name: 'BrightDrop Zevo 600 All-Electric Courier Van',
    category: 'ground',
    categoryLabel: 'Zero-Emission Electric Fleet',
    tagline: 'Cutting-edge electric delivery platform transforming urban courier logistics.',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1600&q=85',
    specs: [
      { label: 'Driving Range', value: '400 km (250 miles) on Single Charge' },
      { label: 'Cargo Volume', value: '17.0 m³ (600+ cubic feet)' },
      { label: 'Payload Capacity', value: '1,000 kg (2,200 lbs)' },
      { label: 'Platform', value: 'Ultium EV Battery Architecture' },
      { label: 'Charging Speed', value: 'DC Fast Charge up to 160 miles/hour' },
    ],
    description:
      'The Zevo 600 sets a new benchmark in urban parcel distribution. Purpose-built for courier ergonomics, it features low-step height, walk-through cab partition, automated cargo shelving, and continuous cellular cloud telemetry for route-based regenerative power.',
    operationalRole: 'Metropolitan zero-emission last-mile parcel and envelope delivery.',
    keyFeatures: [
      'Advanced driver safety suite with 360-degree radar and bird-eye cameras',
      'Automated keyless cabin access and cargo door proximity unlock',
      'Intelligent dynamic routing with live battery predictive telemetry',
      'Zero tailpipe emissions supporting net-zero sustainability commitments',
    ],
    activeFleetCount: '2,500+ Electric Units Deployed Worldwide',
    deploymentHubs: ['New York Metro', 'London Clean Air Zone', 'Los Angeles Basin', 'Toronto Urban'],
    status: 'Expanding Fleet',
  },
  {
    id: 'eq-kenworth-t680',
    name: 'Kenworth T680 / Freightliner Cascadia Heavy Freight Semi',
    category: 'ground',
    categoryLabel: 'Interstate Freight Hauler',
    tagline: 'Class-8 aerodynamic heavy highway tractor hauling twin 53ft intermodal freight.',
    imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=85',
    specs: [
      { label: 'Gross Combined Weight', value: '36,287 kg (80,000 lbs)' },
      { label: 'Engine', value: 'Cummins X15 Clean-Diesel / Hydrogen Hybrid' },
      { label: 'Horsepower', value: '500 HP / 1,850 lb-ft Torque' },
      { label: 'Trailer Setup', value: 'Twin 28ft "Pups" or 53ft Intermodal Dry Van' },
      { label: 'Aerodynamic Efficiency', value: 'Full Side Fairings & Active Aero Roof' },
    ],
    description:
      'The workhorse of FedEx Freight and ground hub transfers. Running non-stop between regional sorting distribution centers, these long-haul power units transport hundreds of thousands of palletized commercial orders through day and night schedules.',
    operationalRole: 'Long-distance highway freight line-haul and hub-to-hub trunk movements.',
    keyFeatures: [
      'Predictive cruise control using 3D terrain topography mapping',
      'Collision mitigation radar and automatic lane departure steering',
      'Real-time trailer axle weight sensors preventing overload',
      'Dual-sleeper luxury cab for long-haul relay safety teams',
    ],
    activeFleetCount: '30,000+ Tractors Across Continental Networks',
    deploymentHubs: ['Chicago Freight Hub', 'Atlanta Logistics Center', 'Dallas Terminal', 'Harrisburg Hub'],
    status: '24/7 Global Ops',
  },
  {
    id: 'eq-autonomous-yard',
    name: 'Autonomous Electric Terminal Yard Tractor (Hostler)',
    category: 'ground',
    categoryLabel: 'Autonomous Terminal Equipment',
    tagline: 'Self-driving yard tractor automating trailer moves in high-density logistics hubs.',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=85',
    specs: [
      { label: 'Autonomy Level', value: 'SAE Level 4 Geofenced Yard Automation' },
      { label: 'Sensor Suite', value: '32-beam LiDAR, 8 High-Res Cameras, Ultrasonic' },
      { label: 'Fifth Wheel Capacity', value: '36,000 kg (79,000 lbs)' },
      { label: 'Battery Capacity', value: '180 kWh Rapid Inductive Swap' },
    ],
    description:
      'Operating inside the secure perimeter of mega-hubs, these autonomous electric hostlers automatically couple with 53ft freight trailers, reversing them into dock doors with millimeter accuracy based on computerized yard management algorithms.',
    operationalRole: 'Automating high-frequency trailer shunting between staging bays and sorting docks.',
    keyFeatures: [
      'Continuous 24/7 shunting without driver fatigue or shift lag',
      'Automatic fifth-wheel kingpin coupling and air brake line connection',
      'Zero yard collisions with ultra-sensitive obstacle avoidance',
    ],
    activeFleetCount: '150+ Deployed in Priority SuperHubs',
    deploymentHubs: ['Memphis SuperHub', 'Indianapolis Gateway', 'Fort Worth Hub'],
    status: 'In Active Service',
  },

  // MEGA-HUB SORTATION & ROBOTICS
  {
    id: 'eq-memphis-superhub',
    name: 'Memphis World SuperHub Sorting Matrix',
    category: 'hub',
    categoryLabel: 'SuperHub Infrastructure',
    tagline: 'The nerve center of global commerce, processing up to 500,000 parcels per hour.',
    imageUrl: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1600&q=85',
    specs: [
      { label: 'Peak Hourly Capacity', value: '500,000+ Packages & Documents' },
      { label: 'Conveyor Length', value: '42 Miles (68 km) of Automated Belts' },
      { label: 'Facility Footprint', value: '862 Acres (Over 400 Aircraft Gates)' },
      { label: 'Optical Scanning', value: '6-Sided 3D Laser Dimensioning Tunnels' },
      { label: 'Nightly Flight Ops', value: '150+ Heavy Jet Arrivals & Departures' },
    ],
    description:
      'Spanning over 862 acres at Memphis International Airport, the World SuperHub is the world’s premier air cargo sortation complex. Between 11:00 PM and 4:00 AM every night, an armada of cargo aircraft land, unload millions of parcels, sort them across 42 miles of automated cross-belt sorters, and reload onto outward flights in minutes.',
    operationalRole: 'Central global sortation node for North American and worldwide express cargo.',
    keyFeatures: [
      'High-speed tilt-tray and cross-belt matrix sorting with 99.98% routing accuracy',
      'Direct aircraft nose-in loading bays with automated container tug tracks',
      'Integrated US Customs & Border Protection international clearance facility',
      'Sub-second computerized barcode re-routing around belt congestion',
    ],
    activeFleetCount: '1 Flagship SuperHub + 14 Global Regional Hubs',
    deploymentHubs: ['Memphis International Airport (KMEM)'],
    status: '24/7 Global Ops',
  },
  {
    id: 'eq-robotic-inductor',
    name: 'AI Robotic Singulator & Pallet Inductor Arms',
    category: 'hub',
    categoryLabel: 'Advanced Robotics',
    tagline: 'Computer-vision-guided robotic arms singulating mixed packages at superhuman speeds.',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=85',
    specs: [
      { label: 'Picks Per Hour', value: '1,400+ Units per Arm' },
      { label: 'Vision System', value: 'RGB-D 3D Spatial Neural Vision' },
      { label: 'Payload Gripper', value: 'Adaptive Vacuum & Mechanical Smart Suction' },
      { label: 'Payload Range', value: '0.1 kg to 25 kg Mixed Packaging' },
    ],
    description:
      'These automated robotic arms use deep-learning vision models to identify envelopes, irregular boxes, and polybags stacked randomly in containers. The robot calculates optimal grasp points in milliseconds, placing each package squarely onto the high-speed sorting belt with barcode facing upward.',
    operationalRole: 'Unloading bulk cargo containers and feeding automated sorters.',
    keyFeatures: [
      'Adaptive AI grasping handling crushed, flexible, or slippery materials',
      'Self-learning trajectory algorithms minimizing transit cycle time',
      '24/7 non-stop parcel induction reducing human strain during midnight surges',
    ],
    activeFleetCount: '320+ Robotic Workcells Worldwide',
    deploymentHubs: ['Memphis SuperHub', 'Paris CDG Hub', 'Shanghai Gateway'],
    status: 'Expanding Fleet',
  },
  {
    id: 'eq-uld-loader',
    name: 'Hydraulic Main-Deck ULD Container High-Loader',
    category: 'hub',
    categoryLabel: 'Air Cargo Ground Equipment',
    tagline: 'Heavy-duty hydraulic scissor elevator loading 14-ton cargo containers into aircraft cabins.',
    imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=85',
    specs: [
      { label: 'Lifting Capacity', value: '14,000 kg (30,800 lbs)' },
      { label: 'Lift Height', value: '5.6 meters (18.4 feet) to Main Deck' },
      { label: 'Roller Speed', value: '0.3 meters/second Powered Cargo Roller' },
      { label: 'Engine', value: 'Electric/Hydraulic Zero-Emission Powertrain' },
    ],
    description:
      'Critical ground support equipment that positions right against the main-deck cargo door of wide-body aircraft like the Boeing 777F. Powered motorized omnidirectional rollers slide giant aluminum ULD pallets from airport dollies into the aircraft interior in under 60 seconds.',
    operationalRole: 'Direct tarmac loading and unloading of wide-body intercontinental freighters.',
    keyFeatures: [
      'Automatic aircraft fuselage proximity laser guidance preventing contact damage',
      'Multi-directional powered cargo roller bed for smooth container translation',
      'Stabilizing hydraulic outriggers withstanding 60 knot tarmac winds',
    ],
    activeFleetCount: '850+ Units Operating Worldwide',
    deploymentHubs: ['All Global Gateway Airports'],
    status: 'In Active Service',
  },

  // SPECIALIZED & COLD CHAIN
  {
    id: 'eq-cryo-shipper',
    name: 'Deep Frozen Liquid Nitrogen Cryogenic Shipper',
    category: 'specialized',
    categoryLabel: 'Cold-Chain Biopharma',
    tagline: 'Maintains -150°C dry vapor cryogenic temperatures for up to 10 days without dry ice.',
    imageUrl: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1600&q=85',
    specs: [
      { label: 'Holding Temperature', value: '-150°C (-238°F) or Colder' },
      { label: 'Holding Duration', value: 'Up to 10 Days Static Hold Time' },
      { label: 'Cryogen Type', value: 'Liquid Nitrogen Absorbed in Dry Vapor Foam' },
      { label: 'Regulatory Class', value: 'IATA Dangerous Goods Non-Restricted Dry Shipper' },
      { label: 'Telemetry Sensor', value: 'Built-in SenseAware ID Cryo-Probe' },
    ],
    description:
      'Engineered for life-saving CAR-T cell therapies, stem cells, genetically engineered medicines, and rare medical biologicals. The vacuum-insulated stainless vessel absorbs liquid nitrogen into a hydrophobic matrix so no free liquid can spill even if turned upside down in transit.',
    operationalRole: 'Transporting urgent clinical oncology therapies and biological specimens.',
    keyFeatures: [
      'Certified non-hazardous dry vapor technology safe on passenger & cargo aircraft',
      'Continuous temperature data logging with instant cryptographic audit certificate',
      'Dedicated Priority Alert monitoring team intervening if any delay occurs',
    ],
    activeFleetCount: '15,000+ Reusable Units in Dedicated Rotation',
    deploymentHubs: ['Memphis Cold-Chain Center', 'Veldhoven Healthcare Hub (Eindhoven)', 'Singapore Biopharma Hub'],
    status: 'In Active Service',
  },
  {
    id: 'eq-senseaware-id',
    name: 'SenseAware ID Sensor Pod & Predictive Telemetry',
    category: 'specialized',
    categoryLabel: 'Smart Telemetry Hardware',
    tagline: 'Compact active IoT device broadcasting precision sensor metrics every 2 seconds.',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=85',
    specs: [
      { label: 'Connectivity', value: 'Bluetooth Low Energy (BLE) + 4G/5G Cellular + GPS' },
      { label: 'Sensor Measurements', value: 'Location, Temp (-80°C to +60°C), Light, Shock, Pressure, Tilt' },
      { label: 'Update Frequency', value: 'Every 2 Seconds (BLE) / Instant Event Alerts' },
      { label: 'Battery Life', value: 'Up to 24 Months Continuous Operation' },
    ],
    description:
      'The size of a credit card, SenseAware ID attaches directly to packages to provide micro-location tracking throughout the FedEx network. As packages move past hundreds of automated BLE gateways inside facilities, their precise 3D coordinates are uploaded to the cloud without manual scanning.',
    operationalRole: 'High-value tech, luxury goods, aerospace components, and clinical trial tracking.',
    keyFeatures: [
      'Instant alert if package seal is breached or exposed to sudden light in transit',
      'Shock and tilt acceleration recording for delicate semiconductor optics',
      'Full FAA flight-safe compliance with automatic in-flight radio quiet mode',
    ],
    activeFleetCount: '1,000,000+ Active Network Sensor Nodes',
    deploymentHubs: ['Global Network Deployment'],
    status: '24/7 Global Ops',
  },
  {
    id: 'eq-custom-critical-reefer',
    name: 'Custom Critical Secure Temperature-Controlled Reefer',
    category: 'specialized',
    categoryLabel: 'High-Security Expedited Ground',
    tagline: 'Armed dual-driver expedited tractor with satellite dual-refrigeration redundancy.',
    imageUrl: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1600&q=85',
    specs: [
      { label: 'Temperature Range', value: '-20°C to +25°C Dual-Zone Controlled' },
      { label: 'Crew', value: 'Two Co-Drivers (Continuous 24/7 Rolling Velocity)' },
      { label: 'Security Level', value: 'Level 5 Satellite Tamper Locks & Panic Beacons' },
      { label: 'Tracking', value: 'Dual Satellite & Terrestrial GPS Geofence Alerting' },
    ],
    description:
      'For high-value pharmaceutical payloads, defense avionics, and fine art. The trailer features reinforced steel walls, dual independent Carrier refrigeration units (if one fails, the backup takes over instantly), and continuous satellite geofencing that alerts armed dispatchers if the truck stops unexpectedly.',
    operationalRole: 'Non-stop expedited secure road transport for critical, high-liability shipments.',
    keyFeatures: [
      'Dual-temperature multi-compartment refrigerated cargo holds',
      'Remote dispatch-controlled electronic door locks (driver cannot open without code)',
      'Air-ride multi-axle suspension eliminating road vibration',
    ],
    activeFleetCount: '1,800 Dedicated Expedited Units',
    deploymentHubs: ['North America & European High-Security Corridors'],
    status: 'In Active Service',
  },
];
