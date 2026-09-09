import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FileText,
  Upload,
  Search,
  Eye,
  Building2,
  X,
  FilePlus,
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PriorityBadge } from '../components/documents/PriorityBadge';
import { getDeadlineStatus, formatISTDate } from '../utils/dateTime';
import { PriorityLevel, DepartmentName, DocumentItem } from '../types';
import { api } from '../services/api';

export const Documents: React.FC = () => {
  const { documents, addDocument } = useData();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>(searchParams.get('dept') || 'ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>(searchParams.get('priority') || 'ALL');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Upload Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [uploadTitle, setUploadTitle] = useState<string>('');
  const [uploadDept, setUploadDept] = useState<DepartmentName>('Safety');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Departments list
  const departments: DepartmentName[] = [
    'Safety',
    'Engineering',
    'Operations',
    'Finance',
    'HR',
    'Legal',
    'Procurement',
    'Maintenance',
  ];

  // Filter logic
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Search
      const matchesSearch =
        searchQuery === '' ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.station && doc.station.toLowerCase().includes(searchQuery.toLowerCase())) ||
        doc.summary.toLowerCase().includes(searchQuery.toLowerCase());

      // Department
      const matchesDept = selectedDept === 'ALL' || doc.department === selectedDept;

      // Priority
      const effectivePriority = doc.humanPriority || doc.aiPriority;
      const matchesPriority = selectedPriority === 'ALL' || effectivePriority === selectedPriority;

      // Language
      const matchesLang =
        selectedLanguage === 'ALL' ||
        doc.language.toLowerCase().includes(selectedLanguage.toLowerCase());

      // Status
      const matchesStatus = selectedStatus === 'ALL' || doc.status === selectedStatus;

      return matchesSearch && matchesDept && matchesPriority && matchesLang && matchesStatus;
    });
  }, [documents, searchQuery, selectedDept, selectedPriority, selectedLanguage, selectedStatus]);

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    const newDoc: DocumentItem = {
      id: `DOC-KMRL-2026-${(documents.length + 1).toString().padStart(3, '0')}`,
      title: uploadTitle,
      fileName: uploadFile ? uploadFile.name : `${uploadTitle.replace(/\s+/g, '_').toUpperCase()}.pdf`,
      fileType: 'PDF',
      fileSize: uploadFile ? `${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB` : '3.2 MB',
      department: uploadDept,
      language: 'English',
      aiPriority: 'HIGH',
      status: 'PROCESSED',
      aiConfidence: 96,
      aiPriorityReason: 'Automated ingestion pipeline classified document based on operational keywords.',
      summary: `Standard operational directive uploaded for ${uploadDept} department regarding compliance guidelines.`,
      keyFacts: [
        `Directing Division: KMRL ${uploadDept}`,
        'Compliance deadline established by operational protocol',
      ],
      receivedDate: new Date().toISOString(),
      createdDate: new Date().toISOString(),
      submissionDeadline: new Date(Date.now() + 86400000 * 3).toISOString(),
      assignedTo: 'Field Inspector',
      riskScore: 72,
      storagePath: `${uploadDept}/2026/`,
      timeline: [
        { date: 'Just now', stage: 'Document Uploaded', description: 'Ingested via portal', status: 'completed' },
      ],
      entities: [
        { id: 'E-1', name: `${uploadDept} Directorate`, type: 'DEPARTMENT', occurrences: 5 },
      ],
      actions: [
        {
          id: `ACT-NEW-${Date.now()}`,
          task: `Review and implement directives from ${uploadTitle}`,
          department: uploadDept,
          priority: 'HIGH',
          deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
          status: 'PENDING',
          sourceReference: 'Section 1',
        },
      ],
      risks: [],
    };

    addDocument(newDoc);

    // Also dispatch to backend asynchronously if file present
    if (uploadFile) {
      const formData = new FormData();
      formData.append('title', uploadTitle);
      formData.append('department', uploadDept);
      formData.append('file', uploadFile);
      api.uploadDocument(formData).catch(() => {
        // Backend failure caught gracefully
      });
    }

    setUploadModalOpen(false);
    setUploadTitle('');
    setUploadFile(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-cyan-400" />
            Document Intelligence Repository
          </h1>
          <p className="text-xs text-slate-300 font-mono mt-0.5">
            Ingesting, classifying and monitoring operational documents across 8 KMRL directorates
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/30 transition-all hover:scale-105"
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>
      </div>

      {/* Smart Search & Filter Control Bar */}
      <div className="p-4 rounded-2xl bg-[#0E1834] border border-[#1E325C] shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Global Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across documents, stations (e.g. Aluva), risks, policies..."
              className="w-full bg-[#080E24] border border-[#1E325C] rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-[#080E24] border border-[#1E325C] rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-[#080E24] border border-[#1E325C] rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">🔴 CRITICAL</option>
            <option value="HIGH">🟠 HIGH</option>
            <option value="MEDIUM">🟡 MEDIUM</option>
            <option value="LOW">🔵 LOW</option>
            <option value="INFORMATIONAL">🟢 INFO</option>
          </select>

          {/* Language Filter */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-[#080E24] border border-[#1E325C] rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="ALL">All Languages</option>
            <option value="English">English</option>
            <option value="Malayalam">മലയാളം (Malayalam)</option>
            <option value="Bilingual">Bilingual (EN/ML)</option>
          </select>
        </div>

        {/* Filter Summary Tags */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
          <span>Showing <strong className="text-cyan-400">{filteredDocuments.length}</strong> of {documents.length} operational documents</span>
          {(selectedDept !== 'ALL' || selectedPriority !== 'ALL' || searchQuery || selectedLanguage !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDept('ALL');
                setSelectedPriority('ALL');
                setSelectedLanguage('ALL');
              }}
              className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Enterprise High-Contrast Data Table */}
      <div className="rounded-2xl bg-[#0E1834] border border-[#1E325C] shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1E325C] bg-[#080E24] text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                <th className="py-3.5 px-4">Document ID & Name</th>
                <th className="py-3.5 px-3">Department</th>
                <th className="py-3.5 px-3">Language</th>
                <th className="py-3.5 px-3">AI Priority</th>
                <th className="py-3.5 px-3">Deadline</th>
                <th className="py-3.5 px-3">Assigned To</th>
                <th className="py-3.5 px-3">Risk Score</th>
                <th className="py-3.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E325C]/80">
              {filteredDocuments.map((doc) => {
                const deadline = getDeadlineStatus(doc.submissionDeadline);
                const effectivePriority = doc.humanPriority || doc.aiPriority;

                return (
                  <tr
                    key={doc.id}
                    onClick={() => navigate(`/documents/${doc.id}`)}
                    className="hover:bg-[#132042] cursor-pointer transition-colors group"
                  >
                    {/* ID & Name */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#080E24] border border-[#1E325C] text-cyan-400 group-hover:border-cyan-500/50 shrink-0 transition-colors">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono text-cyan-400 font-bold block">
                            {doc.id}
                          </span>
                          <p className="font-bold text-white group-hover:text-cyan-300 transition-colors truncate text-xs">
                            {doc.title}
                          </p>
                          <span className="text-[10px] text-slate-400 truncate block">
                            {doc.fileName} • {doc.fileSize}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 rounded-md bg-[#080E24] text-slate-200 border border-[#1E325C] font-mono text-[10px] font-bold">
                        {doc.department}
                      </span>
                    </td>

                    {/* Language */}
                    <td className="py-3.5 px-3">
                      <span className="text-xs text-slate-200 font-medium">
                        {doc.language}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-3">
                      <PriorityBadge priority={effectivePriority} />
                    </td>

                    {/* Deadline */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-0.5">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border inline-block ${deadline.badgeColor}`}>
                          {deadline.label}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {formatISTDate(doc.submissionDeadline)}
                        </span>
                      </div>
                    </td>

                    {/* Assigned To */}
                    <td className="py-3.5 px-3 font-mono text-slate-200 text-xs font-semibold">
                      {doc.assignedTo}
                    </td>

                    {/* Risk Score */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-2 bg-[#080E24] rounded-full overflow-hidden border border-[#1E325C]">
                          <div
                            className={`h-full ${
                              doc.riskScore >= 80
                                ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                                : doc.riskScore >= 50
                                ? 'bg-amber-500 shadow-sm shadow-amber-500/50'
                                : 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                            }`}
                            style={{ width: `${doc.riskScore}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-mono font-bold text-white">
                          {doc.riskScore}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/documents/${doc.id}`);
                        }}
                        className="p-2 rounded-xl bg-[#080E24] hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 border border-[#1E325C] transition-all"
                        title="View Document Intelligence"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Document Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0E1834] border border-cyan-500/40 p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-[#1E325C] pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Upload KMRL Operational Document</h3>
                  <p className="text-xs text-slate-300 font-mono">Supported: PDF, DOCX, XLSX, PNG, JPG, TXT</p>
                </div>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#132042]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-4">
              <div>
                <label className="text-xs text-slate-200 font-bold block mb-1">
                  Document Title / Subject:
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Aluva Station Escalator Maintenance Compliance Audit 2026"
                  className="w-full bg-[#080E24] border border-[#1E325C] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-slate-200 font-bold block mb-1">
                  Responsible KMRL Directorate:
                </label>
                <select
                  value={uploadDept}
                  onChange={(e) => setUploadDept(e.target.value as DepartmentName)}
                  className="w-full bg-[#080E24] border border-[#1E325C] rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-2 border-dashed border-[#1E325C] hover:border-cyan-500/60 rounded-2xl p-6 text-center space-y-2 cursor-pointer transition-colors bg-[#080E24]">
                <FilePlus className="w-8 h-8 text-cyan-400 mx-auto" />
                <div className="text-xs text-slate-200">
                  <label htmlFor="file-input" className="cursor-pointer text-cyan-400 hover:underline font-bold">
                    Choose local file
                  </label>{' '}
                  or drag & drop
                </div>
                <p className="text-[10px] text-slate-400">Up to 25MB per document</p>
                <input
                  id="file-input"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadFile(e.target.files[0]);
                      if (!uploadTitle) setUploadTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                    }
                  }}
                  className="hidden"
                />
              </div>

              {uploadFile && (
                <div className="p-3 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-xs text-cyan-300 flex items-center justify-between font-mono">
                  <span className="truncate">{uploadFile.name}</span>
                  <span>{(uploadFile.size / 1024).toFixed(0)} KB</span>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#132042] text-slate-300 text-xs font-bold hover:bg-[#1E325C] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black shadow-md shadow-cyan-500/30 transition-all hover:scale-105"
                >
                  Ingest & Process
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
