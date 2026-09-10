import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  FileText,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  Building2,
  Scale,
  ShieldAlert,
  FileCheck2,
  Send,
  Download,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { DocumentConflict } from '../types';

export interface RegulatoryStandard {
  id: string;
  code: string;
  name: string;
  governingBody: string;
  mandatedRequirement: string;
  kmrlInternalRequirement: string;
  status: 'COMPLIANT' | 'MISMATCH_ACTION_REQUIRED' | 'AMENDMENT_DISPATCHED';
  riskRating: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  penaltyExposure: string;
  governingClause: string;
  discrepancyDiff: string;
}

const REGULATORY_STANDARDS: RegulatoryStandard[] = [
  {
    id: 'REG-001',
    code: 'CMRS/SR/2026/04',
    name: 'Tunnel Booster Ventilation & Emergency Smoke Dampers',
    governingBody: 'CMRS (Commission of Railway Safety)',
    mandatedRequirement: 'Mandatory physical torque & actuation test of tunnel booster dampers every 30 calendar days.',
    kmrlInternalRequirement: 'Quarterly ventilation dampers maintenance executed every 45 calendar days under active SLA 42/2024.',
    status: 'MISMATCH_ACTION_REQUIRED',
    riskRating: 'CRITICAL',
    penaltyExposure: '₹5,00,000 Statutory Fine & Commercial Operation Suspension Risk',
    governingClause: 'CMRS Rail Transit Safety Regulations Sec. 14(B)',
    discrepancyDiff: '15-day uninspected gap between 30-day statutory mandate and 45-day contractor maintenance cycle.',
  },
  {
    id: 'REG-002',
    code: 'RDSO/SPN/2025/112',
    name: '25kV Traction Catenary Tension & Dropper Fatigue',
    governingBody: 'RDSO (Research Designs & Standards Organisation)',
    mandatedRequirement: 'Ultrasonic flaw detection of dropper wires every 60 days in coastal humid environments.',
    kmrlInternalRequirement: 'Visual catenary patrol every 30 days, ultrasonic testing every 90 days.',
    status: 'AMENDMENT_DISPATCHED',
    riskRating: 'HIGH',
    penaltyExposure: 'Traction Power Failure Liability & ₹2,50,000 Equipment Warranty Void',
    governingClause: 'RDSO Overhead Equipment Guidelines Cl. 8.3',
    discrepancyDiff: '30-day delay in ultrasonic testing frequency during monsoon high-salinity months.',
  },
  {
    id: 'REG-003',
    code: 'NFPA 130 / 2026',
    name: 'Underground Platform Fire Hydrant Flow Pressure',
    governingBody: 'NFPA 130 (Standard for Fixed Guideway Transit Systems)',
    mandatedRequirement: 'Minimum residual pressure of 4.5 bar at most hydraulically remote hose connection with 1,890 L/min flow.',
    kmrlInternalRequirement: 'Internal SOM mandates 4.2 bar at terminal hydrant during quarterly flow rate trials.',
    status: 'MISMATCH_ACTION_REQUIRED',
    riskRating: 'HIGH',
    penaltyExposure: 'CMRS Statutory NOC Withholding & Fire Safety Non-Compliance',
    governingClause: 'NFPA 130 Life Safety Sec. 7.3.2',
    discrepancyDiff: '0.3 bar pressure shortfall below international transit fire safety baseline.',
  },
  {
    id: 'REG-004',
    code: 'KSDMA/METRO/2026',
    name: 'Monsoon Flood Barrier & Sump Pump Auto-Switching',
    governingBody: 'Kerala State Disaster Management Authority',
    mandatedRequirement: 'Dual submersible sump pumps must alternate every 6 hours with automatic float override at 75mm water depth.',
    kmrlInternalRequirement: 'Dual pump alternation every 12 hours with float trip set at 85mm water depth.',
    status: 'COMPLIANT',
    riskRating: 'MEDIUM',
    penaltyExposure: 'Station Water Ingress Stoppage Risk',
    governingClause: 'KSDMA Urban Rail Resilience Protocol 2026',
    discrepancyDiff: 'Threshold aligned: Sump pump float switch adjusted to 75mm and sealed.',
  },
];

