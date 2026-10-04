import React, { useState } from 'react';
import { ArrowRight, Bell, Box, BriefcaseBusiness, CheckCircle2, ChevronDown, Globe2, Headphones, Menu, Package, Search, ShieldCheck, UserRound, X, Plane } from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from '../components/common/Logo';

interface Props { onNavigate: (path: string) => void; }

export const HomePagePremium: React.FC<Props> = ({ onNavigate }) => {
  const [tracking, setTracking] = useState('');
  const [mobile, setMobile] = useState(false);

  const track = (e:React.FormEvent) => {
    e.preventDefault();
    if (tracking.trim()) onNavigate('/track?q=' + encodeURIComponent(tracking.trim()));
  };

  const links = [['Shipping','/guest-shipping'],['Tracking','/track'],['Support','/support'],['Locations','/locations'],['Business Solutions','/business']];

  return <div className="min-h-screen bg-[#f7f9fd] text-[#10245e]">
    <header className="sticky top-0 z-50 bg-[#30106b] text-white shadow-[0_10px_35px_rgba(31,10,76,.25)]">
      <div className="mx-auto flex h-[72px] max-w-[1560px] items-center gap-4 px-4 sm:px-7 lg:px-10">
        <button onClick={()=>onNavigate('/')} className="w-[105px] shrink-0"><Logo /></button>
        <nav className="hidden lg:flex items-center gap-1">{links.map(([name,path])=><button key={name} onClick={()=>onNavigate(path)} className="rounded-xl px-3.5 py-2.5 text-[12px] font-extrabold hover:bg-white/10">{name}<ChevronDown className="ml-1 inline h-3 w-3 opacity-60"/></button>)}</nav>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={()=>onNavigate('/track')} className="hidden h-10 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 text-xs font-bold md:flex"><Search className="h-4 w-4"/> Search</button>
          <button className="grid h-10 w-10 place-items-center rounded-xl hover:bg-white/10"><Bell className="h-4 w-4"/></button>
          <button onClick={()=>onNavigate('/login')} className="hidden items-center gap-2 rounded-xl px-2 py-2 hover:bg-white/10 sm:flex"><span className="grid h-8 w-8 place-items-center rounded-full bg-white/15"><UserRound className="h-4 w-4"/></span><span className="text-left"><small className="block text-[8px] text-white/60">Account</small><b className="text-[11px]">Customer Portal</b></span></button>
          <button onClick={()=>setMobile(!mobile)} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-white/10 lg:hidden">{mobile?<X/>:<Menu/>}</button>
        </div>
      </div>
      {mobile&&<div className="border-t border-white/10 bg-[#260752] p-3 lg:hidden"><div className="grid grid-cols-2 gap-2">{links.map(([name,path])=><button key={name} onClick={()=>{setMobile(false);onNavigate(path)}} className="rounded-xl bg-white/10 p-3 text-left text-xs font-black">{name}</button>)}</div></div>}
    </header>

    <main>
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(77,20,140,.10),transparent_30%),linear-gradient(120deg,#f8fbff,#edf4ff_50%,#ebe5f7)]"/>
        <div className="relative mx-auto max-w-[1560px] px-4 py-8 sm:px-7 lg:px-10 lg:py-12">
          <div className="grid gap-7 xl:grid-cols-[.9fr_1.1fr]">
            <div className="flex flex-col justify-center">
              <div className="w-fit rounded-full border border-[#dbe4f1] bg-white px-3 py-1.5 text-[10px] font-black text-[#3e537e] shadow-sm"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#18b87b]"/>FEDEX EXPRESS · GLOBAL LOGISTICS</div>
              <h1 className="mt-5 max-w-[650px] text-[48px] font-black leading-[.94] tracking-[-.065em] text-[#0b205c] sm:text-[64px] lg:text-[78px]">Your World,<span className="block bg-gradient-to-r from-[#4D148C] via-[#7924d8] to-[#f06423] bg-clip-text text-transparent">Our Priority</span></h1>
              <p className="mt-5 max-w-[590px] text-[14px] font-bold leading-6 text-[#52627f] sm:text-[15px]">We connect people and businesses to what matters most — with fast, reliable and secure shipping solutions across the globe.</p>
              <form onSubmit={track} className="mt-7 max-w-[680px] rounded-2xl border border-[#d6e0ed] bg-white p-3 shadow-[0_22px_55px_rgba(27,46,91,.13)]">
                <div className="px-2 pb-2 text-xs font-black"><Box className="mr-2 inline h-4 w-4 text-[#4D148C]"/>Track Your Shipment</div>
                <div className="flex gap-2"><div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8795ad]"/><input value={tracking} onChange={e=>setTracking(e.target.value)} placeholder="Enter tracking number" className="h-12 w-full rounded-xl border border-[#d5deeb] bg-[#fbfcff] pl-9 text-sm font-bold outline-none focus:border-[#6d22c8]"/></div><button className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-r from-[#4D148C] to-[#7627d9] text-white"><ArrowRight/></button></div>
              </form>
              <div className="mt-5 grid max-w-[680px] grid-cols-3 gap-2.5">
                {[[Plane,'24/7','Global support'],[Box,'Live','Shipment tracking'],[Globe2,'220+','Countries & territories']].map(([I,v,l]:any)=><div key={l} className="rounded-2xl border border-[#dfe5ef] bg-white p-3.5 shadow-sm"><I className="h-4 w-4 text-[#4D148C]"/><div className="mt-2 text-[17px] font-black">{v}</div><div className="text-[9px] font-extrabold text-[#72809b]">{l}</div></div>)}
              </div>
              <div className="mt-5 flex gap-2.5"><button onClick={()=>onNavigate('/guest-shipping')} className="rounded-xl bg-gradient-to-r from-[#4D148C] to-[#7925dc] px-5 py-3 text-sm font-black text-white shadow-lg">Ship a Package <ArrowRight className="ml-1 inline h-4 w-4 text-[#ff9a5b]"/></button><button onClick={()=>onNavigate('/quote')} className="rounded-xl border border-[#d5deeb] bg-white px-5 py-3 text-sm font-black">Shipping Calculator</button></div>
            </div>

            <div className="relative min-h-[510px] overflow-hidden rounded-[30px] border border-white bg-[#dfeaf7] shadow-[0_30px_90px_rgba(32,53,103,.20)] sm:min-h-[620px]">
              <img src="/fedex-hero.jpg" alt="FedEx delivery professional holding a package" loading="eager" fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover object-center contrast-[1.08] saturate-[1.06] brightness-[1.04]"/>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-[#4D148C]/15"/>
              <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#101d48]/65 to-transparent"/>
              <div className="absolute left-5 top-5 max-w-[250px] rounded-2xl border border-white/90 bg-white/95 p-4 shadow-2xl"><div className="text-[10px] font-black text-[#183066]">Connecting the world.</div><div className="mt-1 text-[10px] font-bold leading-4 text-[#5a6781]">Delivering what's next with speed, visibility and confidence.</div></div>
              <div className="absolute right-5 top-5 w-[220px] rounded-2xl border border-white/90 bg-white/95 p-4 shadow-2xl"><div className="flex items-center gap-2 text-[10px] font-black"><CheckCircle2 className="h-4 w-4 text-[#18b87b]"/>Shipment Progress</div><div className="mt-3 space-y-2.5">{['Shipment created','Picked up','In transit','Out for delivery'].map((x,i)=><div key={x} className="flex items-center gap-2"><span className={'grid h-5 w-5 place-items-center rounded-full '+(i<2?'bg-[#4D148C] text-white':'bg-[#eef2f7] text-[#8994aa]')}><CheckCircle2 className="h-3 w-3"/></span><span className="text-[9px] font-extrabold text-[#56637d]">{x}</span></div>)}</div></div>
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/90 bg-white/95 p-4 shadow-2xl"><div className="grid grid-cols-3 gap-3"><div><small className="text-[8px] font-black uppercase tracking-wider text-[#7b879f]">Network</small><div className="text-xs font-black">Global Air Network</div></div><div><small className="text-[8px] font-black uppercase tracking-wider text-[#7b879f]">Visibility</small><div className="text-xs font-black">Real-time tracking</div></div><div><small className="text-[8px] font-black uppercase tracking-wider text-[#7b879f]">Carrier</small><div className="text-xs font-black">FedEx Express</div></div></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1560px] px-4 py-7 sm:px-7 lg:px-10"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[['Ship a Package','Send packages domestically and internationally.',Package,'/guest-shipping'],['International Shipping','Worldwide door-to-door delivery and customs support.',Globe2,'/services/international'],['Business Solutions','Centralized shipping, billing and logistics tools.',BriefcaseBusiness,'/business'],['Support','Get help with shipments, pickup and delivery.',Headphones,'/support']].map(([name,copy,I,path]:any,i)=><motion.button key={name} whileHover={{y:-4}} onClick={()=>onNavigate(path)} className={'rounded-2xl border p-5 text-left shadow-sm '+(i===0?'border-[#4D148C] bg-gradient-to-br from-[#4D148C] to-[#2d0a5f] text-white':'border-[#dfe5ef] bg-white')}><span className={'grid h-10 w-10 place-items-center rounded-xl '+(i===0?'bg-white/15':'bg-[#f0e9ff]')}><I className={'h-5 w-5 '+(i===0?'text-white':'text-[#4D148C]')}/></span><h2 className="mt-4 text-base font-black">{name}</h2><p className={'mt-1.5 text-[11px] font-semibold leading-5 '+(i===0?'text-white/75':'text-[#77859f]')}>{copy}</p><span className="mt-4 inline-block text-[10px] font-black text-[#ff9b68]">Explore <ArrowRight className="ml-1 inline h-3 w-3"/></span></motion.button>)}
      </div></section>

      <section className="mx-auto max-w-[1560px] px-4 pb-9 sm:px-7 lg:px-10"><div className="grid gap-5 xl:grid-cols-[1.3fr_.7fr]">
        <div className="overflow-hidden rounded-2xl border border-[#dfe5ef] bg-white shadow-sm"><div className="flex items-center justify-between border-b border-[#edf0f5] px-5 py-4"><div><h2 className="text-base font-black">Recent Shipments</h2><p className="text-[10px] font-bold text-[#7b879f]">Live production records.</p></div><button onClick={()=>onNavigate('/dashboard/shipments')} className="text-[10px] font-black text-[#4D148C]">View All →</button></div><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-xs"><thead className="bg-[#fafbfe] text-[9px] font-black uppercase text-[#8a95ab]"><tr><th className="px-5 py-3">Tracking Number</th><th className="px-5 py-3">Destination</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">ETA</th></tr></thead><tbody className="divide-y divide-[#edf0f5]"><tr><td colSpan={4} className="px-5 py-12 text-center"><Package className="mx-auto h-7 w-7 text-[#4D148C]"/><div className="mt-2 text-sm font-black">No production shipments yet</div><div className="text-[11px] font-semibold text-[#7b879f]">This area stays empty until a real shipment is created.</div><button onClick={()=>onNavigate('/guest-shipping')} className="mt-4 rounded-lg bg-[#4D148C] px-4 py-2 text-[10px] font-black text-white">Create a shipment</button></td></tr></tbody></table></div></div>
        <div className="rounded-2xl border border-[#dfe5ef] bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><div className="text-[9px] font-black uppercase tracking-wider text-[#4D148C]">Latest updates</div><h2 className="mt-1 text-base font-black">Shipment timeline</h2></div><ShieldCheck className="h-5 w-5 text-[#4D148C]"/></div><div className="mt-5 space-y-4">{['Label created','Picked up','In transit','Out for delivery'].map((x,i)=><div key={x} className="flex gap-3"><span className={'grid h-7 w-7 shrink-0 place-items-center rounded-full '+(i===0?'bg-[#4D148C] text-white':'bg-[#eef2f7] text-[#8994aa]')}><CheckCircle2 className="h-3.5 w-3.5"/></span><div><div className="text-xs font-black">{x}</div><div className="text-[10px] font-semibold text-[#7b879f]">Global network · real-time visibility</div></div></div>)}</div></div>
      </div></section>

      <section className="mx-4 mb-8 rounded-[28px] bg-gradient-to-r from-[#240650] via-[#4D148C] to-[#31116d] px-6 py-8 text-white sm:mx-7 sm:px-10 lg:mx-10"><div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div><div className="text-[10px] font-black uppercase tracking-[.18em] text-[#ff9b68]">FedEx Global Delivery</div><h2 className="mt-2 text-2xl font-black sm:text-3xl">Move what matters, wherever it needs to go.</h2><p className="mt-2 max-w-2xl text-xs font-semibold text-white/70">Real-time tracking, worldwide coverage and dependable logistics tools.</p></div><button onClick={()=>onNavigate('/services')} className="w-fit rounded-xl border border-white/40 bg-white/10 px-5 py-3 text-xs font-black">Explore Our Services <ArrowRight className="ml-1 inline h-4 w-4"/></button></div></section>
    </main>

    <footer className="border-t border-[#dfe5ef] bg-white px-5 py-6"><div className="mx-auto flex max-w-[1560px] justify-between text-[10px] font-bold text-[#7c879d]"><span><ShieldCheck className="mr-2 inline h-4 w-4 text-[#4D148C]"/>Secure FedEx logistics workspace</span><span className="hidden sm:block">Ship smarter. Track clearly. Deliver with confidence.</span></div></footer>
  </div>;
};
