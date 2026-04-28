'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetLiveFleetQuery } from '@/store/api/userApi';
import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import {
   Search, Navigation, LayoutGrid, Users, Settings, ArrowUpRight,
   Map as MapIcon, ChevronRight, AlertTriangle, Clock, Zap, Activity
} from 'lucide-react';
import { IMAGE_BASE_URL } from '@/constant/api';

// ─── Dynamic Map Component (SSR Safety) ───────────────────────────────────────
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const ZoomControl = dynamic(() => import('react-leaflet').then(mod => mod.ZoomControl), { ssr: false });

export default function FleetMapView() {
   const router = useRouter();
   const { company } = useAuth();
   const searchParams = useSearchParams();
   const focusId = searchParams.get('focus');

   const { data: fleet, isLoading } = useGetLiveFleetQuery(undefined, { pollingInterval: 5000 });
   const [L, setL] = useState<any>(null);
   const [searchQuery, setSearchQuery] = useState('');
   const [currentTime, setCurrentTime] = useState(new Date());

   useEffect(() => {
      import('leaflet').then((leaflet) => {
         setL(leaflet);
      });
      const timer = setInterval(() => setCurrentTime(new Date()), 1000);
      return () => clearInterval(timer);
   }, []);

   // ─── Dynamic Calculations ───
   const stats = useMemo(() => {
      if (!fleet) return { online: 0, offline: 0, moving: 0, total: 0 };
      const online = fleet.filter((u: any) => u.isOnline).length;
      const moving = fleet.filter((u: any) => u.isOnline && (Date.now() - new Date(u.lastSeen).getTime() < 60000)).length; // Moving if sync < 1m
      return {
         online,
         offline: fleet.length - online,
         moving,
         total: fleet.length
      };
   }, [fleet]);

   const filteredFleet = useMemo(() => {
      if (!fleet) return [];
      if (!searchQuery.trim()) return fleet;
      const query = searchQuery.toLowerCase();
      return fleet.filter((u: any) =>
         u.name.toLowerCase().includes(query) ||
         (u.designation && u.designation.toLowerCase().includes(query)) ||
         (u.employeeId && u.employeeId.toLowerCase().includes(query))
      );
   }, [fleet, searchQuery]);

   const focusedUser = useMemo(() => fleet?.find((u: any) => u.id === focusId), [fleet, focusId]);
   const defaultCenter: [number, number] = focusedUser ? [focusedUser.coordinates.latitude, focusedUser.coordinates.longitude] : [17.3850, 78.4867];

   const getCustomIcon = (u: any) => {
      if (!L) return null;
      return L.divIcon({
         className: 'custom-div-icon',
         html: `
        <div class="relative flex flex-col items-center">
          <div class="w-12 h-12 rounded-full border-4 ${u.id === focusId ? 'border-indigo-400' : 'border-white'} overflow-hidden shadow-2xl bg-slate-800 ring-4 ring-indigo-500/20">
             ${u.photo ? `<img src="${IMAGE_BASE_URL}${u.photo}" class="w-full h-full object-cover" />` : `<div class="w-full h-full flex items-center justify-center text-white text-[10px] font-black bg-indigo-600">${u.name.charAt(0)}</div>`}
             <div class="absolute bottom-0 inset-x-0 h-1/3 ${u.isOnline ? 'bg-emerald-500' : 'bg-red-500'} flex items-center justify-center">
                <div class="w-1 h-1 rounded-full bg-white animate-pulse"></div>
             </div>
          </div>
          <div class="mt-2 px-3 py-1 bg-[#0f111a]/95 backdrop-blur-md border border-white/10 rounded-full shadow-2xl">
             <span class="text-[8px] font-black text-white uppercase tracking-widest whitespace-nowrap">${u.name}</span>
          </div>
        </div>
      `,
         iconSize: [48, 80],
         iconAnchor: [24, 60],
      });
   };

   return (
      <div className="fixed inset-0 bg-[#0a0c14] flex overflow-hidden font-sans">

         {/* ── Minimal Floating Navigation Bar ── */}
         <div className="absolute left-6 top-1/2 -translate-y-1/2 w-16 bg-[#151824]/80 backdrop-blur-3xl border border-white/10 rounded-[32px] flex flex-col items-center py-8 gap-10 shadow-2xl z-50">
            <Link href="/" className="group transition-all">
               {company?.logoUrl ? (
                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center p-1.5 shadow-xl transition-transform group-hover:scale-110">
                     <img src={IMAGE_BASE_URL + company.logoUrl} className="w-full h-full object-contain" alt="Logo" />
                  </div>
               ) : (
                  <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 transition-transform group-hover:scale-110">
                     <LayoutGrid size={20} />
                  </div>
               )}
            </Link>
            <nav className="flex flex-col gap-8 text-white/40">
               <button className="hover:text-white transition-colors" onClick={() => router.push('/')}><Users size={22} /></button>
               <button className="text-white bg-white/10 p-3 rounded-2xl"><Navigation size={22} /></button>
               <button className="hover:text-white transition-colors"><Settings size={22} /></button>
            </nav>
         </div>

         {/* ── Main Map Interface ── */}
         <div className="flex-1 relative">

            <div className="absolute inset-0 z-0">
               {typeof window !== 'undefined' && L && (
                  <MapContainer
                     center={defaultCenter}
                     zoom={14}
                     style={{ height: '100%', width: '100%', background: '#0a0c14' }}
                     zoomControl={false}
                  >
                     <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                     />

                     {filteredFleet.map((u: any) => {
                        const icon = getCustomIcon(u);
                        if (!icon) return null;
                        return (
                           <Marker key={u.id} position={[u.coordinates.latitude, u.coordinates.longitude]} icon={icon}>
                              <Popup className="premium-map-popup">
                                 <div className="p-2 min-w-[200px]">
                                    <div className="flex items-center gap-3 mb-3">
                                       <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 ring-1 ring-slate-100">
                                          {u.photo ? <img src={IMAGE_BASE_URL + u.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-white font-black bg-indigo-600">{u.name.charAt(0)}</div>}
                                       </div>
                                       <div>
                                          <p className="text-sm font-black text-slate-900 leading-tight">{u.name}</p>
                                          <p className="text-[9px] font-bold text-slate-400 uppercase">{u.designation || 'Personnel'}</p>
                                       </div>
                                    </div>
                                    <div className="space-y-2 pt-2 border-t border-slate-100">
                                       <div className="flex items-center justify-between">
                                          <span className="text-[9px] font-black text-slate-400 uppercase">Status</span>
                                          <span className={`text-[9px] font-black uppercase ${u.isOnline ? 'text-emerald-600' : 'text-rose-500'}`}>{u.isOnline ? 'Direct Uplink' : 'Out of Sync'}</span>
                                       </div>
                                       <div className="flex items-center justify-between">
                                          <span className="text-[9px] font-black text-slate-400 uppercase">Last Sync</span>
                                          <span className="text-[9px] font-black text-slate-900 uppercase">{new Date(u.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                       </div>
                                       <button onClick={() => router.push(`/analytics/personnel?id=${u.id}`)} className="w-full mt-2 py-2 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2">Intelligence Profile <ChevronRight size={10} /></button>
                                    </div>
                                 </div>
                              </Popup>
                           </Marker>
                        );
                     })}

                     <ZoomControl position="bottomright" />
                  </MapContainer>
               )}
            </div>

            {/* ── Overlay: Intelligence Panels ── */}
            <div className="absolute inset-0 pointer-events-none flex">

               {/* 🎯 Sidebar Panel */}
               <div className="w-80 ml-28 mt-8 mb-8 z-20 flex flex-col gap-6 pointer-events-auto">
                  <div className="bg-[#151824]/90 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 shadow-2xl flex flex-col h-full ring-1 ring-white/5">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
                        <h2 className="text-xl font-black text-white tracking-tight uppercase">Fleet Matrix</h2>
                     </div>
                     <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-8">Unified Intelligence Console</p>

                     <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
                        <div className="relative">
                           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                           <input
                              placeholder="Search active units..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs text-white outline-none focus:bg-indigo-600/20 transition-all font-bold placeholder:text-white/10"
                           />
                        </div>

                        <div className="space-y-3 pt-4">
                           <p className="text-[9px] font-black text-white/30 uppercase tracking-widest pl-1">Route Status</p>
                           <div className="p-5 bg-white/5 border border-white/5 rounded-[32px] flex items-center justify-between group hover:bg-emerald-500/10 transition-all">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Zap size={14} /></div>
                                 <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">In Range</span>
                              </div>
                              <span className="text-lg font-black text-emerald-400">{stats.online}</span>
                           </div>
                           <div className="p-5 bg-white/5 border border-white/5 rounded-[32px] flex items-center justify-between group hover:bg-rose-500/10 transition-all border-dashed border-rose-500/20">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500"><AlertTriangle size={14} /></div>
                                 <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Out of Sync</span>
                              </div>
                              <span className="text-lg font-black text-rose-500">{stats.offline}</span>
                           </div>
                        </div>
                     </div>

                     <div className="mt-8 pt-8 border-t border-white/5">
                        <div className="p-1.5 bg-black/40 rounded-3xl flex flex-col gap-4 border border-white/5 p-6">
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">Map Health</span>
                              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none">Optimal</span>
                           </div>
                           <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div className="w-[92%] h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* 📡 Right Activity Pulse */}
               <div className="w-[400px] mr-8 mt-8 mb-32 ml-auto z-20 flex flex-col gap-6 pointer-events-auto">
                  <div className="bg-[#151824]/80 backdrop-blur-3xl border border-white/10 rounded-[48px] p-10 shadow-2xl flex flex-col h-full ring-1 ring-white/5">
                     <div className="flex items-center justify-between mb-10">
                        <div>
                           <h3 className="text-2xl font-black text-white tracking-tight leading-none mb-1">Live Feed</h3>
                           <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Real-time Stream</p>
                        </div>
                        <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center gap-2">
                           <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                           <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Matched: {filteredFleet.length}</span>
                        </div>
                     </div>

                     <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-3">
                        {filteredFleet.map((u: any) => (
                           <div
                              key={u.id}
                              onClick={() => router.push(`/fleet?focus=${u.id}`)}
                              className={`p-6 border rounded-[36px] transition-all cursor-pointer flex items-center gap-5 relative group ${u.id === focusId ? 'bg-indigo-600/20 border-indigo-500 shadow-2xl shadow-indigo-500/10' : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-[#1f2334]'}`}
                           >
                              {u.id === focusId && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-indigo-500 rounded-r-full shadow-[5px_0_15px_rgba(79,70,229,0.5)]"></div>}
                              <div className={`w-16 h-16 rounded-[24px] overflow-hidden shrink-0 border-2 ${u.isOnline ? 'border-emerald-500/40' : 'border-white/10 shadow-inner'}`}>
                                 {u.photo ? <img src={IMAGE_BASE_URL + u.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white font-black text-lg bg-indigo-600">{u.name.charAt(0)}</div>}
                              </div>
                              <div className="flex-1 min-w-0">
                                 <p className={`text-base font-black mb-1 truncate ${u.id === focusId ? 'text-white' : 'text-white/80'}`}>{u.name}</p>
                                 <p className="text-[10px] font-black text-white/30 uppercase tracking-widest truncate">{u.designation || 'Field Agent'}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1.5 shrink-0">
                                 <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${u.isOnline ? 'text-emerald-400' : 'text-rose-500/50'}`}>{u.isOnline ? 'Active' : 'Offline'}</span>
                                    <div className={`w-1.5 h-1.5 rounded-full ${u.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500/30'}`}></div>
                                 </div>
                                 <div className="flex flex-col items-end">
                                    <span className="text-[8px] font-black text-white/30 uppercase tracking-widest leading-none mb-1">Last Seen</span>
                                    <span className="text-xs font-black text-white/40 tracking-widest tabular-nums leading-none">{new Date(u.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* ── Bottom Analytical Footer (Mission Control Style) ── */}
               <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-7xl px-8 z-30 pointer-events-auto">
                  <div className="bg-[#151824]/95 backdrop-blur-3xl border border-white/10 rounded-[48px] p-8 shadow-2xl flex items-center gap-12 overflow-hidden relative group ring-1 ring-white/5">
                     <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600 shadow-[2px_0_15px_rgba(79,70,229,0.5)]" />
                     <div className="flex items-center gap-12 flex-1 pl-6">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 leading-none">Total Fleet</span>
                           <div className="flex items-center gap-3">
                              <span className="text-4xl font-black text-white leading-none tracking-tighter">{stats.total}</span>
                              <div className="flex items-center text-emerald-400 text-[10px] font-black px-2 py-1 bg-emerald-500/10 rounded-full uppercase tracking-tighter ring-1 ring-emerald-500/20">Uplinked</div>
                           </div>
                        </div>
                        <div className="w-[1px] h-12 bg-white/5" />
                        <div className="flex items-center gap-24 overflow-x-auto no-scrollbar">
                           <div className="flex flex-col shrink-0">
                              <span className="text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.2em] mb-2 leading-none">Active Units</span>
                              <div className="flex items-baseline gap-2">
                                 <span className="text-3xl font-black text-white leading-none">{stats.online}</span>
                                 <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest font-bold">Online</span>
                              </div>
                           </div>
                           <div className="flex flex-col shrink-0">
                              <span className="text-[10px] font-black text-rose-500/50 uppercase tracking-[0.2em] mb-2 leading-none">Signal Lost</span>
                              <div className="flex items-baseline gap-3">
                                 <span className="text-3xl font-black text-white leading-none">{stats.offline}</span>
                                 <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest font-bold">Waiting</span>
                              </div>
                           </div>
                           <div className="flex flex-col shrink-0">
                              <span className="text-[10px] font-black text-indigo-400/50 uppercase tracking-[0.2em] mb-2 leading-none">Moving Units</span>
                              <div className="flex items-baseline gap-3">
                                 <span className="text-3xl font-black text-white leading-none">{stats.moving}</span>
                                 <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[8px] font-black uppercase rounded-md tracking-widest border border-indigo-500/20">Syncing</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center gap-8 pl-12 border-l border-white/5 shrink-0 pr-6">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl border border-white/5">
                           <Activity size={24} className="text-indigo-500 animate-pulse" />
                        </div>
                        <div className="flex flex-col items-end">
                           <span className="text-2xl font-black text-white leading-none tabular-nums tracking-tighter">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                           <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mt-1.5 opacity-80 flex items-center gap-1.5"><div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" /> Real-Time Feed Enabled</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
        .leaflet-container { outline: none; }
        .leaflet-popup-content-wrapper { background: rgba(255,255,255,0.98) !important; backdrop-filter: blur(10px); border-radius: 28px !important; padding: 0 !important; border: 1px solid rgba(255,255,255,1); overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.3) !important; }
        .leaflet-popup-content { margin: 0 !important; }
        .leaflet-popup-tip { background: rgba(255,255,255,1) !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
      </div>
   );
}
