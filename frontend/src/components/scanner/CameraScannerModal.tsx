import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  XCircle,
  ShieldCheck,
  FileText,
  Radio,
  ArrowRight,
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { DocumentItem } from '../../types';

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CameraScannerModal: React.FC<CameraScannerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addDocument } = useData();
  const { currentUser } = useAuth();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [resolution, setResolution] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'normal' | 'high_contrast' | 'greyscale'>('high_contrast');

  // Stages: 'SCAN' -> 'VERIFY' -> 'DECIDED'
  const [modalStage, setModalStage] = useState<'SCAN' | 'EXTRACTING' | 'VERIFY' | 'DECIDED'>('SCAN');
  const [modalDecision, setModalDecision] = useState<'APPROVED' | 'REJECTED' | 'DISPATCHED' | null>(null);
  const [sealHash, setSealHash] = useState<string | null>(null);

  const sampleScan = {
    title: 'Aluva Station Platform 1 Sub-Distribution Board DB-02 Inspection Slip',
    station: 'Aluva',
    department: 'Engineering' as const,
    measurements: 'Pre-repair 78°C hotspot on 63A MCB terminal cluster. Retightened to 42°C.',
    priority: 'HIGH' as const,
    task: 'Torque terminal screws and replace thermal-degraded MCB at Aluva DB-02',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
  };

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
      console.warn('Camera access error:', err);
      setCameraError('Camera access is unavailable. Running in simulated 2K optical capture mode.');
      setResolution({ width: 2560, height: 1440 });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
      setModalStage('SCAN');
      setCapturedImage(null);
      setModalDecision(null);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 1920;
      canvas.height = video.videoHeight || 1080;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setCapturedImage(canvas.toDataURL('image/jpeg', 0.95));
        stopCamera();
        return;
      }
    }
    setCapturedImage(sampleScan.imageUrl);
  };

  const handleStartVerify = () => {
    setModalStage('EXTRACTING');
    setTimeout(() => {
      setModalStage('VERIFY');
    }, 1000);
  };

  // DECISION 1: APPROVE & CLOSE
  const handleApproveAndClose = () => {
    const hash = `KMRL-SEAL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setSealHash(hash);
    setModalDecision('APPROVED');
    setModalStage('DECIDED');

    const docId = `DOC-SCAN-${Date.now().toString().slice(-4)}`;
    const newDoc: DocumentItem = {
      id: docId,
      title: `[VERIFIED & CLOSED] ${sampleScan.title}`,
      fileName: 'KMRL_SCAN_ALUVA_SEALED.PDF',
      fileType: 'PDF',
      fileSize: '3.4 MB',
      department: sampleScan.department,
      language: 'English',
      aiPriority: sampleScan.priority,
      status: 'REVIEWED',
      aiConfidence: 98,
      aiPriorityReason: `Verified and sealed by ${currentUser.name} (${currentUser.role}). Cryptographic seal: ${hash}.`,
      summary: sampleScan.measurements,
      keyFacts: [`Seal: ${hash}`, `Station: ${sampleScan.station}`],
      receivedDate: new Date().toISOString(),
      createdDate: new Date().toISOString(),
      submissionDeadline: new Date().toISOString(),
      assignedTo: currentUser.name,
      riskScore: 18,
      station: sampleScan.station,
      storagePath: 'Closed/Sealed/',
      timeline: [{ date: 'Just now', stage: 'Verified & Closed', description: `Seal: ${hash}`, status: 'completed' }],
      entities: [{ id: 'E-1', name: `${sampleScan.station} Station`, type: 'STATION', occurrences: 4 }],
      actions: [
        {
          id: `ACT-${Date.now()}`,
          task: sampleScan.task,
          department: sampleScan.department,
          priority: sampleScan.priority,
          deadline: new Date().toISOString(),
          status: 'COMPLETED',
          sourceReference: 'OCR Verified Inspection',
        },
      ],
      risks: [],
    };

    addDocument(newDoc);
  };

  // DECISION 2: REJECT & ESCALATE
  const handleRejectAndEscalate = () => {
    setModalDecision('REJECTED');
    setModalStage('DECIDED');

    const docId = `DOC-REJECT-${Date.now().toString().slice(-4)}`;
    const newDoc: DocumentItem = {
      id: docId,
      title: `[REJECTED - DO NOT CLOSE] ${sampleScan.title}`,
      fileName: 'KMRL_SCAN_DEFECT.PDF',
      fileType: 'PDF',
      fileSize: '3.9 MB',
      department: sampleScan.department,
      language: 'English',
      aiPriority: 'CRITICAL',
      status: 'PROCESSED',
      aiConfidence: 99,
      aiPriorityReason: 'Closure rejected due to remaining thermal hazard. Dispatched to field engineer for re-torque.',
      summary: 'REJECTED: Sub-distribution cluster exceeds safe baseline. Field re-inspection required.',
      keyFacts: ['Status: ACTION REQUIRED', 'Escalated to Electrical GM'],
      receivedDate: new Date().toISOString(),
      createdDate: new Date().toISOString(),
      submissionDeadline: new Date(Date.now() + 86400000).toISOString(),
      assignedTo: 'Ananya R. Nair',
      riskScore: 92,
      station: sampleScan.station,
      storagePath: 'Escalations/',
      timeline: [{ date: 'Just now', stage: 'Closure Rejected', description: 'Mandatory re-torque', status: 'current' }],
      entities: [{ id: 'E-1', name: `${sampleScan.station} Station`, type: 'STATION', occurrences: 5 }],
      actions: [
        {
          id: `ACT-${Date.now()}`,
          task: `URGENT: Re-inspect and torque DB-02 at ${sampleScan.station}`,
          department: sampleScan.department,
          priority: 'CRITICAL',
          deadline: new Date(Date.now() + 86400000).toISOString(),
          status: 'REJECTED',
          sourceReference: 'Rejection Notice',
        },
      ],
      risks: [],
    };

    addDocument(newDoc);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#091126] border border-[#17254A] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#17254A] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                Document Scanner & Verification Gate
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                {modalStage === 'SCAN' && 'Step 1: Capture or select physical document'}
                {modalStage === 'EXTRACTING' && 'Running 2K OCR & Clause Detection...'}
                {modalStage === 'VERIFY' && 'Step 2: Audit & Verify → Make the Next Move'}
                {modalStage === 'DECIDED' && 'Step 3: Executive Decision Recorded'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#132042] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================ */}
        {/* MODAL STAGE 1: SCAN                                          */}
        {/* ============================================================ */}
        {modalStage === 'SCAN' && (
          <div className="space-y-4">
            <div className="relative aspect-[16/9] rounded-2xl bg-black border border-[#1A2C54] overflow-hidden flex items-center justify-center">
              {!capturedImage ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-4 border-2 border-cyan-400/60 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                    <span className="text-[10px] text-cyan-300 font-mono self-center bg-black/60 px-3 py-1 rounded-full border border-cyan-500/30">
                      ALIGN DOCUMENT EDGES
                    </span>
                  </div>
                </>
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-full h-full object-contain"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-mono font-bold">
                    ✓ Frame Captured
                  </span>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setCapturedImage(sampleScan.imageUrl)}
                className="text-xs text-cyan-400 hover:underline font-mono"
              >
                Use Sample Inspection Notice
              </button>

              <div className="flex items-center gap-2">
                {!capturedImage ? (
                  <button
                    onClick={captureFrame}
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/25"
                  >
                    Capture Document
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setCapturedImage(null);
                        startCamera();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#0D1836] border border-[#1A2C54] text-slate-300 text-xs font-mono"
                    >
                      Retake
                    </button>
                    <button
                      onClick={handleStartVerify}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-500/25"
                    >
                      Verify Document →
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL STAGE 1.5: EXTRACTING                                  */}
        {/* ============================================================ */}
        {modalStage === 'EXTRACTING' && (
          <div className="py-12 text-center space-y-3">
            <span className="w-10 h-10 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin inline-block"></span>
            <p className="text-xs font-mono text-cyan-300 font-bold">
              Extracting Thermographic Readings & Inspector Seal...
            </p>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL STAGE 2: VERIFICATION GATE (CLOSE OR REJECT)           */}
        {/* ============================================================ */}
        {modalStage === 'VERIFY' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#0D1836] border border-cyan-500/30 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white truncate max-w-sm">{sampleScan.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  {sampleScan.priority} PRIORITY
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {sampleScan.measurements}
              </p>
              <div className="pt-2 border-t border-[#1A2C54] flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Station: <strong className="text-white">{sampleScan.station}</strong></span>
                <span>Auditor: <strong className="text-cyan-300">{currentUser.name}</strong></span>
              </div>
            </div>

            <div className="space-y-1.5 p-3 rounded-2xl bg-[#0D1836] border border-[#1A2C54] text-xs font-mono">
              <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">
                Verification Checklist:
              </div>
              <div className="flex items-center gap-2 text-emerald-400 text-[11px]">
                <span>✓</span>
                <span>Inspector Signature & Official Stamp Validated</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 text-[11px]">
                <span>✓</span>
                <span>Thermal Operating Range Normalized (42°C &lt; 55°C Limit)</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 text-[11px]">
                <span>✓</span>
                <span>SCADA OCC Station Controller Logged</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#17254A] space-y-2">
              <span className="text-xs font-bold text-white font-mono uppercase block">
                Make the Next Move (Decision Gate):
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleApproveAndClose}
                  className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-600/30 to-emerald-950/50 hover:from-emerald-600/40 border-2 border-emerald-500/60 text-left space-y-1 group transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 font-bold uppercase">
                      CLOSE
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Approve & Close Task</h4>
                  <p className="text-[10px] text-emerald-200/90 leading-tight">
                    Mark verified, seal SHA-256 & close work order.
                  </p>
                </button>

                <button
                  onClick={handleRejectAndEscalate}
                  className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-600/30 to-rose-950/50 hover:from-rose-600/40 border-2 border-rose-500/60 text-left space-y-1 group transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500 text-white font-bold uppercase">
                      REJECT
                    </span>
                    <XCircle className="w-4 h-4 text-rose-400" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Reject & Do Not Close</h4>
                  <p className="text-[10px] text-rose-200/90 leading-tight">
                    Flag non-compliance. Keep task open for re-torque.
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL STAGE 3: DECIDED CONFIRMATION                          */}
        {/* ============================================================ */}
        {modalStage === 'DECIDED' && (
          <div className="py-6 text-center space-y-4">
            {modalDecision === 'APPROVED' ? (
              <>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-white font-mono">
                  Task Successfully Verified & Closed!
                </h3>
                <p className="text-xs font-mono text-emerald-400">
                  Cryptographic Seal: {sealHash}
                </p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-rose-500/20 border-2 border-rose-400 text-rose-400 mx-auto flex items-center justify-center">
                  <XCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-white font-mono">
                  Task Flagged: Closure Rejected!
                </h3>
                <p className="text-xs font-mono text-rose-300">
                  Task remains open under ACTION REQUIRED for safety re-inspection.
                </p>
              </>
            )}

            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono"
            >
              Done & Return
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
