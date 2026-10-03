import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity, ArrowRight, Bell, Box, BriefcaseBusiness, CheckCircle2, ChevronDown,
  ChevronLeft, ChevronRight, CircleHelp, Clock3, Globe2, Headphones, Layers3,
  MapPin, Package, Plane, Search, ShieldCheck, UserRound, Menu, X
} from 'lucide-react';
import { api } from '../lib/api';
import { LOGISTICS_IMAGES } from '../data/siteContent';
import { Logo } from '../components/common/Logo';

interface HomePageProps { onNavigate: (path: string) => void; }

const nav = [
  ['Dashboard', Box, '/'],
  ['Ship a Package', Package, '/guest-shipping'],
  ['Track Shipment', Search, '/track'],
  ['International', Globe2, '/services/international'],
  ['Services', Layers3, '/services'],
  ['My Shipments', Box, '/dashboard/shipments'],
  ['Business Solutions', BriefcaseBusiness, '/business'],
  ['Support', CircleHelp, '/support'],
] as const;

const slides = [
  { id: 'overview', eyebrow: 'Operations overview', title: 'Your World', accent: 'Our Priority', copy: 'Fast, reliable and secure shipping workflows for individuals and businesses, anywhere in the world.' },
  { id: 'tracking', eyebrow: 'Live tracking', title: 'Know Where', accent: 'It Is', copy: 'Follow production shipments through pickup, transit and delivery with a clean, focused tracking workspace.' },
  { id: 'shipping', eyebrow: 'Shipment creation', title: 'Ship With', accent: 'Confidence', copy: 'Request a shipment without an account, calculate a production rate and pay securely before operational review.' },
  { id: 'global', eyebrow: 'Global services', title: 'Move Across', accent: 'Borders', copy: 'Connect international services, route support and customer communication from one responsive command center.' },
];

