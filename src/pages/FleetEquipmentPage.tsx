import React, { useState } from 'react';
import {
  Plane,
  Truck,
  Layers,
  Thermometer,
  ShieldCheck,
  Globe,
  Zap,
  Activity,
  ArrowRight,
  Compass,
  Radio,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { EquipmentShowcase } from '../components/equipment/EquipmentShowcase';
import { Logo } from '../components/common/Logo';

interface FleetEquipmentPageProps {
  onNavigate: (path: string) => void;
}

export const FleetEquipmentPage: React.FC<FleetEquipmentPageProps> = ({ onNavigate }) => {
  const [selectedHub, setSelectedHub] = useState<'memphis' | 'paris' | 'guangzhou' | 'indianapolis'>('memphis');

  const hubData = {
    memphis: {
      name: 'Memphis World SuperHub (KMEM)',
      location: 'Tennessee, United States',
      aircraftGates: '400+ Jet Ramp Positions',
      sortCapacity: '500,000 pkgs/hr',
      primaryFleet: 'Boeing 777F, MD-11F, Boeing 767-300F',
      flightOps: '150+ Nightly Jet Landings & Departures',
      conveyors: '42 Miles of Automated Sorting Belts',
      status: 'High Surge Sort Activity',
    },
    paris: {
      name: 'Paris Charles de Gaulle European Hub (CDG)',
      location: 'Roissy-en-France, Europe',
      aircraftGates: '48 Dedicated Ramp Bays',
      sortCapacity: '38,000 pkgs/hr',
      primaryFleet: 'Boeing 777F, Boeing 767F, ATR-72 Feeder',
      flightOps: '50+ European Regional & Transatlantic Flights',
      conveyors: '18 km High-Speed Automated Sorters',
      status: 'Optimal Flow Velocity',
    },
    guangzhou: {
      name: 'Guangzhou Baiyun Asia-Pacific Hub (CAN)',
      location: 'Guangdong Province, China',
      aircraftGates: '60 Aircraft Parking Stands',
      sortCapacity: '35,000 pkgs/hr',
      primaryFleet: 'Boeing 777F, MD-11F, Boeing 757F',
      flightOps: '24/7 Transpacific & Pan-Asian Routing',
      conveyors: '15 km Integrated Customs Inspection Matrix',
      status: 'Clear Customs Processing',
    },
    indianapolis: {
      name: 'Indianapolis National Express Hub (IND)',
      location: 'Indiana, United States',
      aircraftGates: '90 Jet Hardstands',
      sortCapacity: '99,000 pkgs/hr',
      primaryFleet: 'Boeing 767-300F, Boeing 757-200F',
      flightOps: 'Second Largest North American Hub',
      conveyors: '28 Miles of Automated Laser Sorters',
      status: 'Active Sorting Wave',
    },
  };

  const activeHubInfo = hubData[selectedHub];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Expansive Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-slate-950 text-white">
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=2200&q=85"
            alt="FedEx Intercontinental Heavy Cargo Aircraft Tarmac"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/85" />

          {/* Radar lines and grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-md text-xs font-mono tracking-widest uppercase">
            <Radio className="w-3.5 h-3.5 text-[#FF6600] animate-pulse" />
            Live Global Fleet Telemetry & Infrastructure
          </div>

          <div className="flex justify-center mb-2">
            <Logo light size="xl" serviceVariant="Express" />
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight font-display text-white max-w-5xl mx-auto leading-[1.08]">
            Heavy Equipment & Global Intercontinental Fleet
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Connecting 99% of global GDP in 24 to 48 hours. Discover the 710+ cargo aircraft, 215,000 motorized ground units, and high-velocity multi-acre automated sorting super-hubs.
          </p>

          {/* Quick Metrics Ticker */}
          <div className="pt-6 flex flex-wrap justify-center gap-4 sm:gap-8 text-left">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md min-w-[160px]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Air Cargo Fleet</span>
              <span className="text-2xl sm:text-3xl font-mono font-extrabold text-[#FF6600]">710+</span>
              <span className="text-xs text-slate-400 block mt-0.5">Commercial Freighters</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md min-w-[160px]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Ground Vehicles</span>
              <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white">215,000+</span>
              <span className="text-xs text-slate-400 block mt-0.5">EVs, Vans & Class-8 Semis</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md min-w-[160px]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Daily Sortation</span>
              <span className="text-2xl sm:text-3xl font-mono font-extrabold text-cyan-400">19.5M+</span>
              <span className="text-xs text-slate-400 block mt-0.5">Parcels & Freight Tons</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md min-w-[160px]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Airport Gateways</span>
              <span className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-400">650+</span>
              <span className="text-xs text-slate-400 block mt-0.5">Worldwide Tarmacs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Equipment Showcase Component */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EquipmentShowcase />
      </section>

      {/* SuperHub Operations Deep Dive */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 relative overflow-hidden shadow-2xl">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#4D148C]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF6600]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6600]/20 text-[#FF6600] font-mono text-xs font-bold uppercase tracking-wider mb-2">
                  <Activity className="w-3.5 h-3.5" />
                  Global Gateway Telemetry
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold font-display">
                  Global Sortation SuperHub Operations
                </h3>
                <p className="text-slate-400 text-sm max-w-2xl mt-1">
                  Select a flagship hub to inspect active flight ops, aircraft gate capacity, sorting matrix metrics, and telemetry status.
                </p>
              </div>

              {/* Hub Selector Tabs */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'memphis', label: 'Memphis SuperHub' },
                  { id: 'paris', label: 'Paris CDG' },
                  { id: 'guangzhou', label: 'Guangzhou CAN' },
                  { id: 'indianapolis', label: 'Indianapolis IND' },
                ].map(hub => (
                  <button
                    key={hub.id}
                    onClick={() => setSelectedHub(hub.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                      selectedHub === hub.id
                        ? 'bg-[#FF6600] text-white shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {hub.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hub Detail Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-xs font-mono uppercase text-slate-400 block">Hub Facility</span>
                <span className="text-lg font-bold text-white block mt-1">{activeHubInfo.name}</span>
                <span className="text-xs text-[#FF6600] block mt-0.5">{activeHubInfo.location}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-xs font-mono uppercase text-slate-400 block">Aircraft Gate Capacity</span>
                <span className="text-lg font-bold text-white block mt-1">{activeHubInfo.aircraftGates}</span>
                <span className="text-xs text-slate-400 block mt-0.5">{activeHubInfo.flightOps}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-xs font-mono uppercase text-slate-400 block">Sort Matrix Throughput</span>
                <span className="text-lg font-bold text-cyan-400 block mt-1">{activeHubInfo.sortCapacity}</span>
                <span className="text-xs text-slate-400 block mt-0.5">{activeHubInfo.conveyors}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-xs font-mono uppercase text-slate-400 block">Primary Aircraft Fleet</span>
                <span className="text-sm font-bold text-slate-200 block mt-1">{activeHubInfo.primaryFleet}</span>
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 mt-2">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {activeHubInfo.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action for Shipping with this Fleet */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#4D148C] to-[#250A47] text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display">
              Ready to ship with the world’s most advanced logistics network?
            </h3>
            <p className="text-purple-200 text-sm leading-relaxed">
              Book express cargo space, calculate real-time rates, generate commercial waybills, and monitor your parcels with sub-second IoT telemetry.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <button
              onClick={() => onNavigate('/ship')}
              className="px-6 py-3.5 rounded-xl bg-[#FF6600] hover:bg-[#E55C00] text-white font-extrabold text-sm shadow-lg transition-all"
            >
              Create Shipment
            </button>
            <button
              onClick={() => onNavigate('/quote')}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-colors"
            >
              Get Rate Estimate
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
