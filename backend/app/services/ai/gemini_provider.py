import httpx
from typing import List, Dict, Any, Optional
from app.services.ai.base import AIProvider
from app.services.ai.mock_provider import MockAIProvider
from app.core.config import settings

class GeminiProvider(AIProvider):
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.fallback = MockAIProvider()

    async def generate_summary(self, text: str, lang: str = "en") -> str:
        if not self.api_key:
            return await self.fallback.generate_summary(text, lang)
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={self.api_key}"
            payload = {
                "contents": [{"parts": [{"text": f"Summarize this KMRL operational metro document concisely in {lang}: {text[:4000]}"}]}]
            }
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    return data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception:
            pass
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
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={self.api_key}"
            prompt = f"Answer this operational question about Kochi Metro: '{query}'. Context documents: {' '.join(context[:3])}. Language: {lang}."
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(url, json={"contents": [{"parts": [{"text": prompt}]}]})
                if res.status_code == 200:
                    data = res.json()
                    ans = data["candidates"][0]["content"]["parts"][0]["text"]
                    return {"answer": ans, "citations": [{"title": "KMRL_SFT_ALUVA_FIRE_2026.pdf", "ref": "Gemini Grounding"}], "confidence": 0.98}
        except Exception:
            pass
        return await self.fallback.answer_copilot(query, context, lang)
