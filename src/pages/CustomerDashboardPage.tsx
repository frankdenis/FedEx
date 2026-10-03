import React, { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowRight, Bell, CheckCircle2, ChevronRight, CircleHelp, CreditCard, LogOut, MessageSquare, Package, RefreshCw, Search, ShieldCheck, Truck, UserRound } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../lib/api';
import { supabase } from '../lib/supabase';

interface Props { onNavigate: (path: string) => void; }

export const CustomerDashboardPage: React.FC<Props> = ({ onNavigate }) => {
  const [me, setMe] = useState<any>(null);
  const [shipments, setShipments] = useState<any[]>([]);
  const [threads, setThreads] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview'|'shipments'|'communication'>('overview');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setBusy(true);
    setError('');
    try {
      const profile = await api.me();
      setMe(profile);
      const shipmentResponse: any = await api.shipments();
      const list = Array.isArray(shipmentResponse) ? shipmentResponse : (shipmentResponse?.shipments || []);
      setShipments(list);
      const support = await api.supportThreads().catch(() => []);
      setThreads(Array.isArray(support) ? support : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Your account workspace could not be loaded.');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => { load(); }, []);

  const activeCount = useMemo(() => shipments.filter(s => !['Delivered','Cancelled','Shipment Cancelled'].includes(String(s.status || ''))).length, [shipments]);
  const deliveredCount = useMemo(() => shipments.filter(s => String(s.status || '') === 'Delivered').length, [shipments]);
  const paidCount = useMemo(() => shipments.filter(s => String(s.paymentStatus || '').toLowerCase() === 'paid').length, [shipments]);

  const openSupport = async () => {
    if (subject.trim().length < 3 || !message.trim()) {
      setError('Add a subject and message before opening a support conversation.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await api.supportCreateThread({ subject: subject.trim(), body: message.trim(), priority: 'normal' });
      setSubject('');
      setMessage('');
      setActiveTab('communication');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Support conversation could not be created.');
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    onNavigate('/login');
  };

  if (error && !me) {
    return (
      <div className="min-h-[72vh] bg-[#f7faff] px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-lg rounded-[30px] border border-[#dfe6f0] bg-white p-8 text-center shadow-[0_30px_80px_rgba(31,48,91,.12)]">
          <ShieldCheck className="mx-auto h-10 w-10 text-[#4D148C]" />
          <h1 className="mt-4 text-2xl font-black text-[#14265e]">Sign in to your customer workspace</h1>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#73819c]">{error}</p>
          <button onClick={() => onNavigate('/login')} className="mt-6 rounded-2xl bg-[#4D148C] px-6 py-3 text-sm font-black text-white">Continue with Google / Gmail</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f9ff] text-[#14265e]">
      <div className="mx-auto max-w-[1480px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="overflow-hidden rounded-[32px] bg-white border border-[#dfe6f0] shadow-[0_24px_70px_rgba(28,47,88,.09)]">
          <div className="flex flex-col gap-5 px-6 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#4D148C] to-[#7c2bd8] text-white shadow-lg"><UserRound className="h-5 w-5"/></div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[.16em] text-[#4D148C]">Customer workspace</div>
                <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">{me?.profile?.firstName ? 'Welcome, ' + me.profile.firstName : 'Welcome back'}</h1>
                <p className="mt-1 text-xs font-bold text-[#78869f]">{me?.email || 'Google / Gmail account'} · Production data only</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => onNavigate('/guest-shipping')} className="rounded-xl bg-gradient-to-r from-[#4D148C] to-[#7925dc] px-4 py-3 text-xs font-black text-white shadow-lg">Ship a Package <ArrowRight className="ml-1 inline h-3.5 w-3.5 text-[#ff9a5b]"/></button>
              <button onClick={() => onNavigate('/quote')} className="rounded-xl border border-[#d7dfeb] bg-white px-4 py-3 text-xs font-black text-[#2d3d67]">Shipping Calculator</button>
              <button onClick={signOut} className="rounded-xl border border-[#d7dfeb] bg-white px-4 py-3 text-xs font-black text-[#2d3d67]"><LogOut className="mr-1 inline h-3.5 w-3.5"/> Sign out</button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto border-t border-[#edf0f5] p-3">
            {[
              ['overview','Overview',Activity],
              ['shipments','My Shipments',Package],
              ['communication','Communication',MessageSquare]
            ].map(([id,label,Icon]: any) => (
              <button key={id} onClick={() => setActiveTab(id)} className={'inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-black '+(activeTab===id?'bg-[#4D148C] text-white':'text-[#51607d] hover:bg-[#f2f5fa]')}>
                <Icon className="h-4 w-4"/>{label}
              </button>
            ))}
            <button onClick={load} disabled={busy} className="ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#dfe6f0] text-[#4D148C] hover:bg-[#f7f4fb]" aria-label="Refresh">
              <RefreshCw className={busy ? 'h-4 w-4 animate-spin' : 'h-4 w-4'}/>
            </button>
          </div>
        </header>

        {error && <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</div>}

        {activeTab === 'overview' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                ['Total shipments', shipments.length, Package],
                ['Active shipments', activeCount, Truck],
                ['Delivered', deliveredCount, CheckCircle2],
                ['Paid orders', paidCount, CreditCard],
              ].map(([label,value,Icon]: any) => (
                <motion.div key={label} whileHover={{ y: -3 }} className="rounded-2xl border border-[#dfe6f0] bg-white p-5 shadow-sm">
                  <Icon className="h-5 w-5 text-[#4D148C]"/>
                  <div className="mt-4 text-2xl font-black">{value}</div>
                  <div className="mt-1 text-[11px] font-black text-[#7b879f]">{label}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
              <section className="overflow-hidden rounded-3xl border border-[#dfe6f0] bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-[#edf0f5] px-5 py-4">
                  <div><h2 className="text-base font-black">Recent production shipments</h2><p className="mt-1 text-[10px] font-bold text-[#7b879f]">No sample records are inserted into this dashboard.</p></div>
                  <button onClick={() => setActiveTab('shipments')} className="text-[10px] font-black text-[#4D148C]">View all <ChevronRight className="ml-1 inline h-3 w-3"/></button>
                </div>
                <div className="divide-y divide-[#edf0f5]">
                  {shipments.slice(0,6).map(s => (
                    <button key={s.id} onClick={() => s.trackingNumber && onNavigate('/track?q=' + encodeURIComponent(s.trackingNumber))} className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-[#fbfcff]">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f0e8ff] text-[#4D148C]"><Package className="h-4 w-4"/></span>
                      <span className="min-w-0 flex-1"><span className="block truncate text-xs font-black">{s.trackingNumber || 'Carrier tracking pending'}</span><span className="mt-1 block truncate text-[10px] font-semibold text-[#79869e]">{s.recipient?.city || s.recipient?.country || 'Destination pending'} · {s.service || 'Service pending'}</span></span>
                      <span className="text-[10px] font-black text-[#4D148C]">{s.status || 'Processing'}</span>
                    </button>
                  ))}
                  {!shipments.length && <div className="p-10 text-center"><Package className="mx-auto h-8 w-8 text-[#c5cfdf]"/><div className="mt-3 text-sm font-black text-[#33446f]">No shipments yet</div><div className="mt-1 text-[11px] font-semibold text-[#7b879f]">Create a production shipment to see it here.</div></div>}
                </div>
              </section>

              <section className="rounded-3xl border border-[#dfe6f0] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2"><Bell className="h-5 w-5 text-[#4D148C]"/><h2 className="text-base font-black">Fast actions</h2></div>
                <div className="mt-5 grid gap-2.5">
                  {[
                    ['Track a shipment','Enter a tracking number and open secure tracking.','/track',Search],
                    ['Open calculator','Review configured production rates before payment.','/quote',CreditCard],
                    ['Contact support','Ask about payment, delivery or a shipment.','communication',MessageSquare],
                    ['Help center','Read support information and policies.','/support',CircleHelp],
                  ].map(([title,copy,path,Icon]: any) => (
                    <button key={title} onClick={() => path === 'communication' ? setActiveTab('communication') : onNavigate(path)} className="flex items-center gap-3 rounded-2xl border border-[#e1e7f0] p-3 text-left hover:border-[#cbbbe6] hover:bg-[#faf8ff]">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f0e8ff] text-[#4D148C]"><Icon className="h-4 w-4"/></span>
                      <span className="flex-1"><span className="block text-xs font-black">{title}</span><span className="mt-1 block text-[10px] font-semibold leading-4 text-[#7c889f]">{copy}</span></span><ArrowRight className="h-4 w-4 text-[#9ba6b9]"/>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {activeTab === 'shipments' && (
          <section className="mt-6 overflow-hidden rounded-3xl border border-[#dfe6f0] bg-white shadow-sm">
            <div className="border-b border-[#edf0f5] px-5 py-4"><h2 className="font-black">My shipments</h2><p className="mt-1 text-[10px] font-bold text-[#7b879f]">Live server-backed records for your account.</p></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-xs">
                <thead className="bg-[#fafbfe] text-[9px] font-black uppercase tracking-wider text-[#7b879f]"><tr><th className="px-5 py-3">Tracking</th><th className="px-5 py-3">Destination</th><th className="px-5 py-3">Service</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Payment</th><th className="px-5 py-3">Created</th></tr></thead>
                <tbody className="divide-y divide-[#edf0f5]">
                  {shipments.map(s => <tr key={s.id} className="hover:bg-[#fbfcff]"><td className="px-5 py-4 font-black">{s.trackingNumber || 'Pending carrier'}</td><td className="px-5 py-4 font-semibold text-[#5f6d88]">{s.recipient?.city || s.recipient?.country || '—'}</td><td className="px-5 py-4 font-bold">{s.service || '—'}</td><td className="px-5 py-4">{s.status || '—'}</td><td className="px-5 py-4">{s.paymentStatus || 'Pending'}</td><td className="px-5 py-4 text-[#65728b]">{s.createdAt ? new Date(s.createdAt).toLocaleString() : '—'}</td></tr>)}
                  {!shipments.length && <tr><td colSpan={6} className="px-5 py-12 text-center text-sm font-semibold text-[#7b879f]">No production shipments found.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'communication' && (
          <div className="mt-6 grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
            <section className="rounded-3xl border border-[#dfe6f0] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-[#4D148C]"/><h2 className="font-black">Fast communication</h2></div>
              <p className="mt-2 text-xs font-semibold leading-5 text-[#74819b]">Open a secure support conversation for payment questions, delivery issues or shipment assistance.</p>
              <div className="mt-5 space-y-3">
                <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" className="w-full rounded-xl border border-[#d9e1ed] px-3 py-3 text-sm font-bold outline-none focus:border-[#4D148C]"/>
                <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message for operations…" className="min-h-32 w-full rounded-xl border border-[#d9e1ed] px-3 py-3 text-sm font-semibold outline-none focus:border-[#4D148C]"/>
                <button onClick={openSupport} disabled={busy} className="w-full rounded-xl bg-[#4D148C] py-3 text-sm font-black text-white">{busy ? 'Sending…' : 'Open conversation'} <ArrowRight className="ml-1 inline h-4 w-4 text-[#ff9a5b]"/></button>
              </div>
            </section>

            <section className="rounded-3xl border border-[#dfe6f0] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between"><div><div className="text-[10px] font-black uppercase tracking-[.16em] text-[#4D148C]">Support inbox</div><h2 className="mt-1 font-black">Your conversations</h2></div><MessageSquare className="h-5 w-5 text-[#4D148C]"/></div>
              <div className="mt-5 space-y-3">
                {threads.map(t => <div key={t.id} className="rounded-2xl border border-[#e3e8f1] p-4"><div className="flex items-center justify-between gap-3"><span className="text-sm font-black">{t.subject}</span><span className="rounded-full bg-[#f0e8ff] px-2.5 py-1 text-[9px] font-black uppercase text-[#4D148C]">{t.status}</span></div><div className="mt-2 text-[10px] font-bold text-[#7a879f]">Priority {t.priority} · Updated {t.updatedAt ? new Date(t.updatedAt).toLocaleString() : '—'}</div></div>)}
                {!threads.length && <div className="rounded-2xl border border-dashed border-[#cfd8e6] p-10 text-center text-sm font-semibold text-[#7b879f]">No conversations yet.</div>}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
