from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
import secrets
from app.models.user import User
from app.schemas.user import UserOut, UserCreate, UserRoleUpdate
from app.deps import get_current_user, require_role
from app.services.auth_service import hash_password

router = APIRouter(prefix="/users", tags=["Users"])

def _map_user(u: User) -> UserOut:
    return UserOut(
        id=str(u.id),
        name=u.name,
        email=u.email,
        role=u.role,
        created_at=u.created_at
    )

@router.get("", response_model=List[UserOut])
async def list_users(current_user: User = Depends(require_role("manager", "admin"))):
    users = await User.find_all().to_list()
    return [_map_user(u) for u in users]

@router.get("/roles", response_model=List[str])
async def get_roles(current_user: User = Depends(get_current_user)):
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
    invite_token = secrets.token_urlsafe(24)
    raw_pass = user_in.password if user_in.password else secrets.token_urlsafe(16)
    
    user = User(
        name=user_in.name,
        email=user_in.email,
        password_hash=hash_password(raw_pass),
        role=role,
        invite_token=invite_token
    )
    await user.insert()
    
    invitation_link = f"http://localhost:5173/setup-password?token={invite_token}&email={user.email}"
    
    user_out = _map_user(user)
    user_out.invitation_link = invitation_link
    return user_out

@router.get("/{user_id}", response_model=UserOut)
async def get_user_by_id(user_id: str, current_user: User = Depends(get_current_user)):
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return _map_user(user)

@router.patch("/{user_id}/role", response_model=UserOut)
async def update_user_role(
    user_id: str,
    role_in: UserRoleUpdate,
    current_user: User = Depends(require_role("admin", "manager"))
):
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    if user.email.lower() in ["admin@demo.com", "kestroy.stephan@demo.com"] or user.role == "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="System Admin role is protected and cannot be modified"
        )

    user.role = role_in.role
    await user.save()
    
    return _map_user(user)

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: str,
    current_user: User = Depends(require_role("admin", "manager"))
):
    if str(current_user.id) == user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete your own account")
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user.email.lower() in ["admin@demo.com", "kestroy.stephan@demo.com"] or user.role == "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="System Admin accounts are protected and cannot be deleted by any user"
        )

    await user.delete()
    return None

@router.post("/{user_id}/reset-password")
async def reset_user_password(
    user_id: str,
    current_user: User = Depends(require_role("admin", "manager"))
):
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    invite_token = secrets.token_urlsafe(24)
    user.invite_token = invite_token
    await user.save()
    
    invitation_link = f"http://localhost:5173/setup-password?token={invite_token}&email={user.email}"
    
    return {
        "message": f"Password reset email sent to {user.email}",
        "email": user.email,
        "name": user.name,
        "invitation_link": invitation_link
    }


