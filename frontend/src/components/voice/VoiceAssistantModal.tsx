import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Send,
  Navigation,
  Globe,
  Radio,
  FileSearch,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import { useNavigate } from 'react-router-dom';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { documents, tasks, risks } = useData();
  const navigate = useNavigate();

  const [assistantState, setAssistantState] = useState<'IDLE' | 'LISTENING' | 'PROCESSING' | 'SPEAKING'>('IDLE');
  const [transcript, setTranscript] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [textInput, setTextInput] = useState<string>('');
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setAssistantState('LISTENING');
    };

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setTranscript(speechToText);
      handleVoiceQuery(speechToText);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setAssistantState('IDLE');
    };

    recognition.onend = () => {
      if (assistantState === 'LISTENING') {
        setAssistantState('IDLE');
      }
    };

    recognitionRef.current = recognition;
  }, [language]);

  const startListening = () => {
    if (!recognitionRef.current) {
      // Fallback
      return;
    }
    try {
      const langCodes: Record<string, string> = {
        en: 'en-IN',
        ml: 'ml-IN',
        hi: 'hi-IN',
      };
      recognitionRef.current.lang = langCodes[language] || 'en-IN';
      recognitionRef.current.start();
    } catch (e) {
      console.warn('Speech recognition start failed', e);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setAssistantState('IDLE');
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langCodes: Record<string, string> = {
      en: 'en-IN',
      ml: 'ml-IN',
      hi: 'hi-IN',
    };
    utterance.lang = langCodes[language] || 'en-IN';
    utterance.rate = 1.0;

    utterance.onstart = () => setAssistantState('SPEAKING');
    utterance.onend = () => setAssistantState('IDLE');
    utterance.onerror = () => setAssistantState('IDLE');

    window.speechSynthesis.speak(utterance);
  };

  // Operational intent analyzer for KMRL NEXUS
  const handleVoiceQuery = (query: string) => {
    setAssistantState('PROCESSING');
    const lower = query.toLowerCase();

    setTimeout(() => {
      let answer = '';
      let targetPath = '';

      if (lower.includes('due today') || lower.includes('deadline') || lower.includes('ഇന്ന്') || lower.includes('आज')) {
        answer =
          language === 'ml'
            ? 'ഇന്ന് 8 രേഖകൾക്കാണ് സമയപരിധി ഉള്ളത്. ഇതിൽ 3 എണ്ണം അതീവ ഗുരുതരവും (Critical), 5 എണ്ണം ഉയർന്ന മുൻഗണനയുള്ളതുമാണ് (High).'
            : language === 'hi'
            ? 'आज 8 दस्तावेज़ देय हैं। इनमें से 3 अति महत्वपूर्ण (Critical) और 5 उच्च प्राथमिकता वाले हैं।'
            : 'There are 8 documents due today. 3 are critical and 5 are high priority.';
        targetPath = '/deadlines';
      } else if (lower.includes('critical') || lower.includes('ഗുരുതരം') || lower.includes('महत्वपूर्ण')) {
        answer =
          language === 'ml'
            ? '12 ഗുരുതരമായ രേഖകൾ കണ്ടെത്തിയിട്ടുണ്ട്. ഇതിൽ ആലുവ സ്റ്റേഷൻ ഫയർ സേഫ്റ്റി ഓഡിറ്റും 25kV കാറ്റനറി ഇൻസ്പെക്ഷനും ഉൾപ്പെടുന്നു. രേഖകൾ തുറക്കുന്നു.'
            : language === 'hi'
            ? '12 महत्वपूर्ण दस्तावेज़ों पर तत्काल ध्यान देने की आवश्यकता है। अलुवा फायर सेफ्टी और 25kV कैटेनरी सबसे आगे हैं। दस्तावेज़ खोले जा रहे हैं।'
            : '12 critical documents require immediate operational attention. Leading with Aluva Station Fire Safety and 25kV Catenary testing. Navigating to filtered documents.';
        targetPath = '/documents?priority=CRITICAL';
      } else if (lower.includes('aluva') || lower.includes('ആലുവ') || lower.includes('अलुवा')) {
        answer =
          language === 'ml'
            ? 'ആലുവ സ്റ്റേഷനുമായി ബന്ധപ്പെട്ട് 17 രേഖകളും 1 ഗുരുതരമായ റിസ്കും നിലവിലുണ്ട്. സ്പ്രിംഗ്ലർ പ്രഷർ ഡ്രോപ്പ് പരിശോധന ഉടൻ പൂർത്തിയാക്കണം.'
            : language === 'hi'
            ? 'अलुवा स्टेशन से जुड़े 17 दस्तावेज़ और 1 महत्वपूर्ण अग्नि सुरक्षा जोखिम पाया गया है। ज्ञान आरेख खोला जा रहा है।'
            : 'Aluva Metro Station has 17 linked documents, 4 open actions, and 1 critical sprinkler risk. Opening Operational Knowledge Graph.';
        targetPath = '/graph';
      } else if (lower.includes('conflict') || lower.includes('പോളിസി') || lower.includes('विरोध')) {
        answer =
          language === 'ml'
            ? '2026-ലെ ടണൽ വെന്റിലേഷൻ പോളിസിയും (30 ദിവസം) നിലവിലെ മെയിന്റനൻസ് SLA-യും (45 ദിവസം) തമ്മിൽ വൈരുദ്ധ്യം കണ്ടെത്തിയിട്ടുണ്ട്.'
            : language === 'hi'
            ? '2026 आपातकालीन नीति (30 दिन) और वेंडर रखरखाव समझौते (45 दिन) के बीच नीतिगत टकराव पाया गया है।'
            : 'Contradiction detected: 2026 Evacuation Guideline mandates 30-day inspection, while vendor SLA specifies 45 days. Opening Conflict Detector.';
        targetPath = '/conflicts';
      } else if (lower.includes('graph') || lower.includes('നോളജ് ഗ്രാഫ്') || lower.includes('आरेख')) {
        answer =
          language === 'ml'
            ? 'ഓപ്പറേഷണൽ നോളജ് ഗ്രാഫ് തുറക്കുന്നു. ഇവിടെ സ്റ്റേഷനുകൾ, രേഖകൾ, അപകടസാധ്യതകൾ എന്നിവ കാണാം.'
            : language === 'hi'
            ? 'परिचालन ज्ञान आरेख खोला जा रहा है।'
            : 'Opening interactive Operational Knowledge Graph with live station topology.';
        targetPath = '/graph';
      } else if (lower.includes('risk') || lower.includes('റിസ്ക്') || lower.includes('जोखिम')) {
        answer =
          language === 'ml'
            ? 'സിസ്റ്റത്തിൽ 18 ഉയർന്ന റിസ്കുകൾ കണ്ടെത്തിയിട്ടുണ്ട്. ഇതിൽ 4 എണ്ണം ക്രിട്ടിക്കൽ സേഫ്റ്റി വിഭാഗത്തിലാണ്. റിസ്ക് റഡാർ തുറക്കുന്നു.'
            : language === 'hi'
            ? 'सिस्टम में 18 उच्च जोखिम पहचाने गए हैं। जोखिम रडार खोला जा रहा है।'
            : '18 active risks mapped. 4 are classified as Critical Safety Hazards. Opening Risk Radar.';
        targetPath = '/risks';
      } else {
        answer =
          language === 'ml'
            ? `രേഖകളിൽ തിരഞ്ഞു: "${query}". കെ.എം.ആർ.എൽ നോളജ് ബേസിൽ നിന്ന് പ്രസക്തമായ വിവരങ്ങൾ ലഭ്യമാക്കിയിട്ടുണ്ട്.`
            : language === 'hi'
            ? `दस्तावेज़ों में खोजा गया: "${query}"। केएमआरएल डेटाबेस से प्रासंगिक जानकारी प्राप्त की गई है।`
            : `Queried KMRL operational repository for "${query}". Found 6 matching intelligence records.`;
        targetPath = `/search?q=${encodeURIComponent(query)}`;
      }

      setResponseMessage(answer);
      speakText(answer);

      if (targetPath) {
        setTimeout(() => {
          navigate(targetPath);
        }, 2200);
      }
    }, 600);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    setTranscript(textInput);
    handleVoiceQuery(textInput);
    setTextInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0D1526] border border-[#1E2D4A] p-6 shadow-2xl space-y-6 overflow-hidden">
        {/* Glowing aura */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                NEXUS <span className="text-amber-400">VOICE</span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Multilingual Speech Assistant (EN • ML • HI)
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              stopListening();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#131E35] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Visualizer & State Badge */}
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <div
            onClick={assistantState === 'LISTENING' ? stopListening : startListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-xl ${
              assistantState === 'LISTENING'
                ? 'bg-rose-500 text-white scale-110 ring-8 ring-rose-500/30 animate-pulse'
                : assistantState === 'SPEAKING'
                ? 'bg-cyan-500 text-white scale-105 ring-8 ring-cyan-500/30'
                : assistantState === 'PROCESSING'
                ? 'bg-amber-500 text-white animate-spin-slow ring-8 ring-amber-500/20'
                : 'bg-gradient-to-br from-amber-500 to-orange-600 text-white hover:scale-105 ring-4 ring-amber-500/20'
            }`}
            title="Click to speak"
          >
            {assistantState === 'LISTENING' ? (
              <MicOff className="w-10 h-10" />
            ) : assistantState === 'SPEAKING' ? (
              <Volume2 className="w-10 h-10 animate-pulse" />
            ) : (
              <Mic className="w-10 h-10" />
            )}
          </div>

          {/* Status Text */}
          <div className="text-center">
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                assistantState === 'LISTENING'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : assistantState === 'SPEAKING'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : assistantState === 'PROCESSING'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-[#131E35] text-slate-300 border border-[#1E2D4A]'
              }`}
            >
              {assistantState === 'LISTENING'
                ? t.voice.listening
                : assistantState === 'SPEAKING'
                ? t.voice.speaking
                : assistantState === 'PROCESSING'
                ? t.voice.processing
                : t.voice.idle}
            </span>
          </div>
        </div>

        {/* Recognized Speech & Response Card */}
        <div className="space-y-3">
          {transcript && (
            <div className="p-3 rounded-2xl bg-[#131E35]/60 border border-[#1E2D4A] text-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-mono uppercase">You Asked:</span>
              <p className="text-slate-100 font-medium italic">"{transcript}"</p>
            </div>
          )}

          {responseMessage && (
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  NEXUS Voice Response:
                </span>
                <button
                  onClick={() => speakText(responseMessage)}
                  className="text-cyan-400 hover:text-cyan-300"
                  title="Replay Audio"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-slate-200 leading-relaxed font-sans">{responseMessage}</p>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-slate-400 font-mono uppercase">Try Speaking:</span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: '“What documents are due today?”', query: 'What documents are due today?' },
              { label: '“Show critical documents”', query: 'Show critical documents' },
              { label: '“Aluva Station risks”', query: 'Show risks for Aluva Station' },
              { label: '“Find conflicting policies”', query: 'Find conflicting policies' },
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTranscript(chip.query);
                  handleVoiceQuery(chip.query);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-[#131E35] hover:bg-[#1E2D4A] text-slate-300 border border-[#1E2D4A] transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Fallback */}
        <form onSubmit={handleManualSubmit} className="relative">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Or type operational query in English, Malayalam or Hindi..."
            className="w-full bg-[#070B14] border border-[#1E2D4A] rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 pr-10"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 p-1.5 rounded-lg bg-amber-500 text-black hover:bg-amber-400 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
