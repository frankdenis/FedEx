import 'dotenv/config';
import express from 'express';
import { FieldValue, db } from './db.js';
import { requireAdmin, requireAuth } from './auth.js';
import { assertAddress, assertPackage, assertService } from './validation.js';
import Stripe from 'stripe';
import { randomUUID } from 'node:crypto';
import { createFedexShipment, fedexConfigured, fedexRequest } from './fedex.js';

const app = express();
const port = Number(process.env.API_PORT || 8787);
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-08-26.dahlia' }) : null;
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  return next();
});
app.use(limitRequests);

async function enqueueCarrierJob(shipmentId: string): Promise<void> {
  await db.rpc('enqueue_carrier_job', { p_shipment_id: shipmentId });
}

async function ensureFedexShipment(shipmentId: string): Promise<'created' | 'processing' | 'failed' | 'skipped'> {
  const claim = await db.rpc('claim_carrier_shipment', { p_shipment_id: shipmentId }) as any;
  const claimResult = String(claim?.result || 'skipped');
  if (claimResult === 'created' || claimResult === 'processing' || claimResult === 'skipped') return claimResult;
  const carrierRequestId = String(claim?.carrierRequestId || ('fedex-' + shipmentId));

  const shipmentSnapshot = await db.collection('shipments').doc(shipmentId).get();
  if (!shipmentSnapshot.exists) return 'skipped';
  const shipment = shipmentSnapshot.data()!;

  try {
    const carrierResponse = await createFedexShipment({
      sender: shipment.sender,
      recipient: shipment.recipient,
      packageInfo: shipment.packageInfo,
      service: shipment.service,
      currency: shipment.currency || 'USD',
      declaredValue: shipment.packageInfo?.declaredValue,
      transactionId: carrierRequestId,
    });
    const carrierOutput = carrierResponse?.output?.transactionShipments?.[0];
    const tracking = carrierOutput?.pieceResponses?.[0]?.trackingNumber || carrierOutput?.masterTrackingNumber || null;
    const labelUrl = carrierOutput?.pieceResponses?.[0]?.packageDocuments?.[0]?.url || null;
    const carrierJobId = carrierResponse?.output?.jobId || carrierResponse?.jobId || null;

    await shipmentSnapshot.ref!.update({
      carrier: 'FedEx',
      carrierStatus: tracking ? 'Created' : 'Submitted',
      carrierTrackingNumber: tracking,
      trackingNumber: tracking,
      labelUrl,
      carrierJobId,
      carrierRequestId,
      status: tracking ? 'Shipment Created' : 'Carrier Processing',
      events: [...(Array.isArray(shipment.events) ? shipment.events : []), { id: randomUUID(), status: tracking ? 'Shipment Created' : 'Carrier Processing', location: shipment.sender?.city || '', timestamp: new Date().toISOString(), description: tracking ? 'Shipment created with FedEx.' : 'FedEx accepted the shipment request for processing.' }],
    });
    return tracking ? 'created' : 'processing';
  } catch (carrierError) {
    const message = carrierError instanceof Error ? carrierError.message : 'FedEx shipment creation failed.';
    const match = message.match(/status (\d+)/i);
    await shipmentSnapshot.ref!.update({
      carrier: 'FedEx',
      carrierStatus: 'Creation Failed',
      status: 'Carrier Action Required',
      carrierErrorCode: match?.[1] || 'UNKNOWN',
      carrierErrorAt: new Date().toISOString(),
    });
    await db.collection('auditLogs').add({
      action: 'carrier.shipment_creation_failed',
      shipmentId,
      carrierRequestId,
      timestamp: FieldValue.serverTimestamp(),
    });
    return 'failed';
  }
}

