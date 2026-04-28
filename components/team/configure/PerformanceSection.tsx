import React from 'react';
// 🛡️ Local SVG Icon Components for stability
const Zap = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);
const Plus = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

interface MonthTarget { [month: string]: string; }
interface YearTarget { year: string; targets: MonthTarget; }

interface PerformanceSectionProps {
  yearTargets: YearTarget[];
  activeTargetYear: number;
  setActiveTargetYear: (idx: number) => void;
  updateMonthTarget: (yearIdx: number, month: string, val: string) => void;
  addNewYear: () => void;
  MONTHS_SHORT: string[];
}

export function PerformanceSection({
  yearTargets,
  activeTargetYear,
  setActiveTargetYear,
  updateMonthTarget,
  addNewYear,
  MONTHS_SHORT
}: PerformanceSectionProps) {
  return (
    <section className="space-y-10 border-t border-slate-50 pt-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 text-white">
            <Zap size={24} />
          </div>
          <h2 className="text-sm md:text-xl font-black text-slate-900 tracking-tight uppercase tracking-widest leading-none">Performance Projection</h2>
        </div>
        <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          {yearTargets.map((yt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTargetYear(idx)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTargetYear === idx ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {yt.year}
            </button>
          ))}
          <button
            type="button"
            onClick={addNewYear}
            className="px-4 py-2.5 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 rounded-xl transition-all"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="bg-slate-50/50 rounded-[48px] p-6 md:p-12 border border-slate-100/50 animate-in fade-in zoom-in-95 duration-500">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {MONTHS_SHORT.map((month) => (
            <div key={month} className="space-y-3 bg-white p-6 rounded-[32px] border border-amber-200 shadow-xl shadow-amber-500/[0.03] transition-all hover:border-amber-400 hover:shadow-amber-500/10 group">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none">{month}</label>
                <div className="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-500/20" />
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={yearTargets[activeTargetYear].targets[month]}
                  onChange={e => updateMonthTarget(activeTargetYear, month, e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-50/50 border-none outline-none rounded-xl px-4 py-3 text-sm font-black text-slate-700 focus:bg-amber-50/50 transition-all text-center"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
