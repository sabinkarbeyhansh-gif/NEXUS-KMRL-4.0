import React from 'react';
import {
  Play,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
  FileCheck,
  BrainCircuit,
  Network,
  AlertTriangle,
  ClipboardList,
  CalendarClock,
  Mic,
  RotateCcw,
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useNavigate } from 'react-router-dom';

interface LiveDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEMO_STEPS = [
  { step: 1, title: 'Document Received', desc: 'Bilingual 15-page Safety Circular ingested via Kerala Fire & Rescue Portal.', icon: FileCheck },
  { step: 2, title: 'OCR Text Extraction', desc: 'Multilingual neural OCR transcribes technical tables & engineering notes.', icon: BrainCircuit },
  { step: 3, title: 'Language Identification', desc: 'Detected parallel English + Malayalam sections (99% confidence).', icon: Sparkles },
  { step: 4, title: 'Document Classification', desc: 'Categorized as "Statutory Safety Directive" under CMRS Section 28.', icon: FileCheck },
  { step: 5, title: 'AI Priority Evaluation', desc: 'Assigned CRITICAL priority: Sprinkler pressure drop < 2.4 bar.', icon: AlertTriangle },
  { step: 6, title: 'Action & Risk Extraction', desc: 'Discovered 3 operational actions, 2 infrastructure risks & 2 statutory deadlines.', icon: ClipboardList },
  { step: 7, title: 'Automated Task Creation', desc: 'Created task ACT-LIVE-1 with mandatory calibration evidence required.', icon: ClipboardList },
  { step: 8, title: 'Department Routing', desc: 'Dispatched to Safety Directorate & assigned to Chief Inspector S. Pradeep.', icon: Sparkles },
  { step: 9, title: 'Knowledge Graph Update', desc: 'Injected new Document, Risk & Task nodes connecting Aluva Station.', icon: Network },
  { step: 10, title: 'Risk Radar Alerting', desc: 'Risk Radar elevated Aluva fire suppression hazard to Top-Tier Critical.', icon: AlertTriangle },
  { step: 11, title: 'Deadline Countdown Engaged', desc: 'Live countdown: "Due Tomorrow (24 hours)" displayed in operational center.', icon: CalendarClock },
  { step: 12, title: 'Voice Assistant Query', desc: 'NEXUS Voice answers: "Aluva Platform 1 Sprinkler Inspection due within 24h".', icon: Mic },
  { step: 13, title: 'Decision Ready State', desc: 'Manager overrides & dispatches field crew with verified digital chain of custody.', icon: CheckCircle2 },
];

export const LiveDemoModal: React.FC<LiveDemoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isProcessingDemo, demoStep, runGuidedDemoScenario, resetDemoData } = useData();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#0D1526] border border-[#1E2D4A] p-6 shadow-2xl space-y-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  SIH JUDGES LIVE DEMO SCENARIO
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold">
                  Demonstration Dataset
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Guided 13-Step Pipeline: “From Documents to Decisions”
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#131E35]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">
              Pipeline Execution: {demoStep > 0 ? `Step ${demoStep} of 13` : 'Ready to Launch'}
            </span>
            <span className="text-cyan-400 font-bold">
              {demoStep > 0 ? `${Math.round((demoStep / 13) * 100)}% Complete` : '0%'}
            </span>
          </div>
          <div className="h-2 w-full bg-[#131E35] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-cyan-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${(demoStep / 13) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 13-Step Flow List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {DEMO_STEPS.map((s) => {
            const Icon = s.icon;
            const isCompleted = demoStep >= s.step;
            const isCurrent = demoStep === s.step;

            return (
              <div
                key={s.step}
                className={`p-3 rounded-2xl border transition-all flex items-start gap-3 text-xs ${
                  isCurrent
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                    : isCompleted
                    ? 'bg-emerald-500/5 border-emerald-500/30 text-slate-300'
                    : 'bg-[#131E35]/40 border-[#1E2D4A] opacity-60 text-slate-400'
                }`}
              >
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    isCurrent
                      ? 'bg-amber-500 text-black animate-pulse'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-[#070B14] text-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-bold ${
                        isCurrent
                          ? 'text-amber-300'
                          : isCompleted
                          ? 'text-emerald-300'
                          : 'text-slate-300'
                      }`}
                    >
                      Step {s.step}: {s.title}
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                        ✓ VERIFIED
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Trigger Controls */}
        <div className="pt-3 border-t border-[#1E2D4A] flex items-center justify-between">
          <button
            onClick={resetDemoData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#131E35] hover:bg-[#1E2D4A] text-slate-300 text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset State
          </button>

          <div className="flex items-center gap-3">
            {demoStep === 13 && (
              <button
                onClick={() => {
                  onClose();
                  navigate('/graph');
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black text-xs font-bold shadow-lg shadow-cyan-500/25"
              >
                Inspect Updated Graph <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={runGuidedDemoScenario}
              disabled={isProcessingDemo}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-extrabold shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              {isProcessingDemo ? 'Executing Pipeline...' : demoStep === 13 ? 'Re-run Demo' : 'Start 13-Step Demo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
