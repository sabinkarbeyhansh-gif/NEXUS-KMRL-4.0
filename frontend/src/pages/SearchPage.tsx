import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Sparkles,
  FileText,
  Building2,
  AlertTriangle,
  ClipboardList,
  Shield,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { PriorityBadge } from '../components/documents/PriorityBadge';

export const SearchPage: React.FC = () => {
  const { documents, tasks, risks } = useData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState<string>(searchParams.get('q') || '');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // Semantic search matches
  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return { docs: documents.slice(0, 6), tasks: tasks.slice(0, 4), risks: risks.slice(0, 3) };
    }

    const q = query.toLowerCase();

    const matchedDocs = documents.filter((d) =>
      d.title.toLowerCase().includes(q) ||
      d.summary.toLowerCase().includes(q) ||
      d.department.toLowerCase().includes(q) ||
      (d.station && d.station.toLowerCase().includes(q)) ||
      (d.keyFacts && d.keyFacts.some((f) => f.toLowerCase().includes(q)))
    );

    const matchedTasks = tasks.filter((t) =>
      t.title.toLowerCase().includes(q) ||
      t.assignedPerson.toLowerCase().includes(q) ||
      t.department.toLowerCase().includes(q) ||
      (t.station && t.station.toLowerCase().includes(q))
    );

    const matchedRisks = risks.filter((r) =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.recommendedMitigation.toLowerCase().includes(q)
    );

    return { docs: matchedDocs, tasks: matchedTasks, risks: matchedRisks };
  }, [documents, tasks, risks, query]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Search className="w-6 h-6 text-cyan-400" />
          Semantic AI Operational Search
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Natural language & keyword discovery across documents, stations, risks, tasks, and policies
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="p-4 rounded-3xl bg-[#0D1526] border border-[#1E2D4A] shadow-xl space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-cyan-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search e.g. 'documents about fire safety at Aluva' or '25kV catenary maintenance'..."
            className="w-full bg-[#070B14] border border-[#1E2D4A] rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 shadow-inner"
          />
        </div>

        {/* Quick query tags */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <span className="text-slate-500 shrink-0">Try searching:</span>
          {[
            'fire safety at Aluva',
            '25kV catenary droppers',
            'brake pad replacement Muttom',
            'commercial kiosk lease defaults',
            'Petta CBTC firmware patch',
          ].map((tag, i) => (
            <button
              key={i}
              onClick={() => setQuery(tag)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-[#131E35] text-slate-300 hover:text-white shrink-0 border border-[#1E2D4A]"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Sections */}
      <div className="space-y-6">
        {/* Matched Documents */}
        <div className="rounded-3xl bg-[#0D1526] border border-[#1E2D4A] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Documents ({searchResults.docs.length} found)
            </h3>
            <span className="text-xs font-mono text-slate-400">Semantic Matching</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {searchResults.docs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => navigate(`/documents/${doc.id}`)}
                className="p-4 rounded-2xl bg-[#131E35]/50 hover:bg-[#131E35] border border-[#1E2D4A] hover:border-cyan-500/40 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <PriorityBadge priority={doc.humanPriority || doc.aiPriority} />
                  <span className="text-[10px] font-mono text-slate-400">{doc.department}</span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {doc.title}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2">{doc.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Matched Tasks & Risks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tasks */}
          <div className="rounded-3xl bg-[#0D1526] border border-[#1E2D4A] p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E2D4A] pb-3">
              <ClipboardList className="w-4 h-4 text-amber-400" />
              Operational Tasks ({searchResults.tasks.length} found)
            </h3>
            <div className="space-y-2">
              {searchResults.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => navigate('/actions')}
                  className="p-3 rounded-xl bg-[#131E35]/40 hover:bg-[#131E35] border border-[#1E2D4A] cursor-pointer space-y-1 text-xs"
                >
                  <span className="text-[9px] font-mono text-cyan-400">{task.id}</span>
                  <h5 className="font-bold text-white">{task.title}</h5>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>{task.assignedPerson}</span>
                    <span className="text-amber-400">{task.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risks */}
          <div className="rounded-3xl bg-[#0D1526] border border-[#1E2D4A] p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E2D4A] pb-3">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Identified Risks ({searchResults.risks.length} found)
            </h3>
            <div className="space-y-2">
              {searchResults.risks.map((risk) => (
                <div
                  key={risk.id}
                  onClick={() => navigate('/risks')}
                  className="p-3 rounded-xl bg-[#131E35]/40 hover:bg-[#131E35] border border-[#1E2D4A] cursor-pointer space-y-1 text-xs"
                >
                  <span className="text-[9px] font-mono text-rose-400 font-bold uppercase">
                    {risk.severity} RISK
                  </span>
                  <h5 className="font-bold text-white">{risk.title}</h5>
                  <p className="text-[11px] text-slate-300 line-clamp-1">{risk.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
