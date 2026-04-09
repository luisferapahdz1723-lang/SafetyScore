# SafetyScore — Casos de Uso: Flujos del Dueño de PYME

## UC-P01: Registro y Onboarding de la PYME (Wizard)

```mermaid
sequenceDiagram
    actor P as 👤 Dueño PYME
    participant W as Wizard de Solicitud
    participant IA as 🤖 IA SafetyScore
    participant DB as 🗄️ Supabase

    P->>W: Accede a "Soy Negocio"
    W->>P: Pantalla 1: ¿Cuánto vendes en un día bueno?
    P->>W: Ingresa monto de ventas diarias
    W->>P: Pantalla 2: ¿Cuánto son tus costos diarios?
    P->>W: Ingresa costos
    W->>P: Pantalla 3: ¿Para qué necesitas el dinero?
    P->>W: Describe necesidad de capital
    W->>P: Pantalla 4: ¿Cuánto necesitas?
    P->>W: Ingresa monto solicitado

    W->>DB: Guarda datos del negocio
    W->>IA: Envía datos para validación
    IA->>IA: Valida Unit Economics
    IA->>IA: Compara con benchmarking sectorial
    IA->>IA: Calcula SafetyScore
    IA->>DB: Guarda dictamen y score
    IA->>W: Retorna resultado

    W->>P: Muestra: "Evaluando tu Salud Financiera..."
    W->>P: ✅ Muestra SafetyScore (ej. 88/100)
    W->>P: "¡Estás listo para recibir inversión!"
```

---

## UC-P02: Dashboard Principal de la PYME

```mermaid
stateDiagram-v2
    [*] --> SinRegistro: Primera visita

    SinRegistro --> WizardActivo: Inicia solicitud
    WizardActivo --> EnEvaluacion: Envía datos completos

    EnEvaluacion --> Evaluando: IA procesa información
    Evaluando --> ScoreAsignado: Análisis completado

    ScoreAsignado --> PublicadoEnMarket: Aprobado por IA
    ScoreAsignado --> Rechazado: Datos insuficientes / No viable

    PublicadoEnMarket --> ConVisitas: Inversionistas ven el perfil
    ConVisitas --> OfertaRecibida: Inversionista hace oferta

    OfertaRecibida --> OfertaAceptada: PYME acepta
    OfertaRecibida --> OfertaRechazada: PYME rechaza

    OfertaAceptada --> FirmaDigital: Firma contrato
    FirmaDigital --> Fondeado: Dinero dispersado
    Fondeado --> [*]

    Rechazado --> WizardActivo: PYME corrige datos
    OfertaRechazada --> ConVisitas: Sigue en marketplace
```

---

## UC-P03: Acciones Rápidas del Dashboard PYME

```mermaid
usecase
```

```mermaid
graph TD
    PYME([👤 Dueño de PYME]) --> LOGIN[Iniciar Sesión]
    LOGIN --> DASH[Dashboard Principal]

    DASH --> A1[📝 Editar mi necesidad]
    DASH --> A2[🏦 Vincular mi banco]
    DASH --> A3[👁️ Ver mis visitas]
    DASH --> A4[📊 Ver mi SafetyScore]
    DASH --> A5[🔔 Ver notificaciones]

    A1 --> WIZARD[Wizard de Solicitud\n- Actualizar datos de venta\n- Cambiar monto solicitado\n- Ajustar descripción]

    A2 --> NESSIE[API Nessie / Open Banking\n- Conectar cuenta bancaria\n- Validar flujo de caja real\n- Autorizar lectura de movimientos]

    A3 --> VISITS[Estadísticas de Visibilidad\n- Nº de vistas del perfil\n- Inversionistas que guardaron\n- Nivel de interés acumulado]

    A4 --> SCORE_DETAIL[Detalle del Score\n- Desglose por dimensión\n- Comparativa sectorial\n- Sugerencias de mejora]

    A5 --> NOTIF[Centro de Notificaciones\n- Oferta de inversión recibida\n- Cambio de estado del proceso\n- Nuevos requerimientos de docs]
```

---

## UC-P04: Aceptación de Oferta y Firma Digital

```mermaid
flowchart TD
    START([🔔 Notificación: Nueva oferta recibida]) --> VIEW[PYME ve pantalla "¡Hicimos Match!"]
    VIEW --> DETAILS[Ver resumen:\n- Nombre del inversionista\n- Monto ofrecido\n- Plazo de pago\n- Tasa acordada]

    DETAILS --> REVIEW{¿Quiere revisar más?}
    REVIEW -->|Sí| BREAKDOWN[Ver desglose de pagos\n- Tabla de amortización\n- Calendario de pagos\n- Condiciones]
    BREAKDOWN --> DECISION{¿Acepta la oferta?}
    REVIEW -->|No, decide| DECISION

    DECISION -->|✅ Acepta| SIGN[Aceptar y firmar digitalmente]
    DECISION -->|❌ Rechaza| REJECT[Rechazar oferta]

    SIGN --> CONFIRM[Confirmar identidad\n- OTP / Biometría]
    CONFIRM --> CONTRACT[Contrato generado\nautomáticamente]
    CONTRACT --> DISPERSAL[Dispersión de fondos\nvía Stripe / Open Banking]
    DISPERSAL --> SUCCESS[✅ Capital recibido\nDashboard actualizado]

    REJECT --> BACK[Regresa al Marketplace\nEl perfil sigue activo]
```
