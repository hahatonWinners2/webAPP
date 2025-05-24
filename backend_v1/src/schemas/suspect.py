from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class SuspectSchema(BaseModel):
    id: UUID
    time: datetime
    address_id: UUID
    is_scammer: bool | None = None
    description: str = ''


class CreateSuspectSchema(BaseModel):
    address_id: UUID


class UpdateSuspectSchema(BaseModel):
    id: UUID
    is_scammer: bool | None = None
    description: str | None = None
