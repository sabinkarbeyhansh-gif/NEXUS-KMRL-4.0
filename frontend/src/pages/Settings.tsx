import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Cpu,
  Key,
  Shield,
  Cloud,
  Database,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Server,
  Zap,
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

export const Settings: React.FC = () => {
  const { aiProvider, setAIProvider, aiStatus, resetDemoData } = useData();
  const { currentUser, setRole } = useAuth();
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);

  const handleReset = () => {
    resetDemoData();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <SettingsIcon className="w-6 h-6 text-cyan-400" />
          System Settings & AI Provider Orchestration
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Configure active AI models, cloud storage endpoints, role permissions and demo datasets
        </p>
      </div>

      {/* AI Provider Switcher Card */}
      <div className="rounded-3xl bg-[#0D1526] border border-[#1E2D4A] p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold text-white">Active AI Engine Architecture</h2>
              <p className="text-xs text-slate-400 font-mono">
                Pluggable provider abstraction with zero code changes in UI components
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Response Latency:</span>
            <span className="text-emerald-400 font-bold">{aiStatus.latencyMs} ms</span>
          </div>
        </div>

        {/* 3 Selectable Providers: Gemini, Grok, Mock AI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Gemini */}
          <div
            onClick={() => setAIProvider('Gemini')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
              aiProvider === 'Gemini'
                ? 'bg-cyan-500/10 border-cyan-500 shadow-lg shadow-cyan-500/20 scale-[1.02]'
                : 'bg-[#070B14] border-[#1E2D4A] hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Google Gemini
              </span>
              {aiProvider === 'Gemini' && (
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              )}
            </div>
            <p className="text-xs text-slate-300">
              Gemini 2.0 Flash multimodal model. Ideal for complex engineering blueprints, PDF OCR, and multilingual Malayalam text.
            </p>
            <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-[#1E2D4A]">
              API Key: <span className="text-cyan-400">GEMINI_API_KEY</span> (Server-side)
            </div>
          </div>

          {/* Grok / xAI */}
          <div
            onClick={() => setAIProvider('Grok')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
              aiProvider === 'Grok'
                ? 'bg-purple-500/10 border-purple-500 shadow-lg shadow-purple-500/20 scale-[1.02]'
                : 'bg-[#070B14] border-[#1E2D4A] hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-purple-400" />
                Grok / xAI
              </span>
              {aiProvider === 'Grok' && (
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
              )}
            </div>
            <p className="text-xs text-slate-300">
              Grok-Beta OpenAI-compatible integration. High-speed reasoning for policy contradiction discovery and risk analysis.
            </p>
            <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-[#1E2D4A]">
              API Key: <span className="text-purple-400">GROK_API_KEY</span> (Server-side)
            </div>
          </div>

          {/* Mock AI / Demo Intelligence */}
          <div
            onClick={() => setAIProvider('Mock AI')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
              aiProvider === 'Mock AI'
                ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/20 scale-[1.02]'
                : 'bg-[#070B14] border-[#1E2D4A] hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white flex items-center gap-1.5">
                <Server className="w-4 h-4 text-amber-400" />
                Demo Intelligence (Offline)
              </span>
              {aiProvider === 'Mock AI' && (
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
              )}
            </div>
            <p className="text-xs text-slate-300">
              Deterministic offline AI pipeline. 100% reliable during SIH judging presentations without dependency on external internet or API quotas.
            </p>
            <div className="text-[10px] font-mono text-amber-300 pt-1 border-t border-[#1E2D4A]">
              Recommended for Hackathon Presentation
            </div>
          </div>
        </div>

        {/* Security / API Key Notice */}
        <div className="p-4 rounded-2xl bg-[#070B14] border border-[#1E2D4A] text-xs space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono">
            <Key className="w-4 h-4" />
            ENTERPRISE SECURITY NOTICE
          </div>
          <p className="text-slate-300">
            API keys are strictly safeguarded inside backend environment variables (<code>.env</code>) and are never exposed to browser client-side bundles.
          </p>
        </div>
      </div>

      {/* Role & Access Control Configuration */}
      <div className="rounded-3xl bg-[#0D1526] border border-[#1E2D4A] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Role-Based Access Control (RBAC)</h2>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            Current: {currentUser.role}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(['ADMIN', 'MANAGER', 'OFFICER', 'AUDITOR', 'VIEWER'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`p-3 rounded-2xl border text-xs font-mono font-bold transition-all ${
                currentUser.role === r
                  ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-md'
                  : 'bg-[#070B14] border-[#1E2D4A] text-slate-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Demo Reset & Maintenance Controls */}
      <div className="rounded-3xl bg-[#0D1526] border border-[#1E2D4A] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Reset Demonstration Dataset</h3>
            <p className="text-xs text-slate-400 font-mono">
              Restores initial 30+ KMRL documents, stations, tasks and knowledge graph topology
            </p>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#131E35] hover:bg-[#1E2D4A] text-slate-300 hover:text-white border border-[#1E2D4A] text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset State
          </button>
        </div>

        {resetSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
            ✓ Initial demonstration state restored successfully.
          </div>
        )}
      </div>
    </div>
  );
};
