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
import {
  INITIAL_SHIPMENTS,
  INITIAL_USERS,
  INITIAL_DRIVERS,
  INITIAL_FACILITIES,
  INITIAL_RATES,
  INITIAL_LOCATIONS,
  INITIAL_TICKETS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SAVED_ADDRESSES,
} from '../data/mockData';

const STORAGE_KEYS = {
  SHIPMENTS: 'nexora_shipments_v1',
  USERS: 'nexora_users_v1',
  CURRENT_USER: 'nexora_current_user_v1',
  DRIVERS: 'nexora_drivers_v1',
  FACILITIES: 'nexora_facilities_v1',
  RATES: 'nexora_rates_v1',
  LOCATIONS: 'nexora_locations_v1',
  TICKETS: 'nexora_tickets_v1',
  AUDIT_LOGS: 'nexora_audit_logs_v1',
  NOTIFICATIONS: 'nexora_notifications_v1',
  ADDRESSES: 'nexora_addresses_v1',
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
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item);
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyStoreChange();
  } catch (e) {
    console.error('Error writing to storage', e);
  }
}

// ---------------- SHIPMENTS ----------------
export function getShipments(): Shipment[] {
  return getItem<Shipment[]>(STORAGE_KEYS.SHIPMENTS, INITIAL_SHIPMENTS);
}

export function getShipmentByTracking(trackingNumber: string): Shipment | undefined {
  const shipments = getShipments();
  const cleaned = trackingNumber.trim().toUpperCase();
  return shipments.find(s => s.trackingNumber.toUpperCase() === cleaned);
}

export function saveShipment(shipment: Shipment): void {
  const shipments = getShipments();
  const index = shipments.findIndex(s => s.id === shipment.id || s.trackingNumber === shipment.trackingNumber);
  if (index >= 0) {
    shipments[index] = shipment;
  } else {
    shipments.unshift(shipment);
  }
  setItem(STORAGE_KEYS.SHIPMENTS, shipments);
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
  return getItem<User | null>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]); // Defaults to customer Sarah Jenkins for seamless test drive
}

export function setCurrentUser(user: User | null): void {
  setItem(STORAGE_KEYS.CURRENT_USER, user);
}

