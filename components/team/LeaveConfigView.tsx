'use client';

import React, { useState, useEffect } from 'react';
// 🛡️ Local SVG Icon Components to prevent Lucide-React Bundler Crashes
const Plus = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const Trash2 = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);
const ToggleLeft = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect><circle cx="8" cy="12" r="3"></circle></svg>
);
const ToggleRight = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect><circle cx="16" cy="12" r="3"></circle></svg>
);
const X = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const Calendar = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);
const ShieldCheck = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
);
const BriefcaseIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
);
const Search = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const SlidersHorizontal = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="21" y1="4" x2="14" y2="4"></line><line x1="10" y1="4" x2="3" y2="4"></line><line x1="21" y1="12" x2="12" y2="12"></line><line x1="8" y1="12" x2="3" y2="12"></line><line x1="21" y1="20" x2="16" y2="20"></line><line x1="12" y1="20" x2="3" y2="20"></line><line x1="14" y1="2" x2="14" y2="6"></line><line x1="8" y1="10" x2="8" y2="14"></line><line x1="16" y1="18" x2="16" y2="22"></line></svg>
);
const Info = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
);
const Palmtree = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4l1-1 1 1h2z"></path><path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-2l-1-1-1 1h-4l-1-1-1 1h-2z"></path><path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.42l1.41-1.41-1.06-1.06 1.06-1.06h2.83l1.06-1.06 1.06 1.06-1.06-1.06z"></path><path d="M11 15.5c.5 2.5 2.5 4.5 5 5v-2l-1-1-1 1h-2l-1-1-1 1v-2z"></path><path d="M11 11v10"></path></svg>
);
const Edit2 = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);
const CheckCircle2 = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);
const AlertCircle = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
);
import { apiFetch } from '@/lib/api-client';
import { API_BASE_URL } from '@/constant/api';



type Tab = 'policy' | 'holidays';

interface Holiday {
  _id: string;
  name: string;
  date: string;
  type?: string;
}

interface Policy {
  sickQuota: number;
  casualQuota: number;
  earnedQuota: number;
  sickCarry: boolean;
  casualCarry: boolean;
  earnedCarry: boolean;
}

interface Toast {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
}

