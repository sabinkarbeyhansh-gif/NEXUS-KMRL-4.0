from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

class AIProvider(ABC):
    @abstractmethod
    async def generate_summary(self, text: str, lang: str = "en") -> str:
        """Generate concise operational summary of document."""
        pass

    @abstractmethod
    async def classify_document(self, text: str) -> Dict[str, Any]:
        """Classify document priority, department, language, and confidence."""
        pass

    @abstractmethod
    async def extract_actions_and_deadlines(self, text: str) -> List[Dict[str, Any]]:
        """Extract actionable tasks and statutory deadlines from text."""
        pass

    @abstractmethod
    async def detect_risks(self, text: str) -> List[Dict[str, Any]]:
        """Detect operational, infrastructure and safety hazards."""
        pass

    @abstractmethod
    async def detect_conflicts(self, doc_a_text: str, doc_b_text: str) -> Optional[Dict[str, Any]]:
        """Detect contradictions between two policy or operational documents."""
        pass

    @abstractmethod
    async def answer_copilot(self, query: str, context: List[str], lang: str = "en") -> Dict[str, Any]:
        """Answer operational queries grounded in document evidence."""
        pass
