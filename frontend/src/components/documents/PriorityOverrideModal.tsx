import React, { useState } from 'react';
import { X, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';
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
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !document) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideReason.trim()) return;

    setIsSubmitting(true);
    overridePriority(
      document.id,
      selectedPriority,
      overrideReason,
      currentUser.name
    );
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0D1526] border border-[#1E2D4A] p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between border-b border-[#1E2D4A] pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-amber-400">
              OPERATIONAL OVERRIDE
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">Override Document Priority</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#131E35]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* AI Current Classification Card */}
        <div className="p-3.5 rounded-2xl bg-[#131E35]/60 border border-[#1E2D4A] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-mono">AI Determined Priority:</span>
            <PriorityBadge priority={document.aiPriority} />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>AI Confidence Score:</span>
            <span className="text-cyan-400 font-bold font-mono">{document.aiConfidence}%</span>
          </div>
          <p className="text-slate-300 italic text-[11px] border-t border-[#1E2D4A] pt-1.5">
            "{document.aiPriorityReason}"
          </p>
        </div>

        {/* Human Override Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1.5">
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
                      ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-md'
                      : 'bg-[#070B14] border-[#1E2D4A] text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <PriorityBadge priority={prio} />
                  {selectedPriority === prio && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">
              Mandatory Justification / Reason:
            </label>
            <textarea
              required
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              placeholder="e.g. CMRS circular requires escalation to CRITICAL due to audit tomorrow morning."
              className="w-full bg-[#070B14] border border-[#1E2D4A] rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 h-20"
            />
          </div>

          <div className="text-[10px] text-slate-400 font-mono">
            * This action is logged permanently to the immutable KMRL Audit Trail under {currentUser.name} ({currentUser.role}).
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#131E35] text-slate-300 text-xs font-semibold hover:bg-[#1E2D4A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !overrideReason.trim()}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold shadow-md transition-all disabled:opacity-50"
            >
              Confirm Override
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
