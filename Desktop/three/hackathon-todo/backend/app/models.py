from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
import datetime
from pydantic import BaseModel


class UserBase(SQLModel):
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    full_name: Optional[str] = None


class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    is_active: bool = True
    tasks: list["Task"] = Relationship(back_populates="owner")


class UserCreate(UserBase):
    password: str


class UserUpdate(SQLModel):
    username: Optional[str] = None
    email: Optional[str] = None
    full_name: Optional[str] = None
    password: Optional[str] = None


class UserPublic(UserBase):
    id: int


class UserPublicWithTasks(UserPublic):
    tasks: list["TaskPublic"] = []


# Task models
class TaskBase(SQLModel):
    title: str = Field(index=True)
    description: Optional[str] = Field(default=None)
    is_completed: bool = Field(default=False)
    due_date: Optional[datetime.datetime] = None


class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    owner_id: int = Field(foreign_key="user.id")
    owner: User = Relationship(back_populates="tasks")


class TaskCreate(TaskBase):
    pass


class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None
    due_date: Optional[datetime.datetime] = None


class TaskPublic(TaskBase):
    id: int


class TaskPublicWithUser(TaskPublic):
    owner: UserPublic