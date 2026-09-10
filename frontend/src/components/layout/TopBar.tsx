import React, { useState, useEffect, useRef } from 'react';
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
  ShieldCheck,
  ChevronDown,
  Check,
  UserCheck,
  Sparkles,
  Command,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatISTTime, formatISTDate } from '../../utils/dateTime';
import { useNavigate } from 'react-router-dom';
import { LanguageCode, UserRole } from '../../types';

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
  const { language, setLanguage } = useLanguage();
  const { currentUser, currentProfile, setRole, allProfiles } = useAuth();
  const {
    aiStatus,
    notifications,
    markNotificationAsRead,
    isProcessingDemo,
    runGuidedDemoScenario,
  } = useData();

  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showRoleMenu, setShowRoleMenu] = useState<boolean>(false);
  const [showLangMenu, setShowLangMenu] = useState<boolean>(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const roleMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  // Dynamic live clock in IST
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle click outside to close popovers cleanly
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        roleMenuRef.current &&
        !roleMenuRef.current.contains(event.target as Node)
      ) {
        setShowRoleMenu(false);
      }
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(event.target as Node)
      ) {
        setShowLangMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifications = notifications.filter((n) => !n.read);

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'EN' },
    { code: 'ml', label: 'മലയാളം', native: 'ML' },
    { code: 'hi', label: 'हिन्दी', native: 'HI' },
  ];

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'MANAGER':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'OFFICER':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'AUDITOR':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'VIEWER':
      default:
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#080E24]/95 backdrop-blur-md border-b border-[#1A2C54] px-3 md:px-5 flex items-center justify-between shadow-lg">
      {/* ============================================================ */}
      {/* 1. LEFT ZONE: Mobile Toggle + Clean Live IST Telemetry + Search */}
      {/* ============================================================ */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Mobile Menu Button */}
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#132042] transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Live IST Telemetry Capsule */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0D1836] border border-cyan-500/20 text-xs font-mono shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-white font-bold tracking-tight">
            {formatISTTime(currentDateTime)}
          </span>
          <span className="text-[10px] text-cyan-400 font-bold px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-800/50">
            IST
          </span>
          <span className="hidden xl:inline text-[11px] text-slate-400 font-sans border-l border-[#1E325C] pl-2">
            KMRL OCC Live
          </span>
        </div>

        {/* Global Search Pill Trigger */}
        <button
          onClick={() => navigate('/search')}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D1836] hover:bg-[#14234C] border border-[#1A2C54] hover:border-cyan-500/30 text-xs text-slate-300 hover:text-white transition-all group"
          title="Search directives, stations, assets (Press ⌘K)"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="text-slate-400 group-hover:text-slate-200">Search directives...</span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] font-mono bg-[#14234C] px-1.5 py-0.5 rounded text-cyan-300 border border-cyan-500/20 ml-2">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>
      </div>

      {/* ============================================================ */}
      {/* 2. CENTER ZONE: Minimalist AI Provider Telemetry               */}
      {/* ============================================================ */}
      <div className="hidden 2xl:flex items-center">
        <button
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1836]/70 hover:bg-[#14234C] border border-purple-500/30 text-xs text-purple-200 transition-colors"
          title="Click to configure AI Engine (Gemini 1.5 Pro / Neural OCR)"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span className="font-mono text-[11px] font-semibold">
            {aiStatus.provider} • Neural Engine
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </button>
      </div>

      {/* ============================================================ */}
      {/* 3. RIGHT ZONE: Grouped Precision Controls & Officer Switcher */}
      {/* ============================================================ */}
      <div className="flex items-center gap-2 md:gap-2.5">
        {/* Live Demo Trigger (High-Visibility Amber Action Pill) */}
        <button
          onClick={onOpenDemoModal || runGuidedDemoScenario}
          disabled={isProcessingDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-extrabold shadow-sm hover:shadow-amber-500/25 transition-all active:scale-95 disabled:opacity-50"
          title="Run 13-step document OCR, AI classification & task generation demo"
        >
          <Play className="w-3 h-3 fill-current text-slate-950" />
          <span className="hidden sm:inline">
            {isProcessingDemo ? 'Running...' : 'Live Demo'}
          </span>
          <span className="text-[10px] bg-black/20 text-slate-950 px-1.5 py-0.2 rounded-full font-mono font-black">
            13
          </span>
        </button>

        {/* Unified Quick Tools Toolbar (Camera Scanner + Voice Speech Guide) */}
        <div className="flex items-center bg-[#0D1836] border border-[#1A2C54] rounded-lg p-0.5 shadow-xs">
          <button
            onClick={onOpenScannerModal || (() => navigate('/scanner'))}
            className="p-1.5 rounded-md text-cyan-400 hover:text-cyan-200 hover:bg-cyan-500/20 transition-colors"
            title="Camera Document Scanner (2K OCR)"
            aria-label="Scan Document"
          >
            <Camera className="w-4 h-4" />
          </button>
          <div className="w-px h-3.5 bg-[#1A2C54] mx-0.5" />
          <button
            onClick={onOpenVoiceModal || (() => navigate('/voice'))}
            className="p-1.5 rounded-md text-amber-400 hover:text-amber-200 hover:bg-amber-500/20 transition-colors relative"
            title="NEXUS Voice Speech Assistant"
            aria-label="Open Voice Assistant"
          >
            <Mic className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          </button>
        </div>

        {/* Multilingual Selector (Clean Popover) */}
        <div className="relative" ref={langMenuRef}>
          <button
            onClick={() => {
              setShowLangMenu(!showLangMenu);
              setShowRoleMenu(false);
              setShowNotifications(false);
            }}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[#0D1836] hover:bg-[#14234C] border border-[#1A2C54] hover:border-cyan-500/30 text-xs text-slate-200 transition-colors shadow-xs"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold font-mono text-[11px] uppercase">
              {currentLangObj.native}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl bg-[#0B1533] border border-[#1E325C] shadow-2xl z-50 p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-[#1E325C]/60 mb-1">
                Select Language
              </div>
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    language === l.code
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-[#14234C] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-[#132042] text-slate-400">
                      {l.native}
                    </span>
                    <span>{l.label}</span>
                  </div>
                  {language === l.code && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Operational Alerts Bell with Popover Drawer */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRoleMenu(false);
              setShowLangMenu(false);
            }}
            className="p-1.5 rounded-lg bg-[#0D1836] hover:bg-rose-500/20 border border-[#1A2C54] hover:border-rose-500/40 text-slate-300 hover:text-white transition-colors relative shadow-xs"
            title="Operational Notifications"
            aria-label="View Operational Alerts"
          >
            <Bell className="w-4 h-4 text-cyan-400" />
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[9px] font-extrabold animate-pulse shadow-sm shadow-rose-500/50">
                {unreadNotifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-2xl bg-[#0B1533] border border-[#1E325C] shadow-2xl z-50 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between border-b border-[#1E325C] pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  Operational Notifications
                </span>
                <span className="text-[10px] text-cyan-400 font-mono font-bold">
                  {unreadNotifications.length} unread
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
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
                      <span>
                        {new Date(n.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        IST
                      </span>
                      <span className="text-cyan-400 flex items-center gap-0.5 font-semibold">
                        Inspect <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#1E325C] flex justify-between items-center">
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

        {/* Vertical Divider */}
        <div className="hidden sm:block w-px h-5 bg-[#1A2C54]" />

        {/* ============================================================ */}
        {/* 4. Active KMRL Persona / Officer Switcher Dropdown           */}
        {/* ============================================================ */}
        <div className="relative" ref={roleMenuRef}>
          <button
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowNotifications(false);
              setShowLangMenu(false);
            }}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg bg-[#0D1836] hover:bg-[#14234C] border border-[#1A2C54] hover:border-cyan-500/40 transition-all shadow-xs group"
            title={`Active Persona: ${currentUser.name} (${currentProfile.badge}) - Click to switch role`}
          >
            <div className="relative shrink-0">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-cyan-500/50 group-hover:border-cyan-400"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#080E24]" />
            </div>

            <div className="hidden lg:flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white leading-tight">
                  {currentUser.name.split(' ')[0]} {currentUser.name.split(' ')[1] || ''}
                </span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold border ${getRoleBadgeStyle(
                    currentUser.role
                  )}`}
                >
                  {currentUser.role}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 leading-none truncate max-w-[120px]">
                {currentProfile.badge}
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors ml-0.5" />
          </button>

          {/* Interactive KMRL Persona Switcher Popover */}
          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-2xl bg-[#0B1533] border border-[#1E325C] shadow-2xl z-50 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-100">
              {/* Header: Active Persona Card */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0E1B3E] border border-cyan-500/30">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate">
                      {currentUser.name}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold border ${getRoleBadgeStyle(
                        currentUser.role
                      )}`}
                    >
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-cyan-300 font-medium truncate mt-0.5">
                    {currentProfile.designation}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    Dept: {currentUser.department} • {currentUser.email}
                  </p>
                </div>
              </div>

              {/* Roles Section Header */}
              <div className="flex items-center justify-between border-b border-[#1E325C] pb-1.5 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Instant Role Delegation (1-Click)
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">
                  Zero Delays
                </span>
              </div>

              {/* All 5 KMRL Officer Cards */}
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {allProfiles.map((p) => {
                  const isActive = currentUser.role === p.role;
                  return (
                    <button
                      key={p.role}
                      onClick={() => {
                        setRole(p.role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                        isActive
                          ? 'bg-cyan-500/15 border border-cyan-500/40 shadow-xs'
                          : 'bg-[#0E1834]/70 hover:bg-[#132042] border border-transparent hover:border-[#1E325C]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={p.avatarUrl}
                          alt={p.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-700"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-xs font-bold truncate ${
                                isActive ? 'text-white' : 'text-slate-300'
                              }`}
                            >
                              {p.name}
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold border ${getRoleBadgeStyle(
                                p.role
                              )}`}
                            >
                              {p.role}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {p.badge} ({p.department})
                          </p>
                        </div>
                      </div>

                      {isActive ? (
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 ml-2" />
                      ) : (
                        <span className="text-[10px] text-slate-500 hover:text-cyan-400 font-mono shrink-0 ml-2">
                          Switch
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Footer Notice */}
              <div className="pt-2 border-t border-[#1E325C] flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  Role-based access matrix active
                </span>
                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowRoleMenu(false);
                  }}
                  className="text-cyan-400 hover:underline font-semibold"
                >
                  Permissions Matrix →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
