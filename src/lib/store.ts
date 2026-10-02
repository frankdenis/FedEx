import {
  Shipment,
  User,
  Driver,
  Facility,
  ShippingRate,
  LocationPoint,
  SupportTicket,
  AuditLog,
  NotificationItem,
  SavedAddress,
  TrackingStatus,
  TrackingEvent,
  ServiceTier,
  PickupRequest,
  InvoiceItem,
} from '../types';
const STORAGE_KEYS = {
  CURRENT_USER: 'fedex_current_user_session',
};

// Broadcast event to notify all listening components across tabs / views
export function notifyStoreChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('fedex-storage-update'));
    window.dispatchEvent(new CustomEvent('nexora-storage-update'));
  }
}

function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) as T : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyStoreChange();
  } catch {
    // Persistence is best-effort only. Server-backed data must never depend on it.
  }
}

function productionBackendRequired(operation: string): never {
  throw new Error(`Production backend required: ${operation} is not available in the client-only build.`);
}

let currentUserSession: User | null = null;

// ---------------- SHIPMENTS ----------------
export function getShipments(): Shipment[] {
  return [];
}

export function getShipmentByTracking(trackingNumber: string): Shipment | undefined {
  const shipments = getShipments();
  const cleaned = trackingNumber.trim().toUpperCase();
  return shipments.find(s => s.trackingNumber.toUpperCase() === cleaned);
}

export function saveShipment(_shipment: Shipment): void {
  productionBackendRequired('shipment creation/update');
}

export function generateTrackingNumber(): string {
  // Format: NX followed by 9 random digits, e.g. NX839204715
  const randomDigits = Math.floor(100000000 + Math.random() * 900000000).toString();
  return `NX${randomDigits}`;
}

export function updateShipmentStatus(
  trackingNumber: string,
  newStatus: TrackingStatus,
  location: string,
  description: string,
  facilityName?: string,
  adminEmail: string = 'admin@fedex-logistics.com'
): Shipment | null {
  const shipments = getShipments();
  const index = shipments.findIndex(s => s.trackingNumber.toUpperCase() === trackingNumber.trim().toUpperCase());
  if (index === -1) return null;

  const current = shipments[index];
  const previousStatus = current.status;
  const newEvent: TrackingEvent = {
    id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    status: newStatus,
    location: location || 'FedEx Memphis World Hub Gateway',
    timestamp: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) + ' — ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    description: description || `Shipment status updated to ${newStatus}.`,
    facility: facilityName,
  };

  current.status = newStatus;
  current.events.unshift(newEvent);

  shipments[index] = { ...current };
  setItem(STORAGE_KEYS.SHIPMENTS, shipments);

  // Record Audit Log
  addAuditLog({
    adminEmail,
    action: 'Shipment Status Update',
    shipmentNumber: trackingNumber,
    details: `Status transitioned: ${previousStatus} → ${newStatus} (${location})`,
    ip: '192.168.10.42 (Command Operations)',
  });

  // Create Customer Notification
  addNotification({
    userId: current.sender.email || 'all',
    title: `Shipment ${trackingNumber} is now ${newStatus}`,
    message: description || `Status updated at ${location}.`,
    trackingNumber: trackingNumber,
    type: newStatus === 'Delivered' ? 'success' : newStatus === 'Exception' ? 'alert' : 'info',
  });

  return current;
}

// ---------------- CURRENT USER / AUTH ----------------
export function getCurrentUser(): User | null {
  return currentUserSession;
}

export function setCurrentUser(user: User | null): void {
  currentUserSession = user;
}

export function setCurrentUser(user: User | null): void {
  setItem(STORAGE_KEYS.CURRENT_USER, user);
}

export function getUsers(): User[] {
  return [];
}

export function saveUser(user: User): void {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
  if (idx >= 0) {
    users[idx] = user;
  } else {
    users.push(user);
  }
  setItem(STORAGE_KEYS.USERS, users);
}

export function toggleUserStatus(_userId: string): void {
  productionBackendRequired('user administration');
}

// ---------------- DRIVERS & FACILITIES ----------------
export function getDrivers(): Driver[] {
  return [];
}

export function saveDriver(_driver: Driver): void {
  productionBackendRequired('driver administration');
}

export function getFacilities(): Facility[] {
  return [];
}

