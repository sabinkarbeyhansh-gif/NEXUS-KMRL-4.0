import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  BrainCircuit,
  Network,
  AlertTriangle,
  ClipboardList,
  CalendarClock,
  Search,
  Mic,
  Globe,
  BarChart3,
  Users2,
  Cloud,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Sparkles,
  History,
  Scale,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, setMobileOpen }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const { t } = useLanguage();
  const { currentUser, setRole } = useAuth();
  const { risks } = useData();
  const navigate = useNavigate();

  const criticalRisksCount = risks.filter((r) => r.severity === 'CRITICAL').length;

  const navSections = [
    {
      title: 'OPERATIONAL COMMAND',
      items: [
        { path: '/', label: t.nav.overview, icon: LayoutDashboard, iconColor: 'text-cyan-400' },
        { path: '/documents', label: t.nav.documents, icon: FileText, badge: '30+', badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', iconColor: 'text-blue-400' },
        { path: '/actions', label: t.nav.actionCenter, icon: ClipboardList, badge: '15', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40', iconColor: 'text-amber-400' },
        { path: '/deadlines', label: t.nav.deadlines, icon: CalendarClock, iconColor: 'text-orange-400' },
      ],
    },
    {
      title: 'AI & KNOWLEDGE GRAPH',
      items: [
        { path: '/graph', label: t.nav.knowledgeGraph, icon: Network, highlight: true, iconColor: 'text-cyan-400' },
        { path: '/intelligence', label: 'SCADA Safety Hub', icon: BrainCircuit, badge: 'SCADA', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', iconColor: 'text-cyan-400' },
        { path: '/conflicts', label: 'Regulatory Matrix', icon: Scale, badge: 'CMRS', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40', iconColor: 'text-amber-400' },
        {
          path: '/risks',
          label: t.nav.riskRadar,
          icon: AlertTriangle,
          badge: criticalRisksCount > 0 ? `${criticalRisksCount}` : undefined,
          badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
          iconColor: 'text-red-400',
        },
        { path: '/search', label: t.nav.aiSearch, icon: Search, iconColor: 'text-sky-400' },
        { path: '/voice', label: t.nav.voiceGuide, icon: Mic, iconColor: 'text-amber-300' },
      ],
    },
    {
      title: 'METRO GOVERNANCE',
      items: [
        { path: '/analytics', label: t.nav.analytics, icon: BarChart3, iconColor: 'text-emerald-400' },
        { path: '/departments', label: t.nav.departments, icon: Users2, iconColor: 'text-indigo-400' },
        { path: '/storage', label: t.nav.cloudStorage, icon: Cloud, iconColor: 'text-cyan-400' },
        { path: '/audit', label: 'Audit Trail', icon: History, iconColor: 'text-teal-400' },
        { path: '/language', label: t.nav.language, icon: Globe, iconColor: 'text-blue-300' },
        { path: '/settings', label: t.nav.settings, icon: Settings, iconColor: 'text-slate-400' },
      ],
    },
  ];

  const handleNavClick = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col transition-all duration-200 ease-in-out border-r border-[#1B2A50] bg-[#0A122A] ${
        collapsed ? 'w-20' : 'w-64'
      } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#1B2A50] bg-[#080E24]">
        <div
          onClick={() => {
            navigate('/');
            handleNavClick();
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="font-extrabold text-base tracking-wide text-white flex items-center gap-1.5">
                KMRL <span className="text-cyan-400">NEXUS</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </span>
              <span className="text-[10px] text-cyan-300/80 font-mono tracking-wider truncate uppercase">
                Operations Center
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#132042] transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-5 h-5 text-cyan-400" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <div className="px-3 pb-1 pt-1 text-[10px] font-bold text-cyan-400/90 tracking-wider uppercase font-mono">
                {section.title}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/25 to-blue-600/10 text-white border-l-4 border-cyan-400 shadow-md shadow-cyan-500/10'
                        : 'text-slate-300 hover:text-white hover:bg-[#132042]'
                    } ${item.highlight && !collapsed ? 'ring-1 ring-cyan-500/40 text-cyan-200' : ''}`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-4.5 h-4.5 ${item.iconColor} shrink-0 group-hover:scale-110 transition-transform`} />

                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between truncate">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold border ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {item.highlight && !item.badge && (
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      )}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* User Profile & Role Footer */}
      <div className="p-3 border-t border-[#1B2A50] bg-[#080E24]">
        {!collapsed ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full border-2 border-cyan-400 object-cover shadow-sm"
              />
              <div className="truncate flex-1">
                <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                <p className="text-[10px] text-cyan-300 font-medium truncate">
                  {currentUser.designation || `${currentUser.role} • ${currentUser.department}`}
                </p>
              </div>
            </div>

            {/* All 5 Role Switcher Pills */}
            <div className="pt-1 space-y-1">
              <span className="text-[9px] font-mono text-slate-400 block font-bold uppercase">
                Active Operational Role:
              </span>
              <div className="grid grid-cols-5 gap-1">
                {(['ADMIN', 'MANAGER', 'OFFICER', 'AUDITOR', 'VIEWER'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    title={`Switch identity to ${r}`}
                    className={`text-[9px] py-1 px-0.5 rounded font-mono font-bold transition-all text-center ${
                      currentUser.role === r
                        ? r === 'ADMIN'
                          ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                          : r === 'MANAGER'
                          ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                          : r === 'OFFICER'
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                          : r === 'AUDITOR'
                          ? 'bg-purple-500 text-white font-black shadow-sm'
                          : 'bg-sky-500 text-slate-950 font-black shadow-sm'
                        : 'bg-[#132042] text-slate-400 hover:text-white'
                    }`}
                  >
                    {r.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full border-2 border-cyan-500/60 object-cover cursor-pointer"
              title={`${currentUser.name} (${currentUser.role})`}
            />
          </div>
        )}
      </div>
    </aside>
  );
};
