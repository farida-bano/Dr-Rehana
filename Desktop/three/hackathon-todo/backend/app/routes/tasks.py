from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlmodel import Session, select
from ..database import get_session
from ..models import Task, TaskCreate, TaskUpdate, TaskPublic, TaskPublicWithUser

router = APIRouter()

@router.get("/tasks", response_model=List[TaskPublic])
def get_tasks(
    skip: int = 0, 
    limit: int = 100, 
    session: Session = Depends(get_session)
):
    """
    Retrieve tasks with pagination.
    """
    statement = select(Task).offset(skip).limit(limit)
    tasks = session.exec(statement).all()
    return tasks


@router.post("/tasks", response_model=TaskPublic, status_code=status.HTTP_201_CREATED)
def create_task(
    task: TaskCreate, 
    session: Session = Depends(get_session)
):
    """
    Create a new task.
    """
    db_task = Task.model_validate(task)
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task


@router.get("/tasks/{id}", response_model=TaskPublicWithUser)
def get_task_by_id(
    id: int, 
    session: Session = Depends(get_session)
):
    """
    Get a specific task by id.
    """
    task = session.get(Task, id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return task


@router.put("/tasks/{id}", response_model=TaskPublic)
def update_task(
    id: int, 
    task_update: TaskUpdate, 
    session: Session = Depends(get_session)
):
    """
    Update an existing task.
    """
    db_task = session.get(Task, id)
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    update_data = task_update.model_dump(exclude_unset=True)
    db_task.sqlmodel_update(update_data)
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task


@router.delete("/tasks/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    id: int, 
    session: Session = Depends(get_session)
):
    """
    Delete a task.
    """
    task = session.get(Task, id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    session.delete(task)
    session.commit()
    return


@router.patch("/tasks/{id}/complete", response_model=TaskPublic)
def toggle_task_complete(
    id: int, 
    session: Session = Depends(get_session)
):
    """
    Toggle completion status of a task.
    """
    task = session.get(Task, id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    task.is_completed = not task.is_completed
    session.add(task)
    session.commit()
    session.refresh(task)
    return task