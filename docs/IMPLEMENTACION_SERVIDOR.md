# 🔧 Implementación: Refactor del Servidor + MySQL + Login Real

> **Proyecto:** SafetyScore — Marketplace de Inversión MiPyME  
> **Fecha:** 9 de Abril, 2026  
> **Autor:** Equipo SafetyScore  

---

## 📋 Tabla de Contenidos

1. [Diagnóstico del Problema](#-diagnóstico-del-problema)
2. [Arquitectura Actual vs Propuesta](#-arquitectura-actual-vs-propuesta)
3. [Paso 1: Instalación de MySQL](#-paso-1-instalación-de-mysql)
4. [Paso 2: Creación de Base de Datos](#-paso-2-creación-de-base-de-datos)
5. [Paso 3: Refactor del Servidor Express](#-paso-3-refactor-del-servidor-express)
6. [Paso 4: Conexión del Frontend](#-paso-4-conexión-del-frontend)
7. [Paso 5: Verificación End-to-End](#-paso-5-verificación-end-to-end)
8. [Credenciales de Demo](#-credenciales-de-demo)
9. [Troubleshooting](#-troubleshooting)

---

## 🔍 Diagnóstico del Problema

### Estado Actual

El servidor Express (`server/index.js`) **no puede arrancar** por tres razones simultáneas:

| # | Problema | Archivo | Línea |
|---|----------|---------|-------|
| 1 | **MySQL no instalado** en la máquina actual. El `mysql3307.ini` apunta a `C:/Users/palet/...` (otro equipo) | `mysql3307.ini` | L3 |
| 2 | **Bug ESM vs CommonJS** — usa `require('crypto')` dentro de un módulo ESM (`import`) | `server/index.js` | L96-97, L193 |
| 3 | **Query SQL inválida** — subquery mal formateada en el endpoint de métricas de portafolio | `server/index.js` | L240 |

### Estado del Frontend

El archivo `src/services/supabaseClient.ts` actúa como un **mock completo en memoria**:
- Todos los datos están hardcodeados (usuarios, negocios, oportunidades, etc.)
- La función `signIn()` valida credenciales contra un objeto JavaScript local
- **Nunca hace ninguna petición HTTP al servidor**

### Consecuencia

El login "funciona" pero es 100% falso — no valida nada contra la base de datos. El servidor Express no arranca y no se usa para nada.

---

## 🏗 Arquitectura Actual vs Propuesta

### Antes (Mock)
```
┌──────────────┐
│   Frontend   │
│  React/Vite  │──────── Todo hardcodeado en supabaseClient.ts
│  :3000       │         (sin red, sin BD, sin servidor)
└──────────────┘
```

### Después (Real)
```
┌──────────────┐     HTTP POST        ┌──────────────┐      SQL        ┌──────────┐
│   Frontend   │ ──────────────────▶  │   Express    │ ─────────────▶  │  MySQL   │
│  React/Vite  │  /api/auth/signin    │   Server     │   SELECT *     │  :3306   │
│  :3000       │ ◀──────────────────  │   :3002      │ ◀─────────────  │          │
└──────────────┘     JSON response    └──────────────┘    rows[]       └──────────┘
                                             │
                                      Solo el login es
                                      real. El resto de
                                      datos sigue en mock
                                      para el demo.
```

---

## 📦 Paso 1: Instalación de MySQL

### Opción A: Via winget (recomendada)

```powershell
# Verificar si MySQL ya está instalado
mysql --version

# Si NO está instalado:
winget install -e --id Oracle.MySQL
```

### Opción B: Descarga manual

1. Descargar MySQL Community Server 8.x desde: https://dev.mysql.com/downloads/mysql/
2. Seleccionar "Windows (x86, 64-bit), ZIP Archive"
3. Extraer e instalar

### Post-instalación

```powershell
# Verificar que MySQL está corriendo
mysql -u root -p -e "SELECT 1;"

# Si usa otro puerto, verificar:
netstat -an | findstr :3306
```

> **IMPORTANTE:** Anotar la contraseña de root que se configuró durante la instalación. Se usará en el archivo `.env`.

---

## 🗄 Paso 2: Creación de Base de Datos

### 2.1 Crear el archivo `.env` en la raíz del proyecto

```env
# === MySQL Local ===
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=TU_PASSWORD_AQUI
MYSQL_DB=safetyscore

# === API Keys (existentes) ===
GEMINI_API_KEY=MY_GEMINI_API_KEY
APP_URL=http://localhost:3000
```

### 2.2 Ejecutar el Schema

```powershell
# Desde la raíz del proyecto:
mysql -u root -p < server/schema.sql
```

Esto crea la base de datos `safetyscore` con las siguientes tablas:

| Tabla | Descripción |
|-------|-------------|
| `users` | Credenciales de autenticación (reemplaza auth.users de Supabase) |
| `profiles` | Perfiles con rol (pyme/investor) y nombre |
| `businesses` | Datos de negocio de cada PYME |
| `opportunities` | Oportunidades de inversión publicadas |
| `investments` | Inversiones realizadas por inversionistas |
| `notifications` | Alertas y notificaciones del sistema |
| `business_financial_records` | Historial de ingresos/gastos mensuales |
| `payments` | Amortizaciones de inversiones |
| `contracts` | Contratos entre inversionista y PYME |
| `opportunity_views` | Tracking de vistas de oportunidades |

### 2.3 Ejecutar el Seed (datos de demo)

```powershell
mysql -u root -p < server/seed.sql
```

### 2.4 Verificar los datos

```powershell
mysql -u root -p -e "SELECT id, email, password_hash FROM safetyscore.users LIMIT 5;"
```

Resultado esperado:
```
+--------------------------------------+-------------------------+---------------+
| id                                   | email                   | password_hash |
+--------------------------------------+-------------------------+---------------+
| 00000000-0000-0000-0000-000000000001 | pyme1@safetyscore.com   | dummy_password|
| 00000000-0000-0000-0000-000000000098 | negocio@test.com        | password123   |
| 00000000-0000-0000-0000-000000000099 | inversionista@test.com  | password123   |
+--------------------------------------+-------------------------+---------------+
```

---

## 🔨 Paso 3: Refactor del Servidor Express

### Archivo: `server/index.js`

### 3.1 Fix: ESM vs CommonJS

**ANTES (roto):**
```javascript
// Línea 96-97 — Mezcla import con require (falla en ESM)
const { v4: uuidv4 } = await import('crypto');
const id = require('crypto').randomUUID(); // ❌ require no existe en ESM
```

**DESPUÉS (corregido):**
```javascript
// Al inicio del archivo, agregar:
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

// Luego donde se usa:
const id = randomUUID(); // ✅ Funciona en ESM
```

### 3.2 Fix: Conexión MySQL con variables de entorno

**ANTES:**
```javascript
const pool = mysql.createPool({
  host: '127.0.0.1',
  port: 3307,           // Puerto no estándar
  user: 'root',
  password: '',          // Hardcodeado
  database: 'safetyscore',
});
```

**DESPUÉS:**
```javascript
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DB || 'safetyscore',
  waitForConnections: true,
  connectionLimit: 10,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});
```

### 3.3 Fix: Query SQL de Métricas de Portafolio

**ANTES (query inválida):**
```sql
-- Línea 240: Subquery dentro de AVG sin paréntesis — error de sintaxis MySQL
COALESCE(AVG(SELECT expected_roi FROM opportunities WHERE id = inv.opportunity_id), 0)
```

**DESPUÉS (corregida):**
```sql
-- Esta query ya no se usa; la métrica se calcula con la segunda query (que sí funciona)
SELECT
  COALESCE(SUM(amount), 0) AS totalInvested,
  COUNT(CASE WHEN status = 'active' THEN 1 END) AS activeInvestments
FROM investments
WHERE investor_id = ?
```

### 3.4 Nuevo: Endpoint `/api/health`

```javascript
// Agregar al servidor:
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: 'error', db: 'disconnected', error: error.message });
  }
});
```

### 3.5 Nuevo: Endpoint `/api/auth/signup`

```javascript
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, role, full_name } = req.body;
    const id = randomUUID();

    await pool.query(
      'INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)',
      [id, email, password]
    );

    await pool.query(
      'INSERT INTO profiles (id, role, full_name) VALUES (?, ?, ?)',
      [id, role || 'pyme', full_name || 'Usuario Nuevo']
    );

    const [profiles] = await pool.query('SELECT * FROM profiles WHERE id = ?', [id]);
    const profile = profiles[0];

    const userData = {
      id, email,
      user_metadata: { role: profile.role, full_name: profile.full_name }
    };

    res.status(201).json({
      user: userData,
      session: { access_token: 'MOCK_TOKEN_LOCAL_' + Date.now(), user: userData, profile }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Este email ya está registrado.' });
    }
    res.status(500).json({ error: error.message });
  }
});
```

### 3.6 Resumen del `server/index.js` refactorizado

```javascript
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DB || 'safetyscore',
  waitForConnections: true,
  connectionLimit: 10,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Health check
app.get('/api/health', async (req, res) => { /* ... */ });

// Auth
app.post('/api/auth/signin', async (req, res) => { /* ... */ });
app.post('/api/auth/signup', async (req, res) => { /* ... */ });

// Profiles, Businesses, Opportunities, Investments, etc. (sin cambios)

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`✅ Servidor MySQL-Express local corriendo en http://localhost:${PORT}`);
});
```

---

## 🖥 Paso 4: Conexión del Frontend

### Archivo: `src/services/supabaseClient.ts`

> **Estrategia:** Solo se modifica la función `signIn()`. Todo lo demás permanece en mock para que el demo funcione sin llenar MySQL con todos los datos del marketplace.

### 4.1 Cambio en la función `signIn`

**ANTES (mock en memoria):**
```typescript
export async function signIn(email: string, password: string) {
  await delay(400);
  const entry = MOCK_USERS[email.toLowerCase()];
  if (!entry) throw new Error('Usuario no encontrado...');
  if (entry.password !== password) throw new Error('Contraseña incorrecta...');
  // ... construye sesión desde datos locales
}
```

**DESPUÉS (petición HTTP real):**
```typescript
const API_BASE = 'http://localhost:3002';

export async function signIn(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Error de autenticación');
  }

  const data = await res.json();

  // Obtener el perfil del mock local para mantener la experiencia completa del demo
  const mockProfile = MOCK_PROFILES[data.user.id] || {
    id: data.user.id,
    role: data.user.user_metadata?.role || 'pyme',
    full_name: data.user.user_metadata?.full_name || 'Usuario',
    created_at: new Date().toISOString(),
  };

  // Mapear IDs del seed de MySQL a los del mock del frontend
  const ID_MAP: Record<string, string> = {
    '00000000-0000-0000-0000-000000000098': 'usr-0098',
    '00000000-0000-0000-0000-000000000099': 'usr-0099',
  };

  const localId = ID_MAP[data.user.id] || data.user.id;
  const profile = MOCK_PROFILES[localId] || mockProfile;

  const session = {
    access_token: data.session.access_token,
    user: { ...data.user, id: localId },
    profile,
  };

  localStorage.setItem('app_session', JSON.stringify(session));
  return { user: session.user, session };
}
```

### 4.2 ¿Por qué existe un ID_MAP?

Los datos seed de MySQL usan UUIDs largos (`00000000-0000-0000-0000-000000000098`) mientras que los mocks del frontend usan IDs cortos (`usr-0098`). El mapeo conecta ambos mundos:

- **Login real** → se valida contra MySQL (contraseña real, usuario real)
- **Datos del demo** → se sirven desde los mocks locales (usando el ID mapeado)
- **Resultado** → el login es real pero el demo completo sigue funcionando

---

## ✅ Paso 5: Verificación End-to-End

### 5.1 Verificar MySQL

```powershell
mysql -u root -p -e "SELECT email, password_hash FROM safetyscore.users WHERE email LIKE '%test%';"
```

### 5.2 Verificar el Servidor

```powershell
# Arrancar el servidor
npm run server

# En otra terminal, probar la salud
curl http://localhost:3002/api/health
# Esperado: {"status":"ok","db":"connected"}
```

### 5.3 Verificar el Login via API

```powershell
# Login como PYME
curl -X POST http://localhost:3002/api/auth/signin `
  -H "Content-Type: application/json" `
  -d '{"email":"negocio@test.com","password":"password123"}'

# Login como Inversionista
curl -X POST http://localhost:3002/api/auth/signin `
  -H "Content-Type: application/json" `
  -d '{"email":"inversionista@test.com","password":"password123"}'
```

### 5.4 Verificar el Frontend

1. Abrir `http://localhost:3000`
2. Hacer login con `negocio@test.com` / `password123`
3. Debe redirigir al **Dashboard de PYME**
4. Cerrar sesión
5. Hacer login con `inversionista@test.com` / `password123`
6. Debe redirigir al **Marketplace de Inversionista**

---

## 🔑 Credenciales de Demo

| Email | Contraseña | Rol | Descripción |
|-------|------------|-----|-------------|
| `negocio@test.com` | `password123` | PYME | Dueño de "Servicios Demo Test" |
| `inversionista@test.com` | `password123` | Inversionista | "Demo Inversionista" |
| `pyme1@safetyscore.com` | `dummy_password` | PYME | María González - Abarrotes |
| `pyme2@safetyscore.com` | `dummy_password` | PYME | Rafael Mendoza |
| `inv1@safetyscore.com` | `dummy_password` | Inversionista | Financiera CREA |

---

## 🔥 Troubleshooting

### Error: `ECONNREFUSED 127.0.0.1:3306`
MySQL no está corriendo. Verificar con:
```powershell
net start mysql80
# o
mysqld --console
```

### Error: `Access denied for user 'root'`
La contraseña en `.env` no coincide con la de MySQL:
```powershell
# Resetear contraseña (administrador):
mysqladmin -u root password "nueva_password"
```

### Error: `ER_BAD_DB_ERROR: Unknown database 'safetyscore'`
No se ejecutó el schema:
```powershell
mysql -u root -p < server/schema.sql
mysql -u root -p < server/seed.sql
```

### Error: `EADDRINUSE: Port 3002 already in use`
Otro proceso ya ocupa el puerto:
```powershell
netstat -ano | findstr :3002
taskkill /PID <PID> /F
```

### El frontend muestra "Error de red" al hacer login
El servidor Express no está corriendo o CORS está bloqueando:
1. Verificar que `npm run server` está activo
2. Verificar que el servidor imprime `✅ Servidor corriendo en http://localhost:3002`
3. Abrir DevTools (F12) → Network → ver la petición POST a `/api/auth/signin`

---

## 📁 Estructura de Archivos Modificados

```
SafetyScore/
├── .env                              ← NUEVO (config de MySQL)
├── server/
│   ├── index.js                      ← MODIFICADO (fix bugs + .env + health)
│   ├── schema.sql                    ← SIN CAMBIOS
│   └── seed.sql                      ← SIN CAMBIOS
├── src/
│   └── services/
│       └── supabaseClient.ts         ← MODIFICADO (signIn → fetch real)
└── IMPLEMENTACION_SERVIDOR.md        ← ESTE ARCHIVO
```

---

> **Siguiente paso:** Ejecutar cada fase en orden. Comenzar con la instalación de MySQL y seguir hasta la verificación del login desde el browser.
