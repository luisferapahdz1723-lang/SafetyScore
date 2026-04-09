# SafetyScore — Documentación de Casos de Uso (Mermaid)

Diagramas de casos de uso generados con [Mermaid](https://mermaid.js.org/) para la plataforma **SafetyScore**: Marketplace Fintech de Crowdfunding y Direct Lending para MiPyMEs en México.

## Índice de Documentos

| Archivo | Descripción | Diagramas |
|--------|-------------|-----------|
| [01_general_overview.md](01_general_overview.md) | Vista general del ecosistema y actores | `graph TB`, `graph LR` |
| [02_pyme_flows.md](02_pyme_flows.md) | Flujos del Dueño de PYME (onboarding, dashboard, firma) | `sequenceDiagram`, `stateDiagram`, `flowchart` |
| [03_investor_flows.md](03_investor_flows.md) | Flujos del Inversionista / Microfinanciera | `flowchart`, `graph`, `sequenceDiagram`, `stateDiagram` |
| [04_ai_engine_flows.md](04_ai_engine_flows.md) | Motor de IA, SafetyScore y anti-fraude | `flowchart`, `sequenceDiagram`, `graph` |
| [05_authentication_and_data.md](05_authentication_and_data.md) | Autenticación Supabase, ERD de datos, Nessie API, Notificaciones | `sequenceDiagram`, `erDiagram`, `flowchart` |
| [06_end_to_end_journey.md](06_end_to_end_journey.md) | Viaje completo E2E del ecosistema | `journey`, `flowchart`, `mindmap`, `stateDiagram` |

---

## Actores del Sistema

```
👤 Dueño de PYME         — Comerciante que busca capital de inversión
🏦 Inversionista          — Microfinanciera, SOFIPO o inversionista institucional
🤖 IA SafetyScore         — Motor de análisis (Claude 3.5 Sonnet vía Amazon Bedrock)
⚙️ Administrador          — Gestión interna de la plataforma
```

## Stack Técnico Representado

```
Frontend     → React / Next.js (Vercel)
Backend/DB   → Supabase (Auth + Realtime + PostgreSQL)
IA           → AWS Lambda + Amazon Bedrock (Claude 3.5 Sonnet)
Datos        → Nessie API (simulación bancaria)
Pagos        → Stripe / Open Banking (proyectado)
```

## Cómo Visualizar

Los diagramas Mermaid se renderizan automáticamente en:
- **GitHub** (al ver el `.md` en el repo)
- **VS Code** con la extensión [Mermaid Preview](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid)
- **Notion** (bloque de código `mermaid`)
- **mermaid.live** (editor online)
