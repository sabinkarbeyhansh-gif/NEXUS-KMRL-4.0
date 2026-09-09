import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  ClipboardList,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Cpu,
  Flame,
  ArrowRight,
  TrendingUp,
  Radio,
  Building2,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { PriorityBadge } from '../components/documents/PriorityBadge';
import { getDeadlineStatus } from '../utils/dateTime';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export const Overview: React.FC = () => {
  const { t } = useLanguage();
  const { documents, isProcessingDemo, runGuidedDemoScenario } = useData();
  const navigate = useNavigate();

  // Metrics calculation
  const totalDocs = 1284;
  const pendingActions = 47;
  const criticalDocs = 12;
  const overdueItems = 5;
  const dueToday = 8;
  const completed = 936;
  const aiProcessed = 1147;
  const highRisk = 18;

  const metricCards = [
    {
      id: 'total-docs',
      label: t.metrics.totalDocuments,
      value: totalDocs.toLocaleString(),
      change: '+14 today',
      icon: FileText,
      gradient: 'from-blue-600/25 via-cyan-500/15 to-transparent',
      borderColor: 'border-cyan-500/40 hover:border-cyan-400',
      iconBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      textColor: 'text-cyan-400',
      path: '/documents',
    },
    {
      id: 'pending-actions',
      label: t.metrics.pendingActions,
      value: pendingActions.toString(),
      change: '8 high priority',
      icon: ClipboardList,
      gradient: 'from-amber-600/25 via-orange-500/15 to-transparent',
      borderColor: 'border-amber-500/40 hover:border-amber-400',
      iconBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      textColor: 'text-amber-400',
      path: '/actions',
    },
    {
      id: 'critical-docs',
      label: t.metrics.criticalDocuments,
      value: criticalDocs.toString(),
      change: 'Immediate sign-off',
      icon: Flame,
      gradient: 'from-rose-600/25 via-red-500/15 to-transparent',
      borderColor: 'border-rose-500/50 hover:border-rose-400 animate-pulse',
      iconBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      textColor: 'text-rose-400',
      path: '/documents?priority=CRITICAL',
    },
    {
      id: 'overdue-items',
      label: t.metrics.overdueItems,
      value: overdueItems.toString(),
      change: 'Escalation pending',
      icon: AlertTriangle,
      gradient: 'from-red-600/25 via-orange-500/15 to-transparent',
      borderColor: 'border-red-500/40 hover:border-red-400',
      iconBg: 'bg-red-500/20 text-red-300 border-red-500/40',
      textColor: 'text-red-400',
      path: '/deadlines?filter=overdue',
    },
    {
      id: 'due-today',
      label: t.metrics.dueToday,
      value: dueToday.toString(),
      change: 'Expiring in IST',
      icon: Clock,
      gradient: 'from-yellow-600/25 via-amber-500/15 to-transparent',
      borderColor: 'border-yellow-500/40 hover:border-yellow-400',
      iconBg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
      textColor: 'text-yellow-400',
      path: '/deadlines?filter=today',
    },
    {
      id: 'completed',
      label: t.metrics.completed,
      value: completed.toLocaleString(),
      change: '98.4% compliance',
      icon: CheckCircle2,
      gradient: 'from-emerald-600/25 via-teal-500/15 to-transparent',
      borderColor: 'border-emerald-500/40 hover:border-emerald-400',
      iconBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      textColor: 'text-emerald-400',
      path: '/actions?status=COMPLETED',
    },
    {
      id: 'ai-processed',
      label: t.metrics.aiProcessed,
      value: aiProcessed.toLocaleString(),
      change: 'Zero human delay',
      icon: Cpu,
      gradient: 'from-purple-600/25 via-indigo-500/15 to-transparent',
      borderColor: 'border-purple-500/40 hover:border-purple-400',
      iconBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      textColor: 'text-purple-400',
      path: '/intelligence',
    },
    {
      id: 'high-risk',
      label: t.metrics.highRisk,
      value: highRisk.toString(),
      change: '4 critical safety',
      icon: ShieldAlert,
      gradient: 'from-pink-600/25 via-rose-500/15 to-transparent',
      borderColor: 'border-pink-500/40 hover:border-pink-400',
      iconBg: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
      textColor: 'text-pink-400',
      path: '/risks',
    },
  ];

  // Workload Chart Data
  const deptWorkloadData = [
    { department: 'Safety', count: 42, color: '#EF4444' },
    { department: 'Maintenance', count: 38, color: '#F59E0B' },
    { department: 'Engineering', count: 35, color: '#00D2FF' },
    { department: 'Operations', count: 28, color: '#10B981' },
    { department: 'Finance', count: 18, color: '#A855F7' },
    { department: 'Procurement', count: 14, color: '#6366F1' },
  ];

  const criticalFeed = documents.filter((d) => d.aiPriority === 'CRITICAL').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero (High-Impact Kochi Metro Blue) */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0E1F4D] via-[#11255C] to-[#0A1638] border border-cyan-500/40 p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                KMRL NEXUS PLATFORM
              </span>
              <span className="text-xs text-slate-300 font-mono">Central Command • 25 Stations Connected</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Operational Document Intelligence & Decision Automation
            </h1>
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-sans">
              “From Documents to Decisions.” Automating ingestion, OCR, multilingual understanding, knowledge graph generation, risk detection, and operational actions for Kochi Metro Rail Limited.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/graph')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black shadow-lg shadow-cyan-500/30 transition-all hover:scale-105"
            >
              <TrendingUp className="w-4 h-4" />
              Operational Graph
            </button>
            <button
              onClick={runGuidedDemoScenario}
              disabled={isProcessingDemo}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/30 transition-all disabled:opacity-50"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              {isProcessingDemo ? 'Executing Demo Pipeline...' : 'Run 13-Step Live Demo'}
            </button>
          </div>
        </div>
      </div>

      {/* 8 Metric Cards with Rich Colors & Gradients */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => navigate(card.path)}
              className={`p-4 md:p-5 rounded-2xl bg-gradient-to-br ${card.gradient} bg-[#0E1834] border ${card.borderColor} cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-xl group shadow-md`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-200 font-bold truncate group-hover:text-white transition-colors">
                  {card.label}
                </span>
                <div className={`p-2 rounded-xl border ${card.iconBg} shadow-xs group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className={`text-2xl md:text-3xl font-black tracking-tight ${card.textColor}`}>
                  {card.value}
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                  <span>{card.change}</span>
                  <span className="text-white font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    View <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Columns: Critical Operations Feed & Department Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Critical Operations Feed (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0E1834] border border-[#1E325C] p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1E325C] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Critical Operations Feed</h2>
                <p className="text-xs text-slate-400 font-mono">
                  Mandatory safety inspections requiring immediate sign-off
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/documents?priority=CRITICAL')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 hover:underline"
            >
              View All 12 <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {criticalFeed.map((doc) => {
              const deadline = getDeadlineStatus(doc.submissionDeadline);
              return (
                <div
                  key={doc.id}
                  onClick={() => navigate(`/documents/${doc.id}`)}
                  className="p-4 rounded-xl bg-[#121E3E] hover:bg-[#16254C] border border-[#22355A] hover:border-rose-500/50 transition-all cursor-pointer space-y-2 group shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <PriorityBadge priority={doc.humanPriority || doc.aiPriority} />
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#080E24] text-cyan-300 border border-[#1E325C]">
                          {doc.department}
                        </span>
                        {doc.station && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 font-bold">
                            <Building2 className="w-3 h-3" />
                            {doc.station}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {doc.title}
                      </h4>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border shrink-0 ${deadline.badgeColor}`}
                    >
                      {deadline.label}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {doc.summary}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#22355A] text-[11px] text-slate-400 font-mono">
                    <span>Assigned: <strong className="text-slate-200">{doc.assignedTo}</strong></span>
                    <span className="text-cyan-400 group-hover:text-cyan-300 font-bold flex items-center gap-1">
                      Inspect Intelligence →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Workload & Analytics Widget (1 col) */}
        <div className="rounded-2xl bg-[#0E1834] border border-[#1E325C] p-6 space-y-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1E325C] pb-3 mb-4">
              <h2 className="text-base font-bold text-white">Department Workload</h2>
              <span className="text-xs text-cyan-400 font-mono font-bold">Active Items</span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptWorkloadData} layout="vertical" margin={{ left: 5, right: 10 }}>
                  <XAxis type="number" stroke="#64748B" fontSize={10} hide />
                  <YAxis
                    dataKey="department"
                    type="category"
                    stroke="#CBD5E1"
                    fontSize={11}
                    width={85}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0E1834',
                      borderColor: '#1E325C',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#F8FAFC',
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {deptWorkloadData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#121E3E] border border-[#22355A] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">Highest Pending Load:</span>
              <span className="text-rose-400 font-bold">Safety Division (42)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium">CMRS Compliance Rate:</span>
              <span className="text-emerald-400 font-mono font-black text-sm">98.4%</span>
            </div>
            <button
              onClick={() => navigate('/analytics')}
              className="w-full mt-2 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all text-center"
            >
              Full Operational Breakdown →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
