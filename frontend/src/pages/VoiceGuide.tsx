import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Radio,
  Building2,
  CalendarClock,
  Flame,
  Globe,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

export const VoiceGuide: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'EN' | 'ML' | 'HI'>('EN');

  const voiceScenarios = {
    EN: [
      {
        question: '“What documents are due today?”',
        answer: '“There are 8 documents due today. 3 are critical and 5 are high priority.”',
        action: 'Navigates to /deadlines?filter=today',
      },
      {
        question: '“Show critical safety risks for Aluva Station.”',
        answer: '“Aluva Station has 1 critical sprinkler risk and 17 linked operational documents.”',
        action: 'Navigates to /graph (focuses Aluva)',
      },
      {
        question: '“Find conflicting inspection policies.”',
        answer: '“Detected contradiction: 2026 Evacuation Guideline (30 days) vs Maintenance SLA (45 days).”',
        action: 'Navigates to /conflicts',
      },
      {
        question: '“Show overdue tasks assigned to Safety Directorate.”',
        answer: '“Task ACT-012 (Palarivattom CCTV blind spot) is overdue by 1 day.”',
        action: 'Navigates to /actions',
      },
    ],
    ML: [
      {
        question: '“കാലാവധി കഴിഞ്ഞ സുരക്ഷാ രേഖകൾ ഏതൊക്കെയാണ്?”',
        answer: '“പാലാരിവട്ടം സിസിടിവി പരിശോധനയും കെ.എസ്.പി.സി.ബി റിപ്പോർട്ടും കാലാവധി കഴിഞ്ഞവയിൽ ഉൾപ്പെടുന്നു.”',
        action: 'Navigates to /deadlines',
      },
      {
        question: '“ആലുവ സ്റ്റേഷനിലെ പ്രധാന അപകടസാധ്യതകൾ കാണിക്കുക.”',
        answer: '“ആലുവ സ്റ്റേഷൻ പ്ലാറ്റ്‌ഫോം 2-ൽ സ്പ്രിംഗ്ലർ പ്രഷർ കുറഞ്ഞതായി കണ്ടെത്തിയിട്ടുണ്ട്.”',
        action: 'Navigates to /risks',
      },
      {
        question: '“പരസ്പരവിരുദ്ധമായ നയങ്ങൾ കണ്ടെത്തുക.”',
        answer: '“2026-ലെ 30 ദിവസ പരിശോധനാ നയവും നിലവിലെ 45 ദിവസ കരാറും തമ്മിൽ വൈരുദ്ധ്യം കണ്ടെത്തി.”',
        action: 'Navigates to /conflicts',
      },
    ],
    HI: [
      {
        question: '“कौन से सुरक्षा दस्तावेज़ लंबित हैं?”',
        answer: '“अलुवा फायर सेफ्टी और पालारिवट्टोम निगरानी रिपोर्ट तत्काल लंबित हैं।”',
        action: 'Navigates to /deadlines',
      },
      {
        question: '“अलुवा स्टेशन के महत्वपूर्ण जोखिम दिखाएं।”',
        answer: '“अलुवा स्टेशन में 1 महत्वपूर्ण अग्नि सुरक्षा जोखिम और 4 कार्य खुले हैं।”',
        action: 'Navigates to /graph',
      },
      {
        question: '“विरोधाभासी नीतियां खोजें।”',
        answer: '“2026 आपातकालीन नीति और वेंडर समझौते के बीच 15 दिनों का अंतराल पाया गया है।”',
        action: 'Navigates to /conflicts',
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Mic className="w-6 h-6 text-amber-400" />
          NEXUS VOICE Speech Assistant Guide
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Operational hands-free voice control for station controllers and field engineers in English, Malayalam and Hindi
        </p>
      </div>

      {/* Hero Visualizer Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0D1526] via-[#131E35] to-[#070B14] border border-[#1E2D4A] shadow-2xl flex flex-col items-center justify-center text-center space-y-5 relative overflow-hidden">
        <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none"></div>

        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-2xl shadow-amber-500/30 ring-8 ring-amber-500/20">
          <Mic className="w-9 h-9 animate-pulse" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-black text-white">NEXUS VOICE ACTIVATED</h2>
          <p className="text-xs text-slate-300 max-w-md">
            Click the microphone in the top navigation bar at any time to issue spoken operational commands.
          </p>
        </div>

        {/* Audio Waveform Simulation */}
        <div className="flex items-center gap-1 h-8">
          {[16, 24, 12, 32, 20, 28, 14, 30, 18, 26, 12, 22].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-amber-500 to-cyan-400 rounded-full animate-pulse"
              style={{
                height: `${h}px`,
                animationDelay: `${i * 0.1}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Multilingual Speech Scenarios */}
      <div className="rounded-3xl bg-[#0D1526] border border-[#1E2D4A] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            Tested Operational Voice Scenarios
          </h3>

          <div className="flex items-center gap-1 font-mono text-xs">
            {(['EN', 'ML', 'HI'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveTab(lang)}
                className={`px-3 py-1 rounded-xl uppercase font-bold transition-colors ${
                  activeTab === lang
                    ? 'bg-amber-500 text-black'
                    : 'bg-[#070B14] text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'EN' ? 'English' : lang === 'ML' ? 'മലയാളം' : 'हिन्दी'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {voiceScenarios[activeTab].map((sc, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#131E35]/50 border border-[#1E2D4A] space-y-3"
            >
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs">
                <Mic className="w-3.5 h-3.5 shrink-0" />
                <span>You Speak: {sc.question}</span>
              </div>
              <div className="flex items-start gap-2 text-cyan-200 text-xs bg-[#070B14] p-3 rounded-xl border border-[#1E2D4A]">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>AI Answers: {sc.answer}</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 block text-right">
                ✓ Automated Action: {sc.action}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