export const ConflictDetector: React.FC = () => {
  const { conflicts } = useData();
  const navigate = useNavigate();

  const [selectedStandard, setSelectedStandard] = useState<RegulatoryStandard>(REGULATORY_STANDARDS[0]);
  const [addendumGenerated, setAddendumGenerated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'CLAUSE_DIFF' | 'REGULATORY_MATRIX' | 'LEGAL_DISPATCH'>('CLAUSE_DIFF');

  const handleGenerateAddendum = () => {
    setAddendumGenerated(true);
    setTimeout(() => {
      alert(`Statutory SLA Addendum auto-drafted for ${selectedStandard.name}. Dispatched to KMRL Legal Directorate and Facility Contractors.`);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#091126] border border-[#17254A] shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Statutory Policy & Regulatory Compliance Matrix
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Automated cross-directive conflict detection, CMRS/RDSO/NFPA statutory gap resolution & legal amendment dispatch
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#0D1836] border border-[#1A2C54] rounded-xl text-xs font-mono">
          <button
            onClick={() => setActiveTab('CLAUSE_DIFF')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'CLAUSE_DIFF'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Clause Diff & Resolution
          </button>
          <button
            onClick={() => setActiveTab('REGULATORY_MATRIX')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'REGULATORY_MATRIX'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Compliance Standards Matrix
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: CLAUSE DIFF & ARBITRATION RESOLUTION                  */}
      {/* ============================================================ */}
      {activeTab === 'CLAUSE_DIFF' && (
        <div className="space-y-6">
          {/* Top Selector: Active Discrepancy Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {REGULATORY_STANDARDS.map((std) => {
              const isSelected = selectedStandard.id === std.id;
              return (
                <div
                  key={std.id}
                  onClick={() => {
                    setSelectedStandard(std);
                    setAddendumGenerated(false);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/15'
                      : 'bg-[#091126] border-[#17254A] hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#0D1836] text-cyan-300 font-bold border border-cyan-500/20">
                      {std.governingBody.split(' ')[0]}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                        std.riskRating === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {std.riskRating}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{std.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono truncate">{std.code}</p>
                </div>
              );
            })}
          </div>

          {/* Side-by-Side Clause Diff & Arbitration Box */}
          <div className="rounded-3xl bg-[#091126] border border-[#17254A] p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#17254A] pb-3">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 uppercase">
                  ACTIVE CONTRADICTION DETECTED
                </span>
                <h2 className="text-base font-black text-white mt-1">
                  {selectedStandard.name} ({selectedStandard.code})
                </h2>
              </div>
              <div className="text-right font-mono text-xs">
                <span className="text-slate-400 block text-[10px] uppercase">Statutory Penalty Exposure:</span>
                <span className="text-rose-400 font-bold text-xs">{selectedStandard.penaltyExposure}</span>
              </div>
            </div>

            {/* Side-by-Side Clauses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Document A: Statutory Mandate */}
              <div className="p-5 rounded-2xl bg-cyan-950/25 border-2 border-cyan-500/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500 text-slate-950 uppercase">
                    STATUTORY GOVERNING MANDATE ({selectedStandard.governingBody})
                  </span>
                  <span className="text-xs font-mono text-cyan-300 font-bold">LATEST STANDARD</span>
                </div>

                <h3 className="text-xs font-bold text-white">{selectedStandard.governingClause}</h3>

                <div className="p-3.5 rounded-xl bg-black/60 border border-cyan-500/30 space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                    Statutory Text:
                  </span>
                  <p className="text-xs font-semibold text-white leading-relaxed">
                    "{selectedStandard.mandatedRequirement}"
                  </p>
                </div>
              </div>

              {/* Document B: Internal KMRL Manual or Active Contractor SLA */}
              <div className="p-5 rounded-2xl bg-rose-950/25 border-2 border-rose-500/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500 text-white uppercase">
                    ACTIVE KMRL CONTRACTOR SLA / INTERNAL SOM
                  </span>
                  <span className="text-xs font-mono text-rose-300 font-bold">DISCREPANCY</span>
                </div>

                <h3 className="text-xs font-bold text-white">KMRL Maintenance SLA Clause 14</h3>

                <div className="p-3.5 rounded-xl bg-black/60 border border-rose-500/30 space-y-1">
                  <span className="text-[10px] font-mono text-rose-400 uppercase font-bold">
                    Conflicting Current Text:
                  </span>
                  <p className="text-xs font-semibold text-white leading-relaxed">
                    "{selectedStandard.kmrlInternalRequirement}"
                  </p>
                </div>
              </div>
            </div>

            {/* Gap Analysis Box */}
            <div className="p-4 rounded-2xl bg-[#0D1836] border border-[#1A2C54] text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">
                  LEGAL & OPERATIONAL IMPACT:
                </span>
                <p className="text-slate-200 mt-0.5">
                  {selectedStandard.discrepancyDiff} In the event of a safety audit, KMRL would be held liable under Railway Act statutory provisions.
                </p>
              </div>
            </div>

            {/* Resolution & Automated Addendum Dispatch */}
            <div className="p-5 rounded-2xl bg-[#0D1836] border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                  NEXUS RECOMMENDED STATUTORY ARBITRATION:
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Formally endorse the {selectedStandard.governingBody} mandate as governing authority. Automatically issue a legally binding addendum to active facility contractors shortening the inspection interval, with costs re-indexed under Schedule C.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={handleGenerateAddendum}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/25 transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {addendumGenerated ? '✓ Addendum Dispatched' : 'Issue Statutory Addendum'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: COMPLIANCE STANDARDS MATRIX TABLE                     */}
      {/* ============================================================ */}
      {activeTab === 'REGULATORY_MATRIX' && (
        <div className="p-6 rounded-3xl bg-[#091126] border border-[#17254A] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#17254A] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                Cross-Regulatory Statutory Alignment Ledger
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Continuous compliance benchmarking across CMRS, RDSO, NFPA, and KSDMA governing frameworks
              </p>
            </div>
            <button
              onClick={() => alert('Regulatory matrix exported as CSV.')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0D1836] border border-[#1A2C54] text-cyan-300 text-xs font-mono font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              Export Matrix
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#17254A] text-[10px] font-mono text-slate-400 uppercase">
                  <th className="py-2.5 px-3">Standard Code</th>
                  <th className="py-2.5 px-3">Subject Matter</th>
                  <th className="py-2.5 px-3">Governing Body</th>
                  <th className="py-2.5 px-3">Statutory Requirement</th>
                  <th className="py-2.5 px-3">Internal Policy Status</th>
                  <th className="py-2.5 px-3 text-right">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#17254A]/60 font-mono">
                {REGULATORY_STANDARDS.map((std) => (
                  <tr
                    key={std.id}
                    onClick={() => {
                      setSelectedStandard(std);
                      setActiveTab('CLAUSE_DIFF');
                    }}
                    className="hover:bg-[#0E1A38]/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-3 font-bold text-cyan-300">{std.code}</td>
                    <td className="py-3 px-3 font-sans font-bold text-white max-w-xs truncate">
                      {std.name}
                    </td>
                    <td className="py-3 px-3 text-slate-300">{std.governingBody}</td>
                    <td className="py-3 px-3 font-sans text-slate-300 max-w-sm truncate" title={std.mandatedRequirement}>
                      {std.mandatedRequirement}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          std.status === 'COMPLIANT'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : std.status === 'AMENDMENT_DISPATCHED'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {std.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`text-[10px] font-bold ${
                          std.riskRating === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'
                        }`}
                      >
                        {std.riskRating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
