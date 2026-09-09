import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import { VoiceAssistantModal } from '../components/voice/VoiceAssistantModal';
import { CameraScannerModal } from '../components/scanner/CameraScannerModal';
import { LiveDemoModal } from '../components/demo/LiveDemoModal';
import { LiveTelemetryTicker } from '../components/common/LiveTelemetryTicker';
import { InitialBootLoader } from '../components/common/InitialBootLoader';

export const MainLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState<boolean>(false);
  const [scannerModalOpen, setScannerModalOpen] = useState<boolean>(false);
  const [demoModalOpen, setDemoModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex">
      {/* Fixed Vertical Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-200 md:pl-64 pb-12">
        {/* Top Navigation Bar */}
        <TopBar
          onOpenMobileMenu={() => setMobileOpen(true)}
          onOpenVoiceModal={() => setVoiceModalOpen(true)}
          onOpenScannerModal={() => setScannerModalOpen(true)}
          onOpenDemoModal={() => setDemoModalOpen(true)}
        />

        {/* Dynamic Page Router Outlet */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Live SCADA Telemetry Ticker at Bottom */}
        <LiveTelemetryTicker />
      </div>

      {/* Global Modals */}
      <VoiceAssistantModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
      />

      <CameraScannerModal
        isOpen={scannerModalOpen}
        onClose={() => setScannerModalOpen(false)}
      />

      <LiveDemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />
    </div>
  );
};
