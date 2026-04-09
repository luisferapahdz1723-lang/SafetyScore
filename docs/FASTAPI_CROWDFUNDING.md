# FastAPI + Crowdfunding PyME

## Stack backend

- FastAPI + Uvicorn
- SQLAlchemy + Alembic
- JWT simple (`python-jose`)
- Password hashing (`passlib` + bcrypt)
- MySQL (puerto local recomendado: `3307`)

## Estructura

- `backend/main.py`: app FastAPI + CORS + routers
- `backend/core/`: configuración y seguridad JWT
- `backend/db/session.py`: engine y sesión SQLAlchemy
- `backend/models/entities.py`: modelos `users`, `profiles`, `businesses`, `crowdfunding_requests`, `investments`
- `backend/api/routes/`: auth, negocios, crowdfunding, marketplace
- `backend/alembic/`: migración inicial del esquema

## Variables de entorno usadas

Se leen desde `.env` (raíz del proyecto):

- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DB`
- `APP_URL`
- `JWT_SECRET`
- `JWT_ALGORITHM`
- `JWT_ACCESS_TOKEN_MINUTES`

## Comandos locales

1. Instalar dependencias Python:
   - `pip install -r backend/requirements.txt`
2. Levantar API:
   - `npm run server`
3. Frontend:
   - `npm run dev`

## Endpoints clave

### Health
- `GET /api/health`

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/signin`

### Business
- `POST /api/businesses`
- `GET /api/businesses/me`

### Crowdfunding PyME
- `POST /api/crowdfunding/requests`
- `GET /api/crowdfunding/requests/me`
- `GET /api/crowdfunding/requests/{id}`
- `PATCH /api/crowdfunding/requests/{id}`
- `PATCH /api/crowdfunding/requests/{id}/status`
- `POST /api/crowdfunding/requests/{id}/invest`

### Marketplace/compatibilidad frontend
- `GET /api/opportunities`
- `GET /api/opportunities/{id}`
- `GET /api/marketplace/summary`
- `POST /api/investments`
- `GET /api/investments?investor_id=...`
- `GET /api/portfolio/{investor_id}/metrics`

## Flujo E2E validado

1. Usuario PyME inicia sesión.
2. Registra negocio (`/api/businesses`).
3. Crea solicitud crowdfunding (`/api/crowdfunding/requests`).
4. Ve listado de campañas propias en UI (`pyme-crowdfunding-list`).
5. Inversionista inicia sesión.
6. Visualiza marketplace (`/api/opportunities`).
7. Invierte (`/api/investments` o `/api/crowdfunding/requests/{id}/invest`).
8. El monto fondeado se actualiza y puede transicionar a `funded`.

## Nota de transición

El script `npm run server` ya apunta a FastAPI. El backend Node queda disponible temporalmente en `npm run server:legacy` para rollback rápido.
