from sqlalchemy import Column, Integer, Date, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from storage.models.meta import Base, UUIDMixin


class MonthlyConsumption(Base, UUIDMixin):
    __tablename__ = "monthly_consumption"

    client_id = Column(UUID(as_uuid=True), ForeignKey('client.id'), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    consumption = Column(Float, nullable=False)

    client = relationship("Client", back_populates="consumptions")
