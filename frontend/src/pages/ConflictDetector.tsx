import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  History,
  FileText,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  Building2,
  Sliders,
  Scale,
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { DocumentConflict } from '../types';

export const ConflictDetector: React.FC = () => {
  const { conflicts, documents } = useData();
  const navigate = useNavigate();

  const [selectedConflict, setSelectedConflict] = useState<DocumentConflict>(
    conflicts[0] || {
      id: 'CONF-001',
      documentAId: 'DOC-KMRL-2026-005',
      documentAName: 'Emergency Evacuation & Tunnel Ventilation Guideline (Revision 2026)',
      documentARequirement: 'Mandatory physical inspection of tunnel booster fans and ventilation dampers every 30 days.',
      documentBId: 'DOC-KMRL-2024-042',
      documentBName: 'KMRL Operations Manual & Maintenance SLA (Directive 42/2024)',
      documentBRequirement: 'Quarterly ventilation dampers maintenance executed every 45 calendar days.',
      conflictType: 'FREQUENCY_MISMATCH',
      recommendedResolution: 'Formally endorse 2026 revision as governing standard and issue contractual SLA amendment to facility contractors.',
      detectedAt: '2026-09-05T09:15:00Z',
    }
  );

  const [timeMachineYear, setTimeMachineYear] = useState<string>('2026');

  const versionsHistory = [
    {
      year: '2024',
      version: 'Directive 42/2024',
      cycle: '45 Days Interval',
      desc: 'Quarterly damper inspection executed every 45 calendar days.',
      status: 'SUPERSEDED',
    },
    {
      year: '2025',
      version: 'Interim Safety Circular',
      cycle: '30 Days (Monsoon Only)',
      desc: 'Monsoon humidity protocol shortened inspections to 30 days during June-September.',
      status: 'TRANSITIONAL',
    },
    {
      year: '2026',
      version: 'Comprehensive Policy Rev 3',
      cycle: '30 Days (Year-Round)',
      desc: 'Mandatory tunnel damper and battery discharge test every 30 days year-round.',
      status: 'GOVERNING STANDARD',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Scale className="w-6 h-6 text-amber-400" />
            Document Conflict Detector & Time Machine
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Cross-document contradiction discovery and historical policy version evolution
          </p>
        </div>

        <span className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
          AI Conflict Engine: Active
        </span>
      </div>

      {/* Main Feature 1: Side-by-Side Contradiction Comparison */}
      <div className="rounded-3xl bg-[#0D1526] border border-[#1E2D4A] p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />
            <h2 className="text-base font-bold text-white">Detected Policy Contradiction</h2>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
            Conflict Type: {selectedConflict.conflictType.replace('_', ' ')}
          </span>
        </div>

        {/* Side-by-Side Comparison Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Document A (Governing / Latest) */}
          <div className="p-5 rounded-2xl bg-cyan-950/20 border-2 border-cyan-500/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500 text-black uppercase">
                DOCUMENT A (LATEST REVISION 2026)
              </span>
              <span className="text-xs font-mono text-slate-400">{selectedConflict.documentAId}</span>
            </div>

            <h3 className="text-sm font-bold text-white">{selectedConflict.documentAName}</h3>

            <div className="p-3.5 rounded-xl bg-[#070B14] border border-[#1E2D4A] space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                Mandated Requirement:
              </span>
              <p className="text-xs font-semibold text-white">
                "{selectedConflict.documentARequirement}"
              </p>
            </div>

            <button
              onClick={() => navigate(`/documents/${selectedConflict.documentAId}`)}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
            >
              Open Document A Intelligence →
            </button>
          </div>

          {/* Document B (Contradictory / Older SLA) */}
          <div className="p-5 rounded-2xl bg-rose-950/20 border-2 border-rose-500/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500 text-white uppercase">
                DOCUMENT B (OPERATIONAL SLA 2024)
              </span>
              <span className="text-xs font-mono text-slate-400">{selectedConflict.documentBId}</span>
            </div>

            <h3 className="text-sm font-bold text-white">{selectedConflict.documentBName}</h3>

            <div className="p-3.5 rounded-xl bg-[#070B14] border border-[#1E2D4A] space-y-1">
              <span className="text-[10px] font-mono text-rose-400 uppercase font-bold">
                Contradictory Requirement:
              </span>
              <p className="text-xs font-semibold text-white">
                "{selectedConflict.documentBRequirement}"
              </p>
            </div>

            <span className="text-[11px] text-slate-400 italic block">
              Result: 15-day gap without maintenance coverage under active vendor contract.
            </span>
          </div>
        </div>

        {/* AI Recommendation Box */}
        <div className="p-4 rounded-2xl bg-[#131E35] border border-[#1E2D4A] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              NEXUS AI RECOMMENDED ARBITRATION:
            </span>
            <p className="text-xs text-slate-200">{selectedConflict.recommendedResolution}</p>
          </div>

          <button
            onClick={() => alert('SLA addendum draft generated and dispatched to Legal & Procurement.')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-xs font-bold shadow-md hover:scale-105 transition-transform shrink-0"
          >
            Auto-Generate SLA Addendum
          </button>
        </div>
      </div>

      {/* Main Feature 2: Document Time Machine */}
      <div className="rounded-3xl bg-[#0D1526] border border-[#1E2D4A] p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Document Time Machine</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Tunnel Ventilation Frequency Evolution (2024 → 2026)
          </span>
        </div>

        {/* Version History Slider / Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {versionsHistory.map((ver) => (
            <div
              key={ver.year}
              onClick={() => setTimeMachineYear(ver.year)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                timeMachineYear === ver.year
                  ? 'bg-cyan-500/20 border-cyan-500 shadow-lg scale-105'
                  : 'bg-[#070B14] border-[#1E2D4A] opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-white">{ver.year}</span>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    ver.year === '2026'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {ver.status}
                </span>
              </div>
              <h4 className="text-xs font-bold text-cyan-300">{ver.cycle}</h4>
              <p className="text-[11px] text-slate-300">{ver.desc}</p>
            </div>
          ))}
        </div>

        {/* AI Historical Explanation Card */}
        <div className="p-4 rounded-2xl bg-[#070B14] border border-[#1E2D4A] text-xs space-y-1">
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
            AI Historical Context Rationale:
          </span>
          <p className="text-slate-300 leading-relaxed">
            “The requirement changed from 45 to 30 days in 2025 due to coastal monsoon corrosion telemetry and remains 30 days year-round in the latest approved 2026 standard. Contractor contracts must be aligned accordingly.”
          </p>
        </div>
      </div>
    </div>
  );
};
