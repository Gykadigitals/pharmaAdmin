'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  companyId: string;
  companyName: string;
  role: string;
  permissions: string[];
  photo?: string;
}

interface Company {
  companyId: string;
  name: string;
  code: string;
  logoUrl?: string;
  webUrl: string;
}

interface AuthContextType {
  user: User | null;
  company: Company | null;
  stats: any | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User, company: Company, stats?: any) => void;
  logout: () => void;
  setCompanyData: (company: Company) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [stats, setStats] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('auth_user');
      const savedCompany = localStorage.getItem('auth_company');
      const savedStats = localStorage.getItem('auth_stats');

      console.log('🔄 AuthContext Initialization:', {
        hasToken: !!savedToken,
        hasUser: !!savedUser,
        hasCompany: !!savedCompany,
        hasStats: !!savedStats
      });

      if (savedCompany) {
        try {
          setCompany(JSON.parse(savedCompany));
        } catch (e) {
          console.error('Failed to parse saved company');
        }
      }

      if (savedStats) {
        try {
          setStats(JSON.parse(savedStats));
        } catch (e) {
          console.error('Failed to parse saved stats');
        }
      }
      
      if (savedToken && savedUser) {
        try {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Failed to parse saved user/token');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: User, newCompany: Company, newStats?: any) => {
    console.log('🔑 Login Success - Updating State:', { company: newCompany.name, statsReceived: !!newStats });
    setToken(newToken);
    setUser(newUser);
    setCompany(newCompany);
    if (newStats) {
      setStats(newStats);
      localStorage.setItem('auth_stats', JSON.stringify(newStats));
    }
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    localStorage.setItem('auth_company', JSON.stringify(newCompany));
    router.replace('/');
  };

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setStats(null);
    // Note: We KEEP the company data for persistent workspace connection
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_stats');
    router.replace('/login');
  }, [router]);


  const setCompanyData = (companyData: Company) => {
    setCompany(companyData);
    localStorage.setItem('auth_company', JSON.stringify(companyData));
  };

  // Auth Guard & Global Token Expiration Listener
  useEffect(() => {
    const handleGlobalLogout = () => {
      console.warn('⚠️ Global Logout Event Received (likely token expired)');
      logout();
    };

    window.addEventListener('auth:logout', handleGlobalLogout);

    if (!isLoading) {
      if (!token && pathname !== '/login') {
        router.replace('/login');
      } else if (token && pathname === '/login') {
        router.replace('/');
      }
    }

    return () => window.removeEventListener('auth:logout', handleGlobalLogout);
  }, [token, pathname, isLoading, router, logout]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      company, 
      stats,
      token, 
      isAuthenticated: !!token, 
      isLoading,
      login, 
      logout,
      setCompanyData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
