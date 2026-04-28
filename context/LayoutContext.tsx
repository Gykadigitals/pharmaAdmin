'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Wallet,
  Calendar,
  Settings,
  ShieldCheck,
  Users2,
  UserCircle2,
  TrendingUp,
  Activity,
  History,
  FileText
} from 'lucide-react';

export interface LayoutConfig {
  theme: 'architect' | 'dashboard' | 'analytics' | 'employee-profile';
  logo: {
    icon?: any;
    text: string;
    color?: string;
    subtext?: string;
  };
  sidebar: {
    items: { id: string; label: string; icon: any; path: string; type?: 'item' | 'heading' }[];
    showLogo: boolean;
    showFooter: boolean;
    header?: { icon: any; title: string; subtitle: string };
  };
  header: {
    showBreadcrumbs: boolean;
    showActions: boolean;
    tabs?: { id: string, label: string, path: string }[];
  };
}

const DASHBOARD_CONFIG: LayoutConfig = {
  theme: 'dashboard',
  logo: {
    icon: LayoutDashboard,
    text: 'Architect',
    color: '#2563eb',
    subtext: 'ADMIN DASHBOARD'
  },
  sidebar: {
    items: [
      { id: 'main-heading', label: 'Main Menu', icon: null as any, path: '', type: 'heading' as any },
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
      { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics?view=analytics' },

      { id: 'org-heading', label: 'Administration', icon: null as any, path: '', type: 'heading' as any },
      { id: 'team', label: 'Team & HR', icon: Users, path: '/team' },
      // { id: 'hierarchy', label: 'Org Hierarchy', icon: Users2, path: '/team/hierarchy' },

      { id: 'finance-heading', label: 'Finance', icon: null as any, path: '', type: 'heading' as any },
      { id: 'payroll', label: 'Payroll', icon: Wallet, path: '/team?view=payroll' },
      { id: 'expense', label: 'Expenses', icon: FileText, path: '/team?view=expense' },
      { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
    ],
    showLogo: true,
    showFooter: true
  },
  header: { showBreadcrumbs: true, showActions: true },
};

const TEAM_CONFIG: LayoutConfig = {
  theme: 'dashboard',
  logo: {
    icon: ShieldCheck,
    text: 'Architect',
    color: '#4f46e5'
  },
  sidebar: {
    items: [
      { id: 'nav-heading', label: 'Navigation', icon: null as any, path: '', type: 'heading' as any },
      { id: 'dashboard', label: 'Back to Dashboard', icon: LayoutDashboard, path: '/' },

      { id: 'org-heading', label: 'Org Structure', icon: null as any, path: '', type: 'heading' as any },
      // { id: 'hierarchy', label: 'Org Hierarchy', icon: Users2, path: '/team' },
      { id: 'create-user', label: 'Create Member', icon: UserCircle2, path: '/team?view=create' },

      { id: 'resources-heading', label: 'Resources', icon: null as any, path: '', type: 'heading' as any },
      { id: 'payroll', label: 'Payroll System', icon: Wallet, path: '/team?view=payroll' },
      { id: 'expense', label: 'Expenses', icon: FileText, path: '/team?view=expense' },
      { id: 'leave-config', label: 'Leave Config', icon: Calendar, path: '/team?view=leave' },
    ],
    showLogo: true,
    showFooter: true,
    header: { icon: ShieldCheck, title: 'HR Management', subtitle: 'Org & Personnel' }
  },
  header: {
    showBreadcrumbs: false,
    showActions: true,
    tabs: [
      { id: 'hierarchy', label: 'Hierarchy', path: '/team' },
      { id: 'create', label: 'Create Member', path: '/team?view=create' },
      { id: 'payroll', label: 'Payroll', path: '/team?view=payroll' },
      { id: 'expense', label: 'Expenses', path: '/team?view=expense' },
      { id: 'leaves', label: 'Leaves', path: '/team?view=leave' },
    ]
  },
};

const ANALYTICS_CONFIG: LayoutConfig = {
  theme: 'dashboard',
  logo: {
    icon: BarChart3,
    text: 'Analytics',
    color: '#0891b2'
  },
  sidebar: {
    items: [
      { id: 'analytics', label: 'Employee Metrics', icon: BarChart3, path: '/analytics?view=analytics' },
    ],
    showLogo: true,
    showFooter: true
  },
  header: { showBreadcrumbs: true, showActions: true },
};

const EMPLOYEE_PROFILE_CONFIG: LayoutConfig = {
  theme: 'dashboard',
  logo: {
    icon: UserCircle2,
    text: 'Employee',
    color: '#2563eb'
  },
  sidebar: {
    items: [
      { id: 'profile', label: 'Overview', icon: UserCircle2, path: '#' },
      // { id: 'performance', label: 'Performance', icon: TrendingUp, path: '#' },
      // { id: 'activity', label: 'Activity', icon: Activity, path: '#' },
      // { id: 'history', label: 'History', icon: History, path: '#' },

    ],
    showLogo: true,
    showFooter: true,
    header: { icon: UserCircle2, title: 'Employee Profile', subtitle: 'Detailed Analytics' }
  },
  header: {
    showBreadcrumbs: true,
    showActions: true,
    tabs: [
      { id: 'performance', label: 'Performance', path: '#' },
      { id: 'activity', label: 'Activity', path: '#' },
      { id: 'timeline', label: 'Timeline', path: '#' },
      { id: 'documents', label: 'Documents', path: '#' },
    ]
  },
};

// Date Range Types
export type DateRangeKey = 'Today' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'custom';

export interface DateRange {
  key: DateRangeKey;
  label: string;
  startDate: string;
  endDate: string;
}

const getDatesForRange = (key: DateRangeKey): { startDate: string, endDate: string, label: string } => {
  const now = new Date();
  const end = now.toISOString().split('T')[0];
  let start = new Date();
  let label = 'Today';

  switch (key) {
    case 'Today':
      label = 'Today';
      break;
    case '1W':
      start.setDate(now.getDate() - 7);
      label = 'Last 7 Days';
      break;
    case '1M':
      start.setMonth(now.getMonth() - 1);
      label = 'Last 30 Days';
      break;
    case '3M':
      start.setMonth(now.getMonth() - 3);
      label = 'Last 3 Months';
      break;
    case '6M':
      start.setMonth(now.getMonth() - 6);
      label = 'Last 6 Months';
      break;
    case '1Y':
      start.setFullYear(now.getFullYear() - 1);
      label = 'Last 1 Year';
      break;
    default:
      start.setDate(1);
  }

  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end,
    label
  };
};

interface LayoutContextType {
  activeSection: string;
  config: LayoutConfig;
  dateRange: DateRange;
  setDateRange: (key: DateRangeKey, custom?: { start: string, end: string, label?: string }) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  const toggleSidebar = React.useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  const [dateRange, setDateRangeState] = React.useState<DateRange>(() => {
    const info = getDatesForRange('Today');
    return { key: 'Today', ...info };
  });

  const setDateRange = React.useCallback((key: DateRangeKey, custom?: { start: string, end: string, label?: string }) => {
    if (key === 'custom' && custom) {
      setDateRangeState({
        key: 'custom',
        label: custom.label || 'Custom Range',
        startDate: custom.start,
        endDate: custom.end
      });
    } else {
      const info = getDatesForRange(key);
      setDateRangeState({ key, ...info });
    }
  }, []);

  const activeSection = React.useMemo(() => {
    return pathname === '/' ? 'dashboard' : pathname.split('/')[1];
  }, [pathname]);

  const config = React.useMemo(() => {
    if (activeSection === 'team') return TEAM_CONFIG;
    if (activeSection === 'analytics') {
      return pathname.includes('/analytics/') ? EMPLOYEE_PROFILE_CONFIG : ANALYTICS_CONFIG;
    }
    return DASHBOARD_CONFIG;
  }, [activeSection, pathname]);

  const value = React.useMemo(() => ({
    activeSection,
    config,
    dateRange,
    setDateRange,
    isSidebarCollapsed,
    toggleSidebar
  }), [activeSection, config, dateRange, setDateRange, isSidebarCollapsed, toggleSidebar]);

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
