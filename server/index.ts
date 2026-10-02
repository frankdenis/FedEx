import 'dotenv/config';
import express from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import { db } from './firebaseAdmin.js';
import { requireAdmin, requireAuth } from './auth.js';
import { assertAddress, assertPackage, assertService } from './validation.js';
import Stripe from 'stripe';
import { randomUUID } from 'node:crypto';
import { fedexConfigured, fedexRequest } from './fedex.js';

const app = express();
const port = Number(process.env.API_PORT || 8787);
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const appBaseUrl = (process.env.APP_BASE_URL || '').replace(/\/$/, '');
const rateWindowMs = 60_000;
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function limitRequests(req: express.Request, res: express.Response, next: express.NextFunction) {
  const key = req.ip || 'unknown';
  const now = Date.now();
  const entry = rateLimit.get(key);
  if (!entry || entry.resetAt <= now) rateLimit.set(key, { count: 1, resetAt: now + rateWindowMs });
  else if (++entry.count > 120) return res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
  return next();
}

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  const allowedOrigin = process.env.CORS_ORIGIN;
  if (allowedOrigin) res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, Idempotency-Key');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  return next();
});
app.use(limitRequests);

app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return res.status(503).json({ error: 'Payment provider is not configured.' });
  const signature = req.header('stripe-signature');
  if (!signature) return res.status(400).json({ error: 'Missing payment signature.' });
  try {
    const event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    const eventRef = db.collection('stripeEvents').doc(event.id);
    const priorEvent = await eventRef.get();
    if (priorEvent.exists) return res.json({ received: true, duplicate: true });
    await eventRef.set({ receivedAt: FieldValue.serverTimestamp(), type: event.type });
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const shipmentId = session.metadata?.shipmentId;
      if (shipmentId && session.payment_status === 'paid') {
        await db.collection('shipments').doc(shipmentId).update({
          paymentStatus: 'Paid',
          paymentProvider: 'stripe',
          paymentReference: session.payment_intent || session.id,
          paidAt: new Date().toISOString(),
        });
        await db.collection('auditLogs').add({ action: 'payment.completed', shipmentId, paymentReference: session.payment_intent || session.id, timestamp: FieldValue.serverTimestamp() });
      }
    }
    return res.json({ received: true });
  } catch {
    return res.status(400).json({ error: 'Invalid payment webhook signature.' });
  }
});

app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'fedex-logistics-api', version: '1.0.0' }));\n\napp.get('/api/carrier/status', requireAuth, (_req, res) => res.json({ configured: fedexConfigured(), provider: 'FedEx REST APIs' }));

app.post('/api/carrier/track', async (req, res) => {
  const trackingNumber = typeof req.body?.trackingNumber === 'string' ? req.body.trackingNumber.trim() : '';
  if (!fedexConfigured()) return res.status(503).json({ error: 'Official FedEx tracking is not configured.' });
  if (!trackingNumber) return res.status(400).json({ error: 'trackingNumber is required.' });
  try {
    const data = await fedexRequest('/track/v1/trackingnumbers', {
      includeDetailedScans: true,
      trackingInfo: [{ trackingNumberInfo: { trackingNumber } }],
    });
    return res.json(data);
  } catch (error) {
    return res.status(502).json({ error: error instanceof Error ? error.message : 'Carrier tracking request failed.' });
  }
});



app.get('/api/me', requireAuth, async (req, res) => {
  const snapshot = await db.collection('users').doc(req.user!.uid).get();
  res.json({ uid: req.user!.uid, email: req.user!.email, admin: req.user!.admin, profile: snapshot.exists ? snapshot.data() : null });
});

app.get('/api/shipments', requireAuth, async (req, res) => {
  const ref = db.collection('shipments');
  const snapshot = req.user!.admin
    ? await ref.orderBy('createdAt', 'desc').limit(100).get()
    : await ref.where('ownerUid', '==', req.user!.uid).orderBy('createdAt', 'desc').limit(100).get();
  res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
});

