import React from 'react';
import { Logo } from './Logo';
import { Globe, Shield, RefreshCw, Heart, ArrowUpRight } from 'lucide-react';
import { resetDemoData } from '../../lib/store';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleResetData = () => {
    if (window.confirm('Reset operational registry and local cache to fresh defaults?')) {
      resetDemoData();
      alert('Local operational cache synchronized.');
      window.location.reload();
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pb-12 border-b border-slate-800">
          {/* Brand Info Column */}
          <div className="col-span-2 space-y-4">
            <div onClick={() => onNavigate('/')} className="cursor-pointer">
              <Logo light size="lg" serviceVariant="Express" />
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Moving your world forward with unmatched global air cargo reach, heavy intermodal highway transport, and state-of-the-art automated sorting hubs.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-[#FF6600] font-mono">
                <Globe className="w-3.5 h-3.5" />
                220+ Countries & Territories
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-purple-300 font-mono">
                710+ Cargo Aircraft
              </span>
              <button
                onClick={handleResetData}
                title="Synchronize and reset local operational cache"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Sync Cache
              </button>
            </div>
          </div>

          {/* Column 1: Fleet & Equipment */}
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200 mb-4">
              Fleet & Equipment
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('/equipment')} className="hover:text-[#FF6600] transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6600]" />
                  Heavy Fleet Showcase
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/equipment?cat=air')} className="hover:text-purple-300 transition-colors">
                  Air Cargo Jets (777F/MD-11)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/equipment?cat=ground')} className="hover:text-purple-300 transition-colors">
                  Electric Vans & Semis
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/equipment?cat=hub')} className="hover:text-purple-300 transition-colors">
                  Memphis SuperHub
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/equipment?cat=specialized')} className="hover:text-purple-300 transition-colors">
                  Cryogenic Cold-Chain
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Shipping */}
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200 mb-4">
              Shipping & Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('/ship')} className="hover:text-[#FF6600] transition-colors">
                  Create Shipment
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/track')} className="hover:text-[#FF6600] transition-colors">
                  Track Consignment
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/quote')} className="hover:text-[#FF6600] transition-colors">
                  Rates & Transit Times
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/locations')} className="hover:text-[#FF6600] transition-colors">
                  FedEx Ship Centers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/resources')} className="hover:text-[#FF6600] transition-colors">
                  Packaging & Palletizing
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200 mb-4">
              Service Divisions
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('/services/express')} className="hover:text-[#FF6600] transition-colors">
                  FedEx Express®
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/services/international')} className="hover:text-[#FF6600] transition-colors">
                  FedEx Ground®
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/services/freight')} className="hover:text-[#FF6600] transition-colors">
                  FedEx Freight®
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/services/ecommerce')} className="hover:text-[#FF6600] transition-colors">
                  FedEx Custom Critical®
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/services/returns')} className="hover:text-[#FF6600] transition-colors">
                  Global Trade & Customs
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Support & Governance */}
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200 mb-4">
              Control Center
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('/support')} className="hover:text-purple-300 transition-colors">
                  24/7 Operations Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/customer/dashboard')} className="hover:text-purple-300 transition-colors">
                  Enterprise Client Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/admin/login')} className="hover:text-amber-400 transition-colors flex items-center gap-1 font-semibold">
                  <Shield className="w-3.5 h-3.5" />
                  Dispatch Command
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/resources')} className="hover:text-purple-300 transition-colors">
                  Aviation Safety Standards
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Enterprise Operations Banner */}
        <div className="my-8 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center text-xs text-slate-400">
          <p className="font-semibold text-slate-200">
            FedEx Global Logistics — Heavy Equipment, Intercontinental Air Fleet & Worldwide Freight Operations.
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Global Hub Gateways: KMEM (Memphis), CDG (Paris), CAN (Guangzhou), IND (Indianapolis). Delivering continuous flights, priority tarmac routing, and sub-second sensor telemetry.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} FedEx Global Logistics. Engineered with aerospace precision.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Global Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Conditions of Carriage</span>
            <span className="hover:text-slate-400 cursor-pointer">Air Waybill Regulations</span>
            <span className="hover:text-slate-400 cursor-pointer">Accessibility (WCAG AA)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
