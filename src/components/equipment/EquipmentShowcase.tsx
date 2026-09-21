import React, { useState } from 'react';
import {
  Plane,
  Truck,
  Layers,
  Thermometer,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Activity,
  Maximize2,
  X,
  Gauge,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { FEDEX_EQUIPMENT_FLEET, LogisticsEquipment } from '../../data/equipmentData';

interface EquipmentShowcaseProps {
  initialCategory?: 'all' | 'air' | 'ground' | 'hub' | 'specialized';
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
}

export const EquipmentShowcase: React.FC<EquipmentShowcaseProps> = ({
  initialCategory = 'all',
  title = 'FedEx Heavy Equipment & Global Fleet Showcase',
  subtitle = 'Explore the aerospace engineering, autonomous electric fleets, and multi-acre sortation robotics powering global trade.',
  showFilters = true,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'air' | 'ground' | 'hub' | 'specialized'>(initialCategory);
  const [activeModalItem, setActiveModalItem] = useState<LogisticsEquipment | null>(null);

  const categories = [
    { id: 'all', label: 'All Fleet & Equipment', icon: Layers, count: FEDEX_EQUIPMENT_FLEET.length },
    { id: 'air', label: 'Air Cargo Fleet', icon: Plane, count: FEDEX_EQUIPMENT_FLEET.filter(e => e.category === 'air').length },
    { id: 'ground', label: 'Ground & EV Fleets', icon: Truck, count: FEDEX_EQUIPMENT_FLEET.filter(e => e.category === 'ground').length },
    { id: 'hub', label: 'SuperHub & Robotics', icon: Layers, count: FEDEX_EQUIPMENT_FLEET.filter(e => e.category === 'hub').length },
    { id: 'specialized', label: 'Cold-Chain & Telemetry', icon: Thermometer, count: FEDEX_EQUIPMENT_FLEET.filter(e => e.category === 'specialized').length },
  ];

  const filteredEquipment = selectedCategory === 'all'
    ? FEDEX_EQUIPMENT_FLEET
    : FEDEX_EQUIPMENT_FLEET.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-10">
      {/* Header & Section Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4D148C]/10 text-[#4D148C] text-xs font-mono font-bold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6600]" />
            Enterprise Logistics Infrastructure
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-display">
            {title}
          </h2>
          <p className="text-slate-600 text-base max-w-2xl mt-2 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Real-time Fleet Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-sm shrink-0">
          <div className="px-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Fleet Aircraft</span>
            <span className="text-xl font-mono font-extrabold text-[#FF6600]">710+</span>
            <span className="text-[10px] text-slate-400 block">Global cargo jets</span>
          </div>
          <div className="px-2 border-l border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Ground Units</span>
            <span className="text-xl font-mono font-extrabold text-white">215,000+</span>
            <span className="text-[10px] text-slate-400 block">Vans & freight semis</span>
          </div>
          <div className="px-2 border-l border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Sort Capacity</span>
            <span className="text-xl font-mono font-extrabold text-cyan-400">500k/hr</span>
            <span className="text-[10px] text-slate-400 block">Memphis SuperHub</span>
          </div>
          <div className="px-2 border-l border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Active Telemetry</span>
            <span className="text-xl font-mono font-extrabold text-emerald-400">1.2M+</span>
            <span className="text-[10px] text-slate-400 block">SenseAware nodes</span>
          </div>
        </div>
      </div>

      {/* Category Navigation Pills */}
      {showFilters && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#4D148C] text-white shadow-md shadow-[#4D148C]/25 ring-2 ring-[#4D148C]/30'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-[#FF6600]' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEquipment.map(item => (
          <div
            key={item.id}
            className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
          >
            {/* Image Header with Badge Overlay */}
            <div className="relative h-60 w-full overflow-hidden bg-slate-950">
              <img
                src={item.imageUrl}
                alt={item.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              {/* Status and Category Badge */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex justify-between items-center">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[11px] font-mono font-bold text-white border border-white/10 uppercase">
                  {item.categoryLabel}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/90 text-white text-[11px] font-mono font-bold uppercase tracking-wider shadow-xs">
                  {item.status}
                </span>
              </div>

              {/* Hover Quick-Inspect Button */}
              <button
                onClick={() => setActiveModalItem(item)}
                className="absolute bottom-3.5 right-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-900 text-xs font-bold shadow-md backdrop-blur-xs transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#4D148C]" />
                <span>Specs & Telemetry</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
              <div>
                <h3 className="text-xl font-extrabold text-slate-950 group-hover:text-[#4D148C] transition-colors leading-snug">
                  {item.name}
                </h3>
                <p className="text-xs font-medium text-[#FF6600] mt-1 line-clamp-1">
                  {item.tagline}
                </p>
                <p className="text-slate-600 text-xs mt-3 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>

              {/* Key Specs Table Grid */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {item.specs.slice(0, 4).map((spec, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">{spec.label}</span>
                      <span className="font-mono font-bold text-slate-900 truncate block mt-0.5">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>

                {item.activeFleetCount && (
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1 text-slate-600">
                      <Activity className="w-3.5 h-3.5 text-[#FF6600]" />
                      Deployment Scale:
                    </span>
                    <span className="font-semibold text-slate-900">{item.activeFleetCount}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => setActiveModalItem(item)}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-[#4D148C] text-slate-800 hover:text-white font-bold text-xs transition-colors duration-200"
              >
                <span>View Full Engineering Profile</span>
                <ChevronRight className="w-4 h-4 text-[#FF6600]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Equipment Deep-Dive Inspection Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Hero Banner */}
            <div className="relative h-72 sm:h-80 w-full bg-slate-950">
              <img
                src={activeModalItem.secondaryImageUrl || activeModalItem.imageUrl}
                alt={activeModalItem.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-950/80 text-white hover:bg-white hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#4D148C] text-white text-xs font-mono font-bold uppercase tracking-wider">
                    {activeModalItem.categoryLabel}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-mono font-bold uppercase tracking-wider">
                    {activeModalItem.status}
                  </span>
                  {activeModalItem.activeFleetCount && (
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-mono text-white">
                      {activeModalItem.activeFleetCount}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
                  {activeModalItem.name}
                </h3>
                <p className="text-[#FF6600] font-medium text-sm">
                  {activeModalItem.tagline}
                </p>
              </div>
            </div>

            {/* Modal Body Details */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Mission & Overview */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Operational Mission Profile
                </h4>
                <p className="text-slate-800 text-base leading-relaxed">
                  {activeModalItem.description}
                </p>
                <div className="mt-3 p-3.5 rounded-xl bg-purple-50 border border-purple-100 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-[#4D148C] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#4D148C] font-semibold">
                    Strategic Role: <span className="text-slate-800 font-normal">{activeModalItem.operationalRole}</span>
                  </p>
                </div>
              </div>

              {/* Complete Specifications Grid */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Technical Specifications & Engineering Matrix
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {activeModalItem.specs.map((spec, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-xs text-slate-500 font-medium block">{spec.label}</span>
                      <span className="font-mono font-extrabold text-sm sm:text-base text-slate-950 mt-1 block">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Engineering Features */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Advanced Capabilities & Innovations
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeModalItem.keyFeatures.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deployment Hubs */}
              {activeModalItem.deploymentHubs && (
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Primary Operational Gateways & Hubs
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeModalItem.deploymentHubs.map(hub => (
                      <span key={hub} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 font-mono text-xs border border-slate-200">
                        <MapPin className="w-3.5 h-3.5 text-[#FF6600]" />
                        {hub}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Close */}
              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#4D148C] hover:bg-[#3D0F70] text-white font-bold text-sm shadow-md transition-colors"
                >
                  Close Specification Inspector
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