app.get('/api/shipments/:trackingNumber', async (req, res) => {
  const snapshot = await db.collection('shipments').where('trackingNumber', '==', req.params.trackingNumber.trim().toUpperCase()).limit(1).get();
  if (snapshot.empty) return res.status(404).json({ error: 'Shipment not found.' });
  const doc = snapshot.docs[0];
  const data = doc.data();
  return res.json({
    id: doc.id,
    trackingNumber: data.trackingNumber,
    service: data.service,
    status: data.status,
    estimatedDelivery: data.estimatedDelivery,
    createdAt: data.createdAt,
    sender: { name: 'Private shipper', company: '', address: '', city: data.sender?.city || '', state: '', postalCode: '', country: data.sender?.country || '', phone: '' },
    recipient: { name: 'Private recipient', company: '', address: '', city: data.recipient?.city || '', state: '', postalCode: '', country: data.recipient?.country || '', phone: '' },
    packageInfo: { type: data.packageInfo?.type || 'Parcel', weight: Number(data.packageInfo?.weight || 0), length: 0, width: 0, height: 0, pieces: Number(data.packageInfo?.pieces || 1), description: data.packageInfo?.description || '', declaredValue: 0 },
    events: data.events || [],
    routeWaypoints: data.routeWaypoints || [],
    assignedFacility: data.assignedFacility || null,
  });
});

app.post('/api/quotes', requireAuth, async (req, res) => {
  try {
    assertService(req.body.service);
    if (typeof req.body.weightKg !== 'number' || req.body.weightKg <= 0) throw new Error('weightKg must be greater than zero.');
    const rates = await db.collection('shippingRates')
      .where('service', '==', req.body.service)
      .where('originCountry', '==', req.body.originCountry)
      .where('destCountry', '==', req.body.destCountry)
      .where('active', '==', true)
      .limit(1).get();
    if (rates.empty) return res.status(503).json({ error: 'No configured production rate is available for this route.' });
    const rate = rates.docs[0].data();
    const price = Number(rate.baseRate) + Number(rate.perKgRate) * req.body.weightKg;
    return res.json({ price: Math.round(price * 100) / 100, estDaysMin: Number(rate.estDaysMin), estDaysMax: Number(rate.estDaysMax), currency: rate.currency || 'USD', rateId: rates.docs[0].id });
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid quote request.' });
  }
});

app.post('/api/shipments', requireAuth, async (req, res) => {
  try {
    assertAddress(req.body.sender, 'sender');
    assertAddress(req.body.recipient, 'recipient');
    assertPackage(req.body.packageInfo);
    assertService(req.body.service);
    const rates = await db.collection('shippingRates')
      .where('service', '==', req.body.service)
      .where('originCountry', '==', req.body.sender.country)
      .where('destCountry', '==', req.body.recipient.country)
      .where('active', '==', true)
      .limit(1).get();
    if (rates.empty) return res.status(503).json({ error: 'No configured production rate is available for this route.' });
    const rate = rates.docs[0].data();
    const cost = Math.round((Number(rate.baseRate) + Number(rate.perKgRate) * req.body.packageInfo.weight) * 100) / 100;
    const now = new Date().toISOString();
    const token = randomUUID().replace(/-/g, '').toUpperCase();
    const trackingNumber = 'FDX' + token.slice(0, 12);
    const invoiceNumber = 'INV-' + now.slice(0, 10).replace(/-/g, '') + '-' + token.slice(12, 20);
    const shipment = {
      trackingNumber, invoiceNumber, ownerUid: req.user!.uid,
      sender: req.body.sender, recipient: req.body.recipient, packageInfo: req.body.packageInfo,
      service: req.body.service, status: 'Shipment Created', estimatedDelivery: null, createdAt: now,
      events: [{ id: randomUUID(), status: 'Shipment Created', location: req.body.sender.city, timestamp: now, description: 'Shipment record created. Awaiting payment and operational processing.' }],
      routeWaypoints: [], assignedFacility: null, assignedDriver: null, cost, paymentStatus: 'Pending', currency: String(rate.currency || 'USD').toUpperCase(), rateId: rates.docs[0].id
    };
    const idempotencyKey = req.header('Idempotency-Key');
    if (!idempotencyKey || !/^[A-Za-z0-9._:-]{8,128}$/.test(idempotencyKey)) return res.status(400).json({ error: 'A valid Idempotency-Key is required.' });
    const existingKey = await db.collection('idempotencyKeys').doc(req.user!.uid + ':' + idempotencyKey).get();
    if (existingKey.exists) return res.status(200).json(existingKey.data()!.response);
    const doc = await db.collection('shipments').add(shipment);
    const response = { id: doc.id, ...shipment };
    await db.collection('idempotencyKeys').doc(req.user!.uid + ':' + idempotencyKey).set({ response, createdAt: FieldValue.serverTimestamp() });
    await db.collection('auditLogs').add({ actorUid: req.user!.uid, actorEmail: req.user!.email, action: 'shipment.created', shipmentNumber: trackingNumber, details: 'Shipment record created through authenticated API.', timestamp: FieldValue.serverTimestamp() });
    return res.status(201).json(response);
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid shipment request.' });
  }
});

