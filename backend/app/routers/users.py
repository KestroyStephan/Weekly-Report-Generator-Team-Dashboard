from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from app.models.user import User
from app.schemas.user import UserOut, UserRoleUpdate
from app.deps import get_current_user, require_role

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("", response_model=List[UserOut])
async def list_users(current_user: User = Depends(require_role("manager", "admin"))):
    users = await User.find_all().to_list()
    return [
        UserOut(
            id=str(u.id),
            name=u.name,
            email=u.email,
            role=u.role,
            created_at=u.created_at
        )
        for u in users
    ]

@router.get("/{user_id}", response_model=UserOut)
async def get_user_by_id(user_id: str, current_user: User = Depends(get_current_user)):
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return UserOut(
        id=str(user.id),
        name=user.name,
        email=user.email,
        role=user.role,
        created_at=user.created_at
    )

@router.patch("/{user_id}/role", response_model=UserOut)
async def update_user_role(
    user_id: str,
    role_in: UserRoleUpdate,
    current_user: User = Depends(require_role("admin", "manager"))
):
    if role_in.role not in ["member", "manager", "admin"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role")
    
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    user.role = role_in.role
    await user.save()
    
    return UserOut(
        id=str(user.id),
        name=user.name,
        email=user.email,
        role=user.role,
        created_at=user.created_at
    )