async function processSuccessfulCheckout(session: Stripe.Checkout.Session): Promise<void> {
  if (session.payment_status !== 'paid') return;

  const guestRequestId = session.metadata?.guestRequestId;
  if (guestRequestId) {
    const requestRef = db.collection('guestShippingRequests').doc(guestRequestId);
    const requestSnapshot = await requestRef.get();
    if (!requestSnapshot.exists) return;
    const request = requestSnapshot.data()!;
    await requestRef.update({
      status: 'paid_pending_review',
      paymentReference: session.payment_intent || session.id,
      stripeSessionId: session.id,
      paidAt: new Date().toISOString(),
      updatedAt: FieldValue.serverTimestamp(),
      messages: FieldValue.arrayUnion({
        id: randomUUID(),
        sender: 'System',
        message: 'Payment confirmed. Your request is now waiting for operational review.',
        timestamp: new Date().toISOString(),
      }),
    });
    await db.collection('auditLogs').add({
      action: 'guest_payment.completed',
      paymentReference: session.payment_intent || session.id,
      details: request.requestNumber || guestRequestId,
      timestamp: FieldValue.serverTimestamp(),
    });
    return;
  }

  const shipmentId = session.metadata?.shipmentId;
  if (!shipmentId) return;
  const shipmentRef = db.collection('shipments').doc(shipmentId);
  const shipmentSnapshot = await shipmentRef.get();
  if (!shipmentSnapshot.exists) return;

  const shipment = shipmentSnapshot.data()!;
  if (shipment.paymentStatus !== 'Paid') {
    await shipmentRef.update({
      paymentStatus: 'Paid',
      paymentProvider: 'stripe',
      paymentReference: session.payment_intent || session.id,
      paidAt: new Date().toISOString(),
      status: 'Payment Confirmed',
    });
    await db.collection('auditLogs').add({
      action: 'payment.completed',
      shipmentId,
      paymentReference: session.payment_intent || session.id,
      timestamp: FieldValue.serverTimestamp(),
    });
  }
  await enqueueCarrierJob(shipmentId);
}

app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return res.status(503).json({ error: 'Payment provider is not configured.' });
  const signature = req.header('stripe-signature');
  if (!signature) return res.status(400).json({ error: 'Missing payment signature.' });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return res.status(400).json({ error: 'Invalid payment webhook signature.' });
  }

  try {
    const claim = await db.rpc('claim_stripe_event', {
      p_event_id: event.id,
      p_event_type: event.type,
    }) as any;

    if (claim?.result === 'processed' || claim?.result === 'processing') {
      return res.json({ received: true, duplicate: true });
    }

    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      await processSuccessfulCheckout(event.data.object as Stripe.Checkout.Session);
    }

    await db.rpc('complete_stripe_event', { p_event_id: event.id });
    return res.json({ received: true });
  } catch (error) {
    try {
      await db.rpc('fail_stripe_event', { p_event_id: event.id });
    } catch {
      // Preserve the original failure so Stripe retries the event.
    }
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Payment webhook processing failed.' });
  }
});

app.use(express.json({ limit: '1mb' }));

app.get('/api/site-settings', async (_req, res) => {
  const snapshot = await db.collection('siteSettings').doc('homepage').get();
  return res.json(snapshot.exists ? snapshot.data()?.value || {} : {});
});

app.post('/api/guest/requests', async (req, res) => {
  try {
    const customer = req.body?.customer || {};
    const sender = req.body?.sender || {};
    const recipient = req.body?.recipient || {};
    const packageInfo = req.body?.packageInfo || {};
    const email = String(customer.email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'A valid email address is required.' });
    if (!String(customer.firstName || '').trim() || !String(customer.lastName || '').trim()) return res.status(400).json({ error: 'First and last name are required.' });
    if (!String(customer.phone || '').trim()) return res.status(400).json({ error: 'Phone number is required.' });
    assertAddress(sender, 'sender');
    assertAddress(recipient, 'recipient');
    assertPackage(packageInfo);
    const id = randomUUID();
    const requestNumber = 'REQ-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + id.replace(/-/g,'').slice(0,8).toUpperCase();
    const row = {
      id, requestNumber, status:'details_submitted', verificationStatus:'pending',
      verificationNotes:'Format validation passed. Identity authenticity requires operational verification.',
      firstName:String(customer.firstName).trim(), lastName:String(customer.lastName).trim(),
      email, phone:String(customer.phone).trim(), sender, recipient, packageInfo,
      messages:[{id:randomUUID(),sender:'System',message:'Request received. Continue to the live shipping calculator to select a production rate.',timestamp:new Date().toISOString()}],
      createdAt:new Date().toISOString(), updatedAt:new Date().toISOString(),
    };
    await db.collection('guestShippingRequests').doc(id).set(row);
    return res.status(201).json({ id, requestNumber, status:row.status });
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid shipping request.' });
  }
});

