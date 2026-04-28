import React from 'react';
import { ShieldCheck, User as UserIcon, Users } from 'lucide-react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';

interface RoleMappingSectionProps {
  dbRoles: any[];
  selectedRoleId: string;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  managerType: 'own' | 'others';
  setManagerType: (v: 'own' | 'others') => void;
  selectedManagerId: string;
  setSelectedManagerId: (v: string) => void;
  managerList: any[];
  isLoadingManagers: boolean;
}

export function RoleMappingSection({
  dbRoles,
  selectedRoleId,
  setValue,
  watch,
  managerType,
  setManagerType,
  selectedManagerId,
  setSelectedManagerId,
  managerList,
  isLoadingManagers
}: RoleMappingSectionProps) {
  return (
    <div className="col-span-2 space-y-10 mt-6 pt-10 border-t border-slate-50">
      <div className="space-y-4">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 leading-none">Authorized Organizational Role</label>
        <div className="flex flex-wrap gap-4">
          {dbRoles.map((role) => {
            const isActive = selectedRoleId === role._id;
            return (
              <button
                key={role._id}
                type="button"
                onClick={() => setValue('selectedRoleId', role._id, { shouldValidate: true })}
                className={`px-8 py-4 rounded-[20px] text-sm font-bold transition-all border ${
                  isActive 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100 ring-4 ring-indigo-500/10' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                }`}
              >
                {role.name}
              </button>
            );
          })}
        </div>
        {!selectedRoleId && <p className="text-[9px] text-rose-500 font-bold uppercase tracking-wider ml-4 mt-2">Required: Assign a corporate role</p>}
      </div>

      {selectedRoleId && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 leading-none">Manager Type</label>
            <div className="flex flex-col sm:flex-row gap-4">
              {[
                { id: 'own', label: 'Myself', icon: UserIcon },
                { id: 'others', label: 'Select Manager', icon: Users },
              ].map((type) => {
                const active = managerType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setManagerType(type.id as any)}
                    className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all ${
                      active ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    <type.icon size={16} />
                    <span className="text-[11px] font-black uppercase tracking-widest">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {managerType === 'others' && (
            <div className="bg-slate-50/50 rounded-[32px] p-5 md:p-8 space-y-10 border border-slate-100 animate-in zoom-in-95 duration-300">
              <div className="space-y-8">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign Reporting Manager</label>
                {isLoadingManagers ? (
                  <div className="py-10 flex flex-col items-center gap-3">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-8 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                    {managerList
                      .filter((group: any) => group.users?.length > 0)
                      .map((group: any) => (
                        <div key={group.roleName || group.role} className="space-y-4">
                          <div className="flex items-center gap-2 px-2">
                            <ShieldCheck size={12} className="text-indigo-400" />
                            <h5 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">{group.roleName || group.role}</h5>
                            <div className="flex-1 h-px bg-indigo-100/50" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {group.users.map((mgr: any) => (
                              <button
                                key={mgr._id}
                                type="button"
                                onClick={() => setSelectedManagerId(mgr._id)}
                                className={`flex items-center gap-4 p-4 rounded-3xl border-2 transition-all group ${
                                  selectedManagerId === mgr._id ? 'bg-white border-indigo-500 shadow-xl ring-4 ring-indigo-500/5' : 'bg-white/50 border-transparent hover:bg-white hover:border-slate-200'
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${selectedManagerId === mgr._id ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400 group-hover:scale-110'}`}>
                                  <UserIcon size={18} />
                                </div>
                                <div className="text-left min-w-0 flex-1">
                                  <p className={`text-xs font-black truncate ${selectedManagerId === mgr._id ? 'text-slate-900' : 'text-slate-600'}`}>{mgr.name}</p>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase truncate">ID: {mgr.employeeId}</p>
                                </div>
                                {selectedManagerId === mgr._id && <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white"><ShieldCheck size={12} /></div>}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    {managerList.length === 0 && (
                      <div className="py-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">No managers found for selection.</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
