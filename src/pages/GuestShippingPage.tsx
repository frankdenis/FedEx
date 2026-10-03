import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, MapPin, Package, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';

interface Props { onNavigate: (path: string) => void; }

type FormState = {
  firstName: string; lastName: string; email: string; phone: string;
  senderName: string; senderAddress: string; senderCity: string; senderCountry: string;
  recipientName: string; recipientAddress: string; recipientCity: string; recipientCountry: string;
  description: string; weight: number; length: number; width: number; height: number;
};

export const GuestShippingPage: React.FC<Props> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [request, setRequest] = useState<any>(null);
  const [form, setForm] = useState<FormState>({
    firstName:'', lastName:'', email:'', phone:'',
    senderName:'', senderAddress:'', senderCity:'', senderCountry:'Nigeria',
    recipientName:'', recipientAddress:'', recipientCity:'', recipientCountry:'United States',
    description:'', weight:1, length:20, width:15, height:10,
  });

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(current => ({ ...current, [key]: value }));

  const field = (key: keyof FormState, label: string, type = 'text') => (
    <label className="text-xs font-black text-[#34446b]">
      {label}
      <input
        required
        type={type}
        value={String(form[key])}
        onChange={event => update(key, type === 'number' ? Number(event.target.value) as FormState[typeof key] : event.target.value as FormState[typeof key])}
        className="mt-1.5 w-full rounded-xl border border-[#d9e1ed] px-3 py-3 font-semibold outline-none focus:border-[#4D148C]"
      />
    </label>
  );

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const result = await api.createGuestRequest({
        customer: { firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone },
        sender: { name: form.senderName, address: form.senderAddress, city: form.senderCity, country: form.senderCountry },
        recipient: { name: form.recipientName, address: form.recipientAddress, city: form.recipientCity, country: form.recipientCountry },
        packageInfo: { type:'Parcel', description:form.description, weight:Number(form.weight), length:Number(form.length), width:Number(form.width), height:Number(form.height), pieces:1, declaredValue:0 },
      });
      setRequest(result);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request could not be submitted.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7faff] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <button onClick={() => onNavigate('/')} className="font-black text-[#4D148C]">
          <ArrowLeft className="mr-1 inline h-4 w-4" /> Back
        </button>

        <div className="mt-7 rounded-[30px] border border-white bg-white p-6 shadow-[0_25px_70px_rgba(35,52,94,.12)] sm:p-9">
          <div className="flex flex-wrap gap-2 border-b border-[#edf0f5] pb-6">
            {['Details','Confirm','Calculator','Payment'].map((label, index) => (
              <span key={label} className={'rounded-full px-4 py-2 text-xs font-black ' + (index + 1 === step ? 'bg-[#4D148C] text-white' : 'bg-[#f1f4f9] text-[#77849d]')}>
                {index + 1} {label}
              </span>
            ))}
          </div>

          {error && <div className="mt-5 rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</div>}

          {step === 1 && (
            <form onSubmit={submit} className="mt-7 space-y-6">
              <div>
                <h1 className="text-3xl font-black text-[#14265e]">Request a shipment</h1>
                <p className="mt-2 text-sm font-semibold text-[#6f7c98]">No account is required. Submit the client and shipment details, review them, then continue to live production rates.</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {field('firstName','First name')}
                {field('lastName','Last name')}
                {field('email','Email','email')}
                {field('phone','Phone')}
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {(['sender','recipient'] as const).map(side => (
                  <div key={side} className="rounded-2xl border border-[#e1e7f0] bg-[#fbfcff] p-4">
                    <div className="mb-4 flex items-center gap-2 text-sm font-black text-[#17285e]">
                      <MapPin className="h-4 w-4 text-[#4D148C]" />
                      {side === 'sender' ? 'Sender' : 'Recipient'} details
                    </div>
                    <div className="space-y-3">
                      {field((side + 'Name') as keyof FormState, 'Name')}
                      {field((side + 'Address') as keyof FormState, 'Address')}
                      <div className="grid grid-cols-2 gap-2">
                        {field((side + 'City') as keyof FormState, 'City')}
                        {field((side + 'Country') as keyof FormState, 'Country')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-[#e1e7f0] p-4">
                <div className="mb-4 flex items-center gap-2 text-sm font-black text-[#17285e]">
                  <Package className="h-4 w-4 text-[#4D148C]" /> Package details
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {field('weight','Weight kg','number')}
                  {field('length','Length cm','number')}
                  {field('width','Width cm','number')}
                  {field('height','Height cm','number')}
                </div>
                <textarea required value={form.description} onChange={event => update('description', event.target.value)} placeholder="Package description" className="mt-3 min-h-24 w-full rounded-xl border border-[#d9e1ed] px-3 py-3 text-sm font-semibold" />
              </div>

              <button disabled={busy} className="rounded-2xl bg-gradient-to-r from-[#4D148C] to-[#7925dc] px-6 py-3.5 text-sm font-black text-white shadow-lg disabled:opacity-60">
                {busy ? 'Validating…' : 'Review details'} <ArrowRight className="ml-1 inline h-4 w-4" />
              </button>
            </form>
          )}

          {step === 2 && request && (
            <div className="mt-7 space-y-6">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-center gap-2 font-black text-emerald-800">
                  <CheckCircle2 className="h-5 w-5" /> Request received: {request.requestNumber}
                </div>
                <p className="mt-2 text-sm font-semibold text-emerald-900/80">
                  Required fields passed validation. Authenticity is not falsely marked as verified; operational review happens only after payment.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ['Customer', form.firstName + ' ' + form.lastName],
                  ['Contact', form.email + ' · ' + form.phone],
                  ['Route', form.senderCity + ', ' + form.senderCountry + ' → ' + form.recipientCity + ', ' + form.recipientCountry],
                  ['Package', form.weight + ' kg · ' + form.description],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-[#e1e7f0] p-4">
                    <div className="text-[10px] font-black uppercase text-[#7b879f]">{label}</div>
                    <div className="mt-1 text-sm font-black text-[#1c2f64]">{value}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setStep(1)} className="rounded-xl border border-[#d9e1ed] px-5 py-3 text-sm font-black">Edit details</button>
                <button onClick={() => onNavigate('/quote?request=' + encodeURIComponent(request.id))} className="rounded-xl bg-[#4D148C] px-5 py-3 text-sm font-black text-white">
                  Open shipping calculator <ArrowRight className="ml-1 inline h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-center gap-2 text-[10px] font-bold text-[#7a879e]">
          <ShieldCheck className="h-4 w-4 text-[#4D148C]" /> Payment is collected before operational review.
        </div>
      </div>
    </div>
  );
};
