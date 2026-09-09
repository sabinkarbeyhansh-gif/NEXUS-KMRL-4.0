import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarClock,
  Clock,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Building2,
  FileText,
  ArrowRight,
  Filter,
  Layers,
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { PriorityBadge } from '../components/documents/PriorityBadge';
import { getDeadlineStatus, formatISTDate, formatISTFull } from '../utils/dateTime';

export const Deadlines: React.FC = () => {
  const { documents, tasks } = useData();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  // Categorized deadlines
  const categorized = documents.map((doc) => {
    const deadline = getDeadlineStatus(doc.submissionDeadline);
    return {
      doc,
      deadline,
    };
  });

  const filtered = categorized.filter(({ deadline }) => {
    if (activeFilter === 'OVERDUE') return deadline.isOverdue;
    if (activeFilter === 'TODAY') return deadline.daysRemaining === 0;
    if (activeFilter === 'TOMORROW') return deadline.daysRemaining === 1;
    if (activeFilter === 'URGENT') return deadline.daysRemaining <= 4;
    return true;
  });

  // Sort by urgency (overdue first, then due today, etc.)
  const sorted = [...filtered].sort((a, b) => a.deadline.daysRemaining - b.deadline.daysRemaining);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <CalendarClock className="w-6 h-6 text-cyan-400" />
            Operational Deadline & Submission Engine
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Dynamic IST countdowns, statutory compliance monitoring, and timeline tracking
          </p>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex items-center gap-2">
          {[
            { id: 'ALL', label: 'All Items' },
            { id: 'OVERDUE', label: 'Overdue' },
            { id: 'TODAY', label: 'Due Today' },
            { id: 'TOMORROW', label: 'Due Tomorrow' },
            { id: 'URGENT', label: 'Due < 4 Days' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-colors ${
                activeFilter === f.id
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'bg-[#0D1526] hover:bg-[#131E35] text-slate-300 border border-[#1E2D4A]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Deadlines Timeline Feed */}
      <div className="space-y-4">
        {sorted.map(({ doc, deadline }) => {
          return (
            <div
              key={doc.id}
              onClick={() => navigate(`/documents/${doc.id}`)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer ${
                deadline.isOverdue
                  ? 'bg-rose-950/20 border-rose-500/50 hover:border-rose-500 shadow-lg'
                  : deadline.daysRemaining === 0
                  ? 'bg-amber-950/20 border-amber-500/50 hover:border-amber-500'
                  : 'bg-[#0D1526] border-[#1E2D4A] hover:border-cyan-500/40'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Document Info */}
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <PriorityBadge priority={doc.humanPriority || doc.aiPriority} />
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#070B14] text-cyan-400 border border-[#1E2D4A]">
                      {doc.id}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#070B14] text-slate-400 border border-[#1E2D4A]">
                      {doc.department}
                    </span>
                    {doc.station && (
                      <span className="text-[10px] font-mono text-slate-300 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-cyan-400" />
                        {doc.station}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">{doc.title}</h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{doc.summary}</p>
                </div>

                {/* Right: Countdown & Visual Timeline Progression */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                  {/* Countdown Badge */}
                  <div className="text-right space-y-1">
                    <span
                      className={`text-xs font-mono font-black px-3 py-1 rounded-xl border block text-center ${deadline.badgeColor}`}
                    >
                      {deadline.label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 block text-center">
                      Target: {formatISTDate(doc.submissionDeadline)}
                    </span>
                  </div>

                  {/* Document Lifecycle Steps */}
                  <div className="p-3 rounded-2xl bg-[#070B14] border border-[#1E2D4A] flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <div className="text-center">
                      <span className="text-cyan-400 block font-bold">Received</span>
                      <span>{formatISTDate(doc.receivedDate)}</span>
                    </div>
                    <span className="text-slate-600">→</span>
                    <div className="text-center">
                      <span className="text-blue-400 block font-bold">AI Verified</span>
                      <span>{formatISTDate(doc.createdDate)}</span>
                    </div>
                    <span className="text-slate-600">→</span>
                    <div className="text-center">
                      <span className="text-amber-400 block font-bold">Deadline</span>
                      <span>{formatISTDate(doc.submissionDeadline)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
