# SafetyScore — Casos de Uso: Motor de IA y SafetyScore

## UC-AI01: Flujo Completo del Motor de Análisis IA

```mermaid
flowchart TD
    INPUT([📥 Datos del Wizard PYME]) --> VALIDATE{Validar completitud\nde datos}
    VALIDATE -->|Incompletos| REJECT1[❌ Solicita datos faltantes\nal usuario]
    VALIDATE -->|Completos| ECONOMICS[Calcular Unit Economics]

    ECONOMICS --> E1[Margen bruto diario\nVentas - Costos]
    ECONOMICS --> E2[Punto de equilibrio\n¿Cuántos días para pagar?]
    ECONOMICS --> E3[Ratio de viabilidad\n¿Puede asumir el préstamo?]

    E1 & E2 & E3 --> BENCH[Benchmarking Sectorial]
    BENCH --> B1[Comparar margen vs\npromedio del sector]
    BENCH --> B2[Comparar monto vs\ntickets típicos del sector]
    BENCH --> B3[Validar consistencia\ncon zona geográfica]

    B1 & B2 & B3 --> NESSIE[🏦 Consultar API Nessie\nFlujo de caja simulado]
    NESSIE --> CASHFLOW[Análisis de flujo:\n- Consistencia de depósitos\n- Volatilidad de saldo\n- Tendencia 3 meses]

    CASHFLOW --> SCORE_CALC[🧮 Cálculo del SafetyScore]
    SCORE_CALC --> S1["Dimensión 1: Salud Financiera (35%)"]
    SCORE_CALC --> S2["Dimensión 2: Consistencia Operativa (25%)"]
    SCORE_CALC --> S3["Dimensión 3: Viabilidad del Préstamo (25%)"]
    SCORE_CALC --> S4["Dimensión 4: Benchmarking Sectorial (15%)"]

    S1 & S2 & S3 & S4 --> FINAL_SCORE[SafetyScore Final\n0 - 100 pts]

    FINAL_SCORE --> BADGE{Asignar Badge}
    BADGE -->|80-100| GRADE_A[🟢 Grado A\nBajo Riesgo]
    BADGE -->|60-79| GRADE_B[🟡 Grado B\nRiesgo Medio]
    BADGE -->|40-59| GRADE_C[🟠 Grado C\nRiesgo Alto]
    BADGE -->|< 40| GRADE_D[🔴 No apto\nNo publicar]

    GRADE_A & GRADE_B & GRADE_C --> DICTAMEN[📝 Generar Dictamen IA\n(Texto en lenguaje natural)]
    GRADE_A & GRADE_B & GRADE_C --> ROI_PROJ[📊 Proyectar ROI\npara el inversionista]

    DICTAMEN & ROI_PROJ --> PUBLISH[✅ Publicar en Marketplace]
    GRADE_D --> FEEDBACK[💬 Retroalimentación al PYME\nQué mejorar para re-aplicar]
```

---

## UC-AI02: Generación del Dictamen Automático

```mermaid
sequenceDiagram
    participant DATA as 📊 Datos del Negocio
    participant BEDROCK as 🤖 Amazon Bedrock\n(Claude 3.5 Sonnet)
    participant LAMBDA as ⚡ AWS Lambda
    participant DB as 🗄️ Supabase
    participant MARKET as 🏪 Marketplace

    DATA->>LAMBDA: Trigger: Datos validados
    LAMBDA->>BEDROCK: Prompt: Generar dictamen crediticio

    note over BEDROCK: Input:\n- Unit Economics\n- SafetyScore\n- Benchmarking sectorial\n- Flujo de caja (Nessie)

    BEDROCK->>BEDROCK: Procesa con Claude 3.5 Sonnet

    note over BEDROCK: Output:\n- Texto de análisis en español\n- Puntos fuertes del negocio\n- Factores de riesgo\n- Recomendación de inversión

    BEDROCK->>LAMBDA: Retorna dictamen generado
    LAMBDA->>DB: Guarda dictamen + metadata
    DB->>MARKET: Prospecto listo para publicar

    note over MARKET: El inversionista ve:\n"IA Análisis: Este negocio mantiene\nun margen 12% superior al promedio\nde su zona, con consistencia de\npagos diaria muy sólida."
```

---

## UC-AI03: Motor de Cálculo del SafetyScore (Detalle)

```mermaid
graph TD
    subgraph INPUT["📥 Inputs del Sistema"]
        I1[Ventas diarias declaradas]
        I2[Costos operativos]
        I3[Monto solicitado]
        I4[Propósito del crédito]
        I5[Flujo de caja bancario\nvía Nessie API]
        I6[Datos del sector\nbenchmarking]
    end

    subgraph DIMENSIONS["🧮 4 Dimensiones del Score"]
        D1["💰 Salud Financiera (35%)
        - Margen neto > 0
        - Ratio deuda/ingreso
        - Capacidad de pago"]

        D2["📅 Consistencia Operativa (25%)
        - Ventas regulares vs estacionales
        - Días activos al mes
        - Volatilidad de ingresos"]

        D3["✅ Viabilidad del Préstamo (25%)
        - Monto solicitado vs ingresos
        - Plazo razonable
        - Propósito productivo"]

        D4["📊 Benchmarking Sectorial (15%)
        - Margen vs industria
        - Ticket vs mercado
        - Zona geográfica"]
    end

    subgraph OUTPUT["📤 Outputs"]
        O1[SafetyScore: 0-100]
        O2[Badge: A / B / C / No apto]
        O3[ROI Proyectado para inversionista]
        O4[Dictamen en lenguaje natural]
        O5[Sugerencias de mejora para PYME]
    end

    I1 & I2 & I3 & I4 --> D1 & D3
    I5 --> D2
    I6 --> D4

    D1 --> CALC[Suma ponderada]
    D2 --> CALC
    D3 --> CALC
    D4 --> CALC

    CALC --> O1
    O1 --> O2
    O1 --> O3
    O1 --> O4
    O1 --> O5
```

---

## UC-AI04: Validación Anti-Fraude (Proof of Business)

```mermaid
flowchart LR
    subgraph SIGNALS["🔍 Señales de Validación"]
        V1["📍 Validación Geográfica\n¿Existe la dirección?\n¿Es zona comercial?"]
        V2["💳 Validación de Flujo\n¿El flujo Nessie coincide\ncon lo declarado?"]
        V3["📈 Validación Sectorial\n¿Los números son\nplausibles para el sector?"]
        V4["🔄 Validación de Consistencia\n¿Los datos son coherentes\nentre sí?"]
    end

    subgraph RESULT["⚖️ Resultado"]
        OK["✅ PASS\nProspecto publicable"]
        WARN["⚠️ WARNING\nRequiere revisión manual"]
        FRAUD["🚨 FRAUD SIGNAL\nBloquear publicación"]
    end

    V1 & V2 & V3 & V4 --> SCORE_FRAUD[Motor Anti-Fraude\nPuntuación de confianza]

    SCORE_FRAUD -->|Confianza > 80%| OK
    SCORE_FRAUD -->|Confianza 50-80%| WARN
    SCORE_FRAUD -->|Confianza < 50%| FRAUD

    WARN --> REVIEW[Revisión por administrador]
    REVIEW --> OK
    REVIEW --> FRAUD
```
