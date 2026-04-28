'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCcw, Home, ShieldOff } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('❌ Enterprise Error Boundary Caught:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[400px] w-full flex items-center justify-center p-8 bg-slate-50/50 rounded-[48px] border-2 border-dashed border-slate-200 animate-in fade-in zoom-in-95 duration-500">
          <div className="max-w-md w-full text-center space-y-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-rose-50 rounded-[32px] flex items-center justify-center shadow-xl shadow-rose-500/10 border border-rose-100">
                <AlertOctagon size={48} className="text-rose-500 animate-pulse" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border border-slate-100">
                <div className="w-4 h-4 bg-rose-500 rounded-full" />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase tracking-widest">Runtime Exception</h2>
              <p className="text-sm text-slate-400 font-medium px-4">
                The enterprise module encountered an unexpected state. Infrastructure integrity has been maintained.
              </p>
            </div>

            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Error Diagnostic</p>
              <code className="text-[11px] font-bold text-rose-600 break-all leading-relaxed">
                {this.state.error?.message || 'Unknown system fault'}
              </code>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[24px] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all"
              >
                <RefreshCcw size={16} /> Recover Module
              </button>
              <a
                href="/"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-slate-600 border border-slate-200 px-8 py-4 rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all"
              >
                <Home size={16} /> Return Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
