'use client';

import React, { useState } from 'react';
// 🛡️ Local SVG Icon Components to prevent Lucide-React Bundler Crashes
const Plane = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"></path></svg>
);
const Utensils = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path></svg>
);
const Monitor = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
);
const TrendingUp = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);
const TrendingDown = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
);
const CheckCircle = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);
const AlertTriangle = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
);
const Clock = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);
const MoreVertical = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
);
const Plus = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const Lightbulb = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"></path></svg>
);
const ArrowRight = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);
const Upload = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
);
const Calendar = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
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
const X = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const DownloadIcon = Download;
import { 
  useGetAdminExpenseOverviewQuery, 
  useGetAdminRecentClaimsQuery,
  useGetAdminUserAuditDataQuery 
} from '@/store/api/userApi';
import { useLayout } from '@/context/LayoutContext';
import { apiFetch } from '@/lib/api-client';
import { API_BASE_URL } from '@/constant/api';

const CATEGORY_CONFIG: Record<string, any> = {
  'ORG_TOTAL': { label: 'Total Organizational Spend', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', cardBg: 'bg-blue-50/50 hover:bg-blue-100/50' },
  'OUTSTATION': { label: 'Outstation Expenditures', icon: Plane, color: 'text-purple-600', bg: 'bg-purple-50', cardBg: 'bg-purple-50/50 hover:bg-purple-100/50' },
  'LOCAL': { label: 'Local / Base Expenditures', icon: Utensils, color: 'text-emerald-600', bg: 'bg-emerald-50', cardBg: 'bg-emerald-50/50 hover:bg-emerald-100/50' }
};

const formatINR = (val: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
};

export default function ExpenseView() {
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
    const start = dateRange.key === 'custom' ? commStart : dateRange.startDate;
    const end = dateRange.key === 'custom' ? commEnd : dateRange.endDate;
    const url = `${API_BASE_URL}/admin-reports/export-expenses?startDate=${start}&endDate=${end}`;
    
    try {
      const response = await apiFetch(url);
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `Admin_Consolidated_Expenses_${new Date().toISOString().split('T')[0]}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        alert("No audit data found for the selected members in this period. 🛑");
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert("Export failed. Please check your data connectivity.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleUserExport = async () => {
    if (!selectedClaim) return;
    setIsExporting(true);
    const start = dateRange.key === 'custom' ? commStart : dateRange.startDate;
    const end = dateRange.key === 'custom' ? commEnd : dateRange.endDate;
    const targetId = selectedClaim.userId || selectedClaim._id;
    const url = `${API_BASE_URL}/admin-reports/export-user-expenses?userId=${targetId}&startDate=${start}&endDate=${end}`;
    
    try {
      const response = await apiFetch(url);
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `${selectedClaim.name}_Audit_${new Date().toISOString().split('T')[0]}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        alert("No audit data found for this member in the selected period. 🛑");
      }
    } catch (error) {
      console.error('User export failed:', error);
      alert("Member export failed. Please try again later.");
    } finally {
      setIsExporting(false);
    }
  };

  const { data: overview, isFetching: loadingOverview } = useGetAdminExpenseOverviewQuery({
    startDate: dateRange.key === 'custom' ? commStart : dateRange.startDate,
    endDate: dateRange.key === 'custom' ? commEnd : dateRange.endDate
  });
  const { data: claims, isFetching: loadingClaims } = useGetAdminRecentClaimsQuery({
    startDate: dateRange.key === 'custom' ? commStart : dateRange.startDate,
    endDate: dateRange.key === 'custom' ? commEnd : dateRange.endDate
  });

  const { data: auditResponse, isFetching: loadingAudit } = useGetAdminUserAuditDataQuery(
    { 
      userId: selectedClaim?.userId || selectedClaim?._id, 
      startDate: dateRange.key === 'custom' ? commStart : dateRange.startDate,
      endDate: dateRange.key === 'custom' ? commEnd : dateRange.endDate
    },
    { skip: !isModalOpen || !selectedClaim }
  );

  const auditData = auditResponse?.data;

  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="flex flex-col lg:flex-row h-full bg-[#f8fafc] overflow-hidden">

      {/* ── Main Content ── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Expense Overview</h1>
            <p className="text-sm text-slate-400 font-medium mt-0.5">Review aggregated organizational spend by category.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl self-start sm:self-auto">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Global Expenditure Analysis</span>
          </div>
        </div>

        {/* Same Calendar/Filter Bar as Analytics View */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 flex items-end gap-3 sm:gap-5 shadow-sm flex-wrap">
          
          {/* Main Period Selector */}
          <div className="space-y-1.5 min-w-[180px]">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Calendar size={12} className="text-blue-500" /> Filter Period
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

          {/* 🗓️ Custom Date Pickers */}
          {dateRange.key === 'custom' && (
            <div className="flex items-end gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">From</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={draftStart}
                    onChange={(e) => setDraftStart(e.target.value)}
                    className="bg-white border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-blue-300 transition-all" 
                  />
                </div>
              </div>
              <div className="h-8 w-px bg-slate-100 mb-2 hidden sm:block" />
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">To Date</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={draftEnd}
                    onChange={(e) => setDraftEnd(e.target.value)}
                    className="bg-white border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-blue-300 transition-all" 
                  />
                </div>
              </div>

              <button 
                onClick={handleSearch}
                className="h-[34px] px-5 bg-slate-900 text-white text-[10px] font-black rounded-xl hover:bg-blue-600 transition-all uppercase tracking-widest shadow-lg shadow-slate-100 whitespace-nowrap"
              >
                Search
              </button>
            </div>
          )}

          <button 
            onClick={() => setDateRange('1M')}
            title="Reset Filters to Current Month"
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:border-slate-200 hover:text-blue-600 transition-all active:scale-95 shadow-sm"
          >
            <RefreshCw size={15} />
          </button>

          <button 
            disabled={isExporting}
            onClick={handleExport}
            className={`ml-auto h-10 px-6 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${isExporting ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100'}`}>
            {isExporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
            {isExporting ? 'Generating...' : 'Export Team Audit'}
          </button>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {(overview?.data?.categories || []).map((c: any, i: number) => {
            const config = CATEGORY_CONFIG[c.label] || CATEGORY_CONFIG['ORG_TOTAL'];
            return (
              <div key={i} className={`${config.cardBg} rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 p-5 sm:p-6 transition-all duration-300 relative group`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.bg}`}>
                    <config.icon size={20} className={config.color} />
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Audited Data</span>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{config.label}</p>
                <p className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {formatINR(c.value || 0)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Recent Claim Requests */}
        <div className="bg-indigo-50/50 hover:bg-indigo-100/50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-8 py-5 border-b border-slate-50 gap-3">
            <h2 className="text-base font-black text-slate-900">Recent Claim Requests</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {(claims || []).map((claim: any, i: number) => {
              const statusColor = claim.status === 'APPROVED' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                                  claim.status === 'REJECTED' ? 'text-rose-700 bg-rose-50 border-rose-200' :
                                  'text-amber-700 bg-amber-50 border-amber-200';
              return (
                <div key={i} className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-8 py-4 hover:bg-slate-50/50 transition-colors min-w-[500px]`}>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0" style={{ backgroundColor: claim.avatarBg }}>{claim.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-900">{claim.name}</p>
                    <p className="text-[11px] text-slate-400 truncate hidden sm:block">{claim.detail}</p>
                  </div>
                  <span className="text-sm font-black text-slate-900 whitespace-nowrap">{claim.amount}</span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest hidden md:block">{claim.category}</span>
                  <span className={`text-[9px] font-black px-2 sm:px-3 py-1.5 rounded-lg border uppercase tracking-widest whitespace-nowrap ${statusColor}`}>{claim.status}</span>
                  <div className="relative">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === claim._id ? null : claim._id); }}
                      className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                      <MoreVertical size={18} />
                    </button>
                    
                    {activeMenu === claim._id && (
                      <>
                        <div className="fixed inset-0 z-[50]" onClick={() => setActiveMenu(null)} />
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-[60] animate-in fade-in zoom-in slide-in-from-top-2 duration-200">
                          <button 
                            onClick={() => { setSelectedClaim(claim); setIsModalOpen(true); setActiveMenu(null); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-black text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all text-left uppercase tracking-widest">
                            <Plus size={14} className="text-blue-500" /> View Breakdown
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            {claims?.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">No recent claims found</div>
            )}
          </div>
        </div>

      </div>


      {/* ── Detailed Breakdown Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-2xl bg-white rounded-[28px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0">
              <div>
                <h2 className="text-lg font-black text-slate-900">{selectedClaim?.name}</h2>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-0.5">{selectedClaim?.detail}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Daily Log Breakdown</p>
                
                <div className="border border-slate-100 rounded-[20px] overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                        <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Station</th>
                        <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Area</th>
                        <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Work Type</th>
                        <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {auditData?.calendar ? (
                        auditData.calendar.map((day: any, idx: number) => (
                           <tr key={idx} className={`hover:bg-slate-50/50 transition-colors ${day.isSunday ? 'bg-emerald-50/30' : day.isHoliday ? 'bg-green-50/40' : day.isLeave ? 'bg-rose-50/40' : ''}`}>
                              <td className="px-4 py-3 text-xs font-bold text-slate-600">
                                {new Date(day.date).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}
                              </td>
                              <td className="px-4 py-3 text-[10px] font-heavy text-slate-900 uppercase">{day.station}</td>
                              <td className="px-4 py-3 text-[10px] font-medium text-slate-400 capitalize">{day.area}</td>
                              <td className="px-4 py-3">
                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider ${day.isSunday ? 'bg-emerald-100 text-emerald-700' : day.isHoliday ? 'bg-green-600 text-white' : day.isLeave ? 'bg-rose-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                                  {day.workType}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-xs font-black text-slate-900 text-right">
                                ₹{day.amount}
                              </td>
                           </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-5 py-8 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">Fetching daily logs...</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="bg-blue-600 rounded-[20px] p-5 flex items-center justify-between">
                   <p className="text-xs font-black text-white/70 uppercase">Consolidated Total</p>
                   <p className="text-xl font-black text-white">{selectedClaim?.amount}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-5 bg-slate-50 flex items-center justify-end gap-3">
               <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-xs font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-all underline decoration-slate-200">Close Audit</button>
               <button 
                 onClick={handleUserExport}
                 className="px-6 py-2.5 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2">
                 <DownloadIcon size={14} /> Export Report
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
