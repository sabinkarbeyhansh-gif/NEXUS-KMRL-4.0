import { Node, Edge } from '@xyflow/react';
import { KnowledgeGraphNodeData } from '../types';

export const INITIAL_GRAPH_NODES: Node<KnowledgeGraphNodeData>[] = [
  // STATIONS
  {
    id: 'stn-aluva',
    type: 'stationNode',
    position: { x: 450, y: 50 },
    data: {
      label: 'Aluva Metro Station',
      type: 'STATION',
      station: 'Aluva',
      metrics: { relatedDocs: 17, openActions: 4, criticalRisks: 1, upcomingDeadlines: 3 },
      details: 'Northern Terminal Station with 3 levels, high commuter density, and key intermodal bus terminal connection.',
    },
  },
  {
    id: 'stn-edapally',
    type: 'stationNode',
    position: { x: 150, y: 250 },
    data: {
      label: 'Edapally Station',
      type: 'STATION',
      station: 'Edapally',
      metrics: { relatedDocs: 12, openActions: 2, criticalRisks: 0, upcomingDeadlines: 2 },
      details: 'Major transit hub connecting directly to Lulu International Shopping Mall foot overbridge.',
    },
  },
  {
    id: 'stn-muttom',
    type: 'stationNode',
    position: { x: 750, y: 250 },
    data: {
      label: 'Muttom Maintenance Depot',
      type: 'STATION',
      station: 'Muttom Depot',
      metrics: { relatedDocs: 24, openActions: 6, criticalRisks: 2, upcomingDeadlines: 4 },
      details: 'Central maintenance depot with rolling stock stabling bays, heavy overhaul workshops, and test track.',
    },
  },
  {
    id: 'stn-kaloor',
    type: 'stationNode',
    position: { x: 300, y: 500 },
    data: {
      label: 'Kaloor Stadium Station',
      type: 'STATION',
      station: 'Kaloor Stadium',
      metrics: { relatedDocs: 9, openActions: 3, criticalRisks: 1, upcomingDeadlines: 1 },
      details: 'High-surge stadium junction station housing 25kV traction feeding substation.',
    },
  },
  {
    id: 'stn-petta',
    type: 'stationNode',
    position: { x: 600, y: 500 },
    data: {
      label: 'Petta Station',
      type: 'STATION',
      station: 'Petta',
      metrics: { relatedDocs: 8, openActions: 2, criticalRisks: 1, upcomingDeadlines: 2 },
      details: 'Southern terminal interlocking crossover section with CBTC zone controller units.',
    },
  },

  // DOCUMENTS
  {
    id: 'doc-aluva-fire',
    type: 'documentNode',
    position: { x: 450, y: -120 },
    data: {
      label: 'Aluva Fire Safety Audit 2026',
      type: 'DOCUMENT',
      priority: 'CRITICAL',
      department: 'Safety',
      documentId: 'DOC-KMRL-2026-001',
      details: 'Mandates immediate hydraulic re-test and sprinkler recalibration within 24 hours.',
    },
  },
  {
    id: 'doc-brake-ml',
    type: 'documentNode',
    position: { x: 950, y: 150 },
    data: {
      label: 'Rolling Stock Brake Directive (ML)',
      type: 'DOCUMENT',
      priority: 'HIGH',
      department: 'Maintenance',
      documentId: 'DOC-KMRL-2026-002',
      details: 'Bilingual Alstom Metropolis brake pad wear compliance circular.',
    },
  },
  {
    id: 'doc-catenary',
    type: 'documentNode',
    position: { x: 100, y: 400 },
    data: {
      label: '25kV Catenary Inspection Protocol',
      type: 'DOCUMENT',
      priority: 'CRITICAL',
      department: 'Engineering',
      documentId: 'DOC-KMRL-2026-003',
      details: 'Ultrasonic flaw detection across tension insulator cluster 126/14.',
    },
  },
  {
    id: 'doc-policy-2026',
    type: 'documentNode',
    position: { x: 450, y: 300 },
    data: {
      label: 'Tunnel Evacuation Policy (Rev 2026)',
      type: 'DOCUMENT',
      priority: 'CRITICAL',
      department: 'Safety',
      documentId: 'DOC-KMRL-2026-005',
      details: 'Establishes revised 30-day inspection cycle; detects conflict with 2024 SLA.',
    },
  },

  // RISKS
  {
    id: 'rsk-fire-failure',
    type: 'riskNode',
    position: { x: 250, y: -30 },
    data: {
      label: 'Platform Sprinkler Failure Risk',
      type: 'RISK',
      priority: 'CRITICAL',
      station: 'Aluva',
      details: 'Water curtain pressure dropped to 2.1 bar; failure risk in emergency evacuation.',
    },
  },
  {
    id: 'rsk-brake-wear',
    type: 'riskNode',
    position: { x: 950, y: 350 },
    data: {
      label: 'Braking Distance Degradation',
      type: 'RISK',
      priority: 'HIGH',
      station: 'Muttom Depot',
      details: 'Friction coefficient drops on wet monsoon tracks without pad replacement.',
    },
  },
  {
    id: 'rsk-grid-trip',
    type: 'riskNode',
    position: { x: 150, y: 650 },
    data: {
      label: 'Catenary Flashover & Power Trip',
      type: 'RISK',
      priority: 'CRITICAL',
      station: 'Kaloor Stadium',
      details: 'Damaged ceramic insulator could trigger line grounding during peak morning headway.',
    },
  },

  // TASKS
  {
    id: 'tsk-sensor-recal',
    type: 'taskNode',
    position: { x: 650, y: -50 },
    data: {
      label: 'Recalibrate Aluva Pressure Sensors',
      type: 'TASK',
      priority: 'CRITICAL',
      department: 'Safety',
      details: 'Mandatory field recalibration and physical test with Fire Marshal.',
    },
  },
  {
    id: 'tsk-brake-replace',
    type: 'taskNode',
    position: { x: 750, y: 400 },
    data: {
      label: 'Replace Trainset 07 Brake Pads',
      type: 'TASK',
      priority: 'HIGH',
      department: 'Maintenance',
      details: 'Overhaul 6 axle brake assemblies in Stabling Bay 4.',
    },
  },

  // DEPARTMENTS
  {
    id: 'dept-safety',
    type: 'departmentNode',
    position: { x: 450, y: 180 },
    data: {
      label: 'Safety Directorate',
      type: 'DEPARTMENT',
      department: 'Safety',
      metrics: { relatedDocs: 42, openActions: 11, criticalRisks: 5, upcomingDeadlines: 6 },
      details: 'Oversees regulatory safety compliance, CMRS audits, passenger evacuation protocols, and emergency drills.',
    },
  },
  {
    id: 'dept-maint',
    type: 'departmentNode',
    position: { x: 900, y: 20 },
    data: {
      label: 'Maintenance Directorate',
      type: 'DEPARTMENT',
      department: 'Maintenance',
      metrics: { relatedDocs: 38, openActions: 9, criticalRisks: 3, upcomingDeadlines: 5 },
      details: 'Responsible for rolling stock overhauls, depot stabling, bogie inspection, and workshop facilities.',
    },
  },

  // OFFICERS
  {
    id: 'usr-pradeep',
    type: 'officerNode',
    position: { x: 800, y: -120 },
    data: {
      label: 'S. Pradeep (Chief Safety Inspector)',
      type: 'OFFICER',
      department: 'Safety',
      details: 'Lead inspector for passenger concourse systems, fire hydrants, and safety compliance audits.',
    },
  },
  {
    id: 'usr-rajesh',
    type: 'officerNode',
    position: { x: 1000, y: 450 },
    data: {
      label: 'Rajesh Kumar Nair (Depot Superintendent)',
      type: 'OFFICER',
      department: 'Maintenance',
      details: 'In-charge of Muttom Depot mechanical workshop and Alstom Metropolis trainset maintenance.',
    },
  },
];

