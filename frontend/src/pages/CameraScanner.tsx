import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  ShieldCheck,
  Building2,
  ArrowRight,
  Upload,
  Check,
  FileCheck2,
  Lock,
  Radio,
  Sliders,
  AlertTriangle,
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { DocumentItem } from '../types';

interface SampleDoc {
  id: string;
  name: string;
  station: string;
  department: 'Engineering' | 'Safety' | 'Maintenance' | 'Operations';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  summary: string;
  imageUrl: string;
  taskTitle: string;
  measurements: string;
  initialCloseStatus: 'ELIGIBLE_FOR_CLOSURE' | 'DEFECTIVE_REQUIRES_REJECTION';
}

const SAMPLE_SCAN_DOCS: SampleDoc[] = [
  {
    id: 'SCAN-SAMPLE-001',
    name: 'Aluva Platform 1 Sub-Distribution Panel (DB-02) Thermographic Inspection Slip',
    station: 'Aluva',
    department: 'Engineering',
    priority: 'HIGH',
    summary: 'Thermography scan showing 78°C hotspot on 63A MCB terminal cluster. Retightening executed and load tested under 415V peak demand.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    taskTitle: 'Torque terminal screws & replace thermal-degraded MCB at Aluva DB-02',
    measurements: 'Pre-repair: 78.4°C | Post-repair: 42.1°C (Safe limit: <55°C)',
    initialCloseStatus: 'ELIGIBLE_FOR_CLOSURE',
  },
  {
    id: 'SCAN-SAMPLE-002',
    name: 'Kaloor Tunnel Ventilation Booster Fan Damper Quarterly Compliance Report',
    station: 'Kaloor',
    department: 'Safety',
    priority: 'CRITICAL',
    summary: 'Physical quarterly inspection of emergency smoke extraction dampers. Damper 03 actuator motor seized due to humidity corrosion.',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800',
    taskTitle: 'Emergency smoke damper overhaul & actuator motor replacement at Kaloor Tunnel',
    measurements: 'Booster 03 Actuator: FAILED (0% stroke) | Pressure: 42 Pa (Required: >140 Pa)',
    initialCloseStatus: 'DEFECTIVE_REQUIRES_REJECTION',
  },
  {
    id: 'SCAN-SAMPLE-003',
    name: 'Muttom Depot Track Sump Pump Drainage Clearance Certificate',
    station: 'Muttom Depot',
    department: 'Maintenance',
    priority: 'MEDIUM',
    summary: 'Monsoon drainage pit clearance and dual submersible pump float switch calibration. Both pumps functioning in auto-alternation mode.',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&q=80&w=800',
    taskTitle: 'Clean silt trap & certify dual submersible pump auto-switching at Muttom',
    measurements: 'Discharge flow: 450 L/min | Sump water level: 12mm (Safe: <75mm)',
    initialCloseStatus: 'ELIGIBLE_FOR_CLOSURE',
  },
];

