from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from app.models.user import User
from app.schemas.user import UserOut, UserCreate, UserRoleUpdate
from app.deps import get_current_user, require_role
from app.services.auth_service import hash_password

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

@router.get("/roles", response_model=List[str])
async def get_roles(current_user: User = Depends(get_current_user)):
    # Standard roles plus any custom roles in DB
    existing_roles = set(["member", "manager", "admin"])
    db_users = await User.find_all().to_list()
    for u in db_users:
        if u.role:
            existing_roles.add(u.role)
    return sorted(list(existing_roles))

@router.post("", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_in: UserCreate,
    current_user: User = Depends(require_role("manager", "admin"))
):
    existing_user = await User.find_one(User.email == user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    role = user_in.role if user_in.role else "member"
    
    user = User(
        name=user_in.name,
        email=user_in.email,
        password_hash=hash_password(user_in.password),
        role=role
    )
    await user.insert()
    
    return UserOut(
        id=str(user.id),
        name=user.name,
        email=user.email,
        role=user.role,
        created_at=user.created_at
    )

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

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: str,
    current_user: User = Depends(require_role("admin", "manager"))
):
    if str(current_user.id) == user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete yourself")
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    await user.delete()
    return None

