'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// ─── Lazy-loaded views (each becomes its own JS chunk) ────────────────────────

const LoadingView = () => (
  <div className="flex h-full items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading</p>
    </div>
  </div>
);

const HierarchyView      = dynamic(() => import('@/components/team/HierarchyView'),      { loading: LoadingView, ssr: false });
const ConfigureMemberView = dynamic(() => import('@/components/team/ConfigureMemberView'), { loading: LoadingView, ssr: false });
const LeaveConfigView    = dynamic(() => import('@/components/team/LeaveConfigView'),    { loading: LoadingView, ssr: false });
const PayrollView        = dynamic(() => import('@/components/team/PayrollView'),        { loading: LoadingView, ssr: false });
const ExpenseView        = dynamic(() => import('@/components/team/ExpenseView'),        { loading: LoadingView, ssr: false });

// ─── Router ───────────────────────────────────────────────────────────────────

function TeamPageContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view');

  if (view === 'create' || view === 'create-user') return <ConfigureMemberView />;
  if (view === 'leave')   return <LeaveConfigView />;
  if (view === 'payroll') return <PayrollView />;
  if (view === 'expense') return <ExpenseView />;
  return <HierarchyView />;
}

export default function TeamPage() {
  return (
    <Suspense fallback={<LoadingView />}>
      <TeamPageContent />
    </Suspense>
  );
}
