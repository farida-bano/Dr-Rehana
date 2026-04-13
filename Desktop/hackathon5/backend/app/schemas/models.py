"""
Pydantic schemas for API request/response validation
"""
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class CustomerBase(BaseModel):
    email: EmailStr
    phone: Optional[str] = None
    name: str
    tier: str = "free"

class CustomerCreate(CustomerBase):
    pass

class CustomerResponse(CustomerBase):
    id: UUID
    account_status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class MessageBase(BaseModel):
    channel: str
    content: str
    sender_type: str

class MessageCreate(MessageBase):
    ticket_id: UUID
    sender_id: UUID

class MessageResponse(MessageBase):
    id: UUID
    ticket_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class TicketBase(BaseModel):
    issue_category: str
    priority: str = "normal"

class TicketCreate(TicketBase):
    customer_id: UUID

class TicketResponse(TicketBase):
    id: UUID
    customer_id: UUID
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ContextResponse(BaseModel):
    customer_id: UUID
    profile: CustomerResponse
    recent_interactions: List[MessageResponse]
    active_tickets: List[TicketResponse]
    sla_status: dict