app.post('/api/payments/checkout', requireAuth, async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Payment provider is not configured.' });
  const { shipmentId } = req.body;
  const idempotencyKey = req.header('Idempotency-Key');
  if (!idempotencyKey || !/^[A-Za-z0-9._:-]{8,128}$/.test(idempotencyKey)) return res.status(400).json({ error: 'A valid Idempotency-Key is required.' });
  if (typeof shipmentId !== 'string' || !shipmentId.trim()) return res.status(400).json({ error: 'shipmentId is required.' });
  if (!appBaseUrl) return res.status(503).json({ error: 'Application base URL is not configured.' });
  const shipmentRef = db.collection('shipments').doc(shipmentId);
  const shipmentSnapshot = await shipmentRef.get();
  if (!shipmentSnapshot.exists) return res.status(404).json({ error: 'Shipment not found.' });
  const shipment = shipmentSnapshot.data()!;
  if (shipment.ownerUid !== req.user!.uid && !req.user!.admin) return res.status(403).json({ error: 'You do not have access to this shipment.' });
  if (shipment.paymentStatus === 'Paid') return res.status(409).json({ error: 'Shipment is already paid.' });
  const amount = Number(shipment.cost);
  const currency = String(shipment.currency || 'USD').toLowerCase();
  if (!Number.isFinite(amount) || amount <= 0) return res.status(400).json({ error: 'Shipment has no payable production amount.' });
  if (!/^[a-z]{3}$/.test(currency)) return res.status(400).json({ error: 'Shipment has an invalid payment currency.' });
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: appBaseUrl + '/dashboard?payment=success',
    cancel_url: appBaseUrl + '/dashboard?payment=cancelled',
    client_reference_id: shipmentId,
    metadata: { shipmentId, ownerUid: shipment.ownerUid },
    line_items: [{ quantity: 1, price_data: { currency: String(shipment.currency || 'usd').toLowerCase(), unit_amount: Math.round(amount * 100), product_data: { name: 'International shipment ' + shipment.trackingNumber } } }],
  }, { idempotencyKey });
  await shipmentRef.update({ paymentSessionId: session.id, paymentProvider: 'stripe' });
  return res.json({ checkoutUrl: session.url, sessionId: session.id });
});

app.post('/api/shipments/:trackingNumber/events', requireAuth, requireAdmin, async (req, res) => {
  const trackingNumber = req.params.trackingNumber.trim().toUpperCase();
  const snapshot = await db.collection('shipments').where('trackingNumber', '==', trackingNumber).limit(1).get();
  if (snapshot.empty) return res.status(404).json({ error: 'Shipment not found.' });
  const { status, location, description, facility } = req.body;
  if (!status || !location || !description) return res.status(400).json({ error: 'status, location and description are required.' });
  const event = { id: randomUUID(), status, location, description, facility: facility || null, timestamp: new Date().toISOString() };
  const doc = snapshot.docs[0];
  await doc.ref.update({ status, events: FieldValue.arrayUnion(event) });
  await db.collection('auditLogs').add({ actorUid: req.user!.uid, actorEmail: req.user!.email, action: 'shipment.status.updated', shipmentNumber: trackingNumber, details: description, timestamp: FieldValue.serverTimestamp() });
  return res.json({ ok: true, event });
});

app.use((_req, res) => res.status(404).json({ error: 'API route not found.' }));
app.listen(port, () => console.log('FedEx logistics API listening on port ' + port));
