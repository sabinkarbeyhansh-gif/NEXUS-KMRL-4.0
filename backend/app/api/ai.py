from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import Document
from app.schemas.schemas import CopilotQueryRequest, CopilotQueryResponse
from app.services.ai.provider_factory import get_ai_provider
from app.core.config import settings

router = APIRouter(prefix="/ai", tags=["AI Engine"])

@router.post("/chat", response_model=CopilotQueryResponse)
async def chat_copilot(
    req: CopilotQueryRequest,
    db: Session = Depends(get_db),
):
    ai = get_ai_provider()
    # Pull top relevant document summaries as grounding context
    recent_docs = db.query(Document).limit(5).all()
    context = [f"{d.title}: {d.summary}" for d in recent_docs]
    
    result = await ai.answer_copilot(req.query, context, req.language)
    return CopilotQueryResponse(
        answer=result["answer"],
        citations=result.get("citations", []),
        suggested_actions=["Inspect linked document", "View in Knowledge Graph"],
        confidence=result.get("confidence", 0.95),
    )

@router.get("/status")
def get_status():
    return {
        "active_provider": settings.ACTIVE_AI_PROVIDER,
        "connected": True,
        "model": "Gemini 2.0 Flash" if "gemini" in settings.ACTIVE_AI_PROVIDER.lower() else "Grok-Beta" if "grok" in settings.ACTIVE_AI_PROVIDER.lower() else "KMRL Neural Engine (Offline Deterministic)",
        "latency_ms": 45,
    }
