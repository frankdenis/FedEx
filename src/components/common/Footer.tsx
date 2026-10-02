import React from 'react';
import { Logo } from './Logo';
import { Globe, Shield } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => (
  <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 pt-16 pb-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pb-12 border-b border-slate-800">
        <div className="col-span-2 space-y-4">
          <button type="button" onClick={() => onNavigate('/')} className="cursor-pointer">
            <Logo light size="lg" serviceVariant="Express" />
          </button>
          <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
            Global logistics services for shipments, freight, tracking and enterprise transport management.
          </p>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-[#FF6600] font-mono">
            <Globe className="w-3.5 h-3.5" />
            Global logistics
          </span>
        </div>
        <div><h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200 mb-4">Fleet & Equipment</h4><ul className="space-y-2.5 text-sm">
          <li><button onClick={() => onNavigate('/equipment')} className="hover:text-[#FF6600]">Equipment</button></li>
          <li><button onClick={() => onNavigate('/equipment?cat=air')} className="hover:text-purple-300">Air cargo</button></li>
          <li><button onClick={() => onNavigate('/equipment?cat=ground')} className="hover:text-purple-300">Ground transport</button></li>
          <li><button onClick={() => onNavigate('/equipment?cat=hub')} className="hover:text-purple-300">Hubs</button></li>
          <li><button onClick={() => onNavigate('/equipment?cat=specialized')} className="hover:text-purple-300">Specialized logistics</button></li>
        </ul></div>
        <div><h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200 mb-4">Shipping & Tools</h4><ul className="space-y-2.5 text-sm">
          <li><button onClick={() => onNavigate('/ship')} className="hover:text-[#FF6600]">Create shipment</button></li>
          <li><button onClick={() => onNavigate('/track')} className="hover:text-[#FF6600]">Track shipment</button></li>
          <li><button onClick={() => onNavigate('/quote')} className="hover:text-[#FF6600]">Rates & transit</button></li>
          <li><button onClick={() => onNavigate('/locations')} className="hover:text-[#FF6600]">Locations</button></li>
          <li><button onClick={() => onNavigate('/resources')} className="hover:text-[#FF6600]">Resources</button></li>
        </ul></div>
        <div><h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200 mb-4">Services</h4><ul className="space-y-2.5 text-sm">
          <li><button onClick={() => onNavigate('/services/express')} className="hover:text-[#FF6600]">Express</button></li>
          <li><button onClick={() => onNavigate('/services/international')} className="hover:text-[#FF6600]">International</button></li>
          <li><button onClick={() => onNavigate('/services/freight')} className="hover:text-[#FF6600]">Freight</button></li>
          <li><button onClick={() => onNavigate('/services/ecommerce')} className="hover:text-[#FF6600]">E-commerce</button></li>
          <li><button onClick={() => onNavigate('/services/returns')} className="hover:text-[#FF6600]">Returns</button></li>
        </ul></div>
        <div><h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200 mb-4">Control Center</h4><ul className="space-y-2.5 text-sm">
          <li><button onClick={() => onNavigate('/support')} className="hover:text-purple-300">Support</button></li>
          <li><button onClick={() => onNavigate('/customer/dashboard')} className="hover:text-purple-300">Customer portal</button></li>
          <li><button onClick={() => onNavigate('/admin/login')} className="hover:text-amber-400 flex items-center gap-1 font-semibold"><Shield className="w-3.5 h-3.5" />Admin</button></li>
          <li><button onClick={() => onNavigate('/resources')} className="hover:text-purple-300">Safety & compliance</button></li>
        </ul></div>
      </div>
      <div className="my-8 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center text-xs text-slate-400">
        <p className="font-semibold text-slate-200">Global logistics operations</p>
        <p className="text-[11px] mt-1">Live shipment information is provided by configured production systems and carrier integrations.</p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>© {new Date().getFullYear()} FedEx Global Logistics.</div>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <span>Global Privacy Policy</span><span>Conditions of Carriage</span><span>Accessibility</span>
        </div>
      </div>
    </div>
  </footer>
);