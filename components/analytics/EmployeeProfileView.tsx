'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Edit3, Download, ChevronLeft, TrendingUp, TrendingDown,
  Users, Phone, UserPlus, BookOpen, DollarSign, Calendar, MessageSquare, Wallet, ShieldCheck,
  Target, Award, MapPin, ArrowUpRight, Activity, ChevronDown, RefreshCw, History, User, Mail,
  Clock, FileText, Share2, MoreHorizontal, Filter, Search, Building2, PieChart as PieIcon, Briefcase, Map
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart, Area,
  BarChart as ReBarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Cell, PieChart, Pie
} from 'recharts';
import { useGetProfileStatsQuery, useGetAdminUserAuditDataQuery } from '@/store/api/userApi';
import { useLayout } from '@/context/LayoutContext';
import { API_BASE_URL } from '@/constant/api';
import { apiFetch } from '@/lib/api-client';

// ─── Constants & Styles ──────────────────────────────────────────────────────

const TABS = [
  { id: 'overview', label: 'Overview', icon: Building2 },
  { id: 'profile', label: 'Personal Information', icon: User },
  { id: 'documents', label: 'Documents', icon: BookOpen },
];

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

// ─── Premium Sub-components ───────────────────────────────────────────────────

function PerformanceGauge({ value, label = "Efficiency" }: { value: number, label?: string }) {
  const r = 85;
  const circ = Math.PI * r;
  const pct = Math.min(value / 100, 1);
  return (
    <div className="relative flex flex-col items-center justify-center pt-8">
      <svg className="w-56 h-32" viewBox="0 0 200 110">
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#f1f5f9" strokeWidth="20" strokeLinecap="round" />
        <path
          d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gaugeGradientRestored)"
          strokeWidth="20" strokeLinecap="round" strokeDasharray={`${circ * pct} ${circ}`}
          className="transition-all duration-1500 ease-out"
        />
        <defs>
          <linearGradient id="gaugeGradientRestored" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-4 text-center">
        <h4 className="text-4xl font-black text-slate-900 tracking-tight">{value}%</h4>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</p>
      </div>
    </div>
  );
}

// ─── Main View ───────────────────────────────────────────────────────────────

