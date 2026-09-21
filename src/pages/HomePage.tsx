import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  Plane,
  Truck,
  Ship,
  Warehouse,
  ShieldCheck,
  Globe2,
  Clock,
  CheckCircle2,
  ChevronRight,
  Calculator,
  Box,
  AlertCircle,
  Sparkles,
  Layers,
  Activity,
  Maximize2,
  Radio,
} from 'lucide-react';
import { LOGISTICS_IMAGES } from '../data/mockData';
import { FEDEX_EQUIPMENT_FLEET } from '../data/equipmentData';
import { Logo } from '../components/common/Logo';
import { EquipmentShowcase } from '../components/equipment/EquipmentShowcase';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingError, setTrackingError] = useState('');

  // Quick rate estimator mini state
  const [quickOrigin, setQuickOrigin] = useState('United States');
  const [quickDest, setQuickDest] = useState('Germany');
  const [quickWeight, setQuickWeight] = useState('5');
  const [quickResult, setQuickResult] = useState<{ express: number; standard: number } | null>(null);

  const sampleNumbers = ['NX839204715', 'NX839204716', 'NX839204717'];

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackingError('');

    const trimmed = trackingInput.trim();
    if (!trimmed) {
      setTrackingError('Please enter a valid tracking number.');
      return;
    }

    // Support multiple or comma-separated tracking numbers
    const numbers = trimmed.split(/[\s,]+/).filter(Boolean);
    if (numbers.length === 0) {
      setTrackingError('Please enter a valid tracking number.');
      return;
    }

    // Navigate to /track with query parameter
    onNavigate(`/track?q=${encodeURIComponent(numbers.join(','))}`);
  };

  const handleQuickEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(quickWeight) || 1;
    setQuickResult({
      express: Math.round(65 + w * 14.5),
      standard: Math.round(32 + w * 5.5),
    });
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* HERO SECTION */}
      <section className="relative min-h-[660px] lg:min-h-[760px] flex items-center justify-center overflow-hidden bg-[#0A0414] text-white">
        {/* Full-width logistics background image with dark overlay & subtle animated route lines */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=2200&q=85"
            alt="FedEx Cargo Jet Tarmac at Night"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0414] via-[#0A0414]/75 to-[#0A0414]/85" />

          {/* Animated Route Lines Background Canvas */}
          <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 100 500 Q 400 200 800 350 T 1500 150"
              fill="none"
              stroke="#FF6600"
              strokeWidth="2"
              strokeDasharray="6 8"
              className="animate-pulse"
            />
            <path
              d="M 50 250 Q 500 100 1100 400"
              fill="none"
              stroke="#9333EA"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
          </svg>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center flex flex-col items-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-slate-200 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md">
            <Radio className="w-3.5 h-3.5 text-[#FF6600] animate-pulse" />
            Active Worldwide Fleet & Air Cargo Operations
          </div>

          {/* Prominent Brand Logo */}
          <div className="mb-4">
            <Logo light size="xl" serviceVariant="Express" />
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] font-display">
            The World on Time. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6600] via-amber-400 to-[#FF8533]">
              Larger, Faster, Smarter.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
            Connecting 99% of world commerce. Featuring our 710+ intercontinental freighter aircraft, 215,000 ground delivery vehicles, and state-of-the-art automated sorting super-hubs.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/ship')}
              className="px-7 py-3.5 rounded-2xl bg-[#FF6600] hover:bg-[#E55C00] text-white font-extrabold text-sm sm:text-base shadow-xl shadow-[#FF6600]/30 transition-all flex items-center gap-2 group"
            >
              Ship with FedEx
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('/equipment')}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm sm:text-base backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Plane className="w-4 h-4 text-[#FF6600]" />
              Heavy Fleet & Aircraft Showcase
            </button>

            <button
              onClick={() => onNavigate('/quote')}
              className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-medium text-sm sm:text-base border border-slate-700 transition-all"
            >
              Rates & Transit Times
            </button>
          </div>

          {/* QUICK TRACKING WIDGET (Immediately integrated into hero) */}
          <div className="mt-12 w-full max-w-2xl bg-white/95 text-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/50 backdrop-blur-xl text-left">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Search className="w-5 h-5 text-[#4D148C]" />
                Track Consignment or Waybill
              </h2>
              <span className="text-[11px] text-slate-500 font-mono font-medium">
                Live Sensor Telemetry
              </span>
            </div>

            <form onSubmit={handleTrackSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={trackingInput}
                    onChange={e => setTrackingInput(e.target.value)}
                    placeholder="Enter tracking number (e.g. NX839204715)"
                    className="w-full pl-4 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#4D148C] focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-7 py-3.5 rounded-2xl bg-[#4D148C] hover:bg-[#3B0E6E] text-white font-bold text-sm shadow-md transition-all whitespace-nowrap flex items-center justify-center gap-2"
                >
                  <span>Track Package</span>
                  <ArrowRight className="w-4 h-4 text-[#FF6600]" />
                </button>
              </div>

              {trackingError && (
                <div className="text-xs text-rose-600 flex items-center gap-1.5 mt-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {trackingError}
                </div>
              )}

              {/* Sample tracking quick clickers */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Quick Test:</span>
                {sampleNumbers.map(sn => (
                  <button
                    key={sn}
                    type="button"
                    onClick={() => {
                      setTrackingInput(sn);
                      onNavigate(`/track?q=${sn}`);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 hover:text-[#4D148C] text-slate-700 font-mono transition-colors text-[11px] border border-slate-200"
                  >
                    {sn}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* QUICK HIGHLIGHT OF REAL HEAVY EQUIPMENT & AIRCRAFT (Featured section with large photos) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4D148C]/10 text-[#4D148C] font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <Plane className="w-3.5 h-3.5 text-[#FF6600]" />
              Intercontinental Fleet & Heavy Equipment
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight font-display">
              Heavy Freight Aircraft & Advanced Ground Fleet
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl mt-1">
              Engineered to carry over 100,000 kg across oceans non-stop and deliver with zero emissions in city centers.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/equipment')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-[#4D148C] text-white font-bold text-xs font-mono uppercase tracking-wider transition-colors shrink-0 shadow-sm"
          >
            <span>Explore All 710+ Fleet Units</span>
            <ArrowRight className="w-4 h-4 text-[#FF6600]" />
          </button>
        </div>

        {/* 3 Featured Massive Equipment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Boeing 777F */}
          <div
            onClick={() => onNavigate('/equipment?cat=air')}
            className="group relative rounded-3xl overflow-hidden bg-slate-950 text-white cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-800"
          >
            <div className="h-64 sm:h-72 w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=85"
                alt="Boeing 777F Cargo Aircraft"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
            </div>
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-[#4D148C] text-white text-[11px] font-mono font-bold uppercase tracking-wider shadow-md">
                Flagship Intercontinental
              </span>
            </div>
            <div className="p-6 relative z-10 space-y-2">
              <h3 className="text-xl font-extrabold text-white group-hover:text-[#FF6600] transition-colors">
                Boeing 777F Long-Haul Cargo
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                102,000 kg max payload and 9,200 km range connecting Asia, the Americas, and Europe non-stop.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-mono text-[#FF6600]">
                <span>58 Aircraft in Service</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Specs →
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: BrightDrop Electric Delivery Van */}
          <div
            onClick={() => onNavigate('/equipment?cat=ground')}
            className="group relative rounded-3xl overflow-hidden bg-slate-950 text-white cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-800"
          >
            <div className="h-64 sm:h-72 w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=85"
                alt="BrightDrop Zevo 600 Electric Van"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
            </div>
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-mono font-bold uppercase tracking-wider shadow-md">
                Zero-Emission Electric
              </span>
            </div>
            <div className="p-6 relative z-10 space-y-2">
              <h3 className="text-xl font-extrabold text-white group-hover:text-[#FF6600] transition-colors">
                BrightDrop Zevo 600 EV Fleet
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                250-mile all-electric range with 600 cu.ft cargo volume and real-time cloud predictive routing.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-mono text-emerald-400">
                <span>2,500+ Electric Units</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Specs →
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Memphis World SuperHub */}
          <div
            onClick={() => onNavigate('/equipment?cat=hub')}
            className="group relative rounded-3xl overflow-hidden bg-slate-950 text-white cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-800"
          >
            <div className="h-64 sm:h-72 w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=85"
                alt="Memphis World SuperHub Sorting"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
            </div>
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-cyan-600 text-white text-[11px] font-mono font-bold uppercase tracking-wider shadow-md">
                Global Nerve Center
              </span>
            </div>
            <div className="p-6 relative z-10 space-y-2">
              <h3 className="text-xl font-extrabold text-white group-hover:text-[#FF6600] transition-colors">
                Memphis World SuperHub
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Processing 500,000 packages/hour across 42 miles of automated laser-guided conveyor sorters.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-mono text-cyan-400">
                <span>500k Parcels / Hour</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Specs →
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEDEX SERVICE DIVISIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold font-mono tracking-widest text-[#FF6600] uppercase">
            Global Network Solutions
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2 font-display">
            Built for Every Size, Speed, and Destination
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Tailored logistics services spanning guaranteed overnight air courier, heavy highway freight, and temperature-controlled medical shipments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: FedEx Express */}
          <div
            onClick={() => onNavigate('/services/express')}
            className="group bg-white rounded-3xl p-6 border border-slate-200 hover:border-[#4D148C] hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#4D148C] group-hover:scale-110 transition-transform mb-5">
                <Plane className="w-6 h-6 text-[#FF6600]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#4D148C] transition-colors">
                FedEx Express®
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Time-definite overnight international delivery to over 220 countries with customs pre-clearance in flight.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#FF6600]">
              Explore Express <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: FedEx Ground */}
          <div
            onClick={() => onNavigate('/services/domestic')}
            className="group bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-600 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform mb-5">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                FedEx Ground®
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Cost-effective, day-definite commercial and residential parcel transit backed by autonomous EV delivery fleets.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              Explore Ground <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: FedEx Freight */}
          <div
            onClick={() => onNavigate('/services/freight')}
            className="group bg-white rounded-3xl p-6 border border-slate-200 hover:border-[#DF1995] hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-[#DF1995] group-hover:scale-110 transition-transform mb-5">
                <Ship className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#DF1995] transition-colors">
                FedEx Freight®
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                LTL palletized freight, full container intermodal rail, and heavy oversized machinery transport.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#DF1995]">
              Explore Freight <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: FedEx Custom Critical */}
          <div
            onClick={() => onNavigate('/services/warehousing')}
            className="group bg-white rounded-3xl p-6 border border-slate-200 hover:border-cyan-600 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform mb-5">
                <Warehouse className="w-6 h-6 text-[#4D148C]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                FedEx Custom Critical®
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Temperature-sensitive cryogenic biopharma, armored high-security assets, and chartered direct air-cargo.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-cyan-700">
              Explore Custom Critical <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* GLOBAL INFRASTRUCTURE & TELEMETRY STATS */}
      <section className="bg-slate-950 text-white py-16 sm:py-20 relative overflow-hidden border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-4 md:pt-0">
              <div className="text-4xl sm:text-5xl font-extrabold font-mono text-[#FF6600]">
                220+
              </div>
              <div className="text-sm text-slate-400 mt-2 font-medium">
                Countries & Territories Connected
              </div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-4xl sm:text-5xl font-extrabold font-mono text-white">
                710+
              </div>
              <div className="text-sm text-slate-400 mt-2 font-medium">
                Active Air Cargo Freighters
              </div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-4xl sm:text-5xl font-extrabold font-mono text-purple-400">
                215,000+
              </div>
              <div className="text-sm text-slate-400 mt-2 font-medium">
                Ground Delivery Fleet & Semis
              </div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-4xl sm:text-5xl font-extrabold font-mono text-emerald-400">
                19.5M+
              </div>
              <div className="text-sm text-slate-400 mt-2 font-medium">
                Daily Shipments Handled
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE RATE ESTIMATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#1F0838] to-[#0A0214] text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-purple-900/40 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6600]/20 text-[#FF6600] text-xs font-semibold mb-4 border border-[#FF6600]/30 font-mono">
              <Calculator className="w-3.5 h-3.5" />
              Real-Time Dynamic Rating Engine
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-snug font-display">
              Calculate Accurate International Shipping Rates & Transit Windows
            </h2>
            <p className="mt-4 text-purple-200 text-sm sm:text-base leading-relaxed">
              Transparent global tariffs with fuel index calculations and customs duty estimation. Test rates across FedEx Express, Priority, and Standard Ground.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('/quote')}
                className="px-6 py-3 rounded-xl bg-[#FF6600] hover:bg-[#E55C00] text-white font-extrabold text-sm transition-colors flex items-center gap-2 shadow-lg shadow-[#FF6600]/25"
              >
                Launch Full Quote Portal
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('/ship')}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-colors border border-white/20"
              >
                Create Shipment Direct
              </button>
            </div>
          </div>

          {/* Quick interactive calculator widget */}
          <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center justify-between">
              <span>Quick Rate Estimator</span>
              <span className="text-xs text-[#FF6600] font-mono font-bold uppercase">FedEx Express Tariff</span>
            </h3>

            <form onSubmit={handleQuickEstimate} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Origin Country</label>
                  <select
                    value={quickOrigin}
                    onChange={e => setQuickOrigin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4D148C]"
                  >
                    <option>United States</option>
                    <option>Nigeria</option>
                    <option>United Kingdom</option>
                    <option>Germany</option>
                    <option>United Arab Emirates</option>
                    <option>Brazil</option>
                    <option>Singapore</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Destination</label>
                  <select
                    value={quickDest}
                    onChange={e => setQuickDest(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4D148C]"
                  >
                    <option>Brazil</option>
                    <option>Nigeria</option>
                    <option>Germany</option>
                    <option>United States</option>
                    <option>Kenya</option>
                    <option>Australia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={quickWeight}
                  onChange={e => setQuickWeight(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4D148C]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#4D148C] hover:bg-[#3B0E6E] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                Estimate Cost
              </button>
            </form>

            {quickResult && (
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 animate-in fade-in">
                <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100 text-center">
                  <div className="text-[10px] font-bold text-[#4D148C] uppercase">FedEx Express (2–3 Days)</div>
                  <div className="text-lg font-extrabold text-[#4D148C] font-mono">${quickResult.express}.00</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-center">
                  <div className="text-[10px] font-bold text-slate-700 uppercase">FedEx Ground (5–7 Days)</div>
                  <div className="text-lg font-extrabold text-slate-900 font-mono">${quickResult.standard}.00</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE FEDEX GLOBAL LOGISTICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold font-mono tracking-widest text-[#FF6600] uppercase">
            Global Reliability Standard
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2 font-display">
            Why the World’s Leading Enterprises Rely on FedEx
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#4D148C] flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5 text-[#FF6600]" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Dedicated Air Fleet & Priority Tarmac</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              With 710+ company-owned freighter jets, your consignments travel on dedicated cargo aircraft rather than unpredictable passenger belly space.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6600] flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">SenseAware Sub-Second Telemetry</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Active multi-sensor environmental pods measure GPS coordinates, temperature (-150°C to +60°C), light exposure, barometric pressure, and shock in real time.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#4D148C] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Global Trade & In-Flight Customs</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Electronic air waybill manifests transmit directly to customs authorities while aircraft are in flight, clearing parcels prior to touchdown at gateway hubs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
