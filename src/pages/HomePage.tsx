import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  ArrowRight,
  Bell,
  Box,
  BriefcaseBusiness,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Globe2,
  Headphones,
  Home,
  Layers3,
  MapPin,
  Package,
  Plane,
  Search,
  ShieldCheck,
} from "lucide-react";
import { api } from "../lib/api";

interface HomePageProps {
  onNavigate: (path: string) => void;
}

const nav = [
  { label: "Dashboard", icon: Home, path: "/" },
  { label: "Ship a Package", icon: Package, path: "/ship" },
  { label: "Track Shipment", icon: Search, path: "/track" },
  { label: "International", icon: Globe2, path: "/services/international" },
  { label: "Services", icon: Layers3, path: "/services" },
  { label: "My Shipments", icon: Box, path: "/dashboard/shipments" },
  { label: "Business Solutions", icon: BriefcaseBusiness, path: "/business" },
  { label: "Support", icon: CircleHelp, path: "/support" },
];

const slides = [
  {
    id: "network",
    eyebrow: "Global logistics command center",
    title: "Your World",
    accent: "Our Priority",
    copy: "A clear workspace for shipping, tracking and managing deliveries across your global network.",
    panelTitle: "Network overview",
    panelStatus: "Connected",
    metricLabel: "Network",
    metric: "Live",
  },
  {
    id: "tracking",
    eyebrow: "Live tracking workspace",
    title: "Know Where",
    accent: "It Is",
    copy: "Follow each shipment from collection through transit and delivery with production tracking when available.",
    panelTitle: "Tracking workspace",
    panelStatus: "Monitoring",
    metricLabel: "Tracking",
    metric: "Realtime",
  },
  {
    id: "shipping",
    eyebrow: "Production shipment flow",
    title: "Ship With",
    accent: "Confidence",
    copy: "Create a shipment, review a production rate, continue securely to payment and move into fulfillment.",
    panelTitle: "Shipment workflow",
    panelStatus: "Ready",
    metricLabel: "Checkout",
    metric: "Secure",
  },
  {
    id: "international",
    eyebrow: "International movement",
    title: "Move Across",
    accent: "Borders",
    copy: "Access international services, route information and delivery support from one responsive workspace.",
    panelTitle: "Global movement",
    panelStatus: "Available",
    metricLabel: "Services",
    metric: "Global",
  },
];

