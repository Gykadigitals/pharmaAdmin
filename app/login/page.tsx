'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ENDPOINTS, IMAGE_BASE_URL } from '@/constant/api';
import {
  Shield,
  Globe,
  Key,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  ChevronLeft,
  LayoutDashboard
} from 'lucide-react';

export default function LoginPage() {
  const { login, setCompanyData, company, isLoading: isAuthLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempCompany, setTempCompany] = useState<any>(null);

  // Step 1 Form
  const [webUrl, setWebUrl] = useState('');
  const [accessKey, setAccessKey] = useState('');

  // Step 2 Form
  const [identifier, setIdentifier] = useState('');
  const [secret, setSecret] = useState('');
  const [password, setPassword] = useState('');
  // Step 3 Form (2FA)
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [loginResponse, setLoginResponse] = useState<any>(null);

  // Check for saved company on mount
  useEffect(() => {
    if (company) {
      setTempCompany(company);
      setIdentifier(company.code);
      setStep(2);
    }
  }, [company]);



  const handleValidateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🌐 [AUTH] Initiating Tenant Validation for:', webUrl);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(ENDPOINTS.AUTH.VALIDATE_TENANT, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ webUrl, accessKey }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Invalid Workspace Credentials');
      }

      setTempCompany(result.data);
      setIdentifier(result.data.code);
      setCompanyData(result.data);
      console.log('✅ [AUTH] Workspace Connected:', result.data.name);
      setStep(2);
    } catch (err: any) {
      console.error('❌ [AUTH] Validation Error:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔐 [AUTH] Attempting Login for ID:', secret);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          identifier,
          secret,
          password
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Invalid Credentials or Unauthorized Role');
      }

      // Success: Instead of logging in immediately, move to 2FA step for security
      setLoginResponse(result);
      const email = result?.user?.email || result?.data?.user?.email;

      console.log('🛡️ [AUTH] Credentials OK. Sending Security Code to:', email);

      // Trigger the actual email send from the backend
      try {
        await fetch(ENDPOINTS.AUTH.SEND_LOGIN_OTP, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({ email }),
        });
        console.log('✉️ [AUTH] OTP Email Dispatched Successfully.');
      } catch (e) {
        console.warn('⚠️ [AUTH] OTP Send failed, but proceeding to manual entry...');
      }

      setStep(3);
      setResendTimer(30);
    } catch (err: any) {
      console.error('❌ [AUTH] Login Failed:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError('Please enter the full 6-digit verification code');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🛡️ [AUTH] Verifying security code...');

      // Call the actual backend verification API
      const email = loginResponse?.user?.email || loginResponse?.data?.user?.email;
      const response = await fetch(ENDPOINTS.AUTH.VERIFY_OTP, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Invalid verification code');
      }

      console.log('✅ [AUTH] 2FA Success. Synchronizing Session...');
      const finalUser = loginResponse?.user || loginResponse?.data?.user;
      const finalToken = loginResponse?.token || loginResponse?.data?.token;
      const finalStats = loginResponse?.stats || loginResponse?.data?.stats;

      login(finalToken, finalUser, tempCompany, finalStats);
    } catch (err: any) {
      console.error('❌ [AUTH] 2FA Failed:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    const cleanValue = value.replace(/[^0-9]/g, '');
    if (!cleanValue && value !== '') return;

    const newOtp = [...otp];
    // Handle paste or multi-character input
    if (cleanValue.length > 1) {
      const chars = cleanValue.split('').slice(0, 6 - index);
      chars.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(index + chars.length, 5);
      document.getElementById(`otp-${nextIdx}`)?.focus();
    } else {
      newOtp[index] = cleanValue;
      setOtp(newOtp);
      if (cleanValue && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // We no longer block the whole page on isAuthLoading to prevent hangs.
  // AuthContext handles the redirect if already logged in.

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 selection:bg-blue-500/30 font-sans">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-[440px] z-10">
        {/* Branding */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-6">
            <LayoutDashboard className="text-white w-9 h-9" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Finch Axis <span className="text-blue-500">Admin</span></h1>
          <p className="text-slate-400 font-medium mt-2">Enterprise Resource Management</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 sm:p-10 shadow-2xl overflow-hidden relative">

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
              <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={18} />
              <p className="text-xs font-bold text-rose-200 leading-relaxed">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-black text-white">Connect Workspace</h2>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">Protect your environment by connecting your organization's unique workspace.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Workspace URL</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                      <Globe size={18} />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. ethereal.pharma.site"
                      required
                      value={webUrl}
                      onChange={(e) => setWebUrl(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 outline-none rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder:text-slate-600 font-bold transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secret Key</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                      <Shield size={18} />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. XXXX-XXXX-XXXX"
                      required
                      value={accessKey}
                      onChange={(e) => setAccessKey(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 outline-none rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder:text-slate-600 font-bold transition-all uppercase"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleValidateTenant}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>Continue <ArrowRight size={20} /></>
                )}
              </button>
            </form>
          ) : step === 2 ? (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              <div className="flex flex-col items-center mb-4">
                <div className="w-20 h-20 bg-white border border-slate-100 rounded-3xl p-1 shadow-inner relative group mb-4">
                  {tempCompany?.logoUrl ? (
                    <img src={IMAGE_BASE_URL + tempCompany.logoUrl} className="w-full h-full object-contain p-2" alt="Logo" />
                  ) : (
                    <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-black text-2xl rounded-2xl">
                      {tempCompany?.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-black text-white">{tempCompany?.name}</h2>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[10px] text-blue-500 font-bold uppercase tracking-widest hover:underline mt-1"
                  >
                    Not your workspace? Change
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Company Code</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                      <LayoutDashboard size={18} />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter Company Code"
                      required
                      value={identifier}
                      readOnly
                      className="w-full bg-white/5 border border-white/10 opacity-70 outline-none rounded-2xl pl-11 pr-4 py-3.5 text-white font-bold transition-all uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Employee Code</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                      <Key size={18} />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter Employee Code"
                      required
                      value={secret}
                      onChange={(e) => setSecret(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 outline-none rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder:text-slate-600 font-bold transition-all uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      placeholder="Enter Your Password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 outline-none rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder:text-slate-600 font-bold transition-all"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>Sign In <ArrowRight size={20} /></>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8 animate-in slide-in-from-right-8 duration-500">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors"
              >
                <ChevronLeft size={14} /> Back to Sign In
              </button>

              <div className="space-y-2 text-center">
                <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500 mx-auto mb-4">
                  <Mail size={32} className="animate-pulse" />
                </div>
                <h2 className="text-xl font-black text-white">Email Verification</h2>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                  We've sent a 6-digit security code to your registered email: <br />
                  <span className="text-blue-500 font-bold lowercase">
                    {(() => {
                      const email = loginResponse?.user?.email || loginResponse?.data?.user?.email || '';
                      if (!email) return 'your email';
                      const [name, domain] = email.split('@');
                      return `${name.slice(0, 2)}••••@${domain}`;
                    })()}
                  </span>
                </p>
              </div>

              <div className="flex gap-2 justify-center">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 bg-white/5 border border-white/10 focus:border-blue-500/50 outline-none rounded-xl text-center text-xl font-black text-white transition-all focus:bg-white/10"
                  />
                ))}
              </div>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>Verify & Access <ArrowRight size={20} /></>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    disabled={resendTimer > 0}
                    onClick={async () => {
                      const email = loginResponse?.user?.email || loginResponse?.data?.user?.email;
                      console.log('🔄 [AUTH] Resending Code to:', email);
                      setResendTimer(30);
                      await fetch(ENDPOINTS.AUTH.SEND_LOGIN_OTP, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email }),
                      });
                    }}
                    className={`text-[10px] font-black uppercase tracking-widest transition-colors ${resendTimer > 0 ? 'text-slate-600 cursor-not-allowed' : 'text-blue-500 hover:text-blue-400'}`}
                  >
                    Resend Code {resendTimer > 0 && `(${resendTimer}s)`}
                  </button>
                </div>
              </div>
            </form>
          )}



          {/* Footer Heartbeat */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 flex bg-white/5 overflow-hidden">
            <div className="flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent animate-shimmer" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Online</span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
            &copy; 2026 Finch Axis
          </p>
        </div>
      </div>
    </div>
  );
}