export function getUsers(): User[] {
  return getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
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

export function toggleUserStatus(userId: string): void {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (user) {
    user.status = user.status === 'active' ? 'suspended' : 'active';
    setItem(STORAGE_KEYS.USERS, users);
  }
}

// ---------------- DRIVERS & FACILITIES ----------------
export function getDrivers(): Driver[] {
  return getItem<Driver[]>(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS);
}

export function saveDriver(driver: Driver): void {
  const drivers = getDrivers();
  const idx = drivers.findIndex(d => d.id === driver.id);
  if (idx >= 0) {
    drivers[idx] = driver;
  } else {
    drivers.push(driver);
  }
  setItem(STORAGE_KEYS.DRIVERS, drivers);
}

export function getFacilities(): Facility[] {
  return getItem<Facility[]>(STORAGE_KEYS.FACILITIES, INITIAL_FACILITIES);
}

export function saveFacility(facility: Facility): void {
  const facilities = getFacilities();
  const idx = facilities.findIndex(f => f.id === facility.id);
  if (idx >= 0) {
    facilities[idx] = facility;
  } else {
    facilities.push(facility);
  }
  setItem(STORAGE_KEYS.FACILITIES, facilities);
}

// ---------------- RATES ----------------
export function getRates(): ShippingRate[] {
  return getItem<ShippingRate[]>(STORAGE_KEYS.RATES, INITIAL_RATES);
}

export function saveRate(rate: ShippingRate): void {
  const rates = getRates();
  const idx = rates.findIndex(r => r.id === rate.id);
  if (idx >= 0) {
    rates[idx] = rate;
  } else {
    rates.push(rate);
  }
  setItem(STORAGE_KEYS.RATES, rates);
}

export function deleteRate(rateId: string): void {
  const rates = getRates().filter(r => r.id !== rateId);
  setItem(STORAGE_KEYS.RATES, rates);
}

export function calculateShippingQuote(
  service: ServiceTier,
  weightKg: number,
  dimensions?: { length: number; width: number; height: number },
  declaredValue?: number
): { price: number; estDaysMin: number; estDaysMax: number } {
  const rates = getRates();
  const matchingRate = rates.find(r => r.service === service) || rates[0];

  // Volumetric weight calculation (cm / 5000)
  let billableWeight = Math.max(0.5, weightKg);
  if (dimensions && dimensions.length && dimensions.width && dimensions.height) {
    const volumetricWeight = (dimensions.length * dimensions.width * dimensions.height) / 5000;
    billableWeight = Math.max(billableWeight, volumetricWeight);
  }

  let price = matchingRate.baseRate + billableWeight * matchingRate.perKgRate;
  if (declaredValue && declaredValue > 1000) {
    price += (declaredValue - 1000) * 0.008; // Insurance fee
  }

  return {
    price: Math.round(price * 100) / 100,
    estDaysMin: matchingRate.estDaysMin,
    estDaysMax: matchingRate.estDaysMax,
  };
}

// ---------------- LOCATIONS ----------------
export function getLocations(): LocationPoint[] {
  return getItem<LocationPoint[]>(STORAGE_KEYS.LOCATIONS, INITIAL_LOCATIONS);
}

export function saveLocation(location: LocationPoint): void {
  const locations = getLocations();
  const idx = locations.findIndex(l => l.id === location.id);
  if (idx >= 0) {
    locations[idx] = location;
  } else {
    locations.push(location);
  }
  setItem(STORAGE_KEYS.LOCATIONS, locations);
}

// ---------------- TICKETS ----------------
export function getTickets(): SupportTicket[] {
  return getItem<SupportTicket[]>(STORAGE_KEYS.TICKETS, INITIAL_TICKETS);
}

export function addTicket(ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'replies'>): SupportTicket {
  const tickets = getTickets();
  const newTicket: SupportTicket = {
    ...ticket,
    id: `tkt_${Date.now()}`,
    ticketNumber: `TKT-${Math.floor(10000 + Math.random() * 90000)}`,
    createdAt: new Date().toISOString(),
    replies: [
      {
        id: `rep_${Date.now()}`,
        sender: ticket.customerName,
        role: 'customer',
        message: ticket.message,
        timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
          ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      },
    ],
  };
  tickets.unshift(newTicket);
  setItem(STORAGE_KEYS.TICKETS, tickets);
  return newTicket;
}

export function replyToTicket(ticketId: string, sender: string, role: 'customer' | 'support_agent', message: string): void {
  const tickets = getTickets();
  const ticket = tickets.find(t => t.id === ticketId);
  if (ticket) {
    ticket.replies.push({
      id: `rep_${Date.now()}`,
      sender,
      role,
      message,
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
        ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    });
    if (role === 'support_agent') {
      ticket.status = 'Waiting for Customer';
    } else {
      ticket.status = 'In Progress';
    }
    setItem(STORAGE_KEYS.TICKETS, tickets);
  }
}

export function updateTicketStatus(ticketId: string, status: SupportTicket['status']): void {
  const tickets = getTickets();
  const ticket = tickets.find(t => t.id === ticketId);
  if (ticket) {
    ticket.status = status;
    setItem(STORAGE_KEYS.TICKETS, tickets);
  }
}

// ---------------- AUDIT LOGS ----------------
export function getAuditLogs(): AuditLog[] {
  return getItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
}

export function addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): void {
  const logs = getAuditLogs();
  const newLog: AuditLog = {
    ...log,
    id: `log_${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
  };
  logs.unshift(newLog);
  setItem(STORAGE_KEYS.AUDIT_LOGS, logs);
}

// ---------------- NOTIFICATIONS ----------------
export function getNotifications(): NotificationItem[] {
  return getItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
}

export function addNotification(notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): void {
  const notifications = getNotifications();
  const newNotif: NotificationItem = {
    ...notif,
    id: `notif_${Date.now()}`,
    read: false,
    timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
  notifications.unshift(newNotif);
  setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
}

export function markNotificationAsRead(id: string): void {
  const notifications = getNotifications();
  const item = notifications.find(n => n.id === id);
  if (item) {
    item.read = true;
    setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }
}

export function markAllNotificationsAsRead(): void {
  const notifications = getNotifications().map(n => ({ ...n, read: true }));
  setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
}

// ---------------- SAVED ADDRESSES ----------------
export function getSavedAddresses(userEmail?: string): SavedAddress[] {
  const addresses = getItem<SavedAddress[]>(STORAGE_KEYS.ADDRESSES, INITIAL_SAVED_ADDRESSES);
  if (!userEmail) return addresses;
  return addresses.filter(a => a.userId.toLowerCase() === userEmail.toLowerCase());
}

export function saveAddress(address: SavedAddress): void {
  const addresses = getItem<SavedAddress[]>(STORAGE_KEYS.ADDRESSES, INITIAL_SAVED_ADDRESSES);
  const idx = addresses.findIndex(a => a.id === address.id);
  if (address.isDefault) {
    addresses.forEach(a => {
      if (a.userId === address.userId) a.isDefault = false;
    });
  }
  if (idx >= 0) {
    addresses[idx] = address;
  } else {
    addresses.push(address);
  }
  setItem(STORAGE_KEYS.ADDRESSES, addresses);
}

export function deleteAddress(addressId: string): void {
  const addresses = getItem<SavedAddress[]>(STORAGE_KEYS.ADDRESSES, INITIAL_SAVED_ADDRESSES).filter(a => a.id !== addressId);
  setItem(STORAGE_KEYS.ADDRESSES, addresses);
}

export function setDefaultAddress(addressId: string, userEmail: string): void {
  const addresses = getItem<SavedAddress[]>(STORAGE_KEYS.ADDRESSES, INITIAL_SAVED_ADDRESSES);
  addresses.forEach(a => {
    if (a.userId.toLowerCase() === userEmail.toLowerCase()) {
      a.isDefault = a.id === addressId;
    }
  });
  setItem(STORAGE_KEYS.ADDRESSES, addresses);
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

const INITIAL_PICKUPS: PickupRequest[] = [
  {
    id: 'pck_01',
    userId: 'usr_demo_customer',
    pickupDate: '2026-09-22',
    timeSlot: '13:00 - 17:00',
    locationAddress: '450 Mission Street, Suite 1200, San Francisco, CA',
    packageCount: 3,
    totalWeightKg: 12.4,
    specialInstructions: 'Ask for Sarah at reception desk.',
    status: 'scheduled',
    createdAt: '2026-09-21 08:30',
  },
  {
    id: 'pck_02',
    userId: 'usr_demo_customer',
    pickupDate: '2026-09-18',
    timeSlot: '09:00 - 13:00',
    locationAddress: '450 Mission Street, Suite 1200, San Francisco, CA',
    packageCount: 1,
    totalWeightKg: 4.2,
    status: 'completed',
    createdAt: '2026-09-17 14:15',
  },
];

export function getPickupRequests(): PickupRequest[] {
  return getItem<PickupRequest[]>('nexora_pickups', INITIAL_PICKUPS);
}

export function addPickupRequest(pickup: PickupRequest): void {
  const pickups = getPickupRequests();
  pickups.unshift(pickup);
  setItem('nexora_pickups', pickups);
}

const INITIAL_INVOICES: InvoiceItem[] = [
  {
    id: 'inv_101',
    invoiceNumber: 'INV-2026-0941',
    date: 'Sep 18, 2026',
    amount: 485,
    status: 'Paid',
  },
  {
    id: 'inv_102',
    invoiceNumber: 'INV-2026-0882',
    date: 'Sep 04, 2026',
    amount: 1240,
    status: 'Paid',
  },
  {
    id: 'inv_103',
    invoiceNumber: 'INV-2026-0790',
    date: 'Aug 21, 2026',
    amount: 890,
    status: 'Paid',
  },
];

export function getInvoices(): InvoiceItem[] {
  return getItem<InvoiceItem[]>('nexora_invoices', INITIAL_INVOICES);
}

// ---------------- OPERATIONAL CACHE SYNC ----------------
export function syncOperationalCache(): void {
  setItem(STORAGE_KEYS.SHIPMENTS, INITIAL_SHIPMENTS);
  setItem(STORAGE_KEYS.USERS, INITIAL_USERS);
  setItem(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  setItem(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS);
  setItem(STORAGE_KEYS.FACILITIES, INITIAL_FACILITIES);
  setItem(STORAGE_KEYS.RATES, INITIAL_RATES);
  setItem(STORAGE_KEYS.LOCATIONS, INITIAL_LOCATIONS);
  setItem(STORAGE_KEYS.TICKETS, INITIAL_TICKETS);
  setItem(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  setItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  setItem(STORAGE_KEYS.ADDRESSES, INITIAL_SAVED_ADDRESSES);
  setItem('nexora_pickups', INITIAL_PICKUPS);
  setItem('nexora_invoices', INITIAL_INVOICES);
}

export const resetDemoData = syncOperationalCache;
