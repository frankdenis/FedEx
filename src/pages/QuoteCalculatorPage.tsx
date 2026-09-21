import React, { useState } from 'react';
import {
  Calculator,
  ArrowRight,
  Package,
  Calendar,
  DollarSign,
  ShieldAlert,
  Sparkles,
  Info,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { ServiceTier } from '../types';

interface QuoteCalculatorPageProps {
  onNavigate: (path: string) => void;
}

interface ServiceQuoteOption {
  id: string;
  name: string;
  badge: string;
  transitTime: string;
  deliveryCommitment: string;
  baseRate: number;
  fuelSurcharge: number;
  customsEstimated: number;
  total: number;
  serviceType: ServiceTier;
}

export const QuoteCalculatorPage: React.FC<QuoteCalculatorPageProps> = ({ onNavigate }) => {
  const [originCountry, setOriginCountry] = useState('United States');
  const [originCity, setOriginCity] = useState('San Francisco');
  const [destCountry, setDestCountry] = useState('Germany');
  const [destCity, setDestCity] = useState('Berlin');
  const [packageType, setPackageType] = useState('Small Box');
  const [weight, setWeight] = useState(3.5);
  const [length, setLength] = useState(30);
  const [width, setWidth] = useState(20);
  const [height, setHeight] = useState(15);
  const [declaredValue, setDeclaredValue] = useState(250);
  const [calculatedQuotes, setCalculatedQuotes] = useState<ServiceQuoteOption[] | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    // Dimensional vs actual weight calculation
    const dimWeight = (length * width * height) / 5000;
    const chargeableWeight = Math.max(weight, dimWeight);

    const isIntercontinental = originCountry !== destCountry;
    const distanceFactor = isIntercontinental ? 1.8 : 1.0;

    const baseCost = chargeableWeight * 7.5 * distanceFactor;

    const quotes: ServiceQuoteOption[] = [
      {
        id: 'opt_exp_morning',
        name: 'FedEx First Overnight / Express 9:00 AM',
        badge: 'Critical Velocity',
        transitTime: 'Next Business Morning',
        deliveryCommitment: 'Sep 23, 2026 by 09:00 AM',
        baseRate: Math.round(baseCost * 2.8 + 40),
        fuelSurcharge: Math.round(baseCost * 0.12),
        customsEstimated: isIntercontinental ? 28 : 0,
        total: Math.round(baseCost * 2.8 + 40 + baseCost * 0.12 + (isIntercontinental ? 28 : 0)),
        serviceType: 'Express',
      },
      {
        id: 'opt_exp_midday',
        name: 'FedEx Priority Overnight 12:00 PM',
        badge: 'Priority Midday',
        transitTime: 'Next Business Day Midday',
        deliveryCommitment: 'Sep 23, 2026 by 12:00 PM',
        baseRate: Math.round(baseCost * 2.4 + 30),
        fuelSurcharge: Math.round(baseCost * 0.12),
        customsEstimated: isIntercontinental ? 28 : 0,
        total: Math.round(baseCost * 2.4 + 30 + baseCost * 0.12 + (isIntercontinental ? 28 : 0)),
        serviceType: 'Express',
      },
      {
        id: 'opt_priority_intl',
        name: 'FedEx International Priority',
        badge: 'Most Popular',
        transitTime: '2–3 Business Days',
        deliveryCommitment: 'Sep 24, 2026 by End of Day',
        baseRate: Math.round(baseCost * 1.7 + 20),
        fuelSurcharge: Math.round(baseCost * 0.10),
        customsEstimated: isIntercontinental ? 20 : 0,
        total: Math.round(baseCost * 1.7 + 20 + baseCost * 0.10 + (isIntercontinental ? 20 : 0)),
        serviceType: 'Priority',
      },
      {
        id: 'opt_standard',
        name: 'FedEx Ground / Economy',
        badge: 'Cost-Effective',
        transitTime: '4–6 Business Days',
        deliveryCommitment: 'Sep 28, 2026 by End of Day',
        baseRate: Math.round(baseCost * 1.1 + 10),
        fuelSurcharge: Math.round(baseCost * 0.08),
        customsEstimated: isIntercontinental ? 15 : 0,
        total: Math.round(baseCost * 1.1 + 10 + baseCost * 0.08 + (isIntercontinental ? 15 : 0)),
        serviceType: 'Standard',
      },
    ];

    setCalculatedQuotes(quotes);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-600">
          Transparent Rates & Tariffs
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1 font-display">
          Shipping Rate & Transit Calculator
        </h1>
        <p className="text-slate-600 text-sm mt-2">
          Compare guaranteed delivery speeds and calculate exact costs across all FedEx global transit options.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Calculator Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Calculator className="w-5 h-5 text-cyan-600" />
            <h2 className="font-bold text-base text-slate-900">Shipment Specifications</h2>
          </div>

          <form onSubmit={handleCalculate} className="space-y-4">
            {/* Origin & Destination */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Origin Country</label>
                  <select
                    value={originCountry}
                    onChange={e => setOriginCountry(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-1 focus:ring-cyan-500"
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
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Origin City</label>
                  <input
                    type="text"
                    value={originCity}
                    onChange={e => setOriginCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Destination Country</label>
                  <select
                    value={destCountry}
                    onChange={e => setDestCountry(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-1 focus:ring-cyan-500"
                  >
                    <option>Germany</option>
                    <option>Brazil</option>
                    <option>United States</option>
                    <option>Nigeria</option>
                    <option>United Kingdom</option>
                    <option>United Arab Emirates</option>
                    <option>Singapore</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Destination City</label>
                  <input
                    type="text"
                    value={destCity}
                    onChange={e => setDestCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Packaging type */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Package Form Factor</label>
              <select
                value={packageType}
                onChange={e => setPackageType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:ring-1 focus:ring-cyan-500"
              >
                <option>Document / Envelope (&lt; 0.5 kg)</option>
                <option>Small Box (Up to 5 kg)</option>
                <option>Medium Box (5–15 kg)</option>
                <option>Large Box (15–30 kg)</option>
                <option>Custom Heavy Parcel (30+ kg)</option>
                <option>Freight Pallet</option>
              </select>
            </div>

            {/* Weight and Dimensions */}
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Weight (kg)</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={weight}
                  onChange={e => setWeight(parseFloat(e.target.value) || 1)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">L (cm)</label>
                <input
                  type="number"
                  value={length}
                  onChange={e => setLength(parseInt(e.target.value) || 10)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">W (cm)</label>
                <input
                  type="number"
                  value={width}
                  onChange={e => setWidth(parseInt(e.target.value) || 10)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">H (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={e => setHeight(parseInt(e.target.value) || 10)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>

            {/* Declared Value */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Declared Value ($ USD)</label>
              <input
                type="number"
                value={declaredValue}
                onChange={e => setDeclaredValue(parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Calculate Live Rates
            </button>
          </form>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Available Delivery Services ({calculatedQuotes ? calculatedQuotes.length : '4 Pre-calculated'})
            </h2>
            <span className="text-xs text-slate-500">All prices in USD</span>
          </div>

          {(calculatedQuotes || [
            {
              id: 'init_1',
              name: 'FedEx First Overnight / Express 9:00 AM',
              badge: 'Critical Velocity',
              transitTime: 'Next Business Morning',
              deliveryCommitment: 'Sep 23, 2026 by 09:00 AM',
              baseRate: 98,
              fuelSurcharge: 12,
              customsEstimated: 28,
              total: 138,
              serviceType: 'Express' as ServiceTier,
            },
            {
              id: 'init_2',
              name: 'FedEx International Priority',
              badge: 'Most Popular',
              transitTime: '2–3 Business Days',
              deliveryCommitment: 'Sep 24, 2026 by End of Day',
              baseRate: 64,
              fuelSurcharge: 8,
              customsEstimated: 20,
              total: 92,
              serviceType: 'Priority' as ServiceTier,
            },
            {
              id: 'init_3',
              name: 'FedEx Ground / Economy',
              badge: 'Cost-Effective',
              transitTime: '4–6 Business Days',
              deliveryCommitment: 'Sep 28, 2026 by End of Day',
              baseRate: 38,
              fuelSurcharge: 5,
              customsEstimated: 15,
              total: 58,
              serviceType: 'Standard' as ServiceTier,
            },
          ]).map(q => (
            <div
              key={q.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-cyan-400 hover:shadow-md transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 font-bold border border-cyan-200">
                    {q.badge}
                  </span>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {q.transitTime}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900">{q.name}</h3>
                <div className="text-xs text-slate-500">
                  Commitment: <strong className="text-slate-700">{q.deliveryCommitment}</strong>
                </div>

                <div className="text-[11px] text-slate-400 pt-1">
                  Base: ${q.baseRate} • Fuel Surcharge: ${q.fuelSurcharge} • Est. Clearance: ${q.customsEstimated}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                <div className="text-right">
                  <div className="text-2xl font-extrabold font-mono text-slate-900">${q.total}.00</div>
                  <span className="text-[10px] text-emerald-600 font-semibold block">Money-back guarantee</span>
                </div>

                <button
                  onClick={() => onNavigate('/ship')}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-cyan-600 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  Ship with this Service <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
