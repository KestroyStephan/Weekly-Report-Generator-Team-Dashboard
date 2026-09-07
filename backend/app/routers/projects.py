from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends
from app.models.project import Project
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectOut
from app.deps import get_current_user, require_role

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=List[ProjectOut])
async def list_projects(current_user: User = Depends(get_current_user)):
    projects = await Project.find_all().to_list()
    return [
        ProjectOut(
            id=str(p.id),
            name=p.name,
            description=p.description or "",
            status=p.status,
            created_by=p.created_by,
            created_at=p.created_at
        )
        for p in projects
    ]

@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_in: ProjectCreate,
    current_user: User = Depends(require_role("manager", "admin"))
):
    project = Project(
        name=project_in.name,
        description=project_in.description or "",
        status=project_in.status or "active",
        created_by=str(current_user.id)
    )
    await project.insert()
    return ProjectOut(
        id=str(project.id),
        name=project.name,
        description=project.description or "",
        status=project.status,
        created_by=project.created_by,
        created_at=project.created_at
    )

@router.put("/{project_id}", response_model=ProjectOut)
async def update_project(
    project_id: str,
    project_in: ProjectUpdate,
    current_user: User = Depends(require_role("manager", "admin"))
):
    project = await Project.get(project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    
    if project_in.name is not None:
        project.name = project_in.name
    if project_in.description is not None:
        project.description = project_in.description
    if project_in.status is not None:
        project.status = project_in.status
        
    await project.save()
    return ProjectOut(
        id=str(project.id),
        name=project.name,
        description=project.description or "",
        status=project.status,
        created_by=project.created_by,
        created_at=project.created_at
    )

@router.delete("/{project_id}")
async def delete_project(
    project_id: str,
    current_user: User = Depends(require_role("manager", "admin"))
):
    project = await Project.get(project_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    
    await project.delete()
    return {"message": "Project deleted successfully"}
