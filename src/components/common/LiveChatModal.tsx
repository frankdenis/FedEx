import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, HelpCircle } from 'lucide-react';
import { getShipmentByTracking } from '../../lib/store';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

interface LiveChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

export const LiveChatModal: React.FC<LiveChatModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_welcome',
      sender: 'bot',
      text: 'Hello! I am the FedEx Virtual Dispatch Assistant. I can assist you with tracking global air parcels, estimating international rates, reviewing customs compliance requirements, or locating world hub gateways. How can I help you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Track NX839204715',
    'How long does customs clearance take?',
    'What is required for international shipping?',
    'How do I book a courier pickup?',
  ];

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // AI / Rule-based dispatch response
    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();

      // Check for tracking number pattern
      const trackingMatch = text.match(/NX\d{9}/i);
      if (trackingMatch) {
        const found = getShipmentByTracking(trackingMatch[0]);
        if (found) {
          reply = `Shipment **${found.trackingNumber}** is currently **${found.status}** from ${found.sender.city}, ${found.sender.country} to ${found.recipient.city}, ${found.recipient.country}. Estimated delivery: **${found.estimatedDelivery}**. Latest update: "${found.events[0]?.description || 'In transit'}".`;
        } else {
          reply = `I could not locate tracking number ${trackingMatch[0]} in our global registry. Please verify the tracking number or check active consignments: NX839204715, NX839204716, or NX839204717.`;
        }
      } else if (lower.includes('customs')) {
        reply = `International customs processing typically clears within 12 to 36 hours when documentation is complete. Essential requirements include a detailed Commercial Invoice (3 copies), Harmonized Tariff System (HS) codes, and declared commercial values. For priority clearance assistance, visit our /services/customs page.`;
      } else if (lower.includes('track')) {
        reply = `You can track any consignment directly on our dedicated /track portal or enter active tracking number NX839204715. Would you like me to open the tracking page for you?`;
      } else if (lower.includes('rate') || lower.includes('quote') || lower.includes('cost') || lower.includes('price')) {
        reply = `Our interactive rate calculator is available at /quote! Rates start at $32 for FedEx Ground, $48 for FedEx Priority, $65 for FedEx Express Air, and $195 for commercial Freight.`;
      } else if (lower.includes('pickup')) {
        reply = `FedEx couriers provide doorstep parcel pickup services! Same-day requests can be placed until 3:00 PM local time via our /services/pickup portal.`;
      } else if (lower.includes('return')) {
        reply = `We provide printer-less QR returns and commercial return logistics. You can generate return labels or view drop-off points at /services/returns.`;
      } else {
        reply = `Thank you for contacting FedEx Global Dispatch. We provide 24/7 global express tracking, heavy aircraft cargo transport, customs brokering, and fleet logistics. You can create a new shipment at /ship, track active consignments at /track, or explore our heavy equipment fleet at /equipment.`;
      }

      const botMsg: Message = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[520px] animate-in slide-in-from-bottom-5 duration-200">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-[#1F0838] via-[#4D148C] to-[#1F0838] text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-[#FF6600]">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-900" />
          </div>
          <div>
            <h4 className="text-sm font-bold flex items-center gap-1.5 font-display">
              FedEx Virtual Dispatch
              <Sparkles className="w-3.5 h-3.5 text-[#FF6600]" />
            </h4>
            <span className="text-[10px] text-purple-200 font-mono">
              AI Support & Telemetry Assistant
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 text-xs">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="w-7 h-7 rounded-lg bg-[#4D148C] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-[#FF6600]" />
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-[#4D148C] text-white rounded-br-xs shadow-xs'
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-xs'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <span
                className={`text-[9px] block text-right mt-1 ${
                  msg.sender === 'user' ? 'text-purple-200' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2 items-center text-slate-400 text-xs italic">
            <Bot className="w-4 h-4 text-[#FF6600] animate-spin" />
            FedEx Dispatch Assistant is reviewing shipment logs...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="p-2 border-t border-slate-100 bg-white flex gap-1.5 overflow-x-auto no-scrollbar">
        {quickPrompts.map(p => (
          <button
            key={p}
            onClick={() => handleSend(p)}
            className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-purple-50 hover:text-[#4D148C] text-slate-600 transition-colors border border-slate-200 shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask about tracking, shipping rates, customs..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="p-2 rounded-xl bg-[#4D148C] text-white hover:bg-purple-900 disabled:opacity-40 disabled:hover:bg-[#4D148C] transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
