import React, { useState, useEffect } from 'react';
import { Search, X, Package, MapPin, Wrench, BookOpen, ArrowRight } from 'lucide-react';
import { getShipments, getLocations } from '../../lib/store';
import { SERVICES_CATALOG } from '../../data/mockData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const shipments = getShipments();
  const locations = getLocations();

  const q = query.trim().toLowerCase();

  const matchedShipments = q
    ? shipments.filter(
        s =>
          s.trackingNumber.toLowerCase().includes(q) ||
          s.sender.city.toLowerCase().includes(q) ||
          s.recipient.city.toLowerCase().includes(q)
      )
    : [];

  const matchedServices = q
    ? SERVICES_CATALOG.filter(
        s =>
          s.title.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q) ||
          s.slug.toLowerCase().includes(q)
      )
    : SERVICES_CATALOG.slice(0, 4);

  const matchedLocations = q
    ? locations.filter(
        l =>
          l.name.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.country.toLowerCase().includes(q)
      )
    : [];

  const handleSelect = (path: string) => {
    onNavigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tracking numbers, services, global locations, resources..."
            className="w-full bg-transparent border-none text-slate-900 text-base placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200/60 rounded border border-slate-300/60">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-4 space-y-6">
          {/* Tracking Matches */}
          {matchedShipments.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#4D148C]" />
                Shipment Tracking Numbers
              </div>
              <div className="space-y-1.5">
                {matchedShipments.map(s => (
                  <button
                    key={s.trackingNumber}
                    onClick={() => handleSelect(`/track?q=${s.trackingNumber}`)}
                    className="w-full p-3 rounded-xl hover:bg-slate-50 flex items-center justify-between group border border-transparent hover:border-slate-200 transition-all text-left"
                  >
                    <div>
                      <div className="font-mono font-bold text-slate-900 text-sm flex items-center gap-2">
                        {s.trackingNumber}
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-[#4D148C] font-sans font-medium">
                          {s.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {s.sender.city}, {s.sender.country} → {s.recipient.city}, {s.recipient.country}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#4D148C] group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Service Solutions */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-[#4D148C]" />
              Logistics Services
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {matchedServices.map(srv => (
                <button
                  key={srv.slug}
                  onClick={() => handleSelect(`/services/${srv.slug}`)}
                  className="p-3 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all text-left group"
                >
                  <div className="font-semibold text-sm text-slate-900 group-hover:text-[#4D148C] transition-colors">
                    {srv.title}
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {srv.shortDescription}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Locations */}
          {matchedLocations.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF6600]" />
                Facilities & Service Centers
              </div>
              <div className="space-y-1.5">
                {matchedLocations.map(loc => (
                  <button
                    key={loc.id}
                    onClick={() => handleSelect('/locations')}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between border border-transparent hover:border-slate-200 transition-all text-left"
                  >
                    <div>
                      <div className="font-medium text-slate-900 text-sm">{loc.name}</div>
                      <div className="text-xs text-slate-500">{loc.city}, {loc.country}</div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">{loc.type}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Help & Tools */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-purple-600" />
              Quick Tools & Documentation
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSelect('/ship')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-purple-50 hover:text-[#4D148C] text-xs font-medium text-slate-700 transition-colors"
              >
                Create New Shipment (/ship)
              </button>
              <button
                onClick={() => handleSelect('/quote')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-purple-50 hover:text-[#4D148C] text-xs font-medium text-slate-700 transition-colors"
              >
                Shipping Rate Calculator (/quote)
              </button>
              <button
                onClick={() => handleSelect('/equipment')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-purple-50 hover:text-[#4D148C] text-xs font-medium text-slate-700 transition-colors"
              >
                Fleet & Heavy Equipment (/equipment)
              </button>
              <button
                onClick={() => handleSelect('/resources')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-purple-50 hover:text-[#4D148C] text-xs font-medium text-slate-700 transition-colors"
              >
                Customs & Packaging Guides
              </button>
              <button
                onClick={() => handleSelect('/support')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-purple-50 hover:text-[#4D148C] text-xs font-medium text-slate-700 transition-colors"
              >
                FAQ & Help Center
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400">
          Try sample tracking: <code className="text-[#4D148C] font-bold font-mono">NX839204715</code>, <code className="text-[#4D148C] font-bold font-mono">NX839204716</code>, <code className="text-[#4D148C] font-bold font-mono">NX839204717</code>
        </div>
      </div>
    </div>
  );
};
