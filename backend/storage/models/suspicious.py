from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from storage.models.meta import Base, UUIDMixin

class SuspiciousClient(Base, UUIDMixin):
    __tablename__ = "suspicious_client"

    client_id = Column(
        UUID(as_uuid=True), 
        ForeignKey('client.id'), 
        nullable=False, 
        index=True,
        comment="Reference to client"
    )
    company = Column(
        String(255),
        nullable=False,
        comment="Company name"
    )
    checked = Column(
        Boolean,
        default=False,
        nullable=False,
        comment="Whether the client has been checked"
    )
    comment = Column(
        String(500),
        comment="Additional comments"
    )
    verdict = Column(
        Boolean,
        nullable=True,
        comment="Verdict after checking the suspicious client"
    )

    client = relationship("Client", back_populates="suspicious_records")