export const INITIAL_GRAPH_EDGES: Edge[] = [
  // Document -> Station
  { id: 'e-doc-stn-1', source: 'doc-aluva-fire', target: 'stn-aluva', animated: true, style: { stroke: '#00D2FF', strokeWidth: 2 } },
  { id: 'e-doc-stn-2', source: 'doc-brake-ml', target: 'stn-muttom', animated: true, style: { stroke: '#00D2FF', strokeWidth: 2 } },
  { id: 'e-doc-stn-3', source: 'doc-catenary', target: 'stn-kaloor', animated: true, style: { stroke: '#00D2FF', strokeWidth: 2 } },
  { id: 'e-doc-dept-1', source: 'doc-policy-2026', target: 'dept-safety', animated: true, style: { stroke: '#00D2FF', strokeWidth: 2 } },

  // Document -> Risk
  { id: 'e-doc-rsk-1', source: 'doc-aluva-fire', target: 'rsk-fire-failure', style: { stroke: '#EF4444', strokeWidth: 2.5 } },
  { id: 'e-doc-rsk-2', source: 'doc-brake-ml', target: 'rsk-brake-wear', style: { stroke: '#F59E0B', strokeWidth: 2 } },
  { id: 'e-doc-rsk-3', source: 'doc-catenary', target: 'rsk-grid-trip', style: { stroke: '#EF4444', strokeWidth: 2.5 } },

  // Risk -> Station
  { id: 'e-rsk-stn-1', source: 'rsk-fire-failure', target: 'stn-aluva', style: { stroke: '#EF4444', strokeDasharray: '5,5' } },

  // Document -> Task
  { id: 'e-doc-tsk-1', source: 'doc-aluva-fire', target: 'tsk-sensor-recal', animated: true, style: { stroke: '#10B981', strokeWidth: 2 } },
  { id: 'e-doc-tsk-2', source: 'doc-brake-ml', target: 'tsk-brake-replace', animated: true, style: { stroke: '#10B981', strokeWidth: 2 } },

  // Task -> Officer
  { id: 'e-tsk-usr-1', source: 'tsk-sensor-recal', target: 'usr-pradeep', style: { stroke: '#38BDF8', strokeWidth: 2 } },
  { id: 'e-tsk-usr-2', source: 'tsk-brake-replace', target: 'usr-rajesh', style: { stroke: '#38BDF8', strokeWidth: 2 } },

  // Department -> Station / Officer
  { id: 'e-dept-stn-1', source: 'dept-safety', target: 'stn-aluva', style: { stroke: '#64748B' } },
  { id: 'e-dept-usr-1', source: 'dept-safety', target: 'usr-pradeep', style: { stroke: '#64748B' } },
  { id: 'e-dept-maint-1', source: 'dept-maint', target: 'stn-muttom', style: { stroke: '#64748B' } },
  { id: 'e-dept-maint-2', source: 'dept-maint', target: 'usr-rajesh', style: { stroke: '#64748B' } },

  // Inter-station track link
  { id: 'e-track-1', source: 'stn-aluva', target: 'stn-edapally', style: { stroke: '#1E2D4A', strokeWidth: 4 } },
  { id: 'e-track-2', source: 'stn-edapally', target: 'stn-kaloor', style: { stroke: '#1E2D4A', strokeWidth: 4 } },
  { id: 'e-track-3', source: 'stn-kaloor', target: 'stn-petta', style: { stroke: '#1E2D4A', strokeWidth: 4 } },
  { id: 'e-track-4', source: 'stn-aluva', target: 'stn-muttom', style: { stroke: '#1E2D4A', strokeWidth: 4 } },
];
