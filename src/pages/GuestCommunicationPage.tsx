import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, MessageSquare, Send, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';

interface Props { onNavigate: (path: string) => void; }

export const GuestCommunicationPage: React.FC<Props> = ({ onNavigate }) => {
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [request, setRequest] = useState<any>(null);
  const [body, setBody] = useState('');
  const [proof, setProof] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setBusy(true); setError('');
    try {
      setRequest(await api.getGuestRequest(id.trim(), email.trim()));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request not found.');
    } finally {
      setBusy(false);
    }
  };

  const send = async () => {
    if (!body.trim() && !proof.trim()) return;
    setBusy(true); setError('');
    try {
      await api.sendGuestMessage(id.trim(), email.trim(), { message: body.trim(), paymentProofReference: proof.trim() });
      setBody(''); setProof('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Message could not be sent.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7faff] px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <button onClick={() => onNavigate('/')} className="font-black text-[#4D148C]"><ArrowLeft className="mr-1 inline h-4 w-4" /> Back</button>
        <div className="mt-7 grid gap-5 lg:grid-cols-[.72fr_1.28fr]">
          <div className="rounded-[28px] bg-white p-6 shadow-xl">
            <MessageSquare className="h-7 w-7 text-[#4D148C]" />
            <h1 className="mt-4 text-2xl font-black text-[#15275e]">Customer communication</h1>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#71809b]">Use your request number and email to follow payment status and communicate with operations.</p>
            <div className="mt-6 space-y-3">
              <input value={id} onChange={event => setId(event.target.value)} placeholder="Request number or request ID" className="w-full rounded-xl border border-[#d9e1ed] px-3 py-3 text-sm font-semibold" />
              <input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="Request email" className="w-full rounded-xl border border-[#d9e1ed] px-3 py-3 text-sm font-semibold" />
              <button onClick={load} disabled={busy} className="w-full rounded-xl bg-[#4D148C] py-3 text-sm font-black text-white">Open secure thread</button>
            </div>
            {error && <div className="mt-4 rounded-xl bg-rose-50 p-3 text-xs font-bold text-rose-700">{error}</div>}
          </div>
          <div className="rounded-[28px] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div><div className="text-[10px] font-black uppercase tracking-[.14em] text-[#4D148C]">Secure guest thread</div><h2 className="mt-1 text-xl font-black text-[#15275e]">{request?.requestNumber || 'No request loaded'}</h2></div>
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
            </div>
            {request ? (
              <>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#f6f8fc] p-3"><div className="text-[10px] font-black text-[#7d89a0]">Request status</div><div className="mt-1 text-sm font-black">{request.status}</div></div>
                  <div className="rounded-xl bg-[#f6f8fc] p-3"><div className="text-[10px] font-black text-[#7d89a0]">Payment</div><div className="mt-1 text-sm font-black">{request.paymentStatus}</div></div>
                </div>
                <div className="mt-5 max-h-[320px] space-y-3 overflow-y-auto rounded-2xl bg-[#f8faff] p-4">
                  {(request.messages || []).map((message: any) => (
                    <div key={message.id} className="rounded-xl bg-white p-3 shadow-sm">
                      <div className="text-[10px] font-black text-[#7b879f]">{message.sender} · {message.timestamp ? new Date(message.timestamp).toLocaleString() : ''}</div>
                      <div className="mt-1 text-sm font-semibold text-[#2b3b65]">{message.body || message.message}</div>
                      {message.paymentReference && <div className="mt-2 text-xs font-bold text-[#4D148C]">Payment proof: {message.paymentReference}</div>}
                    </div>
                  ))}
                </div>
                <textarea value={body} onChange={event => setBody(event.target.value)} placeholder="Message operations…" className="mt-4 min-h-24 w-full rounded-xl border border-[#d9e1ed] px-3 py-3 text-sm font-semibold" />
                <div className="mt-2 flex gap-2">
                  <input value={proof} onChange={event => setProof(event.target.value)} placeholder="Payment proof reference (optional)" className="min-w-0 flex-1 rounded-xl border border-[#d9e1ed] px-3 py-3 text-xs font-semibold" />
                  <button onClick={send} disabled={busy} className="grid h-12 w-12 place-items-center rounded-xl bg-[#4D148C] text-white"><Send className="h-4 w-4" /></button>
                </div>
              </>
            ) : (
              <div className="py-24 text-center text-sm font-semibold text-[#7b879f]"><CheckCircle2 className="mx-auto h-8 w-8 text-[#c7d1e2]" /><div className="mt-3">Open a request to see its communication status.</div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
