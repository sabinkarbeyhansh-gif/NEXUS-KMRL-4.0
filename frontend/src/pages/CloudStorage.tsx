import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cloud,
  Folder,
  FolderOpen,
  FileText,
  FileCode,
  HardDrive,
  Download,
  Eye,
  Server,
  Database,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { DepartmentName } from '../types';

export const CloudStorage: React.FC = () => {
  const { documents } = useData();
  const navigate = useNavigate();

  const [activeFolder, setActiveFolder] = useState<DepartmentName | 'All'>('Safety');

  const folders: DepartmentName[] = [
    'Safety',
    'Engineering',
    'Operations',
    'Finance',
    'HR',
    'Legal',
    'Procurement',
    'Maintenance',
  ];

  const filesInFolder =
    activeFolder === 'All'
      ? documents
      : documents.filter((d) => d.department === activeFolder);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Cloud className="w-6 h-6 text-cyan-400" />
            Cloud Document Storage Explorer
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            S3 & Supabase compatible object storage architecture for KMRL multi-division documents
          </p>
        </div>

        {/* Cloud Status Indicator */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-[#0D1526] border border-[#1E2D4A] flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Target Bucket:</span>
            <span className="text-white font-bold">kmrl-storage-south</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Cloud Synced
          </div>
        </div>
      </div>

      {/* Explorer Layout: Left Folders Tree, Right Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Department Folders (4 cols) */}
        <div className="md:col-span-4 rounded-3xl bg-[#0D1526] border border-[#1E2D4A] p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              KMRL Documents/
            </span>
            <span className="text-[10px] font-mono text-slate-400">8 Folders</span>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => setActiveFolder('All')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeFolder === 'All'
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'text-slate-300 hover:bg-[#131E35]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {activeFolder === 'All' ? (
                  <FolderOpen className="w-4 h-4" />
                ) : (
                  <Folder className="w-4 h-4 text-cyan-400" />
                )}
                <span>All Documents</span>
              </div>
              <span className="text-[10px] font-mono">{documents.length}</span>
            </button>

            {folders.map((folder) => {
              const count = documents.filter((d) => d.department === folder).length;
              const isSelected = activeFolder === folder;
              return (
                <button
                  key={folder}
                  onClick={() => setActiveFolder(folder)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-cyan-500 text-black font-bold'
                      : 'text-slate-300 hover:bg-[#131E35]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isSelected ? (
                      <FolderOpen className="w-4 h-4" />
                    ) : (
                      <Folder className="w-4 h-4 text-amber-400" />
                    )}
                    <span>{folder}/</span>
                  </div>
                  <span className="text-[10px] font-mono">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Files in Selected Folder (8 cols) */}
        <div className="md:col-span-8 rounded-3xl bg-[#0D1526] border border-[#1E2D4A] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3 text-xs">
            <span className="font-mono text-cyan-400 font-bold">
              Folder: /{activeFolder === 'All' ? 'All' : activeFolder}/2026/
            </span>
            <span className="text-slate-400 font-mono">
              {filesInFolder.length} files located
            </span>
          </div>

          <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
            {filesInFolder.map((file) => (
              <div
                key={file.id}
                onClick={() => navigate(`/documents/${file.id}`)}
                className="p-4 rounded-2xl bg-[#131E35]/60 hover:bg-[#131E35] border border-[#1E2D4A] hover:border-cyan-500/40 transition-all cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-[#070B14] border border-[#1E2D4A] text-cyan-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {file.fileName}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">{file.title}</p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 mt-1">
                      <span>{file.fileSize}</span>
                      <span>•</span>
                      <span>Path: {file.storagePath}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/documents/${file.id}`);
                    }}
                    className="p-2 rounded-xl bg-[#070B14] hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 border border-[#1E2D4A] transition-colors"
                    title="Inspect Document Intelligence"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Downloading ${file.fileName} from cloud object storage.`);
                    }}
                    className="p-2 rounded-xl bg-[#070B14] hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 border border-[#1E2D4A] transition-colors"
                    title="Download Original"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
