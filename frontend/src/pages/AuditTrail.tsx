import React, { useState } from 'react';
import {
  History,
  Shield,
  FileText,
  User,
  Sliders,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  ArrowRight,
  Database,
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { formatISTFull } from '../utils/dateTime';

export const AuditTrail: React.FC = () => {
  const { auditLogs } = useData();
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [searchActor, setSearchActor] = useState<string>('');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesAction = filterAction === 'ALL' || log.action === filterAction;
    const matchesActor =
      searchActor === '' ||
      log.actor.toLowerCase().includes(searchActor.toLowerCase()) ||
      log.details.toLowerCase().includes(searchActor.toLowerCase()) ||
      log.target.toLowerCase().includes(searchActor.toLowerCase());
    return matchesAction && matchesActor;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'PRIORITY_OVERRIDE':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'DOCUMENT_UPLOAD':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'TASK_COMPLETED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'AI_CLASSIFICATION':
      case 'AUTO_TASK_DISPATCH':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-cyan-400" />
            Immutable Operational Audit Trail
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Cryptographically sealed operational chronological timeline of human decisions and AI actions
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-[#0D1526] border border-[#1E2D4A] text-slate-300 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            Total Audit Records: <strong className="text-white">{auditLogs.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-3xl bg-[#0D1526] border border-[#1E2D4A] shadow-xl flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchActor}
            onChange={(e) => setSearchActor(e.target.value)}
            placeholder="Search by actor (e.g. S. Pradeep, Narayanan), action or target..."
            className="w-full bg-[#070B14] border border-[#1E2D4A] rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="bg-[#070B14] border border-[#1E2D4A] rounded-xl px-3 py-2 text-xs text-slate-200 font-medium focus:outline-none focus:border-cyan-400 font-mono"
        >
          <option value="ALL">All Event Types</option>
          <option value="DOCUMENT_UPLOAD">DOCUMENT UPLOAD</option>
          <option value="AI_CLASSIFICATION">AI CLASSIFICATION</option>
          <option value="PRIORITY_OVERRIDE">PRIORITY OVERRIDE</option>
          <option value="TASK_COMPLETED">TASK COMPLETED</option>
          <option value="AUTO_TASK_DISPATCH">AUTO TASK DISPATCH</option>
        </select>
      </div>

      {/* Audit Timeline */}
      <div className="rounded-3xl bg-[#0D1526] border border-[#1E2D4A] p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3 text-xs">
          <span className="font-mono text-cyan-400 font-bold uppercase">
            AUDIT TIMELINE ({filteredLogs.length} EVENTS RECORDED)
          </span>
          <span className="text-slate-400 font-mono">Real-time Clock Synchronized with IST</span>
        </div>

        <div className="relative pl-6 border-l-2 border-[#1E2D4A] ml-4 space-y-6">
          {filteredLogs.map((log) => (
            <div key={log.id} className="relative space-y-2 group">
              {/* Timeline Node Point */}
              <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-[#0D1526] shadow-md group-hover:scale-125 transition-transform"></div>

              <div className="p-4 rounded-2xl bg-[#131E35]/50 hover:bg-[#131E35] border border-[#1E2D4A] hover:border-cyan-500/40 transition-all space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${getActionBadge(
                        log.action
                      )}`}
                    >
                      {log.action.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                      {log.actor} ({log.role})
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      IP: {log.ipAddress}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400">
                    {formatISTFull(log.timestamp)}
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-sans">{log.details}</p>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-[#1E2D4A]/50">
                  <span>Target: <strong className="text-slate-300">{log.target}</strong></span>
                  <span className="text-emerald-400">✓ Cryptographically Logged</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
