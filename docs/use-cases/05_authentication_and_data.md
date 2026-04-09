# SafetyScore — Casos de Uso: Autenticación y Flujos de Datos

## UC-D01: Flujo de Autenticación (Supabase)

```mermaid
sequenceDiagram
    actor U as 👤 Usuario
    participant APP as React App
    participant SUP as 🗄️ Supabase Auth
    participant DB as 🗄️ Supabase DB

    U->>APP: Accede a SafetyScore
    APP->>U: Muestra pantalla de login

    alt Registro nuevo
        U->>APP: Selecciona: "Soy Negocio" o "Soy Inversionista"
        APP->>SUP: signUp(email, password, rol)
        SUP->>DB: Crea registro en tabla usuarios
        DB->>SUP: Usuario creado
        SUP->>APP: Session token
        APP->>U: Redirige a Wizard (PYME)\no a Marketplace (Inversionista)
    else Login existente
        U->>APP: Ingresa email + contraseña
        APP->>SUP: signIn(email, password)
        SUP->>APP: Session token válido
        APP->>DB: Consulta perfil del usuario
        DB->>APP: Perfil + rol
        APP->>U: Redirige a su dashboard correspondiente
    else Sesión activa
        APP->>SUP: getSession()
        SUP->>APP: Session válida
        APP->>U: Dashboard directamente
    end
```

---

## UC-D02: Arquitectura de Datos — Entidades Principales

```mermaid
erDiagram
    USUARIO {
        uuid id PK
        string email
        string rol "pyme | inversionista | admin"
        timestamp created_at
        boolean is_verified
    }

    PYME {
        uuid id PK
        uuid usuario_id FK
        string nombre_negocio
        string sector
        string zona_geografica
        decimal ventas_diarias
        decimal costos_diarios
        decimal monto_solicitado
        string proposito_capital
        int safety_score
        string grade "A|B|C|no_apto"
        string estatus "draft|evaluando|publicado|fondeado"
        timestamp created_at
        timestamp updated_at
    }

    DICTAMEN {
        uuid id PK
        uuid pyme_id FK
        text texto_dictamen
        decimal roi_proyectado
        json dimensiones_score
        string modelo_ia "claude-3-5-sonnet"
        timestamp generated_at
    }

    INVERSION {
        uuid id PK
        uuid pyme_id FK
        uuid inversionista_id FK
        decimal monto_ofrecido
        decimal tasa_acordada
        int plazo_meses
        string estatus "pendiente|aceptada|rechazada|activa|cerrada"
        timestamp fecha_oferta
        timestamp fecha_aceptacion
    }

    INVERSIONISTA {
        uuid id PK
        uuid usuario_id FK
        string nombre_institucion
        string tipo "microfinanciera|sofipo|individual"
        decimal aum_total
        decimal retorno_acumulado
    }

    PORTAFOLIO_ITEM {
        uuid id PK
        uuid inversionista_id FK
        uuid inversion_id FK
        decimal monto_actual
        decimal retorno_actual
        timestamp proximo_pago
    }

    NESSIE_CUENTA {
        uuid id PK
        uuid pyme_id FK
        string nessie_account_id
        decimal saldo_promedio
        json historial_3_meses
        timestamp sincronizado_at
    }

    USUARIO ||--o{ PYME : "tiene perfil"
    USUARIO ||--o{ INVERSIONISTA : "tiene perfil"
    PYME ||--|| DICTAMEN : "tiene dictamen"
    PYME ||--|| NESSIE_CUENTA : "conecta cuenta"
    PYME ||--o{ INVERSION : "recibe inversiones"
    INVERSIONISTA ||--o{ INVERSION : "hace inversiones"
    INVERSION ||--o{ PORTAFOLIO_ITEM : "forma parte del portafolio"
```

---

## UC-D03: Integración con API Nessie (Simulación Bancaria)

```mermaid
flowchart TD
    PYME([👤 PYME]) -->|Clic: Vincular banco| NESSIE_AUTH[Autorizar conexión\nNessie API]

    NESSIE_AUTH --> FETCH[Consultar datos de cuenta]
    FETCH --> N1[GET /accounts/:id]
    FETCH --> N2[GET /accounts/:id/transactions]
    FETCH --> N3[GET /accounts/:id/deposits]

    N1 & N2 & N3 --> PROCESS[Procesar datos\nen AWS Lambda]

    PROCESS --> P1[Calcular saldo promedio\n3 meses]
    PROCESS --> P2[Detectar patrones\nde depósitos]
    PROCESS --> P3[Identificar volatilidad\nde flujo]
    PROCESS --> P4[Generar sparkline\nde tendencia]

    P1 & P2 & P3 & P4 --> SAVE[Guardar en Supabase\nTabla: nessie_cuentas]

    SAVE --> UPDATE_SCORE[Re-calcular SafetyScore\ncon datos reales]
    UPDATE_SCORE --> UPDATE_PROSP[Actualizar Prospecto\nen Marketplace]

    UPDATE_PROSP --> INV([🏦 Inversionista ve\ngráfica TradingView actualizada])
```

---

## UC-D04: Flujo de Notificaciones en Tiempo Real

```mermaid
sequenceDiagram
    participant DB as 🗄️ Supabase\n(Realtime)
    participant SERVER as ⚡ Servidor
    participant PYME_APP as 📱 App PYME
    participant INV_APP as 💻 App Inversionista

    note over DB: Supabase Realtime via WebSockets

    SERVER->>DB: INSERT inversión (oferta nueva)
    DB-->>PYME_APP: 🔔 "¡Tienes una nueva oferta!"
    PYME_APP->>DB: PYME acepta oferta
    DB-->>INV_APP: 🔔 "Tu oferta fue aceptada"

    SERVER->>DB: UPDATE pyme.estatus = 'evaluando'
    DB-->>PYME_APP: 🔔 "Tu SafetyScore está siendo calculado"

    SERVER->>DB: UPDATE pyme.safety_score = 88
    DB-->>PYME_APP: 🔔 "¡Tu SafetyScore está listo: 88/100!"

    SERVER->>DB: UPDATE pyme.estatus = 'fondeado'
    DB-->>PYME_APP: 🔔 "¡Tu negocio fue fondeado exitosamente!"
    DB-->>INV_APP: 🔔 "Inversión confirmada. Fondos en camino."
```
