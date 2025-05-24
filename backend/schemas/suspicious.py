from pydantic import BaseModel, Field
from typing import Optional
from typing import Optional
from uuid import UUID

class SuspiciousClientCreate(BaseModel):
    client_id: UUID

class SuspiciousClientUpdateComment(BaseModel):
    comment: Optional[str] = Field(None, max_length=500)

class SuspiciousClientRead(BaseModel):
    id: UUID
    client_id: UUID
    company: str
    checked: bool
    comment: Optional[str]

    class Config:
        orm_mode = True

class SuspiciousClientResponse(BaseModel):
    client_id: UUID
    company: str
    checked: bool
    comment: Optional[str]

    class Config:
        orm_mode = True
