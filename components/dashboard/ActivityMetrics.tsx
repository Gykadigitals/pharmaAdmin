'use client';

import React from 'react';
import { Map, Users2, Plane, FileText } from 'lucide-react';
import { colors } from '@/constant/colors';

interface ActivityMetricsProps {
  data?: Array<{
    label: string;
    value: number;
    utilization: string;
  }>;
}

const ActivityMetrics: React.FC<ActivityMetricsProps> = ({ data = [] }) => {
  const icons = [Map, Users2, Plane, FileText];
  const colorsList = [
    { color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { color: 'text-rose-600', bgColor: 'bg-rose-50' },
  ];

  return (
    <div className="bg-sky-50/50 hover:bg-sky-100/50 p-10 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 flex flex-col flex-1 h-full relative group">
      <h3 className="text-xl font-black text-slate-800 mb-10">Employee Activity Metrics</h3>

      <div className="space-y-6 flex-1 flex flex-col justify-start">
        {data.length > 0 ? data.map((item, i) => {
          const Icon = icons[i % icons.length];
          const style = colorsList[i % colorsList.length];
          const getExample = (label: string) => {
            switch((label || '').toUpperCase()) {
              case 'MEETING': return 'LOGIC: (Logged Meetings / Staff). IF you have 10 Staff and they log 2 meetings total, Utilization is 20%.';
              case 'FIELD': return 'MATH: (GPS Points Active / Staff). IF your team is moving for 4 hours of an 8-hour shift, score is 50%.';
              case 'PLANE':
              case 'TRAVEL': return 'LOGIC: Measures travel footprint. Higher claims for distant work = Higher Travel Score.';
              case 'REPORTS':
              case 'OFFICE': return 'MATH: (Daily Logs / Business Days). IF staff submits 4 logs in a 5-day week, score is 80%.';
              default: return 'Mathematical audit of active personnel tasks and regional presence.';
            }
          };

          return (
            <div key={i} className="flex relative items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm group hover:scale-[1.02] transition-all cursor-pointer overflow-hidden">
              {/* Hover Insight Overlay */}
              <div className="absolute inset-0 bg-slate-900 text-white flex items-center px-8 translate-x-full group-hover:translate-x-0 transition-transform duration-500 z-10">
                <p className="text-[11px] font-medium text-slate-300 leading-relaxed italic">
                  <span className="text-indigo-400 font-black block mb-1.5 uppercase tracking-[0.15em] text-[10px]">Audit Intelligence:</span>
                  {getExample(item.label)}
                </p>
              </div>

              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl ${style.bgColor} flex items-center justify-center ${style.color} group-hover:scale-110 transition-transform`}>
                  <Icon size={28} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800">{item.label}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    {item.utilization}% UTILIZATION
                  </p>
                </div>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-3xl font-black text-slate-900">{item.value}</span>
                <span className="text-xs font-black text-slate-400">acts</span>
              </div>
            </div>
          );
        }) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Map size={32} className="text-slate-200" />
            </div>
            <p className="text-sm font-bold text-slate-400">No activity logs found for this period</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityMetrics;
