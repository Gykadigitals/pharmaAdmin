'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { LogOut, X, ChevronRight, PanelLeftClose, PanelLeft } from 'lucide-react';
import { colors } from '@/constant/colors';
import { useLayout } from '@/context/LayoutContext';
import { useAuth } from '@/context/AuthContext';
import { IMAGE_BASE_URL } from '@/constant/api';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SidebarInner: React.FC<SidebarProps> = React.memo(({ isOpen, setIsOpen }) => {
  const { activeSection, config, isSidebarCollapsed, toggleSidebar } = useLayout();
  const { logout, company } = useAuth();
  const { theme, logo, sidebar } = config;
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeView = searchParams.get('view');

  // Use company name as logo text
  const displayName = company?.name || logo.text;

  const getIsActive = (itemId: string) => {
    if (itemId === 'create-user') return activeView === 'create';
    if (itemId === 'leave-config') return activeView === 'leave';
    if (itemId === 'payroll') return activeView === 'payroll';
    if (itemId === 'expense') return activeView === 'expense';
    if (itemId === 'hierarchy') return activeSection === 'team' && !activeView;
    if (itemId === 'architecture') return activeSection === 'analytics' && !activeView;
    if (itemId === 'analytics' && activeSection === 'analytics') return activeView === 'analytics';
    if (itemId === 'nodes') return activeView === 'nodes';
    if (itemId === 'personnel') return activeSection === 'analytics';
    return activeSection === itemId;
  };

  const isLightTheme = theme === 'architect' || theme === 'analytics' || theme === 'employee-profile';

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 gpu-accelerate transition-fast transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 overflow-y-auto flex flex-col transition-all duration-300
          ${isSidebarCollapsed ? 'w-20' : 'w-[280px] lg:w-64'}
          ${isLightTheme ? 'bg-white border-r border-slate-100 shadow-xl' : 'bg-[#0f172a] text-white shadow-[0_0_50px_rgba(0,0,0,0.3)] border-r border-white/5'}`}
      >
        {/* Logo Section */}
        <div className={`p-6 flex items-center shrink-0 ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          <Link href="/" className="flex items-center gap-3 group">
            {company?.logoUrl ? (
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-lg shrink-0 border border-slate-100 flex items-center justify-center transition-transform group-hover:scale-105">
                <img 
                  src={IMAGE_BASE_URL + company.logoUrl} 
                  className="w-full h-full object-contain p-1.5" 
                  alt="Company Logo" 
                />
              </div>
            ) : logo.icon && (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shrink-0 transition-transform group-hover:scale-105"
                style={{ backgroundColor: logo.color || colors.brand.blue }}
              >
                <logo.icon size={20} className="text-white" />
              </div>
            )}
            {!isSidebarCollapsed && (
              <div className="flex flex-col animate-in fade-in duration-300">
                <span className={`text-base font-black tracking-tight leading-none transition-colors group-hover:text-indigo-600 ${isLightTheme ? 'text-slate-900' : 'text-white'}`}>
                  {displayName}
                </span>
                {(logo as any).subtext && (
                  <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mt-0.5 opacity-70">{(logo as any).subtext}</span>
                )}
              </div>
            )}
          </Link>

          <button
            onClick={toggleSidebar}
            className={`hidden lg:flex p-2 rounded-lg transition-colors ${isLightTheme ? 'hover:bg-slate-100 text-slate-400' : 'hover:bg-slate-800 text-slate-500'}`}
          >
            {isSidebarCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${isLightTheme ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-slate-800'}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Section (for Architect theme) */}
        {sidebar.header && !isSidebarCollapsed && (
          <div className="px-4 mb-6 shrink-0 animate-in fade-in duration-300">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
                <sidebar.header.icon size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 leading-tight">{sidebar.header.title}</span>
                <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase mt-0.5">{sidebar.header.subtitle}</span>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-4">
          {sidebar.items.map((item) => {
            const isHeading = (item as any).type === 'heading' || !item.icon;
            if (isHeading) {
              return !isSidebarCollapsed ? (
                <div key={item.id} className="px-4 pt-6 pb-2 animate-in fade-in duration-300">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isLightTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                    {item.label}
                  </span>
                </div>
              ) : (
                <div key={item.id} className="h-px bg-slate-100 my-4 mx-4" />
              );
            }

            const isActive = getIsActive(item.id);
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.path}
                onMouseEnter={() => router.prefetch(item.path)}
                onClick={() => setIsOpen(false)}
                title={isSidebarCollapsed ? item.label : ''}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActive
                  ? isLightTheme
                    ? 'bg-blue-50 text-blue-600 border border-blue-100 font-bold'
                    : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : isLightTheme
                    ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
              >
                <div className={`p-1.5 rounded-lg transition-colors shrink-0 ${isActive ? (isLightTheme ? 'bg-blue-100/50' : 'bg-white/10') : 'group-hover:bg-slate-100/50'}`}>
                  <Icon size={18} className={isActive ? (isLightTheme ? 'text-blue-600' : 'text-white') : 'inherit'} />
                </div>
                {!isSidebarCollapsed && <span className="font-medium flex-1 text-left text-sm truncate animate-in slide-in-from-left-1 duration-300">{item.label}</span>}
                {isActive && isLightTheme && !isSidebarCollapsed && <ChevronRight size={14} className="animate-in fade-in" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 shrink-0">
          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isSidebarCollapsed ? 'justify-center' : ''} ${isLightTheme
              ? 'text-slate-400 hover:text-rose-500 hover:bg-rose-50'
              : 'text-slate-400 hover:text-white hover:bg-rose-600/10 hover:text-rose-500'
              }`}>
            <LogOut size={20} />
            {!isSidebarCollapsed && <span className="font-medium animate-in slide-in-from-left-1">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
});

SidebarInner.displayName = 'SidebarInner';

const Sidebar: React.FC<SidebarProps> = (props) => {
  return (
    <Suspense fallback={null}>
      <SidebarInner {...props} />
    </Suspense>
  );
};

export default Sidebar;
