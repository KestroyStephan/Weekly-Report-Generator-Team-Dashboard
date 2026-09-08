from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, HTTPException, status, Response, Cookie, Depends
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr

from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserOut, SetupPasswordRequest
from app.services.auth_service import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from app.deps import get_current_user
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Auth"])

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

def _map_user(u: User) -> UserOut:
    return UserOut(
        id=str(u.id),
        name=u.name,
        email=u.email,
        role=u.role,
        created_at=u.created_at
    )

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate):
    existing_user = await User.find_one(User.email == user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address is already registered"
        )
    
    role = user_in.role if user_in.role in ["member", "manager", "admin"] else "member"
    
    user = User(
        name=user_in.name,
        email=user_in.email,
        password_hash=hash_password(user_in.password),
        role=role
    )
    await user.insert()
    return _map_user(user)

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, response: Response):
    user = await User.find_one(User.email == credentials.email)
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token({"sub": str(user.id), "role": user.role, "email": user.email})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
        samesite="lax",
        secure=False
    )
    
    return TokenResponse(access_token=access_token, user=_map_user(user))

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(response: Response, refresh_token: Optional[str] = Cookie(None)):
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token missing")
    
    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    
    user_id = payload.get("sub")
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    
    new_access_token = create_access_token({"sub": str(user.id), "role": user.role, "email": user.email})
    new_refresh_token = create_refresh_token({"sub": str(user.id)})
    
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
        samesite="lax",
        secure=False
    )
    
    return TokenResponse(access_token=new_access_token, user=_map_user(user))

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="refresh_token")
    return {"message": "Logged out successfully"}

class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None

@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return _map_user(current_user)

@router.put("/me", response_model=UserOut)
async def update_me(data: ProfileUpdateRequest, current_user: User = Depends(get_current_user)):
    if data.name and data.name.strip():
        current_user.name = data.name.strip()
    
    if data.email and data.email.strip() != current_user.email:
        new_email = data.email.strip()
        existing = await User.find_one(User.email == new_email)
        if existing and str(existing.id) != str(current_user.id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email address is already in use by another account"
            )
        current_user.email = new_email
        
    if data.new_password and data.new_password.strip():
        if not data.current_password or not verify_password(data.current_password, current_user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect"
            )
        current_user.password_hash = hash_password(data.new_password.strip())
        
    await current_user.save()
    return _map_user(current_user)

@router.post("/setup-password")
async def setup_password(data: SetupPasswordRequest):
    user = await User.find_one(User.email == data.email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    if user.invite_token and user.invite_token != data.token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired setup token")
    
    user.password_hash = hash_password(data.password)
    user.invite_token = None
    await user.save()
    
    return {"message": "Password setup successfully. You can now login to your account."}

