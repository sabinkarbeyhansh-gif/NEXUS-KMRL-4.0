import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Zap,
  ShieldCheck,
  Radio,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Power,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Gauge,
  Flame,
  Droplets,
  Wind,
} from 'lucide-react';
import { useData } from '../contexts/DataContext';

interface StationSCADA {
  station: string;
  subsystem: string;
  sensor: string;
  value: string;
  nominalRange: string;
  status: 'NORMAL' | 'WARNING' | 'INTERLOCKED';
  matchedDirective: string;
  directiveId: string;
  interlockAction: string;
}

const LIVE_SCADA_FEEDS: StationSCADA[] = [
  {
    station: 'Aluva',
    subsystem: 'Traction Power (25kV Catenary)',
    sensor: 'Terminal Block DB-02 Temperature',
    value: '78.4°C',
    nominalRange: '< 55.0°C',
    status: 'WARNING',
    matchedDirective: 'Aluva Station Sub-Distribution Panel Thermographic Inspection',
    directiveId: 'DOC-KMRL-2026-003',
    interlockAction: 'Triggered thermal alert: Torque terminal screws before evening rush peak.',
  },
  {
    station: 'Kaloor',
    subsystem: 'Underground Tunnel Ventilation',
    sensor: 'Emergency Smoke Extraction Booster 03 Pressure',
    value: '142 Pa',
    nominalRange: '135 - 160 Pa',
    status: 'NORMAL',
    matchedDirective: 'Kaloor Tunnel Damper Actuation & Smoke Clearance Mandate',
    directiveId: 'DOC-KMRL-2026-005',
    interlockAction: 'Damper 100% stroke verified in auto-SCADA supervisory loop.',
  },
  {
    station: 'Edappally',
    subsystem: 'Platform Screen Doors (PSD)',
    sensor: 'Platform 2 Door Gate Cycle Inverter Temp',
    value: '44.1°C',
    nominalRange: '< 50.0°C',
    status: 'NORMAL',
    matchedDirective: 'Lulu Mall Edappally High-Density Passenger Flow Protocol',
    directiveId: 'DOC-KMRL-2026-008',
    interlockAction: 'Door opening interval calibrated to 22.0 seconds headway.',
  },
  {
    station: 'MG Road',
    subsystem: 'Station Fire Fighting Network',
    sensor: 'Underground Standpipe Hydrant Water Pressure',
    value: '8.4 bar',
    nominalRange: '7.5 - 9.0 bar',
    status: 'NORMAL',
    matchedDirective: 'NFPA 130 Fire Hydrant Water Flow & Pressure Compliance',
    directiveId: 'DOC-KMRL-2026-012',
    interlockAction: 'Jockey pump pressure maintained in auto-replenish mode.',
  },
  {
    station: 'Muttom Depot',
    subsystem: 'Track Drainage Sump Pumps',
    sensor: 'Sump Pit Water Level (Dual Submersible)',
    value: '14 mm',
    nominalRange: '< 75 mm',
    status: 'NORMAL',
    matchedDirective: 'Muttom Depot Monsoon Preparedness & Sump Ingress Clearance',
    directiveId: 'DOC-KMRL-2026-015',
    interlockAction: 'Pump A/B 6-hour alternation schedule verified active.',
  },
  {
    station: 'High Court Water Metro',
    subsystem: 'Electric Hybrid Ferry Dock',
    sensor: 'Vessel Battery Pack Rapid Charger SOC',
    value: '88% SOC (420 kW)',
    nominalRange: '20% - 95% SOC',
    status: 'NORMAL',
    matchedDirective: 'Water Metro Maritime Battery Safety & Ferry Docking SOP',
    directiveId: 'DOC-KMRL-2026-020',
    interlockAction: 'Pantograph fast charger interlocked to vessel mooring lock.',
  },
];

