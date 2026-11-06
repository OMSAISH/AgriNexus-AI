from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token
from app.core.config import settings
from app.models.user import User, UserRoleEnum
from app.models.audit_log import AuditLog
from app.schemas.user import UserCreate, UserResponse, Token, LoginRequest
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication & User Management"])


@router.post(
    "/register",
    response_model=Token,
    status_code=status.HTTP_201_CREATED,
    summary="Register New User Account"
)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user (Farmer, Agronomist, or CHC Operator).
    Public administrator registration is restricted.
    """
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists.",
        )
    
    # Enforce safe role selection
    assigned_role = user_in.role
    if assigned_role == UserRoleEnum.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Public registration as Administrator is prohibited.",
        )

    new_user = User(
        email=user_in.email.lower(),
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        phone_number=user_in.phone_number,
        preferred_language=user_in.preferred_language or "en",
        primary_role=assigned_role,
        is_active=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Log audit event
    audit = AuditLog(
        user_id=new_user.id,
        action="REGISTER",
        resource_type="USER",
        resource_id=new_user.id,
        details={"email": new_user.email, "role": new_user.primary_role.value},
    )
    db.add(audit)
    db.commit()

    access_token = create_access_token(subject=str(new_user.id), role=new_user.primary_role.value)
    refresh_token = create_refresh_token(subject=str(new_user.id))

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse.model_validate(new_user),
    )


@router.post(
    "/login",
    response_model=Token,
    status_code=status.HTTP_200_OK,
    summary="User Login with Email and Password"
)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate user with email and password, returning JWT access and refresh tokens.
    """
    user = db.query(User).filter(User.email == credentials.email.lower()).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated.",
        )

    # Log audit login
    audit = AuditLog(
        user_id=user.id,
        action="LOGIN",
        resource_type="USER",
        resource_id=user.id,
        details={"email": user.email},
    )
    db.add(audit)
    db.commit()

    access_token = create_access_token(subject=str(user.id), role=user.primary_role.value)
    refresh_token = create_refresh_token(subject=str(user.id))

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse.model_validate(user),
    )


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Current Authenticated User Profile"
)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """
    Return currently authenticated user profile based on bearer token.
    """
    return UserResponse.model_validate(current_user)


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    summary="User Logout"
)
def logout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Records logout event for audit log.
    """
    audit = AuditLog(
        user_id=current_user.id,
        action="LOGOUT",
        resource_type="USER",
        resource_id=current_user.id,
        details={"email": current_user.email},
    )
    db.add(audit)
    db.commit()
    return {"success": True, "message": "Successfully logged out."}
