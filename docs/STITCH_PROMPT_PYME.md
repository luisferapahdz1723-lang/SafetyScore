# MEGA PROMPT — SafetyScore: Prototipo UI (FLUJO PYME EXCLUSIVO)

---

## CONTEXTO DE LA TAREA PARA STITCH
El ecosistema de SafetyScore tiene dos usuarios completamente distintos. Este prompt es **EXCLUSIVAMENTE para el usuario PYME** (el dueño de una farmacia, abarrotes, papelería). 

Debe haber una **DIFERENCIA VISUAL RADICAL** entre la interfaz de la PYME y la del Inversionista. 
- El inversionista usa una interfaz tipo Bloomberg (oscura, técnica, densa).
- **La PYME debe tener una experiencia tipo "Neo-banco" (Nubank, Capital One)**: Amigable, sumamente clara, con mucho espacio en blanco, nada intimidante, y orientada a guiarlo paso a paso.

---

## DIRECTRICES DE DISEÑO: IDENTIDAD PYME (EL COMERCIANTE)

### Identidad Visual (Amigable y Clara)
- **Tema**: **Light Mode Obligatorio**. Fondos blancos (`#FFFFFF`) y grises muy tenues (`#F8FAFC` o `#F3F4F6`) para transmitir limpieza, simplicidad y claridad.
- **Paleta de Colores**: 
  - Color principal: **Verde Vibrante / Esmeralda (#10B981)** para botones principales, checks de éxito y progreso (simboliza "dinero", "aprobación" y "crecimiento").
  - Acentos: **Azul claro (#3B82F6)** para elementos informativos, y tonos cálidos como **naranja/ámbar suave** para cosas pendientes.
- **Tipografía**: Fuente limpia y moderna como **Inter, Roboto o Poppins**. Tamaños grandes, pesos generosos en los títulos (Bold) para que todo sea súper legible desde un celular viejo o una pantalla brillante.
- **Espaciado (Whitespace)**: MUCHO espacio respirable. Un elemento por pantalla si es posible. No amontonar información.
- **Bordes y Superficies**: Tarjetas blancas sólidas con sombras (drop shadows) muy suaves y difuminadas. Bordes redondeados y amigables (border-radius: 16px - 24px).
- **Lenguaje/Copy**: Tono conversacional y empático. ("¡Hola Juan!", "Vamos a conocer tus números", "Tu negocio va muy bien").

---

## PANTALLAS A PROTOTIPAR PARA LA PYME

### PANTALLA 1: ONBOARDING / WIZARD (Paso a Paso)
**Propósito**: Que el comerciante ingrese sus datos sin sentirse en un examen del SAT.

**Layout**: Centrado, diseño minimalista, tipo "Typeform".
- **Header**: Logo de SafetyScore arriba al centro. Debajo, una barra de progreso gruesa y redondeada verde manzana.
- **Contenido Central**:
  - Saludo en texto muy grande: *"¡Cuéntanos sobre tu negocio!"*
  - **Pregunta activa (Focus)**: Una sola cosa a la vez. Ejemplo: **"¿Cuánto vendes aproximadamente al día?"**
  - **Input field**: Input enorme (height 60px+), texto grande centrable. Símbolo de "$" predefinido en grande.
  - **Helper Text**: Letra chiquita debajo del input: *"Un aproximado está bien. Nadie juzgará si hay días bajos."*
  - **Botón Primary**: "Continuar" gigante, verde, abarcando todo el ancho del input.
- **Experiencia**: Que se sienta como una charla de WhatsApp o un flujo de Nubank, no un formulario aburrido.

### PANTALLA 2: DASHBOARD PRINCIPAL PYME 
**Propósito**: El centro de control diario donde el dueño ve el estatus de su solicitud y su "salud".

**Layout**: Mobile-first o estructura de una sola columna central gruesa.

**Contenido**:
1. **Header**: 
   - *"Hola, Abarrotes Doña María 👋"* (Tipografía grande, negra).
   - "Fecha: 15 de Octubre".
   - Avatar o logo genérico del negocio con un círculo verde de "Activo".

2. **Hero Card: El Status de la Solicitud**:
   - Tarjeta blanca con sombra suave.
   - Ilustración amigable 3D o flat (ej. una gráfica subiendo).
   - Estatus grande: **"¡Tu negocio está en el Aparador!"**
   - Subtexto: "Los inversionistas ya pueden ver tus números y tu SafetyScore."

3. **El SafetyScore (Versión PYME)**:
   - Aquí NO queremos gráficos complicados.
   - Un círculo grande y amigable verde o medidor tipo velocímetro de auto.
   - Número central grande: **85 / 100**.
   - Mensaje debajo: *"¡Excelente salud operativa! Tienes un negocio sólido."*

4. **Botones de Acción Rápida (Grid de 2x2 cuadrados grandes)**:
   - [ 📄 Ver mi prospecto (Como me ven) ]
   - [ 📊 Actualizar mis ventas ]
   - [ 🏦 Mis cuentas conectadas ]
   - [ 💬 Soporte ]
   - (Cada uno con un ícono claro y grande).

### PANTALLA 3: PANTALLA DE ÉXITO ("¡TIENES UNA OFERTA!")
**Propósito**: El momento de celebración cuando una financiera ofrece el dinero.

**Layout**: Pantalla tipo "Confeti" / Celebración.

**Contenido**:
- **Visual Principal**: Animación o ilustración de celebración (estrellas, un apretón de manos colorido).
- **Título enorme y verde**: **"¡Felicidades! Financiera CREA confía en ti."**
- **Tarjeta de la Oferta**:
  - Te ofrecen: **$150,000 MXN**.
  - A pagar en: **6 meses**.
  - Letra clara y grande sin trucos financieros complejos.
- **Botón Primary (Verde brillante)**: *"Aceptar Inversión"*
- **Botón Secondary (Gris)**: *"Revisar detalles del acuerdo"*

---

## NOTAS FINALES PARA STITCH
- **Olvídate del Inversionista en este prompt**. Toda esta UI es exclusivamente para el señor/señora de la tienda o el dueño de la pequeña PYME.
- Debe respirar **simplicidad**. Piensa en Apple, Nubank, o Typeform. 
- **Luz y claridad**: Todo este diseño es sobre fondo blanco (Light Mode).
- Cero jerga financiera. Usa palabras que la gente normal entienda ("Ventas", en lugar de "Revenue"; "Gastos", en lugar de "OPEX").