export function saveFacility(_facility: Facility): void {
  productionBackendRequired('facility administration');
}

// ---------------- RATES ----------------
export function getRates(): ShippingRate[] {
  return [];
}

export function saveRate(_rate: ShippingRate): void {
  productionBackendRequired('rate administration');
}

export function deleteRate(_rateId: string): void {
  productionBackendRequired('rate administration');
}

export function calculateShippingQuote(
  _service: ServiceTier,
  _weightKg: number,
  _dimensions?: { length: number; width: number; height: number },
  _declaredValue?: number
): { price: number; estDaysMin: number; estDaysMax: number } {
  productionBackendRequired('live shipping-rate calculation');
}

// ---------------- LOCATIONS ----------------
export function getLocations(): LocationPoint[] {
  return [];
}

export function saveLocation(_location: LocationPoint): void {
  productionBackendRequired('location administration');
}

// ---------------- TICKETS ----------------
export function getTickets(): SupportTicket[] {
  return [];
}

export function addTicket(_ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'replies'>): SupportTicket {
  return productionBackendRequired('support ticket creation');
}

export function replyToTicket(_ticketId: string, _sender: string, _role: 'customer' | 'support_agent', _message: string): void {
  productionBackendRequired('support ticket replies');
}

export function updateTicketStatus(_ticketId: string, _status: SupportTicket['status']): void {
  productionBackendRequired('support ticket administration');
}

// ---------------- AUDIT LOGS ----------------
export function getAuditLogs(): AuditLog[] {
  return [];
}

export function addAuditLog(_log: Omit<AuditLog, 'id' | 'timestamp'>): void {
  productionBackendRequired('server-side audit logging');
}

// ---------------- NOTIFICATIONS ----------------
export function getNotifications(): NotificationItem[] {
  return [];
}

export function addNotification(_notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): void {
  productionBackendRequired('server-side notifications');
}

export function markNotificationAsRead(_id: string): void {
  productionBackendRequired('notification updates');
}

export function markAllNotificationsAsRead(): void {
  productionBackendRequired('notification updates');
}

// ---------------- SAVED ADDRESSES ----------------
export function getSavedAddresses(userEmail?: string): SavedAddress[] {
  const addresses = [];
  if (!userEmail) return addresses;
  return addresses.filter(a => a.userId.toLowerCase() === userEmail.toLowerCase());
}

export function saveAddress(_address: SavedAddress): void {
  productionBackendRequired('address persistence');
}

export function deleteAddress(_addressId: string): void {
  productionBackendRequired('address deletion');
}

export function setDefaultAddress(_addressId: string, _userEmail: string): void {
  productionBackendRequired('address administration');
}

// ---------------- ALIASES & COMPATIBILITY HELPERS ----------------
export const addShipment = saveShipment;
export const getAddresses = (userId?: string) => getSavedAddresses(userId);
export const addAddress = saveAddress;
export const getSupportTickets = getTickets;

export function addSupportTicket(ticket: {
  id?: string;
  userId?: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  message: string;
  trackingNumber?: string;
}): SupportTicket {
  const categoryMap: Record<string, SupportTicket['category']> = {
    tracking: 'Tracking',
    shipping: 'Shipping',
    billing: 'Payments',
    customs: 'Customs',
  };
  const priorityMap: Record<string, SupportTicket['priority']> = {
    low: 'Low',
    medium: 'Medium',
    high: 'Urgent',
  };

  return addTicket({
    customerName: 'Sarah Jenkins',
    customerEmail: 's.jenkins@apex-biohealth.com',
    subject: ticket.subject,
    category: categoryMap[ticket.category] || 'Tracking',
    priority: priorityMap[ticket.priority] || 'Medium',
    status: 'Open',
    message: ticket.message,
    trackingNumber: ticket.trackingNumber,
  });
}

export function getPickupRequests(): PickupRequest[] {
  return [];
}

export function addPickupRequest(pickup: PickupRequest): void {
  const pickups = getPickupRequests();
  pickups.unshift(pickup);
  setItem('nexora_pickups', pickups);
}

export function getInvoices(): InvoiceItem[] {
  return [];
}

// ---------------- OPERATIONAL CACHE SYNC ----------------
export function syncOperationalCache(): void {
  productionBackendRequired('operational synchronization');
}

export const resetDemoData = syncOperationalCache;
