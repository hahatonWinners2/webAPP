from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class AddressSchema(BaseModel):
    id: UUID
    address: str


class CreateAddressSchema(BaseModel):
    address: str
