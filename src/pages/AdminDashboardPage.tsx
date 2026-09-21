import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Package,
  Clock,
  AlertTriangle,
  Users,
  Truck,
  Building,
  DollarSign,
  BarChart3,
  Search,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Edit,
  Save,
  MessageSquare,
  HardDrive,
} from 'lucide-react';
import {
  getShipments,
  updateShipmentStatus,
  getDrivers,
  getFacilities,
  getSupportTickets,
  getUsers,
  syncOperationalCache,
} from '../lib/store';
import { Shipment, TrackingStatus, Driver, Facility, SupportTicket } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'shipments' | 'drivers' | 'facilities' | 'rates' | 'tickets'
  >('overview');

  const [shipments, setShipments] = useState<Shipment[]>(getShipments());
  const [drivers, setDrivers] = useState<Driver[]>(getDrivers());
  const [facilities, setFacilities] = useState<Facility[]>(getFacilities());
  const [tickets, setTickets] = useState<SupportTicket[]>(getSupportTickets());
  const [users, setUsers] = useState(getUsers());

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Status Editor Modal
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [newStatus, setNewStatus] = useState<TrackingStatus>('In Transit');
  const [statusLocation, setStatusLocation] = useState('');
  const [statusComment, setStatusComment] = useState('');

  const refreshData = () => {
    setShipments(getShipments());
    setDrivers(getDrivers());
    setFacilities(getFacilities());
    setTickets(getSupportTickets());
    setUsers(getUsers());
  };

  useEffect(() => {
    refreshData();
    window.addEventListener('nexora-storage-update', refreshData);
    return () => window.removeEventListener('nexora-storage-update', refreshData);
  }, []);

  const openStatusEditor = (s: Shipment) => {
    setEditingShipment(s);
    setNewStatus(s.status);
    setStatusLocation(`${s.recipient.city} International Airport Hub`);
    setStatusComment(`Physical scan completed at automated gateway sorter.`);
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShipment) return;

    updateShipmentStatus(
      editingShipment.trackingNumber,
      newStatus,
      statusLocation || 'FedEx World Hub (Memphis)',
      statusComment || `Status updated to ${newStatus}`
    );

    setEditingShipment(null);
    refreshData();
  };

  const filteredShipments = shipments.filter(s => {
    const matchesSearch =
      s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sender.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.recipient.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const availableStatuses: TrackingStatus[] = [
    'Shipment Created',
    'Label Generated',
    'Pickup Scheduled',
    'Picked Up',
    'At Origin Facility',
    'Departed Origin',
    'In Transit',
    'Arrived at Destination Country',
    'Customs Clearance',
    'Customs Cleared',
    'At Destination Facility',
    'Out for Delivery',
    'Delivery Attempted',
    'Delivered',
    'Exception',
    'Shipment Delayed',
    'Returned to Sender',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              Global Dispatch & Flight Ops Control
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 text-white font-display">
            FedEx Global Operations Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Logged in as Dispatch Administrator (Alexander Vance) • System Gateway Node: MEM-SUPERHUB-01
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('/chat')}
            className="px-4 py-2 rounded-xl bg-[#4D148C] hover:bg-purple-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all border border-purple-400/40"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#FF6600]" /> Google Chat Dispatch
          </button>
          <button
            onClick={() => onNavigate('/drive')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
          >
            <HardDrive className="w-3.5 h-3.5 text-amber-400" /> Drive Documents
          </button>
          <button
            onClick={() => onNavigate('/track')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Public Tracking View
          </button>
          <button
            onClick={() => {
              if (window.confirm('Synchronize operational database with central flight & dispatch nodes?')) {
                syncOperationalCache();
                refreshData();
              }
            }}
            className="px-4 py-2 rounded-xl bg-[#FF6600] hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Sync Ops Cache
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Active Air Manifests</span>
          <div className="text-2xl font-mono font-extrabold text-slate-900 mt-1">{shipments.length}</div>
          <span className="text-[11px] text-cyan-700 font-medium">Tracking in live registry</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">In Customs Queue</span>
          <div className="text-2xl font-mono font-extrabold text-amber-600 mt-1">
            {shipments.filter(s => s.status === 'Customs Clearance').length}
          </div>
          <span className="text-[11px] text-amber-700 font-medium">Clearance verification</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Active Courier Fleet</span>
          <div className="text-2xl font-mono font-extrabold text-blue-600 mt-1">
            {drivers.filter(d => d.status === 'Available' || d.status === 'On Delivery').length}
          </div>
          <span className="text-[11px] text-blue-700 font-medium">On-duty field drivers</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Logistics Facilities</span>
          <div className="text-2xl font-mono font-extrabold text-purple-600 mt-1">
            {facilities.length}
          </div>
          <span className="text-[11px] text-purple-700 font-medium">International Hubs & Gateways</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Support Tickets</span>
          <div className="text-2xl font-mono font-extrabold text-rose-600 mt-1">
            {tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length}
          </div>
          <span className="text-[11px] text-rose-700 font-medium">Pending inquiry triage</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-6 text-sm font-semibold overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Shipment Manager & Status Advance' },
          { id: 'drivers', label: 'Fleet & Couriers' },
          { id: 'facilities', label: 'Hub Capacity' },
          { id: 'tickets', label: 'Support Queue' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`pb-3 whitespace-nowrap transition-colors border-b-2 -mb-[2px] ${
              activeTab === t.id
                ? 'border-cyan-600 text-cyan-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: SHIPMENT MANAGER WITH LIVE STATUS ADVANCE */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pb-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">Consignment Dispatch & Status Controls</h2>
              <p className="text-xs text-slate-500">
                Click "Advance Status" on any shipment to simulate live package movement across milestones.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Filter shipments..."
                  className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="text-xs p-2 rounded-xl border border-slate-300 bg-white"
              >
                <option>All</option>
                {availableStatuses.map(st => (
                  <option key={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 divide-y divide-slate-100">
              <thead className="text-[10px] font-mono uppercase text-slate-400 font-semibold bg-slate-50/50">
                <tr>
                  <th className="py-3 px-3">Tracking #</th>
                  <th className="py-3 px-3">Current Status</th>
                  <th className="py-3 px-3">Service Tier</th>
                  <th className="py-3 px-3">Origin Hub</th>
                  <th className="py-3 px-3">Destination Hub</th>
                  <th className="py-3 px-3">Latest Event</th>
                  <th className="py-3 px-3 text-right">Dispatch Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredShipments.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => onNavigate(`/track?q=${s.trackingNumber}`)}
                        className="font-mono font-bold text-cyan-700 hover:text-cyan-900 underline"
                      >
                        {s.trackingNumber}
                      </button>
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={s.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-900">
                      {s.service}
                    </td>
                    <td className="py-3.5 px-3">
                      {s.sender.city}
                    </td>
                    <td className="py-3.5 px-3">
                      {s.recipient.city}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 max-w-xs truncate">
                      {s.events[0]?.description || 'Shipment created'}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => openStatusEditor(s)}
                        className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-2xs inline-flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" /> Advance Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DRIVERS & FLEET */}
      {activeTab === 'drivers' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Active Field Couriers & Fleet</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {drivers.map(d => (
              <div key={d.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-sm text-slate-900">{d.name}</span>
                    <div className="text-[11px] text-slate-500 font-mono">ID: {d.driverId}</div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      d.status === 'Available' || d.status === 'On Delivery' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {d.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  Vehicle: <strong className="text-slate-900">{d.vehicle}</strong>
                </div>
                <div className="text-xs text-slate-600">
                  Assigned Region: <span className="text-cyan-700 font-semibold">{d.region}</span>
                </div>
                <div className="text-xs text-slate-500 pt-1">
                  Active Parcels on Van: <strong>{d.assignedShipmentsCount}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FACILITIES */}
      {activeTab === 'facilities' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">International Logistics Facilities & Gateways</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facilities.map(f => (
              <div key={f.id} className="p-5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-cyan-600 uppercase">{f.id}</span>
                    <h3 className="font-bold text-base text-slate-900">{f.name}</h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{f.country}</span>
                </div>
                <p className="text-xs text-slate-500">Classification: {f.type}</p>
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>Sortation Throughput Capacity:</span>
                    <span className="font-mono font-bold text-slate-900">{f.capacityPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        f.capacityPercentage > 80 ? 'bg-amber-500' : 'bg-cyan-600'
                      }`}
                      style={{ width: `${f.capacityPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SUPPORT TICKETS */}
      {activeTab === 'tickets' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Customer Support Ticket Triage</h2>
          <div className="divide-y divide-slate-100">
            {tickets.map(t => (
              <div key={t.id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{t.id}</span>
                    <span className="text-xs font-bold text-slate-900">{t.subject}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold uppercase">
                      {t.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{t.message}</p>
                </div>
                <button
                  onClick={() => alert(`Responding to customer ticket ${t.id}`)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-semibold shrink-0"
                >
                  Respond
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUICK STATUS ADVANCE MODAL */}
      {editingShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-cyan-600 font-bold">Dispatch Status Controller</span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Update Consignment {editingShipment.trackingNumber}
                </h3>
              </div>
              <StatusBadge status={editingShipment.status} size="sm" />
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">New Milestone Status *</label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as TrackingStatus)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-cyan-500"
                >
                  {availableStatuses.map(st => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Scan Facility / Location</label>
                <input
                  type="text"
                  value={statusLocation}
                  onChange={e => setStatusLocation(e.target.value)}
                  placeholder="e.g. Frankfurt Air Cargo Facility (FRA-HUB)"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Audit Log Description / Dispatch Remarks</label>
                <textarea
                  rows={3}
                  value={statusComment}
                  onChange={e => setStatusComment(e.target.value)}
                  placeholder="e.g. Package cleared customs inspection and released to regional sorting conveyor."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-900 text-[11px]">
                Saving this status will immediately record a timestamped scan event in the immutable tracking audit log and update the live telemetry map for all customers!
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingShipment(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" /> Save & Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
