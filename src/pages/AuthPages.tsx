import React, { useEffect, useState } from 'react';
import { User, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Loader2, KeyRound } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';
import { setCurrentUser } from '../lib/store';

interface AuthPageProps {
  mode: 'login' | 'register';
  onNavigate: (path: string) => void;
}

const readableAuthError = (error: unknown): string => {
  const message = error instanceof Error ? error.message : '';
  if (/invalid login credentials/i.test(message)) return 'The email address or password is incorrect.';
  if (/already registered|already exists/i.test(message)) return 'An account already exists with this email address.';
  if (/password/i.test(message) && /characters|weak/i.test(message)) return 'Choose a stronger password. Use at least 8 characters.';
  if (/invalid.*email/i.test(message)) return 'Enter a valid email address.';
  if (/rate limit|too many/i.test(message)) return 'Too many attempts. Please wait and try again.';
  return message || 'Authentication could not be completed. Please try again.';
};

export const AuthPages: React.FC<AuthPageProps> = ({ mode, onNavigate }) => {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setIsLogin(mode === 'login');
    setError('');
    setMessage('');
  }, [mode]);

  const finishAuthentication = async () => {
    const profile = await api.me();
    const role = profile?.admin === true ? 'admin' : 'customer';
    const user = (profile as any)?.profile;
    setCurrentUser({
      id: profile.uid,
      firstName: user?.firstName || firstName.trim(),
      lastName: user?.lastName || lastName.trim(),
      email: profile.email || email.trim(),
      phone: user?.phone || '',
      role,
      country: user?.country || '',
      status: user?.status || 'active',
      createdAt: user?.createdAt || new Date().toISOString(),
    });
    onNavigate(role === 'admin' ? '/admin' : '/dashboard');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setBusy(true);
    try {
      if (isLogin) {
        const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (authError) throw authError;
      } else {
        if (password.length < 8) {
          setError('Choose a password with at least 8 characters.');
          return;
        }
        const displayName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
        const { error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { first_name: firstName.trim(), last_name: lastName.trim(), display_name: displayName } },
        });
        if (authError) throw authError;
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          setMessage('Account created. Check your email to confirm your address before signing in.');
          return;
        }
      }
      await finishAuthentication();
    } catch (authError) {
      setError(readableAuthError(authError));
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async () => {
    setError('');
    setMessage('');
    if (!email.trim()) {
      setError('Enter your email address first.');
      return;
    }
    setBusy(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin + '/login',
      });
      if (resetError) throw resetError;
      setMessage('If an account exists for this address, Supabase has sent the password-reset email.');
    } catch (authError) {
      setError(readableAuthError(authError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-md">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-6 sm:p-8">
          <div className="flex justify-center mb-7"><button type="button" onClick={() => onNavigate('/')}><Logo /></button></div>
          <div className="text-center mb-7">
            <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-[#4D148C]/10 flex items-center justify-center">
              {isLogin ? <ShieldCheck className="w-6 h-6 text-[#4D148C]" /> : <User className="w-6 h-6 text-[#4D148C]" />}
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">{isLogin ? 'Sign in to your account' : 'Create your account'}</h1>
            <p className="text-sm text-slate-500 mt-2">{isLogin ? 'Use your registered credentials to access the customer portal.' : 'Create a real account protected by Supabase Auth.'}</p>
          </div>
          {error && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 flex gap-2"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{error}</span></div>}
          {message && <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && <div className="grid grid-cols-2 gap-3">
              <label className="block"><span className="text-xs font-bold text-slate-700">First name</span><input required value={firstName} onChange={e=>setFirstName(e.target.value)} autoComplete="given-name" className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-[#4D148C] focus:ring-2 focus:ring-[#4D148C]/10" /></label>
              <label className="block"><span className="text-xs font-bold text-slate-700">Last name</span><input required value={lastName} onChange={e=>setLastName(e.target.value)} autoComplete="family-name" className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-[#4D148C] focus:ring-2 focus:ring-[#4D148C]/10" /></label>
            </div>}
            <label className="block"><span className="text-xs font-bold text-slate-700">Email address</span><div className="relative mt-1.5"><Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" /><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" className="w-full rounded-xl border border-slate-300 pl-10 pr-3 py-3 text-sm outline-none focus:border-[#4D148C] focus:ring-2 focus:ring-[#4D148C]/10" /></div></label>
            <label className="block"><span className="text-xs font-bold text-slate-700">Password</span><div className="relative mt-1.5"><Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" /><input required type="password" value={password} onChange={e=>setPassword(e.target.value)} minLength={8} autoComplete={isLogin?'current-password':'new-password'} className="w-full rounded-xl border border-slate-300 pl-10 pr-3 py-3 text-sm outline-none focus:border-[#4D148C] focus:ring-2 focus:ring-[#4D148C]/10" /></div></label>
            <button type="submit" disabled={busy} className="w-full rounded-xl bg-[#4D148C] hover:bg-[#3c0f70] disabled:opacity-60 text-white py-3.5 font-bold text-sm flex items-center justify-center gap-2 transition-colors">
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}{isLogin ? 'Sign in' : 'Create account'}
            </button>
          </form>
          {isLogin && <button type="button" onClick={handleReset} disabled={busy} className="mt-4 w-full text-sm font-semibold text-slate-600 hover:text-[#4D148C] flex items-center justify-center gap-2"><KeyRound className="w-4 h-4" />Forgot password?</button>}
          <div className="mt-7 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">{isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button type="button" onClick={()=>{setIsLogin(!isLogin);setError('');setMessage('');}} className="font-bold text-[#4D148C] hover:underline">{isLogin?'Create one':'Sign in'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};