export const Intelligence: React.FC = () => {
  const { documents, aiStatus } = useData();
  const navigate = useNavigate();

  // Autonomous Interlocking States (Simulated live execution)
  const [interlockTSR, setInterlockTSR] = useState<boolean>(false);
  const [interlockVentilation, setInterlockVentilation] = useState<boolean>(true);
  const [interlockSumpPumps, setInterlockSumpPumps] = useState<boolean>(true);
  const [interlockTractionHalt, setInterlockTractionHalt] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#091126] border border-[#17254A] shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              SCADA Safety Interlocking & Predictive Maintenance Hub
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Live telemetry correlation with ingested statutory directives, asset remaining life, and autonomous safety overrides
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D1836] border border-cyan-500/30 font-mono text-xs text-cyan-300">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>OCC SCADA Central: Synced (25 Stations)</span>
        </div>
      </div>

      {/* Top 4 Real-Time Telemetry Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#091126] border border-[#17254A] space-y-1 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Monitored SCADA Sensors</span>
            <Gauge className="w-4 h-4 text-cyan-400" />
          </div>
          <h3 className="text-2xl lg:text-3xl font-black text-white font-mono">1,480</h3>
          <p className="text-[10px] font-mono text-cyan-400">Zero data packet drop</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#091126] border border-[#17254A] space-y-1 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Directive-Sensor Pairs</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-2xl lg:text-3xl font-black text-amber-400 font-mono">312</h3>
          <p className="text-[10px] font-mono text-slate-400">Correlated in real time</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#091126] border border-[#17254A] space-y-1 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Autonomous Interlocks</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-2xl lg:text-3xl font-black text-emerald-400 font-mono">4 Active</h3>
          <p className="text-[10px] font-mono text-emerald-400">Fail-safe supervisory loops</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#091126] border border-[#17254A] space-y-1 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Predictive Asset Uptime</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-2xl lg:text-3xl font-black text-purple-300 font-mono">99.98%</h3>
          <p className="text-[10px] font-mono text-slate-400">Zero service disruptions</p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 1: LIVE DIRECTIVE-TO-SCADA SENSOR CORRELATION        */}
      {/* ============================================================ */}
      <div className="p-6 rounded-3xl bg-[#091126] border border-[#17254A] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#17254A] pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Live Ingested Directives Correlated with SCADA Station Sensors
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              The AI engine matches written safety circulars with live physical station telemetry to verify compliance
            </p>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
            LIVE SCADA STREAM ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LIVE_SCADA_FEEDS.map((feed, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border space-y-2.5 transition-all ${
                feed.status === 'WARNING'
                  ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                  : 'bg-[#0D1836] border-[#1A2C54] hover:border-cyan-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono">
                  {feed.station} Station
                </span>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    feed.status === 'WARNING'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {feed.status}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Subsystem:</span>
                <span className="text-xs font-semibold text-slate-200">{feed.subsystem}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-black/60 border border-[#1A2C54] flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[9px] text-slate-400 block">{feed.sensor}</span>
                  <span className="text-sm font-bold text-cyan-300">{feed.value}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 block">Safe Range</span>
                  <span className="text-[11px] text-slate-300">{feed.nominalRange}</span>
                </div>
              </div>

              <div className="pt-1.5 border-t border-[#1A2C54] space-y-1 text-[11px]">
                <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase block">
                  Matched Directive:
                </span>
                <p className="text-slate-300 line-clamp-1">{feed.matchedDirective}</p>
                <p className="text-[10px] text-emerald-400/90 font-mono leading-tight">
                  ↳ {feed.interlockAction}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: AUTONOMOUS SAFETY INTERLOCKING DECISION CONTROLS  */}
      {/* ============================================================ */}
      <div className="p-6 rounded-3xl bg-[#091126] border border-[#17254A] shadow-xl space-y-4">
        <div className="border-b border-[#17254A] pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Autonomous SCADA Interlocking & Safety Decision Simulator
          </h3>
          <p className="text-[11px] text-slate-400 font-mono">
            Execute automated supervisory overrides based on real-time statutory threshold violations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Interlock 1: Temporary Speed Restriction */}
          <div className="p-4 rounded-2xl bg-[#0D1836] border border-[#1A2C54] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono">Corridor Speed (TSR)</span>
              <span
                className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  interlockTSR
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {interlockTSR ? '40 km/h RESTRICTED' : 'NORMAL 80 km/h'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Auto-imposes 40 km/h speed advisory at Aluva viaduct if accelerometer track vibration exceeds 0.05g.
            </p>
            <button
              onClick={() => setInterlockTSR(!interlockTSR)}
              className={`w-full py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                interlockTSR
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'bg-[#14234C] text-slate-300 hover:text-white'
              }`}
            >
              {interlockTSR ? 'Release Speed Restriction' : 'Simulate 40 km/h Restriction'}
            </button>
          </div>

          {/* Interlock 2: Tunnel Booster Fans */}
          <div className="p-4 rounded-2xl bg-[#0D1836] border border-[#1A2C54] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono">Tunnel Ventilation</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {interlockVentilation ? 'BOOSTER AUTO (ON)' : 'STANDBY'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Auto-activates Kaloor underground emergency smoke dampers and booster fans when airflow drops below 135 Pa.
            </p>
            <button
              onClick={() => setInterlockVentilation(!interlockVentilation)}
              className="w-full py-1.5 rounded-xl bg-[#14234C] text-slate-300 hover:text-white text-xs font-mono font-bold transition-all"
            >
              {interlockVentilation ? 'Cycle Ventilation Off' : 'Engage Full Booster Flow'}
            </button>
          </div>

          {/* Interlock 3: Sump Pump Flooding Protection */}
          <div className="p-4 rounded-2xl bg-[#0D1836] border border-[#1A2C54] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono">Sump Flood Override</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {interlockSumpPumps ? 'DUAL RUN ACTIVE' : 'SINGLE PUMP'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Engages secondary auxiliary submersible pump at Muttom Depot when monsoon pit depth exceeds 75mm limit.
            </p>
            <button
              onClick={() => setInterlockSumpPumps(!interlockSumpPumps)}
              className="w-full py-1.5 rounded-xl bg-[#14234C] text-slate-300 hover:text-white text-xs font-mono font-bold transition-all"
            >
              Toggle Secondary Pump
            </button>
          </div>

          {/* Interlock 4: Emergency Traction Power Isolation */}
          <div className="p-4 rounded-2xl bg-[#0D1836] border border-[#1A2C54] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono">25kV Traction Trip</span>
              <span
                className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  interlockTractionHalt
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {interlockTractionHalt ? 'POWER TRIPPED' : '25kV ENERGIZED'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Instant SCADA interlock to trip catenary feeder circuit breaker in event of confirmed track obstruction.
            </p>
            <button
              onClick={() => setInterlockTractionHalt(!interlockTractionHalt)}
              className={`w-full py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                interlockTractionHalt
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/30'
              }`}
            >
              {interlockTractionHalt ? 'Re-Energize Feeder' : 'Simulate Emergency Trip'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
