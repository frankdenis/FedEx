import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, MapPin, Package, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';

interface Props { onNavigate: (path: string) => void; }

export const GuestShippingPage: React.FC<Props> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');
  const [request, setRequest] = useState<any>(null);
  const [f, setF] = useState({
    firstName:'', lastName:'', email:'', phone:'',
    senderName:'', senderAddress:'', senderCity:'', senderCountry:'Nigeria',
    recipientName:'', recipientAddress:'', recipientCity:'', recipientCountry:'United States',
    description:'', weight:1, length:20, width:15, height:10
  });
  const set=(key:string,value:any)=>setF(current=>({...current,[key]:value}));

  const submit=async(e:React.FormEvent)=>{
    e.preventDefault(); setBusy(true); setError('');
    try {
      const result=await api.createGuestRequest({
        customer:{firstName:f.firstName,lastName:f.lastName,email:f.email,phone:f.phone},
        sender:{name:f.senderName,address:f.senderAddress,city:f.senderCity,country:f.senderCountry},
        recipient:{name:f.recipientName,address:f.recipientAddress,city:f.recipientCity,country:f.recipientCountry},
        packageInfo:{type:'Parcel',description:f.description,weight:Number(f.weight),length:Number(f.length),width:Number(f.width),height:Number(f.height),pieces:1,declaredValue:0}
      });
      setRequest(result); setStep(2);
    } catch(e) { setError(e instanceof Error ? e.message : 'Request could not be submitted.'); }
    finally { setBusy(false); }
  };

  const Field=({name,label,type='text'}:{name:string;label:string;type?:string})=>(
    <label className="text-xs font-black text-[#34446b]">{label}
      <input required type={type} value={(f as any)[name]} onChange={e=>set(name,e.target.value)} className="mt-1.5 w-full rounded-xl border border-[#d9e1ed] bg-white px-3 py-3 font-semibold outline-none focus:border-[#4D148C]"/>
    </label>
  );

  return (
    <div className="min-h-screen bg-[#f7faff] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <button onClick={()=>onNavigate('/')} className="font-black text-[#4D148C]"><ArrowLeft className="mr-1 inline h-4 w-4"/> Back</button>
        <div className="mt-6 rounded-[30px] border border-white bg-white p-5 shadow-[0_25px_70px_rgba(35,52,94,.12)] sm:p-9">
          <div className="flex flex-wrap gap-2 border-b border-[#edf0f5] pb-6">
            {['Details','Confirm','Calculator','Payment'].map((label,index)=><span key={label} className={'rounded-full px-4 py-2 text-xs font-black '+(index+1===step?'bg-[#4D148C] text-white':'bg-[#f1f4f9] text-[#77849d]')}>{index+1} {label}</span>)}
          </div>
          {error&&<div className="mt-5 rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</div>}

          {step===1&&<form onSubmit={submit} className="mt-7 space-y-7">
            <div><h1 className="text-3xl font-black tracking-tight text-[#14265e]">Request a shipment without an account</h1><p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-[#6f7c98]">Complete the client details below. The system validates required fields and creates a production request; authenticity is never falsely marked as verified.</p></div>
            <div className="grid gap-4 md:grid-cols-2"><Field name="firstName" label="First name"/><Field name="lastName" label="Last name"/><Field name="email" label="Email" type="email"/><Field name="phone" label="Phone"/></div>
            <div className="grid gap-5 md:grid-cols-2">
              {([['sender','Sender'],['recipient','Recipient']] as const).map(([side,label])=><div key={side} className="rounded-2xl border border-[#e1e7f0] bg-[#fbfcff] p-4"><div className="mb-4 flex items-center gap-2 text-sm font-black"><MapPin className="h-4 w-4 text-[#4D148C]"/>{label} details</div><div className="space-y-3"><Field name={side+'Name'} label="Full name"/><Field name={side+'Address'} label="Address"/><div className="grid grid-cols-2 gap-2"><Field name={side+'City'} label="City"/><Field name={side+'Country'} label="Country"/></div></div></div>)}
            </div>
            <div className="rounded-2xl border border-[#e1e7f0] p-4"><div className="mb-4 flex items-center gap-2 text-sm font-black"><Package className="h-4 w-4 text-[#4D148C]"/> Package details</div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[['weight','Weight kg'],['length','Length cm'],['width','Width cm'],['height','Height cm']].map(([name,label])=><label key={name} className="text-[10px] font-black text-[#53617d]">{label}<input required type="number" min=".1" step=".1" value={(f as any)[name]} onChange={e=>set(name,Number(e.target.value))} className="mt-1 w-full rounded-xl border border-[#d9e1ed] px-2 py-3 text-sm font-black"/></label>)}</div><textarea required value={f.description} onChange={e=>set('description',e.target.value)} placeholder="Package description" className="mt-3 min-h-24 w-full rounded-xl border border-[#d9e1ed] px-3 py-3 text-sm font-semibold"/></div>
            <button disabled={busy} className="rounded-2xl bg-gradient-to-r from-[#4D148C] to-[#7925dc] px-6 py-3.5 text-sm font-black text-white">{busy?'Validating…':'Review details'} <ArrowRight className="ml-1 inline h-4 w-4"/></button>
          </form>}

          {step===2&&request&&<div className="mt-7 space-y-6">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><div className="flex items-center gap-2 font-black text-emerald-800"><CheckCircle2 className="h-5 w-5"/> Request received: {request.requestNumber}</div><p className="mt-2 text-sm font-semibold text-emerald-900/80">Required fields passed validation. Manual operational review remains separate from payment and will not be falsely represented as an automated identity check.</p></div>
            <div className="grid gap-3 md:grid-cols-2">{[['Customer',f.firstName+' '+f.lastName],['Contact',f.email+' · '+f.phone],['Route',f.senderCity+', '+f.senderCountry+' → '+f.recipientCity+', '+f.recipientCountry],['Package',f.weight+' kg · '+f.description]].map(([label,value])=><div key={label} className="rounded-xl border border-[#e1e7f0] p-4"><div className="text-[10px] font-black uppercase text-[#7b879f]">{label}</div><div className="mt-1 text-sm font-black text-[#1c2f64]">{value}</div></div>)}</div>
            <label className="flex items-start gap-3 rounded-2xl border border-[#d9e1ed] bg-[#fbfcff] p-4 text-xs font-bold text-[#42516f]"><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#4D148C]"/><span>I confirm that the customer, sender, recipient and package details shown above are correct. This confirmation does not replace operational verification.</span></label><div className="flex flex-col gap-3 sm:flex-row"><button onClick={()=>setStep(1)} className="rounded-xl border border-[#d9e1ed] px-5 py-3 text-sm font-black">Edit details</button><button disabled={!confirmed} onClick={()=>onNavigate('/quote?request='+encodeURIComponent(request.id))} className="rounded-xl bg-[#4D148C] px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40">Open live shipping calculator <ArrowRight className="ml-1 inline h-4 w-4"/></button></div>
          </div>}
        </div>
        <div className="mt-4 flex justify-center gap-2 text-[10px] font-bold text-[#7a879e]"><ShieldCheck className="h-4 w-4 text-[#4D148C]"/> Payment is collected before operational review.</div>
      </div>
    </div>
  );
};
