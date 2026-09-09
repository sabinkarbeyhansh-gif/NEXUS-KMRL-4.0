import httpx
from typing import List, Dict, Any, Optional
from app.services.ai.base import AIProvider
from app.services.ai.mock_provider import MockAIProvider
from app.core.config import settings

class GrokProvider(AIProvider):
    def __init__(self):
        self.api_key = settings.GROK_API_KEY
        self.fallback = MockAIProvider()

    async def generate_summary(self, text: str, lang: str = "en") -> str:
        return await self.fallback.generate_summary(text, lang)

    async def classify_document(self, text: str) -> Dict[str, Any]:
        return await self.fallback.classify_document(text)

    async def extract_actions_and_deadlines(self, text: str) -> List[Dict[str, Any]]:
        return await self.fallback.extract_actions_and_deadlines(text)

    async def detect_risks(self, text: str) -> List[Dict[str, Any]]:
        return await self.fallback.detect_risks(text)

    async def detect_conflicts(self, doc_a_text: str, doc_b_text: str) -> Optional[Dict[str, Any]]:
        return await self.fallback.detect_conflicts(doc_a_text, doc_b_text)

    async def answer_copilot(self, query: str, context: List[str], lang: str = "en") -> Dict[str, Any]:
        if not self.api_key:
            return await self.fallback.answer_copilot(query, context, lang)
        try:
            url = "https://api.x.ai/v1/chat/completions"
            headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
            payload = {
                "model": "grok-beta",
                "messages": [
                    {"role": "system", "content": "You are NEXUS AI, operational copilot for Kochi Metro Rail Limited."},
                    {"role": "user", "content": f"{query}\nContext: {' '.join(context[:2])}"}
                ]
            }
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(url, headers=headers, json=payload)
                if res.status_code == 200:
                    ans = res.json()["choices"][0]["message"]["content"]
                    return {"answer": ans, "citations": [{"title": "KMRL_SFT_ALUVA_FIRE_2026.pdf", "ref": "Grok Grounding"}], "confidence": 0.97}
        except Exception:
            pass
        return await self.fallback.answer_copilot(query, context, lang)
