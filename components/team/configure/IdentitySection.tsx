import React from 'react';
import { UserPlus, Mail, Lock } from 'lucide-react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface IdentitySectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export function IdentitySection({ register, errors }: IdentitySectionProps) {
  return (
    <section className="space-y-8">
      <div className="flex items-center gap-4 bg-slate-900 rounded-[32px] p-8 shadow-2xl transition-transform hover:scale-[1.01]">
        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <UserPlus size={28} className="text-white" />
        </div>
        <div>
          <h2 className="text-base md:text-xl font-black text-white tracking-tight">Master Identity</h2>
          <p className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest leading-none mt-1">User Access Credentials</p>
        </div>
      </div>

      <div className="bg-white rounded-[48px] border border-slate-100 shadow-xl shadow-slate-200/50 p-6 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        <div className="space-y-3 col-span-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Employee Full Name (As per Records)</label>
          <input
            {...register('fullName', { required: true })}
            placeholder="e.g. Erik Stevens"
            className={`w-full bg-white border outline-none rounded-[24px] px-8 py-5 text-sm font-bold text-slate-700 shadow-sm transition-all ${errors.fullName ? 'border-rose-300 ring-4 ring-rose-500/5' : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5'}`}
          />
          {errors.fullName && <p className="text-[9px] text-rose-500 font-bold uppercase tracking-wider ml-4">Required Field</p>}
        </div>
        
        <div className="space-y-3 col-span-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Official Employee ID / Code</label>
          <input
            {...register('empId', { required: true })}
            placeholder="e.g. EMP-2024-001"
            className={`w-full bg-slate-50 border outline-none rounded-[24px] px-8 py-5 text-sm font-black text-indigo-600 transition-all ${errors.empId ? 'border-rose-300' : 'border-slate-100 focus:ring-4 focus:ring-indigo-500/5'}`}
          />
          {errors.empId && <p className="text-[9px] text-rose-500 font-bold uppercase tracking-wider ml-4">Required Field</p>}
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Official Professional Designation</label>
          <input
            {...register('designation', { required: true })}
            placeholder="e.g. Regional Manager"
            className={`w-full bg-white border outline-none rounded-[24px] px-8 py-5 text-sm font-bold text-slate-700 shadow-sm transition-all ${errors.designation ? 'border-rose-300' : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5'}`}
          />
          {errors.designation && <p className="text-[9px] text-rose-500 font-bold uppercase tracking-wider ml-4">Required Field</p>}
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Secure Work Email</label>
          <div className="relative group">
            <Mail size={18} className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-rose-400' : 'text-slate-300 group-focus-within:text-indigo-500'}`} />
            <input
              {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
              placeholder="erik.s@hq.pharmacy"
              className={`w-full bg-white border outline-none rounded-[24px] px-16 py-5 text-sm font-bold text-slate-700 shadow-sm transition-all ${errors.email ? 'border-rose-300' : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5'}`}
            />
          </div>
          {errors.email && <p className="text-[9px] text-rose-500 font-bold uppercase tracking-wider ml-4">Valid Email Required</p>}
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Corporate Authentication (Password)</label>
          <div className="relative group">
            <Lock size={18} className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-rose-400' : 'text-slate-300 group-focus-within:text-indigo-500'}`} />
            <input
              type="password"
              {...register('password', { required: true, minLength: 6 })}
              placeholder="••••••••••••"
              className={`w-full bg-white border outline-none rounded-[24px] px-16 py-5 text-sm font-bold text-slate-700 shadow-sm transition-all ${errors.password ? 'border-rose-300' : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5'}`}
            />
          </div>
          {errors.password && <p className="text-[9px] text-rose-500 font-bold uppercase tracking-wider ml-4">Required (Min 6 Characters)</p>}
        </div>
      </div>
    </section>
  );
}
