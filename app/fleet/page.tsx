'use client';

import FleetMapView from '@/components/fleet/FleetMapView';
import React, { Suspense } from 'react';

export default function FleetPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-[#0f111a] flex items-center justify-center text-white/50 text-xs font-black uppercase tracking-[0.5em] animate-pulse">Initializing Fleet Matrix...</div>}>
      <FleetMapView />
    </Suspense>
  );
}
