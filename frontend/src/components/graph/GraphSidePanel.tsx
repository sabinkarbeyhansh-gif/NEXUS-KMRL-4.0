import React from 'react';
import {
  X,
  ExternalLink,
  FileText,
  ClipboardList,
  Flame,
  CalendarClock,
  Shield,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { KnowledgeGraphNodeData } from '../../types';
import { useNavigate } from 'react-router-dom';

interface GraphSidePanelProps {
  nodeData: KnowledgeGraphNodeData | null;
  onClose: () => void;
}

export const GraphSidePanel: React.FC<GraphSidePanelProps> = ({
  nodeData,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!nodeData) return null;

  return (
    <div className="absolute top-4 right-4 bottom-4 w-80 md:w-96 rounded-3xl bg-[#0D1526]/95 backdrop-blur-xl border border-[#1E2D4A] p-5 shadow-2xl z-20 flex flex-col space-y-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#1E2D4A] pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 tracking-wider">
            {nodeData.type} ENTITY PROFILE
          </span>
          <h3 className="text-base font-extrabold text-white leading-snug mt-0.5">
            {nodeData.label}
          </h3>
          {nodeData.department && (
            <span className="text-xs text-slate-400 font-mono">
              Dept: {nodeData.department}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#131E35]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Description / Details */}
      <div className="p-3 rounded-2xl bg-[#131E35]/60 border border-[#1E2D4A] text-xs text-slate-300 leading-relaxed">
        {nodeData.details || 'Entity synchronized with live KMRL SCADA & Document Intelligence network.'}
      </div>

      {/* Operational Metrics Cards */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-xl bg-[#070B14] border border-[#1E2D4A] space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono uppercase">
            <FileText className="w-3 h-3 text-cyan-400" />
            Related Docs
          </div>
          <p className="text-lg font-extrabold text-white">
            {nodeData.metrics?.relatedDocs ?? (nodeData.documentId ? 1 : 6)}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-[#070B14] border border-[#1E2D4A] space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono uppercase">
            <ClipboardList className="w-3 h-3 text-amber-400" />
            Open Actions
          </div>
          <p className="text-lg font-extrabold text-amber-400">
            {nodeData.metrics?.openActions ?? 2}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-[#070B14] border border-[#1E2D4A] space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono uppercase">
            <Flame className="w-3 h-3 text-rose-400" />
            Critical Risks
          </div>
          <p className="text-lg font-extrabold text-rose-400">
            {nodeData.metrics?.criticalRisks ?? 1}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-[#070B14] border border-[#1E2D4A] space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono uppercase">
            <CalendarClock className="w-3 h-3 text-emerald-400" />
            Deadlines
          </div>
          <p className="text-lg font-extrabold text-emerald-400">
            {nodeData.metrics?.upcomingDeadlines ?? 3}
          </p>
        </div>
      </div>

      {/* Latest Operational Activity */}
      <div className="flex-1 overflow-y-auto space-y-2 text-xs">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
          Latest Activity Log:
        </span>
        <div className="space-y-2">
          <div className="p-2.5 rounded-xl bg-[#131E35]/40 border border-[#1E2D4A] text-slate-300">
            <p className="font-semibold text-white">Periodic Statutory Check</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Hydraulic pressure verification protocol active under CMRS directive.
            </p>
            <span className="text-[9px] text-cyan-400 font-mono mt-1 block">
              10 Sep 2026, 09:30 AM IST
            </span>
          </div>
        </div>
      </div>

      {/* Action Navigation Buttons */}
      <div className="pt-2 border-t border-[#1E2D4A] space-y-2">
        {nodeData.documentId ? (
          <button
            onClick={() => navigate(`/documents/${nodeData.documentId}`)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-md transition-all"
          >
            Open Document Intelligence <ExternalLink className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate(`/documents?station=${encodeURIComponent(nodeData.station || nodeData.label)}`)}
              className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#131E35] hover:bg-[#1E2D4A] text-cyan-300 border border-cyan-500/30 text-xs font-semibold"
            >
              <FileText className="w-3.5 h-3.5" />
              View Documents
            </button>
            <button
              onClick={() => navigate('/actions')}
              className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#131E35] hover:bg-[#1E2D4A] text-amber-300 border border-amber-500/30 text-xs font-semibold"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              View Actions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
