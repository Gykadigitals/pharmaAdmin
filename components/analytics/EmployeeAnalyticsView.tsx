'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import EmployeeDrawer from '../team/EmployeeDrawer';
import { useGetMyTeamQuery, useGetLiveFleetQuery, useGetAdminPayrollOverviewQuery } from '@/store/api/userApi';
import { useGetDashboardStatsQuery } from '@/store/api/dashboardApi';
import {
  Search, Bell, HelpCircle, Download, RefreshCw, LayoutDashboard, FileText,
  ChevronDown, User, Upload, MoreVertical, ChevronLeft, ChevronRight,
  ExternalLink, Filter, X, Phone, Mail, TrendingUp, TrendingDown,
  ArrowUpRight, Printer, MessageSquare, Users, Calendar, Activity, Building2, Target, DollarSign, Wallet, MapIcon, Navigation, Info, Clock, CheckCircle2, MapPin
} from 'lucide-react';
import { useToggleUserStatusMutation } from '@/store/api/userApi';
import {
  ResponsiveContainer,
  AreaChart, Area,
  BarChart as ReBarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Cell, PieChart, Pie
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChainUser { id: string; name: string; designation: string; avatar: string; avatarBg: string; }
export interface Employee {
  id: string; name: string; email: string; designation: string; workStation: string;
  tourPlans: number; exportTp: boolean; avatar: string; avatarBg: string;
  roleType: string; reportingManager: string; calls: number; newClients: number;
  total: number; routes: number; earnedBI: string; status: string;
  salesAchieved: string; salesTarget: string; salesPercent: number;
  claimedAmount: string; approvedAmount: string; pendingAmount: string;
  leaves: number; isActive: boolean; chainUsers: ChainUser[];
}


const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

// ─── Sub-components ──────────────────────────────────────────────────────────

function PerformanceGauge({ value }: { value: number }) {
  const r = 85; const circ = Math.PI * r; const pct = Math.min(value / 100, 1);
  return (
    <div className="relative flex flex-col items-center justify-center pt-4 sm:pt-8">
      <svg className="w-40 sm:w-56 h-auto" viewBox="0 0 200 110">
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#f1f5f9" strokeWidth="20" strokeLinecap="round" />
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#dashGaugeGradFinal)" strokeWidth="20" strokeLinecap="round" strokeDasharray={`${circ * pct} ${circ}`} className="transition-all duration-1000" />
        <defs><linearGradient id="dashGaugeGradFinal" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#4f46e5" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient></defs>
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-2 sm:mt-4 text-center">
        <h4 className="text-xl sm:text-3xl font-black text-slate-900">{value}%</h4>
        <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5 sm:mt-1">Goal Sync</p>
      </div>
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────

export default function EmployeeAnalyticsView() {
  const router = useRouter();
  const [toggleStatus] = useToggleUserStatusMutation();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  const urlUserId = searchParams.get('userId') || '';
  const urlManagerId = searchParams.get('managerId') || '';
  const urlManagerName = searchParams.get('managerName') || '';

  const [period, setPeriod] = useState('Last 30 Days');
  const [search, setSearch] = useState(urlSearch);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'reports' ? 'reports' : 'overview');
  const [page, setPage] = useState(1);
  const [selectedEmp, setSelectedEmp] = useState<any | null>(null);

  const [customStart, setCustomStart] = useState(new Date().toISOString().split('T')[0]);
  const [customEnd, setCustomEnd] = useState(new Date().toISOString().split('T')[0]);
  const [committedStart, setCommittedStart] = useState(customStart);
  const [committedEnd, setCommittedEnd] = useState(customEnd);

  // Synchronize URL tab parameter with local state
  React.useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'reports') {
      setActiveTab('reports');
    }
  }, [searchParams]);

  const dateRange = useMemo(() => {
    if (period === 'Custom Range') return { startDate: committedStart, endDate: committedEnd };
    const end = new Date(); const start = new Date();
    switch (period) {
      case 'Today': break;
      case 'Last 7 Days': start.setDate(end.getDate() - 7); break;
      case 'Last 30 Days': start.setDate(end.getDate() - 30); break;
      case 'Last 3 Months': start.setMonth(end.getMonth() - 3); break;
      case 'Last 6 Months': start.setMonth(end.getMonth() - 6); break;
      case 'Last 1 Year': start.setFullYear(end.getFullYear() - 1); break;
    }
    return { startDate: start.toISOString().split('T')[0], endDate: end.toISOString().split('T')[0] };
  }, [period, committedStart, committedEnd]);

  const { data: apiTeam, isFetching: loadingTeam } = useGetMyTeamQuery({ userId: urlManagerId || urlUserId, ...dateRange });
  const { data: fleet, isFetching: loadingFleet } = useGetLiveFleetQuery(undefined, { pollingInterval: 30000 });
  const { data: dashStats, isFetching: loadingDashStats } = useGetDashboardStatsQuery(dateRange);
  const { data: payrollStats, isFetching: loadingPayroll } = useGetAdminPayrollOverviewQuery(dateRange);

  const stats = useMemo(() => dashStats?.data, [dashStats]);

  const displayEmployees = useMemo(() => {
    if (!apiTeam) return [];
    return apiTeam.map((u: any) => ({
      id: u.employeeId || u._id,
      name: u.name,
      email: u.email || '',
      designation: u.designation || 'Specialist',
      roleType: u.roleId?.name || 'Personnel',
      workStation: u.territory?.area || u.stations?.[0] || 'Not Assigned',
      subAreas: u.territory?.subArea || u.subAreas || [],
      avatar: u.name.charAt(0),
      avatarBg: 'bg-indigo-600',
      calls: u.stats?.calls ?? 0,
      newClients: u.stats?.newClients ?? 0,
      claimedAmount: `₹${u.stats?.expenses ?? 0}`,
      approvedAmount: `₹${u.stats?.expenses ?? 0}`,
      leaves: u.stats?.leaves ?? 0,
      salesAchieved: `₹${u.stats?.salesAchieved ?? 0}`,
      salesTarget: `₹${u.stats?.salesTarget ?? 0}`,
      salesPercent: u.stats?.salesPercent ?? 0,
      isActive: u.isActive ?? true,
      reportingManager: u.managerId?.name || 'Company Owner',
      chainUsers: u.chainUsers || []
    }));
  }, [apiTeam]);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const analytics = useMemo(() => {
    if (stats && !urlManagerId) {
      return {
        totalCalls: stats.totalCalls || 0,
        totalExpenses: stats.totalExpenses || stats.monthlyExpense || 0,
        totalNewClients: stats.totalNewClients || stats.clientsAdded || 0,
        totalLeaves: stats.totalLeaves || 0
      };
    }
    if (!apiTeam?.length) return null;
    let calls = 0, expenses = 0, clients = 0, leaves = 0;
    apiTeam.forEach((u: any) => {
      calls += (u.stats?.calls || 0);
      expenses += (u.stats?.expenses || 0);
      clients += (u.stats?.newClients || 0);
      leaves += (u.stats?.leaves || 0);
    });
    return { totalCalls: calls, totalExpenses: expenses, totalNewClients: clients, totalLeaves: leaves };
  }, [apiTeam, stats]);

  const filtered = displayEmployees.filter(e => {
    const q = search.toLowerCase();
    return !q || e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.reportingManager.toLowerCase().includes(q);
  });

  const PAGE_SIZE = 10;
  const paginatedEmployees = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  console.log(paginatedEmployees);
  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">

      {/* ── Branded Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between px-4 sm:px-8 py-4 border-b border-slate-100 bg-white shrink-0 gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-8">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95">
              <ChevronLeft size={18} />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 leading-none">Employee Analytics</h1>
              {urlManagerName && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[9px] font-black uppercase tracking-widest border border-indigo-100 flex items-center gap-1.5 animate-in fade-in slide-in-from-left-2 transition-all">
                    <Users size={10} /> {urlManagerName}'s Team
                  </span>
                  <button 
                    onClick={() => router.push('/analytics?tab=reports')}
                    className="text-[9px] font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-tighter"
                  >
                    [Reset Filter]
                  </button>
                </div>
              )}
            </div>
          </div>
          <nav className="flex items-center overflow-x-auto scrollbar-hide -mx-2 sm:mx-0">
            {['Overview', 'Reports'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())} className={`px-3 sm:px-4 py-2 sm:py-2.5 text-[9px] font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${activeTab === tab.toLowerCase() ? 'text-blue-600 border-blue-600' : 'text-slate-400 hover:text-slate-900 border-transparent'}`}>
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6">

        {/* ── Global Filter Bar ── */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
            <div className="space-y-1.5 w-full sm:w-[180px]">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={12} className="text-blue-500" /> Filter Period</label>
              <select value={period} onChange={e => setPeriod(e.target.value)} className="w-full bg-slate-900 text-white rounded-xl px-4 py-2.5 text-xs font-bold shadow-lg outline-none cursor-pointer border-none ring-0">
                {['Today', 'Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'Last 6 Months', 'Last 1 Year', 'Custom Range'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            {period === 'Custom Range' && (
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="space-y-1.5 w-full sm:w-[150px]">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">From Date</label>
                  <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-black outline-none focus:ring-2 focus:ring-blue-500/10" />
                </div>
                <div className="space-y-1.5 w-full sm:w-[150px]">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">To Date</label>
                  <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-black outline-none focus:ring-2 focus:ring-blue-500/10" />
                </div>
                <button
                  onClick={() => { setCommittedStart(customStart); setCommittedEnd(customEnd); }}
                  className="mt-5 w-full sm:w-10 h-10 flex items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
                  title="Apply Custom Range"
                >
                  <Search size={16} />
                </button>
              </div>
            )}
          </div>
          {activeTab !== 'overview' && (
            <div className="flex items-center gap-4 w-full md:w-auto animate-in fade-in zoom-in duration-300">
              <div className="space-y-1.5 flex-1 md:w-[280px]">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Search Member</label>
                <div className="relative group">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Member Name or ID..." className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 transition-all" />
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => router.push('/fleet')}
            className="flex items-center gap-3 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 group active:scale-95 self-end mb-0.5"
          >
            <MapIcon size={14} className="group-hover:animate-bounce" />
            Live Fleet Matrix
          </button>
        </div>

        {/* Dynamic View Logic */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: 'Total Calls', val: analytics?.totalCalls || 0, icon: Phone, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'New Clients', val: analytics?.totalNewClients || 0, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                {
                  label: 'Total Expenditures',
                  subLabel: '(Payroll + Expense)',
                  val: formatINR((payrollStats?.totalPayroll || 0) + (analytics?.totalExpenses || 0)),
                  payroll: formatINR(payrollStats?.totalPayroll || 0),
                  expenses: formatINR(analytics?.totalExpenses || 0),
                  icon: Wallet,
                  color: 'text-amber-600',
                  bg: 'bg-amber-50',
                  loading: loadingPayroll
                },
                { label: 'Leaves Taken', val: analytics?.totalLeaves || 0, icon: Calendar, color: 'text-rose-600', bg: 'bg-rose-50' }
              ].map((m, i) => (
                <div key={i} className={`bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all ${m.loading ? 'animate-pulse opacity-60' : ''}`}>
                  <div className={`w-12 h-12 rounded-2xl ${m.bg} ${m.color} flex items-center justify-center shrink-0`}>
                    <m.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{m.label}</p>
                      {m.subLabel && <p className="text-[8px] font-bold text-slate-400 opacity-60">{m.subLabel}</p>}
                    </div>
                    <h3 className="text-lg font-black text-slate-900 leading-none mb-1">{m.val}</h3>
                    {m.payroll && (
                      <div className="flex items-center gap-3 pt-1 border-t border-slate-50 mt-1">
                        <div className="flex flex-col">
                          <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">Payroll</span>
                          <span className="text-[9px] font-black text-indigo-600">{m.payroll}</span>
                        </div>
                        <div className="flex flex-col border-l border-slate-100 pl-3">
                          <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">Expense</span>
                          <span className="text-[9px] font-black text-amber-600">{m.expenses}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="lg:col-span-2 bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
                {loadingDashStats && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div><h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">Activity Analysis (Calls)</h3><p className="text-[7px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Connectivity Trend</p></div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-50 rounded-lg sm:rounded-xl flex items-center justify-center text-indigo-600"><Phone size={16} className="sm:w-4 sm:h-4" /></div>
                </div>
                <div className="h-[200px] sm:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={
                      (stats?.callTrend && stats.callTrend.length > 0) ? stats.callTrend :
                        (stats?.interactionTrend && stats.interactionTrend.length > 0) ? stats.interactionTrend :
                          (stats?.activityMetrics && stats.activityMetrics.length > 0) ? stats.activityMetrics.map((m: any) => ({ month: m.label || 'Other', value: m.value })) :
                            Array.from({ length: 12 }, (_, i) => ({ month: MONTHS[i], value: 0 }))
                    }>
                      <defs><linearGradient id="callsGradRestore" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} /><stop offset="95%" stopColor="#4f46e5" stopOpacity={0} /></linearGradient></defs>
                      <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} dy={10} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '10px', fontWeight: 900 }} />
                      <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#callsGradRestore)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mb-2">Target vs Achievement</h3>
                <PerformanceGauge value={stats?.achievementPercentage || 0} />
                <div className="mt-6 sm:mt-10 grid grid-cols-2 gap-3 sm:gap-4 w-full">
                  <div className="bg-slate-900 rounded-[16px] sm:rounded-[24px] p-3 sm:p-4 text-left relative overflow-hidden group shadow-xl">
                    <p className="text-slate-400 text-[7px] font-black uppercase tracking-widest mb-1">Total Sales</p>
                    <h3 className="text-white text-sm sm:text-base font-black tracking-tighter whitespace-nowrap">{formatINR(stats?.monthlyAchievement || 0)}</h3>
                  </div>
                  <div className="bg-indigo-600 rounded-[16px] sm:rounded-[24px] p-3 sm:p-4 text-left relative overflow-hidden group shadow-xl">
                    <p className="text-indigo-200 text-[7px] font-black uppercase tracking-widest mb-1">Target</p>
                    <h3 className="text-white text-sm sm:text-base font-black tracking-tighter whitespace-nowrap">{formatINR(stats?.monthlyTarget || 0)}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
                {loadingDashStats && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <div className="flex items-center justify-between mb-8 sm:mb-10">
                  <div><h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight text-amber-500">Field Expense Footprint</h3><p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Audited Field Spend Breakdown</p></div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-amber-500"><Wallet size={18} className="sm:w-5 sm:h-5" /></div>
                </div>
                <div className="h-[200px] sm:h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={
                      (stats?.expenseTrend && stats.expenseTrend.length > 0) ? stats.expenseTrend :
                        (stats?.expenseDistribution && stats.expenseDistribution.length > 0) ? (() => {
                          const groups: Record<string, number> = {};
                          stats.expenseDistribution.forEach((m: any) => {
                            const key = m.label === 'OUTSTATION' ? 'OUT STATION' : 'NORMAL';
                            groups[key] = (groups[key] || 0) + (m.value || 0);
                          });
                          return Object.entries(groups).map(([label, value]) => ({ month: label, value }));
                        })() :
                          (() => {
                            const currentMonth = MONTHS[new Date().getMonth()];
                            const total = stats?.totalExpenses || stats?.monthlyExpense || 0;
                            return MONTHS.map(m => ({ month: m, value: m === currentMonth ? total : 0 }));
                          })()
                    }>
                      <defs><linearGradient id="expGradRestore" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} /><stop offset="95%" stopColor="#f59e0b" stopOpacity={0} /></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} dy={10} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', fontSize: '10px', fontWeight: 900 }} />
                      <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={4} fill="url(#expGradRestore)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
                {loadingDashStats && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div><h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight text-emerald-600">Client Acquisition</h3><p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">New Business Expansion</p></div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-emerald-600"><Users size={18} className="sm:w-5 sm:h-5" /></div>
                </div>
                <div className="h-[200px] sm:h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={
                      (stats?.salesTrend && stats.salesTrend.length > 0) ? stats.salesTrend :
                        (() => {
                          const currentMonth = MONTHS[new Date().getMonth()];
                          const total = analytics?.totalNewClients || 0;
                          return MONTHS.map(m => ({ month: m, value: m === currentMonth ? total : 0 }));
                        })()
                    }>
                      <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} dy={10} />
                      <YAxis hide />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', fontSize: '10px', fontWeight: 900 }} />
                      <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} barSize={20} />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 border border-slate-100 shadow-sm relative overflow-hidden lg:col-span-2">
                {loadingDashStats && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div><h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight text-rose-600">Leave Utilization</h3><p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">HR Continuity Monitoring</p></div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-rose-600"><Calendar size={18} className="sm:w-5 sm:h-5" /></div>
                </div>
                <div className="h-[200px] sm:h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats?.leaveTrend || Array.from({ length: 12 }, (_, i) => ({ month: MONTHS[i], value: 0 }))}>
                      <defs><linearGradient id="leaveGradRestore" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} /><stop offset="95%" stopColor="#f43f5e" stopOpacity={0} /></linearGradient></defs>
                      <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} dy={10} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', fontSize: '10px', fontWeight: 900 }} />
                      <Area type="stepAfter" dataKey="value" stroke="#f43f5e" strokeWidth={3} fill="url(#leaveGradRestore)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Reports Tab: Personnel Intelligence Center ── */}
        {activeTab === 'reports' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">

            {/* ── Layer 1: High-Audit KPI Row (Mirroring Overview UI) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: 'Total Calls', val: analytics?.totalCalls || 0, icon: Phone, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'New Clients', val: analytics?.totalNewClients || 0, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                {
                  label: 'Total Expenditure',
                  subLabel: '(Payroll + Expense)',
                  desc: 'Audited Payouts',
                  val: formatINR((payrollStats?.totalPayroll || 0) + (analytics?.totalExpenses || 0)),
                  icon: DollarSign,
                  color: 'text-slate-900',
                  bg: 'bg-slate-100'
                },
                { label: 'Leaves Count', val: analytics?.totalLeaves || 0, icon: Calendar, color: 'text-rose-600', bg: 'bg-rose-50' }
              ].map((m, i) => (
                <div key={i} className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-xl transition-all duration-300">
                  <div className={`w-12 h-12 rounded-2xl ${m.bg} ${m.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <m.icon size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
                    </div>
                    <p className="text-xl font-black text-slate-900 tracking-tight italic">{m.val}</p>
                    {m.desc && <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1 opacity-60 leading-none">{m.desc}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Layer 2: Personnel Intelligence Registry (Full Width) ── */}
            <div className="bg-white border border-slate-100 rounded-[48px] overflow-hidden shadow-sm">
              <div className="px-8 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Personnel Intelligence Report</h3>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Comprehensive Activity & Financial Audit Trail</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200">
                    Registry Index: {filtered.length} Personnel
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/10">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Personnel Intelligence</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Role</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Total Calls</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">New Clients</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Expenditure</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Target vs Ach.</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Leaves Taken</th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {paginatedEmployees.map((e) => (
                      <tr key={e.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td 
                          className="px-8 py-4 cursor-pointer group/name" 
                          onClick={() => setSelectedEmp(e)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-base shadow-md group-hover/name:scale-110 transition-transform">{e.avatar}</div>
                            <div>
                              <p className="text-xs font-black text-slate-900 tracking-tight group-hover/name:text-blue-600 transition-colors">{e.name}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{e.id}</p>
                                <button onClick={() => router.push('/fleet')} className="text-indigo-400 hover:text-indigo-600 transition-colors p-1" title="View in Live Fleet">
                                  <MapPin size={10} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest">{e.roleType || 'Personnel'}</span>
                        </td>
                        <td className="px-6 py-4 font-black text-slate-700 text-[11px]">
                          {e.calls || 0}
                        </td>
                        <td className="px-6 py-4 font-black text-emerald-600 text-[11px]">
                          {e.newClients || 0}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[11px] font-black text-slate-900">{e.claimedAmount}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-[9px] font-black text-slate-900 uppercase tracking-tighter italic">{e.salesAchieved}</span>
                              <span className="text-[8px] font-bold text-slate-400">Target: {e.salesTarget}</span>
                            </div>
                            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${Math.min(e.salesPercent, 100)}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-xs font-black text-slate-700">{e.leaves || 0}</span>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <button
                            onClick={async () => {
                              try {
                                await toggleStatus({ userId: e.id, isActive: !e.isActive }).unwrap();
                              } catch (err) {
                                console.error("Failed to toggle status:", err);
                              }
                            }}
                            className={`w-8 h-4 rounded-full relative transition-all duration-300 ${e.isActive ? 'bg-emerald-500' : 'bg-slate-300'} mx-auto block`}
                            title={e.isActive ? "Deactivate User" : "Activate User"}
                          >
                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300 ${e.isActive ? 'left-[18px]' : 'left-0.5'}`} />
                          </button>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button
                            onClick={() => setSelectedEmp(e)}
                            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-100 active:scale-95"
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Advanced Pagination */}
              <div className="px-8 py-6 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic opacity-60">
                  Personnel Registry Logs {(page - 1) * PAGE_SIZE + 1} - {Math.min(filtered.length, page * PAGE_SIZE)} of {filtered.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:text-blue-600 hover:bg-white disabled:opacity-20 transition-all font-black shadow-sm"
                  ><ChevronLeft size={16} /></button>
                  <div className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-[11px] font-black text-slate-900 shadow-sm">{page} / {Math.ceil(filtered.length / PAGE_SIZE) || 1}</div>
                  <button
                    disabled={page * PAGE_SIZE >= filtered.length}
                    onClick={() => setPage(p => p + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:text-blue-600 hover:bg-white disabled:opacity-20 transition-all font-black shadow-sm"
                  ><ChevronRight size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {selectedEmp && (
        <EmployeeDrawer 
          key={selectedEmp.id}
          emp={selectedEmp} 
          onClose={() => setSelectedEmp(null)} 
          onSelectUser={(u) => setSelectedEmp(u)}
        />
      )}
    </div>
  );
}
