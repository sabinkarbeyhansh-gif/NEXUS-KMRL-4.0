import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BrainCircuit,
  Cpu,
  Sparkles,
  Layers,
  FileCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { useData } from '../contexts/DataContext';

export const Intelligence: React.FC = () => {
  const { documents, aiStatus } = useData();
  const navigate = useNavigate();

  const aiStats = [
    { label: 'Ingested Documents', value: '1,284', sub: 'Indexed & Vectorized', icon: FileCheck },
    { label: 'AI Extraction Pipeline', value: '1,147', sub: 'Extracted automatically', icon: Cpu },
    { label: 'Action Items Dispatched', value: '983', sub: 'Zero manual entry', icon: Sparkles },
    { label: 'Average Ingestion Latency', value: '3.4s', sub: 'Multilingual OCR & RAG', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <BrainCircuit className="w-6 h-6 text-cyan-400" />
          Document Intelligence Engine & Architecture
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Deep learning models, entity recognition, priority evaluation, and policy contradiction detectors
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {aiStats.map((st, i) => {
          const Icon = st.icon;
          return (
            <div key={i} className="p-5 rounded-2xl bg-[#0D1526] border border-[#1E2D4A] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase">{st.label}</span>
                <Icon className="w-4 h-4 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-black text-white">{st.value}</h3>
              <p className="text-[10px] font-mono text-slate-400">{st.sub}</p>
            </div>
          );
        })}
      </div>

      {/* End-to-End Visual Pipeline Diagram */}
      <div className="p-6 rounded-3xl bg-[#0D1526] border border-[#1E2D4A] shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1E2D4A] pb-3">
          <Layers className="w-4 h-4 text-cyan-400" />
          Autonomous Operational Intelligence Pipeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 text-center text-xs font-mono">
          {[
            { step: '1. Ingestion', desc: 'PDF, DOCX, Camera' },
            { step: '2. Neural OCR', desc: 'EN, ML & Tables' },
            { step: '3. Classification', desc: 'Type & Department' },
            { step: '4. Priority AI', desc: 'CRITICAL to LOW' },
            { step: '5. Extraction', desc: 'Actions & Deadlines' },
            { step: '6. Graph Link', desc: 'Stations & Assets' },
            { step: '7. Human Decision', desc: 'Verification & Close' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-[#070B14] border border-[#1E2D4A] space-y-1 flex flex-col justify-center"
            >
              <span className="text-cyan-400 font-bold block">{item.step}</span>
              <span className="text-[10px] text-slate-400">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent AI Ingestion Records */}
      <div className="p-6 rounded-3xl bg-[#0D1526] border border-[#1E2D4A] shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3">
          <h3 className="text-sm font-bold text-white">Latest Documents Processed by AI Engine</h3>
          <button
            onClick={() => navigate('/documents')}
            className="text-xs text-cyan-400 hover:underline font-semibold"
          >
            View All Documents →
          </button>
        </div>

        <div className="space-y-3">
          {documents.slice(0, 5).map((doc) => (
            <div
              key={doc.id}
              onClick={() => navigate(`/documents/${doc.id}`)}
              className="p-4 rounded-2xl bg-[#131E35]/50 hover:bg-[#131E35] border border-[#1E2D4A] hover:border-cyan-500/40 transition-colors cursor-pointer flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{doc.title}</h4>
                  <p className="text-xs text-slate-400 truncate">{doc.summary}</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400 shrink-0">
                {doc.aiConfidence}% Confidence
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
