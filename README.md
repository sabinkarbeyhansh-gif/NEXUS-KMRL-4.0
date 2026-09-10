# NEXUS KMRL 4.0

### AI-Powered Document Intelligence, SCADA Safety Interlocking & Autonomous Operational Knowledge Platform for Kochi Metro Rail Limited

> **“From Documents to Operational Decisions — Real-Time, Verified & Sealed.”**

**NEXUS KMRL 4.0** is the enterprise-grade operational command center engineered specifically for Kochi Metro Rail Limited (KMRL) and the Kochi Water Metro. It unifies high-resolution optical document scanning, real-time SCADA telemetry correlation, statutory safety compliance tracking, and zero-delay multi-persona decision automation.

---

## 🌟 What's New in NEXUS KMRL 4.0

### 1. 🛡️ Document Scanner & Verification Decision Gate ("Scan → Verify → Make the Next Move")
- **3-Step Audit & Decision Gate**:
  - **1. Scan & Ingest**: 2K optical camera capture or 1-click KMRL field notice selector (Aluva thermography notice, Kaloor smoke damper report, Muttom sump pit certificate) with contrast binarization.
  - **2. Verification Audit Deck**: Side-by-side view of the physical document frame and neural OCR clauses, with a 4-point mandatory compliance checklist (signatures, safe thermal/acoustic operating limits, CMRS hazard mitigation, and SCADA sync).
  - **3. Executive Decision Gate**:
    - 🟢 **Approve & Close Task**: Cryptographically seals the work order with SHA-256 hash (`KMRL-SEAL-8F4A-92B`), updates status to `COMPLETED & SEALED`, and logs into the Immutable Audit Trail.
    - 🔴 **Reject & Do Not Close**: Flags safety defects or incomplete evidence, keeps task open under `ACTION REQUIRED (ESCALATED)`, and dispatches emergency notices to GM Operations & Senior Electrical Engineers.
    - 🟡 **Dispatch Field Directive**: Spawns an active work order with a 48h countdown on the central dashboard.

### 2. ⚡ SCADA Safety Interlocking & Predictive Maintenance Hub (`/intelligence`)
- **Live Sensor Telemetry across 25 Stations & Water Metro**:
  - **Aluva**: 25kV Traction Catenary Voltage (`24.8 kV`), Track Vibration (`0.04g`), Terminal Block Temp (`78.4°C`).
  - **Kaloor**: Emergency Smoke Extraction Booster Damper Pressure (`142 Pa`), Air Quality Index.
  - **Edappally**: Platform Screen Doors (PSD) Cycle Count & Motor Inverter Temp (`44.1°C`).
  - **MG Road**: Fire Hydrant Water Flow Pressure (`8.4 bar`) & Emergency Exit Batteries.
  - **Muttom Depot**: Dual Sump Pit Ingress Depth (`14mm`) & Third-Rail Turnout Greasers.
  - **High Court Water Metro**: Ferry Vessel Battery SOC (`88%`, 420 kW Rapid Charger).
- **Directive-to-SCADA Sensor Pairing**: Automatically matches newly ingested circulars with live physical station sensors to verify compliance in real time.
- **Autonomous Safety Interlocking Controls**:
  - Corridor Temporary Speed Restriction (TSR 40 km/h) on track vibration anomalies.
  - Emergency Tunnel Booster Fan Auto-Engage when airflow drops below 135 Pa.
  - Dual Sump Pit Flood Auto-Alternation during monsoon water surges.
  - Instant 25kV Traction Power Isolation Trip for track clearance emergencies.

### 3. ⚖️ Statutory Policy & Regulatory Compliance Matrix (`/conflicts`)
- **Cross-Regulatory Benchmarking**: Automatically audits KMRL internal operational manuals against:
  - **CMRS (Commission of Railway Safety)** statutory mandates
  - **RDSO (Research Designs & Standards Organisation)** technical guidelines
  - **NFPA 130** (Fixed Guideway Transit Life Safety Standard)
  - **KSDMA** (Kerala State Disaster Management Authority) monsoon protocols
