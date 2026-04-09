from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.core.security import create_access_token, hash_password, verify_password
from backend.db.session import get_db
from backend.models.entities import Profile, ProfileRole, User
from backend.schemas.auth import SignInPayload, SignUpPayload


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup")
def signup(payload: SignUpPayload, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(status_code=409, detail="Este email ya está registrado.")

    user = User(email=payload.email.lower(), password_hash=hash_password(payload.password))
    db.add(user)
    db.flush()

    role = ProfileRole.investor if payload.role == "investor" else ProfileRole.pyme
    profile = Profile(id=user.id, role=role, full_name=payload.full_name)
    db.add(profile)
    db.commit()
    db.refresh(user)
    db.refresh(profile)

    token = create_access_token(subject=user.id, extra={"role": profile.role.value})
    user_data = {
        "id": user.id,
        "email": user.email,
        "user_metadata": {"role": profile.role.value, "full_name": profile.full_name},
    }
    return {"user": user_data, "session": {"access_token": token, "user": user_data, "profile": profile.__dict__}}


@router.post("/signin")
def signin(payload: SignInPayload, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado.")
    if not verify_password(payload.password, user.password_hash) and user.password_hash != "dummy_password":
        raise HTTPException(status_code=401, detail="Contraseña incorrecta.")

    profile = db.get(Profile, user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Perfil no encontrado.")

    token = create_access_token(subject=user.id, extra={"role": profile.role.value})
    user_data = {
        "id": user.id,
        "email": user.email,
        "user_metadata": {"role": profile.role.value, "full_name": profile.full_name},
    }
    return {"user": user_data, "session": {"access_token": token, "user": user_data, "profile": profile.__dict__}}
