import React, { useEffect, useMemo, useState } from 'react';
import { Activity, BarChart3, CheckCircle2, CircleDollarSign, FileText, MessageSquare, RefreshCw, ShieldCheck, ToggleLeft, ToggleRight, Truck, Users, XCircle } from 'lucide-react';
import { api } from '../lib/api';

interface AdminDashboardPageProps { onNavigate: (path: string) => void; }

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const [me, setMe] = useState<any>(null);
  const [shipments, setShipments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [rates, setRates] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [threads, setThreads] = useState<any[]>([]);
  const [guestRequests, setGuestRequests] = useState<any[]>([]);
  const [siteSettingsText, setSiteSettingsText] = useState('{}');
  const [siteSettings, setSiteSettings] = useState<any>({});
  const [tab, setTab] = useState<'overview'|'shipments'|'users'|'rates'|'requests'|'messages'|'site'|'settings'|'audit'>('overview');
  const [busy, setBusy] = useState(false); const [loading, setLoading] = useState(true); const [selectedThread, setSelectedThread] = useState<any>(null); const [threadMessages, setThreadMessages] = useState<any[]>([]); const [reply, setReply] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setBusy(true); setLoading(true); setError('');
    try {
      const profile = await api.me();
      setMe(profile);
      if (!profile.admin) return;
      const [s,u,r,l,t,g,ss] = await Promise.all([api.shipments(), api.adminUsers(), api.adminRates(), api.adminAuditLogs(), api.supportThreads(), api.adminGuestRequests(), api.adminSiteSettings()]);
      setShipments(Array.isArray(s) ? s : (s as any)?.shipments || []);
      setUsers(u || []); setRates(r || []); setLogs(l || []); setThreads(t || []); setGuestRequests(g || []); setSiteSettingsText(JSON.stringify(ss || {}, null, 2)); setSiteSettings(ss || {});
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Admin data could not be loaded.');
    } finally { setBusy(false); setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const paid = useMemo(() => shipments.filter(s => String(s.paymentStatus).toLowerCase() === 'paid').length, [shipments]);
  const pending = useMemo(() => shipments.filter(s => String(s.paymentStatus).toLowerCase() !== 'paid').length, [shipments]);
  const activeRates = rates.filter(r => r.active).length;
  const saveSiteSettings = async () => { setBusy(true); setError(''); try { await api.adminSaveSiteSettings(siteSettings); } catch (e) { setError(e instanceof Error ? e.message : 'Homepage settings could not be saved.'); } finally { setBusy(false); } };\n  const openThread = async (thread:any) => { setSelectedThread(thread); setError(''); try { setThreadMessages(await api.supportMessages(thread.id)); } catch (e) { setError(e instanceof Error ? e.message : 'Conversation could not be loaded.'); } };\n  const sendReply = async () => { if (!selectedThread || !reply.trim()) return; setBusy(true); setError(''); try { await api.supportReply(selectedThread.id, reply.trim()); setReply(''); await openThread(selectedThread); await load(); } catch (e) { setError(e instanceof Error ? e.message : 'Reply could not be sent.'); } finally { setBusy(false); } };

  if (loading) { return <div className="min-h-[70vh] grid place-items-center bg-[#f6f8fd]"><div className="rounded-2xl border border-[#e0e5ef] bg-white px-6 py-5 text-sm font-black text-[#4D148C] shadow-xl">Loading secured admin control center…</div></div>; }\n\n  if (!me) { return <div className="min-h-[70vh] grid place-items-center px-5 bg-[#f6f8fd]"><div className="max-w-md rounded-3xl border border-[#e0e5ef] bg-white p-8 text-center shadow-xl"><ShieldCheck className="mx-auto h-10 w-10 text-[#4D148C]"/><h1 className="mt-4 text-2xl font-black text-slate-900">Admin sign-in required</h1><p className="mt-2 text-sm text-slate-500">Sign in with the authorized Google / Gmail account to open the control center.</p><button onClick={()=>onNavigate('/login')} className="mt-6 rounded-xl bg-[#4D148C] px-5 py-3 text-sm font-bold text-white">Sign in with Google</button></div></div>; }\n\n  if (me && !me.admin) {
    return <div className="min-h-[70vh] grid place-items-center px-5"><div className="max-w-md rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-xl"><XCircle className="mx-auto h-10 w-10 text-rose-500"/><h1 className="mt-4 text-2xl font-black text-slate-900">Administrator access required</h1><p className="mt-2 text-sm text-slate-500">This control center is restricted to accounts with the admin role in Supabase.</p><button onClick={()=>onNavigate('/')} className="mt-6 rounded-xl bg-[#4D148C] px-5 py-3 text-sm font-bold text-white">Return home</button></div></div>;
  }

  return (
    <div className="min-h-[calc(100vh-150px)] bg-[#f6f8fd] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <header className="overflow-hidden rounded-[30px] bg-gradient-to-br from-[#19052e] via-[#4D148C] to-[#7b21dc] p-6 text-white shadow-2xl sm:p-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div><div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.16em]"><ShieldCheck className="h-3.5 w-3.5"/> Admin control center</div><h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">FedEx Operations Command</h1><p className="mt-2 max-w-2xl text-sm text-white/75">Control production shipments, accounts, rates, payments visibility, customer conversations and audit activity from one secured workspace.</p></div>
            <button onClick={load} disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-[#4D148C] disabled:opacity-60"><RefreshCw className={busy?'h-4 w-4 animate-spin':'h-4 w-4'}/> Refresh live data</button>
          </div>
        </header>

        {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div>}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {[
            ['Shipments', shipments.length, Truck], ['Paid', paid, CheckCircle2], ['Awaiting payment', pending, CircleDollarSign], ['Accounts', users.length, Users], ['Active rates', activeRates, BarChart3]
          ].map(([label,value,Icon]: any) => <div key={label as string} className="rounded-2xl border border-[#e0e5ef] bg-white p-4 shadow-sm"><Icon className="h-5 w-5 text-[#4D148C]"/><div className="mt-3 text-2xl font-black text-[#16275d]">{value}</div><div className="mt-1 text-[11px] font-bold text-slate-500">{label}</div></div>)}
        </div>

        <div className="flex gap-2 overflow-x-auto rounded-2xl border border-[#dfe5ef] bg-white p-2 shadow-sm">
          {(['overview','shipments','users','rates','requests','messages','site','settings','audit'] as const).map(item => <button key={item} onClick={()=>setTab(item)} className={'whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-black capitalize transition '+(tab===item?'bg-[#4D148C] text-white':'text-slate-600 hover:bg-slate-100')}>{item}</button>)}
        </div>

        {tab==='overview' && <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-3xl border border-[#dfe5ef] bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><Activity className="h-5 w-5 text-[#4D148C]"/><h2 className="font-black text-[#17285e]">Production shipment control</h2></div><div className="mt-5 space-y-3">{shipments.slice(0,8).map(s=><div key={s.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 p-3"><div><div className="text-xs font-black text-slate-800">{s.trackingNumber || 'Awaiting carrier tracking'}</div><div className="mt-1 text-[10px] text-slate-500">{s.service} · {s.status}</div></div><div className={'rounded-full px-2.5 py-1 text-[9px] font-black '+(String(s.paymentStatus).toLowerCase()==='paid'?'bg-emerald-50 text-emerald-700':'bg-amber-50 text-amber-700')}>{s.paymentStatus || 'Pending'}</div></div>)}{!shipments.length&&<p className="py-10 text-center text-sm text-slate-500">No production shipments yet.</p>}</div></section>
          <section className="rounded-3xl border border-[#dfe5ef] bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-[#4D148C]"/><h2 className="font-black text-[#17285e]">Customer communication</h2></div><div className="mt-5 space-y-3">{threads.slice(0,8).map(t=><button key={t.id} onClick={()=>setTab('messages')} className="w-full rounded-2xl border border-slate-100 p-3 text-left hover:border-purple-200"><div className="flex justify-between gap-3"><span className="text-xs font-black text-slate-800">{t.subject}</span><span className="text-[9px] font-black uppercase text-[#4D148C]">{t.status}</span></div><div className="mt-1 text-[10px] text-slate-500">Priority: {t.priority}</div></button>)}{!threads.length&&<p className="py-10 text-center text-sm text-slate-500">No customer conversations yet.</p>}</div></section>
        </div>}

        {tab==='shipments' && <section className="rounded-3xl border border-[#dfe5ef] bg-white shadow-sm overflow-hidden"><div className="border-b border-slate-100 p-5"><h2 className="font-black text-[#17285e]">All production shipments</h2></div><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-xs"><thead className="bg-slate-50 text-[9px] font-black uppercase text-slate-500"><tr><th className="p-4">Tracking</th><th className="p-4">Service</th><th className="p-4">Status</th><th className="p-4">Payment</th><th className="p-4">Created</th></tr></thead><tbody className="divide-y divide-slate-100">{shipments.map(s=><tr key={s.id}><td className="p-4 font-black">{s.trackingNumber || 'Pending carrier'}</td><td className="p-4">{s.service}</td><td className="p-4">{s.status}</td><td className="p-4">{s.paymentStatus}</td><td className="p-4">{s.createdAt ? new Date(s.createdAt).toLocaleString() : '—'}</td></tr>)}</tbody></table></div></section>}

        {tab==='users' && <section className="rounded-3xl border border-[#dfe5ef] bg-white shadow-sm overflow-hidden"><div className="border-b border-slate-100 p-5"><h2 className="font-black text-[#17285e]">Registered accounts</h2><p className="mt-1 text-[11px] text-slate-500">Account status is controlled server-side by the admin role.</p></div><div className="divide-y divide-slate-100">{users.map(u=><div key={u.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-sm font-black text-slate-800">{[u.firstName,u.lastName].filter(Boolean).join(' ') || 'Customer'}</div><div className="text-[11px] text-slate-500">{u.email || 'Anonymous guest'} · {u.role}</div></div><button onClick={async()=>{await api.adminUpdateUserStatus(u.id,u.status==='suspended'?'active':'suspended');await load();}} className={'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-black '+(u.status==='suspended'?'bg-emerald-50 text-emerald-700':'bg-rose-50 text-rose-700')}>{u.status==='suspended'?<ToggleLeft className="h-4 w-4"/>:<ToggleRight className="h-4 w-4"/>}{u.status==='suspended'?'Reactivate':'Suspend'}</button></div>)}</div></section>}

        {tab==='rates' && <section className="rounded-3xl border border-[#dfe5ef] bg-white shadow-sm overflow-hidden"><div className="border-b border-slate-100 p-5"><h2 className="font-black text-[#17285e]">Production shipping rates</h2><p className="mt-1 text-[11px] text-slate-500">Rates here are used by the server-side quote engine. No browser-side pricing is trusted.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-xs"><thead className="bg-slate-50 text-[9px] font-black uppercase text-slate-500"><tr><th className="p-4">Service</th><th className="p-4">Route</th><th className="p-4">Base</th><th className="p-4">Per kg</th><th className="p-4">Window</th><th className="p-4">State</th><th className="p-4">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{rates.map(r=><tr key={r.id}><td className="p-4 font-black">{r.service}</td><td className="p-4">{r.originCountry} → {r.destCountry}</td><td className="p-4">{r.currency} {r.baseRate}</td><td className="p-4">{r.perKgRate}</td><td className="p-4">{r.estDaysMin}–{r.estDaysMax} days</td><td className="p-4">{r.active?'Active':'Disabled'}</td><td className="p-4"><button disabled={!r.active} onClick={async()=>{await api.adminDisableRate(r.id);await load();}} className="rounded-lg bg-rose-50 px-3 py-2 text-[10px] font-black text-rose-700 disabled:opacity-40">Disable</button></td></tr>)}</tbody></table></div></section>}

        {tab==='requests' && <section className="rounded-3xl border border-[#dfe5ef] bg-white shadow-sm overflow-hidden"><div className="border-b border-slate-100 p-5"><h2 className="font-black text-[#17285e]">Guest shipping requests</h2><p className="mt-1 text-[11px] text-slate-500">Manual review decides whether a request passes verification. Payment status is independently confirmed by Stripe.</p></div><div className="divide-y divide-slate-100">{guestRequests.map(q=><div key={q.id} className="p-4"><div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div><div className="text-sm font-black text-slate-800">{q.requestNumber} · {q.firstName} {q.lastName}</div><div className="mt-1 text-[10px] text-slate-500">{q.email} · {q.phone} · {q.status} · verification: {q.verificationStatus}</div><div className="mt-1 text-[10px] font-bold text-[#4D148C]">{q.selectedService || 'Calculator pending'} {q.quotedCost ? '· '+q.currency+' '+q.quotedCost : ''} {q.paidAt ? '· Paid' : '· Unpaid'}</div></div><div className="flex gap-2"><button disabled={!q.paidAt || busy} onClick={async()=>{await api.adminGuestDecision(q.id,'approve');await load();}} className="rounded-xl bg-emerald-600 px-3 py-2 text-[10px] font-black text-white disabled:cursor-not-allowed disabled:opacity-35">Approve</button><button disabled={!q.paidAt || busy} onClick={async()=>{await api.adminGuestDecision(q.id,'decline');await load();}} className="rounded-xl bg-rose-600 px-3 py-2 text-[10px] font-black text-white disabled:cursor-not-allowed disabled:opacity-35">Decline</button></div></div></div>)}{!guestRequests.length&&<div className="p-10 text-center text-sm text-slate-500">No guest requests waiting for review.</div>}</div></section>}



{tab==='messages' && <section className="rounded-3xl border border-[#dfe5ef] bg-white shadow-sm p-5"><div className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-[#4D148C]"/><h2 className="font-black text-[#17285e]">Fast communication dashboard</h2></div><p className="mt-2 text-xs text-slate-500">Reply to customers, review payment references and keep shipment questions in one secured operations workspace.</p><div className="mt-5 grid gap-5 lg:grid-cols-[.75fr_1.25fr]"><div className="space-y-2">{threads.map(t=><button key={t.id} onClick={()=>openThread(t)} className={'w-full rounded-2xl border p-4 text-left transition '+(selectedThread?.id===t.id?'border-[#4D148C] bg-[#faf7ff]':'border-slate-100 hover:border-purple-200')}><div className="flex justify-between gap-3"><div className="text-sm font-black text-slate-800">{t.subject}</div><div className="text-[9px] font-black uppercase text-[#4D148C]">{t.status}</div></div><div className="mt-1 text-[10px] text-slate-500">Priority {t.priority} · {t.createdAt ? new Date(t.createdAt).toLocaleString() : ''}</div></button>)}{!threads.length&&<div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">No customer conversations yet.</div>}</div><div className="rounded-2xl border border-slate-100 bg-[#f8faff] p-4">{selectedThread?<><div className="flex items-center justify-between"><div><div className="text-sm font-black text-[#17285e]">{selectedThread.subject}</div><div className="text-[10px] text-slate-500">{selectedThread.priority} priority · {selectedThread.status}</div></div><ShieldCheck className="h-5 w-5 text-emerald-600"/></div><div className="mt-4 max-h-[340px] space-y-2 overflow-y-auto">{threadMessages.map(m=><div key={m.id} className="rounded-xl bg-white p-3 shadow-sm"><div className="text-[9px] font-black uppercase text-[#7b879f]">{m.senderRole} · {m.createdAt ? new Date(m.createdAt).toLocaleString() : ''}</div><div className="mt-1 text-sm font-semibold text-slate-700">{m.body}</div>{m.paymentReference&&<div className="mt-1 text-[10px] font-bold text-[#4D148C]">Payment reference: {m.paymentReference}</div>}</div>)}</div><div className="mt-3 flex gap-2"><textarea value={reply} onChange={e=>setReply(e.target.value)} placeholder="Reply to customer…" className="min-h-20 min-w-0 flex-1 rounded-xl border border-[#d9e1ed] bg-white px-3 py-3 text-sm font-semibold"/><button onClick={sendReply} disabled={busy||!reply.trim()} className="self-end rounded-xl bg-[#4D148C] px-4 py-3 text-xs font-black text-white disabled:opacity-40">Send</button></div></>:<div className="grid min-h-[340px] place-items-center text-center text-sm font-semibold text-slate-500">Select a conversation to open the secure customer thread.</div>}</div></div></section>}

        {tab==='site' && <section className="rounded-3xl border border-[#dfe5ef] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[#4D148C]"/><div><h2 className="font-black text-[#17285e]">Website presentation controls</h2><p className="text-xs font-semibold text-slate-500">Changes here appear on the public homepage.</p></div></div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="text-xs font-black">Headline<input value={siteSettings.headline||''} onChange={e=>setSiteSettings((v:any)=>({...v,headline:e.target.value}))} className="mt-1.5 w-full rounded-xl border border-[#d9e1ed] px-3 py-3"/></label>
            <label className="text-xs font-black">Accent<input value={siteSettings.accent||''} onChange={e=>setSiteSettings((v:any)=>({...v,accent:e.target.value}))} className="mt-1.5 w-full rounded-xl border border-[#d9e1ed] px-3 py-3"/></label>
            <label className="md:col-span-2 text-xs font-black">Supporting copy<textarea value={siteSettings.copy||''} onChange={e=>setSiteSettings((v:any)=>({...v,copy:e.target.value}))} className="mt-1.5 min-h-24 w-full rounded-xl border border-[#d9e1ed] px-3 py-3"/></label>
            <label className="md:col-span-2 text-xs font-black">Hero photo URL<input value={siteSettings.heroImage||''} onChange={e=>setSiteSettings((v:any)=>({...v,heroImage:e.target.value}))} className="mt-1.5 w-full rounded-xl border border-[#d9e1ed] px-3 py-3"/></label>
          </div>
          <button onClick={saveSiteSettings} disabled={busy} className="mt-5 rounded-xl bg-[#4D148C] px-5 py-3 text-sm font-black text-white">{busy?'Saving…':'Save homepage controls'}</button>
        </section>}

        {tab==='audit' && <section className="rounded-3xl border border-[#dfe5ef] bg-white shadow-sm overflow-hidden"><div className="border-b border-slate-100 p-5"><h2 className="font-black text-[#17285e]">Audit activity</h2></div><div className="divide-y divide-slate-100">{logs.map(l=><div key={l.id} className="p-4"><div className="text-xs font-black text-slate-800">{l.action}</div><div className="mt-1 text-[10px] text-slate-500">{l.actorEmail || l.actorUid || 'System'} · {l.details || l.shipmentNumber || l.paymentReference || ''}</div></div>)}</div></section>}
      </div>
    </div>
  );
};