const services = [
  ['Ship a Package', 'Get a production rate and arrange your shipment.', Package, '/guest-shipping'],
  ['International', 'Worldwide delivery and cross-border support.', Globe2, '/services/international'],
  ['Business Solutions', 'Structured logistics tools for growing teams.', BriefcaseBusiness, '/business'],
  ['Support', 'Payment proof, questions and fast communication.', Headphones, '/support'],
] as const;

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [slide, setSlide] = useState(0);
  const [tracking, setTracking] = useState('');
  const [error, setError] = useState('');
  const [shipments, setShipments] = useState<any[]>([]);
  const [site, setSite] = useState<any>({});
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const active = slides[slide];

  useEffect(() => {
    const timer = window.setInterval(() => setSlide(v => (v + 1) % slides.length), 7000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    Promise.allSettled([api.siteSettings(), api.shipments()]).then(([settings, records]) => {
      if (settings.status === 'fulfilled') setSite(settings.value || {});
      if (records.status === 'fulfilled') {
        const value: any = records.value;
        setShipments(Array.isArray(value) ? value.slice(0, 5) : Array.isArray(value?.shipments) ? value.shipments.slice(0, 5) : []);
      }
    });
  }, []);

  const changeSlide = (next: number) => setSlide((next + slides.length) % slides.length);

  const track = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tracking.trim()) {
      setError('Enter a tracking number to continue.');
      return;
    }
    setError('');
    onNavigate('/track?q=' + encodeURIComponent(tracking.trim()));
  };

  const activeShipment = shipments[0];
  const liveCount = useMemo(
    () => shipments.filter(s => !['Delivered', 'Cancelled'].includes(String(s.status || ''))).length,
    [shipments]
  );
  const locationsCount = useMemo(() => new Set(
    shipments.flatMap(s => [s?.sender?.city, s?.recipient?.city]).filter(Boolean)
  ).size, [shipments]);

  return (
    <div className="min-h-screen bg-[#f8fbff] text-[#10245e]">
      <div className="flex min-h-screen">
        <aside className="hidden w-[218px] shrink-0 border-r border-[#dce5f1] bg-white lg:flex lg:flex-col">
          <div className="flex h-[74px] items-center border-b border-[#e7edf5] px-6">
            <button onClick={() => onNavigate('/')} aria-label="FedEx home" className="block w-[112px]"><Logo/></button>
          </div>
          <nav className="flex-1 space-y-1.5 p-4 pt-6">
            {nav.map(([label, Icon, path], index) => (
              <motion.button
                key={label}
                whileHover={{ x: 3 }}
                whileTap={{ scale: .985 }}
                onClick={() => { setMobileNavOpen(false); onNavigate(path); }}
                className={'group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-[12px] font-extrabold transition ' +
                  (index === 0
                    ? 'bg-gradient-to-r from-[#4D148C] via-[#7423d6] to-[#9b27ff] text-white shadow-[0_10px_24px_rgba(111,37,216,.25)]'
                    : 'text-[#253866] hover:bg-[#f2f5fa]')}
              >
                <Icon className={'h-[19px] w-[19px] ' + (index === 0 ? 'text-white' : 'text-[#294180]')} />
                <span>{label}</span>
                {(label === 'Services' || label === 'Support') && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
              </motion.button>
            ))}
          </nav>
          <div className="p-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#4D148C] via-[#7924d7] to-[#ff6600] p-4 text-white shadow-xl">
              <div className="relative z-10">
                <div className="text-[16px] font-black leading-tight">Global Reach.<br />Local Care.</div>
                <p className="mt-2 text-[10px] font-semibold leading-4 text-white/85">Shipping, tracking, payments and support in one workspace.</p>
                <button onClick={() => onNavigate('/services')} className="mt-4 rounded-lg bg-white px-3 py-2 text-[10px] font-black text-[#4D148C]">
                  Explore services <ArrowRight className="ml-1 inline h-3 w-3" />
                </button>
              </div>
              <Plane className="absolute -bottom-4 -right-3 h-20 w-20 rotate-12 text-white/20" />
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-50 h-[74px] border-b border-[#dce5f1] bg-white/95 shadow-[0_8px_30px_rgba(34,52,92,.07)] backdrop-blur-2xl">
            <div className="flex h-full items-center gap-4 px-4 sm:px-6 lg:px-8">
              <button onClick={() => setMobileNavOpen(v => !v)} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#dce4ef] bg-white text-[#25396d] lg:hidden" aria-label={mobileNavOpen ? 'Close navigation' : 'Open navigation'}>
                {mobileNavOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
              </button>
              <button onClick={() => onNavigate('/')} className="shrink-0 w-[92px] lg:hidden" aria-label="FedEx home"><Logo/></button>
              <button onClick={() => onNavigate('/track')} className="hidden h-11 max-w-[610px] flex-1 items-center gap-3 rounded-2xl border border-[#d6e0ee] bg-[#fbfcff] px-4 text-left shadow-sm md:flex">
                <Search className="h-4 w-4 text-[#71819e]" />
                <span className="truncate text-xs font-bold text-[#7d8ba6]">Search tracking number, shipment, or destination...</span>
              </button>
              <div className="ml-auto flex items-center gap-1.5">
                <button className="hidden items-center gap-2 rounded-xl px-3 py-2 text-xs font-black text-[#243667] hover:bg-[#f3f6fb] sm:flex">
                  <Globe2 className="h-4 w-4" /> EN <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <button className="relative grid h-10 w-10 place-items-center rounded-xl text-[#25396d] hover:bg-[#f3f6fb]" aria-label="Notifications">
                  <Bell className="h-5 w-5" /><span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#ef3b24] px-1 text-[8px] font-black text-white">!</span>
                </button>
                <button onClick={() => onNavigate('/login')} className="flex items-center gap-2 rounded-xl px-1.5 py-1 hover:bg-[#f3f6fb]">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#4D148C] to-[#7c2bd8] text-white"><UserRound className="h-4 w-4" /></span>
                  <span className="hidden text-left sm:block">
                    <span className="block text-[9px] font-semibold text-[#8a96ac]">Account</span>
                    <span className="block text-xs font-black text-[#1b2e63]">Google / Gmail</span>
                  </span>
                  <ChevronDown className="hidden h-3.5 w-3.5 text-[#697692] sm:block" />
                </button>
              </div>
            </div>
          </header>

          {/* mobile dashboard navigation */}
          <AnimatePresence>
            {mobileNavOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-b border-[#dce5f1] bg-white lg:hidden"
              >
                <nav className="grid gap-1.5 p-3 sm:grid-cols-2">
                  {nav.map(([label, Icon, path]) => (
                    <button
                      key={label}
                      onClick={() => { setMobileNavOpen(false); onNavigate(path); }}
                      className="flex items-center gap-3 rounded-xl border border-[#e5eaf2] bg-[#fbfcff] px-3.5 py-3 text-left text-xs font-black text-[#253866]"
                    >
                      <Icon className="h-4 w-4 text-[#4D148C]" />
                      <span>{label}</span>
                    </button>
                  ))}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>

          <main>
            <section className="relative overflow-hidden border-b border-[#dfe6f0] bg-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_30%,rgba(77,20,140,.10),transparent_31%),radial-gradient(circle_at_18%_0%,rgba(42,135,255,.11),transparent_28%)]" />
              <div className="relative mx-auto max-w-[1510px] px-4 py-5 sm:px-7 lg:px-9 lg:py-7">
                <div className="grid items-stretch gap-6 xl:grid-cols-[.86fr_1.14fr]">
                  <div className="min-w-0 pt-2">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div key={active.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .35 }}>
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#dbe7f5] bg-white px-3 py-1.5 text-[10px] font-black text-[#355181] shadow-sm">
                          <span className="h-2 w-2 rounded-full bg-[#18b87b]" /> Welcome back · Good Morning
                        </div>
                        <h1 className="mt-5 text-[44px] font-black leading-[.92] tracking-[-.065em] text-[#0b1f57] sm:text-6xl lg:text-[70px]">
                          {site.headline || active.title}
                          <span className="block bg-gradient-to-r from-[#4D148C] via-[#8c1ee8] to-[#ef3b24] bg-clip-text text-transparent">{site.accent || active.accent}</span>
                        </h1>
                        <p className="mt-5 max-w-[535px] text-[14px] font-bold leading-6 text-[#4d5e82] sm:text-[15px]">{site.copy || active.copy}</p>
                      </motion.div>
                    </AnimatePresence>

                    <form onSubmit={track} className="mt-6 rounded-2xl border border-[#d5dfec] bg-white p-3 shadow-[0_18px_45px_rgba(27,46,91,.11)]">
                      <div className="flex items-center gap-2 px-2 pb-2 text-xs font-black text-[#16285f]"><Box className="h-4 w-4 text-[#4D148C]" /> Track Your Shipment</div>
                      <div className="flex gap-2">
                        <div className="relative min-w-0 flex-1">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8794ad]" />
                          <input value={tracking} onChange={e => setTracking(e.target.value)} placeholder="Enter tracking number" className="h-11 w-full rounded-xl border border-[#d9e1ed] bg-[#fbfcff] pl-9 pr-3 text-sm font-bold outline-none focus:border-[#7c3aed] focus:ring-4 focus:ring-purple-100" />
                        </div>
                        <button className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-r from-[#4D148C] to-[#7627d9] text-white shadow-md"><ArrowRight className="h-5 w-5" /></button>
                      </div>
                      {error && <div className="mt-2 px-2 text-[11px] font-bold text-rose-600">{error}</div>}
                    </form>

                    <div className="mt-5 grid grid-cols-3 gap-2.5">
                      {[
                        [Package, String(shipments.length), 'Loaded records'],
                        [Clock3, String(liveCount), 'Active shipments'],
                        [Globe2, locationsCount ? String(locationsCount) : '—', 'Route locations'],
                      ].map(([Icon, value, label]: any) => (
                        <div key={label} className="rounded-2xl border border-[#dfe5ef] bg-white p-3.5 shadow-sm">
                          <Icon className="h-4 w-4 text-[#4D148C]" />
                          <div className="mt-2 text-[18px] font-black text-[#172a61]">{value}</div>
                          <div className="mt-0.5 text-[9px] font-extrabold text-[#72809c]">{label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2.5">
                      <button onClick={() => onNavigate('/guest-shipping')} className="rounded-xl bg-gradient-to-r from-[#4D148C] to-[#7925dc] px-5 py-3 text-sm font-black text-white shadow-lg shadow-purple-200">
                        Ship a Package <ArrowRight className="ml-1 inline h-4 w-4 text-[#ff9a5b]" />
                      </button>
                      <button onClick={() => onNavigate('/quote')} className="rounded-xl border border-[#d7dfeb] bg-white px-5 py-3 text-sm font-black text-[#273962]">Shipping Calculator</button>
                    </div>
                  </div>

                  <div className="relative min-h-[480px] sm:min-h-[570px]">
                    <div className="absolute inset-0 overflow-hidden rounded-[30px] border border-white bg-[#edf4fb] shadow-[0_30px_80px_rgba(32,53,103,.16)]">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.img
                          key={active.id}
                          src={site.heroImage || LOGISTICS_IMAGES.cargoFreighter}
                          alt="Premium logistics operations and parcel distribution"
                          className="absolute inset-0 h-full w-full object-cover object-center brightness-[1.08] saturate-[1.12] contrast-[1.1]"
                          initial={{ opacity: 0, scale: 1.025 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: .55 }}
                        />
                      </AnimatePresence>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/55 via-transparent to-[#4D148C]/15" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#101d48]/45 via-transparent to-white/5" />

                      <div className="absolute right-5 top-5 w-[205px] rounded-2xl border border-white/85 bg-white/95 p-4 shadow-2xl backdrop-blur-xl">
                        <div className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-[#4D148C]" /><span className="text-[10px] font-black text-[#183066]">Route visibility</span></div>
                        <div className="mt-3 flex items-center justify-between text-[10px] font-black text-[#53617d]"><span>Origin</span><ArrowRight className="h-3 w-3 text-[#4D148C]" /><span>Destination</span></div>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e8edf5]"><div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#4D148C] to-[#ff6600]" /></div>
                        <div className="mt-2 text-[9px] font-bold text-[#78859f]">Live data appears when shipments are available.</div>
                      </div>

                      <div className="absolute left-5 bottom-20 max-w-[260px] rounded-2xl border border-white/85 bg-white/96 p-4 shadow-2xl backdrop-blur-xl">
                        <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#4D148C]" /><span className="text-[10px] font-black uppercase tracking-[.12em] text-[#75829c]">Shipment status</span></div>
                        <div className="mt-2 text-sm font-black text-[#14265e]">{activeShipment?.status || 'Awaiting production shipment'}</div>
                        <div className="mt-3 flex items-center gap-1.5">
                          {['Created', 'Transit', 'Delivery'].map((label, i) => <React.Fragment key={label}><span className={'grid h-6 w-6 place-items-center rounded-full ' + (activeShipment && i < 2 ? 'bg-[#4D148C] text-white' : 'bg-[#edf1f7] text-[#8591a8]')}><CheckCircle2 className="h-3 w-3" /></span>{i < 2 && <span className="h-0.5 w-8 bg-[#dfe5ee]" />}</React.Fragment>)}
                        </div>
                      </div>

                      <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/85 bg-white/96 p-4 shadow-2xl backdrop-blur-xl">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-[9px] font-black uppercase tracking-[.16em] text-[#7a879f]">Current production shipment</div>
                            <div className="mt-1 text-sm font-black text-[#14265e]">{activeShipment?.trackingNumber || 'No live shipment selected'}</div>
                          </div>
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f0e8ff] text-[#4D148C]">{activeShipment ? <CheckCircle2 className="h-5 w-5" /> : <Activity className="h-5 w-5" />}</div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-[#dfe5ef] bg-white/96 px-2 py-1.5 shadow-xl">
                      <button onClick={() => changeSlide(slide - 1)} className="grid h-7 w-7 place-items-center rounded-full text-[#4D148C]" aria-label="Previous dashboard view"><ChevronLeft className="h-4 w-4" /></button>
                      {slides.map((s, i) => <button key={s.id} onClick={() => setSlide(i)} aria-label={'Show ' + s.eyebrow} className={'h-1.5 rounded-full transition-all ' + (i === slide ? 'w-8 bg-[#4D148C]' : 'w-2 bg-[#cbd4e3]')} />)}
                      <button onClick={() => changeSlide(slide + 1)} className="grid h-7 w-7 place-items-center rounded-full text-[#4D148C]" aria-label="Next dashboard view"><ChevronRight className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mx-auto max-w-[1510px] px-4 py-7 sm:px-7 lg:px-9">
              <div className="grid gap-5 xl:grid-cols-[1.3fr_.7fr]">
                <div className="overflow-hidden rounded-2xl border border-[#dfe5ef] bg-white shadow-[0_12px_35px_rgba(36,54,95,.07)]">
                  <div className="flex items-center justify-between border-b border-[#edf0f5] px-5 py-4">
                    <div><h2 className="text-base font-black text-[#17285e]">Recent Shipments</h2><p className="mt-0.5 text-[10px] font-bold text-[#7b879f]">Production records only.</p></div>
                    <button onClick={() => onNavigate('/dashboard/shipments')} className="text-[11px] font-black text-[#4D148C]">View All <ArrowRight className="ml-1 inline h-3 w-3" /></button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px] text-left text-xs">
                      <thead className="bg-[#fafbfe] text-[9px] font-black uppercase tracking-wider text-[#8a95ab]"><tr><th className="px-5 py-3">Tracking Number</th><th className="px-5 py-3">Destination</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">ETA</th></tr></thead>
                      <tbody className="divide-y divide-[#edf0f5]">
                        {shipments.length ? shipments.map(s => (
                          <tr key={s.id} className="hover:bg-[#fbfcff]">
                            <td className="px-5 py-3 font-black text-[#23356b]">{s.trackingNumber || 'Pending'}</td>
                            <td className="px-5 py-3 font-semibold text-[#5e6c88]">{s.recipient?.city || s.recipient?.country || '—'}</td>
                            <td className="px-5 py-3 font-bold text-[#52617d]"><span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#18b87b]" />{s.status || 'Processing'}</td>
                            <td className="px-5 py-3 font-semibold text-[#66748f]">{s.estimatedDelivery || '—'}</td>
                          </tr>
                        )) : (
                          <tr><td colSpan={4} className="px-5 py-10 text-center"><Package className="mx-auto h-7 w-7 text-[#4D148C]" /><div className="mt-2 text-sm font-black text-[#24345f]">No production shipments yet</div><div className="mt-1 text-[11px] font-semibold text-[#7b879f]">Live records will appear here after a shipment is created.</div></td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#dfe5ef] bg-white p-5 shadow-[0_12px_35px_rgba(36,54,95,.07)]">
                  <div className="flex items-center justify-between"><div><div className="text-[10px] font-black uppercase tracking-[.14em] text-[#4D148C]">Quick access</div><h2 className="mt-1 text-base font-black text-[#17285e]">Logistics workspace</h2></div><ShieldCheck className="h-5 w-5 text-[#4D148C]" /></div>
                  <div className="mt-5 space-y-2.5">
                    {[['Ship without account', '/guest-shipping', Package], ['Shipping calculator', '/quote', Clock3], ['Customer communication', '/guest-support', Headphones]].map(([label, path, Icon]: any) => (
                      <button key={label} onClick={() => onNavigate(path)} className="flex w-full items-center gap-3 rounded-xl border border-[#e3e8f1] p-3 text-left hover:border-[#cfc0e8] hover:bg-[#faf8ff]">
                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#f0e8ff] text-[#4D148C]"><Icon className="h-4 w-4" /></span>
                        <span className="flex-1 text-xs font-black text-[#24345f]">{label}</span><ArrowRight className="h-4 w-4 text-[#8490a7]" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="mx-auto max-w-[1510px] px-4 pb-10 sm:px-7 lg:px-9">
              <div className="mb-4 flex items-end justify-between"><div><div className="text-[10px] font-black uppercase tracking-[.16em] text-[#4D148C]">Services</div><h2 className="mt-1 text-2xl font-black tracking-tight text-[#17285e]">Everything you need to move.</h2></div><Sparkles className="h-6 w-6 text-[#ff6600]" /></div>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {services.map(([label, copy, Icon, path]) => (
                  <motion.button key={label} whileHover={{ y: -4 }} whileTap={{ scale: .985 }} onClick={() => onNavigate(path)} className="group overflow-hidden rounded-2xl border border-[#dfe5ef] bg-white text-left shadow-sm hover:shadow-xl">
                    <div className="relative h-28 overflow-hidden bg-[#edf3fb]">
                      <img src={[LOGISTICS_IMAGES.cargoFreighter, LOGISTICS_IMAGES.heroAircraft, LOGISTICS_IMAGES.supplyChainAnalytics, LOGISTICS_IMAGES.courierHandingPackage][services.findIndex(s => s[0] === label)]} alt="" className="h-full w-full object-cover saturate-[1.1] contrast-[1.06] transition duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111d45]/55 to-transparent" />
                      <span className="absolute bottom-3 left-3 grid h-9 w-9 place-items-center rounded-xl bg-white/95 text-[#4D148C] shadow-lg"><Icon className="h-4 w-4" /></span>
                    </div>
                    <div className="p-4"><div className="text-sm font-black text-[#17285e]">{label}</div><p className="mt-1 text-[10px] font-semibold leading-4 text-[#78859f]">{copy}</p><div className="mt-3 text-[10px] font-black text-[#4D148C]">Open <ArrowRight className="ml-1 inline h-3 w-3" /></div></div>
                  </motion.button>
                ))}
              </div>
            </section>

            <footer className="border-t border-[#dfe5ef] bg-white px-5 py-5 sm:px-8 lg:px-9">
              <div className="mx-auto flex max-w-[1510px] flex-col gap-2 text-[10px] font-bold text-[#7c879d] sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#4D148C]" /> Secure production workspace</div>
                <div>Ship globally. Track clearly. Deliver with confidence.</div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
};
