import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Search,
  ArrowRight,
  Plane,
  Truck,
  Ship,
  Warehouse,
  ShieldCheck,
  Globe2,
  Clock,
  CheckCircle2,
  ChevronRight,
  Calculator,
  Box,
  AlertCircle,
  Sparkles,
  Layers,
  Activity,
  Maximize2,
  Radio,
} from 'lucide-react';
import { LOGISTICS_IMAGES } from '../data/siteContent';
import { Logo } from '../components/common/Logo';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

const DASHBOARD_SLIDES = [
  {
    id: 'overview',
    eyebrow: 'Operations overview',
    title: 'Your World.',
    accent: ' Our Priority.',
    copy: 'A unified logistics workspace for shipment visibility, service access and global delivery coordination.',
    panelTitle: 'Live shipment',
    panelStatus: 'In transit',
    origin: 'New York',
    destination: 'London',
    metricLabel: 'Network visibility',
    metric: 'Live',
    signal: 'Global network synchronized',
  },
  {
    id: 'tracking',
    eyebrow: 'Live tracking',
    title: 'Know Where',
    accent: ' It Is.',
    copy: 'Follow every shipment through pickup, transit, delivery and the next operational milestone.',
    panelTitle: 'Tracking workspace',
    panelStatus: 'Monitoring',
    origin: 'Origin scan',
    destination: 'Destination',
    metricLabel: 'Shipment status',
    metric: 'Realtime',
    signal: 'Tracking telemetry active',
  },
  {
    id: 'shipping',
    eyebrow: 'Shipment creation',
    title: 'Ship With',
    accent: ' Confidence.',
    copy: 'Create shipments, review production rates and move securely into payment and fulfillment.',
    panelTitle: 'Shipment workflow',
    panelStatus: 'Ready',
    origin: 'Collection',
    destination: 'Delivery',
    metricLabel: 'Workflow',
    metric: 'Ready',
    signal: 'Shipment workflow synchronized',
  },
  {
    id: 'global',
    eyebrow: 'Global network',
    title: 'Move Across',
    accent: ' Borders.',
    copy: 'Connect international shipping services with a clear view of routes, destinations and delivery operations.',
    panelTitle: 'Global movement',
    panelStatus: 'Connected',
    origin: 'Worldwide',
    destination: 'Destination',
    metricLabel: 'Network',
    metric: '220+',
    signal: 'Global route network active',
  },
];
export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingError, setTrackingError] = useState('');

  // Quick rate estimator mini state
  const [quickOrigin, setQuickOrigin] = useState('United States');
  const [quickDest, setQuickDest] = useState('Germany');
  const [quickWeight, setQuickWeight] = useState('5');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackingError('');

    const trimmed = trackingInput.trim();
    if (!trimmed) {
      setTrackingError('Please enter a valid tracking number.');
      return;
    }

    // Support multiple or comma-separated tracking numbers
    const numbers = trimmed.split(/[\s,]+/).filter(Boolean);
    if (numbers.length === 0) {
      setTrackingError('Please enter a valid tracking number.');
      return;
    }

    // Navigate to /track with query parameter
    onNavigate(`/track?q=${encodeURIComponent(numbers.join(','))}`);
  };

  const handleQuickEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate(`/quote?origin=${encodeURIComponent(quickOrigin)}&destination=${encodeURIComponent(quickDest)}&weight=${encodeURIComponent(quickWeight)}`);
  };

  const serviceSlides = [
    { title: 'Your World. Our Priority.', eyebrow: 'Global reach · Local care', copy: 'Fast, reliable and secure shipping solutions for individuals and businesses, anywhere in the world.', image: LOGISTICS_IMAGES.heroAircraft, path: '/services/express', accent: 'from-[#07152f]/95 via-[#07152f]/55 to-transparent' },
    { title: 'Smarter Logistics. Smoother Delivery.', eyebrow: 'Connected logistics', copy: 'Track shipments, coordinate international movement and keep every delivery visible from pickup to destination.', image: LOGISTICS_IMAGES.airportTarmac, path: '/services/international', accent: 'from-[#10152b]/95 via-[#4D148C]/45 to-transparent' },
  ];
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setActiveSlide(current => (current + 1) % serviceSlides.length), 6000);
    return () => window.clearInterval(timer);
  }, []);

  const [dashboardSlide, setDashboardSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDashboardSlide(current => (current + 1) % DASHBOARD_SLIDES.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  const changeDashboardSlide = (next: number) => {
    const normalized = (next + DASHBOARD_SLIDES.length) % DASHBOARD_SLIDES.length;
    setDashboardSlide(normalized);
  };

  return (
    <div className="space-y-16 sm:space-y-24">
    <section className="relative z-20 overflow-hidden rounded-b-[2rem] bg-slate-950">
      <div className="relative h-[520px] sm:h-[600px] lg:h-[680px]">
        <AnimatePresence initial={false} mode="sync">
          <motion.div key={activeSlide} className="absolute inset-0" initial={{ opacity: 0, scale: 1.035 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.995 }} transition={{ opacity: { duration: 0.75, ease: 'easeInOut' }, scale: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }}>
            <img src={serviceSlides[activeSlide].image} alt={serviceSlides[activeSlide].title} className="h-full w-full object-cover object-center" loading={activeSlide === 0 ? 'eager' : 'lazy'} decoding="async" />
            <div className={`absolute inset-0 bg-gradient-to-r ${serviceSlides[activeSlide].accent}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div key={`hero-copy-${activeSlide}`} initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="max-w-2xl text-white">
                <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange-300 backdrop-blur-xl">{serviceSlides[activeSlide].eyebrow}</span>
                <h2 className="mt-5 max-w-2xl text-4xl font-black tracking-[-0.04em] leading-[0.98] sm:text-6xl lg:text-7xl">{serviceSlides[activeSlide].title}</h2>
                <p className="mt-5 max-w-xl text-sm leading-6 text-white/80 sm:text-base sm:leading-7">{serviceSlides[activeSlide].copy}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <button onClick={() => onNavigate(serviceSlides[activeSlide].path)} className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-extrabold text-[#4D148C] shadow-2xl transition-transform hover:-translate-y-0.5">Explore service <ArrowRight className="h-4 w-4 text-[#FF6600]" /></button>
                  <button onClick={() => onNavigate('/track')} className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-bold text-white backdrop-blur-xl transition hover:bg-white/15">Track shipment <Search className="h-4 w-4" /></button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <button aria-label="Previous hero slide" onClick={() => setActiveSlide((current) => (current - 1 + serviceSlides.length) % serviceSlides.length)} className="absolute left-4 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-xl transition hover:bg-black/35"><ChevronRight className="h-5 w-5 rotate-180" /></button>
        <button aria-label="Next hero slide" onClick={() => setActiveSlide((current) => (current + 1) % serviceSlides.length)} className="absolute right-4 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-xl transition hover:bg-black/35"><ChevronRight className="h-5 w-5" /></button>
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-2 backdrop-blur-xl">
          {serviceSlides.map((slide, index) => <button key={slide.title} aria-label={`Show slide ${index + 1}`} onClick={() => setActiveSlide(index)} className={`h-1.5 rounded-full transition-all duration-500 ${index === activeSlide ? 'w-10 bg-white' : 'w-5 bg-white/35 hover:bg-white/70'}`} />)}
        </div>
        <div className="pointer-events-none absolute bottom-5 right-5 z-20 hidden rounded-2xl border border-white/15 bg-black/20 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white/70 backdrop-blur-xl">{String(activeSlide + 1).padStart(2, '0')} / {String(serviceSlides.length).padStart(2, '0')}</div>
      </div>
    </section>


      {/* PREMIUM LIVE LOGISTICS COMMAND CENTER */}
      <section className="relative overflow-hidden bg-white text-slate-950 border-y border-slate-200/70">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-24 h-[520px] w-[520px] rounded-full bg-purple-100/70 blur-3xl" />
          <div className="absolute -bottom-48 left-1/3 h-[420px] w-[420px] rounded-full bg-orange-100/60 blur-3xl" />
          <motion.div
            className="absolute top-28 left-[18%] h-px w-[62%] bg-gradient-to-r from-transparent via-purple-300/70 to-transparent"
            animate={{ opacity: [0.2, 0.8, 0.2], scaleX: [0.88, 1, 0.88] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-20"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={DASHBOARD_SLIDES[dashboardSlide].id}
                  initial={{ opacity: 0, y: 14, filter: 'blur(5px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-2 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#4D148C]">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF6600] opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF6600]" />
                    </span>
                    {DASHBOARD_SLIDES[dashboardSlide].eyebrow}
                  </div>

                  <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.04em] leading-[1.02] font-display">
                    {DASHBOARD_SLIDES[dashboardSlide].title}
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#4D148C] via-[#7C3AED] to-[#FF6600]">
                      {DASHBOARD_SLIDES[dashboardSlide].accent}
                    </span>
                  </h1>

                  <p className="mt-5 max-w-xl text-sm sm:text-base lg:text-lg leading-7 text-slate-600">
                    {DASHBOARD_SLIDES[dashboardSlide].copy}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl">
                {[
                  { label: 'Fast delivery', value: '24/7', icon: Clock },
                  { label: 'Secure handling', value: 'Protected', icon: ShieldCheck },
                  { label: 'Global network', value: '220+', icon: Globe2 },
                  { label: 'Live visibility', value: 'Realtime', icon: Activity },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + index * 0.08, duration: 0.45 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur"
                  >
                    <item.icon className="h-4 w-4 text-[#4D148C]" />
                    <div className="mt-2 text-sm font-extrabold text-slate-900">{item.value}</div>
                    <div className="mt-0.5 text-[10px] font-medium text-slate-500">{item.label}</div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ y: -2, scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('/ship')}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#4D148C] to-[#7C2DCE] px-6 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-purple-200"
                >
                  Ship a package <ArrowRight className="h-4 w-4 text-[#FF6600]" />
                </motion.button>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('/track')}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 shadow-sm"
                >
                  Track shipment <Search className="h-4 w-4 text-[#4D148C]" />
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              key={DASHBOARD_SLIDES[dashboardSlide].id}
              initial={{ opacity: 0.72, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative min-h-[520px] sm:min-h-[590px] lg:min-h-[630px]"
            >
              {/* Professional logistics agent portrait */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-8 sm:inset-x-14 lg:inset-x-12 bottom-0 top-8 overflow-hidden rounded-[2.5rem] border border-white/80 bg-slate-100 shadow-[0_35px_90px_rgba(77,20,140,0.20)]"
              >
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1100&q=88"
                  alt="Professional logistics operations agent"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#18052D]/75 via-transparent to-white/5" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/15 via-transparent to-[#4D148C]/10" />
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-slate-950/55 p-4 text-white backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-300">Operations agent</div>
                      <div className="mt-1 text-sm font-extrabold">Global shipment desk</div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-semibold text-emerald-300">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
                      Live
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Animated tracking command card */}
              <motion.div
                initial={{ opacity: 0, x: 25, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="absolute right-0 top-10 z-30 w-[210px] sm:w-[245px] rounded-3xl border border-white/80 bg-white/92 p-4 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-purple-50 text-[#4D148C]"><Box className="h-4 w-4" /></span>
                    {DASHBOARD_SLIDES[dashboardSlide].panelTitle}
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">{DASHBOARD_SLIDES[dashboardSlide].panelStatus}</span>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#4D148C] to-[#FF6600]"
                    animate={{ width: ['28%', '72%', '46%', '82%'] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
                <div className="mt-3 flex justify-between text-[10px] font-semibold text-slate-500">
                  <span>{DASHBOARD_SLIDES[dashboardSlide].origin}</span><span>{DASHBOARD_SLIDES[dashboardSlide].destination}</span>
                </div>
              </motion.div>

              {/* Animated KPI card */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.65, duration: 0.6 }}
                className="absolute left-0 top-40 z-30 w-[190px] sm:w-[215px] rounded-3xl border border-purple-100 bg-white/90 p-4 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">{DASHBOARD_SLIDES[dashboardSlide].metricLabel}</span>
                  <Activity className="h-4 w-4 text-[#FF6600]" />
                </div>
                <div className="mt-2 flex items-end gap-2">
                  <motion.span
                    className="text-3xl font-black text-slate-900"
                    animate={{ opacity: [0.72, 1, 0.72] }}
                    transition={{ duration: 2.4, repeat: Infinity }}
                  >
                    {DASHBOARD_SLIDES[dashboardSlide].metric}
                  </motion.span>
                  <span className="mb-1 text-[10px] font-bold text-emerald-600">active</span>
                </div>
                <div className="mt-3 flex h-12 items-end gap-1">
                  {[32, 48, 39, 67, 54, 78, 62, 88, 72, 96].map((height, index) => (
                    <motion.span
                      key={index}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-[#4D148C] to-[#9F67E9]"
                      animate={{ height: [height + '%', Math.max(18, height - 20) + '%', height + '%'] }}
                      transition={{ duration: 2.8 + index * 0.08, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Floating route signal */}
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 1.5, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-24 right-2 sm:right-5 z-30 rounded-2xl border border-white/80 bg-slate-950/90 px-4 py-3 text-white shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className="relative flex h-2 w-2"><span className="absolute h-2 w-2 animate-ping rounded-full bg-[#FF6600]" /><span className="relative h-2 w-2 rounded-full bg-[#FF6600]" /></span>
                  {DASHBOARD_SLIDES[dashboardSlide].signal}
                </div>
                <div className="mt-1 text-[9px] text-slate-400">Global network telemetry</div>
              </motion.div>
          </motion.div>
          </div>

          <div className="relative z-40 -mt-1 mb-5 flex items-center justify-center gap-2">
            <button
              type="button"
              aria-label="Previous dashboard view"
              onClick={() => changeDashboardSlide(dashboardSlide - 1)}
              className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#4D148C] hover:text-[#4D148C]"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
            </button>
            <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-2 shadow-sm">
              {DASHBOARD_SLIDES.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Show dashboard view ${index + 1}`}
                  onClick={() => changeDashboardSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${index === dashboardSlide ? 'w-8 bg-[#4D148C]' : 'w-3 bg-slate-200 hover:bg-slate-300'}`}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next dashboard view"
              onClick={() => changeDashboardSlide(dashboardSlide + 1)}
              className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#4D148C] hover:text-[#4D148C]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Live tracking strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.55 }}
            className="relative z-30 -mt-2 lg:-mt-8 rounded-[2rem] border border-slate-200 bg-white/95 p-4 sm:p-5 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="min-w-[190px]">
                <div className="text-sm font-extrabold text-slate-900">Track your shipment</div>
                <div className="mt-0.5 text-[11px] text-slate-500">Enter a production tracking number for live status.</div>
              </div>
              <form onSubmit={handleTrackSubmit} className="flex-1 flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={trackingInput}
                  onChange={e => setTrackingInput(e.target.value)}
                  placeholder="Tracking number"
                  className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                />
                <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#4D148C] px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-purple-200">
                  Track <ArrowRight className="h-4 w-4 text-[#FF6600]" />
                </button>
              </form>
              <div className="hidden xl:flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Production connected
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* QUICK HIGHLIGHT OF REAL HEAVY EQUIPMENT & AIRCRAFT (Featured section with large photos) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4D148C]/10 text-[#4D148C] font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <Plane className="w-3.5 h-3.5 text-[#FF6600]" />
              Intercontinental Fleet & Heavy Equipment
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight font-display">
              Heavy Freight Aircraft & Advanced Ground Fleet
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl mt-1">
              Engineered to carry over 100,000 kg across oceans non-stop and deliver with zero emissions in city centers.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/equipment')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-[#4D148C] text-white font-bold text-xs font-mono uppercase tracking-wider transition-colors shrink-0 shadow-sm"
          >
            <span>Explore All 710+ Fleet Units</span>
            <ArrowRight className="w-4 h-4 text-[#FF6600]" />
          </button>
        </div>

        {/* 3 Featured Massive Equipment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Boeing 777F */}
          <div
            onClick={() => onNavigate('/equipment?cat=air')}
            className="group relative rounded-3xl overflow-hidden bg-slate-950 text-white cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-800"
          >
            <div className="h-64 sm:h-72 w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=85"
                alt="Boeing 777F Cargo Aircraft"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
            </div>
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-[#4D148C] text-white text-[11px] font-mono font-bold uppercase tracking-wider shadow-md">
                Flagship Intercontinental
              </span>
            </div>
            <div className="p-6 relative z-10 space-y-2">
              <h3 className="text-xl font-extrabold text-white group-hover:text-[#FF6600] transition-colors">
                Boeing 777F Long-Haul Cargo
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                102,000 kg max payload and 9,200 km range connecting Asia, the Americas, and Europe non-stop.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-mono text-[#FF6600]">
                <span>58 Aircraft in Service</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Specs →
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: BrightDrop Electric Delivery Van */}
          <div
            onClick={() => onNavigate('/equipment?cat=ground')}
            className="group relative rounded-3xl overflow-hidden bg-slate-950 text-white cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-800"
          >
            <div className="h-64 sm:h-72 w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=85"
                alt="BrightDrop Zevo 600 Electric Van"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
            </div>
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-mono font-bold uppercase tracking-wider shadow-md">
                Zero-Emission Electric
              </span>
            </div>
            <div className="p-6 relative z-10 space-y-2">
              <h3 className="text-xl font-extrabold text-white group-hover:text-[#FF6600] transition-colors">
                BrightDrop Zevo 600 EV Fleet
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                250-mile all-electric range with 600 cu.ft cargo volume and real-time cloud predictive routing.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-mono text-emerald-400">
                <span>2,500+ Electric Units</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Specs →
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Memphis World SuperHub */}
          <div
            onClick={() => onNavigate('/equipment?cat=hub')}
            className="group relative rounded-3xl overflow-hidden bg-slate-950 text-white cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-800"
          >
            <div className="h-64 sm:h-72 w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=85"
                alt="Memphis World SuperHub Sorting"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
            </div>
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-cyan-600 text-white text-[11px] font-mono font-bold uppercase tracking-wider shadow-md">
                Global Nerve Center
              </span>
            </div>
            <div className="p-6 relative z-10 space-y-2">
              <h3 className="text-xl font-extrabold text-white group-hover:text-[#FF6600] transition-colors">
                Memphis World SuperHub
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Processing 500,000 packages/hour across 42 miles of automated laser-guided conveyor sorters.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-mono text-cyan-400">
                <span>500k Parcels / Hour</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Specs →
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEDEX SERVICE DIVISIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold font-mono tracking-widest text-[#FF6600] uppercase">
            Global Network Solutions
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2 font-display">
            Built for Every Size, Speed, and Destination
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Tailored logistics services spanning guaranteed overnight air courier, heavy highway freight, and temperature-controlled medical shipments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: FedEx Express */}
          <div
            onClick={() => onNavigate('/services/express')}
            className="group bg-white rounded-3xl p-6 border border-slate-200 hover:border-[#4D148C] hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#4D148C] group-hover:scale-110 transition-transform mb-5">
                <Plane className="w-6 h-6 text-[#FF6600]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#4D148C] transition-colors">
                FedEx Express®
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Time-definite overnight international delivery to over 220 countries with customs pre-clearance in flight.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#FF6600]">
              Explore Express <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: FedEx Ground */}
          <div
            onClick={() => onNavigate('/services/domestic')}
            className="group bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-600 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform mb-5">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                FedEx Ground®
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Cost-effective, day-definite commercial and residential parcel transit backed by autonomous EV delivery fleets.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              Explore Ground <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: FedEx Freight */}
          <div
            onClick={() => onNavigate('/services/freight')}
            className="group bg-white rounded-3xl p-6 border border-slate-200 hover:border-[#DF1995] hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-[#DF1995] group-hover:scale-110 transition-transform mb-5">
                <Ship className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#DF1995] transition-colors">
                FedEx Freight®
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                LTL palletized freight, full container intermodal rail, and heavy oversized machinery transport.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#DF1995]">
              Explore Freight <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: FedEx Custom Critical */}
          <div
            onClick={() => onNavigate('/services/warehousing')}
            className="group bg-white rounded-3xl p-6 border border-slate-200 hover:border-cyan-600 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform mb-5">
                <Warehouse className="w-6 h-6 text-[#4D148C]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                FedEx Custom Critical®
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Temperature-sensitive cryogenic biopharma, armored high-security assets, and chartered direct air-cargo.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-cyan-700">
              Explore Custom Critical <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* GLOBAL INFRASTRUCTURE & TELEMETRY STATS */}
      <section className="bg-slate-950 text-white py-16 sm:py-20 relative overflow-hidden border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-4 md:pt-0">
              <div className="text-4xl sm:text-5xl font-extrabold font-mono text-[#FF6600]">
                220+
              </div>
              <div className="text-sm text-slate-400 mt-2 font-medium">
                Countries & Territories Connected
              </div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-4xl sm:text-5xl font-extrabold font-mono text-white">
                710+
              </div>
              <div className="text-sm text-slate-400 mt-2 font-medium">
                Active Air Cargo Freighters
              </div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-4xl sm:text-5xl font-extrabold font-mono text-purple-400">
                215,000+
              </div>
              <div className="text-sm text-slate-400 mt-2 font-medium">
                Ground Delivery Fleet & Semis
              </div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-4xl sm:text-5xl font-extrabold font-mono text-emerald-400">
                19.5M+
              </div>
              <div className="text-sm text-slate-400 mt-2 font-medium">
                Daily Shipments Handled
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE RATE ESTIMATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#1F0838] to-[#0A0214] text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-purple-900/40 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6600]/20 text-[#FF6600] text-xs font-semibold mb-4 border border-[#FF6600]/30 font-mono">
              <Calculator className="w-3.5 h-3.5" />
              Real-Time Dynamic Rating Engine
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-snug font-display">
              Calculate Accurate International Shipping Rates & Transit Windows
            </h2>
            <p className="mt-4 text-purple-200 text-sm sm:text-base leading-relaxed">
              Transparent global tariffs with fuel index calculations and customs duty estimation. Test rates across FedEx Express, Priority, and Standard Ground.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('/quote')}
                className="px-6 py-3 rounded-xl bg-[#FF6600] hover:bg-[#E55C00] text-white font-extrabold text-sm transition-colors flex items-center gap-2 shadow-lg shadow-[#FF6600]/25"
              >
                Launch Full Quote Portal
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('/ship')}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-colors border border-white/20"
              >
                Create Shipment Direct
              </button>
            </div>
          </div>

          {/* Quick interactive calculator widget */}
          <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center justify-between">
              <span>Quick Rate Estimator</span>
              <span className="text-xs text-[#FF6600] font-mono font-bold uppercase">FedEx Express Tariff</span>
            </h3>

            <form onSubmit={handleQuickEstimate} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Origin Country</label>
                  <select
                    value={quickOrigin}
                    onChange={e => setQuickOrigin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4D148C]"
                  >
                    <option>United States</option>
                    <option>Nigeria</option>
                    <option>United Kingdom</option>
                    <option>Germany</option>
                    <option>United Arab Emirates</option>
                    <option>Brazil</option>
                    <option>Singapore</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Destination</label>
                  <select
                    value={quickDest}
                    onChange={e => setQuickDest(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4D148C]"
                  >
                    <option>Brazil</option>
                    <option>Nigeria</option>
                    <option>Germany</option>
                    <option>United States</option>
                    <option>Kenya</option>
                    <option>Australia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={quickWeight}
                  onChange={e => setQuickWeight(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#4D148C]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#4D148C] hover:bg-[#3B0E6E] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                Estimate Cost
              </button>
            </form>

          </div>
        </div>
      </section>

      {/* WHY CHOOSE FEDEX GLOBAL LOGISTICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold font-mono tracking-widest text-[#FF6600] uppercase">
            Global Reliability Standard
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2 font-display">
            Why the World’s Leading Enterprises Rely on FedEx
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#4D148C] flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5 text-[#FF6600]" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Dedicated Air Fleet & Priority Tarmac</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              With 710+ company-owned freighter jets, your consignments travel on dedicated cargo aircraft rather than unpredictable passenger belly space.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6600] flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">SenseAware Sub-Second Telemetry</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Active multi-sensor environmental pods measure GPS coordinates, temperature (-150°C to +60°C), light exposure, barometric pressure, and shock in real time.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#4D148C] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Global Trade & In-Flight Customs</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Electronic air waybill manifests transmit directly to customs authorities while aircraft are in flight, clearing parcels prior to touchdown at gateway hubs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
