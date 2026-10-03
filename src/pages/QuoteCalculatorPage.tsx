import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Calculator, CheckCircle2, CreditCard, Loader2, Package, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';

interface Props { onNavigate:(path:string)=>void; initialRequestId?:string; }

const services = [
  {id:'Express',name:'Express',copy:'Priority movement for time-sensitive shipments.'},
  {id:'Priority',name:'Priority',copy:'Fast international service with production rates.'},
  {id:'Standard',name:'Standard',copy:'Economical service where available.'},
];

export const QuoteCalculatorPage: React.FC<Props> = ({onNavigate,initialRequestId}) => {
  const [requestId] = useState(initialRequestId || '');
  const [originCountry,setOriginCountry]=useState('Nigeria');
  const [destCountry,setDestCountry]=useState('United States');
  const [weight,setWeight]=useState(1);
  const [length,setLength]=useState(20);
  const [width,setWidth]=useState(15);
  const [height,setHeight]=useState(10);
  const [quotes,setQuotes]=useState<any[]>([]);
  const [selected,setSelected]=useState<any>(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');

  const calculate=async(e:React.FormEvent)=>{
    e.preventDefault();setError('');setBusy(true);
    try{
      const results=await Promise.allSettled(services.map(s=>api.guestQuote({service:s.id,weightKg:Number(weight),originCountry,destCountry})));
      const available=results.map((r,i)=>r.status==='fulfilled'?{...services[i],...r.value}:null).filter(Boolean) as any[];
      if(!available.length) throw new Error('No configured production rate is available for this route. Please try another service or route.');
      setQuotes(available);setSelected(available[0]);
    }catch(e){setError(e instanceof Error?e.message:'Live rate calculation failed.')}
    finally{setBusy(false);}
  };

  const dimensions=(length*width*height)/5000;
  const chargeable=Math.max(Number(weight)||0,dimensions);

  const pay=async()=>{
    if(!requestId){setError('A guest shipping request is required before payment. Start from Request a Shipment.');return;}
    if(!selected){setError('Select a live rate first.');return;}
    setError('');setBusy(true);
    try{
      const result=await api.guestPaymentCheckout(requestId,selected.id,selected.rateId);
      if(result.checkoutUrl) window.location.href=result.checkoutUrl;
      else throw new Error('Payment checkout is not available.');
    }catch(e){setError(e instanceof Error?e.message:'Payment could not be started.')}
    finally{setBusy(false);}
  };

  return <div className="min-h-screen bg-[#f7faff] px-4 py-10 sm:px-6 lg:px-8"><div className="mx-auto max-w-6xl">
    <div className="flex items-center justify-between"><button onClick={()=>onNavigate(requestId?'/request-shipping':'/')} className="font-black text-[#4D148C]"><ArrowLeft className="mr-1 inline h-4 w-4"/> Back</button><div className="text-right"><div className="text-[10px] font-black uppercase tracking-[.16em] text-[#4D148C]">Live rate engine</div><div className="text-sm font-black text-[#17285e]">Production rates only</div></div></div>
    <div className="mt-7 grid gap-5 lg:grid-cols-[.82fr_1.18fr]">
      <div className="rounded-[28px] bg-white p-6 shadow-xl sm:p-8"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#f0e8ff] text-[#4D148C]"><Calculator className="h-5 w-5"/></span><div><h1 className="text-2xl font-black text-[#14265e]">Shipping calculator</h1><p className="text-xs font-semibold text-[#75819a]">Enter the actual package information.</p></div></div>
        <form onSubmit={calculate} className="mt-7 space-y-4">
          <div className="grid grid-cols-2 gap-3"><label className="text-xs font-black text-[#34446b]">Origin country<select value={originCountry} onChange={e=>setOriginCountry(e.target.value)} className="mt-1.5 w-full rounded-xl border border-[#d9e1ed] bg-white px-3 py-3 font-bold"><option>Nigeria</option><option>United States</option><option>United Kingdom</option><option>Germany</option><option>United Arab Emirates</option><option>Canada</option></select></label><label className="text-xs font-black text-[#34446b]">Destination country<select value={destCountry} onChange={e=>setDestCountry(e.target.value)} className="mt-1.5 w-full rounded-xl border border-[#d9e1ed] bg-white px-3 py-3 font-bold"><option>United States</option><option>Nigeria</option><option>United Kingdom</option><option>Germany</option><option>United Arab Emirates</option><option>Canada</option></select></label></div>
          <div className="grid grid-cols-4 gap-2">{[['weight','Weight kg'],['length','L cm'],['width','W cm'],['height','H cm']].map(([k,l])=><label key={k} className="text-[10px] font-black text-[#53617d]">{l}<input type="number" min="0.1" step="0.1" value={(k==='weight'?weight:k==='length'?length:k==='width'?width:height) as any} onChange={e=>{const v=Number(e.target.value);if(k==='weight')setWeight(v);if(k==='length')setLength(v);if(k==='width')setWidth(v);if(k==='height')setHeight(v)}} className="mt-1 w-full rounded-xl border border-[#d9e1ed] px-2 py-3 text-sm font-black"/></label>)}</div>
          <div className="rounded-xl bg-[#f7f9fd] p-3 text-xs font-bold text-[#62708d]">Chargeable weight: <span className="font-black text-[#17285e]">{chargeable.toFixed(2)} kg</span></div>
          <button disabled={busy} className="w-full rounded-2xl bg-gradient-to-r from-[#4D148C] to-[#7925dc] py-3.5 text-sm font-black text-white shadow-lg disabled:opacity-60">{busy?<Loader2 className="mx-auto h-5 w-5 animate-spin"/>:<><Calculator className="mr-1 inline h-4 w-4"/> Calculate live rates</>}</button>
        </form>
        {error&&<div className="mt-4 rounded-xl bg-rose-50 p-3 text-xs font-bold text-rose-700">{error}</div>}
      </div>
      <div className="rounded-[28px] bg-white p-6 shadow-xl sm:p-8"><div className="flex items-center justify-between"><div><div className="text-[10px] font-black uppercase tracking-[.15em] text-[#4D148C]">Bill preview</div><h2 className="mt-1 text-2xl font-black text-[#14265e]">Choose your service</h2></div><Package className="h-6 w-6 text-[#4D148C]"/></div>
        <div className="mt-6 space-y-3">{quotes.length?quotes.map(q=><button key={q.id} onClick={()=>setSelected(q)} className={'w-full rounded-2xl border-2 p-4 text-left transition '+(selected?.id===q.id?'border-[#4D148C] bg-[#faf7ff]':'border-[#e1e7f0] hover:border-[#cfc0e8]')}><div className="flex items-start justify-between gap-3"><div><div className="text-sm font-black text-[#17285e]">{q.name}</div><div className="mt-1 text-[11px] font-semibold text-[#78859f]">{q.copy} · {q.estDaysMin}–{q.estDaysMax} days</div></div><div className="text-right"><div className="text-lg font-black text-[#17285e]">{q.currency} {Number(q.price).toFixed(2)}</div>{selected?.id===q.id&&<CheckCircle2 className="ml-auto mt-1 h-4 w-4 text-[#18a870]"/>}</div></div></button>):<div className="rounded-2xl border border-dashed border-[#cfd8e7] p-12 text-center text-sm font-semibold text-[#7b879f]">Calculate a live rate to populate the bill.</div>}</div>
        {selected&&<div className="mt-5 rounded-2xl bg-[#13204a] p-5 text-white"><div className="flex items-center justify-between"><span className="text-xs font-bold text-white/60">Total shipping charge</span><span className="text-2xl font-black">{selected.currency} {Number(selected.price).toFixed(2)}</span></div><div className="mt-3 border-t border-white/10 pt-3 text-[11px] font-semibold text-white/65">Payment is required before an administrator reviews the guest request for operational acceptance.</div><button onClick={pay} disabled={busy} className="mt-4 w-full rounded-xl bg-white py-3 text-sm font-black text-[#4D148C]">{busy?'Opening secure checkout…':<>Proceed to secure payment <CreditCard className="ml-1 inline h-4 w-4"/></>}</button></div>}
        <div className="mt-5 flex items-center gap-2 text-[10px] font-bold text-[#7b879f]"><ShieldCheck className="h-4 w-4 text-[#18a870]"/> Rates are read from the production shipping-rate table. No sample prices are shown.</div>
      </div>
    </div>
  </div></div>;
};
