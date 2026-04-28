'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  X, Printer, MessageSquare, Users, TrendingUp, ArrowUpRight,
  ExternalLink, Mail, MapPin, ShieldCheck, History, Award, Calendar, ChevronDown, Activity, Navigation
} from 'lucide-react';
import { useGetProfileStatsQuery, useGetMyTeamQuery } from '@/store/api/userApi';
import { createPortal } from 'react-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChainMember {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'offline' | 'on-field';
  avatar: string;
}

export interface DetailedEmployee {
  id: string;
  name: string;
  email: string;
  designation: string;
  roleType: string;
  workStation: string;
  subAreas?: string[];
  avatar: string;
  avatarBg?: string;
  calls: number;
  newClients: number;
  claimedAmount: string;
  approvedAmount: string;
  leaves: number;
  isActive: boolean;
  reportingManager: string;
  chainUsers?: ChainMember[];
}

export interface EmployeeDrawerProps {
  emp: DetailedEmployee;
  onClose: () => void;
  onSelectUser?: (user: DetailedEmployee) => void;
}

type TimePeriod = 'Today' | 'Last 7 Days' | 'Last 30 Days' | 'Last 3 Months' | 'Last 6 Months' | 'Last 1 Year' | 'Custom Range';

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────

const MiniBarChart = ({ values, color }: { values: number[], color: string }) => {
  if (!values || values.length === 0) return <div className="h-10 border-b border-slate-100/50 flex items-end"><span className="text-[8px] text-slate-300 font-bold uppercase tracking-widest pl-1">No Data Available</span></div>;
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-1.5 h-10 w-full">
      {values.map((v, i) => (
        <div key={i} className="flex-1 bg-indigo-50 rounded-t-sm hover:brightness-95 transition-all relative group" style={{ height: `${(v / max) * 100}%` }}>
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none tracking-widest">{v}</div>
        </div>
      ))}
    </div>
  );
};

// ─── Main Drawer Component ───────────────────────────────────────────────────

