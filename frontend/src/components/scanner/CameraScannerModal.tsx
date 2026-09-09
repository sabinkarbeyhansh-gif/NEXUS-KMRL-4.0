import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Sliders,
  Maximize2,
  FileText,
  Upload,
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [resolution, setResolution] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState<'normal' | 'high_contrast' | 'greyscale'>('high_contrast');
  const [target2K, setTarget2K] = useState<boolean>(true);

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      // Request high resolution (targeting 2560x1440 or 1920x1080)
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: target2K ? 2560 : 1920 },
          height: { ideal: target2K ? 1440 : 1080 },
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
      setCameraError('Camera access is unavailable. Please check permissions or upload a scanned image file.');
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
    } else {
      stopCamera();
      setCapturedImage(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, target2K]);

  // Capture current frame from video stream
  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1920;
    canvas.height = video.videoHeight || 1080;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Apply document contrast / binarization filter
    ctx.filter =
      filterMode === 'high_contrast'
        ? 'contrast(180%) brightness(110%) grayscale(40%)'
        : filterMode === 'greyscale'
        ? 'grayscale(100%) contrast(150%)'
        : 'none';

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Run OCR & Ingestion Pipeline on captured document
  const handleProcessDocument = async () => {
    setIsProcessing(true);
    // Simulate high-fidelity OCR & AI Extraction
    setTimeout(() => {
      const scannedDoc: DocumentItem = {
        id: `DOC-SCAN-${Date.now().toString().slice(-4)}`,
        title: 'Camera Scanned: Aluva Station Sub-Distribution Panel Inspection Notice',
        fileName: `KMRL_SCAN_${Date.now().toString().slice(-4)}.JPG`,
        fileType: 'JPG',
        fileSize: '3.4 MB',
        department: 'Engineering',
        language: 'English',
        aiPriority: 'HIGH',
        status: 'PROCESSED',
        aiConfidence: 95,
        aiPriorityReason: 'OCR successfully extracted technical thermal imaging reading showing 78°C hotspot on MCB breaker cluster at Aluva platform 1 DB.',
        summary: 'Field scanned inspection slip identifying localized overheating on 415V feeder breaker. Action required to prevent unannounced tripping during evening peak hours.',
        keyFacts: [
          'Scanned resolution: ' + resolution.width + 'x' + resolution.height + ' px',
          'Breaker hotspot detected at 78°C (Normal: < 55°C)',
          'Location: Aluva Station Platform 1 DB-02',
          'Responsible: Electrical Maintenance Team',
        ],
        receivedDate: new Date().toISOString(),
        createdDate: new Date().toISOString(),
        submissionDeadline: new Date(Date.now() + 86400000).toISOString(),
        assignedTo: 'Anand Varma',
        riskScore: 78,
        station: 'Aluva',
        storagePath: 'Engineering/Scans/KMRL_SCAN.JPG',
        timeline: [
          { date: 'Just now', stage: 'Camera OCR Captured', description: `2K Camera sensor feed (${resolution.width}x${resolution.height})`, status: 'completed' },
          { date: 'Just now', stage: 'AI Entity Extracted', description: 'Matched DB-02 at Aluva Platform 1', status: 'completed' },
          { date: 'In 24h', stage: 'Breaker Replacement', description: 'Work order dispatch deadline', status: 'current' },
        ],
        entities: [
          { id: 'ENT-SC-1', name: 'Aluva Station', type: 'STATION', occurrences: 6 },
          { id: 'ENT-SC-2', name: 'Distribution Board DB-02', type: 'ASSET', occurrences: 9 },
        ],
        actions: [
          {
            id: `ACT-SCAN-${Date.now().toString().slice(-3)}`,
            task: 'Thermographic re-check and breaker replacement at Aluva DB-02',
            department: 'Engineering',
            assignedPerson: 'Anand Varma',
            priority: 'HIGH',
            deadline: new Date(Date.now() + 86400000).toISOString(),
            status: 'PENDING',
            evidenceRequired: 'Infrared thermography certificate after load test',
            sourceReference: 'OCR Extracted Paragraph 2',
          },
        ],
        risks: [
          {
            id: `RSK-SCAN-${Date.now().toString().slice(-3)}`,
            title: '415V Panel Thermal Runaway Hazard',
            description: 'Unchecked hotspot could melt terminal insulation and cause station lighting blackout.',
            severity: 'HIGH',
            category: 'INFRASTRUCTURE',
            station: 'Aluva',
            recommendedMitigation: 'Torque terminal screws and replace damaged 63A MCB before 18:00.',
            sourceReference: 'OCR Field Notice',
          },
        ],
      };

      addDocument(scannedDoc);
      setIsProcessing(false);
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0D1526] border border-[#1E2D4A] p-6 shadow-2xl space-y-5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                CAMERA <span className="text-cyan-400">DOCUMENT SCANNER</span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Hardware Resolution:{' '}
                <span className="text-cyan-400 font-bold">
                  {resolution.width > 0 ? `${resolution.width} x ${resolution.height} px` : 'Detecting sensor...'}
                </span>{' '}
                {resolution.width >= 2000 ? '(2K Native)' : resolution.width > 0 ? '(HD Capture)' : ''}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#131E35]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport: Live Stream or Captured Image */}
        <div className="relative aspect-[4/3] rounded-2xl bg-black border-2 border-dashed border-[#1E2D4A] overflow-hidden flex items-center justify-center">
          {cameraError ? (
            <div className="text-center p-6 space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
              <p className="text-xs text-slate-300 max-w-sm">{cameraError}</p>
              <button
                onClick={startCamera}
                className="px-4 py-2 rounded-xl bg-[#131E35] text-cyan-300 border border-cyan-500/40 text-xs font-semibold"
              >
                Retry Camera Access
              </button>
            </div>
          ) : !capturedImage ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${
                  filterMode === 'high_contrast'
                    ? 'contrast-150 grayscale-[30%]'
                    : filterMode === 'greyscale'
                    ? 'grayscale'
                    : ''
                }`}
              />
              {/* Document Alignment Frame Overlay */}
              <div className="absolute inset-8 border-2 border-cyan-400/60 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                <div className="flex justify-between">
                  <span className="w-6 h-6 border-t-2 border-l-2 border-cyan-400"></span>
                  <span className="w-6 h-6 border-t-2 border-r-2 border-cyan-400"></span>
                </div>
                <div className="text-center">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] text-cyan-300 font-mono tracking-wider">
                    ALIGN DOCUMENT EDGES HERE
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="w-6 h-6 border-b-2 border-l-2 border-cyan-400"></span>
                  <span className="w-6 h-6 border-b-2 border-r-2 border-cyan-400"></span>
                </div>
              </div>
            </>
          ) : (
            <div className="relative w-full h-full">
              <img
                src={capturedImage}
                alt="Captured Document"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold font-mono">
                ✓ FRAME CAPTURED ({resolution.width}x{resolution.height})
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls: Filter selectors & action buttons */}
        <div className="flex items-center justify-between pt-2">
          {/* Filter options */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">Enhancement:</span>
            {(['high_contrast', 'greyscale', 'normal'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setFilterMode(m)}
                className={`text-[10px] px-2.5 py-1 rounded-lg font-mono uppercase transition-colors ${
                  filterMode === m
                    ? 'bg-cyan-500 text-black font-bold'
                    : 'bg-[#131E35] text-slate-300 hover:text-white'
                }`}
              >
                {m.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Action triggers */}
          <div className="flex items-center gap-3">
            {!capturedImage ? (
              <button
                onClick={captureFrame}
                disabled={Boolean(cameraError)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                Capture Document
              </button>
            ) : (
              <>
                <button
                  onClick={handleRetake}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#131E35] hover:bg-[#1E2D4A] text-slate-300 text-xs font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Retake
                </button>
                <button
                  onClick={handleProcessDocument}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  {isProcessing ? 'Running OCR & AI...' : 'Process Document'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
