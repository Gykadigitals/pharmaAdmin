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
  colorTheme?: 'blue' | 'emerald' | 'purple' | 'amber' | 'rose' | 'indigo' | 'cyan' | 'fuchsia';
}

const themeStyles = {
  blue: {
    cardBg: 'bg-blue-50/50 hover:bg-blue-100/50',
    iconBg: 'bg-blue-100 group-hover:bg-blue-600',
    iconText: 'text-blue-600 group-hover:text-white',
    indicator: 'bg-blue-600',
    valueText: 'group-hover:text-blue-700',
  },
  emerald: {
    cardBg: 'bg-emerald-50/50 hover:bg-emerald-100/50',
    iconBg: 'bg-emerald-100 group-hover:bg-emerald-600',
    iconText: 'text-emerald-600 group-hover:text-white',
    indicator: 'bg-emerald-600',
    valueText: 'group-hover:text-emerald-700',
  },
  purple: {
    cardBg: 'bg-purple-50/50 hover:bg-purple-100/50',
    iconBg: 'bg-purple-100 group-hover:bg-purple-600',
    iconText: 'text-purple-600 group-hover:text-white',
    indicator: 'bg-purple-600',
    valueText: 'group-hover:text-purple-700',
  },
  amber: {
    cardBg: 'bg-amber-50/50 hover:bg-amber-100/50',
    iconBg: 'bg-amber-100 group-hover:bg-amber-500',
    iconText: 'text-amber-600 group-hover:text-white',
    indicator: 'bg-amber-500',
    valueText: 'group-hover:text-amber-600',
  },
  rose: {
    cardBg: 'bg-rose-50/50 hover:bg-rose-100/50',
    iconBg: 'bg-rose-100 group-hover:bg-rose-600',
    iconText: 'text-rose-600 group-hover:text-white',
    indicator: 'bg-rose-600',
    valueText: 'group-hover:text-rose-700',
  },
  indigo: {
    cardBg: 'bg-indigo-50/50 hover:bg-indigo-100/50',
    iconBg: 'bg-indigo-100 group-hover:bg-indigo-600',
    iconText: 'text-indigo-600 group-hover:text-white',
    indicator: 'bg-indigo-600',
    valueText: 'group-hover:text-indigo-700',
  },
  cyan: {
    cardBg: 'bg-cyan-50/50 hover:bg-cyan-100/50',
    iconBg: 'bg-cyan-100 group-hover:bg-cyan-600',
    iconText: 'text-cyan-600 group-hover:text-white',
    indicator: 'bg-cyan-600',
    valueText: 'group-hover:text-cyan-700',
  },
  fuchsia: {
    cardBg: 'bg-fuchsia-50/50 hover:bg-fuchsia-100/50',
    iconBg: 'bg-fuchsia-100 group-hover:bg-fuchsia-600',
    iconText: 'text-fuchsia-600 group-hover:text-white',
    indicator: 'bg-fuchsia-600',
    valueText: 'group-hover:text-fuchsia-700',
  },
};

const MetricCard: React.FC<MetricCardProps> = ({ label, value, change, isPositive, icon: Icon, href, colorTheme = 'blue' }) => {
  const theme = themeStyles[colorTheme];

  const CardContent = (
    <div className={`${theme.cardBg} p-5 sm:p-7 rounded-[28px] sm:rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 group relative h-full ${href ? 'cursor-pointer' : ''}`}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div 
          className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors duration-300 ${theme.iconBg}`}
        >
          <Icon size={20} className={`sm:w-6 sm:h-6 transition-colors duration-300 ${theme.iconText}`} />
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
        <p className={`text-2xl sm:text-3xl font-black text-slate-900 tracking-tight transition-colors duration-300 ${theme.valueText}`}>
          {value}
        </p>
      </div>
      
      {/* Subtle indicator line */}
      <div className={`absolute bottom-0 left-8 right-8 h-1 ${theme.indicator} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-full opacity-50`} />
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
