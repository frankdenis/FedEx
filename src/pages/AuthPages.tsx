import React, { useState } from 'react';
import {
  User,
  Lock,
  Mail,
  Building,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { setCurrentUser, getUsers } from '../lib/store';

interface AuthPageProps {
  mode: 'login' | 'register';
  onNavigate: (path: string) => void;
}

export const AuthPages: React.FC<AuthPageProps> = ({ mode, onNavigate }) => {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<'personal' | 'business'>('business');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const users = getUsers();

  const handleOneClickLogin = (role: 'customer' | 'admin') => {
    const targetUser = users.find(u => u.role === role) || users[0];
    setCurrentUser(targetUser);
    if (role === 'admin') {
      onNavigate('/admin');
    } else {
      onNavigate('/dashboard');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Find matching user or fallback to demo
      const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setCurrentUser(found);
        onNavigate(found.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        // Log in as simulated user
        const newUser = {
          id: `usr_${Date.now()}`,
          firstName: email.split('@')[0] || 'Member',
          lastName: '',
          email,
          phone: '+1 (555) 019-2834',
          country: 'United States',
          status: 'active' as const,
          createdAt: new Date().toISOString().substring(0, 10),
          role: 'customer' as const,
          company: 'FedEx Enterprise Client',
        };
        setCurrentUser(newUser);
        onNavigate('/dashboard');
      }
    } else {
      // Registration
      if (!email || !firstName) {
        setError('Please fill in all required fields.');
        return;
      }
      const newUser = {
        id: `usr_${Date.now()}`,
        firstName,
        lastName,
        email,
        company: accountType === 'business' ? company || 'FedEx Corporate Account' : undefined,
        phone: phone || '+1 (555) 019-2834',
        country: 'United States',
        status: 'active' as const,
        createdAt: new Date().toISOString().substring(0, 10),
        role: 'customer' as const,
      };
      setCurrentUser(newUser);
      onNavigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        {/* Top Brand Logo */}
        <div className="text-center flex flex-col items-center">
          <Logo size="md" serviceVariant="Express" />
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-4 font-display">
            {isLogin ? 'Sign In to FedEx Portal' : 'Create FedEx Account'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isLogin
              ? 'Access real-time parcel telemetry, invoices, and address directory.'
              : 'Unlock volume air freight rates and automated label generation.'}
          </p>
        </div>

        {/* Quick Portal Switcher */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block text-center">
            ⚡ Quick Portal Access
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleOneClickLogin('customer')}
              className="p-2 rounded-xl bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-slate-800 text-xs font-semibold text-center transition-all shadow-2xs"
            >
              <div className="font-bold text-slate-900">Sarah Jenkins</div>
              <div className="text-[10px] text-[#4D148C] font-medium">Shipper Account</div>
            </button>

            <button
              type="button"
              onClick={() => handleOneClickLogin('admin')}
              className="p-2 rounded-xl bg-white hover:bg-orange-50 border border-slate-200 hover:border-[#FF6600]/40 text-slate-800 text-xs font-semibold text-center transition-all shadow-2xs"
            >
              <div className="font-bold text-slate-900 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#FF6600]" /> Alexander
              </div>
              <div className="text-[10px] text-[#FF6600] font-medium">Flight Ops Dispatch</div>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2 border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAccountType('personal')}
                  className={`p-2 rounded-xl border font-bold ${
                    accountType === 'personal' ? 'bg-purple-50 border-[#4D148C] text-[#4D148C]' : 'border-slate-200 text-slate-700'
                  }`}
                >
                  Personal
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('business')}
                  className={`p-2 rounded-xl border font-bold ${
                    accountType === 'business' ? 'bg-purple-50 border-[#4D148C] text-[#4D148C]' : 'border-slate-200 text-slate-700'
                  }`}
                >
                  Business / B2B
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {accountType === 'business' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. Apex BioHealth Logistics"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Work or Personal Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-slate-700">Password *</label>
              {isLogin && (
                <button
                  type="button"
                  onClick={() => alert('Password reset link simulated to your email.')}
                  className="text-[11px] text-[#4D148C] hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#FF6600] hover:bg-[#E55C00] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-1.5 mt-2"
          >
            {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          {isLogin ? (
            <span>
              Don't have a FedEx account?{' '}
              <button
                onClick={() => setIsLogin(false)}
                className="font-bold text-[#4D148C] hover:underline"
              >
                Sign Up Now
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => setIsLogin(true)}
                className="font-bold text-[#4D148C] hover:underline"
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
