import React, { useState, useEffect } from 'react';
import {
  Search,
  ArrowRight,
  Package,
  Calendar,
  MapPin,
  Clock,
  Printer,
  Share2,
  Bell,
  Download,
  CheckCircle,
  AlertTriangle,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import { getShipmentByTracking, getShipments } from '../lib/store';
import { Shipment } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { TrackingTimeline } from '../components/tracking/TrackingTimeline';
import { ShipmentMap } from '../components/tracking/ShipmentMap';

interface TrackingPageProps {
  initialQuery?: string;
  onNavigate: (path: string) => void;
}

export const TrackingPage: React.FC<TrackingPageProps> = ({ initialQuery = '', onNavigate }) => {
  const [searchInput, setSearchInput] = useState(initialQuery || 'NX839204715');
  const [activeShipments, setActiveShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const sampleNumbers = ['NX839204715', 'NX839204716', 'NX839204717', 'NX839204718'];

  // Load shipments based on query input
  const executeSearch = (rawQuery: string) => {
    setErrorMessage('');
    const trimmed = rawQuery.trim();
    if (!trimmed) {
      setErrorMessage('Please enter a valid tracking number.');
      setActiveShipments([]);
      setSelectedShipment(null);
      return;
    }

    const tokens = trimmed.split(/[\s,]+/).filter(Boolean);
    const foundList: Shipment[] = [];

    tokens.forEach(tok => {
      const match = getShipmentByTracking(tok);
      if (match && !foundList.some(s => s.trackingNumber === match.trackingNumber)) {
        foundList.push(match);
      }
    });

    if (foundList.length === 0) {
      setErrorMessage(
        `No shipment found matching "${trimmed}". Please verify the number or test with sample NX839204715.`
      );
      setActiveShipments([]);
      setSelectedShipment(null);
    } else {
      setActiveShipments(foundList);
      setSelectedShipment(foundList[0]);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setSearchInput(initialQuery);
      executeSearch(initialQuery);
    } else {
      executeSearch('NX839204715');
    }

    // Real-time synchronization: if an admin updates status, update live view
    const handleStorageUpdate = () => {
      if (selectedShipment) {
        const fresh = getShipmentByTracking(selectedShipment.trackingNumber);
        if (fresh) {
          setSelectedShipment(fresh);
        }
      }
    };
    window.addEventListener('nexora-storage-update', handleStorageUpdate);
    return () => window.removeEventListener('nexora-storage-update', handleStorageUpdate);
  }, [initialQuery]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchInput);
  };

  const handleCopyLink = () => {
    if (selectedShipment) {
      navigator.clipboard.writeText(`${window.location.origin}/track?q=${selectedShipment.trackingNumber}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner & Tracking Input */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-mono font-semibold uppercase">
            Global Cargo Telemetry Search
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            TRACK YOUR SHIPMENT
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Enter one or more comma-separated tracking numbers to access real-time status updates, transit history, and custom clearance documentation.
          </p>

          {/* Search Box */}
          <form onSubmit={handleFormSubmit} className="pt-4">
            <div className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Enter tracking number (e.g. NX839204715)"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono shadow-inner"
                />
              </div>

              <button
                type="submit"
                className="px-7 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm tracking-wide uppercase transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
              >
                TRACK SHIPMENT
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {errorMessage}
              </div>
            )}

            {/* Active Consignment Quick Access */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
              <span>Active Consignments:</span>
              {sampleNumbers.map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setSearchInput(num);
                    executeSearch(num);
                  }}
                  className={`px-3 py-1 rounded-lg font-mono transition-colors border ${
                    selectedShipment?.trackingNumber === num
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/10'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Multi-result tabs if multiple numbers were provided */}
        {activeShipments.length > 1 && (
          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
              Found {activeShipments.length} Shipments:
            </span>
            {activeShipments.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedShipment(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all shrink-0 flex items-center gap-2 border ${
                  selectedShipment?.id === s.id
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border-slate-700'
                }`}
              >
                <span>{s.trackingNumber}</span>
                <span className="text-[10px] opacity-75">({s.status})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Shipment Details Result */}
      {selectedShipment ? (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Main Result Headline Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                    Tracking Number
                  </span>
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-700"
                    title="Copy tracking link"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied Link' : 'Copy'}</span>
                  </button>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tracking-tight mt-1">
                  {selectedShipment.trackingNumber}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <StatusBadge status={selectedShipment.status} size="lg" />
                  <span className="text-xs text-slate-500 font-medium">
                    Service: <strong>FedEx {selectedShipment.service}</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setSubscribed(!subscribed)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                    subscribed
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  {subscribed ? 'Subscribed to Alerts' : 'Get Tracking Alerts'}
                </button>

                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Print Details
                </button>

                <span className="text-xs text-slate-400">Commercial invoice download requires the document service.</span>
              </div>
            </div>

            {/* Core Specs Grid: Status, Origin, Destination, Estimated Delivery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
              {/* Origin */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Origin
                </div>
                <div className="font-extrabold text-base text-slate-900">
                  {selectedShipment.sender.city}, {selectedShipment.sender.country}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 truncate">
                  {selectedShipment.sender.company || selectedShipment.sender.name}
                </div>
              </div>

              {/* Destination */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Destination
                </div>
                <div className="font-extrabold text-base text-slate-900">
                  {selectedShipment.recipient.city}, {selectedShipment.recipient.country}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 truncate">
                  {selectedShipment.recipient.company || selectedShipment.recipient.name}
                </div>
              </div>

              {/* Estimated Delivery */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                  <Calendar className="w-4 h-4 text-cyan-600" />
                  Estimated Delivery
                </div>
                <div className="font-extrabold text-base text-slate-900">
                  {selectedShipment.estimatedDelivery}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Scheduled arrival by 18:00
                </div>
              </div>

              {/* Package Details */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                  <Package className="w-4 h-4 text-purple-600" />
                  Package & Weight
                </div>
                <div className="font-extrabold text-base text-slate-900">
                  {selectedShipment.packageInfo.weight} kg • {selectedShipment.packageInfo.type}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 truncate">
                  {selectedShipment.packageInfo.description}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Shipment Map Section (Section 7) */}
          <ShipmentMap shipment={selectedShipment} />

          {/* Detailed Shipment Timeline (Section 6) */}
          <TrackingTimeline shipment={selectedShipment} />

          {/* Sender / Recipient & Consignment Specifications Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Sender Information
              </h3>
              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-900 text-sm">{selectedShipment.sender.name}</p>
                {selectedShipment.sender.company && <p className="font-medium">{selectedShipment.sender.company}</p>}
                <p>{selectedShipment.sender.address}</p>
                <p>{selectedShipment.sender.city}, {selectedShipment.sender.state} {selectedShipment.sender.postalCode}</p>
                <p className="font-semibold text-slate-800">{selectedShipment.sender.country}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Recipient Information
              </h3>
              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-900 text-sm">{selectedShipment.recipient.name}</p>
                {selectedShipment.recipient.company && <p className="font-medium">{selectedShipment.recipient.company}</p>}
                <p>{selectedShipment.recipient.address}</p>
                <p>{selectedShipment.recipient.city}, {selectedShipment.recipient.state} {selectedShipment.recipient.postalCode}</p>
                <p className="font-semibold text-slate-800">{selectedShipment.recipient.country}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
