import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  StationNode,
  DocumentNode,
  DepartmentNode,
  TaskNode,
  RiskNode,
  OfficerNode,
} from '../components/graph/CustomNodes';
import { GraphSidePanel } from '../components/graph/GraphSidePanel';
import { useData } from '../contexts/DataContext';
import { KnowledgeGraphNodeData } from '../types';
import {
  Network,
  Search,
  Filter,
  Layers,
  Sparkles,
  Maximize2,
  RotateCcw,
} from 'lucide-react';

const nodeTypes = {
  stationNode: StationNode,
  documentNode: DocumentNode,
  departmentNode: DepartmentNode,
  taskNode: TaskNode,
  riskNode: RiskNode,
  officerNode: OfficerNode,
};

export const KnowledgeGraph: React.FC = () => {
  const { graphNodes: initialNodes, graphEdges: initialEdges } = useData();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeData, setSelectedNodeData] = useState<KnowledgeGraphNodeData | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync state when new nodes are added in live demo mode
  React.useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  React.useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  // Node selection handler
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeData((node.data as unknown) as KnowledgeGraphNodeData);
  }, []);

  // Filtered nodes
  const displayNodes = useMemo(() => {
    return nodes.map((node) => {
      const data = (node.data as unknown) as KnowledgeGraphNodeData;
      const matchesFilter =
        activeFilter === 'ALL' ||
        data.type === activeFilter ||
        (activeFilter === 'CRITICAL' && data.priority === 'CRITICAL');

      const matchesSearch =
        searchQuery === '' ||
        data.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (data.details && data.details.toLowerCase().includes(searchQuery.toLowerCase()));

      const isDimmed = !matchesFilter || !matchesSearch;

      return {
        ...node,
        style: {
          ...node.style,
          opacity: isDimmed ? 0.2 : 1,
          transition: 'all 0.3s ease',
        },
      };
    });
  }, [nodes, activeFilter, searchQuery]);

  return (
    <div className="space-y-4 h-[calc(100vh-6.5rem)] flex flex-col">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Network className="w-6 h-6 text-cyan-400" />
            Operational Knowledge Graph
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Interconnecting Documents, Stations, Risks, Tasks, and Operational Decisions
          </p>
        </div>

        {/* Filter Buttons & Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search node or station..."
              className="w-48 bg-[#0D1526] border border-[#1E2D4A] rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Node Category Filters */}
          {[
            { id: 'ALL', label: 'All Entities' },
            { id: 'STATION', label: 'Stations' },
            { id: 'DOCUMENT', label: 'Documents' },
            { id: 'RISK', label: 'Risks' },
            { id: 'TASK', label: 'Actions' },
            { id: 'CRITICAL', label: 'Critical Only' },
          ].map((flt) => (
            <button
              key={flt.id}
              onClick={() => setActiveFilter(flt.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors ${
                activeFilter === flt.id
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-[#0D1526] hover:bg-[#131E35] text-slate-300 border border-[#1E2D4A]'
              }`}
            >
              {flt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Interactive React Flow Graph Canvas */}
      <div className="flex-1 rounded-3xl bg-[#070B14] border border-[#1E2D4A] shadow-2xl relative overflow-hidden min-h-[450px]">
        <ReactFlow
          nodes={displayNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
          className="bg-[#070B14]"
        >
          <Background color="#1E2D4A" gap={20} size={1} variant={BackgroundVariant.Dots} />
          <Controls className="!bg-[#0D1526] !border-[#1E2D4A] !fill-slate-200 !text-slate-200 rounded-2xl overflow-hidden shadow-xl" />
          <MiniMap
            nodeStrokeWidth={3}
            nodeColor={(node: any) => {
              if (node.type === 'stationNode') return '#00D2FF';
              if (node.type === 'riskNode') return '#EF4444';
              if (node.type === 'taskNode') return '#10B981';
              if (node.type === 'departmentNode') return '#A855F7';
              return '#38BDF8';
            }}
            className="!bg-[#0D1526]/90 !border-[#1E2D4A] rounded-2xl overflow-hidden shadow-xl"
            maskColor="rgba(7, 11, 20, 0.7)"
          />
        </ReactFlow>

        {/* Legend Overlay at Bottom Left */}
        <div className="absolute bottom-4 left-16 p-3 rounded-2xl bg-[#0D1526]/90 backdrop-blur-md border border-[#1E2D4A] text-[10px] font-mono flex items-center gap-4 text-slate-300 shadow-xl hidden md:flex pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span>Station</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
            <span>Document</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Action Item</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
            <span>Directorate</span>
          </div>
        </div>

        {/* Interactive Node Details Side Panel */}
        <GraphSidePanel
          nodeData={selectedNodeData}
          onClose={() => setSelectedNodeData(null)}
        />
      </div>
    </div>
  );
};
