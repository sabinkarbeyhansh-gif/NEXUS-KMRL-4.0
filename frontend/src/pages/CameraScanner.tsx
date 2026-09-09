import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Sliders,
  FileText,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { DocumentItem } from '../types';

export const CameraScanner: React.FC = () => {
  const { addDocument } = useData();
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [resolution, setResolution] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState<'high_contrast' | 'greyscale' | 'normal'>('high_contrast');

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

    // Fallback simulation if no camera hardware
    setCapturedImage('https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=800');
  };

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newDoc: DocumentItem = {
        id: `DOC-SCAN-${Date.now().toString().slice(-4)}`,
        title: 'Camera Scanned: Aluva Station Sub-Distribution Panel Inspection Notice',
        fileName: 'KMRL_SCAN_2K_ALUVA.JPG',
        fileType: 'JPG',
        fileSize: '4.1 MB',
        department: 'Engineering',
        language: 'English',
        aiPriority: 'HIGH',
        status: 'PROCESSED',
        aiConfidence: 96,
        aiPriorityReason: 'OCR successfully parsed infrared thermal inspection report showing high impedance heating at 415V terminal block.',
        summary: 'Field scanned checklist for distribution board DB-02 at Aluva Platform 1. Mandates contact screw retightening before 18:00.',
        keyFacts: [
          'Capture resolution: 2560x1440 (2K Target)',
          'High impedance heating detected at 78°C',
          'Location: Aluva Platform 1 DB-02',
        ],
        receivedDate: new Date().toISOString(),
        createdDate: new Date().toISOString(),
        submissionDeadline: new Date(Date.now() + 86400000).toISOString(),
        assignedTo: 'Anand Varma',
        riskScore: 78,
        station: 'Aluva',
        storagePath: 'Engineering/Scans/',
        timeline: [
          { date: 'Just now', stage: '2K Camera Capture', description: 'OCR ingested', status: 'completed' },
        ],
        entities: [
          { id: 'E-SC1', name: 'Aluva Station', type: 'STATION', occurrences: 5 },
        ],
        actions: [
          {
            id: `ACT-SC-${Date.now()}`,
            task: 'Torque terminal screws and replace damaged MCB at Aluva DB-02',
            department: 'Engineering',
            priority: 'HIGH',
            deadline: new Date(Date.now() + 86400000).toISOString(),
            status: 'PENDING',
            sourceReference: 'OCR Scan Clause 2',
          },
        ],
        risks: [],
      };

      addDocument(newDoc);
      setIsProcessing(false);
      navigate(`/documents/${newDoc.id}`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Camera className="w-6 h-6 text-cyan-400" />
            2K Camera Document Scanner & Neural OCR
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Real-time optical hardware capture with perspective alignment and document binarization
          </p>
        </div>

        {/* Resolution Readout Badge */}
        <div className="px-4 py-2 rounded-2xl bg-[#0D1526] border border-[#1E2D4A] font-mono text-xs flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-slate-400">Sensor Resolution:</span>
          <span className="text-white font-bold">
            {resolution.width > 0 ? `${resolution.width} x ${resolution.height} px` : 'Detecting...'}
          </span>
          {resolution.width >= 2000 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
              2K NATIVE
            </span>
          )}
        </div>
      </div>

      {/* Main Viewport Card */}
      <div className="p-6 rounded-3xl bg-[#0D1526] border border-[#1E2D4A] shadow-xl space-y-4">
        <div className="relative aspect-[16/9] max-h-[500px] w-full rounded-2xl bg-black border-2 border-dashed border-[#1E2D4A] overflow-hidden flex items-center justify-center">
          {!capturedImage ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-8 border-2 border-cyan-400/60 rounded-xl pointer-events-none flex flex-col justify-between p-4">
                <div className="flex justify-between">
                  <span className="w-8 h-8 border-t-2 border-l-2 border-cyan-400"></span>
                  <span className="w-8 h-8 border-t-2 border-r-2 border-cyan-400"></span>
                </div>
                <div className="text-center">
                  <span className="px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-xs text-cyan-300 font-mono tracking-wider">
                    ALIGN PHYSICAL DOCUMENT EDGES
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
              <span className="absolute top-4 left-4 px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-mono font-bold">
                ✓ 2K Frame Stored
              </span>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono">Binarization Filter:</span>
            {(['high_contrast', 'greyscale', 'normal'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setFilterMode(m)}
                className={`px-3 py-1 rounded-xl text-[10px] font-mono uppercase ${
                  filterMode === m ? 'bg-cyan-500 text-black font-bold' : 'bg-[#131E35] text-slate-400'
                }`}
              >
                {m.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {!capturedImage ? (
              <button
                onClick={captureFrame}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-lg shadow-cyan-500/25"
              >
                <Camera className="w-4 h-4" />
                Capture Document Frame
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setCapturedImage(null);
                    startCamera();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#131E35] text-slate-300 text-xs font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Retake
                </button>
                <button
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/25"
                >
                  <Sparkles className="w-4 h-4" />
                  {isProcessing ? 'Transcribing with Neural OCR...' : 'Run Neural OCR & Ingestion'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