app.get('/api/guest/requests/:id', async (req, res) => {
  const email = String(req.query.email || '').trim().toLowerCase();
  const snapshot = await db.collection('guestShippingRequests').doc(req.params.id.trim()).get();
  if (!snapshot.exists || !email || String(snapshot.data()?.email || '').toLowerCase() !== email) return res.status(404).json({ error: 'Request not found.' });
  const data = snapshot.data()!;
  return res.json({ id:req.params.id, requestNumber:data.requestNumber, status:data.status, verificationStatus:data.verificationStatus, paymentStatus:data.paidAt ? 'Paid' : 'Pending', messages:data.messages || [], quotedCost:data.quotedCost || null, currency:data.currency || null });
});

app.post('/api/guest/requests/:id/messages', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const snapshot = await db.collection('guestShippingRequests').doc(req.params.id.trim()).get();
  if (!snapshot.exists || !email || String(snapshot.data()?.email || '').toLowerCase() !== email) return res.status(404).json({ error: 'Request not found.' });
  const message = String(req.body?.message || '').trim();
  const paymentProofReference = String(req.body?.paymentProofReference || '').trim();
  if (!message && !paymentProofReference) return res.status(400).json({ error: 'Message or payment proof reference is required.' });
  await snapshot.ref!.update({ messages: FieldValue.arrayUnion({id:randomUUID(),sender:'Customer',message:message || 'Payment proof submitted.',paymentProofReference:paymentProofReference || null,timestamp:new Date().toISOString()}), updatedAt:FieldValue.serverTimestamp() });
  return res.json({ ok:true });
});

app.post('/api/guest/quotes', async (req, res) => {
  try {
    assertService(req.body.service);
    if (typeof req.body.weightKg !== 'number' || req.body.weightKg <= 0) throw new Error('weightKg must be greater than zero.');
    const rates = await db.collection('shippingRates').where('service','==',req.body.service).where('originCountry','==',req.body.originCountry).where('destCountry','==',req.body.destCountry).where('active','==',true).limit(1).get();
    if (rates.empty) return res.status(503).json({ error:'No configured production rate is available for this route.' });
    const rate=rates.docs[0].data();
    const price=Math.round((Number(rate.baseRate)+Number(rate.perKgRate)*req.body.weightKg)*100)/100;
    return res.json({price,estDaysMin:Number(rate.estDaysMin),estDaysMax:Number(rate.estDaysMax),currency:rate.currency || 'USD',rateId:rates.docs[0].id});
  } catch(error) { return res.status(400).json({error:error instanceof Error?error.message:'Invalid quote request.'}); }
});

