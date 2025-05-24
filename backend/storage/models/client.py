from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship

from storage.models.meta import Base, UUIDMixin
from storage.models.suspicious import SuspiciousClient


class Client(Base, UUIDMixin):
    __tablename__ = "client"

    name = Column(
        String(100),
        nullable=False,
        index=True,
        comment="Name of the client"
    )
    address = Column(
        String(255),
        nullable=False,
        comment="Client's address"
    )
    description = Column(
        String(500),
        comment="Description of the client"
    )
    suspicion = Column(
        Integer,
        nullable=False,
        comment="Suspicion level (0-100%)"
    )

    # New fields
    buildingType = Column(
        String(100),
        nullable=True,
        comment="Type of the building"
    )
    roomsCount = Column(
        Integer,
        nullable=True,
        comment="Number of rooms"
    )
    residentsCount = Column(
        Integer,
        nullable=True,
        comment="Number of residents"
    )

    consumptions = relationship("MonthlyConsumption", back_populates="client", cascade="all, delete-orphan")
    suspicious_records = relationship(SuspiciousClient, back_populates="client", cascade="all, delete-orphan")
