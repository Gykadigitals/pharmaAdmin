'use client';

import React from 'react';
import Link from 'next/link';
import {
  Award,
  TrendingUp,
  PhoneCall,
  UserPlus
} from 'lucide-react';
import { colors } from '@/constant/colors';

interface TopPerformersProps {
  data?: Array<{
    name: string;
    sales: number;
    calls: number;
    avatar?: string;
  }>;
}

const TopPerformers: React.FC<TopPerformersProps> = ({ data = [] }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex-1">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-lg font-black text-slate-800">Top Performers</h3>
        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
          <Award size={18} />
        </div>
      </div>

      <div className="space-y-6">
        {data.length > 0 ? data.map((performer, i) => (
          <Link 
            key={performer.id || performer.employeeId || i} 
            href={`/analytics/personnel?id=${performer.id || performer.employeeId}`}
            className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-2 rounded-2xl transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-14 h-14 rounded-full border-2 border-white shadow-md flex items-center justify-center bg-slate-100 overflow-hidden`}>
                  {performer.avatar ? (
                    <img src={IMAGE_BASE_URL + performer.avatar} alt={performer.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                      <span className="text-slate-400 font-black text-xs">{performer.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div
                  className={`absolute -top-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm ${i === 0 ? 'bg-amber-400 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                >
                  {i + 1}
                </div>
              </div>
              <div>
                <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {performer.name}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                    {formatCurrency(performer.sales)}
                  </p>
                  <div className="w-1 h-1 bg-slate-300 rounded-full" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {performer.calls} Calls
                  </p>
                </div>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-white transition-colors">
              <TrendingUp size={18} className={i === 0 ? 'text-amber-500' : 'text-slate-400'} />
            </div>
          </Link>
        )) : (
          <div className="py-12 text-center">
            <p className="text-sm font-bold text-slate-400">No performance data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopPerformers;
