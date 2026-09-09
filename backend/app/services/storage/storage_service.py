import os
import aiofiles
from pathlib import Path
from typing import Optional
from app.core.config import settings

class StorageService:
    def __init__(self):
        self.base_path = Path(settings.STORAGE_PATH)
        self.base_path.mkdir(parents=True, exist_ok=True)
        # Create default KMRL department folders
        departments = ['Safety', 'Engineering', 'Operations', 'Finance', 'HR', 'Legal', 'Procurement', 'Maintenance']
        for dept in departments:
            (self.base_path / dept).mkdir(parents=True, exist_ok=True)

    async def save_file(self, department: str, filename: str, content: bytes) -> str:
        dept_folder = self.base_path / department
        dept_folder.mkdir(parents=True, exist_ok=True)
        file_path = dept_folder / filename
        async with aiofiles.open(file_path, "wb") as f:
            await f.write(content)
        return f"{department}/{filename}"

    async def get_file(self, relative_path: str) -> Optional[bytes]:
        full_path = self.base_path / relative_path
        if not full_path.exists():
            return None
        async with aiofiles.open(full_path, "rb") as f:
            return await f.read()

storage_service = StorageService()
