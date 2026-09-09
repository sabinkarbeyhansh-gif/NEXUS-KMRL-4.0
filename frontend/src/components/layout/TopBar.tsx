import React, { useState, useEffect } from 'react';
import {
  Bell,
  Play,
  Menu,
  Globe,
  Radio,
  ExternalLink,
  Camera,
  Mic,
  Cpu,
  Search,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import { formatISTFull } from '../../utils/dateTime';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  onOpenMobileMenu?: () => void;
  onOpenVoiceModal?: () => void;
  onOpenScannerModal?: () => void;
  onOpenDemoModal?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenMobileMenu,
  onOpenVoiceModal,
  onOpenScannerModal,
  onOpenDemoModal,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const {
    aiStatus,
    notifications,
    markNotificationAsRead,
    isProcessingDemo,
    runGuidedDemoScenario,
  } = useData();

  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const navigate = useNavigate();

  // Dynamic live clock in IST
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0B1533] border-b border-[#1E325C] px-4 md:px-6 flex items-center justify-between shadow-lg">
      {/* Left: Mobile Menu, Live Status & Clock */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#132042]"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Live IST Status Pill with Glowing Badge */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#0E1B3E] border border-cyan-500/40 text-xs font-mono shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0 shadow-sm shadow-emerald-400/50"></span>
          <span className="text-white font-bold tracking-tight">
            {formatISTFull(currentDateTime)}
          </span>
          <span className="hidden lg:inline text-[10px] text-cyan-400 font-sans font-semibold pl-2 border-l border-[#1E325C]">
            SCADA Central Live
          </span>
        </div>

        {/* Global Search Trigger */}
        <button
          onClick={() => navigate('/search')}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0E1B3E] hover:bg-[#162758] border border-[#1E325C] text-xs text-slate-300 hover:text-white transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span>Search directives & stations...</span>
          <kbd className="text-[10px] font-mono bg-[#162758] px-1.5 py-0.5 rounded text-cyan-300 border border-cyan-500/30">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Quick Actions, AI Engine Pill, Notifications, Language, Demo Button */}
      <div className="flex items-center gap-2.5">
        {/* Run Demo Button (High-Visibility Amber/Orange) */}
        <button
          onClick={onOpenDemoModal || runGuidedDemoScenario}
          disabled={isProcessingDemo}
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-500/25 transition-all disabled:opacity-50"
          title="Run 13-step document OCR, AI classification & task generation demo"
        >
          <Play className="w-3.5 h-3.5 fill-current text-slate-950" />
          <span>{isProcessingDemo ? 'Executing...' : 'Run 13-Step Live Demo'}</span>
        </button>

        {/* Camera Scanner Trigger */}
        <button
          onClick={onOpenScannerModal || (() => navigate('/scanner'))}
          className="p-2 rounded-xl bg-[#0E1B3E] hover:bg-cyan-500/20 border border-[#1E325C] hover:border-cyan-500/40 text-cyan-400 transition-colors shadow-xs"
          title="Scan Document with Camera (2K Target)"
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* Voice Assistant Trigger */}
        <button
          onClick={onOpenVoiceModal || (() => navigate('/voice'))}
          className="p-2 rounded-xl bg-[#0E1B3E] hover:bg-amber-500/20 border border-[#1E325C] hover:border-amber-500/40 text-amber-400 transition-colors relative shadow-xs"
          title="Open NEXUS VOICE (Speech Guide)"
        >
          <Mic className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
        </button>

        {/* AI Engine Status Pill */}
        <div
          onClick={() => navigate('/settings')}
          className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0E1B3E] border border-[#1E325C] text-xs cursor-pointer hover:border-cyan-500/40 transition-colors"
          title="Click to configure AI Engine"
        >
          <Cpu className="w-4 h-4 text-purple-400" />
          <span className="text-slate-300 text-xs font-mono font-bold">{aiStatus.provider}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
        </div>

        {/* Language Selector */}
        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="appearance-none bg-[#0E1B3E] border border-[#1E325C] hover:border-cyan-500/40 rounded-xl px-3 py-1.5 text-xs text-white font-bold cursor-pointer focus:outline-none pr-7 font-mono shadow-xs"
          >
            <option value="en">English (EN)</option>
            <option value="ml">മലയാളം (ML)</option>
            <option value="hi">हिन्दी (HI)</option>
          </select>
          <Globe className="w-3.5 h-3.5 text-cyan-400 absolute right-2 top-2.5 pointer-events-none" />
        </div>

        {/* Notifications Bell with Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-[#0E1B3E] hover:bg-rose-500/20 border border-[#1E325C] hover:border-rose-500/40 text-slate-300 hover:text-white transition-colors relative shadow-xs"
            title="Operational Alerts"
          >
            <Bell className="w-4 h-4 text-cyan-400" />
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[9px] font-extrabold animate-pulse shadow-sm shadow-rose-500/50">
                {unreadNotifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-2xl bg-[#0E1834] border border-[#1E325C] shadow-2xl z-50 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#1E325C] pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  Operational Notifications
                </span>
                <span className="text-[10px] text-cyan-400 font-mono font-bold">
                  {unreadNotifications.length} unread
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2">
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationAsRead(n.id);
                      if (n.linkTo) navigate(n.linkTo);
                      setShowNotifications(false);
                    }}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                      n.read
                        ? 'bg-[#080E24]/60 border-[#1E325C] text-slate-400'
                        : 'bg-[#132042] border-cyan-500/40 text-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-white line-clamp-1">{n.title}</span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded uppercase font-mono font-bold ${
                          n.type === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : n.type === 'WARNING'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        }`}
                      >
                        {n.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">{n.message}</p>
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#1E325C]/60 text-[10px] text-slate-400">
                      <span>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST</span>
                      <span className="text-cyan-400 flex items-center gap-0.5 font-semibold">
                        Inspect <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#1E325C] flex justify-between">
                <button
                  onClick={() => {
                    navigate('/alerts');
                    setShowNotifications(false);
                  }}
                  className="text-xs text-cyan-400 hover:underline font-bold"
                >
                  View All Alerts →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
