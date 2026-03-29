# Cursor Rules for BizMate

> 将以下内容复制到 `.cursor/rules` 或 `.cursorrules` 文件中

---

## .cursorrules

```
You are building BizMate, an AI business assistant for NZ SME owners (especially Chinese community).

## CRITICAL RULES

1. NEVER hardcode UI text. Always use next-intl: `const t = useTranslations('namespace')`
2. NEVER use LLM to calculate taxes. GST/PAYE/KiwiSaver use hard-coded rules in `src/lib/nz-rules/`
3. EVERY AI response must include a disclaimer and source citations
4. ALWAYS use Supabase RLS. Never use service_role key in client code
5. Mobile-first responsive design. Test at 375px width

## Tech Stack
- Next.js 15 App Router + TypeScript + TailwindCSS v4 + shadcn/ui
- Supabase (PostgreSQL + pgvector) for DB/Auth/Storage
- Anthropic Claude API for AI chat
- Stripe for NZD payments
- next-intl for i18n (zh default, en secondary)
- Vercel for deployment (Sydney region)

## File Structure
- Route groups: (auth), (dashboard), (marketing) under src/app/[locale]/
- Components: src/components/{feature}/
- Business logic: src/lib/{domain}/
- i18n messages: messages/{zh,en}.json
- DB migrations: supabase/migrations/

## Coding Style
- TypeScript strict mode
- Prefer Server Components, use "use client" only when needed
- Use Server Actions for mutations
- Immutable data patterns (never mutate)
- Small files (<400 lines), extract when larger
- Use Zod for input validation

## NZ Tax Constants (hard-coded, NOT LLM)
- GST: 15%
- PAYE brackets: 10.5% / 17.5% / 30% / 33% / 39%
- KiwiSaver employer min: 3%
- ACC Earner Levy: 1.60%
- Minimum wage: $23.15/hr

## When working on this project:
- Read docs/01-PRD.md for product context
- Read docs/02-TECH-ARCHITECTURE.md for DB schema and API design
- Read docs/03-PHASE1-TASKS.md for current tasks
- Read docs/CLAUDE.md for detailed coding instructions
```
