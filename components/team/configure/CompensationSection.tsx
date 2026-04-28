import React from 'react';
// 🛡️ Local SVG Icon Components for stability
const CircleDollarSign = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><line x1="12" y1="18" x2="12" y2="20"></line><line x1="12" y1="4" x2="12" y2="6"></line></svg>
);
const Calendar = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);
const ChevronDown = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9"></polyline></svg>
);
const ChevronUp = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="18 15 12 9 6 15"></polyline></svg>
);
const Plus = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const Trash2 = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);
const DollarSign = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
);
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface SalaryRevision {
  id: number;
  effectiveFrom: string;
  label: string;
  designation?: string;
  components: { id: number; label: string; value: number; }[];
}

interface CompensationSectionProps {
  salaryRevisions: SalaryRevision[];
  expandedRevision: number;
  setExpandedRevision: (id: number) => void;
  updateSalaryComp: (revId: number, compId: number, val: number) => void;
  addSalaryComponent: () => void;
  removeSalaryComponent: (compId: number) => void;
  addSalaryRevision: () => void;
  newCompLabel: string;
  setNewCompLabel: (v: string) => void;
  newCompValue: string;
  setNewCompValue: (v: string) => void;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export function CompensationSection({
  salaryRevisions,
  expandedRevision,
  setExpandedRevision,
  updateSalaryComp,
  addSalaryComponent,
  removeSalaryComponent,
  addSalaryRevision,
  newCompLabel,
  setNewCompLabel,
  newCompValue,
  setNewCompValue,
  register,
  errors
}: CompensationSectionProps) {
  return (
    <section className="space-y-8 border-t border-slate-50 pt-16">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
            <CircleDollarSign size={24} />
          </div>
          <h2 className="text-sm md:text-xl font-black text-slate-900 tracking-tight uppercase tracking-widest">Compensation Management</h2>
        </div>
        <button
          onClick={addSalaryRevision}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={14} /> New Revision
        </button>
      </div>

      <div className="space-y-6">
        {salaryRevisions.map((rev) => (
          <div key={rev.id} className={`bg-white rounded-[40px] border transition-all duration-500 overflow-hidden ${expandedRevision === rev.id ? 'border-emerald-200 shadow-2xl shadow-emerald-500/5 ring-8 ring-emerald-500/[0.02]' : 'border-slate-100 opacity-60 hover:opacity-100 hover:border-slate-200'}`}>
            <div
              onClick={() => setExpandedRevision(rev.id)}
              className="px-6 md:px-10 py-6 md:py-8 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer group gap-6 sm:gap-0"
            >
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${expandedRevision === rev.id ? 'bg-emerald-600 text-white rotate-12' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                  <Calendar size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">{rev.label}</h4>
                  <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-extra-widest">Effective: {rev.effectiveFrom}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Cost-to-Company</p>
                  <p className="text-lg font-black text-emerald-600 tracking-tight">₹{rev.components.reduce((a, c) => a + c.value, 0).toLocaleString()}</p>
                </div>
                {expandedRevision === rev.id ? <ChevronUp size={20} className="text-emerald-500" /> : <ChevronDown size={20} className="text-slate-300" />}
              </div>
            </div>

            {expandedRevision === rev.id && (
              <div className="px-10 pb-10 space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="bg-slate-50/50 rounded-[32px] p-8 space-y-8 border border-slate-100/50">
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Daily TA/DA Allowance</label>
                      <div className="relative group">
                        <DollarSign size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-emerald-500 transition-colors" />
                        <input
                          type="number"
                          {...register('dailyAllowance', { required: true, min: 0 })}
                          placeholder="250"
                          className="w-full bg-white border border-slate-200 outline-none rounded-[24px] px-16 py-5 text-sm font-bold text-slate-700 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                        />
                      </div>
                      {errors.dailyAllowance && <p className="text-[9px] text-rose-500 font-bold uppercase tracking-wider ml-4">Required Field</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pt-8 border-t border-slate-100/50">
                    {rev.components.map((comp) => (
                      <div key={comp.id} className="space-y-3 animate-in fade-in duration-300">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 font-bold">{comp.label}</label>
                        <div className="relative group">
                          <DollarSign size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                          <input
                            type="number"
                            value={comp.value || ''}
                            placeholder="0"
                            onChange={e => updateSalaryComp(rev.id, comp.id, parseInt(e.target.value) || 0)}
                            className="w-full bg-white border border-slate-200 outline-none rounded-2xl px-12 py-4 text-sm font-black text-slate-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-sm"
                          />
                          {!['Basic Salary', 'House Rent Allowance (HRA)', 'Provident Fund (PF)'].includes(comp.label) && (
                            <button
                              onClick={() => removeSalaryComponent(comp.id)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}


                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
