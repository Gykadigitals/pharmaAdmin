'use client';

import React from 'react';
import { 
  Download, 
  CircleDollarSign, 
  UserSquare, 
  FileStack 
} from 'lucide-react';
import { colors } from '@/constant/colors';

interface ReportGeneratorProps {
  onDownload?: (type: string) => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ onDownload }) => {
  const reports = [
    { id: 'sales', label: 'Sales Achievement', icon: CircleDollarSign, primary: true },
    { id: 'activity', label: 'Employee Activity', icon: UserSquare, primary: false },
    { id: 'expense', label: 'Expense Statements', icon: FileStack, primary: false },
  ];

  return (
    <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-start w-full h-full">
      <h3 className="text-xl font-black text-slate-800 mb-10">Generate Reports</h3>
      
      <div className="space-y-4 w-full">
        {reports.map((report, i) => {
          const Icon = report.icon;
          return (
            <button 
              key={i} 
              onClick={() => onDownload?.(report.id)}
              className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all duration-300 group ${
                report.primary 
                  ? 'bg-[#172554] text-white shadow-xl shadow-indigo-200 hover:bg-slate-900 hover:scale-[1.02]' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-[1.02]'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${report.primary ? 'bg-white/10' : 'bg-slate-200 text-slate-500'}`}>
                  <Icon size={22} />
                </div>
                <span className="text-sm font-black tracking-tight">{report.label}</span>
              </div>
              <Download size={20} className={report.primary ? 'text-white/70' : 'text-slate-400'} />
            </button>
          );
        })}
      </div>
      
      <p className="mt-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-full">
        Standard Excel (XLSX) Format
      </p>
    </div>
  );
};

export default ReportGenerator;
