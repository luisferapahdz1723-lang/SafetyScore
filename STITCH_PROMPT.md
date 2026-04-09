# MEGA PROMPT — SafetyScore: Prototipo UI Completo para Stitch

---

## CONTEXTO DEL PROYECTO

SafetyScore es una plataforma Fintech de **Crowdfunding y Direct Lending** que conecta MiPyMEs (pequeños negocios como abarrotes, farmacias, papelerías) con Microfinancieras, SOFIPOS e inversionistas institucionales en México y Latinoamérica. La plataforma funciona como un **Marketplace de oportunidades de inversión**, donde la viabilidad del negocio se mide por su **Salud Operativa en tiempo real** (no por historial crediticio/Buró). Una IA actúa como "Analista de Crédito Virtual" que audita cada solicitud y genera un dictamen automático antes de publicarla.

---

## DIRECTRICES DE DISEÑO GLOBAL

### Identidad Visual
- **Estética**: Fusión entre la densidad informativa de **Bloomberg Terminal** y la claridad/accesibilidad de **Capital One**. El resultado debe sentirse **premium, institucional y confiable**, pero nunca intimidante para un dueño de abarrotes.
- **Paleta de colores**: Tonos oscuros predominantes (dark mode como base) con acentos en **verde esmeralda (#10B981)** para indicar seguridad/confianza y **azul eléctrico (#3B82F6)** para acciones principales. Usar **ámbar (#F59E0B)** para alertas y **rojo coral (#EF4444)** para riesgos. Fondos en tonos **slate/zinc oscuro (#0F172A, #1E293B)**. El texto principal en **blanco (#F8FAFC)** y secundario en **gris claro (#94A3B8)**.
- **Tipografía**: Inter o Outfit como fuente principal. Pesos variados: light para cuerpo, semibold para labels, bold para métricas/números grandes.
- **Bordes y superficies**: Glassmorphism sutil en tarjetas principales (backdrop-blur con bordes semi-transparentes). Border-radius generoso (12-16px). Sombras suaves con tinte de color.
- **Micro-animaciones**: Transiciones suaves en hover (scale 1.02, glow sutil en bordes). Los números y métricas deben sentirse como si "contaran" al cargar (efecto counter). Barras de progreso animadas.
- **Iconografía**: Lucide Icons o Phosphor Icons. Estilo outlined, consistente y minimalista.

### Principios UX
- **Dos experiencias, un sistema**: El diseño debe ser coherente entre el flujo PYME y el flujo Inversionista, pero con densidad de información adaptada a cada rol.
- **Progressive disclosure**: No abrumar. Mostrar lo esencial primero, detalles bajo demanda.
- **Trust-first**: Cada pantalla debe transmitir seguridad y profesionalismo. Badges de verificación, sellos de IA, indicadores de estado claros.

---

## PANTALLAS A PROTOTIPAR

---

### PANTALLA 1: LANDING PAGE (Pública)

**Propósito**: Primera impresión. Convertir visitantes en usuarios (PYMEs o Inversionistas).

**Layout**: Full-width, scroll vertical con secciones bien definidas.

**Secciones**:

1. **Hero Section**:
   - Headline grande y bold: *"Tu negocio vale más que tu historial crediticio"* o similar.
   - Subtítulo: Breve explicación de que SafetyScore conecta negocios reales con capital inteligente.
   - Dos CTAs lado a lado: **"Soy Negocio — Busco Inversión"** (verde) y **"Soy Inversionista — Busco Oportunidades"** (azul).
   - Fondo: Gradiente oscuro con una visualización abstracta de datos/nodos conectados (representando el marketplace).
   - Un mockup flotante sutil del dashboard (glassmorphism).

2. **Cómo Funciona** (3 pasos visuales):
   - Paso 1: Icono de tienda + "Publica tu negocio" → el comerciante sube sus datos.
   - Paso 2: Icono de IA/cerebro + "La IA evalúa tu salud operativa" → se genera el SafetyScore.
   - Paso 3: Icono de handshake/dinero + "Recibe inversión directa" → match con fondeador.
   - Usar línea conectora animada entre los pasos.

3. **SafetyScore Explicado**:
   - Una tarjeta grande mostrando un ejemplo de SafetyScore visual (gauge/medidor circular con puntaje 78/100).
   - Bullets: "No usamos Buró", "Medimos tu flujo de caja real", "IA que entiende tu negocio".

4. **Métricas de Confianza** (Social Proof):
   - Contadores animados: "+500 negocios evaluados", "+$15M MXN fondeados", "ROI promedio 18.5%".
   - (Datos simulados para el prototipo).

5. **Sección para Inversionistas**:
   - Texto: "Deja de esperar. Sal a buscar las mejores oportunidades."
   - Preview de 3 tarjetas de oportunidad del marketplace (mini-cards con sector, score, ROI).

6. **Footer**: Links legales, logo SafetyScore, "Regulado bajo principios LRITF" (simulado).

---

### PANTALLA 2: LOGIN / REGISTRO

**Propósito**: Autenticación unificada con selección de rol.

**Layout**: Split-screen. Lado izquierdo: branding/ilustración. Lado derecho: formulario.

**Contenido**:
- **Lado izquierdo**: Fondo oscuro con el logo SafetyScore grande, un tagline, y una ilustración abstracta de conexiones financieras (nodos, líneas, gráficas).
- **Lado derecho**: 
  - Tabs: "Iniciar Sesión" | "Registrarse".
  - **Login**: Email + Contraseña + Botón "Entrar" + Link "Olvidé mi contraseña" + Divider "o" + Botón Google Auth.
  - **Registro**: Selector de rol visible ("Soy un Negocio" / "Soy un Inversionista") con tarjetas seleccionables + campos básicos (Nombre, Email, Contraseña) + Botón "Crear Cuenta".

---

### PANTALLA 3: DASHBOARD PYME (Post-login del comerciante)

**Propósito**: Centro de control del dueño de negocio. Simple, claro, sin ruido.

**Layout**: Sidebar izquierdo (colapsable) + Área de contenido principal.

**Sidebar**:
- Logo SafetyScore (mini).
- Navegación vertical con iconos: Inicio, Mi Solicitud, Mi SafetyScore, Mis Finanzas, Configuración.
- Avatar del usuario abajo.

**Contenido Principal**:

1. **Header**: Saludo personalizado: *"Hola, Don José 👋"*, fecha actual, y un badge de estado general ("Tu negocio está en evaluación" / "Tu negocio está en el Marketplace" / "¡Felicidades! Has sido fondeado").

2. **Tarjeta de SafetyScore** (protagonista, centrada y grande):
   - Medidor circular (gauge) con el puntaje (ej. 74/100).
   - Color del gauge según nivel: verde (>70), ámbar (50-70), rojo (<50).
   - Etiqueta: "Salud Operativa: Buena".
   - Subtexto: "Actualizado hace 2 días por IA".
   - Botón: "Ver análisis completo".

3. **Tracker de Estado** (barra horizontal con pasos):
   - Pasos: Datos Enviados → Evaluación IA → SafetyScore Asignado → Publicado en Marketplace → Propuesta Recibida → Fondeado.
   - El paso actual resaltado con animación pulse.
   - Los pasos completados con check verde.

4. **Resumen Financiero Rápido** (3 mini-tarjetas en fila):
   - "Ventas Diarias Promedio: $4,200 MXN"
   - "Margen Operativo: 32%"
   - "Monto Solicitado: $150,000 MXN"

5. **Actividad Reciente** (timeline vertical):
   - "Hace 2h — La IA completó tu evaluación de riesgo."
   - "Hace 1d — Tu solicitud fue recibida."
   - "Hace 3d — Completaste tu registro."

---

### PANTALLA 4: WIZARD DE SOLICITUD PYME (Multi-step form)

**Propósito**: El comerciante publica su necesidad de inversión. Debe sentirse guiado y nunca perdido.

**Layout**: Centrado, max-width 700px, con stepper/progress bar arriba.

**Stepper Visual** (4 pasos): Tu Negocio → Tus Números → Tu Necesidad → Revisión

**Paso 1 — Tu Negocio**:
- Campo: Nombre del negocio.
- Dropdown: Sector (Abarrotes, Farmacia, Papelería, Taller Mecánico, Servicios, Otro).
- Campo: Ubicación (Ciudad, Estado).
- Campo: Años operando.
- Campo: Número de empleados.
- Botón: "Siguiente →"

**Paso 2 — Tus Números**:
- Campo: Ventas diarias promedio ($).
- Campo: Costos fijos mensuales ($).
- Campo: Costos variables mensuales ($).
- Toggle: "¿Tienes deudas activas?" → Si sí, campo para monto.
- Helper text sutil en cada campo: "Aproximado está bien, la IA lo validará".
- Botones: "← Anterior" | "Siguiente →"

**Paso 3 — Tu Necesidad**:
- Campo: Monto de inversión solicitado ($).
- Dropdown: Destino de los fondos (Inventario, Equipamiento, Expansión, Capital de Trabajo, Otro).
- Textarea: Descripción breve de para qué usarás el dinero.
- Dropdown: Plazo deseado de retorno (3, 6, 9, 12 meses).
- Botones: "← Anterior" | "Siguiente →"

**Paso 4 — Revisión**:
- Resumen de todo lo capturado en tarjetas organizadas por sección.
- Checkbox: "Confirmo que la información es verídica".
- Botón principal grande: "Enviar a Evaluación por IA ✨"
- Nota debajo: "Nuestro analista virtual revisará tu información en menos de 24 horas."

---

### PANTALLA 5: MARKETPLACE DEL INVERSIONISTA (Feed de Oportunidades)

**Propósito**: El corazón del producto. Donde los inversionistas exploran y filtran negocios.

**Layout**: Sidebar de filtros (izquierda) + Grid/Lista de oportunidades (centro) + Panel de resumen (derecha, opcional).

**Barra Superior**:
- Buscador: "Buscar por nombre, sector o ubicación..."
- Selector de vista: Grid (tarjetas) | Lista (tabla compacta).
- Ordenar por: SafetyScore | ROI Esperado | Monto | Recientes.

**Sidebar de Filtros**:
- **SafetyScore Mínimo**: Slider (0-100).
- **Sector**: Checkboxes (Abarrotes, Farmacia, Papelería, Taller, Servicios, Todos).
- **Rango de Inversión**: Slider doble ($10K - $500K MXN).
- **ROI Esperado Mínimo**: Slider (5% - 30%).
- **Ubicación**: Dropdown de estados (Puebla, CDMX, Jalisco, Todos).
- **Plazo**: Checkboxes (3, 6, 9, 12 meses).
- Botón: "Limpiar Filtros".

**Grid de Oportunidades** (tarjetas): Cada tarjeta contiene:
- **Header de tarjeta**: Nombre del negocio + Badge de sector (ej. "🛒 Abarrotes").
- **SafetyScore**: Número grande con indicador de color (ej. "82" en verde).
- **Métricas clave** (en línea):
  - ROI Esperado: 17.3%
  - Monto: $120,000
  - Plazo: 6 meses
- **Ubicación**: "Puebla, PUE" con icono de pin.
- **Tag de estado**: "Nuevo" (badge verde) / "Alta demanda" (badge ámbar) / "Último día" (badge rojo).
- **Barra de fondeo**: Progress bar mostrando cuánto del monto ya fue comprometido (ej. 45% fondeado).
- **CTA**: Botón "Ver Prospecto →".
- **Al hacer hover**: Sutil glow en el borde, scale 1.02.

**Mostrar 6-9 tarjetas** con datos simulados variados (diferentes sectores, scores, montos).

---

### PANTALLA 6: DETALLE DE OPORTUNIDAD / PROSPECTO DE INVERSIÓN

**Propósito**: La página más importante para el inversionista. Aquí toma la decisión. Debe transmitir confianza total, datos duros y el dictamen de la IA.

**Layout**: Contenido principal (70%) + Panel lateral sticky (30%).

**Contenido Principal**:

1. **Header del Negocio**:
   - Nombre del negocio grande + Sector badge + Ubicación.
   - Badge: "✅ Verificado por IA" (verde, prominente).
   - Fecha de publicación.

2. **SafetyScore Hero**:
   - Gauge circular grande con el puntaje (ej. 82/100).
   - Desglose en 4 sub-métricas (mini barras horizontales):
     - Flujo de Caja: 85/100
     - Viabilidad del Sector: 78/100
     - Consistencia Operativa: 80/100
     - Probabilidad de Retorno: 84/100

3. **Dictamen de la IA** (sección destacada con fondo diferenciado, borde azul):
   - Icono de IA/cerebro + Título: "Análisis del Analista Virtual SafetyScore".
   - Texto del dictamen (2-3 párrafos simulados): La IA explica por qué este negocio es viable, qué riesgos detecta, y cómo se compara con otros del sector. Ejemplo:
     > *"Abarrotes Doña María presenta un flujo de caja estable con ventas diarias consistentes de $4,200 MXN durante los últimos 6 meses. Su margen operativo del 32% está por encima del benchmark sectorial de 25% para abarrotes en la zona de Puebla. El destino solicitado (ampliación de inventario) tiene alta correlación con incremento de ventas en negocios similares. Riesgo principal: dependencia de un solo proveedor."*
   - Tags al final: "Riesgo: Bajo-Moderado", "Benchmark: Superior al sector".

4. **Benchmarking Sectorial** (gráfica de barras comparativa):
   - Gráfica mostrando este negocio vs. promedio del sector en 3-4 métricas (Margen, Ventas, Costos).
   - Título: "¿Cómo se compara con su sector?"

5. **Proof of Business — Flujo de Caja** (gráfica de línea temporal):
   - Gráfica de líneas mostrando ingresos vs egresos de los últimos 6 meses (datos simulados).
   - Título: "Flujo de Caja Verificado (Últimos 6 Meses)"

6. **Proyección de ROI** (gráfica de área):
   - Proyección a futuro del retorno esperado de la inversión mes a mes.
   - Línea punteada para el escenario optimista, sólida para el esperado.
   - Título: "Proyección de Retorno sobre tu Inversión"

**Panel Lateral Sticky (Derecha)**:
- **Tarjeta de Inversión** (CTA principal):
  - Monto solicitado: **$150,000 MXN**
  - Progreso de fondeo: Barra + "67% fondeado ($100,500 / $150,000)".
  - ROI Esperado: **17.3% anual**
  - Plazo: **6 meses**
  - Pago mensual estimado al inversionista.
  - Botón grande: **"Invertir en este Negocio"** (verde, prominente).
  - Texto chico: "Al invertir, revisarás los términos antes de confirmar."
- **Inversionistas activos**: "4 inversionistas ya participan".
- **Tiempo restante**: "Cierra en 12 días".

---

### PANTALLA 7: PORTAFOLIO DEL INVERSIONISTA (Dashboard)

**Propósito**: El inversionista ve el estado de todas sus inversiones activas.

**Layout**: Similar al dashboard PYME pero con mayor densidad de datos.

**Contenido**:

1. **Header**: "Tu Portafolio" + Resumen global.

2. **Métricas Globales** (4 tarjetas en fila):
   - "Capital Invertido: $485,000 MXN"
   - "Retorno Acumulado: $62,300 MXN"
   - "ROI Promedio: 16.8%"
   - "Inversiones Activas: 5"

3. **Gráfica de Rendimiento** (línea temporal):
   - Evolución del portafolio en el tiempo (últimos 6 meses).

4. **Lista de Inversiones Activas** (tabla o tarjetas):
   - Columnas: Negocio | Sector | Monto Invertido | ROI | Estado | SafetyScore | Próximo Pago.
   - Estado con badges de color: "Al corriente" (verde), "Pago pendiente" (ámbar), "Retrasado" (rojo).
   - Cada fila clickeable para ver detalle.

5. **Alertas y Notificaciones**:
   - "Nueva oportunidad en tu zona con ROI > 20%"
   - "Pago recibido de Abarrotes Doña María: $8,500 MXN"

---

## NOTAS FINALES PARA STITCH

- **Prototipa TODAS las pantallas** listadas arriba (7 pantallas).
- **Usa datos simulados realistas** (nombres de negocios mexicanos, montos en MXN, ciudades reales).
- **Dark mode es la base**. Todo el diseño es sobre fondos oscuros.
- **Las gráficas deben verse funcionales**, no placeholders vacíos. Usa datos simulados con líneas, barras y áreas.
- **Responsive**: Diseñar principalmente para desktop (1440px), pero que se vea que las tarjetas podrían adaptarse a móvil.
- **Consistencia**: Mismo sistema de diseño en TODAS las pantallas (mismos bordes, mismos radios, misma paleta, misma tipografía).
- **Animaciones sugeridas**: Indicar con notas visuales dónde habría hover effects, transiciones y counters animados.
- **El SafetyScore siempre debe ser el elemento más prominente** en cualquier pantalla donde aparezca. Es el corazón de la marca.
