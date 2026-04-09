from pydantic import BaseModel


class BusinessCreatePayload(BaseModel):
    name: str
    sector: str = "Comercio"
    location_city: str = "CDMX"
    location_state: str = "CDMX"
    years_operating: int = 1
    employees: int = 1
    daily_sales: float = 0
    fixed_costs: float = 0
    variable_costs: float = 0
    has_debts: bool = False
    debt_amount: float = 0
