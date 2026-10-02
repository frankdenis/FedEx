import React, { useState, useEffect } from 'react';
import {
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Printer,
  Download,
  Trash2,
  Edit2,
  Calendar,
  CreditCard,
  Bell,
  MapPin,
  Truck,
  ExternalLink,
  HardDrive,
} from 'lucide-react';
import {
  getCurrentUser,
  getShipments,
  getAddresses,
  addAddress,
  deleteAddress,
  getPickupRequests,
  addPickupRequest,
  getInvoices,
} from '../lib/store';
import { Shipment, SavedAddress, PickupRequest } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';

interface CustomerDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const CustomerDashboardPage: React.FC<CustomerDashboardPageProps> = ({ onNavigate }) => {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [activeTab, setActiveTab] = useState<'overview' | 'shipments' | 'addresses' | 'pickups' | 'billing'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Address book state
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: '',
    company: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    isDefault: false,
  });

  // Pickups state
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [newPickup, setNewPickup] = useState({
    pickupDate: '2026-09-23',
    timeSlot: '13:00 - 17:00' as const,
    locationAddress: '450 Mission Street, Suite 1200, San Francisco, CA',
    packageCount: 2,
    totalWeightKg: 8.5,
    specialInstructions: 'Ring Suite 1200 buzzer at service elevator.',
  });

  const [invoices, setInvoices] = useState(getInvoices());

  const refreshData = () => {
    setCurrentUser(getCurrentUser());
    setAddresses(getAddresses());
    setPickups(getPickupRequests());
    setInvoices(getInvoices());
  };

  useEffect(() => {
    refreshData();
    window.addEventListener('fedex-storage-update', refreshData);
    window.addEventListener('nexora-storage-update', refreshData);
    return () => {
      window.removeEventListener('fedex-storage-update', refreshData);
      window.removeEventListener('nexora-storage-update', refreshData);
    };
  }, []);

  const allShipments = getShipments();
  // Only server-backed customer shipments are displayed
  const filteredShipments = allShipments.filter(s => {
    const matchesSearch =
      s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.recipient.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = allShipments.filter(s => s.status !== 'Delivered' && s.status !== 'Shipment Cancelled').length;
  const deliveredCount = allShipments.filter(s => s.status === 'Delivered').length;
  const pendingPickupCount = pickups.filter(p => p.status === 'scheduled').length;
  const exceptionCount = allShipments.filter(s => s.status === 'Exception' || s.status === 'Shipment Delayed').length;

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.name || !newAddr.address || !newAddr.city) return;

    addAddress({
      id: `addr_${Date.now()}`,
      userId: currentUser?.id || '',
      ...newAddr,
    });
    setShowAddressModal(false);
    setNewAddr({
      name: '',
      company: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
      isDefault: false,
    });
  };

  const handleSchedulePickup = (e: React.FormEvent) => {
    e.preventDefault();
    addPickupRequest({
      id: `pickup_${Date.now()}`,
      userId: currentUser?.id || 'usr_demo_customer',
      ...newPickup,
      status: 'scheduled',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    });
    setShowPickupModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner with User Greeting & Quick Actions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF6600]">
              Customer Operations Portal
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
              Account Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 font-display">
            Welcome back, {currentUser?.firstName || 'Sarah'} {currentUser?.lastName || 'Jenkins'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {currentUser?.company || 'Apex BioHealth Logistics'} • FedEx Account #FDX-94819
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('/ship')}
            className="px-4 py-2.5 rounded-xl bg-[#4D148C] hover:bg-purple-900 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" /> Ship a Package
          </button>
          <button
            onClick={() => setShowPickupModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Truck className="w-4 h-4" /> Schedule Pickup
          </button>
          <button
            onClick={() => onNavigate('/quote')}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
          >
            Get a Quote
          </button>
          <button
            onClick={() => onNavigate('/drive')}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <HardDrive className="w-4 h-4 text-amber-500" /> Drive Archive
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">In-Transit Shipments</span>
            <Package className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">{activeCount}</div>
          <span className="text-[11px] text-cyan-700 font-medium">Tracking in live corridors</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Delivered This Month</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">{deliveredCount}</div>
          <span className="text-[11px] text-emerald-700 font-medium">100% on-time commitment</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Pending Courier Pickups</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">{pendingPickupCount}</div>
          <span className="text-[11px] text-blue-700 font-medium">Doorstep dispatch scheduled</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Transit Exceptions</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">{exceptionCount}</div>
          <span className="text-[11px] text-amber-700 font-medium">Weather / Customs review</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-6 text-sm font-semibold overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'All Shipments' },
          { id: 'addresses', label: 'Address Book' },
          { id: 'pickups', label: 'Pickup Requests' },
          { id: 'billing', label: 'Billing & Invoices' },
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

      {/* TAB 1: SHIPMENTS TABLE */}
      {(activeTab === 'overview' || activeTab === 'shipments') && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pb-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search tracking, recipient, city..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Filter Status:</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="text-xs p-2 rounded-xl border border-slate-300 bg-white"
              >
                <option>All</option>
                <option>In Transit</option>
                <option>Delivered</option>
                <option>Out for Delivery</option>
                <option>Customs Clearance</option>
                <option>Exception</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 divide-y divide-slate-100">
              <thead>
                <tr className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                  <th className="py-3 px-3">Tracking Number</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Service</th>
                  <th className="py-3 px-3">Recipient</th>
                  <th className="py-3 px-3">Destination</th>
                  <th className="py-3 px-3">Est. Delivery</th>
                  <th className="py-3 px-3 text-right">Actions</th>
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
                    <td className="py-3.5 px-3 text-slate-900">
                      {s.recipient.name}
                    </td>
                    <td className="py-3.5 px-3">
                      {s.recipient.city}, {s.recipient.country}
                    </td>
                    <td className="py-3.5 px-3 font-mono">
                      {s.estimatedDelivery}
                    </td>
                    <td className="py-3.5 px-3 text-right space-x-2">
                      <button
                        onClick={() => onNavigate(`/track?q=${s.trackingNumber}`)}
                        className="p-1.5 rounded-lg hover:bg-cyan-50 text-cyan-700 font-semibold text-[11px]"
                        title="Live Map & Telemetry"
                      >
                        Track
                      </button>
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ADDRESS BOOK */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Saved Address Directory</h2>
            <button
              onClick={() => setShowAddressModal(true)}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add New Address
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {addresses.map(addr => (
              <div
                key={addr.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-900">{addr.name}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 font-bold border border-cyan-100">
                        Default
                      </span>
                    )}
                  </div>
                  {addr.company && <div className="text-xs text-slate-500 font-medium">{addr.company}</div>}
                  <div className="text-xs text-slate-600 mt-2 space-y-0.5">
                    <p>{addr.address}</p>
                    <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                    <p className="font-semibold text-slate-700">{addr.country}</p>
                    <p className="text-slate-400 mt-1">{addr.phone}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <button
                    onClick={() => onNavigate('/ship')}
                    className="text-cyan-700 font-semibold hover:underline"
                  >
                    Ship to this address →
                  </button>
                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Delete address"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PICKUP REQUESTS */}
      {activeTab === 'pickups' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Courier Doorstep Collections</h2>
            <button
              onClick={() => setShowPickupModal(true)}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Book Pickup
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-600 divide-y divide-slate-100">
              <thead className="bg-slate-50 text-[10px] font-mono uppercase text-slate-400 font-semibold">
                <tr>
                  <th className="py-3 px-4">Pickup Date</th>
                  <th className="py-3 px-4">Time Window</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">Packages / Weight</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {pickups.map(p => (
                  <tr key={p.id}>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.pickupDate}</td>
                    <td className="py-3.5 px-4 text-cyan-800">{p.timeSlot}</td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate">{p.locationAddress}</td>
                    <td className="py-3.5 px-4 font-mono">{p.packageCount} pkgs ({p.totalWeightKg} kg)</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BILLING & INVOICES */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Commercial Invoices & Accounts</h2>
            <span className="text-xs text-slate-400">Export available from billing API</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-600 divide-y divide-slate-100">
              <thead className="bg-slate-50 text-[10px] font-mono uppercase text-slate-400 font-semibold">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {invoices.map(inv => (
                  <tr key={inv.id}>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                    <td className="py-3.5 px-4 text-slate-500">{inv.date}</td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900">${inv.amount}.00</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-xs text-slate-400">PDF service required</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Add New Address to Directory</h3>
            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Name *</label>
                <input
                  type="text"
                  required
                  value={newAddr.name}
                  onChange={e => setNewAddr({ ...newAddr, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company</label>
                <input
                  type="text"
                  value={newAddr.company}
                  onChange={e => setNewAddr({ ...newAddr, company: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={newAddr.address}
                  onChange={e => setNewAddr({ ...newAddr, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={newAddr.city}
                    onChange={e => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={newAddr.postalCode}
                    onChange={e => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Pickup Modal */}
      {showPickupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Schedule Doorstep Courier Collection</h3>
            <form onSubmit={handleSchedulePickup} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pickup Date</label>
                <input
                  type="date"
                  value={newPickup.pickupDate}
                  onChange={e => setNewPickup({ ...newPickup, pickupDate: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Time Window</label>
                <select
                  value={newPickup.timeSlot}
                  onChange={e => setNewPickup({ ...newPickup, timeSlot: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option>09:00 - 13:00</option>
                  <option>13:00 - 17:00</option>
                  <option>17:00 - 20:00</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pickup Address</label>
                <input
                  type="text"
                  value={newPickup.locationAddress}
                  onChange={e => setNewPickup({ ...newPickup, locationAddress: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Packages Count</label>
                  <input
                    type="number"
                    min="1"
                    value={newPickup.packageCount}
                    onChange={e => setNewPickup({ ...newPickup, packageCount: parseInt(e.target.value) || 1 })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Est. Weight (kg)</label>
                  <input
                    type="number"
                    value={newPickup.totalWeightKg}
                    onChange={e => setNewPickup({ ...newPickup, totalWeightKg: parseFloat(e.target.value) || 1 })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPickupModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold"
                >
                  Confirm Pickup Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
