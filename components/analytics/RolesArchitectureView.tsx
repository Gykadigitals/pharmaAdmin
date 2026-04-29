'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Trash2, 
  Plus, 
  ChevronRight, 
  UserPlus, 
  CheckCircle2,
  Lock,
  ChevronDown,
  Search,
  ChevronLeft,
  Activity
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ENDPOINTS, API_BASE_URL } from '@/constant/api';
import { useAuth } from '@/context/AuthContext';
import { PERMISSION_GROUPS } from '@/constant/permissions';

export default function RolesArchitectureView() {
  const router = useRouter();
  const { token } = useAuth();
  const [dbRoles, setDbRoles] = useState<any[]>([]);
  const [allowedPermissions, setAllowedPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all roles and allowed plan permissions
  const fetchArchitectureData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(ENDPOINTS.ROLES.BASE, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch architecture data');
      const data = await res.json();
      
      const rolesArray = data.roles || (Array.isArray(data) ? data : []);
      const allowed = data.allowedPermissions || [];
      
      setDbRoles(rolesArray);
      setAllowedPermissions(allowed);
    } catch (err) {
      console.error('❌ Fetch Architecture Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchArchitectureData();
  }, [token]);

  // Logic to handle role updates directly from matrix (optional or secondary)
  const handleToggleRolePermission = async (role: any, permKey: string) => {
    const isAllowed = allowedPermissions.length === 0 || allowedPermissions.includes(permKey);
    if (!isAllowed) return;

    const currentPerms = role.permissions || [];
    const newPerms = currentPerms.includes(permKey)
      ? currentPerms.filter((p: string) => p !== permKey)
      : [...currentPerms, permKey];

    try {
      const res = await fetch(`${ENDPOINTS.ROLES.BASE}/${role._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...role, permissions: newPerms })
      });

      if (res.ok) {
        setDbRoles(prev => prev.map(r => r._id === role._id ? { ...r, permissions: newPerms } : r));
      }
    } catch (err) {
      console.error('❌ Update Permission Error:', err);
    }
  };

  const filteredRoles = dbRoles.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-[#f8fafc] overflow-y-auto custom-scrollbar h-screen">
      {/* ── 🚀 ARCHITECTURE HEADER ── */}
      <div className="max-w-[1600px] mx-auto px-12 py-12">
        <div className="flex items-end justify-between mb-16">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <button 
                onClick={() => router.back()} 
                className="w-14 h-14 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 rounded-[20px] flex items-center justify-center shadow-lg transition-all active:scale-95 shrink-0"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="w-14 h-14 bg-slate-900 rounded-[20px] flex items-center justify-center shadow-2xl shadow-indigo-200">
                <ShieldCheck size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tight italic">System Architecture</h1>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-extra-widest mt-1">Enterprise Access Matrix • Node Configuration</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="text"
                placeholder="Search Infrastructure Roles..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-white border border-slate-100 rounded-[24px] px-16 py-4 text-sm font-bold text-slate-700 w-80 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm"
              />
            </div>
            <button className="px-8 py-4 bg-slate-900 text-white rounded-[24px] text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200/50 flex items-center gap-3">
              <Plus size={18} /> New Architecture Node
            </button>
          </div>
        </div>

        {/* ── 🛡️ THE ACCESS MATRIX ── */}
        <div className="bg-teal-50/50 hover:bg-teal-100/50 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden relative mb-24 group hover:-translate-y-1 hover:shadow-slate-300/60 transition-all duration-300">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-900">
                  <th className="sticky left-0 z-20 bg-slate-900 p-10 text-left w-[360px] border-b border-white/5 shadow-[20px_0_40px_-20px_black]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                        <Lock size={18} className="text-white" />
                      </div>
                      <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Permissions Label</span>
                    </div>
                  </th>
                  {filteredRoles.map((role) => (
                    <th key={role._id} className="p-10 border-b border-white/5 min-w-[200px]">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Zap size={20} className="text-indigo-400" />
                        </div>
                        <span className="text-xs font-black text-white uppercase tracking-widest">{role.name}</span>
                        <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10">
                          <span className="text-[8px] font-bold text-indigo-300 uppercase tracking-tighter">Active Node</span>
                        </div>
                      </div>
                    </th>
                  ))}
                  {filteredRoles.length === 0 && !isLoading && (
                    <th className="p-10 border-b border-white/5 text-slate-500 text-xs font-bold uppercase tracking-widest">No matching infrastructure found</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={filteredRoles.length + 1} className="py-20 text-center">
                      <div className="w-8 h-8 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mx-auto" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Streaming Architecture Data...</p>
                    </td>
                  </tr>
                ) : (
                  PERMISSION_GROUPS.map((group, groupIdx) => (
                    <React.Fragment key={groupIdx}>
                      <tr className="bg-slate-50/50">
                        <td colSpan={filteredRoles.length + 1} className="px-10 py-6 border-b border-slate-100/50">
                          <div className="flex items-center gap-3">
                            <div className="w-1 h-6 bg-indigo-500 rounded-full" />
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.25em]">{group.title}</span>
                          </div>
                        </td>
                      </tr>
                      {group.permissions.map((perm) => {
                        const isGlobalAllowed = allowedPermissions.length === 0 || allowedPermissions.includes(perm.key);
                        return (
                          <tr key={perm.key} className="group hover:bg-slate-50 transition-colors">
                            <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 p-8 border-b border-slate-50 shadow-[20px_0_40px_-20px_rgba(0,0,0,0.03)] transition-colors">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest">{perm.label}</p>
                                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">System Protocol ID: {perm.key}</p>
                                </div>
                                {!isGlobalAllowed && (
                                  <div className="bg-rose-50 px-2 py-1 rounded-md border border-rose-100">
                                    <span className="text-[7px] font-black text-rose-500 uppercase">Restricted</span>
                                  </div>
                                )}
                              </div>
                            </td>
                            {filteredRoles.map((role) => {
                              const hasPermission = role.permissions?.includes(perm.key);
                              return (
                                <td key={role._id} className="p-8 border-b border-slate-50 border-l border-slate-50/50 text-center">
                                  <div 
                                    onClick={() => handleToggleRolePermission(role, perm.key)}
                                    className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center transition-all ${
                                      !isGlobalAllowed 
                                        ? 'bg-slate-50 text-slate-200 cursor-not-allowed grayscale opacity-30' 
                                        : 'cursor-pointer hover:scale-110 shadow-sm ' + (hasPermission ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-slate-50 text-slate-300 hover:border-indigo-100 border border-transparent')
                                    }`}
                                  >
                                    {hasPermission ? <CheckCircle2 size={18} /> : <div className="w-2 h-2 rounded-full bg-current opacity-20" />}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer Metrics */}
          <div className="bg-slate-50/50 p-8 flex items-center justify-between border-t border-slate-100">
            <div className="flex gap-12">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Infrastructure Nodes</p>
                <p className="text-xl font-black text-slate-900 tracking-tight mt-1">{dbRoles.length}</p>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Access Plan</p>
                <p className="text-xl font-black text-indigo-600 tracking-tight mt-1 uppercase italic">Enterprise Std</p>
              </div>
            </div>
            <div className="flex gap-4">
               <button onClick={fetchArchitectureData} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm">
                  <Activity size={18} />
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
