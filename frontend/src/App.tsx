import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { MainLayout } from './layouts/MainLayout';

// Pages
import { Landing } from './pages/Landing';
import { Overview } from './pages/Overview';
import { Documents } from './pages/Documents';
import { DocumentDetail } from './pages/DocumentDetail';
import { KnowledgeGraph } from './pages/KnowledgeGraph';
import { RiskRadar } from './pages/RiskRadar';
import { ActionCenter } from './pages/ActionCenter';
import { Deadlines } from './pages/Deadlines';
import { ConflictDetector } from './pages/ConflictDetector';
import { Copilot } from './pages/Copilot';
import { VoiceGuide } from './pages/VoiceGuide';
import { CameraScanner } from './pages/CameraScanner';
import { SearchPage } from './pages/SearchPage';
import { Analytics } from './pages/Analytics';
import { Departments } from './pages/Departments';
import { CloudStorage } from './pages/CloudStorage';
import { Alerts } from './pages/Alerts';
import { Settings } from './pages/Settings';
import { Language } from './pages/Language';
import { Intelligence } from './pages/Intelligence';
import { AuditTrail } from './pages/AuditTrail';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <DataProvider>
            <Routes>
              {/* Landing Page */}
              <Route path="/landing" element={<Landing />} />

              {/* Main Application Shell Layout */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Overview />} />
                <Route path="overview" element={<Overview />} />
                <Route path="documents" element={<Documents />} />
                <Route path="documents/:id" element={<DocumentDetail />} />
                <Route path="intelligence" element={<Intelligence />} />
                <Route path="graph" element={<KnowledgeGraph />} />
                <Route path="risks" element={<RiskRadar />} />
                <Route path="actions" element={<ActionCenter />} />
                <Route path="deadlines" element={<Deadlines />} />
                <Route path="conflicts" element={<ConflictDetector />} />
                <Route path="copilot" element={<Copilot />} />
                <Route path="voice" element={<VoiceGuide />} />
                <Route path="scanner" element={<CameraScanner />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="departments" element={<Departments />} />
                <Route path="storage" element={<CloudStorage />} />
                <Route path="alerts" element={<Alerts />} />
                <Route path="settings" element={<Settings />} />
                <Route path="language" element={<Language />} />
                <Route path="audit" element={<AuditTrail />} />
              </Route>

              {/* Catch-all Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;
