import enum
from datetime import datetime
from uuid import uuid4

from sqlalchemy import (
    CHAR,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.db.session import Base


def uuid_str() -> str:
    return str(uuid4())


class ProfileRole(str, enum.Enum):
    pyme = "pyme"
    investor = "investor"


class RequestStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    funded = "funded"
    rejected = "rejected"


class GoalCategory(str, enum.Enum):
    equipo = "equipo"
    inventario = "inventario"
    remodelacion = "remodelacion"


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(CHAR(36), primary_key=True, default=uuid_str)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    profile: Mapped["Profile"] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan")


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[str] = mapped_column(CHAR(36), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    role: Mapped[ProfileRole] = mapped_column(Enum(ProfileRole), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), default="", nullable=False)
    avatar_url: Mapped[str | None] = mapped_column(Text)
    nessie_customer_id: Mapped[str | None] = mapped_column(String(100))
    nessie_account_id: Mapped[str | None] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)

    user: Mapped[User] = relationship(back_populates="profile")
    businesses: Mapped[list["Business"]] = relationship(back_populates="owner")


class Business(Base):
    __tablename__ = "businesses"

    id: Mapped[str] = mapped_column(CHAR(36), primary_key=True, default=uuid_str)
    owner_id: Mapped[str] = mapped_column(CHAR(36), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    sector: Mapped[str] = mapped_column(String(100), default="Otro", nullable=False)
    location_city: Mapped[str] = mapped_column(String(100), default="", nullable=False)
    location_state: Mapped[str] = mapped_column(String(10), default="", nullable=False)
    years_operating: Mapped[int] = mapped_column(default=0)
    employees: Mapped[int] = mapped_column(default=1)
    daily_sales: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    fixed_costs: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    variable_costs: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    has_debts: Mapped[int] = mapped_column(default=0)
    debt_amount: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)

    owner: Mapped[Profile] = relationship(back_populates="businesses")
    crowdfunding_requests: Mapped[list["CrowdfundingRequest"]] = relationship(back_populates="business")


class CrowdfundingRequest(Base):
    __tablename__ = "crowdfunding_requests"

    id: Mapped[str] = mapped_column(CHAR(36), primary_key=True, default=uuid_str)
    business_id: Mapped[str] = mapped_column(CHAR(36), ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False)
    owner_id: Mapped[str] = mapped_column(CHAR(36), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    objective: Mapped[str] = mapped_column(Text, nullable=False)
    goal_category: Mapped[GoalCategory] = mapped_column(Enum(GoalCategory), nullable=False)
    funding_goal: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    funded_amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False, default=0)
    deadline_days: Mapped[int] = mapped_column(nullable=False, default=30)
    reward_tiers_json: Mapped[str | None] = mapped_column(Text)
    status: Mapped[RequestStatus] = mapped_column(Enum(RequestStatus), nullable=False, default=RequestStatus.pending)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    business: Mapped[Business] = relationship(back_populates="crowdfunding_requests")
    investments: Mapped[list["Investment"]] = relationship(back_populates="request")


class Investment(Base):
    __tablename__ = "investments"

    id: Mapped[str] = mapped_column(CHAR(36), primary_key=True, default=uuid_str)
    investor_id: Mapped[str] = mapped_column(CHAR(36), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    crowdfunding_request_id: Mapped[str] = mapped_column(CHAR(36), ForeignKey("crowdfunding_requests.id", ondelete="CASCADE"), nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    investment_date: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    next_payment_date: Mapped[datetime | None] = mapped_column(Date)

    request: Mapped[CrowdfundingRequest] = relationship(back_populates="investments")
