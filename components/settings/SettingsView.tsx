'use client';

import React, { useState } from 'react';
import {
  User, Building2, ShieldCheck, Ticket, Calendar, Phone, Mail,
  MapPin, Globe, Key, Users, CheckCircle2, AlertCircle,
  Camera, Save, Lock, BadgeCheck, Clock, Zap
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/constant/colors';

// --- Constants ---------------------------------------------------------------

const SAMPLE_COMPANY = {
  _id: "69db702eedd44d72c1145ca6",
  name: "TX",
  code: "TX-2026",
  logoUrl: "/uploads/createcompany/1775988781995-6407713.jpg",
  webUrl: "tx.finchforce.com",
  accessKey: "12505B8D273C",
  plan: "69d38ebd26ea2dfc35df63f6",
  status: "ACTIVE",
  startDate: "2026-04-12T10:13:02.008+00:00",
  expiryDate: "2026-05-12T10:13:02.008+00:00",
  maxUsers: 10,
  currentUsers: 1,
  createdBy: "69d3b085a8f68261a61d932e",
  createdAt: "2026-04-12T10:13:02.014+00:00",
  updatedAt: "2026-04-12T10:13:02.014+00:00"
};

const SAMPLE_PLAN = {
  _id: "69db6e797554addb07765e32",
  name: "Basic",
  price: 999,
  durationInDays: 30,
  maxUsers: 10,
  features: [],
  permissions: [
    "DAY_PLAN", "MY_ACTIVITY", "DCR_APPROVE", "ADD_CLIENT", "EXPENSE",
    "EXPENSE_APPROVE", "TOUR_PLAN", "TOUR_PLAN_APPROVE", "SALE",
    "TARGET_VIEW", "COMPLAINT", "LEAVES", "LEAVE_APPROVE", "HOLIDAYS",
    "PAY_SLIPS", "REPORTS", "CHAT", "TODO", "CREATE_USER", "CREATE_ROLE",
    "MAP_VIEW", "ASSESSMENT", "TARGET_VS_ACHIEVEMENT"
  ],
  isCustom: false,
  isActive: false,
  createdAt: "2026-04-12T10:05:45.568+00:00",
  updatedAt: "2026-04-12T10:11:40.032+00:00"
};

// --- Settings Header ---------------------------------------------------------

function SettingsHeader({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'company', label: 'Workspace', icon: Building2 },
    { id: 'plan', label: 'Subscription', icon: Zap }
  ];

  return (
    <div className="bg-white px-4 sm:px-10 border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap flex items-center gap-2.5 px-6 py-6 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all shrink-0 ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// --- Profile Content ----------------------------------------------------------

function ProfileSettings() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || 'Administrator',
    mobile: '+91 9988776655', // Mock mobile as per user requirement
    email: user?.email || 'admin@tx.finchforce.com'
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // Logic to save would go here
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl bg-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-indigo-100 overflow-hidden">
              {user?.photo ? <img src={IMAGE_BASE_URL + user.photo} className="w-full h-full object-cover" /> : formData.name.charAt(0)}
            </div>
            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-slate-100 rounded-xl shadow-lg flex items-center justify-center text-indigo-600 hover:scale-110 active:scale-95 transition-all">
              <Camera size={18} />
            </button>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{formData.name}</h2>
            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{user?.role || 'Organization Admin'}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-6">
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                <Mail size={14} className="text-slate-400" />
                <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">{formData.email}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                <BadgeCheck size={14} className="text-emerald-500" />
                <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">Verified Account</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Personal Identity</h3>
            <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isEditing ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>
              {isEditing ? <><Save size={14} /> Save Changes</> : <><User size={14} /> Edit Profile</>}
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Identity Name</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-70 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Mobile Contact</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.mobile}
                onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-70 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-400 outline-none opacity-60 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Access Control</h3>
          <div className="space-y-3">
            <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center justify-between group cursor-pointer hover:bg-indigo-50 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm"><Lock size={18} /></div>
                <div>
                  <p className="text-sm font-black text-slate-900 leading-tight">Master Password</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Last updated 12 days ago</p>
                </div>
              </div>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-white hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm"><ShieldCheck size={18} /></div>
                <div>
                  <p className="text-sm font-black text-slate-900 leading-tight">Two-Factor Authentication</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">Secured via Mobile</p>
                </div>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Company Content ----------------------------------------------------------

function CompanySettings() {
  const company = SAMPLE_COMPANY;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-indigo-600 rounded-[40px] p-8 sm:p-12 relative overflow-hidden shadow-2xl shadow-indigo-200">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-20" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 rounded-3xl bg-white p-4 shadow-xl flex items-center justify-center">
              <Building2 size={40} className="text-indigo-600" />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-black text-white tracking-tighter">{company.name}</h2>
              <div className="flex items-center gap-4 mt-2 justify-center md:justify-start">
                <span className="text-indigo-200 text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">WORKSPACE: {company.code}</span>
                <span className="flex items-center gap-1.5 text-emerald-300 text-[10px] font-black uppercase tracking-widest">
                  <CheckCircle2 size={12} /> {company.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-slate-100 p-10 shadow-sm space-y-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Organization Blueprint</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-8">
              <div className="space-y-1.5 text-left border-l-2 border-slate-100 pl-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Domain Identity</p>
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-indigo-600" />
                  <span className="text-sm font-black text-slate-800">{company.webUrl}</span>
                </div>
              </div>
              <div className="space-y-1.5 text-left border-l-2 border-slate-100 pl-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Access Key</p>
                <div className="flex items-center gap-2">
                  <Key size={16} className="text-indigo-600" />
                  <span className="text-sm font-black text-slate-800 font-mono tracking-tighter">{company.accessKey}</span>
                </div>
              </div>
              <div className="space-y-1.5 text-left border-l-2 border-slate-100 pl-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Onboarding Date</p>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-indigo-600" />
                  <span className="text-sm font-black text-slate-800">{new Date(company.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
              <div className="space-y-1.5 text-left border-l-2 border-slate-100 pl-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Projected Expiry</p>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-rose-500" />
                  <span className="text-sm font-black text-slate-800">{new Date(company.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Plan Content -----------------------------------------------------------

function PlanSettings() {
  const plan = SAMPLE_PLAN;

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500 pb-20">
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-4 sm:p-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/3 flex flex-col justify-between p-10 bg-slate-900 rounded-[32px] text-white relative overflow-hidden shadow-2xl">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-600/20 blur-3xl rounded-full" />
            <div className="relative z-10">
              <p className="text-indigo-400 text-[11px] font-black uppercase tracking-widest mb-4">Current Subscription</p>
              <h2 className="text-5xl font-black tracking-tighter mb-2">{plan.name}</h2>
              <div className="flex items-baseline gap-2 mt-6">
                <span className="text-4xl font-black">₹{plan.price}</span>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">/ {plan.durationInDays} Days</span>
              </div>
            </div>
            <div className="mt-12 space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><CheckCircle2 size={14} /></div>
                <span className="text-xs font-bold text-slate-300">Up to {plan.maxUsers} Organization Users</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><CheckCircle2 size={14} /></div>
                <span className="text-xs font-bold text-slate-300">Architecture Matrix Access</span>
              </div>
              <div className="flex items-center gap-3 opacity-50">
                <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-slate-500"><AlertCircle size={14} /></div>
                <span className="text-xs font-bold text-slate-500">Priority Enterprise Support</span>
              </div>
            </div>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="mt-12 w-full py-5 bg-white text-slate-900 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all hover:bg-slate-50 relative z-10 active:scale-95 shadow-xl"
            >
              Upgrade Subscription
            </button>
          </div>

          {/* Upgrade Contact Modal */}
          {showUpgradeModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowUpgradeModal(false)} />
              <div className="relative bg-white rounded-[32px] p-6 sm:p-10 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-600 rounded-[20px] sm:rounded-[24px] flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-indigo-100">
                  <Phone size={28} className="sm:size-32" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">Enterprise Upgrade</h3>
                <p className="text-[10px] sm:text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 sm:mb-8">Contact dedicated support</p>

                <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-100 mb-6 sm:mb-8">
                  <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Corporate Hotline</p>
                  <a href="tel:9100760587" className="text-xl sm:text-2xl font-black text-indigo-600 tracking-tighter hover:text-indigo-700 transition-colors">+91 9100760587</a>
                </div>

                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full py-4 bg-slate-900 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-800 transition-all active:scale-95"
                >
                  Got it
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 space-y-10 pt-4">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Intelligence Permissions</h3>
              <p className="text-sm font-bold text-slate-400 mt-2">These capabilities are bound to the {plan.name} plan manifest.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {plan.permissions.map((perm, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-50 hover:bg-white hover:border-slate-100 hover:shadow-lg transition-all group">
                  <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <ShieldCheck size={14} />
                  </div>
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">{perm.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between p-8 bg-amber-50 rounded-3xl border border-amber-100 gap-6">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm"><AlertCircle size={24} /></div>
                <div>
                  <p className="text-sm font-black text-slate-900">Subscription Manifest Integrity</p>
                  <p className="text-[11px] font-bold text-amber-700/70 mt-1 uppercase">PLAN ID: {plan._id}</p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase text-amber-600 bg-white border border-amber-200 px-4 py-2 rounded-xl">Next Audit: May 12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main Settings View ------------------------------------------------------

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="flex flex-col h-full bg-[#f4f7fb] overflow-hidden max-w-full">
      <div className="px-4 sm:px-10 mt-2 shrink-0">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter" style={{ color: colors.brand.blue }}>Environment Configuration</h1>
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Manage personnel identity & workspace blueprint</p>
      </div>

      <SettingsHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-10 custom-scrollbar">
        <main className="max-w-6xl mx-auto w-full">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'company' && <CompanySettings />}
          {activeTab === 'plan' && <PlanSettings />}
        </main>
      </div>
    </div>
  );
}
