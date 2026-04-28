'use client';

import React from 'react';
import { 
  Users, 
  UserCheck, 
  PhoneCall, 
  UserPlus, 
  CircleDollarSign, 
  Target, 
  PieChart, 
  FileText,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import Link from 'next/link';
import { colors } from '@/constant/colors';

interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
  href?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, change, isPositive, icon: Icon, href }) => {
  const CardContent = (
    <div className={`bg-white p-5 sm:p-7 rounded-[28px] sm:rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group relative h-full ${href ? 'cursor-pointer' : ''}`}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div 
          className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center bg-slate-50 group-hover:bg-[#172554]/5 transition-colors duration-500"
        >
          <Icon size={20} className="text-[#172554] sm:w-6 sm:h-6" />
        </div>
        <div 
          className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black flex items-center gap-1 sm:gap-1.5 ${
            isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}
        >
          {change}
          {isPositive ? <ArrowUpRight size={12} className="sm:w-3.5 sm:h-3.5" /> : <ArrowDownRight size={12} className="sm:w-3.5 sm:h-3.5" />}
        </div>
      </div>
      <div className="space-y-0.5 sm:space-y-1">
        <h3 className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] sm:tracking-[0.2em]">{label}</h3>
        <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight transition-colors group-hover:text-[#172554]">
          {value}
        </p>
      </div>
      
      {/* Subtle indicator line */}
      <div className="absolute bottom-0 left-8 right-8 h-1 bg-[#172554] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-full opacity-50" />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block no-underline">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
};

export default MetricCard;
