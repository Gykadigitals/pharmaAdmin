'use client';

import React from 'react';
import { colors } from '@/constant/colors';
import { MoreHorizontal } from 'lucide-react';

interface MonthlySalesTrendProps {
  data?: Array<{
    month: string;
    sales: number;
  }>;
}

const MonthlySalesTrend: React.FC<MonthlySalesTrendProps> = ({ data = [] }) => {
  const maxSales = Math.max(...data.map(d => d.sales), 1);

  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex-1">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-lg font-black text-slate-800">Monthly Sales Trend</h3>
        <button className="text-slate-400 hover:text-slate-600">
          <MoreHorizontal size={24} />
        </button>
      </div>

      <div className="flex items-end justify-between h-64 px-2">
        {data.length > 0 ? data.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-4 group">
            <div 
              className="w-10 rounded-xl transition-all duration-700 bg-indigo-600 shadow-lg shadow-indigo-100 group-hover:bg-indigo-500" 
              style={{ 
                height: `${(item.sales / maxSales) * 100}%`,
                minHeight: item.sales > 0 ? '4px' : '0px'
              }}
            />
            <span className="text-[10px] font-black text-slate-400 tracking-wider">
              {item.month.toUpperCase()}
            </span>
          </div>
        )) : (
          <div className="w-full flex items-center justify-center">
            <p className="text-sm font-bold text-slate-300">Trend data initializing...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlySalesTrend;
