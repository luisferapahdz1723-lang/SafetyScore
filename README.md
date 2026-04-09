# SafetyScore

Plataforma de crowdfunding para PyMEs con:

- Frontend en React + Vite + TypeScript
- Backend en FastAPI (Python)
- Base de datos MySQL

## Estructura principal

- `01_Frontend/`: UI y cliente web
- `02_API_Gateway/backend/`: backend FastAPI activo
- `05_Data_Access/`: SQL y capa de acceso a datos
- `07_Infraestructura/`: variables/config base
- `docs/`: documentación y diagramas

## Requisitos

- Node.js 18+ y npm
- Python 3.11+ (recomendado 3.12)
- MySQL 8+

## Compilar y ejecutar (rápido)

### 1) Instalar dependencias frontend

```bash
npm install
```

### 2) Instalar dependencias backend (FastAPI)

```bash
pip install -r 02_API_Gateway/backend/requirements.txt
```

### 3) Configurar variables de entorno

Crear `07_Infraestructura/.env` (puedes basarte en `07_Infraestructura/.env.example`) con:

```env
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3307
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DB=safetyscore
APP_URL=http://localhost:3000
JWT_SECRET=change_this_in_production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_MINUTES=120
```

### 4) Crear esquema y datos iniciales en MySQL

```bash
mysql -h 127.0.0.1 -P 3307 -u root -e "CREATE DATABASE IF NOT EXISTS safetyscore;"
mysql -h 127.0.0.1 -P 3307 -u root safetyscore < 05_Data_Access/schema.fastapi.sql
mysql -h 127.0.0.1 -P 3307 -u root safetyscore < 05_Data_Access/seed.fastapi.sql
```

### 5) Levantar backend FastAPI

```bash
npm run server
```

Backend disponible en: `http://localhost:8000`  
Swagger/OpenAPI: `http://localhost:8000/docs`

### 6) Levantar frontend

En otra terminal:

```bash
npm run dev
```

Frontend disponible en: `http://localhost:3000`

## Compilar para producción (frontend)

```bash
npm run build
```

Los assets compilados se generan con Vite usando la configuración en `01_Frontend/`.

## Scripts útiles

- `npm run lint`: validación TypeScript
- `npm run preview`: previsualizar build frontend
- `npm run server:legacy`: backend Node legado (solo fallback)

