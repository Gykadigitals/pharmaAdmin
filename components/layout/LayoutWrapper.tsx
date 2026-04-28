'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { colors } from '@/constant/colors';
import { LayoutProvider, useLayout } from '@/context/LayoutContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Link from 'next/link';
import { Navigation } from 'lucide-react';

interface LayoutContentProps {
  children: React.ReactNode;
}

const LayoutContent: React.FC<LayoutContentProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = React.useCallback(() => {
    setIsSidebarOpen(true);
  }, []);

  const { config, isSidebarCollapsed } = useLayout();
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  const isLoginPage = pathname === '/login';

  // If on login page, just show children without any dashboard layout
  if (isLoginPage) {
    return <div className="min-h-screen bg-[#0f172a]">{children}</div>;
  }

  const [showTimeoutAction, setShowTimeoutAction] = useState(false);

  React.useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setShowTimeoutAction(true), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowTimeoutAction(false);
    }
  }, [isLoading]);

  // Simplified: If we are checking auth or not authenticated, don't show the dashboard layout.
  // AuthContext will handle the redirect to /login automatically.
  if (isLoading || (!isAuthenticated && !isLoginPage)) {
    return null;
  }

  return (
    <div className="h-screen flex bg-white gpu-accelerate">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className={`flex-1 flex flex-col transition-fast gpu-accelerate ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} w-full max-w-full overflow-x-hidden`}>
        <Header
          onMenuClick={handleMenuClick}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden gpu-accelerate w-full">
          <div className="w-full h-full">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </main>
      </div>

      {/* 🚀 Truly Fixed Global FAB - Icon Only (All screens) */}
      <Link href="/fleet" className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 group z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-indigo-600 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl shadow-2xl shadow-indigo-500/40 border border-indigo-400 group-hover:scale-110 active:scale-95 transition-all flex items-center justify-center">
          <Navigation size={22} fill="white" className="sm:w-7 sm:h-7 text-white" />
        </div>
      </Link>
    </div>
  );
};

interface LayoutWrapperProps {
  children: React.ReactNode;
}

import { Provider } from 'react-redux';
import { store } from '@/store';

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <LayoutProvider>
          <LayoutContent>{children}</LayoutContent>
        </LayoutProvider>
      </AuthProvider>
    </Provider>
  );
};

export default LayoutWrapper;


