"""
SQLAlchemy database models
"""
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, JSON, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid

Base = declarative_base()

class Customer(Base):
    __tablename__ = "customers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(20))
    name = Column(String(255), nullable=False)
    account_status = Column(String(50), default="active")
    tier = Column(String(50), default="free")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    metadata = Column(JSON, default={})

class Agent(Base):
    __tablename__ = "agents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    status = Column(String(50), default="available")
    expertise = Column(JSON, default=[])
    max_concurrent_tickets = Column(Integer, default=5)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False, index=True)
    status = Column(String(50), default="open", index=True)
    priority = Column(String(50), default="normal")
    issue_category = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    resolved_at = Column(DateTime)
    assigned_agent_id = Column(UUID(as_uuid=True), ForeignKey("agents.id"), index=True)
    metadata = Column(JSON, default={})

class Message(Base):
    __tablename__ = "messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ticket_id = Column(UUID(as_uuid=True), ForeignKey("tickets.id"), nullable=False, index=True)
    channel = Column(String(50), nullable=False, index=True)
    sender_type = Column(String(50), nullable=False)
    sender_id = Column(UUID(as_uuid=True))
    content = Column(Text, nullable=False)
    attachments = Column(JSON, default=[])
    created_at = Column(DateTime, default=datetime.utcnow)
    metadata = Column(JSON, default={})

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_type = Column(String(100), nullable=False, index=True)
    actor_type = Column(String(50))
    actor_id = Column(UUID(as_uuid=True))
    resource_type = Column(String(50))
    resource_id = Column(UUID(as_uuid=True))
    action = Column(String(255))
    changes = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    metadata = Column(JSON, default={})
