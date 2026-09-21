import React, { useState } from 'react';
import { Shipment, RouteWaypoint } from '../../types';
import { Plane, Navigation, Globe2, CheckCircle, Clock } from 'lucide-react';

interface ShipmentMapProps {
  shipment: Shipment;
}

export const ShipmentMap: React.FC<ShipmentMapProps> = ({ shipment }) => {
  const [activeWaypoint, setActiveWaypoint] = useState<RouteWaypoint | null>(
    shipment.routeWaypoints.find(w => w.status === 'current') || shipment.routeWaypoints[0] || null
  );

  const waypoints = shipment.routeWaypoints;

  return (
    <div className="bg-slate-950 text-slate-100 rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative">
      {/* Header telemetry bar */}
      <div className="p-4 sm:p-5 bg-slate-900/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold">
                Live Route Telemetry
              </span>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                SIMULATED DATA
              </span>
            </div>
            <h4 className="text-base font-bold text-white tracking-tight">
              {shipment.sender.city} → {shipment.recipient.city} Intercontinental Corridor
            </h4>
          </div>
        </div>

        {/* Live status badge */}
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          <span className="text-slate-300 font-medium">Tracking Status:</span>
          <span className="text-cyan-300 font-bold">{shipment.status}</span>
        </div>
      </div>

      {/* Main Map Stage */}
      <div className="relative h-72 sm:h-96 w-full bg-gradient-to-b from-slate-950 via-[#071322] to-slate-950 overflow-hidden flex items-center justify-center">
        {/* Abstract World Grid & Flight Path Matrix */}
        <svg
          className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38BDF8" strokeWidth="0.5" strokeOpacity="0.2" />
            </pattern>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridPattern)" />

          {/* Continents silhouette curves */}
          <path
            d="M 50 120 Q 180 80 280 140 T 450 180 T 700 130 T 950 190"
            fill="none"
            stroke="#1E293B"
            strokeWidth="3"
            strokeDasharray="4 8"
          />
          <path
            d="M 120 220 Q 300 280 500 210 T 800 260"
            fill="none"
            stroke="#1E293B"
            strokeWidth="3"
            strokeDasharray="4 8"
          />
        </svg>

        {/* Stylized Intercontinental Flight Path Route */}
        <div className="relative w-full max-w-3xl px-6 py-12">
          {/* Animated SVG Flight Arc */}
          <svg className="w-full h-32 overflow-visible" viewBox="0 0 700 120">
            {/* Base curved track */}
            <path
              d="M 50 80 Q 350 -10 650 80"
              fill="none"
              stroke="#1E293B"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Glowing animated path */}
            <path
              d="M 50 80 Q 350 -10 650 80"
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="3.5"
              strokeDasharray="8 6"
              strokeLinecap="round"
              className="animate-pulse"
            />

            {/* In-Transit Waypoint Nodes on Arc */}
            {/* Origin Node */}
            <g transform="translate(50, 80)">
              <circle r="14" fill="#0F172A" stroke="#10B981" strokeWidth="3" />
              <circle r="6" fill="#10B981" />
            </g>

            {/* Transit Hub Node (e.g. Istanbul) */}
            <g transform="translate(350, 35)">
              <circle r="18" fill="#0F172A" stroke="#06B6D4" strokeWidth="3" className="animate-pulse" />
              <circle r="8" fill="#06B6D4" />
            </g>

            {/* Destination Node (e.g. São Paulo) */}
            <g transform="translate(650, 80)">
              <circle r="14" fill="#0F172A" stroke="#3B82F6" strokeWidth="3" />
              <circle r="6" fill="#3B82F6" />
            </g>

            {/* Traveling Aircraft indicator */}
            <g transform="translate(340, 15)">
              <foreignObject width="40" height="40" x="-20" y="-20">
                <div className="w-9 h-9 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-bounce">
                  <Plane className="w-5 h-5 -rotate-45" />
                </div>
              </foreignObject>
            </g>
          </svg>

          {/* City Corridor Indicators (Requested: LAGOS -> ISTANBUL -> SÃO PAULO) */}
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            {waypoints.map((wp, idx) => {
              const isCurrent = wp.status === 'current';
              const isCompleted = wp.status === 'completed';

              return (
                <div
                  key={wp.name}
                  onClick={() => setActiveWaypoint(wp)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    activeWaypoint?.name === wp.name
                      ? 'bg-cyan-950/60 border-cyan-500/60 shadow-md ring-1 ring-cyan-500/40'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    {isCompleted ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isCurrent ? (
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
                      </span>
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      {idx === 0 ? 'Origin' : idx === waypoints.length - 1 ? 'Destination' : 'Transit Gateway'}
                    </span>
                  </div>

                  <div className="font-extrabold text-sm text-white tracking-wide uppercase">
                    {wp.name.split(' ')[0]}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {wp.country}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Waypoint Detail Drawer */}
        {activeWaypoint && (
          <div className="absolute bottom-3 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-slate-900/95 border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[11px] font-mono text-cyan-400 uppercase font-semibold flex items-center gap-1.5">
                <Navigation className="w-3 h-3" />
                Waypoint Coordinates
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {activeWaypoint.coordinates[0].toFixed(2)}°N, {activeWaypoint.coordinates[1].toFixed(2)}°E
              </span>
            </div>
            <div className="mt-2 text-xs font-semibold text-white">
              {activeWaypoint.name}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Status: <span className="text-cyan-300 font-medium capitalize">{activeWaypoint.status}</span>
              {activeWaypoint.timestamp && ` • ${activeWaypoint.timestamp}`}
            </div>
          </div>
        )}
      </div>

      {/* Corridor Flow Stepper Footer */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Routing Flow:</span>
          <div className="flex items-center gap-1.5 font-mono text-white font-bold tracking-wider">
            {waypoints.map((w, idx) => (
              <React.Fragment key={w.name}>
                <span className={w.status === 'current' ? 'text-cyan-400 underline underline-offset-4' : ''}>
                  {w.name.split(' ')[0].toUpperCase()}
                </span>
                {idx < waypoints.length - 1 && <span className="text-slate-500 font-normal">↓</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span>Carrier: <strong>Nexora AirCargo Int'l</strong></span>
          <span>•</span>
          <span>Intermodal Mode: <strong>B747-8F Air Freighter</strong></span>
        </div>
      </div>
    </div>
  );
};
