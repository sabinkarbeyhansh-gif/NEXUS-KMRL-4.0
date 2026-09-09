from app.services.ai.base import AIProvider
from app.services.ai.mock_provider import MockAIProvider
from app.services.ai.gemini_provider import GeminiProvider
from app.services.ai.grok_provider import GrokProvider
from app.core.config import settings

def get_ai_provider() -> AIProvider:
    provider_name = settings.ACTIVE_AI_PROVIDER.lower()
    if "gemini" in provider_name:
        return GeminiProvider()
    elif "grok" in provider_name:
        return GrokProvider()
    return MockAIProvider()
