'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ExpensesDonutChartProps {
  data?: Array<{
    label: string;
    value: number;
  }>;
  total?: number;
}

const ExpensesDonutChart: React.FC<ExpensesDonutChartProps> = ({ data = [], total = 0 }) => {
  const chartColors = ['#1d4ed8', '#0d9488', '#7c3aed', '#f59e0b', '#f43f5e'];

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
    return `₹${val}`;
  };

  // Prepare data for Recharts, ensuring non-zero values for segments
  const chartData = data.length > 0 ? data : [{ label: 'Empty', value: 1 }];
  const isEmpty = data.length === 0;

  return (
    <div className="bg-amber-50/50 hover:bg-amber-100/50 p-10 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center h-full min-h-[480px] relative group">
      <h3 className="text-xl font-black text-slate-800 self-start mb-6 text-center w-full">Expenses Distribution</h3>

      <div className="relative w-full h-64 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={85}
              outerRadius={105}
              paddingAngle={isEmpty ? 0 : 4}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={isEmpty ? '#f1f5f9' : chartColors[index % chartColors.length]}
                  className="outline-none"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <p className="text-3xl font-black text-slate-900 leading-none">{formatCurrency(total)}</p>
          <div className="h-px w-8 bg-slate-200 my-3 mx-auto" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Total Audit</p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-4 w-full">
        {!isEmpty ? data.map((cat, i) => (
          <div key={i} className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: chartColors[i % chartColors.length] }} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat.label?.toUpperCase()}</span>
            </div>
            <p className="text-xs font-black text-slate-900 pl-4.5">{formatCurrency(cat.value)}</p>
          </div>
        )) : (
          <div className="col-span-2 text-center py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">No expense records found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpensesDonutChart;
