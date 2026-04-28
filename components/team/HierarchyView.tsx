'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useGetHierarchyQuery } from '@/store/api/userApi';
import { IMAGE_BASE_URL } from '@/constant/api';
import {
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Users2,
  Target,
  Move,
  Search
} from 'lucide-react';

interface EmployeeNode {
  id: string;
  name: string;
  designation: string;
  photo?: string;
  role: string | { name: string };
  isActive: boolean;
  children: EmployeeNode[];
}

const HierarchyView = () => {
  const { token } = useAuth();
  const { data = [], isLoading: loading } = useGetHierarchyQuery({ includeInactive: true }, { skip: !token });
  
  const [zoom, setZoom] = useState(0.8);
  const [position, setPosition] = useState({ x: 0, y: 150 });
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setPosition({
      x: e.clientX - startPos.current.x,
      y: e.clientY - startPos.current.y
    });
  };

  const handleMouseUp = () => isDragging.current = false;

  const countNodes = (nodes: EmployeeNode[]): number => {
    let count = nodes.length;
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        count += countNodes(node.children);
      }
    });
    return count;
  };

  const totalNodes = React.useMemo(() => countNodes(data), [data]);

  const renderNode = (node: EmployeeNode, isRoot = false) => {
    const roleName = typeof node.role === 'string' ? node.role : node.role?.name || 'Member';
    const subtext = node.designation || roleName;
    const hasChildren = node.children.length > 0;
    const isInactive = node.isActive === false;

    return (
      <div key={node.id} className="flex flex-col items-center">
        {/* Node Card */}
        <div 
          className={`relative z-20 flex flex-col items-center mb-24 transition-all ${isRoot ? 'scale-125' : ''} ${isInactive ? 'opacity-60' : ''}`} 
          style={{ width: '240px' }}
        >

          <div className="relative">
            <div className={`w-16 h-16 rounded-full border-4 ${isInactive ? 'border-slate-200 grayscale shadow-none' : isRoot ? 'border-slate-900 shadow-2xl' : 'border-white shadow-lg'} p-0.5 bg-white overflow-hidden group-hover:border-indigo-600 transition-all`}>
              {node.photo ? (
                <img src={`${IMAGE_BASE_URL}${node.photo}`} alt={node.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300">
                  <Users2 size={24} />
                </div>
              )}
            </div>
            {isInactive && (
              <div className="absolute -bottom-1 -right-1 bg-slate-400 text-white text-[7px] font-black uppercase px-1.5 py-0.5 rounded-full border-2 border-white">
                Inactive
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <h4 className={`text-[13px] font-black leading-tight ${isInactive ? 'text-slate-400' : 'text-slate-900'}`}>{node.name}</h4>
            <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${isInactive ? 'text-slate-300' : 'text-slate-400'}`}>
              {subtext}
            </p>
          </div>

          {/* Connection Line Down */}
          {hasChildren && (
            <div className="absolute top-[calc(100%+15px)] left-1/2 -translate-x-1/2 w-px h-12 border-l-2 border-dashed border-slate-300" />
          )}
        </div>

        {/* Children Render */}
        {hasChildren && (
          <div className="flex gap-12 relative">
            {/* Horizontal Connector Line */}
            <div className="absolute -top-12 left-0 right-0 h-px flex justify-center">
              <div className="w-[calc(100%-240px)] h-px border-t-2 border-dashed border-slate-300" />
            </div>

            {node.children.map((child) => (
              <div key={child.id} className="relative">
                {/* Vertical Step Up to connector line */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-px h-12 border-l-2 border-dashed border-slate-300" />
                {renderNode(child)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) return (
    <div className="flex-1 flex flex-col items-center justify-center bg-white gap-4">
      <div className="w-10 h-10 border-2 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="h-full bg-white flex flex-col relative overflow-hidden select-none">

      {/* 🚀 Header Overlay */}
      <div className="absolute top-10 left-10 z-50 flex flex-col gap-1 pointer-events-none">
        <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Organization Chart</h2>
        <div className="flex items-center gap-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-extra-widest">Enterprise Structure • Center Oriented</p>
          <div className="w-1 h-1 bg-slate-300 rounded-full" />
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{totalNodes} Total Personnel Detected</p>
        </div>
      </div>

      {/* 🛠️ Modern Navigation Rails (Controls) */}
      <div className="absolute bottom-10 right-10 flex flex-col gap-4 z-50">
        <div className="bg-white border border-slate-100 rounded-[36px] p-2 flex flex-col gap-2 shadow-2xl">
          <button onClick={() => setZoom(z => Math.min(z + 0.1, 2.5))} className="p-4 hover:bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-full transition-all">
            <ZoomIn size={22} />
          </button>
          <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.2))} className="p-4 hover:bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-full transition-all">
            <ZoomOut size={22} />
          </button>
          <div className="h-px bg-slate-100 mx-4 my-1" />
          <button onClick={() => { setZoom(0.8); setPosition({ x: 0, y: 150 }); }} className="p-4 hover:bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-full transition-all">
            <Maximize2 size={22} />
          </button>
        </div>
      </div>

      {/* 🧭 Interaction Guide */}
      <div className="absolute bottom-10 left-10 z-50">
        <div className="bg-slate-50 text-slate-400 px-6 py-3 rounded-full flex items-center gap-3 border border-slate-100">
          <Move size={14} />
          <span className="text-[9px] font-black uppercase tracking-widest leading-none">Drag to navigate architecture</span>
        </div>
      </div>

      {/* 🎨 Canvas Rendering Engine */}
      <div
        className="flex-1 relative overflow-hidden bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:40px_40px] cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="absolute transition-transform duration-100 ease-out origin-top flex justify-center"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            left: '50%',
            top: '0px',
            width: '1px' 
          }}
        >
          <div className="flex items-start justify-center gap-32">
            {data.length > 0 ? data.map(root => renderNode(root, true)) : (
              <div className="mt-20 flex flex-col items-center gap-4 opacity-20">
                <Users2 size={48} />
                <p className="text-xs font-black uppercase tracking-widest">No structural data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HierarchyView;