app.post('/api/guest/payments/checkout', async (req, res) => {
  if (!stripe) return res.status(503).json({error:'Payment provider is not configured.'});
  const requestId=String(req.body?.requestId || '').trim();
  const service=String(req.body?.service || '').trim();
  const rateId=String(req.body?.rateId || '').trim();
  const idempotencyKey=req.header('Idempotency-Key');
  if (!requestId || !service || !rateId) return res.status(400).json({error:'requestId, service and rateId are required.'});
  if (!idempotencyKey || !/^[A-Za-z0-9._:-]{8,128}$/.test(idempotencyKey)) return res.status(400).json({error:'A valid Idempotency-Key is required.'});
  if (!appBaseUrl) return res.status(503).json({error:'Application base URL is not configured.'});
  const requestRef=db.collection('guestShippingRequests').doc(requestId);
  const requestSnapshot=await requestRef.get();
  if (!requestSnapshot.exists) return res.status(404).json({error:'Request not found.'});
  const request=requestSnapshot.data()!;
  if (!['details_submitted','awaiting_payment'].includes(String(request.status))) return res.status(409).json({error:'This request is no longer awaiting payment.'});
  const rateSnapshot=await db.collection('shippingRates').doc(rateId).get();
  if (!rateSnapshot.exists || rateSnapshot.data()?.service !== service || rateSnapshot.data()?.active !== true) return res.status(400).json({error:'Selected production rate is unavailable.'});
  const rate=rateSnapshot.data()!;
  const weight=Number(request.packageInfo?.weight || 0);
  if (!weight) return res.status(400).json({error:'Request package weight is invalid.'});
  const amount=Math.round((Number(rate.baseRate)+Number(rate.perKgRate)*weight)*100)/100;
  const currency=String(rate.currency || 'USD').toLowerCase();
  const session=await stripe.checkout.sessions.create({
    mode:'payment',
    success_url:appBaseUrl+'/communication?request='+encodeURIComponent(requestId)+'&payment=success',
    cancel_url:appBaseUrl+'/quote?request='+encodeURIComponent(requestId)+'&payment=cancelled',
    customer_email:request.email,
    client_reference_id:requestId,
    metadata:{guestRequestId:requestId,requestNumber:request.requestNumber},
    integration_identifier:'fedex-guest-'+randomUUID().replace(/-/g,'').slice(0,8),
    line_items:[{quantity:1,price_data:{currency,unit_amount:Math.round(amount*100),product_data:{name:'Guest shipping request '+request.requestNumber+' · '+service}}}],
  },{idempotencyKey});
  await requestRef.update({status:'awaiting_payment',selectedService:service,quotedCost:amount,currency:String(rate.currency || 'USD').toUpperCase(),rateId, stripeSessionId:session.id, updatedAt:FieldValue.serverTimestamp()});
  return res.json({checkoutUrl:session.url,sessionId:session.id});
});

app.get('/api/admin/guest-requests', requireAuth, requireAdmin, async (_req,res) => {
  const rows=await db.collection('guestShippingRequests').orderBy('createdAt','desc').limit(100).get();
  return res.json(rows.docs.map((d:any)=>({id:d.data().id || d.ref?.id, ...d.data()})));
});

app.patch('/api/admin/guest-requests/:id', requireAuth, requireAdmin, async (req,res) => {
  const status=String(req.body?.status || '');
  if(!['approved','declined'].includes(status)) return res.status(400).json({error:'Status must be approved or declined.'});
  const ref=db.collection('guestShippingRequests').doc(req.params.id.trim());
  const snapshot=await ref.get();
  if(!snapshot.exists) return res.status(404).json({error:'Request not found.'});
  await ref.update({status,verificationStatus:status==='approved'?'passed':'failed',verificationNotes:String(req.body?.note || ''),updatedAt:FieldValue.serverTimestamp(),messages:FieldValue.arrayUnion({id:randomUUID(),sender:'Operations',message:status==='approved'?'Your paid request has been approved for operational processing.':'Your request was declined after operational review.',timestamp:new Date().toISOString()})});
  await db.collection('auditLogs').add({actorUid:req.user!.uid,actorEmail:req.user!.email,action:'guest_request.'+status,details:req.params.id,timestamp:FieldValue.serverTimestamp()});
  return res.json({ok:true,status});
});

app.get('/api/admin/rates', requireAuth, requireAdmin, async (_req,res) => {
  const rows=await db.collection('shippingRates').orderBy('createdAt','desc').limit(200).get();
  return res.json(rows.docs.map((d:any)=>({id:d.data().id || d.ref?.id,...d.data()})));
});

