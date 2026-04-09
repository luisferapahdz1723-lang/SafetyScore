# SafetyScore — Casos de Uso: Flujos del Inversionista / Microfinanciera

## UC-I01: Navegación del Marketplace (Screener)

```mermaid
flowchart TD
    START([🏦 Inversionista accede al Portal]) --> AUTH[Autenticación\nSupabase]
    AUTH --> MARKET[🔍 Marketplace — Screener de Oportunidades]

    MARKET --> FILTER[Panel de Filtros Avanzados]
    FILTER --> F1[ROI Anual: 10% - 35%\nSlider doble]
    FILTER --> F2[Ticket de Inversión: $\nRango mínimo / máximo]
    FILTER --> F3[SafetyScore Mínimo\nA / B / C]
    FILTER --> F4[Sector de Negocio\nAbarrotes, Farmacia, Manufactura...]
    FILTER --> F5[Zona Geográfica\nEstado / Ciudad]

    F1 & F2 & F3 & F4 & F5 --> GRID[📊 Data Grid — Tabla de Resultados]

    GRID --> COLS["Columnas:
    [Nombre] | [Sector] | [Score] | 
    [Monto] | [ROI] | [% Fondeado] | [Sparkline]"]

    COLS --> SORT[Ordenar por columna]
    COLS --> EXPORT[📥 Exportar CSV/Excel]
    COLS --> SELECT[👆 Seleccionar negocio]

    SELECT --> PROSPECTO[Ver Prospecto de Inversión]
```

---

## UC-I02: Revisión del Prospecto de Inversión (Vista Detallada)

```mermaid
graph LR
    subgraph Split["Vista Split (70% / 30%)"]
        subgraph LEFT["Panel Izquierdo — Análisis (70%)"]
            IA_BOX["🤖 Dictamen de IA\nTexto autogenerado:\n'Este negocio mantiene un margen\n12% superior al promedio...'"]
            CHART1["📈 Gráfica TradingView\nFlujo de Vida y Proyección\n(Nessie API data)"]
            CHART2["🕸️ Radar Chart\nComparación sectorial:\nFlujo de Caja / Antigüedad /\nUbicación / Consistencia"]
            METRICS["📋 Unit Economics\nVentas diarias / Costos /\nMargen / Punto de equilibrio"]
        end

        subgraph RIGHT["Panel Derecho — Acción (30%)"]
            ROUND["💰 Estado de la Ronda\n'Faltan $20,000 para cerrar'"]
            BADGE["🏅 SafetyScore Badge\nA / B / C + puntuación"]
            ROI_CALC["📊 Calculadora de ROI\nIngresa monto → Ver retorno"]
            CTA["⚡ Botón: Inyectar Capital"]
        end
    end

    INV([🏦 Inversionista]) --> LEFT
    INV --> RIGHT
    CTA --> OFERTA[Flujo de Oferta]
```

---

## UC-I03: Proceso de Realización de Oferta

```mermaid
sequenceDiagram
    actor I as 🏦 Inversionista
    participant P as Portal Inversionista
    participant DB as 🗄️ Supabase
    participant N as 🔔 Notificaciones
    actor PY as 👤 PYME

    I->>P: Clic en "Inyectar Capital"
    P->>I: Modal: Confirmar oferta
    I->>P: Ingresa monto a invertir
    P->>I: Muestra ROI proyectado y condiciones
    I->>P: Confirma la oferta

    P->>DB: Registra oferta de inversión
    DB->>DB: Actualiza % fondeado del negocio
    DB->>N: Genera notificación para PYME

    N->>PY: 🔔 "¡Microfinanciera XYZ quiere invertir en ti!"
    PY->>DB: PYME acepta oferta

    DB->>I: Notificación: Oferta aceptada
    DB->>DB: Inicia proceso de dispersión
    P->>I: Dashboard actualizado:\nNueva inversión en portafolio
```

---

## UC-I04: Gestión del Portafolio de Inversiones

```mermaid
graph TD
    INV([🏦 Inversionista]) --> PORTFOLIO[📊 Dashboard de Portafolio]

    PORTFOLIO --> KPIs[KPIs Principales]
    KPIs --> K1["💼 AUM\nActivos Bajo Gestión\n$X,XXX,XXX MXN"]
    KPIs --> K2["📈 Retorno Acumulado\nX.X% vs proyectado"]
    KPIs --> K3["🏢 # Empresas Activas\nN negocios fondeados"]
    KPIs --> K4["⏰ Próximo Cobro\nFecha y monto"]

    PORTFOLIO --> CHART[Gráfica Combinada\nRendimientos mensuales\nvs proyectados]

    PORTFOLIO --> LIST[Lista de PyMEs Fondeadas]
    LIST --> ITEM["Fila por negocio:
    [Nombre] | [Sector] | [Monto] | 
    [% Retorno] | [Próximo Pago] | [Estado]"]

    ITEM --> ACTION1[Ver detalle del negocio]
    ITEM --> ACTION2[Ver historial de pagos]
    ITEM --> ACTION3[Exportar reporte]

    PORTFOLIO --> EXPORT_ALL[📥 Exportar portafolio completo\nCSV / Excel / PDF]
```

---

## UC-I05: Sistema de Filtros y Búsqueda Avanzada

```mermaid
stateDiagram-v2
    [*] --> MarketplaceVacio: Inversionista entra

    MarketplaceVacio --> ConFiltros: Aplica filtros

    state ConFiltros {
        [*] --> SinFiltro
        SinFiltro --> FiltroROI: Ajusta ROI (10%-35%)
        SinFiltro --> FiltroTicket: Ajusta Ticket ($)
        SinFiltro --> FiltroScore: Selecciona Score (A/B/C)
        SinFiltro --> FiltroSector: Selecciona Sector
        SinFiltro --> FiltroZona: Selecciona Zona Geo

        FiltroROI --> CombinaDos: Combina filtros
        FiltroTicket --> CombinaDos
        FiltroScore --> CombinaDos
        FiltroSector --> CombinaDos
        FiltroZona --> CombinaDos
    }

    ConFiltros --> ResultadosFiltrados: Aplica búsqueda
    ResultadosFiltrados --> SinResultados: No hay coincidencias
    ResultadosFiltrados --> ConResultados: Hay oportunidades

    SinResultados --> ConFiltros: Ajusta filtros
    ConResultados --> VerProspecto: Selecciona negocio
    ConResultados --> ExportaLista: Exporta CSV/Excel

    VerProspecto --> HaceOferta: Decide invertir
    HaceOferta --> [*]
```
