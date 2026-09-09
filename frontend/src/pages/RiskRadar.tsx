import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Flame,
  ShieldAlert,
  Building2,
  CalendarClock,
  ArrowRight,
  Filter,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { ExtractedRisk, RiskSeverity } from '../types';

export const RiskRadar: React.FC = () => {
  const { risks, documents } = useData();
  const navigate = useNavigate();

  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredRisks = risks.filter((r) => {
    const matchesSev = selectedSeverity === 'ALL' || r.severity === selectedSeverity;
    const matchesCat = selectedCategory === 'ALL' || r.category === selectedCategory;
    return matchesSev && matchesCat;
  });

  const criticalCount = risks.filter((r) => r.severity === 'CRITICAL').length;
  const highCount = risks.filter((r) => r.severity === 'HIGH').length;
  const mediumCount = risks.filter((r) => r.severity === 'MEDIUM').length;
  const lowCount = risks.filter((r) => r.severity === 'LOW').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-rose-500" />
            Operational Risk Radar
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Real-time hazard detection across 25 stations, rolling stock, signaling and traction grids
          </p>
        </div>

        {/* Severity Count Chips */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold">
            {criticalCount} Critical
          </span>
          <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
            {highCount} High
          </span>
          <span className="px-3 py-1 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs font-mono font-bold">
            {mediumCount} Medium
          </span>
        </div>
      </div>

      {/* Visual Radar Grid Quadrants */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CRITICAL QUADRANT */}
        <div
          onClick={() => setSelectedSeverity(selectedSeverity === 'CRITICAL' ? 'ALL' : 'CRITICAL')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer ${
            selectedSeverity === 'CRITICAL'
              ? 'bg-rose-950/40 border-rose-500 shadow-xl shadow-rose-500/20 scale-[1.02]'
              : 'bg-[#0D1526] border-[#1E2D4A] hover:border-rose-500/50'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
              CRITICAL HAZARDS
            </span>
            <span className="text-xl font-black text-white">{criticalCount}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Immediate passenger safety, statutory CMRS violations, or unmitigated power grid tripping.
          </p>
        </div>

        {/* HIGH QUADRANT */}
        <div
          onClick={() => setSelectedSeverity(selectedSeverity === 'HIGH' ? 'ALL' : 'HIGH')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer ${
            selectedSeverity === 'HIGH'
              ? 'bg-amber-950/40 border-amber-500 shadow-xl shadow-amber-500/20 scale-[1.02]'
              : 'bg-[#0D1526] border-[#1E2D4A] hover:border-amber-500/50'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              HIGH OPERATIONAL
            </span>
            <span className="text-xl font-black text-white">{highCount}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Rolling stock mechanical wear, signaling latency, or track twist exceeding maintenance limits.
          </p>
        </div>

        {/* MEDIUM QUADRANT */}
        <div
          onClick={() => setSelectedSeverity(selectedSeverity === 'MEDIUM' ? 'ALL' : 'MEDIUM')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer ${
            selectedSeverity === 'MEDIUM'
              ? 'bg-sky-950/40 border-sky-500 shadow-xl shadow-sky-500/20 scale-[1.02]'
              : 'bg-[#0D1526] border-[#1E2D4A] hover:border-sky-500/50'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-400" />
              MEDIUM SEVERITY
            </span>
            <span className="text-xl font-black text-white">{mediumCount}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Commercial lease defaults, escalator comb plate alignments, or station kiosk compliance.
          </p>
        </div>

        {/* LOW QUADRANT */}
        <div
          onClick={() => setSelectedSeverity(selectedSeverity === 'LOW' ? 'ALL' : 'LOW')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer ${
            selectedSeverity === 'LOW'
              ? 'bg-emerald-950/40 border-emerald-500 shadow-xl shadow-emerald-500/20 scale-[1.02]'
              : 'bg-[#0D1526] border-[#1E2D4A] hover:border-emerald-500/50'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              LOW / MONITORED
            </span>
            <span className="text-xl font-black text-white">{lowCount}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Standard procurement lead times, routine administrative filings, and scheduled updates.
          </p>
        </div>
      </div>

      {/* Filter and List Container */}
      <div className="rounded-3xl bg-[#0D1526] border border-[#1E2D4A] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white font-mono uppercase">Filter by Category:</span>
            {(['ALL', 'SAFETY', 'INFRASTRUCTURE', 'OPERATIONAL', 'COMPLIANCE', 'FINANCIAL'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[10px] transition-colors ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-black font-bold'
                    : 'bg-[#131E35] text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-slate-400 font-mono text-[11px]">
            {filteredRisks.length} hazards identified
          </span>
        </div>

        {/* Risk Feed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRisks.map((risk) => (
            <div
              key={risk.id}
              className={`p-5 rounded-2xl border space-y-3 transition-all ${
                risk.severity === 'CRITICAL'
                  ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500'
                  : risk.severity === 'HIGH'
                  ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500'
                  : 'bg-[#131E35]/50 border-[#1E2D4A] hover:border-slate-500'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                      risk.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : risk.severity === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    }`}
                  >
                    {risk.severity} HAZARD
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#070B14] text-slate-400 border border-[#1E2D4A]">
                    {risk.category}
                  </span>
                  {risk.station && (
                    <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {risk.station}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  Ref: {risk.sourceReference}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white leading-snug">{risk.title}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{risk.description}</p>
              </div>

              {/* Recommended Mitigation Box */}
              <div className="p-3 rounded-xl bg-[#070B14] border border-[#1E2D4A] text-xs space-y-1">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI Recommended Operational Mitigation:
                </span>
                <p className="text-slate-200">{risk.recommendedMitigation}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#1E2D4A] text-xs">
                <button
                  onClick={() => navigate('/actions')}
                  className="text-cyan-400 hover:underline font-semibold flex items-center gap-1"
                >
                  View Corrective Action Task <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => navigate('/graph')}
                  className="text-slate-400 hover:text-white font-mono text-[11px]"
                >
                  Inspect in Graph
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
