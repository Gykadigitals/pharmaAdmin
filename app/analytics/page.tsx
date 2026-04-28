'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import RolesArchitectureView from '@/components/analytics/RolesArchitectureView';

const EmployeeAnalyticsView = dynamic(
  () => import('@/components/analytics/EmployeeAnalyticsView'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
      </div>
    ),
  }
);

export default function AnalyticsPage() {
  // Always return the main analytics table as the entry point
  return <EmployeeAnalyticsView />;
}
