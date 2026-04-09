from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from backend.core.config import settings
from backend.db.session import get_db
from backend.models.entities import Profile, User


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/signin")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> tuple[User, Profile]:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        user_id: str | None = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError as exc:
        raise credentials_exception from exc

    user = db.get(User, user_id)
    profile = db.get(Profile, user_id)
    if not user or not profile:
        raise credentials_exception
    return user, profile
