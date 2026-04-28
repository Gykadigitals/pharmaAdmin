import React, { useState } from 'react';
import Link from 'next/link';
import { colors } from '@/constant/colors';
import EmployeeDrawer, { DetailedEmployee } from '../team/EmployeeDrawer';

interface TeamPerformanceTableProps {
  data?: Array<{
    _id?: string;
    id: string;
    name: string;
    role: string;
    status: 'Active' | 'Away';
    location?: string;
    email?: string;
  }>;
}

const TeamPerformanceTable: React.FC<TeamPerformanceTableProps> = ({ data = [] }) => {
  const [selectedEmp, setSelectedEmp] = useState<DetailedEmployee | null>(null);

  const handleViewProfile = (member: any) => {
    if (!member) return;
    
    const name = member.name || 'Unknown Employee';
    const id = member._id || member.id || 'EMP-000';
    
    setSelectedEmp({
      id: id,
      name: name,
      email: member.email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      designation: member.role || 'Personnel',
      roleType: 'On-Field',
      workStation: member.location || 'Field Operations',
      avatar: name.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '?',
      avatarBg: 'bg-indigo-600',
      calls: member.calls || 0,
      newClients: member.newClients || 0,
      claimedAmount: '₹0',
      approvedAmount: '₹0',
      leaves: member.leaves || 0,
      isActive: member.status === 'Active',
      reportingManager: 'Organization Admin',
      chainUsers: []
    });
  };

  return (
    <div className="bg-white p-4 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <h3 className="text-lg sm:text-xl font-black text-slate-800">Team Performance Analysis</h3>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-4 py-2 text-sm font-bold text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
            Filters
          </button>
          <Link
            href="/team"
            className="flex-1 sm:flex-none px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all text-center"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="text-left border-b border-slate-50">
              <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Manager</th>
              <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
              <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
              <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.length > 0 ? data.map((member) => (
              <tr key={member.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-white shadow-sm flex items-center justify-center text-white font-black text-xs">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">{member.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{member.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-5">
                  <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                    {member.role}
                  </span>
                </td>
                <td className="py-5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${member.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                    <p className={`text-xs font-black ${member.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {member.status}
                    </p>
                  </div>
                </td>
                <td className="py-5 text-right">
                  <button 
                    onClick={() => handleViewProfile(member)}
                    className="text-xs font-black text-indigo-600 hover:underline"
                  >
                    View Profile
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="py-12 text-center">
                  <p className="text-sm font-bold text-slate-400">No managers found in this organization</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedEmp && (
        <EmployeeDrawer 
          key={selectedEmp.id}
          emp={selectedEmp} 
          onClose={() => setSelectedEmp(null)} 
          onSelectUser={(u) => setSelectedEmp(u)}
        />
      )}
    </div>
  );
};

export default TeamPerformanceTable;
