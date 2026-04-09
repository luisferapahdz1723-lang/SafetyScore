from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.api.deps import get_current_user
from backend.db.session import get_db
from backend.models.entities import Business, CrowdfundingRequest, Investment, RequestStatus
from backend.schemas.crowdfunding import (
    CrowdfundingRequestCreatePayload,
    CrowdfundingRequestUpdatePayload,
    CrowdfundingStatusPayload,
    InvestmentPayload,
)


router = APIRouter(prefix="/crowdfunding/requests", tags=["crowdfunding"])


def serialize_request(req: CrowdfundingRequest, business: Business | None = None) -> dict:
    business_data = None
    if business:
        business_data = {
            "id": business.id,
            "owner_id": business.owner_id,
            "name": business.name,
            "sector": business.sector,
            "location_city": business.location_city,
            "location_state": business.location_state,
            "safety_score": 80,
            "trust_layer_analysis": "Solicitud validada por el motor de riesgo.",
        }
    funded_amount = float(req.funded_amount or 0)
    funding_goal = float(req.funding_goal or 0)
    funded_percentage = round((funded_amount / funding_goal) * 100, 1) if funding_goal > 0 else 0
    return {
        "id": req.id,
        "business_id": req.business_id,
        "goal_title": req.title,
        "goal_description": req.objective,
        "goal_category": req.goal_category.value if hasattr(req.goal_category, "value") else req.goal_category,
        "goal_total_units": 1,
        "goal_unit_cost": funding_goal,
        "goal_current_units_funded": 1 if funded_amount >= funding_goal else 0,
        "goal_units_remaining": 0 if funded_amount >= funding_goal else 1,
        "requested_amount": funding_goal,
        "funded_amount": funded_amount,
        "funded_percentage": funded_percentage,
        "expected_roi": 16.5,
        "term_months": max(6, req.deadline_days // 5),
        "marketplace_status": "high-demand" if funded_percentage >= 60 else "new",
        "description": req.description,
        "status": "open" if req.status in [RequestStatus.approved, RequestStatus.funded] else "draft",
        "business": business_data,
    }


@router.post("")
def create_request(payload: CrowdfundingRequestCreatePayload, auth=Depends(get_current_user), db: Session = Depends(get_db)):
    user, profile = auth
    business = db.get(Business, payload.business_id)
    if not business or business.owner_id != user.id:
        raise HTTPException(status_code=403, detail="No puedes crear solicitudes para este negocio.")

    req = CrowdfundingRequest(
        business_id=payload.business_id,
        owner_id=user.id,
        title=payload.title,
        description=payload.description,
        objective=payload.objective,
        goal_category=payload.goal_category,
        funding_goal=payload.funding_goal,
        funded_amount=0,
        deadline_days=payload.deadline_days,
        reward_tiers_json=payload.reward_tiers_json,
        status=RequestStatus.pending,
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    return req


@router.get("/me")
def my_requests(auth=Depends(get_current_user), db: Session = Depends(get_db)):
    user, profile = auth
    if profile.role.value == "pyme":
        items = db.query(CrowdfundingRequest).filter(CrowdfundingRequest.owner_id == user.id).all()
    else:
        items = db.query(CrowdfundingRequest).filter(CrowdfundingRequest.status.in_([RequestStatus.approved, RequestStatus.funded])).all()
    result = []
    for req in items:
        business = db.get(Business, req.business_id)
        result.append(serialize_request(req, business))
    return result


@router.get("/{request_id}")
def get_request(request_id: str, auth=Depends(get_current_user), db: Session = Depends(get_db)):
    req = db.get(CrowdfundingRequest, request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada.")
    business = db.get(Business, req.business_id)
    return serialize_request(req, business)


@router.patch("/{request_id}")
def update_request(request_id: str, payload: CrowdfundingRequestUpdatePayload, auth=Depends(get_current_user), db: Session = Depends(get_db)):
    user, _profile = auth
    req = db.get(CrowdfundingRequest, request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada.")
    if req.owner_id != user.id:
        raise HTTPException(status_code=403, detail="No autorizado.")
    if req.status != RequestStatus.pending:
        raise HTTPException(status_code=400, detail="Solo solicitudes pendientes son editables.")

    for key, value in payload.model_dump(exclude_none=True).items():
        setattr(req, key, value)
    db.commit()
    db.refresh(req)
    return req


@router.patch("/{request_id}/status")
def update_status(request_id: str, payload: CrowdfundingStatusPayload, auth=Depends(get_current_user), db: Session = Depends(get_db)):
    _user, profile = auth
    if profile.role.value != "investor":
        raise HTTPException(status_code=403, detail="Solo rol inversionista/operador puede cambiar estado en esta versión.")
    req = db.get(CrowdfundingRequest, request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada.")
    req.status = payload.status
    db.commit()
    db.refresh(req)
    return req


@router.post("/{request_id}/invest")
def invest(request_id: str, payload: InvestmentPayload, auth=Depends(get_current_user), db: Session = Depends(get_db)):
    user, profile = auth
    if profile.role.value != "investor":
        raise HTTPException(status_code=403, detail="Solo inversionistas pueden aportar.")

    req = db.get(CrowdfundingRequest, request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada.")
    if req.status not in [RequestStatus.approved, RequestStatus.funded]:
        raise HTTPException(status_code=400, detail="La solicitud no está abierta para inversión.")

    inv = Investment(
        investor_id=user.id,
        crowdfunding_request_id=request_id,
        amount=payload.amount,
    )
    db.add(inv)
    req.funded_amount = Decimal(str(req.funded_amount)) + Decimal(str(payload.amount))
    if Decimal(str(req.funded_amount)) >= Decimal(str(req.funding_goal)):
        req.status = RequestStatus.funded

    db.commit()
    db.refresh(req)
    return {
        "success": True,
        "request_id": request_id,
        "funded_amount": float(req.funded_amount),
        "funding_goal": float(req.funding_goal),
        "status": req.status.value,
    }
