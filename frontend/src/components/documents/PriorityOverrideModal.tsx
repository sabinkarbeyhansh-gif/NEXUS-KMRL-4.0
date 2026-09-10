import React, { useState } from 'react';
import { X, ShieldAlert, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import { PriorityLevel, DocumentItem } from '../../types';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { PriorityBadge } from './PriorityBadge';

interface PriorityOverrideModalProps {
  isOpen: boolean;
  document: DocumentItem | null;
  onClose: () => void;
}

export const PriorityOverrideModal: React.FC<PriorityOverrideModalProps> = ({
  isOpen,
  document,
  onClose,
}) => {
  const { overridePriority } = useData();
  const { currentUser } = useAuth();

  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel>(
    document?.humanPriority || document?.aiPriority || 'HIGH'
  );
  const [overrideReason, setOverrideReason] = useState<string>(
    `Operational Command Authorization by ${currentUser.name} (${currentUser.role})`
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !document) return null;

  const quickReasons = [
    'CMRS Statutory Rail Directive Escalation',
    'Station Head Engineering Audit Sign-off',
    'Immediate Passenger Safety Precaution',
    'Scheduled Night Maintenance Priority',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reasonToUse = overrideReason.trim() || `Operational Command Authorization by ${currentUser.name}`;

    setIsSubmitting(true);
    overridePriority(
      document.id,
      selectedPriority,
      reasonToUse,
      currentUser.name
    );
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0E1834] border border-cyan-500/40 p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between border-b border-[#1E325C] pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-amber-400">
              OPERATIONAL COMMAND OVERRIDE
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">Override Document Priority</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#132042]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* AI Current Classification Card */}
        <div className="p-3.5 rounded-xl bg-[#121E3E] border border-[#1E325C] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-mono font-medium">AI Determined Priority:</span>
            <PriorityBadge priority={document.aiPriority} />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>AI Confidence Score:</span>
            <span className="text-cyan-400 font-bold font-mono">{document.aiConfidence}%</span>
          </div>
          <p className="text-slate-200 italic text-[11px] border-t border-[#1E325C] pt-1.5">
            "{document.aiPriorityReason}"
          </p>
        </div>

        {/* Human Override Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-200 font-bold block mb-1.5">
              Select New Operational Priority:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as PriorityLevel[]).map((prio) => (
                <button
                  key={prio}
                  type="button"
                  onClick={() => setSelectedPriority(prio)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                    selectedPriority === prio
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md'
                      : 'bg-[#080E24] border-[#1E325C] text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <PriorityBadge priority={prio} />
                  {selectedPriority === prio && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Quick-Select Justification Chips (No Typing Required) */}
          <div>
            <label className="text-xs text-slate-200 font-bold block mb-1">
              Quick Justification (1-Click Selection):
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {quickReasons.map((qr) => (
                <button
                  key={qr}
                  type="button"
                  onClick={() => setOverrideReason(qr)}
                  className="text-[10px] px-2 py-1 rounded-lg bg-[#080E24] hover:bg-cyan-500/20 border border-[#1E325C] hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all text-left"
                >
                  {qr}
                </button>
              ))}
            </div>
            <textarea
              required
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              placeholder="e.g. CMRS circular requires escalation to CRITICAL due to audit tomorrow morning."
              className="w-full bg-[#080E24] border border-[#1E325C] rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 h-16 transition-colors"
            />
          </div>

          <div className="text-[10px] text-slate-400 font-mono">
            * Authenticated as <strong className="text-cyan-300">{currentUser.name}</strong> ({currentUser.role}). Logged to immutable audit trail.
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#132042] text-slate-300 text-xs font-bold hover:bg-[#1E325C] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black shadow-md shadow-cyan-500/30 transition-all hover:scale-105"
            >
              Confirm 1-Click Override
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
