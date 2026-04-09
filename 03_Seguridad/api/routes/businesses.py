from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.api.deps import get_current_user
from backend.db.session import get_db
from backend.models.entities import Business
from backend.schemas.business import BusinessCreatePayload


router = APIRouter(prefix="/businesses", tags=["businesses"])


@router.post("")
def create_business(
    payload: BusinessCreatePayload,
    auth=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user, profile = auth
    if profile.role.value != "pyme":
        raise HTTPException(status_code=403, detail="Solo PyMEs pueden registrar negocio.")

    business = Business(
        owner_id=user.id,
        name=payload.name,
        sector=payload.sector,
        location_city=payload.location_city,
        location_state=payload.location_state,
        years_operating=payload.years_operating,
        employees=payload.employees,
        daily_sales=payload.daily_sales,
        fixed_costs=payload.fixed_costs,
        variable_costs=payload.variable_costs,
        has_debts=1 if payload.has_debts else 0,
        debt_amount=payload.debt_amount,
    )
    db.add(business)
    db.commit()
    db.refresh(business)
    return business


@router.get("/me")
def get_my_business(auth=Depends(get_current_user), db: Session = Depends(get_db)):
    user, _profile = auth
    return db.query(Business).filter(Business.owner_id == user.id).all()
