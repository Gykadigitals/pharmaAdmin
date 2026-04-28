'use client';

import React from 'react';
import { colors } from '@/constant/colors';

interface SalesVsTargetProps {
  sales?: number;
  target?: number;
  percentage?: number;
}

const SalesVsTarget: React.FC<SalesVsTargetProps> = ({ 
  sales = 0, 
  target = 0, 
  percentage = 0 
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex-1">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-black text-slate-800">Sales vs Target</h3>
        <span className="text-[10px] font-black p-2 bg-emerald-50 text-emerald-600 rounded-lg uppercase tracking-widest">
           Overall Month-wise
        </span>
      </div>

      <div className="py-6 flex flex-col items-center justify-center">
        {/* Large Progress Circle or Bar */}
        <div className="relative w-full">
           <div className="flex justify-between items-end mb-4">
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Achievement</p>
               <h4 className="text-2xl font-black text-emerald-600">{formatCurrency(sales)}</h4>
             </div>
             <div className="text-right">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target</p>
               <h4 className="text-sm font-black text-slate-800">{formatCurrency(target)}</h4>
             </div>
           </div>
           
           <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 relative">
             <div 
               className="h-full bg-emerald-500 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(16,185,129,0.3)]"
               style={{ width: `${Math.min(percentage, 100)}%` }}
             />
           </div>
           
           <div className="flex justify-between mt-4">
              <span className="text-[10px] font-black text-slate-400 uppercase">Growth Rate</span>
              <span className="text-xl font-black text-slate-800">{percentage.toFixed(1)}%</span>
           </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 w-full">
           <div className="p-4 bg-slate-50 rounded-2xl">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending</p>
              <p className="text-sm font-black text-slate-700">{formatCurrency(Math.max(target - sales, 0))}</p>
           </div>
           <div className="p-4 bg-slate-50 rounded-2xl border-l-4 border-emerald-500">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
              <p className="text-sm font-black text-emerald-600">{percentage >= 100 ? 'Achieved' : 'On Track'}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SalesVsTarget;
