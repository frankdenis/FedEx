import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, MessageSquare, Send, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';

interface Props { onNavigate: (path:string)=>void; }

export const GuestCommunicationPage: React.FC<Props> = ({ onNavigate }) => {
  const [id,setId]=useState(() => new URLSearchParams(window.location.search).get('guest') || ''), [email,setEmail]=useState(''), [request,setRequest]=useState<any>(null), [body,setBody]=useState(''), [proof,setProof]=useState(''), [busy,setBusy]=useState(false), [error,setError]=useState('');
  const paymentSuccess = new URLSearchParams(window.location.search).get('payment') === 'success';
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const guest = params.get('guest');
    const payment = params.get('payment');
    if (guest) setId(guest);
    if (payment === 'success') setError('Payment confirmation is being synchronized. Enter the request email and open the thread to see the confirmed payment status.');
  }, []);
  const load=async()=>{setBusy(true);setError('');try{setRequest(await api.guestRequest(id,email))}catch(e){setError(e instanceof Error?e.message:'Request not found.')}finally{setBusy(false)}};
  const send=async()=>{if(!body.trim()&&!proof.trim())return;setBusy(true);try{await api.guestMessage(id,email,body,proof);setBody('');setProof('');await load()}catch(e){setError(e instanceof Error?e.message:'Message could not be sent.')}finally{setBusy(false)}};
  return (
    <div className="min-h-screen bg-[#f7faff] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <button onClick={()=>onNavigate('/')} className="font-black text-[#4D148C]"><ArrowLeft className="mr-1 inline h-4 w-4"/> Back</button>
        <div className="mt-6 grid gap-5 lg:grid-cols-[.72fr_1.28fr]">
          <section className="rounded-[28px] bg-white p-6 shadow-xl">
            <MessageSquare className="h-7 w-7 text-[#4D148C]"/>
            <h1 className="mt-4 text-2xl font-black text-[#15275e]">Guest communication</h1>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#71809b]">Use your request number and email to view payment status and communicate with operations.</p>
            <div className="mt-6 space-y-3">
              <input value={id} onChange={e=>setId(e.target.value)} placeholder="Request number or request ID" className="w-full rounded-xl border border-[#d9e1ed] px-3 py-3 text-sm font-semibold"/>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Request email" className="w-full rounded-xl border border-[#d9e1ed] px-3 py-3 text-sm font-semibold"/>
              <button onClick={load} disabled={busy} className="w-full rounded-xl bg-[#4D148C] py-3 text-sm font-black text-white">{busy?'Loading…':'Open secure thread'}</button>
            </div>
            {paymentSuccess && !error && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-black text-emerald-800">Payment success received. Open your request thread to view the synchronized payment status.</div>}
            {error&&<div className="mt-4 rounded-xl bg-rose-50 p-3 text-xs font-bold text-rose-700">{error}</div>}
          </section>
          <section className="rounded-[28px] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between"><div><div className="text-[10px] font-black uppercase tracking-[.14em] text-[#4D148C]">Secure guest thread</div><h2 className="mt-1 text-xl font-black text-[#15275e]">{request?.requestNumber||'No request loaded'}</h2></div><ShieldCheck className="h-6 w-6 text-emerald-600"/></div>
            {request ? <><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-[#f6f8fc] p-3"><div className="text-[10px] font-black text-[#7d89a0]">Request status</div><div className="mt-1 text-sm font-black">{request.status}</div></div><div className="rounded-xl bg-[#f6f8fc] p-3"><div className="text-[10px] font-black text-[#7d89a0]">Payment</div><div className="mt-1 text-sm font-black">{request.paymentStatus}</div></div></div><div className="mt-5 max-h-[320px] space-y-3 overflow-y-auto rounded-2xl bg-[#f8faff] p-4">{(request.messages||[]).map((m:any)=><div key={m.id} className="rounded-xl bg-white p-3 shadow-sm"><div className="text-[10px] font-black text-[#7b879f]">{m.sender} · {m.timestamp?new Date(m.timestamp).toLocaleString():''}</div><div className="mt-1 text-sm font-semibold text-[#2b3b65]">{m.body||m.message}</div>{m.paymentReference&&<div className="mt-2 text-xs font-bold text-[#4D148C]">Payment reference: {m.paymentReference}</div>}</div>)}</div><textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Message operations…" className="mt-4 min-h-24 w-full rounded-xl border border-[#d9e1ed] px-3 py-3 text-sm font-semibold"/><div className="mt-2 flex gap-2"><input value={proof} onChange={e=>setProof(e.target.value)} placeholder="Payment reference (optional)" className="min-w-0 flex-1 rounded-xl border border-[#d9e1ed] px-3 py-3 text-xs font-semibold"/><button onClick={send} disabled={busy} className="grid h-12 w-12 place-items-center rounded-xl bg-[#4D148C] text-white"><Send className="h-4 w-4"/></button></div></> : <div className="py-24 text-center text-sm font-semibold text-[#7b879f]"><CheckCircle2 className="mx-auto h-8 w-8 text-[#c7d1e2]"/><div className="mt-3">Open a request to see its payment and communication status.</div></div>}
          </section>
        </div>
      </div>
    </div>
  );
};
