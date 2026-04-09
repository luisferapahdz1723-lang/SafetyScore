# MEGA PROMPT — SafetyScore: Vista "Soy Negocio — Busco Inversión"

---

## CONTEXTO DE LA TAREA PARA STITCH
Vas a diseñar la interfaz exclusiva para el **COMERCIANTE (La PYME)** dentro de la plataforma SafetyScore. Este usuario es el dueño de una farmacia, abarrotes, papelería, o pequeño negocio que busca inyección de capital basados en sus ventas diarias, no en su historial crediticio.

---

## DIRECTRICES VISUALES: NEO-BANCO / CONSUMER SUPER-APP

> **La meta es que el usuario se sienta relajado, no juzgado.**

- **Tema Obligatorio**: **Light Mode**. Fondos blancos (`#FFFFFF`) y grises muy claros (`#F8FAFC`). La blancura da paz y claridad.
- **Colores de Acento**: 
  - **Verde Vibrante (#10B981)** para el botón de "Avanzar", "Todo está bien", barras de progreso. Simboliza dinero y crecimiento.
  - **Neutros cálidos** para textos. Nada de colores corporativos fríos.
- **Tipografía**: Inter o Circular. Formato grande, pesos gruesos (Bold/Black) para títulos. Todo debe ser ultra legible.
- **Espaciado**: Extremo espacio en blanco (Whitespace). Un solo elemento importante por pantalla o scroll.
- **Formas**: Tarjetas suaves, sombras en capa `drop-shadow-sm` casi imperceptibles, bordes redondeados (`rounded-2xl` o `rounded-3xl`).
- **Lenguaje UI**: Cero jerga financiera. Cero "EBITDA" o "TIR". Usar "Tus números", "Tus ventas de hoy".

---

## PANTALLAS A PROTOTIPAR

### 1. Wizard de Solicitud (Onboarding)
**Estilo Typeform / Nubank**. Una pregunta por pantalla.
- **Header**: Barra de progreso gruesa que avanza conforme el usuario responde.
- **Contenido Central**:
  - Pregunta gigante: *"¿Cuánto vendes aproximadamente en un día bueno?"*
  - Input Field inmenso con un `$` fijo a la izquierda.
  - Texto de ayuda debajo (chico y gris): *"No te preocupes si no es exacto, nuestra IA te ayudará a cuadrarlo luego."*
- **Footer**: Botón principal gigante y verde: ["Continuar →"]

### 2. El Dashboard de la PYME (El Panel Principal)
**Mobile-first, simple, de tarjeta única.**
- **Header**: *"Hola, Pastelería La Ideal 🍰"*
- **Status Card (Hero)**: 
  - Tarjeta grande que diga el estatus actual: **"Evaluando tu Salud Financiera..."** con una animación de skeleton loading o un engrane amigable.
  - Si ya está evaluado: **"SafetyScore: 88/100"** (Gráfico verde de medidor circular, como el aro del Apple Watch). Letras grandes: *"¡Estás listo para recibir inversión!"*
- **Grid de Acciones Rápidas (2x2)**:
  - Botón cuadrado grande: "Editar mi necesidad" (icono de lápiz).
  - Botón cuadrado grande: "Vincular mi banco" (icono de banco/API).
  - Botón cuadrado grande: "Ver mis visitas" (cuántos inversionistas han visto su anuncio).

### 3. Pantalla de Éxito ("¡Hicimos Match!")
- **Estilo**: Modal o pantalla de Pantalla Completa llena de "confeti" o colores.
- **Mensaje Grande**: *"¡Tenemos buenas noticias! Microfinanciera XYZ quiere invertir en ti."*
- **Resumen**: "Monto ofrecido: $200,000 MXN a pagar en 12 meses."
- **CTAs**: 
  - Botón principal: *"Aceptar y firmar digitalmente"*
  - Botón secundario: *"Ver desglose de pagos"*
