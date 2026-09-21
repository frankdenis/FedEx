import React, { useState } from 'react';
import {
  Code,
  Building2,
  TrendingUp,
  Cpu,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Layers,
  Key,
} from 'lucide-react';

interface BusinessSolutionsPageProps {
  onNavigate: (path: string) => void;
}

export const BusinessSolutionsPage: React.FC<BusinessSolutionsPageProps> = ({ onNavigate }) => {
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const sampleApiKey = 'nx_live_9488a91bf2e84d720c75a40b991';

  const handleCopyKey = () => {
    navigator.clipboard.writeText(sampleApiKey);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  const sampleCurl = `curl -X POST https://api.fedex-logistics.com/v1/shipments \\
  -H "Authorization: Bearer ${sampleApiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "service": "Express",
    "sender": { "city": "Memphis", "country": "US" },
    "recipient": { "city": "Frankfurt", "country": "DE" },
    "package": { "weight_kg": 4.5, "declared_value_usd": 650 }
  }'`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF6600]">
          Commercial & Enterprise Logistics
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-1 font-display">
          Scale Global Trade with FedEx Business Infrastructure
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2">
          From fast-growing e-commerce stores to Fortune 500 supply chains, unlock volume discounts, automated label generation, and developer REST APIs.
        </p>
      </div>

      {/* Solutions Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF6600] flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">FedEx for Growing SMBs</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Tiered volume discounts starting at 20 monthly shipments. Batch shipping label printing, free daily scheduled pickups, and 30-day corporate invoicing terms.
            </p>
            <ul className="mt-6 space-y-2 text-xs font-medium text-slate-700">
              <li className="flex items-center gap-2">✓ Up to 35% discount on international express</li>
              <li className="flex items-center gap-2">✓ Dedicated small business account manager</li>
              <li className="flex items-center gap-2">✓ Simplified return merchandise authorization</li>
            </ul>
          </div>

          <button
            onClick={() => onNavigate('/ship')}
            className="mt-8 w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
          >
            Create Business Account
          </button>
        </div>

        <div className="bg-white rounded-3xl p-8 border-2 border-cyan-500 shadow-md flex flex-col justify-between relative">
          <span className="absolute -top-3 right-8 bg-cyan-600 text-white text-[10px] font-mono uppercase font-bold px-3 py-0.5 rounded-full">
            Recommended
          </span>
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Enterprise Supply Chain</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Dedicated air charters, automated warehouse sortation integration, cross-docking facilities, and bespoke customs brokerage agreements.
            </p>
            <ul className="mt-6 space-y-2 text-xs font-medium text-slate-700">
              <li className="flex items-center gap-2">✓ Customized SLA & contracted freight capacity</li>
              <li className="flex items-center gap-2">✓ Multi-node warehouse fulfillment network</li>
              <li className="flex items-center gap-2">✓ Single global billing consolidation</li>
            </ul>
          </div>

          <button
            onClick={() => onNavigate('/support')}
            className="mt-8 w-full py-2.5 rounded-xl bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-500"
          >
            Contact Enterprise Sales
          </button>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">E-Commerce Platforms</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Seamless plug-ins for Shopify, WooCommerce, Magento, and custom storefronts. Live shipping rates at checkout with automated tracking email updates.
            </p>
            <ul className="mt-6 space-y-2 text-xs font-medium text-slate-700">
              <li className="flex items-center gap-2">✓ Live dynamic checkout rate calculation</li>
              <li className="flex items-center gap-2">✓ Paperless commercial invoice generation</li>
              <li className="flex items-center gap-2">✓ Automated customer delivery notifications</li>
            </ul>
          </div>

          <button
            onClick={() => onNavigate('/ship')}
            className="mt-8 w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
          >
            Explore Integrations
          </button>
        </div>
      </div>

      {/* Developer API & Webhooks Section */}
      <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-mono font-semibold uppercase mb-3">
              <Code className="w-3.5 h-3.5" />
              REST API & Webhook Infrastructure
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Developer-First Shipping API
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Programmatically create waybills, pull live GPS coordinates, validate addresses, and receive real-time webhook events on package status updates.
            </p>
          </div>

          {/* Sample Key Box */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shrink-0">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
              Sandbox API Token
            </span>
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono text-cyan-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                {sampleApiKey}
              </code>
              <button
                onClick={handleCopyKey}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs"
                title="Copy API Key"
              >
                {apiKeyCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Code Snippet Container */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              POST /v1/shipments — Generate Label & Waybill
            </span>
            <span>cURL / Node / Python</span>
          </div>

          <pre className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-cyan-300 text-xs font-mono overflow-x-auto leading-relaxed shadow-inner">
            {sampleCurl}
          </pre>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs text-slate-300">
          <div>
            <span className="font-bold text-white block">Real-time Webhooks</span>
            <p className="text-slate-400 mt-1">Receive immediate HTTP POST requests when a scan occurs at any international hub.</p>
          </div>
          <div>
            <span className="font-bold text-white block">Global Address Validation</span>
            <p className="text-slate-400 mt-1">Verify street names, postal codes, and city spellings across 220+ countries.</p>
          </div>
          <div>
            <span className="font-bold text-white block">99.99% API Uptime SLA</span>
            <p className="text-slate-400 mt-1">Fault-tolerant distributed edge endpoints engineered for mission-critical order pipelines.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
