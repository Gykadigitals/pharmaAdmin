'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface CompensationDonutChartProps {
  data?: Array<{
    label: string;
    value: number;
  }>;
  total?: number;
  month?: string;
}

const CompensationDonutChart: React.FC<CompensationDonutChartProps> = ({
  data = [
    { label: 'Basic Salary', value: 450000 },
    { label: 'Allowances', value: 120000 },
    { label: 'Bonus', value: 35000 },
    { label: 'Deductions/PF', value: 45000 }
  ],
  total = 650000,
  month
}) => {
  const chartColors = ['#10b981', '#3b82f6', '#f59e0b', '#f43f5e'];
  const currentMonth = month || new Date().toLocaleString('default', { month: 'short', year: 'numeric' }).toUpperCase();

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
    return `₹${val}`;
  };

  return (
    <div className="bg-purple-50/50 hover:bg-purple-100/50 p-10 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center h-full min-h-[480px] relative group">
      <div className="w-full flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Payroll Distribution</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Compensations Breakdown</p>
        </div>

      </div>

      <div className="relative w-full h-64 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={85}
              outerRadius={105}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartColors[index % chartColors.length]}
                  className="outline-none"
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <p className="text-3xl font-black text-slate-900 leading-none">{formatCurrency(total)}</p>
          <div className="h-px w-8 bg-slate-200 my-3 mx-auto" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Net Payout</p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-4 w-full">
        {data.map((cat, i) => (
          <div key={i} className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: chartColors[i % chartColors.length] }} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat.label}</span>
            </div>
            <p className="text-xs font-black text-slate-900 pl-4.5">{formatCurrency(cat.value)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompensationDonutChart;
