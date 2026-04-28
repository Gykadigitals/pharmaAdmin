'use client';

import React from 'react';
import dynamic from 'next/dynamic';

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

interface Props {
  params: Promise<{ id: string }>;
}

export default function EmployeeProfilePage({ params }: Props) {
  const { id } = React.use(params);
  return <EmployeeProfileView employeeId={id} />;
}
