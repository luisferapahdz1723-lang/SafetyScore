# SafetyScore — Casos de Uso: Vista General del Sistema

## UC-00: Diagrama General del Ecosistema

```mermaid
graph TB
    subgraph Actores
        PYME[("👤 Dueño de PYME\n(Comerciante)")]
        INV[("🏦 Inversionista /\nMicrofinanciera")]
        IA[("🤖 IA de SafetyScore\n(Claude 3.5 Sonnet)")]
        ADMIN[("⚙️ Administrador\nde Plataforma")]
    end

    subgraph SafetyScore["🔐 Plataforma SafetyScore"]
        MARKET[Marketplace de\nOportunidades]
        SCORE[Motor de\nSafetyScore]
        PROSP[Generador de\nProspectos]
        PORTAL_PYME[Portal PYME\nDashboard]
        PORTAL_INV[Portal Inversionista]
        AUTH[Autenticación\nSupabase]
    end

    subgraph Externos["🌐 Servicios Externos"]
        NESSIE[API Nessie\n(Simulación Bancaria)]
        STRIPE[Stripe / Open Banking\n(Dispersión Fondos)]
    end

    PYME -->|Registra negocio y\nnecesidad de capital| PORTAL_PYME
    PORTAL_PYME --> SCORE
    SCORE --> IA
    IA -->|Genera dictamen| PROSP
    PROSP --> MARKET
    INV -->|Navega y filtra| PORTAL_INV
    PORTAL_INV --> MARKET
    INV -->|Hace oferta de inversión| MARKET
    MARKET -->|Notifica match| PYME
    NESSIE -->|Simula flujo de caja| SCORE
    STRIPE -.->|Dispersión de fondos\n(proyectado)| PYME
    ADMIN --> AUTH
```

---

## UC-01: Visión General de Casos de Uso por Actor

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#1e293b', 'primaryTextColor': '#f1f5f9', 'primaryBorderColor': '#3b82f6', 'lineColor': '#64748b', 'secondaryColor': '#0f172a', 'tertiaryColor': '#1e293b'}}}%%

graph LR
    subgraph PYME_UC["Actor: Dueño de PYME"]
        UC1[Registrarse en la plataforma]
        UC2[Completar Wizard de Solicitud]
        UC3[Ver SafetyScore asignado]
        UC4[Editar necesidad de inversión]
        UC5[Vincular cuenta bancaria]
        UC6[Ver visitas de inversionistas]
        UC7[Recibir y aceptar oferta]
        UC8[Firmar contrato digitalmente]
        UC9[Ver desglose de pagos]
    end

    subgraph INV_UC["Actor: Inversionista / Microfinanciera"]
        UC10[Registrarse como inversionista]
        UC11[Navegar el Marketplace]
        UC12[Filtrar oportunidades]
        UC13[Ver Prospecto de Inversión]
        UC14[Revisar dictamen de IA]
        UC15[Hacer oferta de inversión]
        UC16[Gestionar portafolio]
        UC17[Exportar reportes CSV/Excel]
    end

    subgraph IA_UC["Actor: IA - Motor de Análisis"]
        UC18[Validar Unit Economics]
        UC19[Calcular SafetyScore]
        UC20[Generar dictamen automático]
        UC21[Comparar benchmarking sectorial]
        UC22[Proyectar ROI]
    end

    subgraph ADMIN_UC["Actor: Administrador"]
        UC23[Gestionar usuarios]
        UC24[Supervisar transacciones]
        UC25[Configurar parámetros de scoring]
    end
```
