import React, { useState } from 'react';
import { getLocations } from '../lib/store';
import { LocationPoint } from '../types';
import {
  Search,
  MapPin,
  Clock,
  Phone,
  Building,
  Navigation,
  CheckCircle2,
  Filter,
  ExternalLink,
} from 'lucide-react';

interface LocationsPageProps {
  onNavigate: (path: string) => void;
}

export const LocationsPage: React.FC<LocationsPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [activeLocation, setActiveLocation] = useState<LocationPoint | null>(null);

  const allLocations = getLocations();

  const filteredLocations = allLocations.filter(loc => {
    const matchesType = selectedType === 'All' || loc.type === selectedType;
    const matchesSearch =
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.postalCode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const locationTypes = ['All', 'Service Center', 'Pickup Point', 'Drop-off Point', 'Warehouse', 'Distribution Hub'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF6600]">
          Global Logistics Points of Presence
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1 font-display">
          FedEx Ship Centers & Global Drop-Off Finder
        </h1>
        <p className="text-slate-600 text-sm mt-2">
          Locate nearest air cargo superhubs, 24/7 self-service parcel lockers, FedEx Office locations, and international service centers.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by city, country, facility name, or postal code..."
              className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:inline" />
            {locationTypes.map(t => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedType === t
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map Stage & Location Cards List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Visual Map Stage */}
        <div className="lg:col-span-6 bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative min-h-[480px] flex flex-col justify-between">
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 text-xs font-mono text-cyan-400 flex justify-between items-center">
            <span>Global Geolocation Grid</span>
            <span className="text-slate-400 font-sans">{filteredLocations.length} Facilities in View</span>
          </div>

          {/* Stylized Vector World Map with Hub Pins */}
          <div className="relative flex-1 flex items-center justify-center p-6">
            <svg viewBox="0 0 800 400" className="w-full h-auto opacity-30">
              <path
                d="M 150 150 Q 250 100 400 130 T 650 120"
                stroke="#38BDF8"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                fill="none"
              />
              <path
                d="M 200 250 Q 380 280 500 220 T 700 250"
                stroke="#38BDF8"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                fill="none"
              />
            </svg>

            {/* Interactive Location Pins */}
            <div className="absolute inset-0 p-8 flex flex-wrap items-center justify-around">
              {filteredLocations.map(loc => {
                const isSelected = activeLocation?.id === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => setActiveLocation(loc)}
                    className={`group relative p-2 rounded-2xl transition-all ${
                      isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-colors ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/30'
                          : 'bg-slate-800 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-950'
                      }`}
                    >
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono font-bold bg-slate-900/90 text-white px-2 py-0.5 rounded border border-slate-700 shadow-md">
                      {loc.city}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Location Info Bar at bottom of map */}
          {activeLocation && (
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">{activeLocation.name}</div>
                <div className="text-slate-400 text-[11px]">{activeLocation.address}, {activeLocation.city}</div>
              </div>
              <button
                onClick={() => onNavigate('/ship')}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
              >
                Drop off Here
              </button>
            </div>
          )}
        </div>

        {/* Location Cards List */}
        <div className="lg:col-span-6 space-y-4 max-h-[620px] overflow-y-auto pr-1">
          {filteredLocations.map(loc => {
            const isSelected = activeLocation?.id === loc.id;

            return (
              <div
                key={loc.id}
                onClick={() => setActiveLocation(loc)}
                className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-cyan-500 ring-2 ring-cyan-100 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {loc.type}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-1">{loc.name}</h3>
                  </div>

                  <span className="text-xs font-mono text-slate-400 font-semibold">
                    {loc.country}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1.5 mt-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{loc.address}, {loc.city}, {loc.postalCode}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{loc.phone}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Hours: {loc.openingHours}</span>
                  </div>
                </div>

                {/* Cut-off times */}
                <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Express Cut-Off:</span>
                    <span className="font-mono font-bold text-slate-900">18:00 Local</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Ground Cut-Off:</span>
                    <span className="font-mono font-bold text-slate-900">17:00 Local</span>
                  </div>
                </div>

                {/* Services list */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {loc.services.map(s => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-800 font-medium border border-cyan-100">
                      {s}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      alert(`Simulating directions to ${loc.name} at coordinates [${loc.coordinates.join(', ')}]`);
                    }}
                    className="text-xs font-semibold text-slate-600 hover:text-cyan-700 flex items-center gap-1"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Get Directions
                  </button>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onNavigate('/ship');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs"
                  >
                    Drop Off Here
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
