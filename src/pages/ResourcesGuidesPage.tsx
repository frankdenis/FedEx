import React, { useState } from 'react';
import {
  BookOpen,
  Package,
  FileText,
  AlertOctagon,
  TrendingDown,
  Download,
  ChevronDown,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

interface ResourcesGuidesPageProps {
  onNavigate: (path: string) => void;
}

export const ResourcesGuidesPage: React.FC<ResourcesGuidesPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'packaging' | 'customs' | 'prohibited' | 'fuel'>('packaging');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-600">
          Knowledge Base & Regulatory Compliance
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-1">
          Logistics Resources & Shipping Guides
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2">
          Comprehensive packaging standards, international customs preparation, prohibited commodity directories, and live jet fuel indexes.
        </p>
      </div>

      {/* Resource Category Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('packaging')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border ${
            activeTab === 'packaging'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
          }`}
        >
          <Package className="w-4 h-4 text-cyan-400" />
          Packaging Guidelines
        </button>

        <button
          onClick={() => setActiveTab('customs')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border ${
            activeTab === 'customs'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4 text-cyan-400" />
          Customs Documentation & HS Codes
        </button>

        <button
          onClick={() => setActiveTab('prohibited')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border ${
            activeTab === 'prohibited'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
          }`}
        >
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          Prohibited & Dangerous Goods
        </button>

        <button
          onClick={() => setActiveTab('fuel')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border ${
            activeTab === 'fuel'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
          }`}
        >
          <TrendingDown className="w-4 h-4 text-cyan-400" />
          Fuel Surcharge Index
        </button>
      </div>

      {/* Tab 1: Packaging Guidelines */}
      {activeTab === 'packaging' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 font-display">
              The FedEx Standard: Engineering Parcel Protection
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Proper packaging prevents transit damage, reduces dimensional weight surcharges, and ensures fast automated sorting through our high-speed conveyor belts.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="font-bold text-sm text-slate-900 mb-2">1. Double-Wall Corrugated Boxes</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Always use rigid boxes with intact flaps. For items exceeding 10 kg, utilize double-walled corrugated fiberboard tested to at least 200 lbs/sq inch burst strength.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="font-bold text-sm text-slate-900 mb-2">2. The 5-cm Cushioning Rule</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Wrap items individually and leave at least 5 cm (2 inches) of cushioning material (bubble wrap, air pillows, or foam inserts) between the item and the outer walls.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="font-bold text-sm text-slate-900 mb-2">3. The H-Taping Sealing Method</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Apply heavy-duty pressure-sensitive plastic tape (minimum 5 cm wide) along center seams and both edge seams to form a structural "H" pattern on top and bottom.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-cyan-900 block">Download Packaging Manual (PDF)</span>
                <span className="text-[11px] text-cyan-700">Official technical specifications for electronics, glassware, and pallets.</span>
              </div>
              <button
                onClick={() => alert('Simulated PDF manual downloaded.')}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Customs Documentation */}
      {activeTab === 'customs' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">
              International Customs Documentation Guide
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Every package crossing international borders requires statutory commercial declarations. Accurate documentation eliminates regulatory delays and avoids punitive customs storage fees.
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-sm text-slate-900">1. Commercial Invoice (CI)</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Required for all non-document cross-border movements. Must include full shipper and consignee addresses, tax/VAT/EIN numbers, clear itemized descriptions (e.g. "Cotton Knit T-Shirts", not "Apparel"), unit prices, and total declared value.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-sm text-slate-900">2. Harmonized System (HS) Tariff Codes</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Standardized 6- to 10-digit numerical codes used by global customs agencies to classify goods and calculate duty percentages. FedEx's digital shipping portal automatically validates HS codes during creation.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-sm text-slate-900">3. Incoterms® 2020 Definitions</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Specify whether the shipper (DDP - Delivered Duty Paid) or the recipient (DDU/DAP - Delivered at Place) is legally responsible for clearing local import tariffs and taxes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Prohibited Goods */}
      {activeTab === 'prohibited' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertOctagon className="w-6 h-6" />
              <h2 className="text-2xl font-bold text-slate-900">Prohibited & Regulated Commodities</h2>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              In accordance with international civil aviation standards (ICAO/IATA) and universal postal treaties, the following items are strictly prohibited from carriage aboard the FedEx aircraft fleet:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 text-xs">
                <span className="font-bold text-rose-900 block mb-1">Strictly Prohibited Goods</span>
                <ul className="list-disc pl-4 space-y-1 text-rose-800">
                  <li>Explosives, ammunition, fireworks, and flares</li>
                  <li>Flammable liquids, paints, lighter refills, and aerosols</li>
                  <li>Corrosive acids, radioactive materials, and poison</li>
                  <li>Uncertified bulk lithium batteries (UN3480/UN3481)</li>
                  <li>Counterfeit currency, unregistered firearms, and narcotics</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 text-xs">
                <span className="font-bold text-amber-900 block mb-1">Restricted Goods (Special Permits Required)</span>
                <ul className="list-disc pl-4 space-y-1 text-amber-800">
                  <li>Prescription pharmaceuticals and clinical samples</li>
                  <li>Perishable foodstuffs requiring temperature logging</li>
                  <li>Precious bullion, works of art, and high-value jewelry</li>
                  <li>Dry ice shipments (IATA Dangerous Goods Regulation)</li>
                  <li>Alcohol, spirits, and controlled botanical specimens</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Fuel Surcharge */}
      {activeTab === 'fuel' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Transparent Fuel Surcharge Index
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              FedEx links fuel surcharges directly to monthly average spot prices for US Gulf Coast (USGC) kerosene-type jet fuel, updated dynamically on the first Monday of each month.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono uppercase text-slate-400">Current Month (September 2026)</span>
                <div className="text-3xl font-extrabold font-mono text-cyan-950 mt-1">12.5%</div>
                <span className="text-xs text-slate-600">Air Express Line-Haul</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono uppercase text-slate-400">Ground Surcharge</span>
                <div className="text-3xl font-extrabold font-mono text-slate-900 mt-1">8.0%</div>
                <span className="text-xs text-slate-600">Inland Fleet Trucks</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono uppercase text-slate-400">Maritime Freight</span>
                <div className="text-3xl font-extrabold font-mono text-slate-900 mt-1">6.2%</div>
                <span className="text-xs text-slate-600">Bunker Fuel Index (BAF)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
