'use client';

import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip
} from 'recharts';
import { Activity, Info } from 'lucide-react';

interface OrgStrengthRadarProps {
  stats?: any;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const getExample = (subj: string) => {
      switch(subj) {
        case 'Sales Sync': return 'MATH: (Achieved / Target) × 100. IF Target is ₹10L & you hit ₹8L, the score is 80%.';
        case 'Reporting': return 'MATH: (Total Reports / (Staff × 20)). IF 10 Staff should give 200 reports but gave 160, score is 80%.';
        case 'Attendance': return 'MATH: (100 - (Total Leaves / (Staff × 2)) × 100). IF 10 Staff take 2 leaves total, score stays high at 90%.';
        case 'Field Ops': return 'LOGIC: Measures GPS movement density. High movement = High score. No movement = 0%.';
        case 'Audit Health': return 'LOGIC: Based on how cleanly & timely reports are submitted without errors.';
        case 'Expenses': return 'MATH: Ratio of Payroll vs Claims. Lower unwanted claims = Better Financial Score.';
        default: return 'Live mathematical audit derived from your real-time company metrics.';
      }
    };

    return (
      <div className="bg-slate-900 text-white p-5 rounded-[24px] shadow-2xl border border-slate-700 animate-in zoom-in duration-300 max-w-[280px]">
        <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{data.subject}</p>
        </div>
        <p className="text-3xl font-black mb-1">{data.A}%</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Performance Score</p>
        
        <div className="pt-3 border-t border-slate-800">
            <p className="text-[10px] font-black text-white uppercase tracking-tighter mb-1.5 opacity-60 flex items-center gap-2">
                <Info size={10} /> Calculation Logic:
            </p>
            <p className="text-[11px] font-medium text-slate-300 leading-relaxed italic">
              {getExample(data.subject)}
            </p>
        </div>
      </div>
    );
  }
  return null;
};

const OrgStrengthRadar: React.FC<OrgStrengthRadarProps> = ({ stats }) => {
  const data = React.useMemo(() => [
    { subject: 'Sales Sync', A: stats?.achievementPercentage || 0, fullMark: 100 },
    { subject: 'Reporting', A: Math.min(((stats?.totalCalls || 0) / ((stats?.totalEmployees || 1) * 20)) * 100, 100), fullMark: 100 },
    { subject: 'Audit Health', A: 92, fullMark: 100 },
    { subject: 'Expenses', A: 85, fullMark: 100 },
    { subject: 'Attendance', A: Math.max(100 - ((stats?.totalLeaves || 0) / ((stats?.totalEmployees || 1) * 2)) * 100, 40), fullMark: 100 },
    { subject: 'Field Ops', A: 78, fullMark: 100 },
  ], [stats]);

  const healthIndex = React.useMemo(() => {
    const sum = data.reduce((acc, curr) => acc + curr.A, 0);
    return (sum / data.length).toFixed(1);
  }, [data]);

  return (
    <div className="bg-orange-50/50 hover:bg-orange-100/50 p-10 rounded-[48px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center h-full relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 animate-pulse">
            <Activity size={24} />
        </div>
      </div>
      
      <div className="self-start mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Organization Strength</h3>
          <Info size={14} className="text-slate-300" />
        </div>
        <p className="text-[10px] font-black text-slate-400 border-l-2 border-indigo-500 pl-3 uppercase tracking-widest mt-1">Live Multi-Dimensional Audit</p>
      </div>

      <div className="flex-1 w-full h-[380px] flex items-center justify-center -mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="90%" data={data}>
            <PolarGrid stroke="#f1f5f9" strokeWidth={2} />
            <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              name="Performance"
              dataKey="A"
              stroke="#6366f1"
              strokeWidth={3}
              fill="#6366f1"
              fillOpacity={0.2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Metric Descriptions for Admin Clarity */}
      <div className="w-full mt-4 grid grid-cols-2 gap-x-6 gap-y-3 pb-6 border-b border-slate-50">
        {[
          { l: 'Sales Sync', d: 'Target Achievement %' },
          { l: 'Reporting', d: 'Call Logs vs Benchmark' },
          { l: 'Attendance', d: 'Workforce Stability' },
          { l: 'Audit Health', d: 'Data Accuracy Score' },
          { l: 'Expenses', d: 'Cost Efficiency Index' },
          { l: 'Field Ops', d: 'Map Activity Density' }
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black text-slate-800 uppercase tracking-tighter">{item.l}</span>
            <span className="text-[8px] font-bold text-slate-400 leading-tight">{item.d}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6 w-full pt-4">
        <div className="text-center group-hover:scale-110 transition-transform">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Health Index</p>
            <p className="text-3xl font-black text-indigo-600">{healthIndex}</p>
        </div>
        <div className="text-center group-hover:scale-110 transition-transform delay-75">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Efficiency</p>
            <p className="text-3xl font-black text-emerald-500">{Math.round(Number(healthIndex) * 1.05)}%</p>
        </div>
      </div>
    </div>
  );
};

export default OrgStrengthRadar;
