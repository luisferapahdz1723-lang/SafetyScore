from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.api.deps import get_current_user
from backend.db.session import get_db
from backend.models.entities import Business, CrowdfundingRequest, Investment, RequestStatus
from backend.schemas.crowdfunding import InvestmentPayload


router = APIRouter(tags=["marketplace"])


def serialize_market(req: CrowdfundingRequest, business: Business | None) -> dict:
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
        "status": "open",
        "business": {
            "id": business.id if business else req.business_id,
            "owner_id": business.owner_id if business else req.owner_id,
            "name": business.name if business else "Negocio",
            "sector": business.sector if business else "Comercio",
            "location_city": business.location_city if business else "CDMX",
            "location_state": business.location_state if business else "CDMX",
            "safety_score": 80,
            "trust_layer_analysis": "Solicitud validada por el motor de riesgo.",
        },
    }


@router.get("/opportunities")
def get_opportunities(db: Session = Depends(get_db)):
    rows = db.query(CrowdfundingRequest).filter(CrowdfundingRequest.status.in_([RequestStatus.approved, RequestStatus.funded])).all()
    result = []
    for req in rows:
        business = db.get(Business, req.business_id)
        result.append(serialize_market(req, business))
    return result


@router.get("/opportunities/{opportunity_id}")
def get_opportunity(opportunity_id: str, db: Session = Depends(get_db)):
    req = db.get(CrowdfundingRequest, opportunity_id)
    if not req:
        return None
    business = db.get(Business, req.business_id)
    return serialize_market(req, business)


@router.get("/marketplace/summary")
def marketplace_summary(db: Session = Depends(get_db)):
    q = db.query(CrowdfundingRequest).filter(CrowdfundingRequest.status.in_([RequestStatus.approved, RequestStatus.funded]))
    rows = q.all()
    count = len(rows)
    total_requested = sum(float(r.funding_goal or 0) for r in rows)
    total_funded = sum(float(r.funded_amount or 0) for r in rows)
    avg_roi = 16.5 if count > 0 else 0
    high_demand = 0
    for r in rows:
        goal = float(r.funding_goal or 0)
        funded = float(r.funded_amount or 0)
        if goal > 0 and (funded / goal) >= 0.6:
            high_demand += 1
    high_pct = (high_demand / count * 100) if count else 0
    return {
        "openOpportunities": count,
        "totalRequestedAmount": total_requested,
        "totalFundedAmount": total_funded,
        "averageROI": avg_roi,
        "highDemandPercentage": high_pct,
    }


@router.post("/investments")
def invest_legacy(payload: dict, auth=Depends(get_current_user), db: Session = Depends(get_db)):
    user, profile = auth
    if profile.role.value != "investor":
        raise HTTPException(status_code=403, detail="Solo inversionistas pueden aportar.")
    opportunity_id = payload.get("opportunity_id")
    amount = float(payload.get("amount", 0))
    if not opportunity_id or amount <= 0:
        raise HTTPException(status_code=400, detail="Payload inválido.")
    req = db.get(CrowdfundingRequest, opportunity_id)
    if not req:
        raise HTTPException(status_code=404, detail="Oportunidad no encontrada.")

    inv = Investment(investor_id=user.id, crowdfunding_request_id=req.id, amount=amount)
    db.add(inv)
    req.funded_amount = float(req.funded_amount or 0) + amount
    if float(req.funded_amount) >= float(req.funding_goal):
        req.status = RequestStatus.funded
    db.commit()
    return {
        "success": True,
        "investedAmount": amount,
        "contributedUnits": 1 if amount >= float(req.funding_goal) else 0,
        "fundedAmount": float(req.funded_amount),
        "goalCurrentUnitsFunded": 1 if float(req.funded_amount) >= float(req.funding_goal) else 0,
    }


@router.get("/investments")
def get_investments(investor_id: str, db: Session = Depends(get_db)):
    invs = db.query(Investment).filter(Investment.investor_id == investor_id).all()
    out = []
    for inv in invs:
        req = db.get(CrowdfundingRequest, inv.crowdfunding_request_id)
        business = db.get(Business, req.business_id) if req else None
        out.append(
            {
                "id": inv.id,
                "investor_id": inv.investor_id,
                "opportunity_id": inv.crowdfunding_request_id,
                "amount": float(inv.amount),
                "status": "active",
                "next_payment_date": None,
                "opportunity": serialize_market(req, business) if req else None,
            }
        )
    return out


@router.get("/portfolio/{investor_id}/metrics")
def portfolio_metrics(investor_id: str, db: Session = Depends(get_db)):
    invs = db.query(Investment).filter(Investment.investor_id == investor_id).all()
    total = sum(float(i.amount or 0) for i in invs)
    avg_roi = 16.5 if invs else 0
    return {
        "totalInvested": total,
        "accumulatedReturn": round(total * (avg_roi / 100), 2),
        "averageROI": avg_roi,
        "activeInvestments": len(invs),
    }
