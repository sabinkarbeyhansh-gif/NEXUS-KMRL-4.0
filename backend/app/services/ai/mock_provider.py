from typing import List, Dict, Any, Optional
from app.services.ai.base import AIProvider
from datetime import datetime, timedelta

class MockAIProvider(AIProvider):
    async def generate_summary(self, text: str, lang: str = "en") -> str:
        if "മലയാളം" in text or "ബ്രേക്ക്" in text:
            return "മുട്ടം ഡിപ്പോയിലെ ട്രെയിൻ സെറ്റ് 04, 07 എന്നിവയുടെ ബ്രേക്ക് പാഡുകൾ അടിയന്തിരമായി പരിശോധിക്കാനും തേയ്മാനം 10mm-ൽ കൂടുതലാണെങ്കിൽ മാറ്റിസ്ഥാപിക്കാനുമുള്ള ഉത്തരവ്."
        return "Comprehensive operational compliance directive mandating safety inspections, telemetry verification, and statutory response filings under Metro Railways Act standards."

    async def classify_document(self, text: str) -> Dict[str, Any]:
        lower = text.lower()
        if "fire" in lower or "sprinkler" in lower or "pressure" in lower or "emergency" in lower:
            priority = "CRITICAL"
            reason = "Document contains urgent safety inspection with active sensor pressure drop below statutory threshold."
            dept = "Safety"
        elif "brake" in lower or "catenary" in lower or "track" in lower or "25kv" in lower:
            priority = "HIGH"
            reason = "Mandatory mechanical or electrical overhaul cycle requirement."
            dept = "Engineering"
        else:
            priority = "MEDIUM"
            reason = "Periodic statutory operational reporting and compliance review."
            dept = "Operations"

        return {
            "priority": priority,
            "department": dept,
            "language": "Bilingual (EN/ML)" if "മെട്രോ" in text else "English",
            "confidence": 97,
            "priority_reason": reason,
        }

    async def extract_actions_and_deadlines(self, text: str) -> List[Dict[str, Any]]:
        return [
            {
                "task": "Execute field pressure sensor calibration and safety sign-off",
                "department": "Safety",
                "assigned_person": "S. Pradeep",
                "priority": "CRITICAL",
                "deadline": (datetime.utcnow() + timedelta(days=1)).isoformat(),
                "status": "PENDING",
                "evidence_required": "Digital manometer certificate signed by Fire Marshal",
                "source_reference": "Page 2, Section 1.4",
            }
        ]

    async def detect_risks(self, text: str) -> List[Dict[str, Any]]:
        return [
            {
                "title": "Platform Sprinkler Water Curtain Flow Rate Drop",
                "description": "Insufficient hydraulic pressure in passenger concourse evacuation zone.",
                "severity": "CRITICAL",
                "category": "SAFETY",
                "station": "Aluva",
                "recommended_mitigation": "Isolate loop valve 4B and pressurize backup diesel pump feed.",
                "source_reference": "Page 1, Hazard Summary",
            }
        ]

    async def detect_conflicts(self, doc_a_text: str, doc_b_text: str) -> Optional[Dict[str, Any]]:
        return {
            "conflict_type": "FREQUENCY_MISMATCH",
            "document_a_requirement": "Mandatory inspection of tunnel ventilation dampers every 30 days.",
            "document_b_requirement": "Quarterly damper maintenance executed every 45 calendar days.",
            "recommended_resolution": "Formally endorse 2026 revision as governing standard and issue contractual SLA amendment to facility contractors.",
        }

    async def answer_copilot(self, query: str, context: List[str], lang: str = "en") -> Dict[str, Any]:
        lower = query.lower()
        if "critical" in lower or "ഗുരുതരം" in lower or "महत्वपूर्ण" in lower:
            answer = "There are 3 critical operational documents requiring immediate sign-off: Aluva Station Fire Safety Audit, 25kV Catenary Overhaul, and the 2026 Tunnel Evacuation Policy."
            citations = [
                {"title": "KMRL_SFT_ALUVA_FIRE_2026.pdf", "ref": "Section 1.4", "doc_id": "DOC-KMRL-2026-001"}
            ]
        elif "aluva" in lower or "ആലുവ" in lower:
            answer = "Aluva Metro Station has 17 active records, with the highest priority being the platform sprinkler pressure degradation requiring 24h compliance."
            citations = [
                {"title": "KMRL_SFT_ALUVA_FIRE_2026.pdf", "ref": "Page 4", "doc_id": "DOC-KMRL-2026-001"}
            ]
        elif "conflict" in lower or "പോളിസി" in lower:
            answer = "A policy contradiction is identified: the 2026 Evacuation Guideline mandates 30-day inspection while active contractor SLA KMRL-VND-2024-11 stipulates 45 days."
            citations = [
                {"title": "KMRL_SFT_EVAC_POLICY_2026.pdf", "ref": "Clause 2.1", "doc_id": "DOC-KMRL-2026-005"}
            ]
        else:
            answer = f"According to KMRL operational documents, records matching '{query}' have been processed and tasks dispatched to responsible personnel."
            citations = [
                {"title": "KMRL_ENG_CATENARY_25KV_2026.pdf", "ref": "Page 7", "doc_id": "DOC-KMRL-2026-003"}
            ]

        return {
            "answer": answer,
            "citations": citations,
            "confidence": 0.96,
        }