const services = [
  { label: "Ship a Package", copy: "Create a production shipment and continue securely to payment.", icon: Package, path: "/ship" },
  { label: "International", copy: "Explore international delivery services and route options.", icon: Globe2, path: "/services/international" },
  { label: "Business Solutions", copy: "Manage logistics workflows for growing teams and enterprises.", icon: BriefcaseBusiness, path: "/business" },
  { label: "Support", copy: "Get help with shipments, tracking, account access and services.", icon: Headphones, path: "/support" },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [slide, setSlide] = useState(0);
  const [tracking, setTracking] = useState("");
  const [error, setError] = useState("");
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const active = slides[slide];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlide((value) => (value + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let live = true;
    setLoading(true);
    api
      .shipments()
      .then((payload: any) => {
        const rows = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.shipments)
            ? payload.shipments
            : [];
        if (live) setShipments(rows.slice(0, 4));
      })
      .catch(() => {
        if (live) setShipments([]);
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, []);

  const track = (event: React.FormEvent) => {
    event.preventDefault();
    if (!tracking.trim()) {
      setError("Enter a tracking number to continue.");
      return;
    }
    setError("");
    onNavigate("/track?q=" + encodeURIComponent(tracking.trim()));
  };

  return (
    <div className="relative -mt-[72px] min-h-screen bg-[#f7f9fd] pt-[72px] text-[#13245a]">
      <header className="absolute inset-x-0 top-0 z-[60] h-[72px] border-b border-[#dfe5ef] bg-white/96 shadow-[0_3px_18px_rgba(30,45,85,0.06)] backdrop-blur-xl">
        <div className="mx-auto flex h-full max-w-[1540px] items-center gap-5 px-4 sm:px-6 lg:px-8">
          <button onClick={() => onNavigate("/")} className="shrink-0 text-3xl font-black tracking-[-0.08em] text-[#4D148C] sm:text-4xl" aria-label="FedEx home">
            Fed<span className="text-[#FF6600]">Ex</span>
          </button>
          <button onClick={() => onNavigate("/track")} className="hidden h-10 max-w-[560px] flex-1 items-center gap-3 rounded-2xl border border-[#d8dfeb] bg-white px-4 text-left shadow-sm md:flex">
            <Search className="h-4 w-4 text-[#71809e]" />
            <span className="truncate text-xs font-medium text-[#7d89a1]">Search tracking number, shipment, or destination...</span>
          </button>
          <div className="ml-auto flex items-center gap-2">
            <button className="hidden items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-bold text-[#23345f] hover:bg-[#f4f6fa] sm:flex">
              <Globe2 className="h-4 w-4" /> EN <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <button className="relative grid h-10 w-10 place-items-center rounded-xl text-[#273a6a] hover:bg-[#f4f6fa]" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#ef3b24] px-1 text-[8px] font-black text-white">3</span>
            </button>
            <button onClick={() => onNavigate("/dashboard")} className="flex items-center gap-2 rounded-xl px-1.5 py-1 hover:bg-[#f4f6fa]">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#4D148C] to-[#8a2be2] text-xs font-black text-white">C</span>
              <span className="hidden text-left sm:block">
                <span className="block text-[9px] text-[#8b96aa]">Good Morning</span>
                <span className="block text-xs font-extrabold text-[#1b2c60]">Customer</span>
              </span>
              <ChevronDown className="hidden h-3.5 w-3.5 text-[#697691] sm:block" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-72px)]">
        <aside className="hidden w-[218px] shrink-0 border-r border-[#dfe5f0] bg-white md:flex md:flex-col">
          <nav className="flex-1 space-y-1 p-4 pt-6">
            {nav.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.label}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onNavigate(item.path)}
                  className={"group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-semibold transition " + (index === 0 ? "bg-gradient-to-r from-[#4D148C] via-[#7020d8] to-[#8b22ff] text-white shadow-lg shadow-purple-200" : "text-[#24345f] hover:bg-[#f2f4fa]")}
                >
                  <Icon className={"h-[19px] w-[19px] " + (index === 0 ? "text-white" : "text-[#243d86]")} />
                  <span>{item.label}</span>
                  {(item.label === "Services" || item.label === "Support") && <ChevronRight className="ml-auto h-4 w-4 opacity-60" />}
                </motion.button>
              );
            })}
          </nav>
          <div className="p-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#4D148C] via-[#7624d5] to-[#ff6600] p-4 text-white shadow-xl">
              <div className="relative z-10">
                <div className="text-[16px] font-extrabold leading-tight">Global Reach.<br />Local Care.</div>
                <p className="mt-2 text-[11px] leading-4 text-white/85">Connected shipping support for people and businesses around the world.</p>
                <button onClick={() => onNavigate("/services")} className="mt-4 rounded-lg bg-white px-3 py-2 text-[10px] font-extrabold text-[#4D148C]">
                  Explore services <ArrowRight className="ml-1 inline h-3 w-3" />
                </button>
              </div>
              <Plane className="absolute -bottom-4 -right-2 h-20 w-20 rotate-12 text-white/20" />
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-hidden">
          <section className="relative overflow-hidden border-b border-[#dfe5f0] bg-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(77,20,140,0.09),transparent_34%),radial-gradient(circle_at_20%_0%,rgba(40,129,255,0.10),transparent_30%)]" />
            <div className="relative mx-auto grid max-w-[1380px] gap-7 px-5 py-7 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:px-9 lg:py-9">
              <div className="flex min-w-0 flex-col justify-center">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={active.id} initial={{ opacity: 0, y: 12, filter: "blur(3px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -8, filter: "blur(2px)" }} transition={{ duration: 0.4 }}>
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#ddd6fe] bg-[#faf8ff] px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#4D148C]">
                      <span className="h-2 w-2 rounded-full bg-[#18b87b]" /> {active.eyebrow}
                    </div>
                    <h1 className="mt-5 text-[42px] font-black leading-[0.96] tracking-[-0.05em] text-[#10235f] sm:text-5xl lg:text-[60px]">
                      {active.title}
                      <span className="block bg-gradient-to-r from-[#4D148C] via-[#8b1de5] to-[#ef3b24] bg-clip-text text-transparent">{active.accent}</span>
                    </h1>
                    <p className="mt-5 max-w-[520px] text-sm leading-6 text-[#4b5b7c] sm:text-[15px]">{active.copy}</p>
                  </motion.div>
                </AnimatePresence>

                <form onSubmit={track} className="mt-6 rounded-2xl border border-[#dce3ef] bg-white p-3 shadow-[0_14px_35px_rgba(32,48,90,0.09)]">
                  <div className="flex items-center gap-2 px-2 pb-2 text-xs font-extrabold text-[#16275d]">
                    <Box className="h-4 w-4 text-[#4D148C]" /> Track Your Shipment
                  </div>
                  <div className="flex gap-2">
                    <div className="relative min-w-0 flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8591ab]" />
                      <input value={tracking} onChange={(event) => setTracking(event.target.value)} placeholder="Enter tracking number" className="h-11 w-full rounded-xl border border-[#dce3ef] bg-[#fbfcfe] pl-9 pr-3 text-sm outline-none focus:border-[#7c3aed]" />
                    </div>
                    <button className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-r from-[#4D148C] to-[#7c25db] text-white" aria-label="Track shipment">
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                  {error && <div className="mt-2 px-2 text-[11px] font-semibold text-rose-600">{error}</div>}
                  <div className="mt-3 flex items-center gap-2 text-[10px] font-semibold text-[#18a870]">
                    <span className="h-2 w-2 rounded-full bg-[#18b87b]" /> Live tracking · production data when available
                  </div>
                </form>

                <div className="mt-5 grid grid-cols-3 gap-2.5">
                  {[
                    { Icon: Activity, label: "Shipment visibility", value: "Live" },
                    { Icon: Clock3, label: "Tracking", value: "Realtime" },
                    { Icon: Globe2, label: "Global services", value: "Available" },
                  ].map(({ Icon, label, value }) => (
                    <motion.div key={label} whileHover={{ y: -3 }} className="rounded-2xl border border-[#e0e5ef] bg-white p-3 shadow-sm">
                      <Icon className="h-4 w-4 text-[#4D148C]" />
                      <div className="mt-2 text-sm font-black text-[#17285e]">{value}</div>
                      <div className="mt-0.5 text-[10px] text-[#72809c]">{label}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-2.5">
                  <button onClick={() => onNavigate("/ship")} className="rounded-xl bg-gradient-to-r from-[#4D148C] to-[#7b20dd] px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-purple-200">
                    Ship a Package <ArrowRight className="ml-1 inline h-4 w-4 text-[#ff8a42]" />
                  </button>
                  <button onClick={() => onNavigate("/services")} className="rounded-xl border border-[#d8dfeb] bg-white px-5 py-3 text-sm font-bold text-[#27375f]">
                    Explore Services
                  </button>
                </div>
              </div>

              <div className="relative min-h-[430px] sm:min-h-[500px]">
                <div className="absolute inset-4 rounded-[30px] bg-gradient-to-br from-[#edf5ff] via-white to-[#f7efff]" />
                <div className="absolute inset-4 overflow-hidden rounded-[30px] border border-white shadow-[0_28px_70px_rgba(45,49,94,0.14)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_45%,rgba(77,20,140,0.12),transparent_34%),linear-gradient(135deg,#ffffff,#f8f4ff)]" />
                  <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/90 to-transparent" />

                  <div className="absolute left-5 top-5 rounded-xl border border-white bg-white/90 px-3 py-2 shadow-lg backdrop-blur">
                    <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#4D148C]">{active.panelTitle}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs font-extrabold text-[#15265b]">
                      <span className="h-2 w-2 rounded-full bg-[#18b87b]" /> {active.panelStatus}
                    </div>
                  </div>

                  <div className="absolute right-5 top-5 rounded-2xl border border-white bg-white/95 p-3 shadow-xl">
                    <div className="flex items-center gap-2">
                      <Globe2 className="h-4 w-4 text-[#4D148C]" />
                      <span className="text-[10px] font-extrabold text-[#183066]">{active.metricLabel}</span>
                    </div>
                    <div className="mt-2 text-lg font-black text-[#14265e]">{active.metric}</div>
                    <div className="mt-1 text-[9px] text-[#71809d]">Production-connected view</div>
                  </div>

                  <div className="absolute inset-x-10 top-28 bottom-28">
                    <svg viewBox="0 0 100 70" className="h-full w-full" aria-hidden="true">
                      <defs>
                        <radialGradient id="routeGlow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#8b22ff" stopOpacity=".28" />
                          <stop offset="100%" stopColor="#8b22ff" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <ellipse cx="50" cy="35" rx="39" ry="25" fill="url(#routeGlow)" />
                      <ellipse cx="50" cy="35" rx="31" ry="21" fill="none" stroke="#d9e0ef" strokeWidth=".8" />
                      <ellipse cx="50" cy="35" rx="21" ry="21" fill="none" stroke="#e4e8f1" strokeWidth=".8" />
                      <path d="M12 51 C25 15 42 18 53 34 S70 56 88 19" fill="none" stroke="#d1d9e8" strokeWidth=".8" strokeDasharray="2 2" />
                      <path d="M20 54 C35 43 44 25 58 34 S73 45 84 25" fill="none" stroke="#6d24d4" strokeWidth="1.5" strokeDasharray="3 2" />
                      <path d="M21 54 C39 46 48 29 62 36 S75 42 84 25" fill="none" stroke="#ff6600" strokeWidth=".8" opacity=".7" />
                      {[[21,54],[45,30],[62,36],[84,25]].map(([cx,cy]) => (
                        <g key={cx + "-" + cy}>
                          <circle cx={cx} cy={cy} r="5" fill="#8b22ff" opacity=".08" />
                          <circle cx={cx} cy={cy} r="1.9" fill="#4D148C" />
                        </g>
                      ))}
                    </svg>
                  </div>

                  <div className="absolute left-8 top-[45%] rounded-xl border border-white bg-white/95 px-3 py-2 shadow-lg">
                    <div className="text-[9px] font-bold text-[#7b879f]">Origin</div>
                    <div className="mt-0.5 flex items-center gap-1 text-[11px] font-extrabold text-[#16275d]"><MapPin className="h-3 w-3 text-[#4D148C]" /> Connected</div>
                  </div>
                  <div className="absolute right-8 top-[38%] rounded-xl border border-white bg-white/95 px-3 py-2 shadow-lg">
                    <div className="text-[9px] font-bold text-[#7b879f]">Destination</div>
                    <div className="mt-0.5 flex items-center gap-1 text-[11px] font-extrabold text-[#16275d]"><MapPin className="h-3 w-3 text-[#ff6600]" /> Connected</div>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white bg-white/95 p-4 shadow-xl backdrop-blur">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#71809d]">Shipment visibility</div>
                        <div className="mt-1 text-sm font-extrabold text-[#14265e]">Origin → hub → destination</div>
                      </div>
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#f0e8ff] text-[#4D148C]"><MapPin className="h-4 w-4" /></div>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#edf0f6]">
                      <motion.div className="h-full rounded-full bg-gradient-to-r from-[#4D148C] via-[#7c2bd4] to-[#FF6600]" animate={{ width: ["24%", "72%", "48%", "86%"] }} transition={{ duration: 6, repeat: Infinity }} />
                    </div>
                    <div className="mt-2 flex justify-between text-[9px] font-semibold text-[#7a879f]"><span>Pickup</span><span>Transit</span><span>Delivery</span></div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#e1e6f0] bg-white/95 px-2 py-1.5 shadow-lg">
                  <button onClick={() => setSlide((value) => (value - 1 + slides.length) % slides.length)} aria-label="Previous dashboard view" className="grid h-7 w-7 place-items-center rounded-full text-[#4D148C] hover:bg-[#f3effb]"><ChevronLeft className="h-4 w-4" /></button>
                  {slides.map((item, index) => (
                    <button key={item.id} onClick={() => setSlide(index)} aria-label={"Show " + item.eyebrow} className={"h-1.5 rounded-full transition-all " + (index === slide ? "w-8 bg-[#4D148C]" : "w-2 bg-[#cbd3e2]")} />
                  ))}
                  <button onClick={() => setSlide((value) => (value + 1) % slides.length)} aria-label="Next dashboard view" className="grid h-7 w-7 place-items-center rounded-full text-[#4D148C] hover:bg-[#f3effb]"><ChevronRight className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-[1380px] px-5 py-7 sm:px-8 lg:px-9">
            <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
              <div className="rounded-2xl border border-[#dfe5ef] bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-[#edf0f5] px-5 py-4">
                  <div>
                    <h2 className="text-base font-extrabold text-[#17285e]">Recent Shipments</h2>
                    <p className="mt-0.5 text-[10px] text-[#7b879f]">Only production records from your account appear here.</p>
                  </div>
                  <button onClick={() => onNavigate("/dashboard/shipments")} className="text-[11px] font-extrabold text-[#4D148C]">View All <ArrowRight className="ml-1 inline h-3 w-3" /></button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left text-xs">
                    <thead className="bg-[#fafbfe] text-[9px] font-extrabold uppercase tracking-wider text-[#8a95ab]">
                      <tr><th className="px-5 py-3">Tracking Number</th><th className="px-5 py-3">Destination</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">ETA</th></tr>
                    </thead>
                    <tbody className="divide-y divide-[#edf0f5]">
                      {loading ? (
                        <tr><td colSpan={4} className="px-5 py-8 text-center text-[#7b879f]">Loading production shipments…</td></tr>
                      ) : shipments.length ? (
                        shipments.map((shipment) => (
                          <tr key={shipment.id || shipment.trackingNumber}>
                            <td className="px-5 py-3 font-bold text-[#23356b]">{shipment.trackingNumber || "Pending"}</td>
                            <td className="px-5 py-3 text-[#5e6c88]">{shipment.destination?.city || shipment.destination?.country || "—"}</td>
                            <td className="px-5 py-3 font-semibold text-[#52617d]"><span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#18b87b]" />{shipment.status || "Processing"}</td>
                            <td className="px-5 py-3 text-[#66748f]">{shipment.estimatedDelivery || "—"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={4} className="px-5 py-9 text-center"><Package className="mx-auto h-6 w-6 text-[#4D148C]" /><div className="mt-2 text-sm font-bold text-[#24345f]">No shipment records to display</div><div className="mt-1 text-[11px] text-[#7b879f]">Sign in or create a shipment to populate this panel with production data.</div></td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl border border-[#dfe5ef] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div><div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#4D148C]">Shipment progress</div><h2 className="mt-1 text-base font-extrabold text-[#17285e]">Operational timeline</h2></div>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f1e9ff] text-[#4D148C]"><Activity className="h-5 w-5" /></div>
                </div>
                <div className="mt-5 space-y-4">
                  {["Shipment created", "Picked up", "In transit", "Out for delivery"].map((label, index) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className={"relative grid h-7 w-7 place-items-center rounded-full " + (index < 2 ? "bg-[#18b87b] text-white" : "border-2 border-[#d6ddeb] bg-white text-[#8792a8]")}>
                        {index < 2 ? <ShieldCheck className="h-3.5 w-3.5" /> : <span className="text-[10px] font-bold">{index + 1}</span>}
                      </div>
                      <div><div className="text-xs font-bold text-[#24345f]">{label}</div><div className="text-[10px] text-[#8490a7]">{index < 2 ? "Available when a production shipment is active." : "Pending shipment milestone."}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-[1380px] px-5 pb-10 sm:px-8 lg:px-9">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {services.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.button key={item.label} whileHover={{ y: -4 }} whileTap={{ scale: 0.99 }} onClick={() => onNavigate(item.path)} className="rounded-2xl border border-[#dfe5ef] bg-white p-4 text-left shadow-sm transition hover:shadow-lg">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f0e8ff] text-[#4D148C]"><Icon className="h-5 w-5" /></div>
                    <div className="mt-3 text-sm font-extrabold text-[#17285e]">{item.label}</div>
                    <p className="mt-1 text-[10px] leading-4 text-[#78859f]">{item.copy}</p>
                    <div className="mt-3 text-[10px] font-extrabold text-[#4D148C]">Open <ArrowRight className="ml-1 inline h-3 w-3" /></div>
                  </motion.button>
                );
              })}
            </div>
          </section>

          <footer className="border-t border-[#dfe5ef] bg-white px-5 py-5 sm:px-8 lg:px-9">
            <div className="mx-auto flex max-w-[1380px] flex-wrap items-center justify-between gap-3 text-[10px] text-[#7c879d]">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#4D148C]" /> Secure logistics workspace</div>
              <div>Ship globally. Track clearly. Deliver with confidence.</div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};
