# MEGA PROMPT — SafetyScore: Vista "Soy Inversionista — Busco Oportunidades"

---

## CONTEXTO DE LA TAREA PARA STITCH
Vas a diseñar la interfaz exclusiva para el **INVERSIONISTA o INSTITUCIÓN MICROFINANCIERA** dentro de la plataforma SafetyScore. Este usuario busca rentabilidad, gestión del riesgo, y toma decisiones rápidas basadas en datos. Se conectan a SafetyScore para "comprar" (evaluar e invertir) oportunidades pre-validadas por IA.

---

## DIRECTRICES VISUALES: BLOOMBERG TERMINAL V2 / FINTECH B2B

> **La meta es transmitir eficiencia, densidad de datos y control absoluto.**

- **Tema Obligatorio**: **Dark Mode**. Fondos grises oscuros tipo grafito o azul noche (`#111827`, `#0F172A`).
- **Colores de Acento**:
  - **Azul Eléctrico (#3B82F6)** o Índigo para acciones principales.
  - **Semáforo para datos**: Verde (`#10B981`) para altas tasas de retorno; Ámbar (`#F59E0B`) para riesgo medio; Rojo (`#EF4444`) cautela.
- **Tipografía**: Monospace para los números (para que formen tablas ordenadas, ej. Roboto Mono o JetBrains Mono). Inter para el texto normal. Tamaños más reducidos para alojar alta densidad de información.
- **Espaciado**: Interfaz compacta (High-density). Menos padding, más información valiosa en pantalla.
- **Formas**: Bordes más rectos (`rounded-md`, o máximo `rounded-lg`). Divisiones con líneas sutiles en lugar de grandes tarjetas voladoras (borders en `#334155`).
- **Lenguaje UI**: Analítico, financiero, preciso. "ROI", "Benchmarking", "Trust Score", "Unit Economics".

---

## PANTALLAS A PROTOTIPAR

### 1. El Marketplace (Screener de Oportunidades)
- **Top Bar**: Search bar potente, exportación a CSV/Excel.
- **Sidebar Izquierdo (Filtros Avanzados)**:
  - Sliders dobles para: "ROI Anual (10% - 35%)", "Ticket de Inversión ($)".
  - Checkboxes para "SafetyScore Mínimo (A, B, C)".
  - Tags de Sector (Abarrotes, Manufactureras, etc).
- **Área Central (Data Grid view)**: 
  - Una tabla expansiva (Data Table). No uses tarjetas gigantes, usa filas compactas informativas.
  - Columnas sugeridas: [Nombre del Negocio] | [Sector] | [SafetyScore Badge] | [Monto Solicitado] | [ROI Esperado] | [Estatus (Ej. "70% Fondeado")].
  - Un sparkline (mini gráfica) en una columna que muestre la tendencia de ventas del negocio de los últimos 3 meses.

### 2. El Prospecto de Inversión (Vista Detallada del Solicitante)
- **Estructura Split View**: Contenido del análisis a la izquierda (70%), panel de acción/compra a la derecha (30%).
- **El Dictamen de la IA (Trust Layer)**: Una caja destacada visualmente con un texto autogenerado (simulado). Ej: *"IA Análisis: Este negocio mantiene un margen 12% superior al promedio de su zona, con consistencia de pagos diaria muy sólida."*
- **Gráficas de Datos**:
  - Una gráfica de Área tipo TradingView (fondo oscuro, línea azul neón) que muestre el "Flujo de Vida y Proyección" de las cuentas del negocio.
  - Un diagrama de araña (Radar chart) comparando "Flujo de Caja, Antigüedad, Ubicación" vs la industria.
- **Panel Lateral de Cierre (Derecha)**:
  - Resaltar: *"Faltan $20,000 para cerrar la ronda"*.
  - Botón: *"Inyectar Capital"*.

### 3. Portafolio del Administrador (Mis Inversiones)
- Dashboard gerencial oscuro.
- Tarjetas top métricas (Kpis numéricos grandes).
  - Total Activos Bajo Gestión (AUM).
  - Retorno Acumulado.
- Gráfica combinada (barras y líneas) de los rendimientos mensuales vs proyectados.
- Lista resumida de las PyMEs a las que ya fondeó, ordenadas por "Próximo pago esperado".
