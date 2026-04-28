import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface TagInputProps {
  label: string;
  tags: string[];
  onAdd: (v: string) => void;
  onRemove: (i: number) => void;
  placeholder: string;
  color?: string;
}

export function TagInput({
  label,
  tags,
  onAdd,
  onRemove,
  placeholder,
  color = 'blue'
}: TagInputProps) {
  const [val, setVal] = useState('');
  
  const handleAdd = () => {
    if (val.trim()) {
      onAdd(val.trim());
      setVal('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    teal: 'bg-teal-50 text-teal-700 border-teal-100',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  };
  
  const cls = colorMap[color] ?? colorMap.blue;

  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none ml-1">{label}</label>
      <div className="flex flex-wrap gap-2 mb-3 min-h-[44px] p-2 bg-slate-50/50 rounded-[20px] border border-dashed border-slate-200">
        {tags.length === 0 && (
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest m-auto">No tags assigned</span>
        )}
        {tags.map((t, i) => (
          <span key={i} className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight border transition-all hover:scale-105 ${cls}`}>
            {t}
            <button type="button" onClick={() => onRemove(i)} className="hover:scale-125 hover:text-rose-600 transition-all">
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      <div className="relative group">
        <input
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-white border border-slate-200 outline-none rounded-2xl px-6 py-4 text-xs font-bold text-slate-600 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all pr-12"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-slate-100 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
