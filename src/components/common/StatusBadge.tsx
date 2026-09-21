import React from 'react';
import { TrackingStatus } from '../../types';
import {
  CheckCircle2,
  Clock,
  Truck,
  AlertTriangle,
  XCircle,
  Package,
  Plane,
  FileCheck,
  Building,
  RotateCcw,
} from 'lucide-react';

interface StatusBadgeProps {
  status: TrackingStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showIcon = true }) => {
  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';
  let IconComponent = Package;
  let pulse = false;

  switch (status) {
    case 'Delivered':
      badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      dotColor = 'bg-emerald-500';
      IconComponent = CheckCircle2;
      break;

    case 'Out for Delivery':
      badgeStyle = 'bg-blue-50 text-blue-800 border-blue-200';
      dotColor = 'bg-blue-500';
      IconComponent = Truck;
      pulse = true;
      break;

    case 'In Transit':
      badgeStyle = 'bg-cyan-50 text-cyan-800 border-cyan-200';
      dotColor = 'bg-cyan-500';
      IconComponent = Plane;
      pulse = true;
      break;

    case 'Customs Clearance':
      badgeStyle = 'bg-amber-50 text-amber-900 border-amber-300';
      dotColor = 'bg-amber-500';
      IconComponent = Clock;
      pulse = true;
      break;

    case 'Customs Cleared':
      badgeStyle = 'bg-teal-50 text-teal-800 border-teal-200';
      dotColor = 'bg-teal-500';
      IconComponent = FileCheck;
      break;

    case 'At Origin Facility':
    case 'At Destination Facility':
      badgeStyle = 'bg-indigo-50 text-indigo-800 border-indigo-200';
      dotColor = 'bg-indigo-500';
      IconComponent = Building;
      break;

    case 'Departed Origin':
    case 'Arrived at Destination Country':
    case 'Picked Up':
    case 'Label Generated':
    case 'Shipment Created':
    case 'Pickup Scheduled':
      badgeStyle = 'bg-sky-50 text-sky-800 border-sky-200';
      dotColor = 'bg-sky-500';
      IconComponent = Package;
      break;

    case 'Exception':
    case 'Shipment Delayed':
    case 'Delivery Attempted':
      badgeStyle = 'bg-rose-50 text-rose-800 border-rose-200';
      dotColor = 'bg-rose-500';
      IconComponent = AlertTriangle;
      pulse = true;
      break;

    case 'Shipment Cancelled':
    case 'Returned to Sender':
      badgeStyle = 'bg-gray-100 text-gray-700 border-gray-300';
      dotColor = 'bg-gray-500';
      IconComponent = status === 'Returned to Sender' ? RotateCcw : XCircle;
      break;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-2xs transition-colors select-none ${badgeStyle} ${sizeClasses[size]}`}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColor}`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
      </span>

      {showIcon && <IconComponent className={iconSizes[size]} />}
      <span>{status}</span>
    </span>
  );
};
