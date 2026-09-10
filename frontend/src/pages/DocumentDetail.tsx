import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  ArrowLeft,
  Flame,
  Sparkles,
  AlertTriangle,
  Network,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  SlidersHorizontal,
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { PriorityBadge } from '../components/documents/PriorityBadge';
import { PriorityOverrideModal } from '../components/documents/PriorityOverrideModal';
import { formatISTFull, formatISTDate, getDeadlineStatus } from '../utils/dateTime';

export const DocumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { documents, aiStatus } = useData();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SUMMARY' | 'ACTIONS' | 'RISKS' | 'ENTITIES' | 'TIMELINE' | 'CONFLICTS' | 'SOURCE'>('OVERVIEW');
  const [overrideModalOpen, setOverrideModalOpen] = useState<boolean>(false);
  const [pdfPage, setPdfPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const document = documents.find((d) => d.id === id) || documents[0];
  const deadline = getDeadlineStatus(document?.submissionDeadline);
  const effectivePriority = document?.humanPriority || document?.aiPriority || 'HIGH';

  if (!document) {
    return (
      <div className="p-12 text-center text-slate-400 space-y-4">
        <p>Document not found.</p>
        <button
          onClick={() => navigate('/documents')}
          className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs"
        >
          Back to Documents
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/documents')}
            className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-indigo-400 font-medium">{document.id}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-mono">{document.department}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">{document.language}</span>
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-snug">
              {document.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOverrideModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition-all"
            title="Override AI priority classification"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Override Priority
          </button>
          <button
            onClick={() => navigate('/graph')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-xs shadow-indigo-500/20 transition-all"
          >
            <Network className="w-3.5 h-3.5" />
            View in Graph
          </button>
        </div>
      </div>

      {/* Split View Layout: Left = Document Preview, Right = AI Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Simulated PDF / Document Viewer (5 cols) */}
        <div className="lg:col-span-5 linear-card rounded-xl border border-slate-800 p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
            <div className="flex items-center gap-2 font-mono text-slate-400">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span className="truncate max-w-[180px] text-slate-200 font-medium">
                {document.fileName}
              </span>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setZoomLevel((prev) => Math.max(75, prev - 15))}
                className="p-1 hover:text-white"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((prev) => Math.min(150, prev + 15))}
                className="p-1 hover:text-white"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Document Preview Canvas */}
          <div className="flex-1 min-h-[480px] max-h-[620px] overflow-auto bg-[#070B14] rounded-2xl border border-[#1E2D4A] p-6 text-slate-200 font-serif leading-relaxed text-xs relative space-y-4">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
              <span className="text-6xl font-black text-cyan-400 rotate-[-30deg]">KMRL OFFICIAL</span>
            </div>

            {/* Document Header Representation */}
            <div className="border-b-2 border-slate-700 pb-4 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase">
                <span>KOCHI METRO RAIL LIMITED</span>
                <span>{document.id}</span>
              </div>
              <h3 className="text-sm font-bold text-white font-sans uppercase">
                {document.title}
              </h3>
              <div className="flex justify-between text-[10px] font-mono text-cyan-400">
                <span>Directing Body: {document.department}</span>
                <span>Date: {formatISTDate(document.receivedDate)}</span>
              </div>
            </div>

            {/* Simulated Document Body with Extracted Clauses */}
            <div className="space-y-3 font-sans text-slate-300">
              <p className="font-semibold text-slate-100">1. EXECUTIVE SUMMARY & STATUTORY NOTICE</p>
              <p className="bg-cyan-500/10 p-2.5 rounded-lg border border-cyan-500/20 text-cyan-200">
                {document.summary}
              </p>

              <p className="font-semibold text-slate-100 mt-4">2. OPERATIONAL DIRECTIVES & FINDINGS</p>
              <ul className="list-disc pl-5 space-y-1.5 text-[11px] text-slate-300">
                {document.keyFacts.map((fact, idx) => (
                  <li key={idx}>
                    <span className="bg-amber-500/10 px-1 rounded text-amber-200">{fact}</span>
                  </li>
                ))}
              </ul>

              <p className="font-semibold text-slate-100 mt-4">3. STATUTORY COMPLIANCE & DEADLINE</p>
              <p className="text-[11px] text-slate-400">
                Under powers conferred by Section 28 of Metro Railways Act, response protocol must be submitted to the Operations Control Center before {formatISTFull(document.submissionDeadline)}.
              </p>

              {document.rawContentSnippet && (
                <div className="p-3 bg-[#131E35]/40 rounded-xl border border-[#1E2D4A] mt-4 font-mono text-[10px] text-slate-400">
                  <span className="text-cyan-400 font-bold block mb-1">RAW EXTRACTED SNIPPET:</span>
                  {document.rawContentSnippet}
                </div>
              )}
            </div>
          </div>

          {/* Page Pagination Controls */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-[10px] font-mono text-slate-400">
              Page {pdfPage} of 4 • Certified Ingested
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPdfPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded-lg bg-[#131E35] text-slate-400 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPdfPage((p) => Math.min(4, p + 1))}
                className="p-1 rounded-lg bg-[#131E35] text-slate-400 hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Intelligence Engine Tabs (7 cols) */}
        <div className="lg:col-span-7 linear-card rounded-xl border border-slate-800 p-5 flex flex-col space-y-4">
          {/* AI Trust Layer Header */}
          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[11px] font-mono font-medium text-indigo-300 uppercase tracking-wide">
                  AI INTELLIGENCE EXTRACTION
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {formatISTFull(document.receivedDate)}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs font-mono">
              <div className="bg-slate-950 p-2 rounded-md border border-slate-800/80">
                <span className="text-[9px] text-slate-500 block">AI ENGINE</span>
                <span className="font-medium text-slate-200">{aiStatus.provider}</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-md border border-slate-800/80">
                <span className="text-[9px] text-slate-500 block">CONFIDENCE</span>
                <span className="font-medium text-indigo-400">{document.aiConfidence}%</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-md border border-slate-800/80">
                <span className="text-[9px] text-slate-500 block">PRIORITY</span>
                <PriorityBadge priority={effectivePriority} />
              </div>
              <div className="bg-slate-950 p-2 rounded-md border border-slate-800/80">
                <span className="text-[9px] text-slate-500 block">DEADLINE</span>
                <span className={`text-[10px] font-medium ${deadline.isOverdue ? 'text-rose-400' : 'text-amber-400'}`}>
                  {deadline.label}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 pt-0.5">
              Rationale: "{document.aiPriorityReason}"
            </div>

            {document.humanPriority && (
              <div className="p-2 rounded-md bg-amber-500/10 border border-amber-500/25 text-xs text-amber-300 space-y-0.5">
                <span className="font-medium uppercase text-[9px] font-mono">HUMAN PRIORITY OVERRIDE APPLIED:</span>
                <p className="text-[11px]">
                  Overridden by {document.priorityChangedBy} to {document.humanPriority}. Reason: "{document.priorityOverrideReason}"
                </p>
              </div>
            )}
          </div>

          {/* Navigation Tabs (Linear style) */}
          <div className="flex items-center gap-1 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-medium">
            {[
              { id: 'OVERVIEW', label: 'Overview' },
              { id: 'SUMMARY', label: 'Key Facts' },
              { id: 'ACTIONS', label: `Actions (${document.actions.length})` },
              { id: 'RISKS', label: `Risks (${document.risks.length})` },
              { id: 'ENTITIES', label: `Entities (${document.entities.length})` },
              { id: 'TIMELINE', label: 'Timeline' },
              { id: 'CONFLICTS', label: `Conflicts (${document.conflicts?.length || 0})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 text-xs ${
                  activeTab === tab.id
                    ? 'bg-white/[0.1] text-white font-medium border border-white/10 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {/* Overview Tab */}
            {activeTab === 'OVERVIEW' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#131E35]/50 border border-[#1E2D4A] space-y-2">
                  <h4 className="font-bold text-white text-sm">Executive Operational Abstract</h4>
                  <p className="text-slate-300 leading-relaxed">{document.summary}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#070B14] border border-[#1E2D4A] space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono uppercase">Assigned Officer</span>
                    <p className="font-bold text-white text-sm">{document.assignedTo}</p>
                    <span className="text-[10px] text-cyan-400 font-mono">{document.department}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#070B14] border border-[#1E2D4A] space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono uppercase">Location / Station</span>
                    <p className="font-bold text-white text-sm">{document.station || 'All Stations'}</p>
                    <span className="text-[10px] text-slate-400 font-mono">Corridor Aluva-Petta</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#131E35]/40 border border-[#1E2D4A] space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                    Primary Operational Claims with Verified Citations:
                  </span>
                  <div className="space-y-2">
                    {document.actions.map((act) => (
                      <div key={act.id} className="p-2.5 rounded-xl bg-[#070B14] border border-[#1E2D4A] flex justify-between items-center">
                        <span className="text-slate-200 font-medium">{act.task}</span>
                        <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 shrink-0 ml-2">
                          Source: {act.sourceReference}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Actions Tab */}
            {activeTab === 'ACTIONS' && (
              <div className="space-y-3">
                {document.actions.map((act) => (
                  <div
                    key={act.id}
                    className="p-4 rounded-2xl bg-[#131E35]/60 border border-[#1E2D4A] space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <PriorityBadge priority={act.priority} />
                          <span className="text-[10px] font-mono text-cyan-400">{act.id}</span>
                        </div>
                        <h4 className="font-bold text-white text-sm">{act.task}</h4>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {act.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 border-t border-[#1E2D4A] pt-2">
                      <span>Assigned: {act.assignedPerson}</span>
                      <span className="text-right">Deadline: {formatISTDate(act.deadline)}</span>
                    </div>

                    {act.evidenceRequired && (
                      <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300">
                        <span className="font-bold block text-[10px] font-mono uppercase">
                          MANDATORY EVIDENCE REQUIRED:
                        </span>
                        {act.evidenceRequired}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Risks Tab */}
            {activeTab === 'RISKS' && (
              <div className="space-y-3">
                {document.risks.map((rsk) => (
                  <div
                    key={rsk.id}
                    className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/40 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-rose-400" />
                        <span className="text-xs font-bold font-mono text-rose-300">
                          {rsk.severity} RISK
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        Ref: {rsk.sourceReference}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-sm">{rsk.title}</h4>
                      <p className="text-xs text-slate-300 mt-1">{rsk.description}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#070B14] border border-[#1E2D4A] text-xs space-y-1">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                        AI RECOMMENDED MITIGATION:
                      </span>
                      <p className="text-slate-200">{rsk.recommendedMitigation}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Entities Tab */}
            {activeTab === 'ENTITIES' && (
              <div className="grid grid-cols-2 gap-3">
                {document.entities.map((ent) => (
                  <div
                    key={ent.id}
                    className="p-3 rounded-xl bg-[#131E35]/50 border border-[#1E2D4A] space-y-1 text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase">
                        {ent.type}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {ent.occurrences} mentions
                      </span>
                    </div>
                    <p className="font-bold text-white">{ent.name}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'TIMELINE' && (
              <div className="space-y-4 relative pl-6 border-l-2 border-[#1E2D4A] ml-3 text-xs">
                {document.timeline.map((entry, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <div
                      className={`absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full border-2 ${
                        entry.status === 'completed'
                          ? 'bg-emerald-500 border-[#0D1526]'
                          : entry.status === 'current'
                          ? 'bg-amber-500 border-[#0D1526] animate-pulse'
                          : 'bg-slate-700 border-[#0D1526]'
                      }`}
                    ></div>
                    <span className="text-[10px] font-mono text-slate-400">{entry.date}</span>
                    <h5 className="font-bold text-white text-sm">{entry.stage}</h5>
                    <p className="text-slate-300">{entry.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Conflicts Tab */}
            {activeTab === 'CONFLICTS' && (
              <div className="space-y-3">
                {document.conflicts && document.conflicts.length > 0 ? (
                  document.conflicts.map((conf) => (
                    <div
                      key={conf.id}
                      className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-3 text-xs"
                    >
                      <div className="flex items-center gap-2 text-amber-400 font-bold font-mono">
                        <AlertTriangle className="w-4 h-4" />
                        POLICY CONFLICT DETECTED
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-2.5 rounded-xl bg-[#070B14] border border-[#1E2D4A]">
                          <span className="text-[10px] font-mono text-cyan-400 block">CURRENT DOCUMENT</span>
                          <p className="text-white font-medium mt-1">{conf.documentARequirement}</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#070B14] border border-[#1E2D4A]">
                          <span className="text-[10px] font-mono text-rose-400 block">CONTRADICTORY DOCUMENT</span>
                          <p className="text-white font-medium mt-1">{conf.documentBRequirement}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/conflicts')}
                        className="w-full py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold"
                      >
                        Compare Side-by-Side in Conflict Detector →
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    No policy contradictions detected for this document.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Priority Override Modal */}
      <PriorityOverrideModal
        isOpen={overrideModalOpen}
        document={document}
        onClose={() => setOverrideModalOpen(false)}
      />
    </div>
  );
};
