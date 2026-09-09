import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Network,
  Scale,
  Mic,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { runGuidedDemoScenario } = useData();

  const handleEnter = (role: any = 'ADMIN') => {
    login(role);
    navigate('/overview');
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background Animated Gradient Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Bar */}
      <header className="px-6 py-6 flex items-center justify-between border-b border-[#1E2D4A]/40 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-wider text-white">
              KMRL <span className="text-cyan-400">NEXUS</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono block">
              KOCHI METRO RAIL LIMITED
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleEnter('ADMIN')}
            className="px-4 py-2 rounded-xl bg-[#0D1526] hover:bg-[#131E35] border border-[#1E2D4A] text-xs font-semibold text-slate-300 transition-colors"
          >
            Administrator Login
          </button>
          <button
            onClick={() => handleEnter('OFFICER')}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all"
          >
            Enter Command Center →
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-16 text-center space-y-8 my-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          SIH Hackathon Ready • Operational Decision Platform
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
          AI-Powered Operational <br />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
            Document Intelligence
          </span>
        </h1>

        <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          “From Documents to Decisions.” Transforming complex multilingual circulars, SCADA telemetry, and maintenance directives into structured priorities, risks, deadlines, and automated department actions.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => handleEnter('ADMIN')}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm shadow-xl shadow-cyan-500/25 hover:scale-105 transition-all"
          >
            Enter Command Center <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              handleEnter('ADMIN');
              setTimeout(() => runGuidedDemoScenario(), 500);
            }}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#0D1526] hover:bg-[#131E35] border border-[#1E2D4A] text-amber-300 font-bold text-sm transition-all"
          >
            Explore 13-Step Live Demo
          </button>
        </div>

        {/* Feature Grid Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 text-left text-xs font-mono">
          <div className="p-4 rounded-2xl bg-[#0D1526]/80 border border-[#1E2D4A] space-y-1">
            <Network className="w-5 h-5 text-cyan-400 mb-2" />
            <span className="text-white font-bold block">Knowledge Graph</span>
            <span className="text-slate-400 text-[11px]">Dynamic 25 station network topology</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0D1526]/80 border border-[#1E2D4A] space-y-1">
            <Scale className="w-5 h-5 text-amber-400 mb-2" />
            <span className="text-white font-bold block">Conflict Detector</span>
            <span className="text-slate-400 text-[11px]">Side-by-side policy contradiction finder</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0D1526]/80 border border-[#1E2D4A] space-y-1">
            <Mic className="w-5 h-5 text-emerald-400 mb-2" />
            <span className="text-white font-bold block">NEXUS Voice Guide</span>
            <span className="text-slate-400 text-[11px]">Speech recognition in EN, ML & HI</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0D1526]/80 border border-[#1E2D4A] space-y-1">
            <Cpu className="w-5 h-5 text-purple-400 mb-2" />
            <span className="text-white font-bold block">Pluggable AI</span>
            <span className="text-slate-400 text-[11px]">Gemini, Grok & Offline Mock AI</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-[#1E2D4A]/40 text-center text-xs text-slate-500 font-mono">
        KMRL NEXUS • Kochi Metro Rail Limited Operational Command System • 2026
      </footer>
    </div>
  );
};
