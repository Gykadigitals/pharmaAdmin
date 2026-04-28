'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('❌ Global App Router Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-8">
      <div className="max-w-xl w-full bg-slate-900/50 backdrop-blur-xl rounded-[48px] border border-slate-800 p-12 text-center space-y-10 shadow-2xl">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center border border-rose-500/20">
            <AlertTriangle size={40} className="text-rose-500" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">System Interruption</h1>
          <p className="text-slate-400 font-medium">
            The application experienced a core level exception. Automated diagnostic logs have been generated.
          </p>
        </div>

        <div className="bg-slate-950/50 rounded-3xl p-6 border border-slate-800 text-left">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Technical Diagnostic</p>
           <code className="text-[11px] font-bold text-rose-400 break-all">
             {error.message || 'Next.js rendering failure'}
           </code>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto bg-indigo-600 text-white px-10 py-4 rounded-3xl font-black text-[11px] uppercase tracking-extra-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
          >
            <RefreshCcw size={16} className="inline mr-2" /> Re-initialize
          </button>
          <a
            href="/"
            className="w-full sm:w-auto bg-slate-800 text-white px-10 py-4 rounded-3xl font-black text-[11px] uppercase tracking-extra-widest hover:bg-slate-700 transition-all"
          >
            <Home size={16} className="inline mr-2" /> Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
