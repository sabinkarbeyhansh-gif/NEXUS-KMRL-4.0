import React from 'react';
import { Globe, CheckCircle2, Languages, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageCode } from '../types';

export const Language: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const supportedLanguages: {
    code: LanguageCode;
    name: string;
    nativeName: string;
    tagline: string;
    coverage: string;
    sampleText: string;
  }[] = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English (Indian Standard)',
      tagline: 'Standard KMRL Administrative & Technical Language',
      coverage: '100% System Coverage (UI, OCR, Copilot, Voice)',
      sampleText: '“From Documents to Decisions.” Automated document intelligence for Kochi Metro.',
    },
    {
      code: 'ml',
      name: 'Malayalam',
      nativeName: 'മലയാളം (കേരള ഭാഷ)',
      tagline: 'Official State Language of Kerala Metro Operations',
      coverage: '100% Translated UI, Speech Synthesis, and Malayalam OCR',
      sampleText: '“രേഖകളിൽ നിന്ന് തീരുമാനങ്ങളിലേക്ക്.” കൊച്ചി മെട്രോയ്ക്കുള്ള എ.ഐ സംവിധാനം.',
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी (राजभाषा)',
      tagline: 'National Regulatory & Central Transit Standard',
      coverage: 'Full Interface, Voice Prompting and Search Integration',
      sampleText: '“दस्तावेज़ों से निर्णयों तक।” कोच्चि मेट्रो रेल लिमिटेड के लिए बुद्धिमत्ता प्रणाली।',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Globe className="w-6 h-6 text-cyan-400" />
          Multilingual Operations Center (i18n)
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Full real-time system localization across English, Malayalam (മലയാളം) and Hindi (हिन्दी)
        </p>
      </div>

      {/* Language Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {supportedLanguages.map((lang) => {
          const isSelected = language === lang.code;
          return (
            <div
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer space-y-4 ${
                isSelected
                  ? 'bg-cyan-500/10 border-cyan-500 shadow-2xl shadow-cyan-500/20 scale-[1.02]'
                  : 'bg-[#0D1526] border-[#1E2D4A] hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-white">{lang.nativeName}</span>
                {isSelected ? (
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                ) : (
                  <span className="text-xs font-mono text-slate-500">Switch</span>
                )}
              </div>

              <p className="text-xs font-semibold text-cyan-300">{lang.tagline}</p>

              <div className="p-3 rounded-xl bg-[#070B14] border border-[#1E2D4A] text-xs text-slate-300 italic">
                {lang.sampleText}
              </div>

              <div className="pt-2 border-t border-[#1E2D4A] flex justify-between text-[10px] font-mono text-slate-400">
                <span>{lang.coverage}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
