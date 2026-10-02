import 'dotenv/config';
import express from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import { db } from './firebaseAdmin.js';
import { requireAdmin, requireAuth } from './auth.js';
import { assertAddress, assertPackage, assertService } from './validation.js';

const app = express();
const port = Number(process.env.API_PORT || 8787);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'fedex-logistics-api', version: '1.0.0' }));

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
  return res.json({ id: doc.id, ...doc.data() });
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
    const now = new Date().toISOString();
    const token = crypto.randomUUID().replace(/-/g, '').toUpperCase();
    const trackingNumber = 'FDX' + token.slice(0, 12);
    const invoiceNumber = 'INV-' + now.slice(0, 10).replace(/-/g, '') + '-' + token.slice(12, 20);
    const shipment = {
      trackingNumber, invoiceNumber, ownerUid: req.user!.uid,
      sender: req.body.sender, recipient: req.body.recipient, packageInfo: req.body.packageInfo,
      service: req.body.service, status: 'Shipment Created', estimatedDelivery: null, createdAt: now,
      events: [{ id: crypto.randomUUID(), status: 'Shipment Created', location: req.body.sender.city, timestamp: now, description: 'Shipment record created. Awaiting payment and operational processing.' }],
      routeWaypoints: [], assignedFacility: null, assignedDriver: null, cost: null, paymentStatus: 'Pending'
    };
    const doc = await db.collection('shipments').add(shipment);
    await db.collection('auditLogs').add({ actorUid: req.user!.uid, actorEmail: req.user!.email, action: 'shipment.created', shipmentNumber: trackingNumber, details: 'Shipment record created through authenticated API.', timestamp: FieldValue.serverTimestamp() });
    return res.status(201).json({ id: doc.id, ...shipment });
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid shipment request.' });
  }
});

app.post('/api/shipments/:trackingNumber/events', requireAuth, requireAdmin, async (req, res) => {
  const trackingNumber = req.params.trackingNumber.trim().toUpperCase();
  const snapshot = await db.collection('shipments').where('trackingNumber', '==', trackingNumber).limit(1).get();
  if (snapshot.empty) return res.status(404).json({ error: 'Shipment not found.' });
  const { status, location, description, facility } = req.body;
  if (!status || !location || !description) return res.status(400).json({ error: 'status, location and description are required.' });
  const event = { id: crypto.randomUUID(), status, location, description, facility: facility || null, timestamp: new Date().toISOString() };
  const doc = snapshot.docs[0];
  await doc.ref.update({ status, events: FieldValue.arrayUnion(event) });
  await db.collection('auditLogs').add({ actorUid: req.user!.uid, actorEmail: req.user!.email, action: 'shipment.status.updated', shipmentNumber: trackingNumber, details: description, timestamp: FieldValue.serverTimestamp() });
  return res.json({ ok: true, event });
});

app.use((_req, res) => res.status(404).json({ error: 'API route not found.' }));
app.listen(port, () => console.log('FedEx logistics API listening on port ' + port));
