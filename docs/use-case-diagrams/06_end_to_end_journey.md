# SafetyScore — Caso de Uso End-to-End: Viaje Completo del Ecosistema

## UC-E2E01: Journada Completa del Sistema (Happy Path)

```mermaid
journey
    title SafetyScore — Viaje del Usuario (Happy Path)
    section PYME: Solicita Capital
      Ingresa datos de ventas: 5: PYME
      Completa el Wizard: 4: PYME
      Espera evaluación de IA: 3: PYME, Sistema
      Recibe SafetyScore 88/100: 5: PYME, IA
      Su negocio aparece en Marketplace: 5: PYME
    section Inversionista: Descubre Oportunidad
      Filtra por ROI > 15% en Abarrotes: 5: Inversionista
      Ve el perfil de la PYME: 4: Inversionista
      Lee dictamen de IA: 5: Inversionista
      Analiza gráfica TradingView: 4: Inversionista
      Hace oferta de $200,000 MXN: 5: Inversionista
    section Cierre: Inversión Exitosa
      PYME recibe notificación de oferta: 5: PYME, Sistema
      PYME acepta y firma digitalmente: 5: PYME
      Fondos son dispersados: 5: PYME, Inversionista
      Inversionista ve inversión en portafolio: 5: Inversionista
```

---

## UC-E2E02: Flujo Completo del Sistema (Técnico)

```mermaid
flowchart TD
    subgraph FASE1["📋 FASE 1: Publicación (La PYME)"]
        A1[PYME accede a 'Soy Negocio'] --> A2[Completa Wizard Typeform]
        A2 --> A3[Datos enviados a AWS Lambda]
        A3 --> A4[Lambda invoca Nessie API]
        A4 --> A5[Lambda invoca Amazon Bedrock]
        A5 --> A6[Claude 3.5 genera dictamen]
        A6 --> A7[Score calculado y guardado en Supabase]
        A7 --> A8[Prospecto publicado en Marketplace]
    end

    subgraph FASE2["⚖️ FASE 2: Evaluación (Motor de Riesgo)"]
        B1[SafetyScore 0-100 asignado] --> B2{Score >= 40?}
        B2 -->|Sí| B3[Badge A/B/C asignado]
        B2 -->|No| B4[PYME recibe feedback\nNo publicado]
        B3 --> B5[ROI proyectado calculado]
        B5 --> B6[Prospecto activo en Marketplace]
    end

    subgraph FASE3["🏪 FASE 3: Marketplace (El Inversionista)"]
        C1[Inversionista filtra oportunidades] --> C2[Selecciona negocio de interés]
        C2 --> C3[Lee dictamen de IA]
        C3 --> C4[Analiza gráficas y unit economics]
        C4 --> C5{¿Quiere invertir?}
        C5 -->|Sí| C6[Clic: Inyectar Capital]
        C5 -->|No| C1
        C6 --> C7[Ingresa monto a invertir]
        C7 --> C8[Confirma oferta]
    end

    subgraph FASE4["🤝 FASE 4: Cierre de Inversión"]
        D1[PYME recibe notificación: Match!] --> D2[PYME revisa oferta]
        D2 --> D3{¿Acepta oferta?}
        D3 -->|Sí| D4[Firma digital / OTP]
        D3 -->|No| D5[Rechaza — Sigue en Marketplace]
        D4 --> D6[Contrato generado automáticamente]
        D6 --> D7[Dispersión de fondos\nStripe / Open Banking]
        D7 --> D8[✅ PYME recibe capital]
        D7 --> D9[✅ Inversionista ve en portafolio]
    end

    FASE1 --> FASE2
    FASE2 --> FASE3
    FASE3 --> FASE4
```

---

## UC-E2E03: Mapa de Actores y Responsabilidades

```mermaid
mindmap
  root((SafetyScore\nEcosistema))
    PYME Dueño de Negocio
      Registrar negocio
      Completar Wizard de solicitud
      Vincular cuenta bancaria
      Ver SafetyScore asignado
      Aceptar/Rechazar ofertas
      Firmar digitalmente
    Inversionista / Microfinanciera
      Navegar Marketplace
      Filtrar por ROI, Sector, Zona
      Leer dictámenes de IA
      Analizar unit economics
      Hacer ofertas de inversión
      Gestionar portafolio
      Exportar reportes
    IA Motor de Análisis
      Validar Unit Economics
      Calcular SafetyScore
      Generar dictamen en NLP
      Benchmarking sectorial
      Proyectar ROI
      Detección anti-fraude
    Plataforma Técnica
      Autenticación Supabase
      Realtime notifications
      API Nessie integración
      AWS Lambda procesamiento
      Amazon Bedrock IA
      Stripe dispersión fondos
    Administrador
      Gestionar usuarios
      Supervisar transacciones
      Revisar casos borderline
      Configurar parámetros scoring
```

---

## UC-E2E04: Ciclo de Vida de un Negocio en SafetyScore

```mermaid
stateDiagram-v2
    [*] --> Registro: PYME se registra

    Registro --> WizardEnProgreso: Inicia Wizard

    WizardEnProgreso --> DatosCompletos: Completa todos los pasos
    WizardEnProgreso --> WizardEnProgreso: Guarda borrador

    DatosCompletos --> EnEvaluacion: Envía a validar

    state EnEvaluacion {
        [*] --> ValidandoEconomics
        ValidandoEconomics --> ConsultandoNessie
        ConsultandoNessie --> CalculandoScore
        CalculandoScore --> GenerandoDictamen
        GenerandoDictamen --> [*]
    }

    EnEvaluacion --> Publicado: Score >= 40 ✅
    EnEvaluacion --> NoApto: Score < 40 ❌

    NoApto --> WizardEnProgreso: PYME mejora datos

    Publicado --> ConVisitas: Inversionistas visitan
    ConVisitas --> Publicado: Sin ofertas aún

    ConVisitas --> OfertaRecibida: Inversionista hace oferta
    OfertaRecibida --> OfertaAceptada: PYME acepta
    OfertaRecibida --> Publicado: PYME rechaza

    OfertaAceptada --> EnProcesoDeFondeo: Firma digital completada
    EnProcesoDeFondeo --> Fondeado: Dispersión exitosa

    Fondeado --> EnRepago: PYME realiza pagos
    EnRepago --> Completado: Último pago realizado

    Completado --> [*]
```
