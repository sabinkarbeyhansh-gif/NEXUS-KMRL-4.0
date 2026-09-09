import React, { useState, useEffect } from 'react';
import { Building2, CheckCircle2, Cpu, Database, Network, Cloud, ShieldCheck } from 'lucide-react';

interface InitialBootLoaderProps {
  onComplete: () => void;
}

export const InitialBootLoader: React.FC<InitialBootLoaderProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(0);

  const checklist = [
    { label: 'PostgreSQL Relational Storage & Schema', icon: Database },
    { label: 'KMRL Neural AI Engine (Gemini / Grok / Local)', icon: Cpu },
    { label: 'Operational Knowledge Graph (25 Stations)', icon: Network },
    { label: 'Document Intelligence & Multilingual OCR (EN/ML/HI)', icon: ShieldCheck },
    { label: 'Cloud Object Storage & Ingestion Bridge', icon: Cloud },
  ];

  useEffect(() => {
    // Progressively check each subsystem
    const timer1 = setTimeout(() => setStep(1), 350);
    const timer2 = setTimeout(() => setStep(2), 700);
    const timer3 = setTimeout(() => setStep(3), 1050);
    const timer4 = setTimeout(() => setStep(4), 1400);
    const timer5 = setTimeout(() => setStep(5), 1750);
    const timerEnd = setTimeout(() => onComplete(), 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timerEnd);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070B14] text-white p-6 select-none">
      {/* Background ambient glow */}
      <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

      <div className="relative z-10 w-full max-w-md space-y-6 text-center">
        {/* Brand Icon */}
        <div className="mx-auto w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-2xl shadow-cyan-500/40 animate-bounce">
          <Building2 className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-2xl font-black tracking-wider text-white">
            KMRL <span className="text-cyan-400">NEXUS</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Initializing Operational Intelligence Command Center...
          </p>
        </div>

        {/* Boot Checklist */}
        <div className="rounded-3xl bg-[#0D1526]/80 border border-[#1E2D4A] p-5 shadow-xl space-y-3 text-left">
          {checklist.map((item, index) => {
            const Icon = item.icon;
            const isReady = step > index;
            const isCurrent = step === index;

            return (
              <div
                key={index}
                className={`flex items-center justify-between text-xs transition-all duration-300 ${
                  isReady
                    ? 'text-slate-200'
                    : isCurrent
                    ? 'text-cyan-300 font-semibold'
                    : 'text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isReady ? 'text-cyan-400' : 'text-slate-600'}`} />
                  <span>{item.label}</span>
                </div>

                {isReady ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-in zoom-in-50 duration-200" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-600">PENDING</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Loading Bar */}
        <div className="h-1.5 w-full bg-[#131E35] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300 ease-out"
            style={{ width: `${(step / 5) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