export default function EmployeeProfileView({ employeeId }: { employeeId: string }) {
  const { dateRange, setDateRange } = useLayout();
  const [activeTab, setActiveTab] = useState('overview');

  const [draftStart, setDraftStart] = useState(dateRange.startDate);
  const [draftEnd, setDraftEnd] = useState(dateRange.endDate);
  const [commStart, setCommStart] = useState(dateRange.startDate);
  const [commEnd, setCommEnd] = useState(dateRange.endDate);

  const handleSearch = () => {
    setCommStart(draftStart);
    setCommEnd(draftEnd);
  };

  const handleExportAudit = async () => {
    const start = dateRange.key === 'custom' ? commStart : dateRange.startDate;
    const end = dateRange.key === 'custom' ? commEnd : dateRange.endDate;
    const baseUrl = API_BASE_URL;
    const url = `${baseUrl}/admin-reports/export-user-expenses?userId=${employeeId}&startDate=${start}&endDate=${end}`;

    try {
      const response = await apiFetch(url);
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `Audit_Log_${emp.name}_${new Date().toISOString().split('T')[0]}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        alert("No audit data found for the selected period.");
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert("Export failed. Please check your connection.");
    }
  };

  const { data: apiData, isFetching: loading } = useGetProfileStatsQuery({
    id: employeeId,
    startDate: dateRange.key === 'custom' ? commStart : dateRange.startDate,
    endDate: dateRange.key === 'custom' ? commEnd : dateRange.endDate
  }, { skip: !employeeId });

  const { data: auditResponse, isFetching: loadingAudit } = useGetAdminUserAuditDataQuery({
    userId: employeeId,
    startDate: dateRange.key === 'custom' ? commStart : dateRange.startDate,
    endDate: dateRange.key === 'custom' ? commEnd : dateRange.endDate
  }, { skip: !employeeId });

  const auditData = auditResponse?.data;

  // 💎 Data mapping
  const u = apiData?.data?.user;
  const s = apiData?.data?.stats;
  const sl = apiData?.data?.sales;

  // Robust Territory Mapping
  const territory = u?.territory || apiData?.data?.territory;
  const areaDisplay = Array.isArray(territory?.area) ? territory.area.join(', ') : (territory?.area || u?.area || 'Not Assigned');
  const subAreaDisplay = Array.isArray(territory?.subArea) ? territory.subArea.join(', ') : (territory?.subArea || u?.subArea || (u?.subAreas || []).join(', ') || 'N/A');
  const stationsDisplay = (u?.stations || []).join(', ') || 'N/A';

  const trend = useMemo(() => {
    const rawTrend = apiData?.data?.interactionTrend || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const expenseTrend = apiData?.data?.expenseTrend || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const salaryTrend = apiData?.data?.salaryTrend || [45000, 45000, 45000, 48000, 48000, 48000, 48000, 52000, 52000, 52000, 52000, 52000];
    return rawTrend.map((val: number, i: number) => ({
      month: MONTHS[i],
      calls: val,
      expenses: expenseTrend[i] || 0,
      salary: salaryTrend[i] || 0,
    }));
  }, [apiData]);

  const clientData = useMemo(() => [
    { name: 'Listed', value: (s?.listedActive || 0) + (s?.listedInactive || 0), color: '#6366f1' },
    { name: 'Unlisted', value: s?.unlisted || 0, color: '#e2e8f0' },
  ], [s]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-50 gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Syncing Personnel Data...</p>
      </div>
    );
  }

  const emp = {
    id: u?.employeeId || employeeId,
    name: u?.name || 'Loading...',
    designation: u?.designation || 'Personnel',
    workStation: 'On-Field',
    avatar: u?.name?.charAt(0) || '?',
    avatarBg: '#4f46e5',
    totalCalls: s?.calls ?? 0,
    clientsAdded: s?.newClients ?? 0,
    expenses: `$${s?.expenses ?? 0}`,
    sales: sl?.achieved || '$0',
    target: sl?.target || '$0',
    achievement: sl?.percent ?? 0,
  };

  const dashboardItems = [
    { label: 'TOTAL CALLS', value: emp.totalCalls, icon: Phone, border: 'border-blue-500', color: 'text-blue-500' },
    { label: 'CLIENTS ADDED', value: emp.clientsAdded, icon: UserPlus, border: 'border-emerald-500', color: 'text-emerald-500' },
    { label: 'LISTED CLIENTS', value: (s?.listedActive || 0) + (s?.listedInactive || 0), icon: FileText, border: 'border-blue-700', color: 'text-blue-700' },
    { label: 'UNLISTED', value: s?.unlisted || 0, icon: MessageSquare, border: 'border-slate-400', color: 'text-slate-400' },
    { label: 'EXPENSES', value: emp.expenses, icon: Wallet, border: 'border-violet-500', color: 'text-violet-500' },
    { label: 'LEAVES', value: s?.leaves ?? 0, icon: Calendar, border: 'border-rose-500', color: 'text-rose-500' },
    { label: 'SALES', value: emp.sales, icon: TrendingUp, border: 'border-blue-500', color: 'text-blue-500' },
    { label: 'TARGET', value: emp.target, icon: Target, border: 'border-slate-300', color: 'text-slate-300' },
    { label: 'ACHIEVED %', value: `${emp.achievement}%`, icon: ShieldCheck, border: 'border-teal-500', color: 'text-teal-500' },
  ];

  return (
    <div className="w-full bg-[#f4f7fb] overflow-x-hidden min-h-screen pb-6">

      {/* ── HEADER AREA (Breadcrumbs + Profile Card) ── */}
      <div className="pt-4 sm:pt-6 pb-2 w-full flex flex-col gap-4">

        {/* ── Back + Breadcrumb ── */}
        <div className="flex items-center gap-3 w-full px-4 sm:px-8">
          <div className="flex items-center gap-1.5 min-w-0">
            <button onClick={() => window.history.back()} className="w-8 h-8 sm:w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-blue-600 transition-all shrink-0 shadow-sm active:scale-95">
              <ChevronLeft size={16} />
            </button>
            <div className="h-4 w-px bg-slate-200 mx-1 shrink-0" />
            <span className="text-sm font-black text-slate-900 tracking-tight truncate">{emp.name}</span>
          </div>
          <div className="flex-1" />
          <span className="hidden xs:inline-block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-2.5 py-1 rounded-lg shrink-0 shadow-sm">ID: {emp.id}</span>
        </div>

        {/* ── Profile Header ── */}
        <div className="px-3 sm:px-8  w-full">
          <div className="bg-white rounded-3xl sm:rounded-[32px] border border-slate-100 shadow-sm p-4 sm:p-6 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-5 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-6 text-center sm:text-left">
              <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full flex items-center justify-center text-white text-lg sm:text-2xl font-black shadow-lg shrink-0" style={{ backgroundColor: emp.avatarBg }}>{emp.avatar}</div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-tight truncate">{emp.name}</h1>
                <p className="text-[10px] sm:text-xs font-bold text-indigo-600 mt-0.5 sm:mt-1 uppercase tracking-widest">{emp.designation} <span className="mx-1 text-slate-200">|</span> <span className="text-slate-400">{emp.workStation}</span></p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-end gap-3 w-full lg:w-auto">
              <div className="space-y-1.5 w-full sm:w-[150px]">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={12} className="text-indigo-500" /> Filter Period
                </label>
                <select
                  value={dateRange.key}
                  onChange={e => setDateRange(e.target.value as any)}
                  className="w-full bg-slate-900 text-white rounded-xl px-4 py-2.5 text-xs font-bold shadow-lg outline-none cursor-pointer border-none ring-0 h-[38px]">
                  {['Today', '1W', '1M', '3M', '6M', '1Y', 'custom'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              {dateRange.key === 'custom' && (
                <div className="flex flex-col sm:flex-row items-end gap-2 w-full sm:w-auto animate-in fade-in slide-in-from-left-4 duration-300">
                  <div className="space-y-1.5 w-full sm:w-[130px]">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">From Date</label>
                    <input type="date" value={draftStart || ''} onChange={e => setDraftStart(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-black outline-none focus:ring-2 focus:ring-indigo-500/10 h-[38px]" />
                  </div>
                  <div className="space-y-1.5 w-full sm:w-[130px]">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">To Date</label>
                    <input type="date" value={draftEnd || ''} onChange={e => setDraftEnd(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-black outline-none focus:ring-2 focus:ring-indigo-500/10 h-[38px]" />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="w-full sm:w-10 h-[38px] flex items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95 shrink-0"
                    title="Apply Custom Range"
                  >
                    <Search size={16} />
                  </button>
                </div>
              )}

              {/* <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all shadow-sm active:scale-95 shrink-0 h-[38px] lg:ml-2">
                <Download size={14} /> Export
              </button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-8 pb-12 pt-2 space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden">

        {/* ── KPI Row (Strict Local Scroll) ── */}
        <div className="w-full overflow-x-auto pb-4 no-scrollbar custom-scrollbar">
          <div className="flex items-stretch gap-3 sm:gap-4 min-w-max px-1">
            {dashboardItems.map((card, i) => (
              <div
                key={i}
                className={`w-[130px] sm:w-[150px] bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-l-4 ${card.border} shadow-sm shadow-slate-100 flex flex-col justify-between group hover:shadow-lg transition-all duration-300 snap-start`}
              >
                <div>
                  <p className="text-[8px] sm:text-[9px] font-black text-slate-400 leading-tight tracking-[0.1em] mb-1">
                    {card.label.split(' ').map((word, idx) => <span key={idx} className="block">{word}</span>)}
                  </p>
                  <h4 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tighter mt-0.5 sm:mt-1">{card.value}</h4>
                </div>
                <div className={`self-end ${card.color} opacity-40 group-hover:opacity-100 transition-opacity`}>
                  <card.icon size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Main Tabbed Content ── */}
        <div className="bg-white rounded-3xl sm:rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col w-full">
          {/* Tab Header - Strict Local Scroll */}
          <div className="w-full overflow-x-auto border-b border-slate-100 no-scrollbar custom-scrollbar">
            <div className="flex items-center min-w-max px-4 sm:px-10">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-5 sm:px-8 py-5 sm:py-8 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] border-b-2 transition-all shrink-0 ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  <tab.icon size={16} /> {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-10 bg-slate-50/20 w-full min-h-[400px]">

            {activeTab === 'profile' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Avatar & Basic Info */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center">
                      <div className="w-32 h-32 rounded-3xl bg-indigo-600 flex items-center justify-center text-white text-5xl font-black shadow-xl shadow-indigo-100 mb-6">
                        {u?.name?.charAt(0) || '?'}
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">{u?.name || 'Personnel Name'}</h3>
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">{u?.designation || 'Field Representative'}</p>

                      <div className="w-full h-px bg-slate-100 my-8" />

                      <div className="w-full space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee ID</span>
                          <span className="text-[11px] font-black text-slate-900"># {u?.employeeId || 'TX-000'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined On</span>
                          <span className="text-[11px] font-black text-slate-900">{u?.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Jan 12, 2026'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Status</span>
                          <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Detailed Personal Info */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* Identity Matrix */}
                    <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm">
                      <div className="flex items-center justify-between mb-10">
                        <div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight">Identity Matrix</h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Verified Personnel Information</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                          <ShieldCheck size={24} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Mail size={12} className="text-indigo-500" /> Professional Email
                          </label>
                          <p className="text-sm font-black text-slate-900 border-b border-slate-50 pb-2">{u?.email || 'N/A'}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Phone size={12} className="text-indigo-500" /> Mobile Contact
                          </label>
                          <p className="text-sm font-black text-slate-900 border-b border-slate-50 pb-2">{u?.phone || u?.mobile || '+91 99887 76655'}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Briefcase size={12} className="text-indigo-500" /> Official Role
                          </label>
                          <p className="text-sm font-black text-slate-900 border-b border-slate-50 pb-2">{u?.designation || 'Personnel'}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Map size={12} className="text-indigo-500" /> Base Station
                          </label>
                          <p className="text-sm font-black text-slate-900 border-b border-slate-50 pb-2">{u?.workStation || 'Headquarters'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Workplace Context */}
                    <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Workplace Context</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-indigo-600 shadow-sm">
                              <Map size={16} />
                            </div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Operation Area</p>
                          </div>
                          <p className="text-xs font-black text-slate-900 truncate">
                            {areaDisplay}
                          </p>
                        </div>

                        <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-indigo-600 shadow-sm">
                              <Building2 size={16} />
                            </div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Base Stations</p>
                          </div>
                          <p className="text-xs font-black text-slate-900 truncate">{stationsDisplay}</p>
                        </div>

                        <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-indigo-600 shadow-sm">
                              <MapPin size={16} />
                            </div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sub Area / Localities</p>
                          </div>
                          <p className="text-xs font-black text-slate-900 truncate">
                            {subAreaDisplay}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="space-y-6 sm:space-y-10 animate-in slide-in-from-bottom-2 duration-500">
                {/* Row 1: Clients & Efficiency */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">

                  {/* Clients Breakdown (Donut) */}
                  <div className="lg:col-span-2 bg-white rounded-3xl sm:rounded-[48px] p-6 sm:p-10 border border-slate-100 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Client Portfolio</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Acquisition Breakdown</p>
                      </div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm"><Users size={18} /></div>
                    </div>
                    <div className="h-[240px] sm:h-[280px] w-full flex items-center justify-center relative min-h-[240px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={clientData}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                          >
                            {clientData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                            itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">{emp.clientsAdded}</h2>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Added</p>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
                      {clientData.map(d => (
                        <div key={d.name} className="flex-1 p-3 sm:p-4 bg-slate-50/50 rounded-2xl sm:rounded-3xl text-center border border-slate-50">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{d.name}</p>
                          <h5 className="text-lg sm:text-xl font-black text-slate-900">{d.value}</h5>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Target vs Achievement & Gauge */}
                  <div className="lg:col-span-3 bg-white rounded-3xl sm:rounded-[48px] p-6 sm:p-10 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="mb-4">
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Target vs Achievement</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Earnings & Sales Achievement Score</p>
                    </div>
                    <div className="scale-90 sm:scale-100">
                      <PerformanceGauge value={emp.achievement} label="Achievement Matrix" />
                    </div>

                    <div className="w-full mt-6 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="bg-indigo-600 rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 text-left relative overflow-hidden group shadow-xl">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><DollarSign size={40} className="sm:size-[60px]" /></div>
                        <p className="text-indigo-200 text-[9px] font-black uppercase tracking-[0.2em] mb-2">Current Sales</p>
                        <h3 className="text-white text-2xl sm:text-3xl font-black pr-10">{emp.sales}</h3>
                      </div>
                      <div className="bg-slate-900 rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 text-left relative overflow-hidden group shadow-xl">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Target size={40} className="sm:size-[60px]" /></div>
                        <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-2">Sales Target</p>
                        <h3 className="text-white text-2xl sm:text-3xl font-black pr-10">{emp.target}</h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Compensation Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
                  <div className="lg:col-span-3 bg-white rounded-3xl sm:rounded-[48px] p-6 sm:p-10 border border-slate-100 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-10 gap-4">
                      <div className="text-center sm:text-left">
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Compensation Intelligence</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Monthly Payout & Growth Trend</p>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-xl border border-emerald-100">
                        <TrendingUp size={12} /> Positive Growth
                      </div>
                    </div>
                    <div className="h-[240px] sm:h-[280px] w-full min-h-[240px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trend}>
                          <defs>
                            <linearGradient id="salaryGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 8, fontWeight: 900, fill: '#94a3b8' }} dy={10} />
                          <YAxis hide />
                          <Tooltip
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '10px', fontWeight: 900 }}
                            formatter={(value) => [`₹${value}`, 'Compensation']}
                          />
                          <Area type="monotone" dataKey="salary" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#salaryGradient)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Compensation Breakdown Card */}
                  <div className="lg:col-span-2 bg-slate-900 rounded-[48px] p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-600/20 blur-3xl -mr-10 -mt-10" />
                    <div className="relative z-10">
                      <h3 className="text-xl font-black tracking-tight mb-2">Payout Structure</h3>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-8">Current Active Revision</p>

                      <div className="space-y-4">
                        {[
                          { label: 'Basic Salary', value: '₹45,000', color: 'bg-emerald-500' },
                          { label: 'HRA & Benefits', value: '₹12,500', color: 'bg-indigo-500' },
                          { label: 'Performance Bonus', value: '₹8,200', color: 'bg-amber-500' },
                          { label: 'Other Allowances', value: '₹4,300', color: 'bg-slate-700' },
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${item.color}`} />
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{item.label}</span>
                            </div>
                            <span className="text-xs font-black">{item.value}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                        <div>
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Monthly Gross</p>
                          <h4 className="text-2xl font-black tracking-tighter">₹70,000</h4>
                        </div>
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20">
                          <Wallet size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {activeTab === 'documents' && (
              <div className="animate-in zoom-in-95 duration-500 bg-white rounded-[48px] p-12 border border-slate-100 shadow-sm min-h-[500px]">
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Administrative Documents</h3>
                  <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-600 transition-all shadow-lg shadow-slate-100">
                    <UserPlus size={14} /> Upload To Archive
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'Identity_Verification.pdf', size: '2.4 MB' },
                    { name: 'Contract_Agreement_S2.pdf', size: '840 KB' },
                    { name: 'Annual_Performance_Review.pdf', size: '1.2 MB' }
                  ].map((doc, i) => (
                    <div key={i} className="p-6 bg-slate-50/50 rounded-[32px] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group flex items-start gap-4 cursor-pointer">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-red-500 transition-colors shadow-sm shrink-0">
                        <FileText size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black text-slate-900 truncate uppercase mt-1.5">{doc.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">{doc.size}</p>
                      </div>
                      <button className="p-3 text-slate-300 hover:text-indigo-600 rounded-xl transition-all shadow-sm shrink-0"><Download size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
