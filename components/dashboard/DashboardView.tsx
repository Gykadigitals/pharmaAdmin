'use client';

import React, { Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLayout } from '@/context/LayoutContext';
import { useGetDashboardStatsQuery, useExportDashboardMutation } from '@/store/api/dashboardApi';
import { 
  useGetAdminPayrollOverviewQuery 
} from '@/store/api/userApi';
import MetricCard from '@/components/dashboard/MetricCard';
import dynamic from 'next/dynamic';
import { 
  Users, 
  PhoneCall, 
  UserPlus, 
  CircleDollarSign, 
  Target, 
  PieChart, 
  FileText,
  Navigation
} from 'lucide-react';
import Link from 'next/link';

// ─── SaaS Optimized Lazy Loading for Charts ───────────────────────────────────

const ChartSkeleton = () => (
  <div className="bg-white rounded-[32px] p-8 h-[400px] shadow-sm border border-slate-100 flex items-center justify-center animate-pulse">
    <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin" />
  </div>
);

const MonthlySalesTrend   = dynamic(() => import('@/components/dashboard/MonthlySalesTrend'),   { loading: ChartSkeleton, ssr: false });
const SalesVsTarget       = dynamic(() => import('@/components/dashboard/SalesVsTarget'),       { loading: ChartSkeleton, ssr: false });
const TopPerformers       = dynamic(() => import('@/components/dashboard/TopPerformers'),       { loading: ChartSkeleton, ssr: false });
const WeakPerformers      = dynamic(() => import('@/components/dashboard/WeakPerformers'),      { loading: ChartSkeleton, ssr: false });
const TeamPerformanceTable = dynamic(() => import('@/components/dashboard/TeamPerformanceTable'), { loading: ChartSkeleton, ssr: false });
const ExpensesDonutChart  = dynamic(() => import('@/components/dashboard/ExpensesDonutChart'),  { loading: ChartSkeleton, ssr: false });
const ReportGenerator      = dynamic(() => import('@/components/dashboard/ReportGenerator'),      { loading: ChartSkeleton, ssr: false });
const CompensationDonutChart = dynamic(() => import('@/components/dashboard/CompensationDonutChart'), { loading: ChartSkeleton, ssr: false });

const DashboardView = () => {
  const { stats: contextStats, token } = useAuth();
  const { dateRange } = useLayout();
  const { 
    data: dashboardResult, 
    isFetching: isSyncing 
  } = useGetDashboardStatsQuery(
    { startDate: dateRange?.startDate || '', endDate: dateRange?.endDate || '' },
    { skip: !token || !dateRange?.startDate }
  );

  const { data: payrollResult } = useGetAdminPayrollOverviewQuery(
    { startDate: dateRange?.startDate || '', endDate: dateRange?.endDate || '' },
    { skip: !token || !dateRange?.startDate }
  );

  const payrollStats = payrollResult?.data;

  const [exportDashboard] = useExportDashboardMutation();

  const stats = React.useMemo(() => {
    if (dashboardResult?.success) return dashboardResult.data;
    if (contextStats) return contextStats;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('auth_stats');
      if (saved) return JSON.parse(saved);
    }
    return null;
  }, [dashboardResult, contextStats]);

  const formatCurrency = (val: number) => {
    if (val === undefined || val === null) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatNumber = (val: number) => {
    if (val === undefined || val === null) return '0';
    return new Intl.NumberFormat('en-IN').format(val);
  };

  const isTodaySelected = React.useMemo(() => {
    if (!dateRange) return true;
    const todayStr = new Date().toISOString().split('T')[0];
    return dateRange.startDate === todayStr && dateRange.endDate === todayStr;
  }, [dateRange]);

  const rows = [
    [
      { label: 'TOTAL EMPLOYEES', value: stats ? formatNumber(stats.totalEmployees) : '...', change: '+0%', isPositive: true, icon: Users, href: '/analytics?tab=reports' },
      { label: 'TOTAL CALLS', value: stats ? formatNumber(stats.totalCalls) : '...', change: 'In Range', isPositive: true, icon: PhoneCall },
      { label: 'CLIENTS ADDED', value: stats ? formatNumber(stats.clientsAdded) : '...', change: 'In Range', isPositive: true, icon: UserPlus },
    ],
    [
      { label: 'SALES ACHIEVED', value: stats ? formatCurrency(stats.monthlyAchievement) : '...', change: 'Month-wise', isPositive: true, icon: CircleDollarSign },
      { label: 'TARGET ASSIGNED', value: stats ? formatCurrency(stats.monthlyTarget) : '...', change: 'Monthly', isPositive: true, icon: Target },
      { label: 'ACHIEVEMENT %', value: stats ? `${(stats.achievementPercentage || 0).toFixed(1)}%` : '...', change: 'Month-wise', isPositive: true, icon: PieChart },
      { label: 'EXPENSES CLAIMED', value: stats ? formatCurrency(stats.monthlyExpense) : '...', change: 'Month-wise', isPositive: true, icon: FileText },
    ]
  ];

  const handleDownload = async (type: string) => {
    try {
      await exportDashboard(type).unwrap();
    } catch (err) {
      console.error('❌ Failed to export:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 pb-12">
      {isSyncing && (
        <div className="fixed top-24 right-8 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-indigo-100 shadow-lg flex items-center gap-3 z-50 animate-in fade-in slide-in-from-right-4">
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping" />
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Syncing Live Data...</span>
        </div>
      )}

      {/* 1. Metrics Grid */}
      <div className="space-y-6">
        {rows.map((row, i) => (
          <div key={i} className={`grid grid-cols-1 md:grid-cols-2 ${row.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6`}>
            {row.map((item, j) => (
              <MetricCard key={j} {...item} />
            ))}
          </div>
        ))}
      </div>

      {/* 2. Primary Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MonthlySalesTrend data={stats?.salesTrend} />
        <SalesVsTarget 
          sales={stats?.monthlyAchievement} 
          target={stats?.monthlyTarget} 
          percentage={stats?.achievementPercentage} 
        />
      </div>

      {/* 3. Performance & Talent Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <TopPerformers data={stats?.topPerformers?.slice(0, 4)} />
        <WeakPerformers 
          data={stats?.weakPerformers || (stats?.teamPerformance ? 
            [...stats.teamPerformance]
              .filter((m: any) => !stats.topPerformers?.some((t: any) => t.name === m.name)) // Exclude Top Performers
              .sort((a: any, b: any) => (a.newClients - b.newClients) || (a.calls - b.calls))
              .slice(0, 3) 
            : [])} 
        />
        <CompensationDonutChart 
          total={payrollStats?.totalPayroll || 0}
          data={payrollStats?.distribution}
          month={dateRange?.startDate ? new Date(dateRange.startDate).toLocaleString('default', { month: 'short', year: 'numeric' }).toUpperCase() : undefined}
        />
      </div>

      {/* 4. Distribution & Utility Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ExpensesDonutChart 
          data={stats?.expenseDistribution} 
          total={stats?.monthlyExpense} 
        />
         <ReportGenerator onDownload={handleDownload} />
      </div>

      {/* 5. Team Section */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <TeamPerformanceTable data={stats?.teamPerformance} />
      </div>

    </div>
  );
};

export default DashboardView;
