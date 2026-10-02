import React from 'react';
import { Logo } from './Logo';
import { Globe, Shield, ArrowUpRight, Package, Building2, Headphones } from 'lucide-react';
import { motion } from 'motion/react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => (
  <footer className="bg-[#08050d] text-slate-300 border-t border-slate-800/80 pt-16 pb-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-slate-800">
        <div className="sm:col-span-2 lg:col-span-2 space-y-5">
          <button type="button" onClick={() => onNavigate('/')} className="cursor-pointer">
            <Logo light size="lg" serviceVariant="Express" />
          </button>
          <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
            A modern shipping and logistics experience for individuals, businesses and global supply chains.
          </p>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#FF6600] font-mono">
            <Globe className="w-3.5 h-3.5" />
            Global logistics
          </span>
        </div>
        <div><h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2"><Package className="w-3.5 h-3.5 text-[#FF6600]" />Fleet & Equipment</h4><ul className="space-y-2.5 text-sm">
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
        <div><h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2"><Building2 className="w-3.5 h-3.5 text-cyan-400" />Control Center</h4><ul className="space-y-2.5 text-sm">
          <li><button onClick={() => onNavigate('/support')} className="hover:text-purple-300">Support</button></li>
          <li><button onClick={() => onNavigate('/dashboard')} className="hover:text-purple-300">Customer portal</button></li>
          <li><button onClick={() => onNavigate('/login')} className="hover:text-amber-400 flex items-center gap-1 font-semibold"><Shield className="w-3.5 h-3.5" />Admin</button></li>
          <li><button onClick={() => onNavigate('/resources')} className="hover:text-purple-300">Safety & compliance</button></li>
        </ul></div>
      </div>
      <motion.div whileHover={{ y: -2 }} className="my-8 p-5 rounded-2xl bg-gradient-to-r from-white/[0.06] to-white/[0.02] border border-white/10 text-center text-xs text-slate-400">
        <p className="font-semibold text-slate-200">Global logistics operations</p>
        <p className="text-[11px] mt-1">Live shipment information is provided by configured production systems and carrier integrations.</p>
      </motion.div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>© {new Date().getFullYear()} FedEx Global Logistics.</div>
        <div className="flex flex-wrap items-center justify-center gap-6"><button onClick={() => onNavigate('/support')} className="hover:text-white inline-flex items-center gap-1">Support <Headphones className="w-3 h-3" /></button>
          <button onClick={() => onNavigate('/resources')} className="hover:text-white">Global Privacy Policy</button><button onClick={() => onNavigate('/resources')} className="hover:text-white">Conditions of Carriage</button><button onClick={() => onNavigate('/resources')} className="hover:text-white inline-flex items-center gap-1">Accessibility <ArrowUpRight className="w-3 h-3" /></button>
        </div>
      </div>
    </div>
  </footer>
);