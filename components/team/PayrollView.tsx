'use client';

import React, { useState } from 'react';
// 🛡️ Local SVG Icon Components to prevent Lucide-React Bundler Crashes
const Plane = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"></path></svg>
);
const Utensils = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path></svg>
);
const TrendingUp = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);
const ChevronDown = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9"></polyline></svg>
);
const RefreshCw = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
);
const Download = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);
const Calendar = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);
const Plus = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const X = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const MoreVertical = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
);
const Landmark = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="3" y1="21" x2="21" y2="21"></line><path d="M3 7l9-4 9 4v2H3V7z"></path><path d="M5 21V9"></path><path d="M9 21V9"></path><path d="M15 21V9"></path><path d="M19 21V9"></path><path d="M3 11h18v4H3v-4z"></path></svg>
);
import { 
  useGetAdminPayrollOverviewQuery, 
  useGetAdminPayrollListQuery,
  useGetAdminUserAuditDataQuery 
} from '@/store/api/userApi';
import { useLayout } from '@/context/LayoutContext';
import { apiFetch } from '@/lib/api-client';
import { API_BASE_URL } from '@/constant/api';

const formatINR = (val: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
};

export default function PayrollView() {
  const { dateRange, setDateRange } = useLayout();
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  // 🗓️ Local Draft States for Custom Range
  const [draftStart, setDraftStart] = React.useState(dateRange.startDate);
  const [draftEnd, setDraftEnd] = React.useState(dateRange.endDate);
  
  // Local Committed States for Custom Range
  const [commStart, setCommStart] = React.useState(dateRange.startDate);
  const [commEnd, setCommEnd] = React.useState(dateRange.endDate);

  const handleSearch = () => {
    setCommStart(draftStart);
    setCommEnd(draftEnd);
  };

  const handleExport = async () => {
    setIsExporting(true);
    const url = `${API_BASE_URL}/admin-reports/export-payroll`;
    
    try {
      const response = await apiFetch(url);
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `Organizational_Payroll_Audit_${new Date().toISOString().split('T')[0]}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert("Payroll export failed. Please check your data connectivity.");
    } finally {
      setIsExporting(false);
    }
  };

  const { data: overview } = useGetAdminPayrollOverviewQuery({
    startDate: dateRange.key === 'custom' ? commStart : dateRange.startDate,
    endDate: dateRange.key === 'custom' ? commEnd : dateRange.endDate
  });

  const { data: payrolls, isFetching: loadingPayrolls } = useGetAdminPayrollListQuery();

  const { data: auditResponse } = useGetAdminUserAuditDataQuery(
    { 
      userId: selectedClaim?.userId || selectedClaim?._id, 
      startDate: dateRange.key === 'custom' ? commStart : dateRange.startDate,
      endDate: dateRange.key === 'custom' ? commEnd : dateRange.endDate
    },
    { skip: !isModalOpen || !selectedClaim }
  );

  const auditData = auditResponse?.data;

  // Map backend labels to icons/colors
  const getCategoryConfig = (label: string, fallbackName?: string) => {
    const configs: Record<string, any> = {
      'ORG_TOTAL': { label: 'Total Net Payout', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', cardBg: 'bg-blue-50/50 hover:bg-blue-100/50' },
      'BASIC': { label: fallbackName || 'Basic Salary', icon: Landmark, color: 'text-purple-600', bg: 'bg-purple-50', cardBg: 'bg-purple-50/50 hover:bg-purple-100/50' },
      'ALLOWANCE': { label: fallbackName || 'Total Allowances', icon: Utensils, color: 'text-emerald-600', bg: 'bg-emerald-50', cardBg: 'bg-emerald-50/50 hover:bg-emerald-100/50' }
    };
    return configs[label] || configs['ORG_TOTAL'];
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] overflow-hidden">

      {/* ── Main Content ── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Payroll Overview</h1>
            <p className="text-sm text-slate-400 font-medium mt-0.5">Manage member compensations and structural salary components.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl self-start sm:self-auto shadow-lg shadow-slate-100">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Active Payroll Cycle</span>
          </div>
        </div>

        {/* Global Filter Bar */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 flex items-end gap-3 sm:gap-5 shadow-sm flex-wrap">
          <div className="space-y-1.5 min-w-[180px]">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Calendar size={12} className="text-blue-500" /> Payroll Period
            </label>
            <div className="relative flex items-center">
              <select 
                value={dateRange.key} 
                onChange={e => setDateRange(e.target.value as any)}
                className="w-full appearance-none bg-slate-900 border border-slate-900 text-white rounded-xl px-4 py-2.5 pr-10 text-sm font-bold outline-none hover:bg-slate-800 transition-all cursor-pointer shadow-lg shadow-slate-100">
                {['1M', '3M', '6M', '1Y', 'custom'].map(o => (
                  <option key={o} value={o}>
                    {o === '1M' ? 'Current Month' : o === 'custom' ? 'Custom Range' : o}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <button 
            onClick={() => setDateRange('1M')}
            title="Reset Filters"
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:text-blue-600 transition-all shadow-sm"
          >
            <RefreshCw size={15} />
          </button>

          <button 
            disabled={isExporting}
            onClick={handleExport}
            className={`ml-auto h-10 px-6 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${isExporting ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100'}`}>
            {isExporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
            {isExporting ? 'Generating...' : 'Export Payroll Data'}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {(overview?.data?.categories || []).map((c: any, i: number) => {
            const config = getCategoryConfig(c.label, c.name);
            return (
              <div key={i} className={`${config.cardBg} rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 p-5 sm:p-6 transition-all duration-300 relative group`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.bg}`}>
                    <config.icon size={20} className={config.color} />
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Financial Component</span>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{config.label}</p>
                <p className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {formatINR(c.value || 0)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Payroll Employee Rolls */}
        <div className="bg-indigo-50/50 hover:bg-indigo-100/50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300">
          <div className="px-4 sm:px-8 py-5 border-b border-slate-50">
            <h2 className="text-base font-black text-slate-900">Active Payroll Rolls</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {(payrolls || []).map((row: any, i: number) => (
              <div key={i} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-8 py-4 hover:bg-slate-50/50 transition-colors">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0" style={{ backgroundColor: row.avatarBg }}>{row.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-900">{row.name}</p>
                  <p className="text-[11px] text-slate-400 truncate uppercase tracking-widest">{row.detail}</p>
                </div>
                <div className="text-right pr-4">
                   <p className="text-sm font-black text-slate-900 whitespace-nowrap">{row.amount}</p>
                   <p className="text-[9px] font-bold text-slate-400 uppercase">MONTHLY CTC</p>
                </div>
                <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-widest whitespace-nowrap ${row.status === 'LOCKED' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-200'}`}>{row.status}</span>
                <div className="relative">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === row._id ? null : row._id); }}
                    className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                    <MoreVertical size={18} />
                  </button>
                  {activeMenu === row._id && (
                    <>
                      <div className="fixed inset-0 z-[50]" onClick={() => setActiveMenu(null)} />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-[60] animate-in fade-in zoom-in slide-in-from-top-2 duration-200">
                        <button 
                          onClick={() => { setSelectedClaim(row); setIsModalOpen(true); setActiveMenu(null); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-black text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all text-left uppercase tracking-widest">
                          <Plus size={14} className="text-blue-500" /> Audit Components
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Breakdown Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-[28px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0">
              <div>
                <h2 className="text-lg font-black text-slate-900">{selectedClaim?.name}</h2>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-0.5">Salary Structure Breakdown</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"><X size={20} /></button>
            </div>

            <div className="px-6 py-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Defined Components</p>
                <div className="grid grid-cols-1 gap-3">
                   {selectedClaim?.components?.map((item: any, idx: number) => (
                     <div key={idx} className="flex items-center justify-between bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <span className="text-xs font-black text-slate-700">{item.label}</span>
                        <span className="text-sm font-black text-slate-900">{formatINR(item.value)}</span>
                     </div>
                   ))}
                </div>
                
                <div className="bg-slate-900 rounded-[24px] p-6 flex items-center justify-between shadow-2xl shadow-slate-300">
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Gross Payout</p>
                     <p className="text-2xl font-black text-white">{selectedClaim?.amount}</p>
                   </div>
                   <Landmark size={32} className="text-slate-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
