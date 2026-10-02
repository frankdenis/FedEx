import React, { useState } from 'react';
import {
  Package,
  User,
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Printer,
  ShieldCheck,
  Calendar,
  DollarSign,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { getCurrentUser } from '../lib/store';
import { api } from '../lib/api';
import { Shipment, ServiceTier } from '../types';

interface ShipNowPageProps {
  onNavigate: (path: string) => void;
}

export const ShipNowPage: React.FC<ShipNowPageProps> = ({ onNavigate }) => {
  const currentUser = getCurrentUser();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [sender, setSender] = useState({
    name: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '',
    company: currentUser?.company || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const [recipient, setRecipient] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const [packageInfo, setPackageInfo] = useState({
    type: 'Parcel' as 'Document' | 'Parcel' | 'Freight' | 'Pallet',
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    declaredValue: 0,
    currency: 'USD',
    description: '',
    isFragile: false,
    isHazardous: false,
    signatureRequired: false,
  });

  const [selectedService, setSelectedService] = useState<ServiceTier>('Express');
  const [pickupOption, setPickupOption] = useState<'pickup' | 'dropoff'>('pickup');
  const [pickupDate, setPickupDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'account'>('card');
  const [createdShipment, setCreatedShipment] = useState<Shipment | null>(null);

  const [liveQuote, setLiveQuote] = useState<{ price: number; estDaysMin: number; estDaysMax: number } | null>(null);
  const subtotal = liveQuote?.price ?? 0;
  const insuranceFee = 0;
  const totalAmount = liveQuote?.price ?? 0;

  const handleCreateShipment = async () => {
    try {
      const quote = await api.quote({
        service: selectedService,
        weightKg: packageInfo.weight,
        originCountry: sender.country,
        destCountry: recipient.country,
      });
      setLiveQuote(quote);
      const created = await api.createShipment({
        sender,
        recipient,
        packageInfo: { ...packageInfo, pieces: 1 },
        service: selectedService,
        pickupOption,
        pickupDate,
        paymentMethod,
      });
      setCreatedShipment(created as Shipment);
      const checkout = await api.createPaymentCheckout(created.id);
      if (!checkout.checkoutUrl) throw new Error('Payment checkout could not be created.');
      window.location.assign(checkout.checkoutUrl);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Unable to create shipment through the production API.');
    }
  };

  const steps = [
    { num: 1, label: 'Sender' },
    { num: 2, label: 'Recipient' },
    { num: 3, label: 'Package' },
    { num: 4, label: 'Service' },
    { num: 5, label: 'Review & Pay' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-600">
          Seamless Consignment Dispatch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
          Create New Shipment
        </h1>
        <p className="text-slate-600 text-sm mt-2">
          Generate international waybills, calculate duties, schedule courier collection, and print barcoded shipping labels.
        </p>
      </div>

      {/* Stepper Progress Header */}
      {currentStep <= 5 && (
        <div className="mb-10 bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center max-w-2xl mx-auto">
            {steps.map(s => (
              <div key={s.num} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep === s.num
                      ? 'bg-cyan-600 text-white ring-4 ring-cyan-100'
                      : currentStep > s.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400 border border-slate-300'
                  }`}
                >
                  {currentStep > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <span
                  className={`text-[11px] mt-1 font-medium hidden sm:inline ${
                    currentStep === s.num ? 'text-cyan-900 font-bold' : 'text-slate-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Sender */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 1: Shipper (Origin) Information</h2>
              <p className="text-xs text-slate-500">Specify pickup or departure point for this consignment.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Name *</label>
              <input
                type="text"
                value={sender.name}
                onChange={e => setSender({ ...sender, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company (Optional)</label>
              <input
                type="text"
                value={sender.company}
                onChange={e => setSender({ ...sender, company: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                value={sender.email}
                onChange={e => setSender({ ...sender, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                value={sender.phone}
                onChange={e => setSender({ ...sender, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address *</label>
              <input
                type="text"
                value={sender.address}
                onChange={e => setSender({ ...sender, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
              <input
                type="text"
                value={sender.city}
                onChange={e => setSender({ ...sender, city: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State / Province</label>
                <input
                  type="text"
                  value={sender.state}
                  onChange={e => setSender({ ...sender, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Postal Code *</label>
                <input
                  type="text"
                  value={sender.postalCode}
                  onChange={e => setSender({ ...sender, postalCode: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Country *</label>
              <select
                value={sender.country}
                onChange={e => setSender({ ...sender, country: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
              >
                <option>United States</option>
                <option>Germany</option>
                <option>Nigeria</option>
                <option>United Kingdom</option>
                <option>Brazil</option>
                <option>United Arab Emirates</option>
                <option>Singapore</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm flex items-center gap-2"
            >
              Continue to Recipient <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Recipient */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 2: Recipient (Consignee) Details</h2>
              <p className="text-xs text-slate-500">Provide destination address and delivery recipient contact.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient Full Name *</label>
              <input
                type="text"
                value={recipient.name}
                onChange={e => setRecipient({ ...recipient, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization</label>
              <input
                type="text"
                value={recipient.company}
                onChange={e => setRecipient({ ...recipient, company: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                value={recipient.email}
                onChange={e => setRecipient({ ...recipient, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone *</label>
              <input
                type="tel"
                value={recipient.phone}
                onChange={e => setRecipient({ ...recipient, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Destination Address *</label>
              <input
                type="text"
                value={recipient.address}
                onChange={e => setRecipient({ ...recipient, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
              <input
                type="text"
                value={recipient.city}
                onChange={e => setRecipient({ ...recipient, city: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State / Province</label>
                <input
                  type="text"
                  value={recipient.state}
                  onChange={e => setRecipient({ ...recipient, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Postal Code *</label>
                <input
                  type="text"
                  value={recipient.postalCode}
                  onChange={e => setRecipient({ ...recipient, postalCode: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Destination Country *</label>
              <select
                value={recipient.country}
                onChange={e => setRecipient({ ...recipient, country: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
              >
                <option>Germany</option>
                <option>Brazil</option>
                <option>United States</option>
                <option>Nigeria</option>
                <option>United Kingdom</option>
                <option>United Arab Emirates</option>
                <option>Singapore</option>
                <option>Australia</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm flex items-center gap-2"
            >
              Continue to Package <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Package Details */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 3: Package Specifications & Dimensions</h2>
              <p className="text-xs text-slate-500">Define weight, dimensions, declared cargo value, and handling requirements.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Package Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['Document', 'Parcel', 'Freight', 'Pallet'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPackageInfo({ ...packageInfo, type })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      packageInfo.type === type
                        ? 'bg-cyan-50 border-cyan-500 text-cyan-900 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="text-sm">{type}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (kg) *</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={packageInfo.weight}
                  onChange={e => setPackageInfo({ ...packageInfo, weight: parseFloat(e.target.value) || 1 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Length (cm)</label>
                <input
                  type="number"
                  value={packageInfo.length}
                  onChange={e => setPackageInfo({ ...packageInfo, length: parseInt(e.target.value) || 10 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Width (cm)</label>
                <input
                  type="number"
                  value={packageInfo.width}
                  onChange={e => setPackageInfo({ ...packageInfo, width: parseInt(e.target.value) || 10 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={packageInfo.height}
                  onChange={e => setPackageInfo({ ...packageInfo, height: parseInt(e.target.value) || 10 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Declared Value ($ USD)</label>
                <input
                  type="number"
                  value={packageInfo.declaredValue}
                  onChange={e => setPackageInfo({ ...packageInfo, declaredValue: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contents Description *</label>
                <input
                  type="text"
                  value={packageInfo.description}
                  onChange={e => setPackageInfo({ ...packageInfo, description: e.target.value })}
                  placeholder="e.g. Precision Laboratory Sensors"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Special handling checkboxes */}
            <div className="pt-2 flex flex-wrap gap-6 text-xs text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={packageInfo.isFragile}
                  onChange={e => setPackageInfo({ ...packageInfo, isFragile: e.target.checked })}
                  className="rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span className="font-semibold">Fragile Cargo (Special Cushioning)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={packageInfo.signatureRequired}
                  onChange={e => setPackageInfo({ ...packageInfo, signatureRequired: e.target.checked })}
                  className="rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span className="font-semibold">Direct Signature Required Upon Delivery</span>
              </label>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm flex items-center gap-2"
            >
              Continue to Services <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Service Selection & Pickup Options */}
      {currentStep === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 4: Transit Speed & Pickup Method</h2>
              <p className="text-xs text-slate-500">Choose velocity tier and doorstep courier collection or facility drop-off.</p>
            </div>
          </div>

          {/* Tier Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setSelectedService('Express')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedService === 'Express'
                  ? 'border-[#4D148C] bg-purple-50/40 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-extrabold text-slate-900 text-base">FedEx Express Air</span>
                <span className="text-xs font-mono font-bold text-[#4D148C]">Rate returned at confirmation</span>
              </div>
              <p className="text-xs text-slate-600">Guaranteed delivery within 24–48 hours with priority flight manifests.</p>
              <div className="mt-3 text-[11px] font-mono text-[#FF6600] font-semibold">Live delivery estimate from rate API</div>
            </div>

            <div
              onClick={() => setSelectedService('Priority')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedService === 'Priority'
                  ? 'border-[#4D148C] bg-purple-50/40 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-extrabold text-slate-900 text-base">FedEx Priority International</span>
                <span className="text-xs font-mono font-bold text-slate-700">Rate returned at confirmation</span>
              </div>
              <p className="text-xs text-slate-600">Reliable cross-border transit in 3–4 business days with customs clearance.</p>
              <div className="mt-3 text-[11px] font-mono text-slate-600 font-semibold">Live delivery estimate from rate API</div>
            </div>

            <div
              onClick={() => setSelectedService('Standard')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedService === 'Standard'
                  ? 'border-[#4D148C] bg-purple-50/40 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-extrabold text-slate-900 text-base">FedEx Standard Ground</span>
                <span className="text-xs font-mono font-bold text-slate-700">Rate returned at confirmation</span>
              </div>
              <p className="text-xs text-slate-600">Cost-effective economic highway transit in 5–7 business days.</p>
              <div className="mt-3 text-[11px] font-mono text-slate-600 font-semibold">Live delivery estimate from rate API</div>
            </div>

            <div
              onClick={() => setSelectedService('Freight')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedService === 'Freight'
                  ? 'border-cyan-600 bg-cyan-50/40 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-extrabold text-slate-900 text-base">Heavy Freight Charter</span>
                <span className="text-xs font-mono font-bold text-slate-700">Rate returned at confirmation</span>
              </div>
              <p className="text-xs text-slate-600">Palletized cargo and high-tonnage multi-stop line haul logistics.</p>
              <div className="mt-3 text-[11px] font-mono text-slate-600 font-semibold">Live delivery estimate from rate API</div>
            </div>
          </div>

          {/* Collection Method */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Collection Preference</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer ${pickupOption === 'pickup' ? 'bg-slate-50 border-cyan-500' : 'border-slate-200'}`}>
                <input
                  type="radio"
                  name="collection"
                  checked={pickupOption === 'pickup'}
                  onChange={() => setPickupOption('pickup')}
                  className="mt-1 text-cyan-600 focus:ring-cyan-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Schedule Courier Pickup (Doorstep)</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">A FedEx uniformed driver will pick up at shipper address.</div>
                </div>
              </label>

              <label className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer ${pickupOption === 'dropoff' ? 'bg-slate-50 border-cyan-500' : 'border-slate-200'}`}>
                <input
                  type="radio"
                  name="collection"
                  checked={pickupOption === 'dropoff'}
                  onChange={() => setPickupOption('dropoff')}
                  className="mt-1 text-cyan-600 focus:ring-cyan-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Drop off at FedEx Ship Center / Drop Box</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Bring package to any authorized hub, FedEx Office, or drop-box locker.</div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-sm flex items-center gap-2"
            >
              Continue to Review <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Review & Payment */}
      {currentStep === 5 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 5: Review Consignment & Confirm Order</h2>
              <p className="text-xs text-slate-500">Review shipment details. Live rate and shipment creation are processed by the production API.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Summary details */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Routing Overview</div>
                <div className="text-sm font-bold text-slate-900">
                  {sender.city}, {sender.country} → {recipient.city}, {recipient.country}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Service: <strong>FedEx {selectedService}</strong>
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Cargo: <strong>{packageInfo.weight} kg</strong> ({packageInfo.description})
                </div>
              </div>

              {/* Payment selector */}
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold ${
                      paymentMethod === 'card' ? 'bg-purple-50 border-[#4D148C] text-[#4D148C]' : 'border-slate-200'
                    }`}
                  >
                    Credit / Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('account')}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold ${
                      paymentMethod === 'account' ? 'bg-purple-50 border-[#4D148C] text-[#4D148C]' : 'border-slate-200'
                    }`}
                  >
                    Bill FedEx Corporate Account
                  </button>
                </div>
              </div>
            </div>

            {/* Price breakdown invoice */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-4 font-semibold">
                  Charges Breakdown
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Base Freight Tariff</span>
                    <span className="font-mono">${subtotal}.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customs Documentation & Clearance</span>
                    <span className="font-mono text-emerald-400">Included</span>
                  </div>
                  {insuranceFee > 0 && (
                    <div className="flex justify-between">
                      <span>Cargo Insurance Premium</span>
                      <span className="font-mono">${insuranceFee}.00</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Fuel Surcharge & Terminal Handling</span>
                    <span className="font-mono text-emerald-400">$0.00 (Waived)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Total Billed:</span>
                  <div className="text-2xl font-mono font-extrabold text-white">{liveQuote ? `${totalAmount.toFixed(2)}` : 'Live rate pending'}</div>
                </div>
                <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950 px-2 py-1 rounded border border-cyan-800">
                  USD
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleCreateShipment}
              className="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
            >
              <FileCheck className="w-5 h-5" />
              Get Live Rate & Create Shipment
            </button>
          </div>
        </div>
      )}

      {/* Step 6: Confirmation & Printable Waybill Barcode */}
      {currentStep === 6 && createdShipment && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8 animate-in zoom-in-95 duration-200">
          <div className="text-center max-w-lg mx-auto space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Shipment Successfully Created!
            </h2>
            <p className="text-sm text-slate-600">
              Your consignment is registered in the FedEx Global Logistics Network. Keep this tracking code for real-time telemetry.
            </p>
          </div>

          {/* Printable Waybill Card with Barcode */}
          <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 max-w-xl mx-auto font-mono text-xs text-slate-900">
            <div className="flex justify-between items-center pb-4 border-b border-slate-300">
              <div className="font-extrabold text-base tracking-wider text-[#4D148C]">FEDEX AIR WAYBILL</div>
              <div className="text-[#FF6600] font-bold">{createdShipment.service.toUpperCase()} PRIORITY</div>
            </div>

            <div className="py-4 grid grid-cols-2 gap-4 border-b border-slate-300">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Shipper (Origin)</span>
                <p className="font-bold">{createdShipment.sender.name}</p>
                <p>{createdShipment.sender.city}, {createdShipment.sender.country}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Consignee (Destination)</span>
                <p className="font-bold">{createdShipment.recipient.name}</p>
                <p>{createdShipment.recipient.city}, {createdShipment.recipient.country}</p>
              </div>
            </div>

            {/* Barcode graphic */}
            <div className="py-6 text-center space-y-2">
              <div className="flex justify-center items-center gap-[3px] h-14 overflow-hidden">
                {[4, 2, 6, 1, 3, 5, 2, 4, 1, 7, 3, 2, 5, 4, 2, 6, 1, 3, 5, 2, 4, 1, 7, 3, 2, 5, 4, 2, 6, 1, 3, 5, 2, 4].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="bg-slate-900"
                      style={{
                        width: i % 3 === 0 ? '3px' : '2px',
                        height: '100%',
                        opacity: i % 5 === 0 ? 0.9 : 1,
                      }}
                    />
                  )
                )}
              </div>
              <div className="font-extrabold text-base tracking-widest text-slate-900">
                {createdShipment.trackingNumber}
              </div>
            </div>

            <div className="flex justify-between pt-2 text-[10px] text-slate-500 border-t border-slate-300">
              <span>WEIGHT: {createdShipment.packageInfo.weight} KG</span>
              <span>INVOICE: {createdShipment.invoiceNumber}</span>
              <span>STATUS: CREATED</span>
            </div>
          </div>

          {/* Action links */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Print Waybill Label
            </button>

            <button
              onClick={() => onNavigate(`/track?q=${createdShipment.trackingNumber}`)}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
            >
              Track Live Journey Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
