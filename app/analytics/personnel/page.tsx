'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

const EmployeeProfileView = dynamic(
  () => import('@/components/analytics/EmployeeProfileView'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
      </div>
    ),
  }
);

function PersonnelContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <p className="text-sm font-black uppercase tracking-widest leading-loose">No Personnel Selected</p>
        <p className="text-[10px] font-bold">Please select a team member from the analytics dashboard</p>
      </div>
    );
  }

  return <EmployeeProfileView employeeId={id} />;
}

export default function PersonnelPage() {
  return (
    <Suspense fallback={
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
      </div>
    }>
      <PersonnelContent />
    </Suspense>
  );
}
