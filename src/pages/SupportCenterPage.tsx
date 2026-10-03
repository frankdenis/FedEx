import React, { useEffect, useState } from 'react';
import { CheckCircle2, HelpCircle, Loader2, Mail, MessageSquare, Paperclip, Send, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';

interface SupportCenterPageProps { onNavigate: (path: string) => void; onOpenChat: () => void; }

export const SupportCenterPage: React.FC<SupportCenterPageProps> = ({ onNavigate, onOpenChat }) => {
  const [threads, setThreads] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  const load = async () => {
    try { const data = await api.supportThreads(); setThreads(data || []); } catch (e) { setNotice(e instanceof Error ? e.message : 'Secure support is unavailable.'); }
  };
  useEffect(() => { load(); }, []);

  const openThread = async (thread:any) => {
    setSelected(thread);
    try { setMessages(await api.supportMessages(thread.id)); } catch (e) { setNotice(e instanceof Error ? e.message : 'Unable to load conversation.'); }
  };

  const createThread = async (event:React.FormEvent) => {
    event.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    setBusy(true); setNotice('');
    try {
      const result = await api.supportCreateThread({ subject, body, priority:'normal', paymentReference: paymentReference.trim() || undefined });
      setSubject(''); setBody(''); setPaymentReference('');
      await load();
      const thread = (await api.supportThreads()).find((item:any)=>item.id===result.id);
      if (thread) await openThread(thread);
      setNotice('Your message has been delivered to the secured support queue.');
    } catch (e) { setNotice(e instanceof Error ? e.message : 'Unable to send your message.'); } finally { setBusy(false); }
  };

  const reply = async (event:React.FormEvent) => {
    event.preventDefault();
    if (!selected || !body.trim()) return;
    setBusy(true); setNotice('');
    try { await api.supportReply(selected.id, body.trim(), paymentReference.trim() || undefined); setBody(''); setPaymentReference(''); await openThread(selected); await load(); }
    catch (e) { setNotice(e instanceof Error ? e.message : 'Unable to send reply.'); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-[calc(100vh-150px)] bg-[#f7f9ff] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-[30px] bg-gradient-to-br from-[#17052b] via-[#4D148C] to-[#7b21dc] p-7 text-white shadow-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div><div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[9px] font-black uppercase tracking-[.16em]"><ShieldCheck className="h-3.5 w-3.5"/> Secure communication</div><h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Customer Communication Center</h1><p className="mt-2 max-w-2xl text-sm text-white/75">Send payment references, shipment questions and service requests directly into the production support queue.</p></div>
            <button onClick={onOpenChat} className="rounded-xl bg-white px-4 py-3 text-sm font-black text-[#4D148C]">Open live assistant</button>
          </div>
        </div>

        {notice && <div className="rounded-2xl border border-purple-100 bg-white px-4 py-3 text-xs font-bold text-[#4D148C]">{notice}</div>}

        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <aside className="rounded-3xl border border-[#dfe5ef] bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 px-2 pb-3"><MessageSquare className="h-5 w-5 text-[#4D148C]"/><h2 className="font-black text-[#17285e]">Your conversations</h2></div>
            <div className="space-y-2">{threads.map(t=><button key={t.id} onClick={()=>openThread(t)} className={'w-full rounded-2xl p-3 text-left '+(selected?.id===t.id?'bg-[#f1e8ff]':'hover:bg-slate-50')}><div className="text-xs font-black text-slate-800">{t.subject}</div><div className="mt-1 text-[9px] font-bold uppercase text-[#4D148C]">{t.status} · {t.priority}</div></button>)}{!threads.length&&<div className="px-2 py-8 text-center text-xs text-slate-500">No conversations yet.</div>}</div>
          </aside>

          <main className="rounded-3xl border border-[#dfe5ef] bg-white p-5 shadow-sm">
            {selected ? <><div className="flex items-center justify-between border-b border-slate-100 pb-4"><div><div className="text-sm font-black text-[#17285e]">{selected.subject}</div><div className="mt-1 text-[10px] text-slate-500">Status: {selected.status} · Priority: {selected.priority}</div></div><CheckCircle2 className="h-5 w-5 text-emerald-600"/></div><div className="max-h-[430px] space-y-3 overflow-y-auto py-5">{messages.map(m=><div key={m.id} className={'max-w-[85%] rounded-2xl p-3 text-xs '+(m.sender_role==='admin'?'bg-[#f1e8ff] text-[#2b1453]':'ml-auto bg-slate-100 text-slate-700')}><div>{m.body}</div>{m.payment_reference&&<div className="mt-2 rounded-lg bg-white/70 p-2 text-[9px] font-bold">Payment reference: {m.payment_reference}</div>}<div className="mt-2 text-[8px] opacity-60">{m.created_at ? new Date(m.created_at).toLocaleString() : ''}</div></div>)}</div><form onSubmit={reply} className="space-y-2 border-t border-slate-100 pt-4"><textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Write your message..." className="min-h-24 w-full rounded-2xl border border-slate-200 p-3 text-sm outline-none focus:border-[#4D148C]"/><div className="flex flex-col gap-2 sm:flex-row"><input value={paymentReference} onChange={e=>setPaymentReference(e.target.value)} placeholder="Optional payment reference" className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-xs"/><button disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4D148C] px-5 py-2.5 text-xs font-black text-white disabled:opacity-60">{busy?<Loader2 className="h-4 w-4 animate-spin"/>:<Send className="h-4 w-4"/>}Send</button></div></form></> :
            <form onSubmit={createThread} className="mx-auto max-w-2xl py-5"><div className="flex items-center gap-2"><HelpCircle className="h-5 w-5 text-[#4D148C]"/><h2 className="text-xl font-black text-[#17285e]">Start a secure conversation</h2></div><p className="mt-2 text-xs text-slate-500">Payment references can be shared here for support review. A reference never overrides Stripe's verified payment status.</p><div className="mt-5 space-y-3"><input required value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Subject" className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm"/><textarea required value={body} onChange={e=>setBody(e.target.value)} placeholder="Tell the support team what you need..." className="min-h-32 w-full rounded-xl border border-slate-200 p-3 text-sm"/><div className="flex gap-2"><input value={paymentReference} onChange={e=>setPaymentReference(e.target.value)} placeholder="Payment reference (optional)" className="flex-1 rounded-xl border border-slate-200 px-3 py-3 text-sm"/><div className="grid w-12 place-items-center rounded-xl border border-slate-200 text-slate-400"><Paperclip className="h-4 w-4"/></div></div><button disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4D148C] to-[#7b21dc] py-3.5 text-sm font-black text-white disabled:opacity-60">{busy?<Loader2 className="h-4 w-4 animate-spin"/>:<Send className="h-4 w-4"/>}Send secure request</button></div></form>}
          </main>
        </div>
      </div>
    </div>
  );
};
