'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  Menu,
  Calendar,
  ChevronDown,
  RotateCcw,
  Bell,
  User as UserIcon,
  Search,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';
import { colors } from '@/constant/colors';
import { useLayout } from '@/context/LayoutContext';
import { useAuth } from '@/context/AuthContext';
import { IMAGE_BASE_URL } from '@/constant/api';

interface HeaderProps {
  onMenuClick: () => void;
}

const HeaderInner: React.FC<HeaderProps> = React.memo(({ onMenuClick }) => {
  const { activeSection, config, dateRange, setDateRange } = useLayout();
  const { user, token } = useAuth();
  const { theme, header } = config;
  const [rangePickerOpen, setRangePickerOpen] = React.useState(false);
  const pickerRef = React.useRef<HTMLDivElement>(null);
  const [tempDates, setTempDates] = React.useState({
    start: dateRange?.startDate || new Date().toISOString().split('T')[0],
    end: dateRange?.endDate || new Date().toISOString().split('T')[0]
  });

  // Close picker on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setRangePickerOpen(false);
      }
    }
    if (rangePickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [rangePickerOpen]);

  // Sync temp dates when range picker is opened
  React.useEffect(() => {
    if (rangePickerOpen) {
      setTempDates({
        start: dateRange?.startDate || new Date().toISOString().split('T')[0],
        end: dateRange?.endDate || new Date().toISOString().split('T')[0]
      });
    }
  }, [rangePickerOpen, dateRange]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const view = searchParams.get('view');

  // Initial for avatar fallback
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';

  return (
    <header
      className={`sticky top-0 right-0 left-0 h-20 z-30 flex items-center px-4 lg:px-8 justify-between shadow-sm border-b transition-colors duration-300 ${theme === 'architect' ? 'bg-white/80 backdrop-blur-md border-slate-100' : 'bg-white border-slate-100'
        }`}
      style={{ backgroundColor: theme === 'architect' ? 'rgba(255, 255, 255, 0.8)' : colors.white }}
    >
      {/* Left: Dynamic Tabs or Title */}
      <div className="flex items-center gap-3 sm:gap-6 h-full">
        {pathname !== '/' && (
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 flex items-center justify-center group"
            title="Go Back"
          >
            <ArrowLeft size={22} className="group-active:-translate-x-1 transition-transform" />
          </button>
        )}

        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
        >
          <Menu size={24} />
        </button>

        {header.tabs ? (
          <div className="hidden lg:flex items-center gap-1 h-full">
            {(view === 'create' || view === 'create-user' ? [
              { id: 'create', label: 'Role Configuration', path: '/team?view=create' },
              { id: 'create-user', label: 'Create User', path: '/team?view=create-user' }
            ] : header.tabs).map((tab) => {
              const isActive = (view === tab.id) || (!view && tab.id === 'hierarchy' && activeSection === 'team') || (activeSection === tab.id && !view);

              return (
                <Link
                  key={tab.id}
                  href={tab.path}
                  className={`px-4 h-full relative flex items-center font-bold text-sm transition-all ${isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                  {tab.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col min-w-0 max-w-[150px] sm:max-w-none">
            <h1
              className="text-sm sm:text-2xl font-black tracking-tight truncate leading-none sm:leading-normal"
              style={{ color: colors.brand.blue }}
            >
              {activeSection === 'dashboard' ? 'Company Dashboard' : activeSection.charAt(0).toUpperCase() + activeSection.slice(1) + ' Dashboard'}
            </h1>
            <p className="text-[7px] sm:text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1 truncate">
              OVERALL BUSINESS PERFORMANCE
            </p>
          </div>
        )}
      </div>

      {/* Right: Actions & User */}
      <div className="flex items-center gap-3 lg:gap-6">
        {/* Search Bar (Architect style) */}
        {theme === 'architect' && (
          <div className="hidden md:flex items-center bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2 gap-3 w-64 group focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:bg-white transition-all">
            <Search size={18} className="text-slate-400 group-focus-within:text-indigo-500" />
            <input
              type="text"
              placeholder="Search architecture..."
              className="bg-transparent border-none outline-none text-sm font-medium text-slate-700 w-full placeholder:text-slate-400"
            />
          </div>
        )}

        {/* Date Selector (Dashboard style) */}
        {theme === 'dashboard' && (
          <div className="relative group" ref={pickerRef}>
            <div className="hidden md:flex items-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 gap-3 shadow-sm cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => setRangePickerOpen(!rangePickerOpen)}>
              <Calendar size={18} className="text-slate-400" />
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-700">{dateRange?.label || 'Loading...'}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${rangePickerOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {rangePickerOpen && (
              <div className="absolute top-full right-0 mt-3 w-64 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 p-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="space-y-1">
                  {[
                    { key: 'Today', label: 'Today' },
                    { key: '1W', label: 'Last 7 Days' },
                    { key: '1M', label: 'Last 30 Days' },
                    { key: '3M', label: 'Last 3 Months' },
                    { key: '6M', label: 'Last 6 Months' },
                    { key: '1Y', label: 'Last 1 Year' },
                  ].map((range) => (
                    <button
                      key={range.key}
                      onClick={() => {
                        setDateRange(range.key as any);
                        setRangePickerOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${dateRange?.key === range.key ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                      {range.label}
                    </button>
                  ))}

                  <div className="pt-3 border-t border-slate-100 mt-2 px-2 pb-2">
                    <p className="px-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Custom Range</p>
                    <div className="flex flex-col gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">From Date</label>
                        <input
                          type="date"
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
                          value={tempDates.start}
                          onChange={(e) => setTempDates(prev => ({ ...prev, start: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">To Date</label>
                        <input
                          type="date"
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
                          value={tempDates.end}
                          onChange={(e) => setTempDates(prev => ({ ...prev, end: e.target.value }))}
                        />
                      </div>
                      <button
                        onClick={() => {
                          setDateRange('custom', { start: tempDates.start, end: tempDates.end });
                          setRangePickerOpen(false);
                        }}
                        className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white hover:bg-indigo-600 shadow-lg shadow-slate-200 transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest"
                      >
                        <Search size={14} />
                        Apply Filter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Global Actions */}
        <div className="flex items-center gap-1">
          {theme === 'architect' && (
            <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
              <HelpCircle size={22} />
            </button>
          )}
          {theme === 'dashboard' && (
            <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
              <RotateCcw size={20} />
            </button>
          )}

        </div>

        <div className="h-4 w-[1px] bg-slate-200" />

        {/* User Profile */}
        <Link 
          href="/settings"
          className="flex items-center gap-3 pl-2 group/user cursor-pointer transition-all active:scale-95"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-800 leading-none group-hover/user:text-indigo-600 transition-colors">{user?.name || 'Administrator'}</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase group-hover/user:text-slate-500 transition-colors">{user?.role || 'Admin Account'}</p>
          </div>
          <div className={`w-11 h-11 rounded-full border-2 overflow-hidden ring-2 ring-slate-100 transition-all ${theme === 'architect' ? 'bg-rose-500 border-white' : 'bg-slate-900 border-white'
            } group-hover/user:ring-indigo-100 group-hover/user:scale-105 flex items-center justify-center`}>
            {user?.photo ? (
              <img src={IMAGE_BASE_URL + user.photo} alt="User" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-black text-sm">{userInitial}</span>
            )}
          </div>
        </Link>
      </div>
    </header>
  );
});

HeaderInner.displayName = 'HeaderInner';

const Header: React.FC<HeaderProps> = (props) => {
  return (
    <Suspense fallback={<div className="h-20 bg-white" />}>
      <HeaderInner {...props} />
    </Suspense>
  );
};

export default Header;
