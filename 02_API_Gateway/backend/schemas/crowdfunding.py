from pydantic import BaseModel, Field


class CrowdfundingRequestCreatePayload(BaseModel):
    business_id: str
    title: str = Field(min_length=4, max_length=255)
    description: str = Field(min_length=10)
    objective: str = Field(min_length=8)
    goal_category: str = "inventario"
    funding_goal: float = Field(gt=0)
    deadline_days: int = Field(ge=7, le=365)
    reward_tiers_json: str | None = None


class CrowdfundingRequestUpdatePayload(BaseModel):
    title: str | None = None
    description: str | None = None
    objective: str | None = None
    goal_category: str | None = None
    funding_goal: float | None = None
    deadline_days: int | None = None
    reward_tiers_json: str | None = None


class CrowdfundingStatusPayload(BaseModel):
    status: str


class InvestmentPayload(BaseModel):
    amount: float = Field(gt=0)
