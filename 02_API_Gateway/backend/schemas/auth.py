from pydantic import BaseModel, EmailStr


class SignInPayload(BaseModel):
    email: EmailStr
    password: str


class SignUpPayload(BaseModel):
    email: EmailStr
    password: str
    role: str = "pyme"
    full_name: str = "Usuario Nuevo"


class TokenUser(BaseModel):
    id: str
    email: str
    role: str
    full_name: str


class AuthResponse(BaseModel):
    user: dict
    session: dict
