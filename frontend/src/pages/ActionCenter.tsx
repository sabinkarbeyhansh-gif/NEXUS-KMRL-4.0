import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  FileCheck,
  Search,
  Filter,
  Building2,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { PriorityBadge } from '../components/documents/PriorityBadge';
import { EvidenceUploadModal } from '../components/documents/EvidenceUploadModal';
import { formatISTDate, getDeadlineStatus } from '../utils/dateTime';
import { TaskItem, TaskStatus } from '../types';

export const ActionCenter: React.FC = () => {
  const { tasks, updateTaskStatus } = useData();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Evidence modal state
  const [evidenceModalOpen, setEvidenceModalOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  const filteredTasks = tasks.filter((task) => {
    const matchesTab =
      activeTab === 'ALL' ||
      task.status === activeTab ||
      (activeTab === 'OVERDUE' && (task.status === 'OVERDUE' || getDeadlineStatus(task.deadline).isOverdue));

    const matchesDept = selectedDept === 'ALL' || task.department === selectedDept;

    const matchesSearch =
      searchQuery === '' ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.sourceDocumentName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesDept && matchesSearch;
  });

  const handleOpenEvidence = (task: TaskItem) => {
    setSelectedTask(task);
    setEvidenceModalOpen(true);
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'IN_PROGRESS':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'OVERDUE':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse';
      case 'WAITING_APPROVAL':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'PENDING':
      default:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ClipboardList className="w-6 h-6 text-amber-400" />
            Operational Action Center
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            AI-extracted tasks, field responsibilities, and verified completion evidence
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-[#0D1526] border border-[#1E2D4A] text-slate-300">
            Total Actions: <span className="text-white font-bold">{tasks.length}</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            Completed: {tasks.filter((t) => t.status === 'COMPLETED').length}
          </span>
        </div>
      </div>

      {/* Controls & Tab Bar */}
      <div className="p-4 rounded-3xl bg-[#0D1526] border border-[#1E2D4A] shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search actions by task title, ID, officer or document..."
              className="w-full bg-[#070B14] border border-[#1E2D4A] rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-[#070B14] border border-[#1E2D4A] rounded-xl px-3 py-2 text-xs text-slate-200 font-medium focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Departments</option>
            {['Safety', 'Engineering', 'Operations', 'Finance', 'HR', 'Legal', 'Procurement', 'Maintenance'].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 border-t border-[#1E2D4A] pt-3 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'ALL', label: 'All Tasks' },
            { id: 'PENDING', label: 'Pending' },
            { id: 'IN_PROGRESS', label: 'In Progress' },
            { id: 'OVERDUE', label: 'Overdue' },
            { id: 'COMPLETED', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl transition-colors shrink-0 ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#131E35]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards Feed */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const deadline = getDeadlineStatus(task.deadline);
          const isCompleted = task.status === 'COMPLETED';

          return (
            <div
              key={task.id}
              className={`p-5 rounded-2xl border transition-all ${
                isCompleted
                  ? 'bg-[#0D1526]/50 border-emerald-500/30'
                  : deadline.isOverdue
                  ? 'bg-rose-950/20 border-rose-500/50 shadow-md'
                  : 'bg-[#0D1526] border-[#1E2D4A] hover:border-slate-500'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <PriorityBadge priority={task.priority} />
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#070B14] text-cyan-400 border border-[#1E2D4A]">
                      {task.id}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#070B14] text-slate-400 border border-[#1E2D4A]">
                      {task.department}
                    </span>
                    {task.station && (
                      <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {task.station}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm md:text-base font-bold text-white leading-snug">
                    {task.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                    <span>
                      Source:{' '}
                      <button
                        onClick={() => navigate(`/documents/${task.sourceDocumentId}`)}
                        className="text-cyan-400 hover:underline inline-flex items-center gap-0.5 font-sans"
                      >
                        {task.sourceDocumentName} <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    </span>
                    <span>•</span>
                    <span>Assigned: <strong className="text-slate-200">{task.assignedPerson}</strong></span>
                  </div>

                  {/* Evidence Box */}
                  {task.evidenceFileName && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-emerald-400" />
                        <span>Evidence Verified: {task.evidenceFileName}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {formatISTDate(task.evidenceUploadedAt)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right Side: Status, Deadline & Action Buttons */}
                <div className="flex flex-col items-end justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${getStatusBadge(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${deadline.badgeColor}`}
                    >
                      {deadline.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isCompleted ? (
                      <>
                        <button
                          onClick={() => updateTaskStatus(task.id, 'IN_PROGRESS')}
                          className="px-3 py-1.5 rounded-xl bg-[#131E35] hover:bg-[#1E2D4A] text-slate-300 text-xs font-semibold"
                        >
                          Mark In-Progress
                        </button>
                        <button
                          onClick={() => handleOpenEvidence(task)}
                          className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shadow-md transition-all"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Complete with Evidence
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        Signed Off
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Evidence Upload Modal */}
      {selectedTask && (
        <EvidenceUploadModal
          isOpen={evidenceModalOpen}
          taskId={selectedTask.id}
          taskTitle={selectedTask.title}
          onClose={() => setEvidenceModalOpen(false)}
        />
      )}
    </div>
  );
};
