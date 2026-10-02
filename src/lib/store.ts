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
import { auth, mapFirebaseUser } from './firebase';
// Broadcast event to notify all listening components across tabs / views
export function notifyStoreChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('fedex-storage-update'));
    window.dispatchEvent(new CustomEvent('nexora-storage-update'));
  }
}

let currentUserSession: User | null = null;

function productionBackendRequired<T = never>(operation: string): T {
  throw new Error(`Production backend required for ${operation}.`);
}

// ---------------- SHIPMENTS ----------------
export function getShipments(): Shipment[] {
  return [];
}

export function getShipmentByTracking(trackingNumber: string): Shipment | undefined {
  const shipments = getShipments();
  const cleaned = trackingNumber.trim().toUpperCase();
  return shipments.find(s => s.trackingNumber?.toUpperCase() === cleaned);
}

export function saveShipment(_shipment: Shipment): void {
  productionBackendRequired<void>('shipment creation/update');
}

export function updateShipmentStatus(
  _trackingNumber: string,
  _newStatus: TrackingStatus,
  _location: string,
  _description: string,
  _facilityName?: string,
  _adminEmail?: string
): Shipment | null {
  return productionBackendRequired<Shipment | null>('server-side shipment status updates');
}

// ---------------- CURRENT USER / AUTH ----------------
export function getCurrentUser(): User | null {
  if (auth.currentUser) return mapFirebaseUser(auth.currentUser);
  return currentUserSession;
}

export function setCurrentUser(user: User | null): void {
  currentUserSession = user;
}

export function getUsers(): User[] {
  return [];
}

export function saveUser(_user: User): void {
  productionBackendRequired<void>('user persistence');
}

export function toggleUserStatus(_userId: string): void {
  productionBackendRequired('user administration');
}

// ---------------- DRIVERS & FACILITIES ----------------
export function getDrivers(): Driver[] {
  return [];
}

export function saveDriver(_driver: Driver): void {
  productionBackendRequired<void>('driver administration');
}

export function getFacilities(): Facility[] {
  return [];
}

export function saveFacility(_facility: Facility): void {
  productionBackendRequired<void>('facility administration');
}

// ---------------- RATES ----------------
export function getRates(): ShippingRate[] {
  return [];
}

export function saveRate(_rate: ShippingRate): void {
  productionBackendRequired<void>('rate administration');
}

export function deleteRate(_rateId: string): void {
  productionBackendRequired<void>('rate administration');
}

export function calculateShippingQuote(
  _service: ServiceTier,
  _weightKg: number,
  _dimensions?: { length: number; width: number; height: number },
  _declaredValue?: number
): { price: number; estDaysMin: number; estDaysMax: number } {
  return productionBackendRequired<{ price: number; estDaysMin: number; estDaysMax: number }>('live shipping-rate calculation');
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
  const addresses: SavedAddress[] = [];
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

export function addSupportTicket(_ticket: {
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
  return productionBackendRequired('support ticket creation');
}

export function getPickupRequests(): PickupRequest[] {
  return [];
}

export function addPickupRequest(_pickup: PickupRequest): void {
  productionBackendRequired('pickup scheduling');
}

export function getInvoices(): InvoiceItem[] {
  return [];
}

// ---------------- OPERATIONAL CACHE SYNC ----------------
export function syncOperationalCache(): void {
  productionBackendRequired('operational synchronization');
}

