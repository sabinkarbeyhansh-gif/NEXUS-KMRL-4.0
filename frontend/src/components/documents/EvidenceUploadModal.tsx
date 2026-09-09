import React, { useState } from 'react';
import { X, Upload, CheckCircle2, FileCheck } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface EvidenceUploadModalProps {
  isOpen: boolean;
  taskId: string;
  taskTitle: string;
  onClose: () => void;
}

export const EvidenceUploadModal: React.FC<EvidenceUploadModalProps> = ({
  isOpen,
  taskId,
  taskTitle,
  onClose,
}) => {
  const { updateTaskStatus } = useData();
  const [fileName, setFileName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      updateTaskStatus(taskId, 'COMPLETED', fileName || 'Field_Inspection_Certificate.pdf');
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0D1526] border border-[#1E2D4A] p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between border-b border-[#1E2D4A] pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-emerald-400">
              TASK VERIFICATION
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">Submit Completion Evidence</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#131E35]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 rounded-xl bg-[#131E35]/60 border border-[#1E2D4A] text-xs space-y-1">
          <span className="text-slate-400 font-mono">Task:</span>
          <p className="text-white font-semibold">{taskTitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-2 border-dashed border-[#1E2D4A] hover:border-emerald-500/50 rounded-2xl p-6 text-center space-y-2 cursor-pointer transition-colors bg-[#070B14]">
            <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="text-xs text-slate-300 font-medium">
              <label htmlFor="evidence-file" className="cursor-pointer text-emerald-400 hover:underline">
                Upload verification report
              </label>{' '}
              or drag & drop
            </div>
            <p className="text-[10px] text-slate-500">PDF, JPG, PNG up to 10MB</p>
            <input
              id="evidence-file"
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFileName(e.target.files[0].name);
                }
              }}
              className="hidden"
            />
          </div>

          {fileName && (
            <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span className="truncate">{fileName}</span>
            </div>
          )}

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">
              Field Officer Sign-off Notes:
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Manometer pressure measured at 4.2 bar; verified by Fire Marshal on site."
              className="w-full bg-[#070B14] border border-[#1E2D4A] rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 h-20"
            />
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
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shadow-md transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Verifying...' : 'Mark Completed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
