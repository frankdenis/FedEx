import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Search,
  Send,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { addSupportTicket, getCurrentUser } from '../lib/store';

interface SupportCenterPageProps {
  onNavigate: (path: string) => void;
  onOpenChat: () => void;
}

export const SupportCenterPage: React.FC<SupportCenterPageProps> = ({ onNavigate, onOpenChat }) => {
  const currentUser = getCurrentUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Ticket Form State
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'tracking' | 'shipping' | 'billing' | 'customs'>('tracking');
  const [ticketTracking, setTicketTracking] = useState('');
  const [ticketPriority, setTicketPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  const faqs = [
    {
      q: 'How do I track my international consignment?',
      a: 'Enter your 11-character tracking code (e.g. NX839204715) in the top search bar or on our /track portal to see real-time flight telemetry, waypoint routes, and verified physical scan timestamps.',
    },
    {
      q: 'What should I do if my package shows "Customs Clearance"?',
      a: 'International packages undergo statutory regulatory checks. Most shipments clear within 12–36 hours. If additional commercial invoices or VAT documentation are needed, FedEx dispatch agents will contact the recipient directly.',
    },
    {
      q: 'Can I change the delivery address while a parcel is in transit?',
      a: 'Yes, if the shipment has not yet reached the "Out for Delivery" stage, corporate account holders or verified consignees can request in-flight address redirection via our support desk or customer dashboard.',
    },
    {
      q: 'How are shipping rates and fuel surcharges calculated?',
      a: 'Rates depend on origin, destination, actual weight versus volumetric dimensional weight (L × W × H ÷ 5000), and speed tier. Fuel surcharges index directly against monthly jet fuel spot prices.',
    },
    {
      q: 'How do I book a courier to pick up packages from my premises?',
      a: 'Navigate to the Customer Dashboard or click "Schedule Pickup". Same-day pickups can be booked until 3:00 PM local hub time for all express and freight consignments.',
    },
    {
      q: 'What items are prohibited from air carriage?',
      a: 'Flammable liquids, uncertified bulk lithium batteries, explosive items, aerosol sprays, and contraband commodities are strictly prohibited pursuant to ICAO/IATA aviation standards.',
    },
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    const newId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
    addSupportTicket({
      id: newId,
      userId: currentUser?.id || 'usr_demo_customer',
      subject: ticketSubject,
      category: ticketCategory,
      priority: ticketPriority,
      status: 'open',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      message: ticketMessage,
      trackingNumber: ticketTracking || undefined,
    });

    setSubmittedTicketId(newId);
    setTicketSubject('');
    setTicketTracking('');
    setTicketMessage('');
  };

  const filteredFaqs = faqs.filter(
    f =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF6600]">
          24/7 Global Client Services
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-1 font-display">
          FedEx Support & Resolution Center
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2">
          Find answers, chat with our automated virtual dispatcher, or open an expedited customer support inquiry.
        </p>
      </div>

      {/* 3 Contact Channel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={onOpenChat}
          className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-[#4D148C] hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#4D148C] flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Virtual Dispatch AI Chat</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Instant responses to tracking lookups, customs guidelines, and shipping calculations.
            </p>
          </div>
          <button className="mt-4 text-xs font-bold text-[#4D148C] flex items-center gap-1">
            Start Live Chat →
          </button>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF6600] flex items-center justify-center mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Direct Telephone Desk</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Toll-free 24/7 international priority dispatch coordination.
            </p>
            <div className="mt-3 font-mono font-bold text-sm text-slate-900">1-800-GO-FEDEX (1-800-463-3339)</div>
            <div className="text-[11px] text-slate-400">Available 24 hours / 7 days</div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#4D148C] flex items-center justify-center mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Email Inquiries</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Official written declarations, claims, and customs correspondence.
            </p>
            <div className="mt-3 font-mono font-semibold text-xs text-slate-900">dispatch@fedex-logistics.com</div>
            <div className="text-[11px] text-slate-400">Target response time: &lt; 2 hours</div>
          </div>
        </div>
      </div>

      {/* Main Grid: FAQ Accordion & Open Support Ticket Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* FAQs */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
          </div>

          <div className="relative mb-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search help articles..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-900 hover:bg-slate-50/50"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Ticket Submission Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <HelpCircle className="w-5 h-5 text-[#4D148C]" />
            <h2 className="font-bold text-base text-slate-900">Submit Support Ticket</h2>
          </div>

          {submittedTicketId ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in zoom-in-95">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-sm text-emerald-950">Ticket Successfully Opened</h3>
              <p className="text-xs text-emerald-800">
                Your ticket reference is <strong className="font-mono">{submittedTicketId}</strong>. A dispatch agent has been assigned to your case.
              </p>
              <button
                onClick={() => setSubmittedTicketId(null)}
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject / Issue Summary *</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={e => setTicketSubject(e.target.value)}
                  placeholder="e.g. In-transit address change request"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={ticketCategory}
                    onChange={e => setTicketCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="tracking">Tracking Status</option>
                    <option value="shipping">Shipment Creation</option>
                    <option value="billing">Invoices / Billing</option>
                    <option value="customs">Customs Clearance</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={ticketPriority}
                    onChange={e => setTicketPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="low">Standard</option>
                    <option value="medium">Medium</option>
                    <option value="high">High (Urgent)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tracking Number (Optional)</label>
                <input
                  type="text"
                  value={ticketTracking}
                  onChange={e => setTicketTracking(e.target.value)}
                  placeholder="e.g. NX839204715"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Description *</label>
                <textarea
                  rows={4}
                  required
                  value={ticketMessage}
                  onChange={e => setTicketMessage(e.target.value)}
                  placeholder="Describe your inquiry with consignment specifics..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#4D148C] hover:bg-purple-900 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Submit Ticket
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
