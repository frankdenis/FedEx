import React, { useState } from 'react';
import { SERVICES_CATALOG } from '../data/siteContent';
import {
  Plane,
  Truck,
  Globe,
  Ship,
  ShoppingBag,
  FileCheck,
  Package,
  RotateCcw,
  Clock,
  AlertTriangle,
  ThermometerSnowflake,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface ServicesPageProps {
  initialSlug?: string;
  onNavigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ initialSlug, onNavigate }) => {
  const [selectedSlug, setSelectedSlug] = useState(initialSlug || SERVICES_CATALOG[0].slug);

  const activeService = SERVICES_CATALOG.find(s => s.slug === selectedSlug) || SERVICES_CATALOG[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Plane':
        return <Plane className="w-5 h-5" />;
      case 'Truck':
        return <Truck className="w-5 h-5" />;
      case 'Globe':
        return <Globe className="w-5 h-5" />;
      case 'Ship':
        return <Ship className="w-5 h-5" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5" />;
      case 'FileCheck':
        return <FileCheck className="w-5 h-5" />;
      case 'Package':
        return <Package className="w-5 h-5" />;
      case 'RotateCcw':
        return <RotateCcw className="w-5 h-5" />;
      case 'Clock':
        return <Clock className="w-5 h-5" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-5 h-5" />;
      case 'ThermometerSnowflake':
        return <ThermometerSnowflake className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-600">
          Global Logistics Capabilities
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-1">
          Complete Shipping & Supply Chain Services
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2">
          Discover specialized logistics tailored for high-speed parcel delivery, international trade, automated fulfillment, and temperature-sensitive biological goods.
        </p>
      </div>

      {/* Services Grid Navigation Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {SERVICES_CATALOG.map(s => (
          <button
            key={s.slug}
            onClick={() => setSelectedSlug(s.slug)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 border ${
              selectedSlug === s.slug
                ? 'bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-600/20'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            {getIcon(s.icon)}
            <span>{s.title}</span>
          </button>
        ))}
      </div>

      {/* Active Service Detailed Showcase */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold">
            {getIcon(activeService.icon)}
            <span>Specialized Tier</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {activeService.title}
          </h2>

          <p className="text-slate-600 text-base leading-relaxed">
            {activeService.overview}
          </p>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">
              Key Capabilities & Service Commitments
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeService.benefits.map(f => (
                <div key={f} className="flex items-start gap-2 text-xs font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('/ship')}
              className="px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-cyan-600/20"
            >
              Ship with this Service <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/quote')}
              className="px-5 py-3 rounded-2xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm"
            >
              Calculate Rates
            </button>
          </div>
        </div>

        {/* Visual Showcase Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-8 text-white border border-slate-800 space-y-6 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 flex items-center justify-center">
            {getIcon(activeService.icon)}
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">Target Applications</span>
            <div className="text-lg font-bold text-white mt-1">Enterprise & Domestic Specifications</div>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Tracking Protocol:</span>
              <span className="font-mono text-cyan-300 font-semibold">18-Milestone Telemetry</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Customs Clearance:</span>
              <span className="font-mono text-emerald-400 font-semibold">Pre-Flight Automated</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Insurance Options:</span>
              <span className="font-mono text-white font-semibold">Up to $500,000 Cargo</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400">Pickup Availability:</span>
              <span className="font-mono text-white font-semibold">Doorstep & Lockers</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
            "FedEx dedicated global logistics network maintains 99.8% on-time flight schedule adherence across intercontinental corridors."
          </div>
        </div>
      </div>

      {/* All 11 Services Catalog Overview */}
      <div className="pt-8">
        <h3 className="text-2xl font-extrabold text-slate-900 mb-6">
          Full Catalog of Specialized Solutions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_CATALOG.map(srv => (
            <div
              key={srv.slug}
              onClick={() => setSelectedSlug(srv.slug)}
              className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-cyan-400 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-cyan-700 flex items-center justify-center mb-4">
                  {getIcon(srv.icon)}
                </div>
                <h4 className="font-bold text-base text-slate-900">{srv.title}</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{srv.shortDescription}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-cyan-700">
                <span>View Full Specs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
