from typing import Optional

from pydantic import BaseModel

from src.enums import BuildingType


class AccountSchema(BaseModel):
    id: int
    building_type: BuildingType
    rooms_count: int | None = None
    residents_count: int | None = None
    total_area: float | None = None
    address: str


class CreateAccountSchema(BaseModel):
    id: int
    building_type: BuildingType
    rooms_count: Optional[int] = None
    residents_count: Optional[int] = None
    total_area: Optional[float] = None
    address: str