app.post('/api/admin/rates', requireAuth, requireAdmin, async (req,res) => {
  const body=req.body || {};
  if(!body.service || !body.originCountry || !body.destCountry) return res.status(400).json({error:'service, originCountry and destCountry are required.'});
  const row={service:String(body.service),originCountry:String(body.originCountry),destCountry:String(body.destCountry),baseRate:Number(body.baseRate),perKgRate:Number(body.perKgRate),estDaysMin:Number(body.estDaysMin),estDaysMax:Number(body.estDaysMax),currency:String(body.currency || 'USD').toUpperCase(),active:body.active !== false,createdAt:new Date().toISOString()};
  if(!Number.isFinite(row.baseRate)||row.baseRate<0||!Number.isFinite(row.perKgRate)||row.perKgRate<0) return res.status(400).json({error:'Rates must be valid non-negative numbers.'});
  const doc=await db.collection('shippingRates').add(row);
  return res.status(201).json({id:(doc as any).id,...row});
});

app.get('/api/admin/site-settings', requireAuth, requireAdmin, async (_req,res) => {
  const snapshot=await db.collection('siteSettings').doc('homepage').get();
  return res.json(snapshot.exists ? snapshot.data()?.value || {} : {});
});

app.put('/api/admin/site-settings', requireAuth, requireAdmin, async (req,res) => {
  const value=req.body || {};
  const ref=db.collection('siteSettings').doc('homepage');
  await ref.set({id:'homepage',value,updatedAt:new Date().toISOString(),updatedBy:req.user!.uid},{merge:true});
  await db.collection('auditLogs').add({actorUid:req.user!.uid,actorEmail:req.user!.email,action:'site_settings.updated',details:'homepage',timestamp:FieldValue.serverTimestamp()});
  return res.json(value);
});

app.post('/api/internal/carrier-jobs/process', async (req, res) => {
  const secret = process.env.CARRIER_WORKER_SECRET;
  if (!secret || req.header('x-carrier-worker-secret') !== secret) return res.status(401).json({ error: 'Unauthorized.' });
  const limit = Math.min(Math.max(Number(req.body?.limit || 5), 1), 20);
  const queued = await db.collection('carrierJobs').where('status', '==', 'queued').limit(limit).get();
  const results: Array<{ shipmentId: string; result: string }> = [];
  for (const job of queued.docs) {
    const jobRef = job.ref;
    const shipmentId = String(job.data().shipmentId || '');
    if (!shipmentId) continue;
    const claimed = await db.rpc('claim_carrier_job', { p_shipment_id: shipmentId });
    if (!claimed) continue;
    const result = await ensureFedexShipment(shipmentId);
    await jobRef.update({ status: result === 'created' || result === 'processing' ? 'completed' : 'failed', result, updatedAt: FieldValue.serverTimestamp() });
    results.push({ shipmentId, result });
  }
  return res.json({ processed: results.length, results });
});

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'fedex-logistics-api', version: '1.0.0' }));

app.get('/api/carrier/status', requireAuth, (_req, res) => res.json({ configured: fedexConfigured(), provider: 'FedEx REST APIs' }));

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
  res.json(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
});