- **Clause-by-Clause Legal Diff Highlighter**: Pinpoints operational discrepancies (e.g. CMRS 30-day tunnel damper rule vs 45-day contractor maintenance cycle).
- **Statutory Penalty Exposure Calculator**: Evaluates legal fines (e.g. ₹5,00,000 Section 27 Railway Act penalty).
- **1-Click Legal Addendum Generator**: Dispatches legally binding contractual addenda directly to contractors and the Legal Directorate.

### 4. 📊 Dynamic Operational Analytics & Longitudinal Dataset (2017 to 2026 Till Date)
- **Dynamic Day-by-Day Telemetry**: Select between `Today (Live)`, `7 Days`, `30 Days`, `90 Days`, `1 Year`, and `All-Time`, or toggle individual days (`Thu 04 Sep` to `Wed 10 Sep`) to see real hourly fluctuations in document intake, task completion, and ridership.
- **10-Year Inception-to-Date KMRL Dataset (2017–2026)**: Records Kochi Metro's expansion from its commercial flag-off in June 2017 (13.2 km, 16 stations, 8.2M pax) to the full network in 2026 (28.125 km, 25 stations + 10 Water Metro terminals, 44.8M pax).
- **📥 1-Click CSV Export**: Download the complete 2017–2026 dataset as `KMRL_Operational_Analytics_2017_2026.csv`.

### 5. 🎛️ Ultra-Clean 3-Zone Enterprise Task Bar
- **Zone 1 (Left)**: Live IST clock capsule (`hh:mm:ss A IST` with live pulsing SCADA beacon) + compact `⌘K` global search pill.
- **Zone 2 (Center)**: Minimalist AI engine badge (`Gemini 1.5 Pro • Neural Engine`).
- **Zone 3 (Right)**:
  - ⚡ **13-Step Live Demo Action Pill** (vibrant amber button with step counter badge).
  - 📷 + 🎙 **Unified Hardware Tools Capsule** (Camera 2K Scanner + NEXUS Voice Assistant).
  - 🌐 **Multilingual Dropdown** (`EN` / `മലയാളം` / `हिन्दी`).
  - 🔔 **Operational Alerts Bell** with live unread badge and inspection drawer.
  - 🛡 **Executive KMRL Officer Persona Switcher**: Instant 1-click delegation across all 5 personas:
    1. **Dr. Manoj Joshi, IAS** (`ADMIN` — Managing Director)
    2. **S. Pradeep Kumar** (`MANAGER` — Chief Safety Officer)
    3. **Ananya R. Nair** (`OFFICER` — Field Electrical Engineer)
    4. **K. Narayanan, IRSE** (`AUDITOR` — CMRS Statutory Inspector)
    5. **Meera Krishnan** (`VIEWER` — Municipal Observer / PR)

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React 19 + Vite + TypeScript (v4.0.0)
- **Styling**: Vanilla CSS / Tailwind v4 Engine + Kochi Metro Enterprise Palette
- **Knowledge Graph**: `@xyflow/react` (React Flow)
- **Visualizations**: Recharts (Line, Area, Bar, Pie)
- **Icons**: Lucide React
- **Audio & Speech**: Web Speech API (Synthesis & Recognition in EN/ML/HI)
- **Camera Sensor**: HTML5 MediaDevices targeting up to 2K (2560x1440) resolution

### Backend
- **Framework**: FastAPI + Python 3.10+
- **Database**: SQLite / SQLAlchemy ORM
- **AI Integrations**: Google Gemini 2.0 Flash, Grok-Beta, Deterministic Offline Mock AI
- **Server**: Uvicorn ASGI on port 8080

---

## 🚀 Quick Start Guide

### 1. Run Backend Server
```bash
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8080 --reload
```
API Docs: [http://127.0.0.1:8080/docs](http://127.0.0.1:8080/docs)

### 2. Run Frontend Server
```bash
cd frontend
npm install
npm run dev
```
Open in Browser: [http://localhost:5174/](http://localhost:5174/)

### 3. Production Build
```bash
cd frontend
npm run build
```

---

## 📄 License & Attribution
Developed for **Kochi Metro Rail Limited (KMRL)**. All rights reserved.
