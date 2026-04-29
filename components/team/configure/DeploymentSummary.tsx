import React from 'react';
import {
  User as UserIcon, Camera, Mail, DollarSign,
  MapPin, Activity, TrendingUp, Clock, Users
} from 'lucide-react';
import { IMAGE_BASE_URL } from '@/constant/api';

interface DeploymentSummaryProps {
  fullName: string;
  roleName: string;
  email: string;
  dailyAllowance: number;
  stations: string[];
  subAreas: string[];
  activeTotalComp: number;
  totalLeave: number;
  profileImage: string | null;
  onImageClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  managerName: string;
}

export function DeploymentSummary({
  fullName,
  roleName,
  email,
  dailyAllowance,
  stations,
  subAreas,
  activeTotalComp,
  totalLeave,
  profileImage,
  onImageClick,
  fileInputRef,
  handleImageUpload,
  managerName
}: DeploymentSummaryProps) {
  return (
    <div className="w-full lg:w-[380px] bg-white border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col p-4 sm:p-8 lg:p-10 shrink-0 lg:sticky lg:top-0 h-auto lg:h-screen shadow-2xl shadow-slate-100/50 lg:overflow-y-auto custom-scrollbar">
      <div className="flex flex-col items-center mb-4 sm:mb-8 lg:mb-12 group">
        <div
          onClick={onImageClick}
          className="w-32 h-32 rounded-[40px] bg-slate-50 flex items-center justify-center ring-4 ring-indigo-50 border-4 border-white shadow-xl transition-all group-hover:scale-105 overflow-hidden relative cursor-pointer"
        >
          {profileImage ? (
            <img src={IMAGE_BASE_URL + profileImage} alt="Profile" className="w-full h-full object-cover transition-opacity duration-300" />
          ) : (
            <UserIcon size={52} className="text-slate-300" />
          )}
          <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-all flex items-center justify-center">
            <Camera size={20} className="text-white opacity-0 group-hover:opacity-100 transition-all" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
          />
        </div>
        <div className="text-center mt-6">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">{fullName || 'New Employee'}</h3>
          <div className="mt-2 px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-indigo-100">
            {roleName || 'Unassigned Role'}
          </div>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-10">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 sm:mb-6 flex items-center gap-2 leading-none">
            <Activity size={12} className="text-indigo-500" /> Live Summary
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
            {[
              { label: 'Work Email', value: email || 'Pending...', icon: Mail },
              { label: 'Reporting Mgr', value: managerName, icon: Users },
              { label: 'Daily TA/DA', value: `₹${dailyAllowance}`, icon: DollarSign },
              { label: 'Deployment', value: stations.length > 0 ? `${stations.length} Stations` : 'None Assigned', icon: MapPin },
              { label: 'Sub-Areas', value: subAreas.length > 0 ? `${subAreas.length} Localities` : 'None Assigned', icon: Activity },
              { label: 'Monthly Comp', value: `₹${activeTotalComp.toLocaleString()}`, icon: TrendingUp },
              { label: 'Leave Balance', value: `${totalLeave} Days`, icon: Clock },
            ].map((stat, i) => (
              <div key={i} className="bg-blue-100/50 hover:bg-blue-200/50 border border-white/50 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100/80 shadow-sm flex items-center justify-center text-blue-600 group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                    <stat.icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-tight">{stat.label}</p>
                    <p className="text-[11px] font-bold text-slate-900 truncate">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Policy Verification block could be added back here if needed */}
        <div className="bg-slate-50/50 rounded-[32px] p-6 border border-slate-100 border-dashed">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Identity Node Validated</p>
        </div>
      </div>
    </div>
  );
}
