import { supabase } from './supabase';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token || null;
  const response = await fetch(API_BASE_URL + path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
      ...(init.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'API request failed (' + response.status + ').');
  return payload as T;
}

export const api = {
  health: () => request<{ ok: boolean; service: string; version: string }>('/api/health'),
  me: () => request<{ uid: string; email: string; admin: boolean; profile: { firstName?: string; lastName?: string; phone?: string; country?: string; status?: string; createdAt?: string } | null }>('/api/me'),
  shipments: () => request('/api/shipments'),
  shipment: (trackingNumber: string) => request('/api/shipments/' + encodeURIComponent(trackingNumber)),
  quote: (input: { service: string; weightKg: number; originCountry: string; destCountry: string }) => request<{ price: number; estDaysMin: number; estDaysMax: number; currency: string; rateId: string }>('/api/quotes', { method: 'POST', body: JSON.stringify(input) }),
  createShipment: (input: unknown, idempotencyKey = globalThis.crypto.randomUUID()) => request<{ id: string; trackingNumber: string | null }>('/api/shipments', { method: 'POST', headers: { 'Idempotency-Key': idempotencyKey }, body: JSON.stringify(input) }),
  createPaymentCheckout: (shipmentId: string, idempotencyKey = globalThis.crypto.randomUUID()) => request<{ checkoutUrl: string | null; sessionId: string }>('/api/payments/checkout', { method: 'POST', headers: { 'Idempotency-Key': idempotencyKey }, body: JSON.stringify({ shipmentId }) }),
  siteSettings: () => request<any>('/api/site-settings'),
  createGuestRequest: (input:any) => request<{id:string;requestNumber:string;status:string}>('/api/guest/requests',{method:'POST',body:JSON.stringify(input)}),
  guestQuote: (input:any) => request<any>('/api/guest/quotes',{method:'POST',body:JSON.stringify(input)}),
  guestPaymentCheckout: (requestId:string,service:string,rateId:string,idempotencyKey=globalThis.crypto.randomUUID()) => request<any>('/api/guest/payments/checkout',{method:'POST',headers:{'Idempotency-Key':idempotencyKey},body:JSON.stringify({requestId,service,rateId})}),
  guestRequest: (id:string,email:string) => request<any>('/api/guest/requests/'+encodeURIComponent(id)+'?email='+encodeURIComponent(email)),
  guestMessage: (id:string,email:string,body:string,paymentReference?:string) => request<any>('/api/guest/requests/'+encodeURIComponent(id)+'/messages',{method:'POST',body:JSON.stringify({email,body,paymentReference})}),
  adminSiteSettings: () => request<any>('/api/admin/site-settings'),
  adminSaveSiteSettings: (input:any) => request<any>('/api/admin/site-settings',{method:'PUT',body:JSON.stringify(input)}),
  adminGuestRequests: () => request<any[]>('/api/admin/guest-requests'),
  adminGuestDecision: (requestId: string, decision: 'approve' | 'decline', note?: string) => request('/api/admin/guest-requests/' + encodeURIComponent(requestId) + '/decision', { method: 'POST', body: JSON.stringify({ decision, note }) }),
  adminUsers: () => request<any[]>('/api/admin/users'),
  adminUpdateUserStatus: (userId: string, status: 'active' | 'suspended') => request('/api/admin/users/' + encodeURIComponent(userId) + '/status', { method: 'PATCH', body: JSON.stringify({ status }) }),
  adminRates: () => request<any[]>('/api/admin/rates'),
  adminCreateRate: (input: any) => request<{ id: string }>('/api/admin/rates', { method: 'POST', body: JSON.stringify(input) }),
  adminUpdateRate: (rateId: string, input: any) => request('/api/admin/rates/' + encodeURIComponent(rateId), { method: 'PATCH', body: JSON.stringify(input) }),
  adminDisableRate: (rateId: string) => request('/api/admin/rates/' + encodeURIComponent(rateId), { method: 'DELETE' }),
  adminAuditLogs: () => request<any[]>('/api/admin/audit-logs'),
  supportThreads: () => request<any[]>('/api/support/threads'),
  supportCreateThread: (input: any) => request<{ id: string }>('/api/support/threads', { method: 'POST', body: JSON.stringify(input) }),
  supportMessages: (threadId: string) => request<any[]>('/api/support/threads/' + encodeURIComponent(threadId) + '/messages'),
  supportReply: (threadId: string, body: string, paymentReference?: string) => request('/api/support/threads/' + encodeURIComponent(threadId) + '/messages', { method: 'POST', body: JSON.stringify({ body, paymentReference }) }),
};