app.get('/api/shipments/:trackingNumber', async (req, res) => {
  const snapshot = await db.collection('shipments').where('trackingNumber', '==', req.params.trackingNumber.trim().toUpperCase()).limit(1).get();
  if (snapshot.empty) return res.status(404).json({ error: 'Shipment not found.' });
  const doc = snapshot.docs[0];
  const data = doc.data();
  return res.json({
    id: data.trackingNumber,
    trackingNumber: data.trackingNumber,
    carrier: data.carrier || 'FedEx',
    service: data.service,
    status: data.status,
    estimatedDelivery: data.estimatedDelivery || null,
    sender: {
      name: 'Private shipper',
      company: '',
      address: '',
      city: data.sender?.city || '',
      state: '',
      postalCode: '',
      country: data.sender?.country || '',
      phone: '',
    },
    recipient: {
      name: 'Private recipient',
      company: '',
      address: '',
      city: data.recipient?.city || '',
      state: '',
      postalCode: '',
      country: data.recipient?.country || '',
      phone: '',
    },
    packageInfo: {
      type: data.packageInfo?.type || 'Parcel',
      weight: Number(data.packageInfo?.weight || 0),
      length: 0,
      width: 0,
      height: 0,
      pieces: Number(data.packageInfo?.pieces || 1),
      description: '',
      declaredValue: 0,
    },
    events: Array.isArray(data.events)
      ? data.events.map((event: any) => ({
          id: event.id,
          status: event.status,
          location: event.location || '',
          timestamp: event.timestamp,
          description: 'Shipment status update.',
        }))
      : [],
    routeWaypoints: [],
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
    const internalReference = randomUUID().replace(/-/g, '').toUpperCase();
    const invoiceNumber = 'INV-' + now.slice(0, 10).replace(/-/g, '') + '-' + internalReference.slice(0, 8);
    const shipment = {
      trackingNumber: null, carrierTrackingNumber: null, internalReference, invoiceNumber, ownerUid: req.user!.uid,
      sender: req.body.sender, recipient: req.body.recipient, packageInfo: req.body.packageInfo,
      service: req.body.service, status: 'Shipment Created', estimatedDelivery: null, createdAt: now,
      events: [{ id: randomUUID(), status: 'Awaiting Payment', location: req.body.sender.city, timestamp: now, description: 'Shipment order created. FedEx shipment creation occurs after successful payment.' }],
      routeWaypoints: [], assignedFacility: null, assignedDriver: null, cost, paymentStatus: 'Pending', currency: String(rate.currency || 'USD').toUpperCase(), rateId: rates.docs[0].id
    };
    const idempotencyKey = req.header('Idempotency-Key');
    if (!idempotencyKey || !/^[A-Za-z0-9._:-]{8,128}$/.test(idempotencyKey)) return res.status(400).json({ error: 'A valid Idempotency-Key is required.' });

    const shipmentId = randomUUID();
    const response = { id: shipmentId, ...shipment };
    const transactionResult = await db.rpc('create_shipment_idempotent', {
      p_key: req.user!.uid + ':' + idempotencyKey,
      p_owner_uid: req.user!.uid,
      p_shipment: response,
    }) as any;

    if (!transactionResult) return res.status(500).json({ error: 'Shipment creation failed.' });

    const created = transactionResult.id === shipmentId;
    if (created) {
      await db.collection('auditLogs').add({
        actorUid: req.user!.uid,
        actorEmail: req.user!.email,
        action: 'shipment.created',
        shipmentNumber: internalReference,
        details: 'Shipment record created through authenticated API.',
        timestamp: FieldValue.serverTimestamp(),
      });
    }

    return res.status(created ? 201 : 200).json(transactionResult);
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
  const integrationIdentifier = 'fedex-' + randomUUID().replace(/-/g, '').slice(0, 8);
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: appBaseUrl + '/dashboard?payment=success',
    cancel_url: appBaseUrl + '/dashboard?payment=cancelled',
    client_reference_id: shipmentId,
    metadata: { shipmentId, ownerUid: shipment.ownerUid },
    integration_identifier: integrationIdentifier,
    line_items: [{ quantity: 1, price_data: { currency: String(shipment.currency || 'usd').toLowerCase(), unit_amount: Math.round(amount * 100), product_data: { name: 'International shipment ' + (shipment.trackingNumber || shipment.internalReference) } } }],
  }, { idempotencyKey });
  await shipmentRef.update({ paymentSessionId: session.id, paymentProvider: 'stripe' });
  return res.json({ checkoutUrl: session.url, sessionId: session.id });
});

app.post('/api/admin/shipments/:shipmentId/carrier-sync', requireAuth, requireAdmin, async (req, res) => {
  const shipmentId = req.params.shipmentId.trim();
  if (!shipmentId) return res.status(400).json({ error: 'shipmentId is required.' });
  const result = await ensureFedexShipment(shipmentId);
  if (result === 'skipped') return res.status(404).json({ error: 'Shipment not found or payment is not confirmed.' });
  return res.json({ ok: true, carrierSync: result });
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