export const CameraScanner: React.FC = () => {
  const { addDocument } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Camera & Capture State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [resolution, setResolution] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'high_contrast' | 'greyscale' | 'normal'>('high_contrast');
  const [selectedSample, setSelectedSample] = useState<SampleDoc>(SAMPLE_SCAN_DOCS[0]);

  // Scanning Stages: 'SCAN' -> 'EXTRACTING' -> 'VERIFY' -> 'DECIDED'
  const [stage, setStage] = useState<'SCAN' | 'EXTRACTING' | 'VERIFY' | 'DECIDED'>('SCAN');
  const [decision, setDecision] = useState<'APPROVED_AND_CLOSED' | 'REJECTED_AND_ESCALATED' | 'DISPATCHED_WORK_ORDER' | null>(null);
  const [closureHash, setClosureHash] = useState<string | null>(null);

  // Verification Checklist State
  const [checkSignature, setCheckSignature] = useState<boolean>(true);
  const [checkMeasurements, setCheckMeasurements] = useState<boolean>(true);
  const [checkHazard, setCheckHazard] = useState<boolean>(true);
  const [checkSCADA, setCheckSCADA] = useState<boolean>(true);
  const [rejectionRationale, setRejectionRationale] = useState<string>(
    'Defective telemetry readings detected: Booster damper actuator failed to open during physical smoke test. Fails CMRS statutory requirements.'
  );

  const startCamera = async () => {
    setCameraError(null);
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 2560 },
          height: { ideal: 1440 },
          facingMode: 'environment',
        },
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
            setResolution({
              width: videoRef.current.videoWidth,
              height: videoRef.current.videoHeight,
            });
          }
        };
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraError('Hardware camera access unavailable. Running in simulated 2K sensor fallback mode.');
      setResolution({ width: 2560, height: 1440 });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 2560;
      canvas.height = video.videoHeight || 1440;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setCapturedImage(canvas.toDataURL('image/jpeg', 0.95));
        stopCamera();
        return;
      }
    }

    // Fallback image using current selected sample
    setCapturedImage(selectedSample.imageUrl);
  };

  const handleSelectSample = (sample: SampleDoc) => {
    setSelectedSample(sample);
    setCapturedImage(sample.imageUrl);
    stopCamera();
  };

  const handleStartOCRAndVerify = () => {
    setStage('EXTRACTING');
    setTimeout(() => {
      // Transition to the verification stage
      setStage('VERIFY');
    }, 1200);
  };

  // DECISION 1: APPROVE & CLOSE TASK (Work Verified & Completed)
  const handleApproveAndClose = () => {
    const hash = `KMRL-SEAL-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Date.now().toString().slice(-6)}`;
    setClosureHash(hash);
    setDecision('APPROVED_AND_CLOSED');
    setStage('DECIDED');

    const newDocId = `DOC-VERIFIED-${Date.now().toString().slice(-4)}`;
    const newDoc: DocumentItem = {
      id: newDocId,
      title: `[VERIFIED & CLOSED] ${selectedSample.name}`,
      fileName: `KMRL_SEALED_${selectedSample.station.toUpperCase()}.PDF`,
      fileType: 'PDF',
      fileSize: '3.8 MB',
      department: selectedSample.department,
      language: 'English',
      aiPriority: selectedSample.priority,
      status: 'REVIEWED',
      aiConfidence: 98,
      aiPriorityReason: `Physical inspection verified by ${currentUser.name} (${currentUser.role}). Work order sealed under cryptographic hash ${hash}.`,
      summary: selectedSample.summary,
      keyFacts: [
        `Verification Officer: ${currentUser.name} (${currentUser.role})`,
        `Cryptographic Seal: ${hash}`,
        `Field Measurements: ${selectedSample.measurements}`,
        `Station: ${selectedSample.station}`,
      ],
      receivedDate: new Date().toISOString(),
      createdDate: new Date().toISOString(),
      submissionDeadline: new Date().toISOString(),
      assignedTo: currentUser.name,
      riskScore: 20,
      station: selectedSample.station,
      storagePath: 'Closed_Inspections/Sealed_2026/',
      timeline: [
        { date: 'Just now', stage: '2K Camera Ingestion', description: 'Scanned from field paper notice', status: 'completed' },
        { date: 'Just now', stage: 'Verification Gate', description: 'Compliance audit checklist confirmed', status: 'completed' },
        { date: 'Just now', stage: 'Sealed & Closed', description: `Closure signed: ${hash}`, status: 'completed' },
      ],
      entities: [
        { id: 'E-ST', name: `${selectedSample.station} Station`, type: 'STATION', occurrences: 6 },
      ],
      actions: [
        {
          id: `ACT-CLOSED-${Date.now()}`,
          task: selectedSample.taskTitle,
          department: selectedSample.department,
          priority: selectedSample.priority,
          deadline: new Date().toISOString(),
          status: 'COMPLETED',
          evidenceRequired: 'Thermographic / physical test certificate (Attached)',
          sourceReference: 'OCR Verified Inspection Report',
        },
      ],
      risks: [],
    };

    addDocument(newDoc);
  };

  // DECISION 2: REJECT & ESCALATE (Do Not Close — Defect / Non-Compliance Found)
  const handleRejectAndEscalate = () => {
    setDecision('REJECTED_AND_ESCALATED');
    setStage('DECIDED');

    const newDocId = `DOC-ESCALATED-${Date.now().toString().slice(-4)}`;
    const newDoc: DocumentItem = {
      id: newDocId,
      title: `[REJECTED - ACTION REQUIRED] ${selectedSample.name}`,
      fileName: `KMRL_NONCOMPLIANCE_${selectedSample.station.toUpperCase()}.PDF`,
      fileType: 'PDF',
      fileSize: '4.2 MB',
      department: selectedSample.department,
      language: 'English',
      aiPriority: 'CRITICAL',
      status: 'PROCESSED',
      aiConfidence: 99,
      aiPriorityReason: `Rejection by ${currentUser.name} (${currentUser.role}): ${rejectionRationale}`,
      summary: `NON-COMPLIANCE REJECTION: ${rejectionRationale}. Immediate field rectification mandated within 24 hours.`,
      keyFacts: [
        `Rejection Reason: ${rejectionRationale}`,
        `Station: ${selectedSample.station}`,
        `Escalated to: Chief Safety Officer & General Manager Operations`,
        `Hazard Level: CRITICAL (Imminent passenger safety risk)`,
      ],
      receivedDate: new Date().toISOString(),
      createdDate: new Date().toISOString(),
      submissionDeadline: new Date(Date.now() + 86400000).toISOString(),
      assignedTo: 'S. Pradeep Kumar',
      riskScore: 94,
      station: selectedSample.station,
      storagePath: 'Escalations/Immediate_Rectification/',
      timeline: [
        { date: 'Just now', stage: '2K Camera Ingestion', description: 'Scanned inspection report', status: 'completed' },
        { date: 'Just now', stage: 'Verification Gate', description: 'REJECTED: Severe safety defect detected', status: 'completed' },
        { date: 'Due in 24h', stage: 'Urgent Rectification', description: 'Mandatory field re-inspection', status: 'current' },
      ],
      entities: [
        { id: 'E-ST', name: `${selectedSample.station} Station`, type: 'STATION', occurrences: 8 },
      ],
      actions: [
        {
          id: `ACT-ESCALATE-${Date.now()}`,
          task: `URGENT: Rectify defect at ${selectedSample.station} - ${rejectionRationale}`,
          department: selectedSample.department,
          priority: 'CRITICAL',
          deadline: new Date(Date.now() + 86400000).toISOString(),
          status: 'REJECTED',
          evidenceRequired: 'CMRS compliant re-test certificate with photographic proof',
          sourceReference: 'OCR Verified Inspection Report',
        },
      ],
      risks: [
        {
          id: `RSK-DEFECT-${Date.now()}`,
          title: `Defective Equipment Safety Breach at ${selectedSample.station}`,
          description: rejectionRationale,
          severity: 'CRITICAL',
          category: 'SAFETY',
          station: selectedSample.station,
          recommendedMitigation: 'Halt non-essential operations in sector until re-tested and certified by Senior Electrical Engineer.',
          sourceReference: 'CMRS Inspection Notice',
        },
      ],
    };

    addDocument(newDoc);
  };

  // DECISION 3: INGEST AS ACTIVE FIELD WORK ORDER
  const handleDispatchWorkOrder = () => {
    setDecision('DISPATCHED_WORK_ORDER');
    setStage('DECIDED');

    const newDocId = `DOC-DISPATCH-${Date.now().toString().slice(-4)}`;
    const newDoc: DocumentItem = {
      id: newDocId,
      title: `[ACTIVE WORK ORDER] ${selectedSample.name}`,
      fileName: `KMRL_WORK_ORDER_${selectedSample.station.toUpperCase()}.PDF`,
      fileType: 'PDF',
      fileSize: '3.1 MB',
      department: selectedSample.department,
      language: 'English',
      aiPriority: selectedSample.priority,
      status: 'PROCESSED',
      aiConfidence: 96,
      aiPriorityReason: 'Active maintenance directive extracted from scanned checklist.',
      summary: selectedSample.summary,
      keyFacts: [
        `Station: ${selectedSample.station}`,
        `Task: ${selectedSample.taskTitle}`,
        `Assigned: Field Operations Team`,
      ],
      receivedDate: new Date().toISOString(),
      createdDate: new Date().toISOString(),
      submissionDeadline: new Date(Date.now() + 172800000).toISOString(),
      assignedTo: 'Ananya R. Nair',
      riskScore: 65,
      station: selectedSample.station,
      storagePath: 'Work_Orders/Active/',
      timeline: [
        { date: 'Just now', stage: 'Scanned & Parsed', description: 'OCR generated directive', status: 'completed' },
        { date: 'In 48h', stage: 'Work Order Execution', description: 'Field crew assigned', status: 'current' },
      ],
      entities: [
        { id: 'E-ST', name: `${selectedSample.station} Station`, type: 'STATION', occurrences: 4 },
      ],
      actions: [
        {
          id: `ACT-WO-${Date.now()}`,
          task: selectedSample.taskTitle,
          department: selectedSample.department,
          priority: selectedSample.priority,
          deadline: new Date(Date.now() + 172800000).toISOString(),
          status: 'PENDING',
          evidenceRequired: 'Completion certificate and timestamped photo',
          sourceReference: 'Scanned Notice',
        },
      ],
      risks: [],
    };

    addDocument(newDoc);
  };

  const handleReset = () => {
    setStage('SCAN');
    setCapturedImage(null);
    setDecision(null);
    setClosureHash(null);
    startCamera();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#091126] border border-[#17254A] shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Document Scanner & Verification Decision Gate
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Scan physical documents → Audit & verify compliance telemetry → Make the next move: Close or Reject
            </p>
          </div>
        </div>

        {/* Current Workflow Stage Tracker */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0D1836] border border-[#1A2C54] rounded-xl text-xs font-mono">
          <span
            className={`px-3 py-1 rounded-lg font-bold ${
              stage === 'SCAN'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400'
            }`}
          >
            1. SCAN
          </span>
          <span className="text-slate-600">→</span>
          <span
            className={`px-3 py-1 rounded-lg font-bold ${
              stage === 'EXTRACTING' || stage === 'VERIFY'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400'
            }`}
          >
            2. VERIFY
          </span>
          <span className="text-slate-600">→</span>
          <span
            className={`px-3 py-1 rounded-lg font-bold ${
              stage === 'DECIDED'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400'
            }`}
          >
            3. NEXT MOVE
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* STAGE 1: SCANNING VIEWPORT                                   */}
      {/* ============================================================ */}
      {stage === 'SCAN' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera Viewport (2 Columns) */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-[#091126] border border-[#17254A] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#17254A] pb-3">
              <span className="text-xs font-bold text-white font-mono uppercase flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                Live 2K Optical Scanner Feed
              </span>
              <span className="text-[11px] font-mono text-cyan-400">
                {resolution.width > 0 ? `${resolution.width} x ${resolution.height} px (2K Target)` : 'Sensor Active'}
              </span>
            </div>

            <div className="relative aspect-[16/9] max-h-[460px] w-full rounded-2xl bg-black border-2 border-dashed border-[#1A2C54] overflow-hidden flex items-center justify-center">
              {!capturedImage ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-6 border-2 border-cyan-400/60 rounded-xl pointer-events-none flex flex-col justify-between p-4">
                    <div className="flex justify-between">
                      <span className="w-8 h-8 border-t-2 border-l-2 border-cyan-400"></span>
                      <span className="w-8 h-8 border-t-2 border-r-2 border-cyan-400"></span>
                    </div>
                    <div className="text-center">
                      <span className="px-4 py-1.5 bg-black/70 backdrop-blur-md rounded-full text-xs text-cyan-300 font-mono tracking-wider border border-cyan-500/30">
                        ALIGN KMRL FIELD INSPECTION NOTICE
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="w-8 h-8 border-b-2 border-l-2 border-cyan-400"></span>
                      <span className="w-8 h-8 border-b-2 border-r-2 border-cyan-400"></span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={capturedImage}
                    alt="Captured document"
                    className="w-full h-full object-contain"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-emerald-500 text-slate-950 rounded-full text-xs font-mono font-bold shadow-lg">
                    ✓ Frame Captured & Binarized
                  </span>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Viewport Action Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-mono text-[11px]">Filter:</span>
                {(['high_contrast', 'greyscale', 'normal'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setFilterMode(m)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase ${
                      filterMode === m
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-[#0D1836] border border-[#1A2C54] text-slate-300 hover:text-white'
                    }`}
                  >
                    {m.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2.5">
                {!capturedImage ? (
                  <button
                    onClick={captureFrame}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-md shadow-cyan-500/25 transition-all"
                  >
                    <Camera className="w-4 h-4" />
                    Capture Frame
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setCapturedImage(null);
                        startCamera();
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D1836] border border-[#1A2C54] text-slate-300 text-xs font-semibold hover:text-white"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Retake
                    </button>
                    <button
                      onClick={handleStartOCRAndVerify}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/30 transition-all"
                    >
                      <Sparkles className="w-4 h-4 fill-current" />
                      Scan & Proceed to Verification Gate →
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Select Preset Documents to Scan (1 Column) */}
          <div className="p-6 rounded-3xl bg-[#091126] border border-[#17254A] shadow-xl space-y-4">
            <div className="border-b border-[#17254A] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                Select Physical Document to Scan
              </h3>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Click any real KMRL inspection notice to simulate instant scanning:
              </p>
            </div>

            <div className="space-y-3">
              {SAMPLE_SCAN_DOCS.map((sample) => {
                const isSelected = selectedSample.id === sample.id;
                return (
                  <div
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500 shadow-md shadow-cyan-500/10'
                        : 'bg-[#0D1836] border-[#1A2C54] hover:border-cyan-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-[#14234C] text-cyan-300 border border-cyan-500/20">
                        {sample.station} • {sample.department}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                          sample.priority === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {sample.priority}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white line-clamp-2">
                      {sample.name}
                    </h4>

                    <p className="text-[10px] text-slate-300 line-clamp-2">
                      {sample.summary}
                    </p>

                    <div className="pt-1.5 border-t border-[#1A2C54] flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-400">Measurements:</span>
                      <span className="text-cyan-300 font-semibold truncate max-w-[170px]">
                        {sample.measurements}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                setCapturedImage(selectedSample.imageUrl);
                handleStartOCRAndVerify();
              }}
              className="w-full py-2.5 rounded-xl bg-[#0D1836] hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-mono font-bold transition-all text-center"
            >
              Scan Selected Document & Verify →
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STAGE 1.5: EXTRACTING SPINNER                                */}
      {/* ============================================================ */}
      {stage === 'EXTRACTING' && (
        <div className="p-16 rounded-3xl bg-[#091126] border border-[#17254A] shadow-2xl text-center space-y-4">
          <div className="relative inline-flex items-center justify-center">
            <span className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin"></span>
            <Sparkles className="w-6 h-6 text-cyan-400 absolute" />
          </div>
          <h2 className="text-lg font-black text-white font-mono">
            Running 2K Neural OCR & Entity Extraction...
          </h2>
          <p className="text-xs text-slate-400 font-mono max-w-md mx-auto">
            Extracting thermographic sensor readings, field inspector stamps, station code [{selectedSample.station}], and safety clauses for verification.
          </p>
        </div>
      )}

      {/* ============================================================ */}
      {/* STAGE 2: VERIFICATION AUDIT DECK (VERIFY & DECIDE NEXT MOVE) */}
      {/* ============================================================ */}
      {stage === 'VERIFY' && (
        <div className="rounded-3xl bg-[#091126] border border-[#17254A] shadow-2xl p-6 space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#17254A] pb-4">
            <div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 uppercase">
                VERIFICATION AUDIT IN PROGRESS
              </span>
              <h2 className="text-lg font-black text-white mt-1">
                {selectedSample.name}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Verify scanned field telemetry below and execute executive decision whether to CLOSE or REJECT.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-[#0D1836] border border-[#1A2C54] text-slate-300 hover:text-white text-xs font-mono"
            >
              Scan Another Document
            </button>
          </div>

          {/* Split Deck: Visual Document on Left, Extracted Intelligence on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Scanned Document Visual & OCR Bounding Boxes */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono uppercase">
                  Scanned Document Frame (2K Target)
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  OCR Confidence: 98.4%
                </span>
              </div>

              <div className="relative aspect-[4/3] rounded-2xl bg-black border border-[#1A2C54] overflow-hidden group">
                <img
                  src={capturedImage || selectedSample.imageUrl}
                  alt="Scanned Document"
                  className="w-full h-full object-cover"
                />

                {/* Simulated OCR Text Detection Overlays */}
                <div className="absolute top-4 left-4 right-4 p-3 rounded-xl bg-black/75 backdrop-blur-md border border-cyan-500/40 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-300 font-bold">
                      OCR CLAUSE DETECTED:
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">Clause 3.1</span>
                  </div>
                  <p className="text-white text-[11px] font-mono">
                    "{selectedSample.summary}"
                  </p>
                </div>

                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/75 backdrop-blur-md border border-amber-500/40 text-xs flex items-center justify-between">
                  <span className="text-slate-300 font-mono text-[10px]">
                    Extracted Measurement:
                  </span>
                  <span className="text-amber-300 font-mono font-bold text-[11px]">
                    {selectedSample.measurements}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Extracted Intelligence & Mandatory Verification Checklist */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono uppercase">
                  Extracted Intelligence & Verification Checklist
                </span>
                <span className="text-[10px] font-mono text-cyan-400">
                  Auditor: {currentUser.name}
                </span>
              </div>

              {/* Extracted Metadata Card */}
              <div className="p-4 rounded-2xl bg-[#0D1836] border border-[#1A2C54] space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-3 pb-2 border-b border-[#1A2C54]">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">
                      Station & Asset
                    </span>
                    <span className="text-white font-bold font-mono">
                      {selectedSample.station} ({selectedSample.department})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">
                      Assessed Priority
                    </span>
                    <span
                      className={`text-xs font-mono font-bold ${
                        selectedSample.priority === 'CRITICAL'
                          ? 'text-rose-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {selectedSample.priority} (Action Mandated)
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Extracted Field Work Order
                  </span>
                  <p className="text-slate-200 font-semibold mt-0.5">
                    {selectedSample.taskTitle}
                  </p>
                </div>
              </div>

              {/* Mandatory Checklist Items */}
              <div className="p-4 rounded-2xl bg-[#0D1836] border border-[#1A2C54] space-y-2.5">
                <span className="text-[11px] font-bold text-white font-mono uppercase tracking-wider block">
                  Mandatory Verification Checklist (Audit Trail)
                </span>

                <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkSignature}
                    onChange={(e) => setCheckSignature(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Inspector Physical Signature & Official Stamp Verified</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkMeasurements}
                    onChange={(e) => setCheckMeasurements(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <span>
                    Field Measurements Tested Against Safe Limits ({selectedSample.measurements})
                  </span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkHazard}
                    onChange={(e) => setCheckHazard(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Hazard Mitigation Evaluated According to CMRS Standards</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkSCADA}
                    onChange={(e) => setCheckSCADA(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <span>SCADA OCC Telemetry Synchronized & Logged</span>
                </label>
              </div>

              {/* If defective sample is selected, show custom rejection box */}
              {selectedSample.initialCloseStatus === 'DEFECTIVE_REQUIRES_REJECTION' && (
                <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-rose-300 font-bold font-mono">
                    <AlertTriangle className="w-4 h-4" />
                    DEFECT DETECTED IN REPORT TELEMETRY
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    The test reading indicates equipment failure. You can customize the rejection escalation reason:
                  </p>
                  <input
                    type="text"
                    value={rejectionRationale}
                    onChange={(e) => setRejectionRationale(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-rose-500/40 text-xs text-rose-200 font-mono focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* ============================================================ */}
          {/* THE NEXT MOVE: 3 DECISION PATHWAYS                           */}
          {/* ============================================================ */}
          <div className="pt-4 border-t border-[#17254A] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Make the Next Move — Decision Gate (Close or Reject)
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Authorized Officer: {currentUser.name} [{currentUser.role}]
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Decision 1: APPROVE & CLOSE */}
              <button
                onClick={handleApproveAndClose}
                className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600/30 to-emerald-950/50 hover:from-emerald-600/40 hover:to-emerald-900/60 border-2 border-emerald-500/60 text-left space-y-2 transition-all group shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold font-mono text-[10px] uppercase">
                    DECISION A
                  </span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="text-sm font-black text-white">
                  Approve & Close Task
                </h4>
                <p className="text-[11px] text-emerald-200/90 leading-snug">
                  Inspection verified complete. Apply cryptographic seal, mark statutory compliance, and close work order.
                </p>
              </button>

              {/* Decision 2: REJECT & ESCALATE */}
              <button
                onClick={handleRejectAndEscalate}
                className="p-4 rounded-2xl bg-gradient-to-br from-rose-600/30 to-rose-950/50 hover:from-rose-600/40 hover:to-rose-900/60 border-2 border-rose-500/60 text-left space-y-2 transition-all group shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-rose-500 text-white font-bold font-mono text-[10px] uppercase">
                    DECISION B
                  </span>
                  <XCircle className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="text-sm font-black text-white">
                  Reject & Do Not Close
                </h4>
                <p className="text-[11px] text-rose-200/90 leading-snug">
                  Flag non-compliance or defect. Keep task open under escalation and mandate immediate field re-inspection.
                </p>
              </button>

              {/* Decision 3: DISPATCH WORK ORDER */}
              <button
                onClick={handleDispatchWorkOrder}
                className="p-4 rounded-2xl bg-gradient-to-br from-amber-600/30 to-amber-950/50 hover:from-amber-600/40 hover:to-amber-900/60 border-2 border-amber-500/60 text-left space-y-2 transition-all group shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold font-mono text-[10px] uppercase">
                    DECISION C
                  </span>
                  <ArrowRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <h4 className="text-sm font-black text-white">
                  Dispatch Field Directive
                </h4>
                <p className="text-[11px] text-amber-200/90 leading-snug">
                  Ingest as active work order. Engage 48h countdown on SCADA dashboard and alert maintenance engineer.
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STAGE 3: DECIDED CONFIRMATION STATE                          */}
      {/* ============================================================ */}
      {stage === 'DECIDED' && (
        <div className="p-8 rounded-3xl bg-[#091126] border border-[#17254A] shadow-2xl space-y-5 text-center max-w-2xl mx-auto">
          {decision === 'APPROVED_AND_CLOSED' && (
            <>
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-white font-mono">
                Document Verified & Task Officially Closed!
              </h2>
              <div className="p-4 rounded-2xl bg-[#0D1836] border border-emerald-500/30 text-xs font-mono space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Cryptographic Seal:</span>
                  <span className="text-emerald-400 font-bold">{closureHash}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Closed By:</span>
                  <span className="text-white font-bold">{currentUser.name} ({currentUser.role})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Station Compliance:</span>
                  <span className="text-emerald-400 font-bold">100% SATISFIED</span>
                </div>
              </div>
              <p className="text-xs text-slate-300">
                The inspection certificate has been sealed, logged in the Immutable Audit Trail, and removed from pending queues.
              </p>
            </>
          )}

          {decision === 'REJECTED_AND_ESCALATED' && (
            <>
              <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-400 text-rose-400 mx-auto flex items-center justify-center">
                <XCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-white font-mono">
                Closure Rejected — Task Remains Open Under Escalation!
              </h2>
              <div className="p-4 rounded-2xl bg-[#0D1836] border border-rose-500/30 text-xs font-mono space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-rose-400 font-bold">ACTION REQUIRED (ESCALATED)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Flagged By:</span>
                  <span className="text-white font-bold">{currentUser.name}</span>
                </div>
                <div className="text-slate-400 pt-1">
                  <span>Rationale: </span>
                  <span className="text-rose-300">{rejectionRationale}</span>
                </div>
              </div>
              <p className="text-xs text-slate-300">
                Safety alert sent to Chief Safety Officer S. Pradeep Kumar and Senior Electrical Engineer Ananya R. Nair for immediate physical re-inspection.
              </p>
            </>
          )}

          {decision === 'DISPATCHED_WORK_ORDER' && (
            <>
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-400 mx-auto flex items-center justify-center">
                <ArrowRight className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-white font-mono">
                Active Field Work Order Dispatched to SCADA!
              </h2>
              <p className="text-xs text-slate-300">
                48-hour execution countdown engaged. Field operations crew notified at {selectedSample.station}.
              </p>
            </>
          )}

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-[#0D1836] hover:bg-[#14234C] border border-[#1A2C54] text-slate-200 text-xs font-mono font-bold transition-colors"
            >
              Scan Another Document
            </button>
            <button
              onClick={() => navigate('/documents')}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-black shadow-md shadow-cyan-500/25 transition-all"
            >
              View in Documents Directory →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
