import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  Building2,
  FileText,
  AlertTriangle,
  ClipboardList,
  Flame,
  UserCheck,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { KnowledgeGraphNodeData } from '../../types';

export const StationNode = memo(({ data }: { data: KnowledgeGraphNodeData }) => {
  return (
    <div className="px-4 py-3 rounded-2xl bg-[#0D1526] border-2 border-cyan-500/50 shadow-xl shadow-cyan-500/10 min-w-[220px] text-slate-100 hover:border-cyan-400 transition-all cursor-pointer">
      <Handle type="target" position={Position.Top} className="!bg-cyan-400 !w-2.5 !h-2.5" />
      <div className="flex items-center gap-2.5 border-b border-[#1E2D4A] pb-2 mb-2">
        <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
          <Building2 className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-wider uppercase">
            STATION
          </span>
          <h4 className="text-xs font-extrabold text-white leading-tight">{data.label}</h4>
        </div>
      </div>

      {data.metrics && (
        <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono">
          <div className="bg-[#131E35] p-1 rounded border border-[#1E2D4A]">
            <span className="text-slate-400">Docs:</span>{' '}
            <span className="text-cyan-300 font-bold">{data.metrics.relatedDocs || 0}</span>
          </div>
          <div className="bg-[#131E35] p-1 rounded border border-[#1E2D4A]">
            <span className="text-slate-400">Tasks:</span>{' '}
            <span className="text-amber-300 font-bold">{data.metrics.openActions || 0}</span>
          </div>
          <div className="bg-[#131E35] p-1 rounded border border-[#1E2D4A]">
            <span className="text-slate-400">Risks:</span>{' '}
            <span className="text-rose-400 font-bold">{data.metrics.criticalRisks || 0}</span>
          </div>
          <div className="bg-[#131E35] p-1 rounded border border-[#1E2D4A]">
            <span className="text-slate-400">Deadlines:</span>{' '}
            <span className="text-emerald-400 font-bold">{data.metrics.upcomingDeadlines || 0}</span>
          </div>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-cyan-400 !w-2.5 !h-2.5" />
    </div>
  );
});

export const DocumentNode = memo(({ data }: { data: KnowledgeGraphNodeData }) => {
  const isCritical = data.priority === 'CRITICAL';
  return (
    <div
      className={`px-3.5 py-2.5 rounded-2xl bg-[#0D1526] border-2 shadow-lg min-w-[200px] text-slate-100 transition-all cursor-pointer ${
        isCritical
          ? 'border-rose-500/60 shadow-rose-500/20'
          : 'border-blue-500/50 shadow-blue-500/10'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-blue-400 !w-2 !h-2" />
      <div className="flex items-center gap-2">
        <div
          className={`p-1.5 rounded-lg ${
            isCritical ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-slate-400 uppercase">DOCUMENT</span>
            {data.priority && (
              <span
                className={`text-[8px] px-1 rounded font-bold uppercase ${
                  isCritical ? 'bg-rose-500/20 text-rose-300' : 'bg-blue-500/20 text-blue-300'
                }`}
              >
                {data.priority}
              </span>
            )}
          </div>
          <h4 className="text-xs font-bold text-white truncate">{data.label}</h4>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-blue-400 !w-2 !h-2" />
    </div>
  );
});

export const RiskNode = memo(({ data }: { data: KnowledgeGraphNodeData }) => {
  return (
    <div className="px-3 py-2 rounded-2xl bg-rose-950/40 border-2 border-rose-500/70 shadow-lg shadow-rose-500/20 min-w-[190px] text-slate-100 hover:scale-105 transition-all cursor-pointer">
      <Handle type="target" position={Position.Top} className="!bg-rose-500 !w-2 !h-2" />
      <div className="flex items-center gap-2">
        <div className="p-1 rounded-lg bg-rose-500/30 text-rose-400 animate-pulse">
          <Flame className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0">
          <span className="text-[8px] font-mono font-bold text-rose-400 tracking-wider">
            OPERATIONAL RISK
          </span>
          <h5 className="text-xs font-bold text-rose-200 truncate">{data.label}</h5>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-rose-500 !w-2 !h-2" />
    </div>
  );
});

export const TaskNode = memo(({ data }: { data: KnowledgeGraphNodeData }) => {
  return (
    <div className="px-3 py-2 rounded-2xl bg-emerald-950/30 border-2 border-emerald-500/60 shadow-lg min-w-[190px] text-slate-100 hover:scale-105 transition-all cursor-pointer">
      <Handle type="target" position={Position.Top} className="!bg-emerald-400 !w-2 !h-2" />
      <div className="flex items-center gap-2">
        <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
          <ClipboardList className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0">
          <span className="text-[8px] font-mono font-bold text-emerald-400 tracking-wider">
            ACTION ITEM
          </span>
          <h5 className="text-xs font-bold text-slate-100 truncate">{data.label}</h5>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-emerald-400 !w-2 !h-2" />
    </div>
  );
});

export const DepartmentNode = memo(({ data }: { data: KnowledgeGraphNodeData }) => {
  return (
    <div className="px-3.5 py-2.5 rounded-2xl bg-[#0D1526] border-2 border-purple-500/60 shadow-lg shadow-purple-500/10 min-w-[200px] text-slate-100 cursor-pointer">
      <Handle type="target" position={Position.Top} className="!bg-purple-400 !w-2 !h-2" />
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
          <Shield className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0">
          <span className="text-[8px] font-mono text-purple-400 uppercase font-bold">
            DIRECTORATE
          </span>
          <h5 className="text-xs font-bold text-white truncate">{data.label}</h5>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-purple-400 !w-2 !h-2" />
    </div>
  );
});

export const OfficerNode = memo(({ data }: { data: KnowledgeGraphNodeData }) => {
  return (
    <div className="px-3 py-2 rounded-2xl bg-[#0D1526] border-2 border-sky-500/50 shadow-md min-w-[180px] text-slate-100 cursor-pointer">
      <Handle type="target" position={Position.Top} className="!bg-sky-400 !w-2 !h-2" />
      <div className="flex items-center gap-2">
        <div className="p-1 rounded-lg bg-sky-500/20 text-sky-400">
          <UserCheck className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0">
          <span className="text-[8px] font-mono text-sky-400 uppercase font-bold">OFFICER</span>
          <h5 className="text-xs font-bold text-slate-200 truncate">{data.label}</h5>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-sky-400 !w-2 !h-2" />
    </div>
  );
});
