import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  FileText,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useData } from '../contexts/DataContext';

export const Analytics: React.FC = () => {
  const { documents, tasks, risks } = useData();
  const [timeRange, setTimeRange] = useState<string>('30d');

  // Priority breakdown data
  const priorityData = [
    { name: 'CRITICAL', count: 12, color: '#EF4444' },
    { name: 'HIGH', count: 48, color: '#F59E0B' },
    { name: 'MEDIUM', count: 142, color: '#38BDF8' },
    { name: 'LOW', count: 680, color: '#10B981' },
    { name: 'INFORMATIONAL', count: 402, color: '#6366F1' },
  ];

  // Language breakdown data
  const languageData = [
    { name: 'English', count: 850, color: '#00D2FF' },
    { name: 'Malayalam', count: 320, color: '#10B981' },
    { name: 'Bilingual (EN/ML)', count: 94, color: '#F59E0B' },
    { name: 'Hindi', count: 20, color: '#A855F7' },
  ];

  // Monthly document ingestion trend
  const ingestionTrend = [
    { month: 'Apr', docs: 120, tasks: 45 },
    { month: 'May', docs: 180, tasks: 72 },
    { month: 'Jun', docs: 240, tasks: 98 },
    { month: 'Jul', docs: 310, tasks: 130 },
    { month: 'Aug', docs: 290, tasks: 115 },
    { month: 'Sep', docs: 360, tasks: 142 },
  ];

  // Department Workload & Compliance Data
  const deptComplianceData = [
    { department: 'Safety', total: 42, completed: 31, compliance: '74%' },
    { department: 'Maintenance', total: 38, completed: 29, compliance: '76%' },
    { department: 'Engineering', total: 35, completed: 30, compliance: '85%' },
    { department: 'Operations', total: 28, completed: 26, compliance: '92%' },
    { department: 'Finance', total: 18, completed: 17, compliance: '94%' },
    { department: 'Procurement', total: 14, completed: 14, compliance: '100%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            Operational Analytics & Intelligence Metrics
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Comprehensive reporting on document volume, compliance, and department throughput
          </p>
        </div>

        {/* Time Range Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0D1526] border border-[#1E2D4A] rounded-2xl text-xs font-mono">
          {['today', '7d', '30d', '90d'].map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1 rounded-xl uppercase transition-colors ${
                timeRange === r
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0D1526] border border-[#1E2D4A] space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">AI Processing Volume</span>
          <h3 className="text-2xl font-black text-white">1,147</h3>
          <p className="text-[10px] font-mono text-cyan-400">Average 4.2 sec per doc</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D1526] border border-[#1E2D4A] space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Statutory Compliance</span>
          <h3 className="text-2xl font-black text-emerald-400">98.4%</h3>
          <p className="text-[10px] font-mono text-slate-400">Zero safety lapses</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D1526] border border-[#1E2D4A] space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Actions Dispatched</span>
          <h3 className="text-2xl font-black text-amber-400">983</h3>
          <p className="text-[10px] font-mono text-slate-400">936 verified closed</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D1526] border border-[#1E2D4A] space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">OCR Accuracy Score</span>
          <h3 className="text-2xl font-black text-cyan-400">99.1%</h3>
          <p className="text-[10px] font-mono text-slate-400">Multilingual EN/ML/HI</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingestion & Task Trend Line Chart */}
        <div className="p-6 rounded-3xl bg-[#0D1526] border border-[#1E2D4A] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Document Ingestion & Automated Task Dispatch
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Last 6 Months</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ingestionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D1526',
                    borderColor: '#1E2D4A',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="docs" name="Documents Ingested" stroke="#00D2FF" strokeWidth={3} />
                <Line type="monotone" dataKey="tasks" name="Tasks Dispatched" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Distribution Pie Chart */}
        <div className="p-6 rounded-3xl bg-[#0D1526] border border-[#1E2D4A] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              Document Priority Distribution
            </h3>
            <span className="text-[10px] font-mono text-slate-400">1,284 Indexed</span>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D1526',
                    borderColor: '#1E2D4A',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Compliance Table */}
      <div className="p-6 rounded-3xl bg-[#0D1526] border border-[#1E2D4A] space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3">
          <h3 className="text-sm font-bold text-white">Department Action Compliance Audit</h3>
          <span className="text-xs font-mono text-slate-400">Statutory Targets</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1E2D4A] text-[10px] font-mono text-slate-400 uppercase">
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Total Assigned</th>
                <th className="py-2.5 px-3">Completed / Verified</th>
                <th className="py-2.5 px-3">Compliance Rate</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2D4A]/50 font-mono">
              {deptComplianceData.map((d) => (
                <tr key={d.department} className="hover:bg-[#131E35]/40">
                  <td className="py-3 px-3 font-bold text-white font-sans">{d.department}</td>
                  <td className="py-3 px-3 text-slate-300">{d.total} actions</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">{d.completed} signed off</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-[#070B14] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-400"
                          style={{ width: d.compliance }}
                        ></div>
                      </div>
                      <span className="text-cyan-300">{d.compliance}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/30">
                      ON TRACK
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
