import React from 'react';
import { Shipment, TrackingEvent } from '../../types';
import { Check, Clock, AlertCircle, Building2, MapPin } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface TrackingTimelineProps {
  shipment: Shipment;
}

export const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ shipment }) => {
  // Standard milestone pipeline
  const standardMilestones = [
    'Shipment Created',
    'Picked Up',
    'Departed Origin Facility',
    'In Transit',
    'Customs Clearance',
    'Out for Delivery',
    'Delivered',
  ];

  // Helper to determine status order / stage
  const getStageIndex = (status: string) => {
    switch (status) {
      case 'Shipment Created':
      case 'Label Generated':
      case 'Pickup Scheduled':
        return 0;
      case 'Picked Up':
      case 'At Origin Facility':
        return 1;
      case 'Departed Origin':
        return 2;
      case 'In Transit':
      case 'Arrived at Destination Country':
        return 3;
      case 'Customs Clearance':
      case 'Customs Cleared':
      case 'At Destination Facility':
        return 4;
      case 'Out for Delivery':
      case 'Delivery Attempted':
        return 5;
      case 'Delivered':
        return 6;
      case 'Exception':
      case 'Shipment Delayed':
        return 3.5;
      case 'Shipment Cancelled':
      case 'Returned to Sender':
        return 1;
      default:
        return 2;
    }
  };

  const currentStage = getStageIndex(shipment.status);

  return (
    <div className="space-y-8">
      {/* High-Level Horizontal Pipeline Progress */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Journey Milestone Progress
          </h3>
          <span className="text-xs font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
            {shipment.status === 'Delivered' ? 'Completed' : `Estimated Arrival: ${shipment.estimatedDelivery}`}
          </span>
        </div>

        {/* Milestone Steps Bar */}
        <div className="relative mt-6 mb-2">
          {/* Background Track */}
          <div className="absolute top-4 left-4 right-4 h-1 bg-slate-100 -z-0 rounded-full" />

          {/* Active Fill Track */}
          <div
            className="absolute top-4 left-4 h-1 bg-gradient-to-r from-cyan-600 to-blue-600 -z-0 rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(100, Math.max(5, (currentStage / (standardMilestones.length - 1)) * 100))}%`,
            }}
          />

          <div className="relative z-10 flex justify-between items-start">
            {standardMilestones.map((milestone, idx) => {
              const isPast = currentStage > idx;
              const isCurrent = Math.floor(currentStage) === idx;
              const isFuture = currentStage < idx;

              return (
                <div key={milestone} className="flex flex-col items-center text-center max-w-[80px]">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isPast
                        ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-50'
                        : isCurrent
                        ? 'bg-cyan-600 text-white ring-4 ring-cyan-100 animate-pulse'
                        : 'bg-white text-slate-400 border-2 border-slate-200'
                    }`}
                  >
                    {isPast ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : isCurrent ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-white" />
                    ) : (
                      <span className="text-[11px]">{idx + 1}</span>
                    )}
                  </div>
                  <span
                    className={`text-[11px] mt-2 font-medium leading-tight ${
                      isCurrent
                        ? 'text-cyan-900 font-bold'
                        : isPast
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {milestone}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Granular Detailed Event Audit Log */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Shipment Event History</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified physical scans logged across Nexora international hubs & carriers
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400">
            {shipment.events.length} Recorded Scans
          </div>
        </div>

        <div className="mt-6 relative pl-6 space-y-8 before:absolute before:left-[15px] before:top-3 before:bottom-3 before:w-[2px] before:bg-slate-200">
          {shipment.events.map((event: TrackingEvent, idx: number) => {
            const isLatest = idx === 0;
            const isDelivered = event.status === 'Delivered';
            const isException = event.status === 'Exception' || event.status === 'Shipment Delayed';

            return (
              <div key={event.id || idx} className="relative group">
                {/* Node icon */}
                <div
                  className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${
                    isDelivered
                      ? 'bg-emerald-600 text-white'
                      : isException
                      ? 'bg-rose-600 text-white'
                      : isLatest
                      ? 'bg-cyan-600 text-white animate-pulse'
                      : 'bg-slate-300 text-white'
                  }`}
                >
                  {isDelivered ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : isException ? (
                    <AlertCircle className="w-3.5 h-3.5" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>

                {/* Event Content Card */}
                <div className={`p-4 rounded-xl transition-all ${
                  isLatest
                    ? 'bg-slate-50/80 border border-cyan-200/80 shadow-xs'
                    : 'bg-white hover:bg-slate-50/50'
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={event.status} size="sm" />
                      {isLatest && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-600 text-white">
                          Latest Activity
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{event.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-slate-900 mt-1">
                    {event.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                      <span>{event.location}</span>
                    </div>
                    {event.facility && (
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Facility: {event.facility}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
