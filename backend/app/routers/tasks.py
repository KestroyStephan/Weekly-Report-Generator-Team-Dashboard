from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from app.models.task import Task
from app.models.user import User
from app.deps import get_current_user
from pydantic import BaseModel
from beanie import PydanticObjectId

router = APIRouter(prefix="/tasks", tags=["tasks"])

class TaskCreate(BaseModel):
    title: str
    description: str = ""
    priority: str = "medium"
    project_id: str
    assigned_to: str

class TaskUpdate(BaseModel):
    status: str

@router.post("", response_model=Task, status_code=status.HTTP_201_CREATED)
async def create_task(task_in: TaskCreate, current_user: User = Depends(get_current_user)):
    if current_user.role not in ["manager", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to assign tasks")
    
    new_task = Task(
        title=task_in.title,
        description=task_in.description,
        priority=task_in.priority,
        status="todo",
        project_id=task_in.project_id,
        assigned_to=task_in.assigned_to,
        created_by=str(current_user.id)
    )
    await new_task.insert()
    return new_task

@router.get("/assigned", response_model=List[Task])
async def get_assigned_tasks(current_user: User = Depends(get_current_user)):
    tasks = await Task.find(Task.assigned_to == str(current_user.id)).sort("-created_at").to_list()
    return tasks

@router.get("/created", response_model=List[Task])
async def get_created_tasks(current_user: User = Depends(get_current_user)):
    tasks = await Task.find(Task.created_by == str(current_user.id)).sort("-created_at").to_list()
    return tasks

@router.put("/{task_id}", response_model=Task)
async def update_task_status(task_id: str, task_in: TaskUpdate, current_user: User = Depends(get_current_user)):
    task = await Task.get(PydanticObjectId(task_id))
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    if task.assigned_to != str(current_user.id) and task.created_by != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to update this task")
        
    task.status = task_in.status
    task.updated_at = datetime.utcnow()
    await task.save()
    return task