export default function LeaveConfigView() {
  const [activeTab, setActiveTab] = useState<Tab>('policy');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<Toast>({ message: '', type: 'success', visible: false });

  // Policy State
  const [policy, setPolicy] = useState<Policy>({
    sickQuota: 12,
    casualQuota: 12,
    earnedQuota: 24,
    sickCarry: false,
    casualCarry: false,
    earnedCarry: false,
  });

  // Holidays State
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [formHoliday, setFormHoliday] = useState({ name: '', date: '', type: 'Public' });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      if (activeTab === 'policy') {
        const res = await apiFetch(`${API_BASE_URL}/hr/policy`);
        const data = await res.json();
        if (data.status === 'success') {
           setPolicy({
             sickQuota: data.data.sickQuota || 12,
             casualQuota: data.data.casualQuota || 12,
             earnedQuota: data.data.earnedQuota || 24,
             sickCarry: !!data.data.sickCarry,
             casualCarry: !!data.data.casualCarry,
             earnedCarry: !!data.data.earnedCarry,
           });
        }
      } else {
        const res = await apiFetch(`${API_BASE_URL}/hr/holidays`);
        const data = await res.json();
        if (data.status === 'success') setHolidays(data.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      showToast("Failed to load data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePolicy = async () => {
    try {
      setIsSaving(true);
      const res = await apiFetch(`${API_BASE_URL}/hr/policy`, {
        method: 'POST',
        body: JSON.stringify(policy)
      });
      if (res.ok) {
        showToast("Global leave policy updated successfully! ✅");
      } else {
        showToast("Failed to update policy", "error");
      }
    } catch (err) {
      console.error("Save error:", err);
      showToast("Fatal error during save", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingHoliday(null);
    setFormHoliday({ name: '', date: '', type: 'Public' });
    setShowFormModal(true);
  };

  const handleOpenEdit = (h: Holiday) => {
    setEditingHoliday(h);
    setFormHoliday({ 
        name: h.name, 
        date: new Date(h.date).toISOString().split('T')[0], 
        type: h.type || 'Public' 
    });
    setShowFormModal(true);
  };

  const handleSaveHoliday = async () => {
    if (!formHoliday.name || !formHoliday.date) {
        showToast("Holiday name and date are required", "error");
        return;
    };
    try {
      setIsSaving(true);
      const url = editingHoliday 
        ? `${API_BASE_URL}/hr/holidays/${editingHoliday._id}`
        : `${API_BASE_URL}/hr/holidays`;
      
      const res = await apiFetch(url, {
        method: editingHoliday ? 'PUT' : 'POST',
        body: JSON.stringify(formHoliday)
      });

      if (res.ok) {
        showToast(editingHoliday ? "Holiday updated! ✅" : "New holiday registered! ✅");
        setShowFormModal(false);
        fetchData();
      } else {
        showToast("Failed to commit holiday changes", "error");
      }
    } catch (err) {
      console.error("Holiday save error:", err);
      showToast("Network error", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteHoliday = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      const res = await apiFetch(`${API_BASE_URL}/hr/holidays/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showToast("Holiday deleted successfully");
        fetchData();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* ── Toast Notification ── */}
      {toast.visible && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 px-8 py-5 rounded-[24px] shadow-2xl animate-in slide-in-from-top-4 duration-300 ${toast.type === 'success' ? 'bg-slate-900 text-white' : 'bg-rose-600 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={24} className="text-emerald-400" /> : <AlertCircle size={24} />}
          <p className="text-sm font-black uppercase tracking-widest">{toast.message}</p>
        </div>
      )}

      {/* ── Left Navigation ── */}
      <div className="w-[340px] bg-white border-r border-slate-100 flex flex-col py-12 px-10 shrink-0 overflow-y-auto custom-scrollbar">
        <div className="mb-12">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-3">Enterprise Suite</p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">HR Master</h2>
          <p className="text-xs text-slate-400 font-bold mt-2 leading-relaxed opacity-80">Orchestrate company-wide leave logic and holiday synchronization.</p>
        </div>

        <nav className="space-y-4">
          <button
            onClick={() => setActiveTab('policy')}
            className={`group w-full flex items-center gap-5 p-6 rounded-[32px] border transition-all duration-500 ${activeTab === 'policy' ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl shadow-indigo-200' : 'bg-transparent border-slate-50 text-slate-400 hover:bg-slate-50 hover:border-slate-100'}`}
          >
            <div className={`p-3 rounded-2xl transition-all ${activeTab === 'policy' ? 'bg-white/10' : 'bg-slate-50 group-hover:bg-white'}`}>
                <SlidersHorizontal size={20} className={activeTab === 'policy' ? 'text-white' : 'text-slate-300'} />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] leading-none">Policy Framework</p>
              <p className={`text-[9px] font-bold mt-1.5 opacity-60 ${activeTab === 'policy' ? 'text-indigo-100' : 'text-slate-400'}`}>Quotas & carry-forwards</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('holidays')}
            className={`group w-full flex items-center gap-5 p-6 rounded-[32px] border transition-all duration-500 ${activeTab === 'holidays' ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl shadow-indigo-200' : 'bg-transparent border-slate-50 text-slate-400 hover:bg-slate-50 hover:border-slate-100'}`}
          >
            <div className={`p-3 rounded-2xl transition-all ${activeTab === 'holidays' ? 'bg-white/10' : 'bg-slate-50 group-hover:bg-white'}`}>
                <Palmtree size={20} className={activeTab === 'holidays' ? 'text-white' : 'text-slate-300'} />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] leading-none">Annual Calendar</p>
              <p className={`text-[9px] font-bold mt-1.5 opacity-60 ${activeTab === 'holidays' ? 'text-indigo-100' : 'text-slate-400'}`}>Public & Regional holidays</p>
            </div>
          </button>
        </nav>

        <div className="mt-auto pt-12">
          <div className="bg-slate-100 rounded-[40px] p-8 relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-200/50 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <Info size={24} className="text-indigo-600 mb-5" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-2 leading-none">Synchronization</p>
            <p className="text-[10px] font-bold text-slate-500 leading-relaxed">Changes are broadcasted instantly to the Pharma Mobile App.</p>
          </div>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div className="flex-1 overflow-y-auto px-16 py-14 custom-scrollbar">
        {activeTab === 'policy' ? (
          <div className="max-w-6xl mx-auto space-y-14 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center justify-between border-b border-slate-100 pb-10">
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-white rounded-[32px] flex items-center justify-center shadow-2xl shadow-slate-200/50 border border-slate-50">
                  <ShieldCheck size={40} className="text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase tracking-widest">Policy Framework</h1>
                  <p className="text-sm font-bold text-slate-400 mt-2.5 max-w-md">Orchestrate the global leave ecosystem. These settings govern quota allocation across the entire company hierarchy.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Sick Leave Quota */}
              <div className="bg-blue-50/50 hover:bg-blue-100/50 border border-slate-100 rounded-[48px] p-12 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 group relative">
                <div className="absolute top-0 right-0 w-4 h-full bg-rose-500 rounded-r-[48px] opacity-10 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-14 h-14 bg-rose-50 rounded-[24px] flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
                    <X size={28} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Sick Leave</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest tracking-[0.1em]">Medical / Health</span>
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Standard Annual Quota</label>
                    <div className="relative group/input">
                        <input
                        type="number"
                        value={policy.sickQuota}
                        onChange={e => setPolicy({ ...policy, sickQuota: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-50 border border-slate-200 outline-none rounded-[28px] px-8 py-6 text-3xl font-black text-slate-900 focus:bg-white focus:border-rose-500 transition-all text-center"
                        />
                        <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300 uppercase tracking-widest pointer-events-none">Days</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setPolicy({ ...policy, sickCarry: !policy.sickCarry })}
                    className={`flex items-center justify-between p-6 rounded-[28px] border cursor-pointer transition-all duration-500 ${policy.sickCarry ? 'bg-emerald-50 border-emerald-200 shadow-md translate-y-[-2px]' : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'}`}
                  >
                    <div className="flex items-center gap-4">
                      {policy.sickCarry ? <ToggleRight size={24} className="text-emerald-500" /> : <ToggleLeft size={24} />}
                      <span className="text-[11px] font-black uppercase tracking-[0.2em]">Carry Forward</span>
                    </div>
                    {policy.sickCarry && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                  </div>
                </div>
              </div>

              {/* Casual Leave Quota */}
              <div className="bg-emerald-50/50 hover:bg-emerald-100/50 border border-slate-100 rounded-[48px] p-12 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 group relative">
                <div className="absolute top-0 right-0 w-4 h-full bg-amber-500 rounded-r-[48px] opacity-10 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-14 h-14 bg-amber-50 rounded-[24px] flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
                    <Calendar size={28} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Casual Leave</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest tracking-[0.1em]">General Purpose</span>
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Standard Annual Quota</label>
                    <div className="relative group/input">
                        <input
                        type="number"
                        value={policy.casualQuota}
                        onChange={e => setPolicy({ ...policy, casualQuota: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-50 border border-slate-200 outline-none rounded-[28px] px-8 py-6 text-3xl font-black text-slate-900 focus:bg-white focus:border-amber-500 transition-all text-center"
                        />
                        <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300 uppercase tracking-widest pointer-events-none">Days</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setPolicy({ ...policy, casualCarry: !policy.casualCarry })}
                    className={`flex items-center justify-between p-6 rounded-[28px] border cursor-pointer transition-all duration-500 ${policy.casualCarry ? 'bg-emerald-50 border-emerald-200 shadow-md translate-y-[-2px]' : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'}`}
                  >
                    <div className="flex items-center gap-4">
                      {policy.casualCarry ? <ToggleRight size={24} className="text-emerald-500" /> : <ToggleLeft size={24} />}
                      <span className="text-[11px] font-black uppercase tracking-[0.2em]">Carry Forward</span>
                    </div>
                    {policy.casualCarry && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                  </div>
                </div>
              </div>

              {/* Earned Leave Quota */}
              <div className="bg-amber-50/50 hover:bg-amber-100/50 border border-slate-100 rounded-[48px] p-12 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 group relative">
                <div className="absolute top-0 right-0 w-4 h-full bg-indigo-500 rounded-r-[48px] opacity-10 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-14 h-14 bg-indigo-50 rounded-[24px] flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                    <BriefcaseIcon size={28} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Earned Leave</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest tracking-[0.1em]">Paid Incentive</span>
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Standard Annual Quota</label>
                    <div className="relative group/input">
                        <input
                        type="number"
                        value={policy.earnedQuota}
                        onChange={e => setPolicy({ ...policy, earnedQuota: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-50 border border-slate-200 outline-none rounded-[28px] px-8 py-6 text-3xl font-black text-slate-900 focus:bg-white focus:border-indigo-500 transition-all text-center"
                        />
                        <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300 uppercase tracking-widest pointer-events-none">Days</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setPolicy({ ...policy, earnedCarry: !policy.earnedCarry })}
                    className={`flex items-center justify-between p-6 rounded-[28px] border cursor-pointer transition-all duration-500 ${policy.earnedCarry ? 'bg-emerald-50 border-emerald-200 shadow-md translate-y-[-2px]' : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'}`}
                  >
                    <div className="flex items-center gap-4">
                      {policy.earnedCarry ? <ToggleRight size={24} className="text-emerald-500" /> : <ToggleLeft size={24} />}
                      <span className="text-[11px] font-black uppercase tracking-[0.2em]">Carry Forward</span>
                    </div>
                    {policy.earnedCarry && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-12 items-center gap-8">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] max-w-[200px] text-right leading-relaxed">System Wide Changes are permanent after deployment</p>
              <button
                onClick={handleSavePolicy}
                disabled={isSaving}
                className="px-16 py-7 bg-slate-900 text-white font-black rounded-3xl shadow-2xl hover:bg-indigo-600 hover:-translate-y-2 transition-all duration-500 text-xs uppercase tracking-[0.3em] flex items-center gap-5 disabled:opacity-50"
              >
                {isSaving ? <div className="w-5 h-5 border-2 border-white/20 border-t-white animate-spin rounded-full" /> : <ShieldCheck size={22} />}
                Lock Framework Decisions
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-14 animate-in fade-in slide-in-from-bottom-6 duration-700">
             <div className="flex items-center justify-between border-b border-slate-100 pb-10">
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-white rounded-[32px] flex items-center justify-center shadow-2xl shadow-slate-200/50 border border-slate-50">
                  <Palmtree size={40} className="text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase tracking-widest">Annual Calendar</h1>
                  <p className="text-sm font-bold text-slate-400 mt-2.5 max-w-md">Curate the corporate holiday list. Automated leave deductions will respect this registry globally.</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative group">
                   <Search size={20} className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                   <input
                     placeholder="Filter holidays..."
                     value={searchQuery}
                     onChange={e => setSearchQuery(e.target.value)}
                     className="bg-white border border-slate-200 outline-none rounded-[32px] pl-20 pr-10 py-5 text-sm font-bold text-slate-700 shadow-sm focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 transition-all w-80"
                   />
                </div>
                <button
                  onClick={handleOpenAdd}
                  className="bg-indigo-600 text-white w-20 h-20 rounded-[32px] flex items-center justify-center shadow-2xl shadow-indigo-200 hover:bg-slate-900 hover:-translate-y-2 transition-all duration-500 group"
                >
                  <Plus size={36} className="group-hover:rotate-180 transition-transform duration-700" />
                </button>
              </div>
            </div>

            {/* Form Modal Overlay */}
            {showFormModal && (
              <div className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
                <div className="w-full max-w-2xl bg-white border border-white/20 rounded-[64px] p-16 shadow-2xl shadow-slate-900/20 space-y-12 animate-in zoom-in-95 duration-500 relative">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-6">
                       <div className="w-14 h-14 bg-indigo-50 rounded-[28px] flex items-center justify-center text-indigo-600">
                        {editingHoliday ? <Edit2 size={24} /> : <Plus size={24} />}
                       </div>
                       <div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-widest">{editingHoliday ? "Refine Holiday" : "Anchor New Holiday"}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest tracking-[0.2em] mt-1.5">Company-wide synchronization</p>
                       </div>
                     </div>
                     <button onClick={() => setShowFormModal(false)} className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-[20px] transition-all">
                       <X size={24} className="text-slate-300 hover:text-slate-900" />
                     </button>
                  </div>

                  <div className="grid grid-cols-1 gap-10">
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Holiday Title</label>
                      <input
                        value={formHoliday.name}
                        onChange={e => setFormHoliday({ ...formHoliday, name: e.target.value })}
                        placeholder="e.g. Founder's Day Observance"
                        className="w-full bg-slate-50 border border-slate-100 outline-none rounded-[32px] px-10 py-6 text-lg font-black text-slate-900 focus:bg-white focus:border-indigo-500 transition-all shadow-inner"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Selection Date</label>
                            <input
                                type="date"
                                value={formHoliday.date}
                                onChange={e => setFormHoliday({ ...formHoliday, date: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 outline-none rounded-[32px] px-10 py-6 text-sm font-bold text-slate-900 focus:bg-white focus:border-indigo-500 transition-all shadow-inner"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Event Type</label>
                            <select
                                value={formHoliday.type}
                                onChange={e => setFormHoliday({ ...formHoliday, type: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 outline-none rounded-[32px] px-10 py-6 text-sm font-black text-slate-900 focus:bg-white focus:border-indigo-500 transition-all appearance-none cursor-pointer shadow-inner"
                            >
                                <option>Public</option>
                                <option>Company</option>
                                <option>Regional</option>
                            </select>
                        </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-6 pt-6">
                     <button onClick={() => setShowFormModal(false)} className="px-12 py-6 bg-slate-50 text-slate-400 font-black rounded-3xl text-xs uppercase tracking-widest hover:bg-slate-100 transition-all leading-none">Discard Changes</button>
                     <button
                        onClick={handleSaveHoliday}
                        disabled={isSaving}
                        className="px-16 py-6 bg-slate-900 text-white font-black rounded-3xl text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-600 hover:-translate-y-2 transition-all duration-500 disabled:opacity-50 flex items-center gap-4"
                     >
                       {isSaving && <div className="w-4 h-4 border-2 border-white/20 border-t-white animate-spin rounded-full" />}
                       {editingHoliday ? 'Synchronize Edit' : 'Commit Registry'}
                     </button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-indigo-50/50 hover:bg-indigo-100/50 border border-slate-100 rounded-[56px] overflow-hidden shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-50">
                    <th className="px-12 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Event Identity</th>
                    <th className="px-12 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Chronology</th>
                    <th className="px-12 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Classification</th>
                    <th className="px-12 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Administrative</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50/50">
                  {holidays.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase())).map((h) => (
                    <tr key={h._id} className="group hover:bg-indigo-50/20 transition-all duration-300">
                      <td className="px-12 py-10">
                        <p className="text-base font-black text-slate-900 tracking-widest leading-none uppercase">{h.name}</p>
                        <p className="text-[10px] font-bold text-slate-300 mt-2 tracking-widest leading-none">UID: {h._id.slice(-8).toUpperCase()}</p>
                      </td>
                      <td className="px-12 py-10">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-indigo-500 transition-colors">
                            <Calendar size={18} />
                           </div>
                           <div>
                            <span className="text-sm font-black text-slate-700 tracking-tight">{new Date(h.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}</span>
                            <span className="text-[10px] font-bold text-slate-400 ml-2">{new Date(h.date).getFullYear()}</span>
                           </div>
                        </div>
                      </td>
                      <td className="px-12 py-10">
                        <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${h.type === 'Public' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : h.type === 'Company' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                          {h.type || 'Public'}
                        </span>
                      </td>
                      <td className="px-12 py-10">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <button
                            onClick={() => handleOpenEdit(h)}
                            className="p-4 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-[20px] transition-all"
                          >
                            <Edit2 size={20} />
                          </button>
                          <button
                            onClick={() => handleDeleteHoliday(h._id, h.name)}
                            className="p-4 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-[20px] transition-all"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {holidays.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan={4} className="px-12 py-32 text-center">
                        <div className="mb-8 relative inline-block">
                            <Palmtree size={80} className="text-slate-100" />
                            <Search size={32} className="absolute -bottom-2 -right-2 text-slate-200 bg-white rounded-full p-1 shadow-sm" />
                        </div>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] mb-2 leading-none">Registry Exhausted</p>
                        <p className="text-xs font-bold text-slate-400 tracking-widest">No matching holiday anchors found in the corporate cloud database.</p>
                      </td>
                    </tr>
                  )}
                  {isLoading && (
                    <tr>
                      <td colSpan={4} className="px-12 py-32 text-center">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-white rounded-full animate-spin mx-auto mb-6 shadow-xl shadow-indigo-100" />
                        <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Synching with Infrastructure...</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