export default function EmployeeDrawer({ emp, onClose, onSelectUser }: EmployeeDrawerProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [period, setPeriod] = useState<TimePeriod>('Today');
  const [showTeamPerformance, setShowTeamPerformance] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🗓️ Manual Custom Range State
  const [customStart, setCustomStart] = useState(new Date().toISOString().split('T')[0]);
  const [customEnd, setCustomEnd] = useState(new Date().toISOString().split('T')[0]);

  // 📅 Calculate Date Range Logic
  const dateRange = useMemo(() => {
    if (period === 'Custom Range') {
      return { startDate: customStart, endDate: customEnd };
    }

    const end = new Date();
    const start = new Date();

    switch (period) {
      case 'Today':
        break;
      case 'Last 7 Days':
        start.setDate(end.getDate() - 7);
        break;
      case 'Last 30 Days':
        start.setDate(end.getDate() - 30);
        break;
      case 'Last 3 Months':
        start.setMonth(end.getMonth() - 3);
        break;
      case 'Last 6 Months':
        start.setMonth(end.getMonth() - 6);
        break;
      case 'Last 1 Year':
        start.setFullYear(end.getFullYear() - 1);
        break;
      default:
        break;
    }

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  }, [period, customStart, customEnd]);

  // 📡 Dynamic Data Fetching
  const { data: profileResult, isFetching: loadingStats } = useGetProfileStatsQuery(
    { id: emp.id, ...dateRange },
    { skip: !emp.id }
  );

  const stats = profileResult?.success ? profileResult.data : null;

  const { data: dynamicTeam } = useGetMyTeamQuery(
    { userId: emp.id },
    { skip: !emp.id }
  );

  const chainUsers = dynamicTeam && dynamicTeam.length > 0 ? dynamicTeam : (emp.chainUsers || []);

  const teamStats = useMemo(() => {
    let calls = 0, expenses = 0, clients = 0, leaves = 0;
    if (chainUsers) {
      chainUsers.forEach((u: any) => {
        calls += (u.stats?.calls || 0);
        expenses += (u.stats?.expenses || 0);
        clients += (u.stats?.newClients || 0);
        leaves += (u.stats?.leaves || 0);
      });
    }
    return { calls, expenses, clients, leaves };
  }, [chainUsers]);

  useEffect(() => {
    if (!mounted) return;
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, [mounted]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 400);
  };

  const navigateToTeam = () => {
    router.push(`/analytics?view=analytics&userId=${encodeURIComponent(emp.id)}`);
    handleClose();
  };

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[1000] transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'
          }`}
      />

      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[520px] bg-[#fdfdfe] z-[1001] shadow-[0_0_100px_rgba(0,0,0,0.2)] flex flex-col min-h-0 overflow-hidden transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          ${visible ? 'translate-x-0' : 'translate-x-[110%]'}`}
      >
        {/* Modified Premium Header with Glassmorphism */}
        <div className="sticky top-0 z-20 shrink-0 pt-2 px-8 pb-8 bg-white/80 backdrop-blur-md border-b border-slate-100/50">
          <button
            onClick={handleClose}
            className="absolute top-6 right-8 w-10 h-10 rounded-2xl bg-slate-100/50 flex items-center justify-center text-slate-400 hover:bg-rose-500 hover:text-white transition-all active:scale-95 shadow-sm"
          >
            <X size={18} />
          </button>

          <div className="flex flex-col gap-6">
            <Link 
              href={`/analytics/personnel?id=${emp.id}`}
              className="flex items-center gap-5 group/head cursor-pointer hover:opacity-80 transition-all"
            >
              <div className={`w-20 h-20 rounded-3xl ${emp.avatarBg || 'bg-indigo-600'} flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-indigo-200 border-4 border-white group-hover/head:scale-105 transition-transform`}>
                {emp.avatar || emp.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">{emp.name}</h2>
                  <ArrowUpRight className="text-slate-300 group-hover/head:text-indigo-600 group-hover/head:translate-x-0.5 group-hover/head:-translate-y-0.5 transition-all" size={20} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.15em]">{emp.designation}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
              </div>
            </Link>

            {/* 📅 Period Selector Dropdown */}
            <div className="flex flex-col gap-3 shadow-lg bg-slate-50 p-2 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar size={14} className="text-slate-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter Period</span>
                </div>
                <div className="relative">
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as TimePeriod)}
                    className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-10 text-[11px] font-black text-slate-700 outline-none focus:border-indigo-300 transition-all cursor-pointer shadow-sm"
                  >
                    {['Today', 'Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'Last 6 Months', 'Last 1 Year', 'Custom Range'].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* 🗓️ Custom Date Pickers */}
              {period === 'Custom Range' && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex-1 space-y-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">From</p>
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-bold text-slate-700 outline-none"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">To</p>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content Engine */}
        <div className="flex-1 overflow-y-auto min-h-0 px-8 custom-scrollbar">

          {/* Identity Grid Section */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-slate-50/50 shadow-lg p-4 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Employee ID</p>
              <p className="text-xs font-black text-slate-900">{emp.id || 'N/A'}</p>
            </div>
            {!(emp.designation?.toLowerCase().includes('admin') || emp.designation?.toLowerCase().includes('hr') || emp.roleType?.toLowerCase().includes('admin') || emp.roleType?.toLowerCase().includes('hr')) && (
              <div className="bg-slate-50/50 shadow-lg p-4 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Work Location</p>
                <p className="text-xs font-black text-slate-900">{emp.workStation || 'Field Operations'}</p>
              </div>
            )}
            <div className="bg-slate-50/50 shadow-lg p-4 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Role Type</p>
              <p className="text-xs font-black text-slate-900">{emp.designation || 'Personnel'}</p>
            </div>
            <div className="bg-slate-50/50 shadow-lg p-4 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Role Group</p>
              <p className="text-xs font-black text-slate-900">{emp.roleType || 'On-Field'}</p>
            </div>
            <div className="bg-blue-50/50 shadow-lg p-4 rounded-2xl border border-blue-100 col-span-2">
              <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Current Manager</p>
              <p className="text-xs font-black text-blue-600">{emp.reportingManager || 'Company Owner'}</p>
            </div>
            {emp.subAreas && emp.subAreas.length > 0 && (
              <div className="bg-slate-50/50 p-4 mb-2 rounded-2xl border border-slate-100 col-span-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Assigned Sub Areas</p>
                <div className="flex flex-wrap gap-1.5">
                  {emp.subAreas.map((sa, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[9px] font-black text-slate-600 uppercase tracking-tighter">
                      {sa}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats Dashboard (Dynamic Connection) */}
          <div className="grid grid-cols-3 gap-3 relative">
            {loadingStats && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-3xl">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {[
              { label: 'Calls', value: stats?.stats?.calls ?? 0, color: 'text-slate-900' },
              { label: 'New Clients', value: stats?.stats?.newClients ?? 0, color: 'text-indigo-600' },
              { label: 'Listed Active', value: stats?.stats?.listedActive ?? 0, color: 'text-emerald-500' },
              { label: 'Listed Inactive', value: stats?.stats?.listedInactive ?? 0, color: 'text-rose-500' },
              { label: 'Unlisted', value: stats?.stats?.unlisted ?? 0, color: 'text-slate-600' },
              { label: 'Expenses', value: `₹${stats?.stats?.expenses ?? 0}`, color: 'text-slate-900' },
              { label: 'Leaves', value: stats?.stats?.leaves ?? '00', color: (stats?.stats?.leaves ?? 0) > 0 ? 'text-rose-500' : 'text-slate-400' },
            ].map((stat, i) => (
              <div key={i} className={`bg-white p-4 mb-3 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-slate-200 ${stat.label === 'Leaves' ? 'col-span-1' : ''}`}>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                <p className={`text-xl font-black tracking-tight ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Sales Projection (Dynamic Connection) */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl shadow-slate-200">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-extra-widest">Sales Performance Achievement</p>
                <div className="flex items-center gap-1.5 text-indigo-400">
                  <TrendingUp size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{period === 'Today' ? 'LIVE NOW' : period.toUpperCase()}</span>
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">{stats?.sales?.achieved ?? '₹0L'}</span>
                <span className="text-sm font-bold text-slate-500 tracking-tight">/ {stats?.sales?.target ?? '₹0L'}</span>
              </div>

              <div className="space-y-3">
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-blue-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(stats?.sales?.percent ?? 0, 100)}%` }}
                  />
                </div>
                <div className="flex items-baseline justify-between">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stats?.sales?.percent ?? 0}% of Goal Reach</p>
                  <span className="text-xl font-black text-white tracking-tighter">{stats?.sales?.percent ?? 0}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Breakdown (Dynamic Trend Connection) */}
          <div className="space-y-4 mt-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Activity size={14} className="text-indigo-500" /> Performance Activity Trends
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Interaction Density</p>
                <MiniBarChart values={stats?.interactionTrend ?? []} color="#4f46e5" />
                {loadingStats && <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />}
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 w-full text-center">Efficiency Score</p>
                <div className="relative w-14 h-14">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-50" />
                    <circle
                      cx="28" cy="28" r="24"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray="150"
                      strokeDashoffset={150 - (150 * (stats?.sales?.percent ?? 0)) / 100}
                      className="text-indigo-600 transition-all duration-1000 ease-in-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black">{stats?.sales?.percent ?? 0}%</div>
                </div>
                {loadingStats && <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />}
              </div>
            </div>
          </div>

          {/* Dynamic Associated Team Access (Conditional for Managers) */}
          {chainUsers && chainUsers.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Users size={16} className="text-indigo-500" /> Organizational Hierarchy ({chainUsers.length})
                </h3>
              </div>

              <div className="max-h-48 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                {chainUsers.map((u: any, idx: number) => (
                  <div 
                    key={u.id || u._id || idx} 
                    onClick={() => {
                        if (onSelectUser) {
                            onSelectUser({
                              id: u.employeeId || u._id || u.id,
                              name: u.name,
                              email: u.email || '',
                              designation: u.designation || 'Specialist',
                              roleType: u.role || u.roleId?.name || 'Personnel',
                              workStation: u.territory?.area || u.stations?.[0] || 'Not Assigned',
                              subAreas: u.territory?.subArea || u.subAreas || [],
                              avatar: u.avatar || (u.name ? u.name.charAt(0).toUpperCase() : '?'),
                              calls: u.stats?.calls ?? 0,
                              newClients: u.stats?.newClients ?? 0,
                              claimedAmount: `₹${u.stats?.expenses ?? 0}`,
                              approvedAmount: `₹${u.stats?.expenses ?? 0}`,
                              leaves: u.stats?.leaves ?? 0,
                              isActive: u.isActive ?? true,
                              reportingManager: emp.name,
                              chainUsers: u.chainUsers || []
                            });
                        }
                    }}
                    className={`flex items-center gap-3 p-2 rounded-xl border border-transparent transition-all ${onSelectUser ? 'cursor-pointer hover:bg-indigo-50 hover:border-indigo-100' : 'hover:bg-slate-50 hover:border-slate-100'}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-[10px] shrink-0">
                      {u.avatar || (u.name ? u.name.charAt(0).toUpperCase() : '?')}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-[11px] font-black text-slate-900 truncate leading-none mb-1">{u.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate leading-none">
                        {u.designation || u.role || u.roleId?.name || 'Personnel'}
                      </p>
                    </div>
                    {onSelectUser && <ArrowUpRight size={14} className="text-slate-300 mx-2" />}
                  </div>
                ))}
              </div>

              {showTeamPerformance && (
                <div className="grid grid-cols-2 gap-3 mt-4 animate-in slide-in-from-top-4 fade-in duration-300 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="bg-white border border-slate-100 p-3 rounded-xl flex flex-col justify-center shadow-sm">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Calls</p>
                      <p className="text-sm font-black text-indigo-600 leading-none">{teamStats.calls}</p>
                    </div>
                    <div className="bg-white border border-slate-100 p-3 rounded-xl flex flex-col justify-center shadow-sm">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">New Clients</p>
                      <p className="text-sm font-black text-emerald-600 leading-none">{teamStats.clients}</p>
                    </div>
                    <div className="bg-white border border-slate-100 p-3 rounded-xl flex flex-col justify-center shadow-sm">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Expenditure</p>
                      <p className="text-sm font-black text-amber-600 leading-none">₹{teamStats.expenses}</p>
                    </div>
                    <div className="bg-white border border-slate-100 p-3 rounded-xl flex flex-col justify-center shadow-sm">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Leaves Taken</p>
                      <p className="text-sm font-black text-rose-600 leading-none">{teamStats.leaves}</p>
                    </div>
                </div>
              )}

              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={() => setShowTeamPerformance(p => !p)}
                  className="w-full flex items-center justify-center gap-3 bg-indigo-50 py-3 rounded-2xl text-indigo-600 font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all group scale-100 active:scale-95 shadow-sm"
                >
                  {showTeamPerformance ? 'Hide Quick Analysis' : 'Show Quick Analysis'}
                  <ArrowUpRight size={16} className={`transition-transform ${showTeamPerformance ? '-rotate-[135deg]' : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'}`} />
                </button>

                <button
                  onClick={() => {
                    router.push(`/analytics?managerId=${emp.id}&tab=reports&managerName=${encodeURIComponent(emp.name)}`);
                    handleClose();
                  }}
                  className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all group scale-100 active:scale-95 shadow-xl shadow-slate-200"
                >
                  View Full Team Performance
                  <TrendingUp size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* Integrated Action Buttons */}
          <div className="space-y-4 pt-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" /> Engagement & Tracking
            </h3>
            <div className="flex flex-col gap-3">
              <Link
                href={`/analytics/personnel?id=${emp.id}`}
                className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900/5 text-slate-900 font-black text-[11px] rounded-2xl hover:bg-slate-900 hover:text-white transition-all uppercase tracking-widest active:scale-95 leading-none shadow-sm"
              >
                <ExternalLink size={16} /> View Personnel Details
              </Link>
              <Link
                href={`/fleet?focus=${emp.id}`}
                className="w-full flex items-center justify-center gap-3 py-4 bg-indigo-600 text-white font-black text-[11px] rounded-2xl hover:bg-slate-900 transition-all uppercase tracking-widest shadow-xl shadow-indigo-100 active:scale-95 leading-none"
              >
                <Navigation size={16} fill="white" /> Track Live Location
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>,
    document.body
  );
}
