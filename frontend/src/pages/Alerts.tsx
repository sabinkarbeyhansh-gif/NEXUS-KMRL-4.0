import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Info,
  Radio,
  ExternalLink,
  CheckCheck,
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { formatISTFull } from '../utils/dateTime';

export const Alerts: React.FC = () => {
  const { notifications, markNotificationAsRead } = useData();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'UNREAD') return !n.read;
    if (activeFilter === 'CRITICAL') return n.type === 'CRITICAL';
    if (activeFilter === 'WARNING') return n.type === 'WARNING';
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'CRITICAL':
        return <Flame className="w-5 h-5 text-rose-500" />;
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'SUCCESS':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'INFO':
      default:
        return <Info className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-cyan-400" />
            Operational Alert & Notification Center
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Real-time event stream from document intake, AI classifiers, conflict detectors and deadline engines
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2">
          {[
            { id: 'ALL', label: 'All Alerts' },
            { id: 'UNREAD', label: 'Unread Only' },
            { id: 'CRITICAL', label: 'Critical' },
            { id: 'WARNING', label: 'Warnings' },
          ].map((flt) => (
            <button
              key={flt.id}
              onClick={() => setActiveFilter(flt.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-colors ${
                activeFilter === flt.id
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'bg-[#0D1526] hover:bg-[#131E35] text-slate-300 border border-[#1E2D4A]'
              }`}
            >
              {flt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications Feed */}
      <div className="rounded-3xl bg-[#0D1526] border border-[#1E2D4A] p-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3 text-xs">
          <span className="text-slate-400 font-mono">
            Showing {filtered.length} notifications ({notifications.filter((n) => !n.read).length} unread)
          </span>
          <button
            onClick={() => notifications.forEach((n) => markNotificationAsRead(n.id))}
            className="text-cyan-400 hover:underline font-mono flex items-center gap-1 font-semibold"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All as Read
          </button>
        </div>

        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                markNotificationAsRead(item.id);
                if (item.linkTo) navigate(item.linkTo);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                !item.read
                  ? 'bg-cyan-500/10 border-cyan-500/40 shadow-md'
                  : 'bg-[#131E35]/40 border-[#1E2D4A] opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="p-2.5 rounded-xl bg-[#070B14] border border-[#1E2D4A] shrink-0">
                  {getNotificationIcon(item.type)}
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                        item.type === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300'
                          : item.type === 'WARNING'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-cyan-500/20 text-cyan-300'
                      }`}
                    >
                      {item.type}
                    </span>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-slate-300">{item.message}</p>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between gap-2 shrink-0 text-right">
                <span className="text-[10px] font-mono text-slate-400">
                  {formatISTFull(item.timestamp)}
                </span>
                {item.linkTo && (
                  <span className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1">
                    Inspect Record <ExternalLink className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
