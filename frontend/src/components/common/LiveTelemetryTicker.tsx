import React, { useState, useEffect } from 'react';
import { Radio, AlertTriangle, ShieldCheck, Activity, Zap, Building2 } from 'lucide-react';

export const LiveTelemetryTicker: React.FC = () => {
  const telemetryItems = [
    { text: 'CENTRAL SCADA: Normal state across 25 stations interlocked', icon: ShieldCheck, color: 'text-emerald-400' },
    { text: 'ALUVA STATION: Sprinkler Loop 2 pressure recalibration active', icon: AlertTriangle, color: 'text-amber-400' },
    { text: 'MUTTOM DEPOT: Trainset RS-07 in Bay 4 for scheduled brake pad overhaul', icon: Activity, color: 'text-indigo-400' },
    { text: 'KALASSERY CURVE: 45 km/h restriction pending tamping pass', icon: Zap, color: 'text-cyan-400' },
    { text: '25kV TRACTION: Night power block scheduled 01:15 AM Kaloor-Edapally', icon: Radio, color: 'text-indigo-400' },
    { text: 'WATER METRO: High Court Pontoon articulation pin safety sling engaged', icon: Building2, color: 'text-cyan-400' },
  ];

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % telemetryItems.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [telemetryItems.length]);

  const current = telemetryItems[currentIndex];
  const Icon = current.icon;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 h-7 bg-[#090d16]/95 backdrop-blur-md border-t border-slate-800/80 px-4 md:px-6 flex items-center justify-between text-[11px] font-mono select-none">
      <div className="flex items-center gap-2 overflow-hidden truncate">
        <span className="flex items-center gap-1.5 text-slate-400 font-semibold shrink-0 text-[10px] tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
          SCADA Telemetry
        </span>
        <span className="text-slate-600">/</span>
        <div className="flex items-center gap-1.5 truncate transition-all duration-300">
          <Icon className={`w-3.5 h-3.5 shrink-0 ${current.color}`} />
          <span className="text-slate-300 truncate font-sans text-xs">{current.text}</span>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-3 text-slate-500 shrink-0 text-[10px]">
        <span>Feed: 10.14.0.2 SCADA</span>
        <span className="text-emerald-400/90 font-medium">12ms</span>
      </div>
    </div>
  );
};
