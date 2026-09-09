from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.models.models import User, Department, Document, Task, Risk, PolicyConflict, KnowledgeNode, KnowledgeEdge, Notification, AuditLog
from app.core.security import get_password_hash

def seed_database(db: Session):
    # Check if already seeded
    if db.query(Document).first():
        return

    # Seed Admin User
    admin = User(
        id="USR-KMRL-001",
        email="admin@kochimetro.org",
        name="K. S. Narayanan",
        role="ADMIN",
        department="Safety",
        hashed_password=get_password_hash("kmrl@2026"),
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    )
    db.add(admin)

    # Seed Departments
    departments = [
        Department(id="D-SFT", name="Safety", head="K. S. Narayanan", description="Statutory passenger safety & CMRS compliance"),
        Department(id="D-ENG", name="Engineering", head="Anand Varma", description="Traction catenary, track geometry & SCADA"),
        Department(id="D-MNT", name="Maintenance", head="Rajesh Kumar Nair", description="Rolling stock, bogies & depot stabling"),
        Department(id="D-OPS", name="Operations", head="Geetha P.", description="OCC train control & station passenger flows"),
        Department(id="D-FIN", name="Finance", head="Lakshmi Nair", description="Commercial leases & revenue recovery"),
        Department(id="D-PRO", name="Procurement", head="M. Haridas", description="Tenders for turnouts & spare parts"),
        Department(id="D-LGL", name="Legal", head="Adv. Premkumar", description="Contracts & statutory arbitration"),
        Department(id="D-HR", name="HR", head="Sunita Menon", description="Personnel rosters & training"),
    ]
    for d in departments:
        db.add(d)

    # Seed Primary Document 1: Aluva Fire Safety
    doc1 = Document(
        id="DOC-KMRL-2026-001",
        title="Aluva Station Fire Safety Audit & Sprinkler System Overhaul",
        file_name="KMRL_SFT_ALUVA_FIRE_2026.pdf",
        file_type="PDF",
        file_size="4.8 MB",
        department="Safety",
        language="English",
        ai_priority="CRITICAL",
        status="PROCESSED",
        ai_confidence=97,
        ai_priority_reason="Sprinkler pressure dropped to 2.1 bar. Statutory 24-hour compliance deadline.",
        summary="Comprehensive audit revealing pressure degradation in Aluva Station platform-level fire suppression grid.",
        key_facts=["Pressure dropped to 2.1 bar", "NBC 2016 Annexure IV violation", "24-hour deadline"],
        received_date=datetime.utcnow() - timedelta(days=1),
        created_date=datetime.utcnow() - timedelta(days=1),
        submission_deadline=datetime.utcnow() + timedelta(days=1),
        assigned_to="S. Pradeep",
        risk_score=94,
        station="Aluva",
        storage_path="Safety/2026/KMRL_SFT_ALUVA_FIRE_2026.pdf",
        raw_content_snippet="Notice under Section 28: Sprinkler pressure deficiency at Aluva station concourse.",
    )
    db.add(doc1)

    # Seed Task 1
    task1 = Task(
        id="ACT-001",
        title="Execute pressure sensor recalibration on Aluva Concourse Line 2",
        source_document_id="DOC-KMRL-2026-001",
        source_document_name="KMRL_SFT_ALUVA_FIRE_2026.pdf",
        department="Safety",
        assigned_person="S. Pradeep",
        priority="CRITICAL",
        created_date=datetime.utcnow() - timedelta(days=1),
        deadline=datetime.utcnow() + timedelta(days=1),
        status="IN_PROGRESS",
        station="Aluva",
    )
    db.add(task1)

    # Seed Risk 1
    risk1 = Risk(
        id="RSK-001",
        title="Aluva Platform Sprinkler Failure Risk",
        description="Insufficient water curtain flow rate in emergency evacuation zone.",
        severity="CRITICAL",
        category="SAFETY",
        station="Aluva",
        recommended_mitigation="Isolate loop valve 4B and pressurize backup diesel pump feed.",
        source_reference="Page 2, Executive Summary",
        document_id="DOC-KMRL-2026-001",
    )
    db.add(risk1)

    # Seed Conflict 1
    conflict1 = PolicyConflict(
        id="CONF-001",
        document_a_id="DOC-KMRL-2026-005",
        document_a_name="Emergency Evacuation & Tunnel Ventilation Guideline (Revision 2026)",
        document_a_requirement="Mandatory physical inspection of tunnel booster fans every 30 days.",
        document_b_id="DOC-KMRL-2024-042",
        document_b_name="KMRL Operations Manual & Maintenance SLA (Directive 42/2024)",
        document_b_requirement="Quarterly ventilation dampers maintenance executed every 45 calendar days.",
        conflict_type="FREQUENCY_MISMATCH",
        recommended_resolution="Formally endorse 2026 revision as governing standard and issue contractual SLA amendment.",
        detected_at=datetime.utcnow() - timedelta(days=3),
    )
    db.add(conflict1)

    # Seed Notification 1
    notif1 = Notification(
        id="NOTIF-001",
        notif_type="CRITICAL",
        title="Critical Document Received: Aluva Fire Safety Audit",
        message="Mandatory sprinkler inspection required within 24 hours.",
        timestamp=datetime.utcnow() - timedelta(hours=2),
        is_read=False,
        link_to="/documents/DOC-KMRL-2026-001",
        target_id="DOC-KMRL-2026-001",
    )
    db.add(notif1)

    # Seed Audit Log 1
    audit1 = AuditLog(
        id="AUD-001",
        timestamp=datetime.utcnow() - timedelta(hours=2),
        actor="NEXUS AI Pipeline",
        role="ADMIN",
        action="AI_CLASSIFICATION",
        target="DOC-KMRL-2026-001",
        details="Classified as CRITICAL (Confidence: 97%). Auto-dispatched task ACT-001.",
        ip_address="127.0.0.1",
    )
    db.add(audit1)

    # Commit initial seed
    db.commit()
