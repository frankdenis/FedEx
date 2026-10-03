import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Mail, MapPin, Package, Phone, ShieldCheck, UserRound } from 'lucide-react';
import { api } from '../lib/api';

interface Props { onNavigate: (path: string) => void; }

export const GuestShippingPage: React.FC<Props> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [request, setRequest] = useState<any>(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    firstName:'', lastName:'', email:'', phone:'',
    senderName:'', senderAddress:'', senderCity:'', senderCountry:'Nigeria',
    recipientName:'', recipientAddress:'', recipientCity:'', recipientCountry:'United States',
    description:'', weight:1, length:20, width:15, height:10, pieces:1, declaredValue:0
  });

  const update = (key:string, value:any) => setForm(v => ({...v,[key]:value}));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setBusy(true);
    try {
      const result = await api.createGuestRequest({
        customer:{firstName:form.firstName,lastName:form.lastName,email:form.email,phone:form.phone},
        sender:{name:form.senderName,address:form.senderAddress,city:form.senderCity,country:form.senderCountry},
        recipient:{name:form.recipientName,address:form.recipientAddress,city:form.recipientCity,country:form.recipientCountry},
        packageInfo:{type:'Parcel',description:form.description,weight:Number(form.weight),length:Number(form.length),width:Number(form.width),height:Number(form.height),pieces:Number(form.pieces),declaredValue:Number(form.declaredValue)}
      });
      setRequest(result); setStep(2);
    } catch(e) { setError(e instanceof Error ? e.message : 'Request could not be submitted.'); }
    finally { setBusy(false); }
  };

  return <div className="min-h-screen bg-[#f7faff] px-4 py-10 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between"><button onClick={()=>onNavigate('/')} className="font-black text-[#4D148C]"><ArrowLeft className="mr-1 inline h-4 w-4"/> Back</button><div className="text-right"><div className="text-[10px] font-black uppercase tracking-[.16em] text-[#4D148C]">Guest shipping</div><div className="text-sm font-black text-[#17285e]">No account required</div></div></div>
      <div className="mt-7 rounded-[30px] border border-white bg-white p-6 shadow-[0_25px_70px_rgba(35,52,94,.12)] sm:p-9">
        <div className="flex flex-wrap items-center gap-3 border-b border-[#edf0f5] pb-6">
          {[['1','Details'],['2','Confirm'],['3','Calculator'],['4','Payment']].map(([n,label])=><div key={n} className={'flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black '+(Number(n)===step?'bg-[#4D148C] text-white':'bg-[#f2f5fa] text-[#72809c]')}><span>{n}</span>{label}</div>)}
        </div>
        {error && <div className="mt-5 rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</div>}
        {step===1 && <form onSubmit={submit} className="mt-7 space-y-6">
          <div><h1 className="text-3xl font-black text-[#14265e]">Request a shipment</h1><p className="mt-2 text-sm font-semibold text-[#6f7c98]">Fill in the client and shipment details. We validate the submission format before it reaches the calculator.</p></div>
          <div className="grid gap-4 md:grid-cols-2">
            {([['firstName','First name'],['lastName','Last name'],['email','Email address'],['phone','Phone number']] as const).map(([key,label])=><label key={key} className="text-xs font-black text-[#2c3d68]">{label}<div className="relative mt-1.5"><input required type={key==='email'?'email':'text'} value={(form as any)[key]} onChange={e=>update(key,e.target.value)} className="w-full rounded-xl border border-[#d9e1ed] px-3 py-3 font-semibold outline-none focus:border-[#4D148C]"/></div></label>)}
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {([['sender','Sender'],['recipient','Recipient']] as const).map(([side,label])=><div key={side} className="rounded-2xl border border-[#e1e7f0] bg-[#fbfcff] p-4"><div className="mb-4 flex items-center gap-2 text-sm font-black text-[#17285e]"><MapPin className="h-4 w-4 text-[#4D148C]"/>{label} details</div><div className="space-y-3">
              <input required placeholder="Full name / company" value={(form as any)[side+'Name']} onChange={e=>update(side+'Name',e.target.value)} className="w-full rounded-xl border border-[#d9e1ed] px-3 py-3 text-sm font-semibold"/>
              <input required placeholder="Full address" value={(form as any)[side+'Address']} onChange={e=>update(side+'Address',e.target.value)} className="w-full rounded-xl border border-[#d9e1ed] px-3 py-3 text-sm font-semibold"/>
              <div className="grid grid-cols-2 gap-2"><input required placeholder="City" value={(form as any)[side+'City']} onChange={e=>update(side+'City',e.target.value)} className="w-full rounded-xl border border-[#d9e1ed] px-3 py-3 text-sm font-semibold"/><input required placeholder="Country" value={(form as any)[side+'Country']} onChange={e=>update(side+'Country',e.target.value)} className="w-full rounded-xl border border-[#d9e1ed] px-3 py-3 text-sm font-semibold"/></div>
            </div></div>)}
          </div>
          <div className="rounded-2xl border border-[#e1e7f0] p-4"><div className="mb-4 flex items-center gap-2 text-sm font-black text-[#17285e]"><Package className="h-4 w-4 text-[#4D148C]"/> Package details</div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[['weight','Weight kg'],['length','Length cm'],['width','Width cm'],['height','Height cm']].map(([key,label])=><label key={key} className="text-[11px] font-black text-[#53617d]">{label}<input required type="number" min="0.1" step="0.1" value={(form as any)[key]} onChange={e=>update(key,Number(e.target.value))} className="mt-1 w-full rounded-xl border border-[#d9e1ed] px-3 py-3 text-sm font-bold"/></label>)}</div><textarea required placeholder="Package description" value={form.description} onChange={e=>update('description',e.target.value)} className="mt-3 min-h-24 w-full rounded-xl border border-[#d9e1ed] px-3 py-3 text-sm font-semibold"/>
          </div>
          <button disabled={busy} className="rounded-2xl bg-gradient-to-r from-[#4D148C] to-[#7925dc] px-6 py-3.5 text-sm font-black text-white shadow-lg disabled:opacity-60">{busy?'Validating…':'Review details'} <ArrowRight className="ml-1 inline h-4 w-4"/></button>
        </form>}
        {step===2 && request && <div className="mt-7 space-y-6"><div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><div className="flex items-center gap-2 text-emerald-800 font-black"><CheckCircle2 className="h-5 w-5"/> Details received</div><p className="mt-2 text-sm font-semibold text-emerald-900/80">Request {request.requestNumber} passed the required data validation. Identity authenticity remains subject to operational review; the system will not pretend a person is verified when it has not been verified.</p></div><div className="grid gap-4 md:grid-cols-2">{[['Customer',form.firstName+' '+form.lastName],['Contact',form.email+' · '+form.phone],['Route',form.senderCity+', '+form.senderCountry+' → '+form.recipientCity+', '+form.recipientCountry],['Package',form.weight+' kg · '+form.description]].map(([a,b])=><div key={a} className="rounded-2xl border border-[#e1e7f0] p-4"><div className="text-[10px] font-black uppercase tracking-[.14em] text-[#7b879f]">{a}</div><div className="mt-1 text-sm font-black text-[#1c2f64]">{b}</div></div>)}</div><div className="flex flex-wrap gap-3"><button onClick={()=>setStep(1)} className="rounded-xl border border-[#d9e1ed] px-5 py-3 text-sm font-black text-[#2a3b65]">Edit details</button><button onClick={()=>onNavigate('/quote?request='+encodeURIComponent(request.id))} className="rounded-xl bg-[#4D148C] px-5 py-3 text-sm font-black text-white">Continue to shipping calculator <ArrowRight className="ml-1 inline h-4 w-4"/></button></div></div>}
      </div>
      <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-[#7a879e]"><ShieldCheck className="h-4 w-4 text-[#4D148C]"/> Payment is collected before an operational review of the guest request.</div>
    </div>
  </div>;
};
