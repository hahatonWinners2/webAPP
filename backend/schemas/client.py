from pydantic import BaseModel, Field
from datetime import date
from uuid import UUID
from typing import Optional


class ClientCreate(BaseModel):
    name: str = Field('не знаю, кто я', max_length=100)
    address: str = Field(..., max_length=255)
    description: Optional[str] = Field('', max_length=500)
    
    buildingType: Optional[str] = Field('Прочий', max_length=100)
    roomsCount: Optional[int] = Field(1, ge=0)
    residentsCount: Optional[int] = Field(1, ge=0)
    suspicion: Optional[int]

class TopClientResponse(BaseModel):
    id: UUID
    address: str
    buildingType: Optional[str]
    suspicion: int
    checked: bool | None = None

    class Config:
        orm_mode = True

class MonthlyConsumptionCreate(BaseModel):
    client_id: UUID
    consumption: float

class MonthlyConsumptionCreate(BaseModel):
    client_id: UUID
    date: date
    consumption: float

    class Config:
        orm_mode = True


class MonthlyConsumptionResponse(BaseModel):
    date: date
    consumption: float

    class Config:
        orm_mode = True

class ClientResponse(BaseModel):
    id: UUID
    name: str
    address: str
    description: Optional[str]
    
    buildingType: Optional[str]
    roomsCount: Optional[int]
    residentsCount: Optional[int]

    consumptions: list[MonthlyConsumptionResponse] = []
    suspicion: int
    company: str | None = None
    checked: bool | None = None
    comment: str | None = None

    class Config:
        orm_mode = True


