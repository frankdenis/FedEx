export type TrackingStatus =
  | 'Shipment Created'
  | 'Label Generated'
  | 'Pickup Scheduled'
  | 'Picked Up'
  | 'At Origin Facility'
  | 'Departed Origin'
  | 'In Transit'
  | 'Arrived at Destination Country'
  | 'Customs Clearance'
  | 'Customs Cleared'
  | 'At Destination Facility'
  | 'Out for Delivery'
  | 'Delivery Attempted'
  | 'Delivered'
  | 'Exception'
  | 'Shipment Delayed'
  | 'Shipment Cancelled'
  | 'Returned to Sender';

export interface TrackingEvent {
  id: string;
  status: TrackingStatus;
  location: string;
  timestamp: string; // ISO or formatted date
  description: string;
  facility?: string;
}

export interface RouteWaypoint {
  name: string;
  country: string;
  coordinates: [number, number]; // [lat, lng]
  status: 'completed' | 'current' | 'upcoming';
  timestamp?: string;
}

export interface AddressInfo {
  name: string;
  company?: string;
  address: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone: string;
  email?: string;
}

export interface PackageInfo {
  type: 'Envelope' | 'Small Box' | 'Medium Box' | 'Large Box' | 'Custom' | 'Pallet / Freight';
  weight: number; // in kg
  length: number; // in cm
  width: number;
  height: number;
  pieces: number;
  description: string;
  declaredValue: number; // USD
}

export type ServiceTier = 'Express' | 'Priority' | 'Standard' | 'Freight';

export interface Shipment {
  id: string;
  trackingNumber: string;
  sender: AddressInfo;
  recipient: AddressInfo;
  packageInfo: PackageInfo;
  service: ServiceTier;
  status: TrackingStatus;
  estimatedDelivery: string;
  createdAt: string;
  events: TrackingEvent[];
  routeWaypoints: RouteWaypoint[];
  assignedFacility?: string;
  assignedDriver?: string;
  cost: number;
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  invoiceNumber: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  company?: string;
  country: string;
  address?: string;
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface Driver {
  id: string;
  driverId: string;
  name: string;
  vehicle: string;
  phone: string;
  region: string;
  status: 'Available' | 'On Delivery' | 'Offline';
  assignedShipmentsCount: number;
}

export interface Facility {
  id: string;
  name: string;
  type: 'Airport Cargo Hub' | 'Sorting Center' | 'Maritime Terminal' | 'Regional Warehouse' | 'Drop-off Center';
  city: string;
  country: string;
  capacityPercentage: number;
  status: 'Optimal' | 'High Volume' | 'Maintenance';
}

export interface ShippingRate {
  id: string;
  service: ServiceTier;
  originCountry: string;
  destCountry: string;
  baseRate: number;
  perKgRate: number;
  estDaysMin: number;
  estDaysMax: number;
}

export interface LocationPoint {
  id: string;
  name: string;
  type: 'Service Center' | 'Pickup Point' | 'Drop-off Point' | 'Warehouse' | 'Distribution Hub';
  address: string;
  city: string;
  country: string;
  postalCode: string;
  openingHours: string;
  phone: string;
  services: string[];
  coordinates: [number, number];
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerEmail: string;
  customerName: string;
  subject: string;
  category: 'Tracking' | 'Shipping' | 'Payments' | 'Customs' | 'Returns' | 'Account' | 'Delivery';
  trackingNumber?: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Waiting for Customer' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  createdAt: string;
  replies: {
    id: string;
    sender: string;
    role: 'customer' | 'support_agent' | 'system';
    message: string;
    timestamp: string;
  }[];
}

export interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  shipmentNumber?: string;
  details: string;
  timestamp: string;
  ip: string;
}

export interface NotificationItem {
  id: string;
  userId: string; // 'all' or specific user email
  title: string;
  message: string;
  trackingNumber?: string;
  read: boolean;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'alert';
}

export interface SavedAddress {
  id: string;
  userId: string;
  label?: string; // e.g. "HQ Office", "Main Warehouse", "Home"
  name: string;
  company?: string;
  country: string;
  state?: string;
  city: string;
  postalCode: string;
  address: string;
  phone: string;
  isDefault: boolean;
}

export interface PickupRequest {
  id: string;
  userId: string;
  pickupDate: string;
  timeSlot: '09:00 - 13:00' | '13:00 - 17:00' | '17:00 - 20:00';
  locationAddress: string;
  packageCount: number;
  totalWeightKg: number;
  specialInstructions?: string;
  status: 'scheduled' | 'assigned' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface ServiceDetailInfo {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  heroImage: string;
  icon: string;
  shortDescription: string;
  overview: string;
  benefits: string[];
  process: { step: number; title: string; desc: string }[];
  pricingOptions: { tier: string; transit: string; startingAt: string; features: string[] }[];
  faqs: { q: string; a: string }[];
  relatedServices: string[];
}

export interface GoogleChatSpace {
  name: string; // e.g., 'spaces/AAAABBBB'
  displayName?: string;
  type?: string;
  spaceType?: 'SPACE' | 'GROUP_CHAT' | 'DIRECT_MESSAGE' | string;
  description?: string;
}

export interface GoogleChatMessage {
  name: string;
  sender?: {
    name: string;
    displayName?: string;
    avatarUrl?: string;
    type?: string;
  };
  text?: string;
  createTime?: string;
  formattedText?: string;
}

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  webViewLink?: string;
  webContentLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  owners?: {
    displayName?: string;
    emailAddress?: string;
    photoLink?: string;
  }[];
  starred?: boolean;
  trashed?: boolean;
}


