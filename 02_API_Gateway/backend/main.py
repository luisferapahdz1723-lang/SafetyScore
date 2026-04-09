from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.routes.auth import router as auth_router
from backend.api.routes.businesses import router as business_router
from backend.api.routes.crowdfunding import router as crowdfunding_router
from backend.api.routes.health import router as health_router
from backend.api.routes.marketplace import router as marketplace_router
from backend.core.config import settings


app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.app_url, "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix=settings.api_prefix)
app.include_router(auth_router, prefix=settings.api_prefix)
app.include_router(business_router, prefix=settings.api_prefix)
app.include_router(crowdfunding_router, prefix=settings.api_prefix)
app.include_router(marketplace_router, prefix=settings.api_prefix)
