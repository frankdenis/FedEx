import { supabaseAdmin } from './supabaseAdmin.js';

const tableMap: Record<string,string> = {
  users: 'profiles',
  shippingRates: 'shipping_rates',
  carrierJobs: 'carrier_jobs',
  idempotencyKeys: 'idempotency_keys',
  stripeEvents: 'stripe_events',
  auditLogs: 'audit_logs',
  shipments: 'shipments',
  supportThreads: 'support_threads',
  supportMessages: 'support_messages',
};

const keyMap: Record<string,string> = { carrierJobs: 'shipment_id' };\n\nconst columnMap: Record<string,string> = {
  ownerUid: 'owner_uid',
  trackingNumber: 'tracking_number',
  carrierTrackingNumber: 'carrier_tracking_number',
  internalReference: 'internal_reference',
  invoiceNumber: 'invoice_number',
  packageInfo: 'package_info',
  estimatedDelivery: 'estimated_delivery',
  createdAt: 'created_at',
  routeWaypoints: 'route_waypoints',
  assignedFacility: 'assigned_facility',
  assignedDriver: 'assigned_driver',
  paymentStatus: 'payment_status',
  rateId: 'rate_id',
  paymentProvider: 'payment_provider',
  paymentReference: 'payment_reference',
  paymentSessionId: 'payment_session_id',
  paidAt: 'paid_at',
  carrierStatus: 'carrier_status',
  carrierRequestId: 'carrier_request_id',
  carrierJobId: 'carrier_job_id',
  labelUrl: 'label_url',
  carrierAttemptAt: 'carrier_attempt_at',
  carrierErrorCode: 'carrier_error_code',
  carrierErrorAt: 'carrier_error_at',
  shipmentId: 'shipment_id',
  queuedAt: 'queued_at',
  startedAt: 'started_at',
  updatedAt: 'updated_at',
  actorUid: 'actor_uid',
  actorEmail: 'actor_email',
  shipmentNumber: 'shipment_number',
  firstName: 'first_name',
  lastName: 'last_name',
};

function tableName(name:string){ return tableMap[name] || name; }\nfunction keyColumn(name:string){ return keyMap[name] || 'id'; }
function col(name:string){ return columnMap[name] || name; }

function encodeValue(value:any):any {
  if (value && value.__sentinel === 'delete') return null;
  if (value && value.__sentinel === 'serverTimestamp') return new Date().toISOString();
  if (value && value.__sentinel === 'increment') return value.value;
  return value;
}

function encodeObject(input:any){
  const out:any={};
  for(const [k,v] of Object.entries(input || {})){
    if (v && typeof v === 'object' && (v as any).__sentinel === 'delete') continue;
    if (v && typeof v === 'object' && (v as any).__sentinel === 'increment') continue;
    out[col(k)] = encodeValue(v);
  }
  return out;
}

function decodeRow(row:any):any {
  if(!row) return null;
  const out:any={id:row.id};
  for(const [k,v] of Object.entries(row)){
    const camel = Object.entries(columnMap).find(([,db])=>db===k)?.[0] || k;
    out[camel]=v;
  }
  return out;
}

class Query {
  private filters:Array<[string,string,any]>=[];
  private ordering:{column:string,ascending:boolean}|null=null;
  private max:number|undefined;
  constructor(private name:string){}
  where(field:string, op:'=='|'!='|'<'|'>'|'<='|'>=', value:any){ this.filters.push([col(field),op,value]); return this; }
  orderBy(field:string, direction:'asc'|'desc'='asc'){ this.ordering={column:col(field),ascending:direction!=='desc'}; return this; }
  limit(value:number){ this.max=value; return this; }
  async get(){
    let q:any=supabaseAdmin.from(tableName(this.name)).select('*');
    for(const [field,op,value] of this.filters){
      if(op==='==') q=q.eq(field,value);
      else if(op==='!=') q=q.neq(field,value);
      else if(op==='<') q=q.lt(field,value);
      else if(op==='>') q=q.gt(field,value);
      else if(op==='<=' ) q=q.lte(field,value);
      else q=q.gte(field,value);
    }
    if(this.ordering) q=q.order(this.ordering.column,{ascending:this.ordering.ascending});
    if(this.max) q=q.limit(this.max);
    const {data,error}=await q;
    if(error) throw error;
    return {empty:!data?.length, docs:(data||[]).map((row:any)=>new DocumentSnapshot(decodeRow(this.name,row), new DocumentRef(this.name, String(row[keyColumn(this.name)]))))};
  }
}

class DocumentSnapshot {
  constructor(private value:any, public readonly ref?: DocumentRef){}
  get exists(){ return !!this.value; }
  data(){ return this.value; }
}

class DocumentRef {
  constructor(private name:string, private id:string){}
  async get(){
    const {data,error}=await supabaseAdmin.from(tableName(this.name)).select('*').eq(keyColumn(this.name),this.id).maybeSingle();
    if(error) throw error;
    return new DocumentSnapshot(decodeRow(this.name,data), new DocumentRef(this.name, this.id));
  }
  async set(value:any, options?:{merge?:boolean}){
    const payload=encodeObject(value);
    if(options?.merge){
      const {error}=await supabaseAdmin.from(tableName(this.name)).upsert({[keyColumn(this.name)]:this.id,...payload},{onConflict:keyColumn(this.name)});
      if(error) throw error;
    }else{
      const {error}=await supabaseAdmin.from(tableName(this.name)).insert({[keyColumn(this.name)]:this.id,...payload});
      if(error) throw error;
    }
  }
  async create(value:any){ return this.set(value); }
  async update(value:any){
    const payload:any = {};
    for (const [key,valueItem] of Object.entries(value || {})) {
      if (valueItem && typeof valueItem === 'object' && (valueItem as any).__sentinel === 'arrayUnion') {
        const current = await this.get();
        const existing = Array.isArray(current.data()?.[key]) ? current.data()[key] : [];
        payload[col(key)] = [...existing, ...((valueItem as any).values || []).filter((item:any)=>!existing.some((x:any)=>JSON.stringify(x)===JSON.stringify(item)))];
      } else {
        payload[col(key)] = encodeValue(valueItem);
      }
    }
    const {error}=await supabaseAdmin.from(tableName(this.name)).update(payload).eq(keyColumn(this.name),this.id);
    if(error) throw error;
  }
}

class Collection {
  constructor(private name:string){}
  doc(id?:string){ return new DocumentRef(this.name,id || crypto.randomUUID()); }
  where(field:string,op:'=='|'!='|'<'|'>'|'<='|'>=',value:any){ return new Query(this.name).where(field,op,value); }
  orderBy(field:string,direction:'asc'|'desc'='asc'){ return new Query(this.name).orderBy(field,direction); }
  limit(value:number){ return new Query(this.name).limit(value); }
  async add(value:any){
    const id=crypto.randomUUID();
    const {error}=await supabaseAdmin.from(tableName(this.name)).insert({[keyColumn(this.name)]:id,...encodeObject(value)});
    if(error) throw error;
    return new DocumentRef(this.name,id);
  }
}

export const FieldValue = {
  serverTimestamp:()=>({__sentinel:'serverTimestamp'}),
  delete:()=>({__sentinel:'delete'}),
  increment:(value:number)=>({__sentinel:'increment',value}),
  arrayUnion:(...values:any[])=>({__sentinel:'arrayUnion',values}),
};

export const db = {
  collection:(name:string)=>new Collection(name),
  rpc: async (name:string,args:any={})=>{
    const {data,error}=await supabaseAdmin.rpc(name,args);
    if(error) throw error;
    return data;
  },
};
