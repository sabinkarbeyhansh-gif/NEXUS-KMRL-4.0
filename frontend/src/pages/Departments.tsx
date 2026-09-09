import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users2,
  Shield,
  Wrench,
  Activity,
  DollarSign,
  UserCheck,
  Scale,
  ShoppingCart,
  HardHat,
  ArrowRight,
  FileText,
  ClipboardList,
  Flame,
} from 'lucide-react';
import { DepartmentName } from '../types';

export const Departments: React.FC = () => {
  const navigate = useNavigate();

  const deptList: {
    name: DepartmentName;
    head: string;
    icon: any;
    color: string;
    docs: number;
    actions: number;
    criticalRisks: number;
    compliance: string;
    description: string;
    personnel: string[];
  }[] = [
    {
      name: 'Safety',
      head: 'K. S. Narayanan (General Manager)',
      icon: Shield,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      docs: 42,
      actions: 11,
      criticalRisks: 5,
      compliance: '98.8%',
      description: 'Oversees statutory passenger safety, CMRS circle certifications, fire hydrant networks, and emergency evacuation rosters.',
      personnel: ['K. S. Narayanan (GM)', 'S. Pradeep (Chief Inspector)', 'Anitha Nair (Fire Officer)'],
    },
    {
      name: 'Engineering',
      head: 'Anand Varma (Chief Track & Traction Engineer)',
      icon: Wrench,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      docs: 35,
      actions: 8,
      criticalRisks: 3,
      compliance: '96.4%',
      description: 'Responsible for 25kV catenary traction lines, track geometry alignment, viaduct structures, and signaling interlocks.',
      personnel: ['Anand Varma (Chief Eng)', 'Vinod Krishnan (Structural)', 'Mathew Thomas (Signaling)'],
    },
    {
      name: 'Maintenance',
      head: 'Rajesh Kumar Nair (Depot Superintendent)',
      icon: HardHat,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      docs: 38,
      actions: 9,
      criticalRisks: 3,
      compliance: '97.2%',
      description: 'Maintains Alstom Metropolis trainsets, heavy bogie overhauls, Muttom Depot stabling bays, and diagnostic test tracks.',
      personnel: ['Rajesh Kumar Nair (Supdt)', 'Harikumar P. (Brake Mech)', 'Vipin Das (Electrical)'],
    },
    {
      name: 'Operations',
      head: 'Geetha P. (Operations Control Center Lead)',
      icon: Activity,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      docs: 28,
      actions: 6,
      criticalRisks: 1,
      compliance: '99.1%',
      description: 'Coordinates passenger station controllers, Automatic Train Operation (ATO) dispatch, and ticketing escalator maintenance.',
      personnel: ['Geetha P. (OCC Lead)', 'Deepa Menon (Station Controller)', 'Suresh Babu (Duty Mgr)'],
    },
    {
      name: 'Finance',
      head: 'Lakshmi Nair (Finance Controller)',
      icon: DollarSign,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      docs: 18,
      actions: 4,
      criticalRisks: 0,
      compliance: '95.0%',
      description: 'Manages station commercial retail leases, non-fare revenues, escrow accounts, and vendor bank guarantee escrow monitoring.',
      personnel: ['Lakshmi Nair (Controller)', 'Rohan George (Revenue Auditor)'],
    },
    {
      name: 'Procurement',
      head: 'M. Haridas (Chief Procurement Officer)',
      icon: ShoppingCart,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      docs: 14,
      actions: 3,
      criticalRisks: 0,
      compliance: '100%',
      description: 'Executes global and national e-tenders for rail turnouts, heavy machinery, power electronics, and replacement parts.',
      personnel: ['M. Haridas (CPO)', 'Kavitha R. (Tender Analyst)'],
    },
    {
      name: 'Legal',
      head: 'Adv. Premkumar (Legal Counsel)',
      icon: Scale,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      docs: 11,
      actions: 2,
      criticalRisks: 0,
      compliance: '100%',
      description: 'Arbitrates vendor contract SLAs, statutory compliance with Metro Railways Act 2002, and land acquisition agreements.',
      personnel: ['Adv. Premkumar (Counsel)', 'Nidhin Joy (Legal Officer)'],
    },
    {
      name: 'HR',
      head: 'Sunita Menon (Director Personnel)',
      icon: UserCheck,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
      docs: 9,
      actions: 2,
      criticalRisks: 0,
      compliance: '100%',
      description: 'Station staff rosters, technical safety certifications for loco pilots, and multilingual training modules.',
      personnel: ['Sunita Menon (HR Director)', 'Ajay Mohan (Training Mgr)'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Users2 className="w-6 h-6 text-cyan-400" />
          KMRL Directorates & Operational Divisions
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Organizational hierarchy, personnel rosters, active workloads, and compliance records
        </p>
      </div>

      {/* Directorate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {deptList.map((dept) => {
          const Icon = dept.icon;
          return (
            <div
              key={dept.name}
              className="p-6 rounded-3xl bg-[#0D1526] border border-[#1E2D4A] hover:border-cyan-500/40 transition-all space-y-4 shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl border ${dept.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{dept.name} Directorate</h3>
                    <p className="text-xs text-slate-400 font-mono">{dept.head}</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
                  {dept.compliance}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{dept.description}</p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2 rounded-xl bg-[#070B14] border border-[#1E2D4A]">
                  <span className="text-[10px] text-slate-400 block">DOCUMENTS</span>
                  <span className="text-white font-bold">{dept.docs}</span>
                </div>
                <div className="p-2 rounded-xl bg-[#070B14] border border-[#1E2D4A]">
                  <span className="text-[10px] text-slate-400 block">OPEN ACTIONS</span>
                  <span className="text-amber-400 font-bold">{dept.actions}</span>
                </div>
                <div className="p-2 rounded-xl bg-[#070B14] border border-[#1E2D4A]">
                  <span className="text-[10px] text-slate-400 block">CRITICAL RISKS</span>
                  <span className="text-rose-400 font-bold">{dept.criticalRisks}</span>
                </div>
              </div>

              {/* Key Personnel */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Key Personnel:</span>
                <div className="flex flex-wrap gap-1.5">
                  {dept.personnel.map((person, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2.5 py-0.5 rounded-lg bg-[#131E35] text-slate-300 border border-[#1E2D4A]"
                    >
                      {person}
                    </span>
                  ))}
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="pt-2 border-t border-[#1E2D4A] flex justify-between">
                <button
                  onClick={() => navigate(`/documents?dept=${dept.name}`)}
                  className="text-xs text-cyan-400 hover:underline font-semibold flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  View Department Documents
                </button>
                <button
                  onClick={() => navigate('/actions')}
                  className="text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1"
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  View Open Tasks
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
