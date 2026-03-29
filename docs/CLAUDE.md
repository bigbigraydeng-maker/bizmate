# BizMate - AI Coding Instructions

> This file provides context for AI coding assistants (Cursor, Claude Code, etc.)

## Project Overview

BizMate is an AI-powered business assistant for New Zealand SME owners, with a focus on the Chinese community. It combines a **paid business layer** (SaaS $49-149 NZD/mo) with a **free lifestyle layer** (user acquisition).

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript, React 19)
- **Styling**: TailwindCSS v4 + shadcn/ui
- **i18n**: next-intl (Chinese default, English secondary)
- **Database**: Supabase (PostgreSQL + pgvector for RAG)
- **Auth**: Supabase Auth (Email + Google)
- **AI**: OpenAI GPT-4o with Function Calling
- **Payment**: Stripe (NZD subscriptions)
- **Deployment**: Vercel (Sydney region)

## Architecture: Three-Layer Localization

### Layer 1: Hard-coded NZ Rules Engine (`src/lib/nz-rules/`)
- **CRITICAL**: Tax calculations, compliance dates, and wage rules MUST be deterministic code, NOT LLM-generated.
- GST rate: 15%, registration threshold: $60,000
- PAYE brackets: 10.5% / 17.5% / 30% / 33% / 39%
- ACC Earner Levy: 1.60%, max earnings: $142,283
- KiwiSaver: employee 3/4/6/8/10%, employer min 3%
- These values change annually (usually April 1). Keep them as named constants at the top of each file.

### Layer 2: RAG Knowledge Base (`src/lib/ai/`)
- Uses Supabase pgvector for vector similarity search
- Every knowledge document has: source_url, effective_date, last_verified_at
- AI responses MUST include source citations
- AI responses MUST include disclaimer: "This is information only, not professional advice"

### Layer 3: System Integrations (`src/lib/integrations/`)
- Xero/MYOB OAuth (Phase 2)
- Healthpoint GP data
- Skyscanner flight prices
- Companies Office API

## Code Conventions

### Language
- Code: English (variable names, comments, function names)
- UI text: Always use next-intl translation keys, NEVER hardcode Chinese or English strings in components
- Translation files: `messages/zh.json` and `messages/en.json`

### File Organization
- Feature-based organization under `src/app/[locale]/`
- Route groups: `(auth)`, `(dashboard)`, `(marketing)`
- Shared components in `src/components/`
- Business logic in `src/lib/`
- Max 400 lines per file, extract if larger

### Data Access
- Browser: `src/lib/supabase/client.ts`
- Server (SSR/API): `src/lib/supabase/server.ts`
- Always use RLS — never bypass with service role key in client-facing code
- Use Supabase generated types from `src/lib/supabase/types.ts`

### API Routes
- All under `src/app/api/`
- Chat endpoint uses SSE streaming
- Stripe webhooks verify signature
- Cron endpoints verify CRON_SECRET header

### Styling
- Use shadcn/ui components as base
- TailwindCSS for custom styling
- Mobile-first responsive design
- Primary color: blue (#4361ee)
- Support both light and dark mode

### Error Handling
- Validate all user input with Zod schemas
- Show user-friendly error messages (translated via next-intl)
- Log detailed errors server-side
- Never expose internal errors to users

### Security
- NEVER hardcode API keys or secrets
- All secrets in environment variables
- Supabase RLS on every table
- Rate limit AI chat endpoint (free: 10/month, pro: unlimited)
- Stripe webhook signature verification
- CSRF protection via Next.js defaults

## NZ-Specific Rules (DO NOT use LLM for these)

### GST
- Rate: 15%
- Registration mandatory if turnover > $60,000/year
- Filing frequencies: monthly, 2-monthly, 6-monthly
- Due date: 28th of month after period end (6-monthly: 28th of 2nd month after)

### PAYE (2024-2025 tax year)
| Income Range | Rate |
|-------------|------|
| $0 - $15,600 | 10.5% |
| $15,601 - $53,500 | 17.5% |
| $53,501 - $78,100 | 30% |
| $78,101 - $180,000 | 33% |
| $180,001+ | 39% |

### KiwiSaver
- Employee rates: 3%, 4%, 6%, 8%, 10%
- Employer minimum: 3%
- ESCT applies to employer contributions

### Minimum Wage (from 1 April 2024)
- Adult: $23.15/hour
- Starting-out: $18.52/hour
- Training: $18.52/hour

### Public Holidays (12 days)
New Year (2 days), Waitangi Day, Good Friday, Easter Monday, ANZAC Day,
King's Birthday, Matariki, Labour Day, Christmas Day, Boxing Day
+ Anniversary Day (varies by region)

## Important Notes

1. **Disclaimer is mandatory**: Every AI response must include a disclaimer that this is not professional advice
2. **Source citations**: RAG responses must cite the source URL
3. **Data sovereignty**: All data stored in AU/NZ region
4. **Privacy Act 2020**: Users can request data deletion
5. **Financial Advisers Act**: Do NOT provide financial advice, only information
6. **Bilingual**: Every user-facing string goes through next-intl, no exceptions

## Reference Documents

- `docs/01-PRD.md` — Product requirements
- `docs/02-TECH-ARCHITECTURE.md` — Full technical architecture, DB schema, API design
- `docs/03-PHASE1-TASKS.md` — Detailed Phase 1 task breakdown
