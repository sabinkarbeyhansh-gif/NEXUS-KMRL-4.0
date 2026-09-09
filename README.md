# KMRL NEXUS

### AI-Powered Document Intelligence, Operational Knowledge Graph & Decision Automation Platform for Kochi Metro Rail Limited

> **“From Documents to Decisions.”**

KMRL NEXUS transforms Kochi Metro Rail Limited from manual, fragmented document overload into an automated operational command center. It ingests complex multilingual documents (English, Malayalam, Hindi), performs OCR and deep AI extraction (priorities, deadlines, actions, risks, policy conflicts), establishes an interactive **Operational Knowledge Graph**, automatically delegates tasks to departments, and provides conversational AI and Voice intelligence.

---

## 🚀 Key Innovations & Features

1. **Autonomous Document Pipeline**:
   - Ingestion (PDF, DOCX, XLSX, PNG, JPG, TXT) → Multilingual OCR → AI Classification → Priority Extraction → Action Dispatch → Risk Radar → Knowledge Graph Injection.
2. **Interactive Operational Knowledge Graph**:
   - Fullscreen React Flow network topology modeling 25 Kochi Metro stations, documents, hazards, operational actions, and departments with an interactive profile side panel.
3. **Document Conflict Detector & Time Machine**:
   - Side-by-side contradiction finder (e.g. 2026 Guideline 30-day inspection vs 2024 SLA 45-day cycle) and historical evolution slider (2024 → 2025 → 2026).
4. **NEXUS VOICE Speech Assistant**:
   - Multilingual speech recognition & voice synthesis in English, Malayalam (മലയാളം), and Hindi (हिन्दी).
5. **2K Camera Document Scanner**:
   - In-browser optical hardware camera access targeting up to 2K resolution with real-time sensor readout, high-contrast binarization filters, and direct OCR trigger.
6. **Pluggable Multi-Provider AI**:
   - Abstract `AIProvider` supporting **Google Gemini**, **Grok (xAI)**, and **Mock AI (Demo Intelligence)** for 100% offline hackathon reliability.
7. **Role-Based Command Modes (RBAC)**:
   - Dedicated modes for **Administrator**, **Manager**, **Field Officer**, **Compliance Auditor**, and **Viewer**.
8. **13-Step Live Demo Mode for SIH Judges**:
   - Guided scenario walking judges through a 15-page bilingual circular upload to live knowledge graph injection and voice queries.

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS + Custom Enterprise Command Center tokens
- **Knowledge Graph**: `@xyflow/react` (React Flow)
- **Visualizations**: Recharts
- **Icons**: Lucide React
- **Localization**: Custom i18n supporting English, Malayalam, Hindi

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Validation**: Pydantic v2
- **ORM**: SQLAlchemy 2.0 (SQLite development fallback + PostgreSQL production support)
- **Security**: JWT tokens & salted SHA-256 password hashing
- **Storage**: StorageService abstraction (Local folder hierarchy & Cloud S3/Supabase)

---

## 🏃 Quick Start Guide

### 1. Run Backend Server
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be accessible at: `http://127.0.0.1:8000/docs`

### 2. Run Frontend Application
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🎬 SIH Hackathon Demo Walkthrough

1. **Dashboard Overview**: Inspect the 8 clickable KPI counters, dynamic IST live clock, and critical operations feed.
2. **Launch 13-Step Live Demo**: Click the **“Live Demo”** button in the top navigation bar to watch the automated 13-step pipeline ingest a bilingual safety directive and update the entire platform state.
3. **Operational Knowledge Graph**: Navigate to `/graph`, pan and zoom across the 25 station network, and click on **Aluva Metro Station** to inspect its profile side panel.
4. **Conflict Detector**: Navigate to `/conflicts` to observe side-by-side policy contradiction detection and the Document Time Machine.
5. **NEXUS VOICE**: Click the microphone icon to test voice queries in English, Malayalam, or Hindi.
6. **2K Camera Scanner**: Open `/scanner` to view live hardware sensor resolution detection and contrast enhancement.

---

## 📄 License
KMRL NEXUS is developed for Kochi Metro Rail Limited under the Smart India Hackathon (SIH) 2026.
