# Contexto del Proyecto (GENERAL): SafetyScore

## Descripción General
SafetyScore es una plataforma Fintech de Crowdfunding y Direct Lending diseñada para democratizar el acceso al capital en México y Latinoamérica. A diferencia de los modelos tradicionales, SafetyScore permite que las MiPyMEs (desde abarrotes hasta servicios especializados) publiquen sus necesidades de inversión, permitiendo que Microfinancieras, SOFIPOS e inversionistas institucionales inyecten capital de forma directa y segmentada.

## Propósito Principal
Crear un aparador digital de oportunidades de inversión donde la viabilidad no se mide por el historial crediticio (Buró), sino por la Salud Operativa del negocio. La plataforma utiliza IA para estandarizar las solicitudes de los comerciantes, convirtiendo "necesidades de liquidez" en "activos de inversión" con proyecciones de ROI claras para el fondeador.

## Arquitectura Técnica
- **Frontend**: React/Next.js (Vercel). Interfaz dual: un Feed de oportunidades para inversionistas y un Dashboard de gestión para la PYME. Estética profesional tipo Bloomberg combinada con la claridad de Capital One.
- **Backend & Database**: Supabase. Gestión de perfiles de inversionista, estados de solicitudes en tiempo real y seguridad de datos financieros.
- **IA & Cómputo**: AWS Lambda + Amazon Bedrock (Claude 3.5 Sonnet). La IA actúa como un "Analista de Crédito Virtual" que audita la solicitud de la PYME antes de que sea pública.
- **Integración de Datos**: API de Nessie para simular el comportamiento de las cuentas donde se recibiría la inversión y Stripe/Open Banking (proyectado) para la dispersión de fondos.

## Flujo del Ecosistema (Marketplace)
1. **Publicación (La PYME)**: El dueño del negocio ingresa sus datos (ventas diarias, costos, para qué necesita el dinero). La IA de SafetyScore valida los Unit Economics y genera un "Prospecto de Inversión" automático.
2. **Evaluación (El Motor de Riesgo)**: El sistema asigna un SafetyScore basado en la probabilidad de retorno, no en deudas pasadas.
3. **Marketplace (El Inversionista)**: Los ejecutivos de microfinancieras navegan por un feed de negocios filtrados por riesgo, zona geográfica y sector.
   - *Ejemplo*: Una microfinanciera en Puebla busca invertir solo en "Abarrotes con ROI > 15%".
4. **Cierre de Inversión**: El fondeador selecciona el negocio, revisa el dictamen generado por la IA y procede a la oferta de financiamiento o inversión directa.

## Pilares de Validación (El "Trust Layer")
- **Benchmarking Sectorial**: ¿Es normal que una farmacia pequeña gane eso? La IA compara contra datos de mercado.
- **Proof of Business**: Validación de existencia física y flujo de caja real para evitar fraudes en el levantamiento de capital.
- **Transparencia de Retorno**: Cálculo exacto de cómo la inversión de la microfinanciera afectará los ingresos de la PYME (ROI Proyectado).

## Diferenciadores Clave
- **De Reactivo a Proactivo**: Las microfinancieras ya no esperan a que el cliente llegue; salen a "comprar" las mejores oportunidades en el marketplace.
- **Inclusión Real**: Un abarrotero informal puede recibir inversión si sus números presentes son sólidos, eliminando la barrera del historial crediticio.
- **ODS 9**: Industria, Innovación e Infraestructura (al crear infraestructura financiera digital para los no bancarizados).
