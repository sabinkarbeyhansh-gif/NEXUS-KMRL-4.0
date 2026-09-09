import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DocumentItem,
  TaskItem,
  ExtractedRisk,
  DocumentConflict,
  NotificationItem,
  AuditLogItem,
  PriorityLevel,
  TaskStatus,
  AIProviderStatus,
} from '../types';
import {
  INITIAL_DOCUMENTS,
  INITIAL_TASKS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
} from '../utils/seedData';
import { INITIAL_GRAPH_NODES, INITIAL_GRAPH_EDGES } from '../utils/graphData';
import { Node, Edge } from '@xyflow/react';

interface DataContextType {
  documents: DocumentItem[];
  tasks: TaskItem[];
  risks: ExtractedRisk[];
  conflicts: DocumentConflict[];
  notifications: NotificationItem[];
  auditLogs: AuditLogItem[];
  graphNodes: Node[];
  graphEdges: Edge[];
  aiProvider: 'Gemini' | 'Grok' | 'Mock AI';
  aiStatus: AIProviderStatus;
  isDemoMode: boolean;
  isProcessingDemo: boolean;
  demoStep: number;
  setAIProvider: (provider: 'Gemini' | 'Grok' | 'Mock AI') => void;
  toggleDemoMode: () => void;
  addDocument: (doc: DocumentItem) => void;
  overridePriority: (docId: string, newPriority: PriorityLevel, reason: string, user: string) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus, evidenceFile?: string) => void;
  markNotificationAsRead: (notifId: string) => void;
  runGuidedDemoScenario: () => Promise<void>;
  resetDemoData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [graphNodes, setGraphNodes] = useState<Node[]>(INITIAL_GRAPH_NODES);
  const [graphEdges, setGraphEdges] = useState<Edge[]>(INITIAL_GRAPH_EDGES);

  const [aiProvider, setAIProviderState] = useState<'Gemini' | 'Grok' | 'Mock AI'>('Mock AI');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isProcessingDemo, setIsProcessingDemo] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(0);

  // Derived risks from documents
  const risks: ExtractedRisk[] = documents.flatMap((d) => d.risks || []);
  
  // Derived conflicts from documents
  const conflicts: DocumentConflict[] = documents.flatMap((d) => d.conflicts || []);

  const aiStatus: AIProviderStatus = {
    provider: aiProvider,
    model: aiProvider === 'Gemini' ? 'Gemini 2.0 Flash' : aiProvider === 'Grok' ? 'Grok-Beta' : 'KMRL Neural Engine (Offline Deterministic)',
    connected: true,
    latencyMs: aiProvider === 'Mock AI' ? 45 : 320,
  };

  const setAIProvider = (provider: 'Gemini' | 'Grok' | 'Mock AI') => {
    setAIProviderState(provider);
    addAuditLog('System Administrator', 'ADMIN', 'AI_PROVIDER_SWITCH', `Switched active AI engine to ${provider}`, 'Local Settings');
  };

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => !prev);
  };

  const addDocument = (doc: DocumentItem) => {
    setDocuments((prev) => [doc, ...prev]);
    // Dispatch tasks
    if (doc.actions && doc.actions.length > 0) {
      const newTasks: TaskItem[] = doc.actions.map((act) => ({
        id: act.id,
        title: act.task,
        sourceDocumentId: doc.id,
        sourceDocumentName: doc.fileName,
        department: act.department,
        assignedPerson: act.assignedPerson || 'Safety Officer',
        priority: act.priority,
        createdDate: new Date().toISOString(),
        deadline: act.deadline,
        status: act.status,
        station: doc.station,
      }));
      setTasks((prev) => [...newTasks, ...prev]);
    }
    // Dispatch notification
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      type: doc.aiPriority === 'CRITICAL' ? 'CRITICAL' : 'INFO',
      title: `New Document Processed: ${doc.title}`,
      message: `AI assigned ${doc.aiPriority} priority. Routed to ${doc.department}.`,
      timestamp: new Date().toISOString(),
      read: false,
      linkTo: `/documents/${doc.id}`,
      targetId: doc.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Audit log
    addAuditLog(doc.assignedTo || 'Officer', 'OFFICER', 'DOCUMENT_UPLOAD', `Ingested ${doc.fileName}`, 'Web Upload');
  };

  const overridePriority = (docId: string, newPriority: PriorityLevel, reason: string, user: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          const updatedDoc = {
            ...doc,
            humanPriority: newPriority,
            priorityOverrideReason: reason,
            priorityChangedBy: user,
            priorityChangedAt: new Date().toISOString(),
          };
          return updatedDoc;
        }
        return doc;
      })
    );

    addAuditLog(
      user,
      'MANAGER',
      'PRIORITY_OVERRIDE',
      `Modified priority of ${docId} to ${newPriority}. Reason: ${reason}`,
      '10.14.0.1'
    );

    const newNotif: NotificationItem = {
      id: `NOTIF-OVR-${Date.now()}`,
      type: newPriority === 'CRITICAL' ? 'CRITICAL' : 'WARNING',
      title: `Priority Override: ${docId}`,
      message: `${user} updated document priority to ${newPriority}: ${reason}`,
      timestamp: new Date().toISOString(),
      read: false,
      linkTo: `/documents/${docId}`,
      targetId: docId,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus, evidenceFile?: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            status,
            evidenceFileName: evidenceFile || task.evidenceFileName,
            evidenceUploadedAt: evidenceFile ? new Date().toISOString() : task.evidenceUploadedAt,
            completionDate: status === 'COMPLETED' ? new Date().toISOString() : task.completionDate,
          };
        }
        return task;
      })
    );

    addAuditLog(
      'Field Officer',
      'OFFICER',
      'TASK_STATUS_UPDATE',
      `Updated ${taskId} to ${status}${evidenceFile ? ` with evidence: ${evidenceFile}` : ''}`,
      'Mobile Station Portal'
    );

    if (status === 'COMPLETED') {
      setNotifications((prev) => [
        {
          id: `NOTIF-TSK-${Date.now()}`,
          type: 'SUCCESS',
          title: `Task Completed: ${taskId}`,
          message: `Field task marked completed with submitted verification evidence.`,
          timestamp: new Date().toISOString(),
          read: false,
          linkTo: '/actions',
          targetId: taskId,
        },
        ...prev,
      ]);
    }
  };

  const markNotificationAsRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const addAuditLog = (actor: string, role: any, action: string, details: string, ipAddress: string) => {
    const newLog: AuditLogItem = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor,
      role,
      action,
      target: details.slice(0, 40),
      details,
      ipAddress,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const resetDemoData = () => {
    setDocuments(INITIAL_DOCUMENTS);
    setTasks(INITIAL_TASKS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setGraphNodes(INITIAL_GRAPH_NODES);
    setGraphEdges(INITIAL_GRAPH_EDGES);
    setDemoStep(0);
    setIsProcessingDemo(false);
  };

  /**
   * Guided 13-step Live Demo Scenario for SIH Judges:
   * 1. Receive 15-page bilingual safety circular
   * 2. OCR text extraction
   * 3. Detect English + Malayalam
   * 4. Classify Safety Circular
   * 5. Set priority CRITICAL
   * 6. Extract 3 actions, 2 risks, 2 deadlines
   * 7. Automatically create tasks
   * 8. Assign to Safety Department
   * 9. Update Knowledge Graph
   * 10. Update Risk Radar
   * 11. Post urgent deadline to dashboard
   * 12. Voice assistant readiness check
   * 13. Decision ready state
   */
  const runGuidedDemoScenario = async () => {
    setIsProcessingDemo(true);
    setDemoStep(1);

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let step = 1; step <= 13; step++) {
      setDemoStep(step);
      await sleep(1000);

      if (step === 5) {
        // Inject new live demo document
        const newDemoDoc: DocumentItem = {
          id: `DOC-LIVE-${Date.now().toString().slice(-4)}`,
          title: 'Special Safety Order: Palarivattom Station Platform Screen Door Interlock Protocol',
          fileName: 'KMRL_SFT_PALARIVATTOM_PSD_2026.pdf',
          fileType: 'PDF',
          fileSize: '5.2 MB',
          department: 'Safety',
          language: 'Bilingual (EN/ML)',
          aiPriority: 'CRITICAL',
          status: 'PROCESSED',
          aiConfidence: 99,
          aiPriorityReason: 'Immediate safety directive: Platform Screen Door (PSD) optical interlock beam alignment failed at Palarivattom Platform 1. Trains cannot achieve ATO docking without manual bypass.',
          summary: 'പാലാരിവട്ടം മെട്രോ സ്റ്റേഷനിലെ ഒന്നാം പ്ലാറ്റ്‌ഫോമിലെ സ്ക്രീൻ ഡോർ ഒപ്റ്റിക്കൽ സെൻസർ തകരാർ പരിഹരിക്കാനുള്ള അടിയന്തിര നിർദ്ദേശം. 24 മണിക്കൂറിനകം പരിശോധിച്ച് റിപ്പോർട്ട് നൽകുക.',
          keyFacts: [
            'Palarivattom Platform 1 Door 7 sensor misaligned by 4.2mm',
            'Affects ATO (Automatic Train Operation) precision stopping',
            'Direct safety hazard for boarding passengers',
            'Immediate 24-hour compliance deadline',
          ],
          receivedDate: new Date().toISOString(),
          createdDate: new Date().toISOString(),
          submissionDeadline: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          expectedCompletion: new Date(Date.now() + 108000000).toISOString(),
          assignedTo: 'S. Pradeep',
          riskScore: 98,
          station: 'Palarivattom',
          storagePath: 'Safety/2026/KMRL_SFT_PALARIVATTOM_PSD_2026.pdf',
          timeline: [
            { date: 'Just now', stage: 'Document Received', description: 'Live OCR & Ingestion Pipeline', status: 'completed' },
            { date: 'In 24h', stage: 'Interlock Certification Deadline', description: 'Station reopening compliance', status: 'current' },
          ],
          entities: [
            { id: 'ENT-LIVE-1', name: 'Palarivattom Station', type: 'STATION', occurrences: 14 },
            { id: 'ENT-LIVE-2', name: 'Platform Screen Doors', type: 'ASSET', occurrences: 19 },
            { id: 'ENT-LIVE-3', name: 'S. Pradeep', type: 'OFFICER', occurrences: 6 },
          ],
          actions: [
            {
              id: `ACT-LIVE-1`,
              task: 'Re-align optical sensor beam on Palarivattom PSD Gate 7',
              department: 'Safety',
              assignedPerson: 'S. Pradeep',
              priority: 'CRITICAL',
              deadline: new Date(Date.now() + 86400000).toISOString(),
              status: 'IN_PROGRESS',
              evidenceRequired: 'Digital lux meter reading and signed gate closure certificate',
              sourceReference: 'Page 3, Technical Directive',
            },
          ],
          risks: [
            {
              id: `RSK-LIVE-1`,
              title: 'Passenger Platform Fall Hazard at Palarivattom',
              description: 'Door interlock bypass prevents automatic emergency brakes.',
              severity: 'CRITICAL',
              category: 'SAFETY',
              station: 'Palarivattom',
              recommendedMitigation: 'Deploy human safety marshal at Gate 7 during every train arrival.',
              sourceReference: 'Page 1, Urgent Executive Warning',
            },
          ],
        };

        addDocument(newDemoDoc);
      }

      if (step === 9) {
        // Inject into Knowledge Graph dynamically
        const newGraphNode: Node = {
          id: 'doc-live-psd',
          type: 'documentNode',
          position: { x: 550, y: -220 },
          data: {
            label: 'Palarivattom PSD Safety Order',
            type: 'DOCUMENT',
            priority: 'CRITICAL',
            department: 'Safety',
            details: 'Live ingested 2026 critical safety directive with auto-dispatched actions.',
          },
        };
        setGraphNodes((prev) => [newGraphNode, ...prev]);
        setGraphEdges((prev) => [
          { id: 'e-live-1', source: 'doc-live-psd', target: 'stn-aluva', animated: true, style: { stroke: '#00D2FF', strokeWidth: 3 } },
          { id: 'e-live-2', source: 'doc-live-psd', target: 'dept-safety', animated: true, style: { stroke: '#EF4444', strokeWidth: 3 } },
          ...prev,
        ]);
      }
    }

    setIsProcessingDemo(false);
  };

  return (
    <DataContext.Provider
      value={{
        documents,
        tasks,
        risks,
        conflicts,
        notifications,
        auditLogs,
        graphNodes,
        graphEdges,
        aiProvider,
        aiStatus,
        isDemoMode,
        isProcessingDemo,
        demoStep,
        setAIProvider,
        toggleDemoMode,
        addDocument,
        overridePriority,
        updateTaskStatus,
        markNotificationAsRead,
        runGuidedDemoScenario,
        resetDemoData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
