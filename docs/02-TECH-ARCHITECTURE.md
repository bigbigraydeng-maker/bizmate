# BizMate - Technical Architecture

## Tech Stack

| 层级 | 技术 | 理由 |
|------|------|------|
| **Frontend** | Next.js 15 (App Router) + TailwindCSS v4 + shadcn/ui | SSR/SEO、组件库成熟 |
| **i18n** | next-intl | Next.js最成熟的国际化方案 |
| **Backend API** | Next.js API Routes + Server Actions | 全栈统一，减少复杂度 |
| **AI/LLM** | OpenAI GPT-4o (openai SDK) | Chat + Embedding统一、Function Calling |
| **RAG** | Supabase pgvector + OpenAI text-embedding-3-small | 无需额外向量数据库 |
| **Database** | Supabase (PostgreSQL + pgvector) | Auth/RLS/Realtime/Vector一站式 |
| **Auth** | Supabase Auth | Email/Google/WeChat(future) |
| **File Storage** | Supabase Storage | 用户文档上传 |
| **Payment** | Stripe (NZD) | NZ市场、Subscription billing |
| **Email** | Resend | React Email模板 |
| **Job Queue** | Inngest | Serverless cron + background jobs |
| **Monitoring** | Sentry + PostHog | 错误追踪 + 用户分析 |
| **Deployment** | Vercel (Sydney Edge) | 低延迟、自动CI/CD |

---

## 项目文件结构

```
bizmate/
├── .cursor/                    # Cursor AI rules
│   └── rules/
├── CLAUDE.md                   # AI coding instructions
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
│
├── docs/                       # 项目文档（不部署）
│   ├── 01-PRD.md
│   ├── 02-TECH-ARCHITECTURE.md
│   ├── 03-PHASE1-TASKS.md
│   └── 04-API-DESIGN.md
│
├── messages/                   # i18n翻译文件
│   ├── en.json
│   └── zh.json
│
├── supabase/                   # Supabase本地开发
│   ├── config.toml
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_knowledge_base.sql
│   │   └── 003_jobs_and_gp.sql
│   └── seed.sql
│
├── public/
│   ├── logo.svg
│   └── og-image.png
│
└── src/
    ├── app/
    │   ├── [locale]/                    # i18n路由
    │   │   ├── layout.tsx               # Root layout with providers
    │   │   ├── page.tsx                 # Landing page
    │   │   │
    │   │   ├── (auth)/                  # Auth routes (no sidebar)
    │   │   │   ├── login/page.tsx
    │   │   │   ├── register/page.tsx
    │   │   │   └── layout.tsx
    │   │   │
    │   │   ├── (dashboard)/             # Dashboard routes (with sidebar)
    │   │   │   ├── layout.tsx           # Dashboard layout with sidebar
    │   │   │   ├── chat/page.tsx        # AI对话
    │   │   │   ├── calculators/page.tsx # 税务计算器
    │   │   │   ├── calendar/page.tsx    # 合规日历
    │   │   │   ├── gp/page.tsx          # 找GP
    │   │   │   ├── flights/page.tsx     # 机票监控
    │   │   │   ├── jobs/                # 招聘平台
    │   │   │   │   ├── page.tsx         # 职位列表
    │   │   │   │   ├── post/page.tsx    # 发布职位
    │   │   │   │   └── [id]/page.tsx    # 职位详情
    │   │   │   ├── documents/page.tsx   # 文档模板
    │   │   │   ├── settings/page.tsx    # 用户设置
    │   │   │   └── onboarding/page.tsx  # 企业信息引导
    │   │   │
    │   │   └── (marketing)/             # Marketing pages (no sidebar)
    │   │       ├── pricing/page.tsx
    │   │       └── about/page.tsx
    │   │
    │   └── api/                         # API Routes (不在[locale]下)
    │       ├── chat/route.ts            # AI对话 streaming endpoint
    │       ├── webhooks/
    │       │   └── stripe/route.ts      # Stripe webhook
    │       ├── cron/
    │       │   ├── compliance-reminders/route.ts
    │       │   └── flight-prices/route.ts
    │       └── inngest/route.ts         # Inngest handler
    │
    ├── components/
    │   ├── ui/                          # shadcn/ui (自动生成)
    │   ├── chat/
    │   │   ├── chat-interface.tsx        # 主对话界面
    │   │   ├── message-bubble.tsx        # 消息气泡
    │   │   ├── chat-input.tsx            # 输入框+发送
    │   │   └── source-citation.tsx       # RAG来源引用
    │   ├── calculators/
    │   │   ├── gst-calculator.tsx
    │   │   ├── paye-calculator.tsx
    │   │   └── kiwisaver-calculator.tsx
    │   ├── layout/
    │   │   ├── sidebar.tsx               # Dashboard侧边栏
    │   │   ├── header.tsx                # 顶部导航
    │   │   ├── locale-switcher.tsx        # 中英切换
    │   │   └── mobile-nav.tsx            # 移动端导航
    │   ├── marketing/
    │   │   ├── hero.tsx
    │   │   ├── features.tsx
    │   │   ├── pricing-cards.tsx
    │   │   └── footer.tsx
    │   └── shared/
    │       ├── disclaimer.tsx            # 免责声明
    │       └── loading-spinner.tsx
    │
    ├── lib/
    │   ├── nz-rules/                    # 第一层：硬逻辑规则引擎
    │   │   ├── gst.ts                   # GST计算 (15%, 阈值$60K)
    │   │   ├── paye.ts                  # PAYE阶梯税率
    │   │   ├── kiwisaver.ts             # KiwiSaver计算
    │   │   ├── acc.ts                   # ACC levy计算
    │   │   ├── holidays.ts              # Holiday Act (OWP/AWE/Mondayisation)
    │   │   ├── minimum-wage.ts          # 最低工资 ($23.15, 每年4月更新)
    │   │   ├── compliance-dates.ts      # 合规截止日生成器
    │   │   └── index.ts                 # 统一导出
    │   │
    │   ├── ai/                          # 第二层：AI + RAG
    │   │   ├── client.ts                # Claude API client
    │   │   ├── system-prompt.ts         # System prompt (中英双语)
    │   │   ├── tools.ts                 # Claude Tool Use definitions
    │   │   ├── rag.ts                   # RAG检索 (pgvector)
    │   │   └── embeddings.ts            # 文本向量化
    │   │
    │   ├── supabase/                    # 第三层：数据层
    │   │   ├── client.ts                # Browser client
    │   │   ├── server.ts                # Server client (SSR)
    │   │   ├── middleware.ts            # Auth middleware helper
    │   │   └── types.ts                 # Generated DB types
    │   │
    │   ├── stripe/
    │   │   ├── client.ts                # Stripe client
    │   │   ├── plans.ts                 # Plan definitions
    │   │   └── webhooks.ts              # Webhook handlers
    │   │
    │   ├── integrations/
    │   │   ├── healthpoint.ts           # GP数据
    │   │   ├── skyscanner.ts            # 机票价格
    │   │   └── grocer.ts                # 超市价格 (Phase 3)
    │   │
    │   └── utils.ts                     # 通用工具函数
    │
    ├── i18n/
    │   ├── routing.ts                   # Locale routing config
    │   ├── request.ts                   # Server request config
    │   └── navigation.ts               # Navigation helpers
    │
    ├── hooks/
    │   ├── use-chat.ts                  # AI对话hook
    │   └── use-user.ts                  # 用户状态hook
    │
    └── middleware.ts                    # Next.js middleware (i18n + auth)
```

---

## Database Schema

### Supabase Migration 001: Core Schema

```sql
-- ===========================================
-- BizMate Core Database Schema
-- Supabase (PostgreSQL + pgvector)
-- ===========================================

-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "vector";

-- ===========================================
-- 1. Users & Companies
-- ===========================================

-- User profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  preferred_language text not null default 'zh' check (preferred_language in ('zh', 'en')),
  avatar_url text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Companies
create table public.companies (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  nzbn text,                                    -- NZ Business Number
  company_number text,                          -- Companies Office number
  gst_number text,                              -- IRD GST number
  entity_type text not null default 'company'
    check (entity_type in ('company', 'sole_trader', 'partnership', 'trust', 'lp')),
  gst_filing_frequency text default 'monthly'
    check (gst_filing_frequency in ('monthly', '2monthly', '6monthly', 'not_registered')),
  balance_date date default '2026-03-31',       -- Financial year end
  industry text,
  employee_count int default 0,
  annual_revenue_band text,                     -- '<100k', '100k-500k', '500k-1m', '1m-5m', '5m+'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_companies_user_id on public.companies(user_id);

-- ===========================================
-- 2. Subscriptions & Billing
-- ===========================================

create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text not null default 'free'
    check (plan in ('free', 'pro', 'enterprise')),
  status text not null default 'active'
    check (status in ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index idx_subscriptions_user_id on public.subscriptions(user_id);

-- ===========================================
-- 3. AI Conversations
-- ===========================================

create table public.conversations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  title text not null default 'New conversation',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_conversations_user_id on public.conversations(user_id);

create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  sources jsonb,                                -- RAG source citations [{url, title, snippet}]
  tool_calls jsonb,                             -- Tool use results (calculator results etc)
  tokens_used int,
  created_at timestamptz not null default now()
);

create index idx_messages_conversation_id on public.messages(conversation_id);

-- ===========================================
-- 4. Compliance Calendar
-- ===========================================

create table public.compliance_deadlines (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references public.companies(id) on delete cascade,
  type text not null
    check (type in ('gst', 'paye', 'annual_return', 'provisional_tax', 'fbt', 'acc', 'custom')),
  title text not null,
  description text,
  due_date date not null,
  status text not null default 'upcoming'
    check (status in ('upcoming', 'overdue', 'completed', 'dismissed')),
  reminder_sent_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_compliance_company_id on public.compliance_deadlines(company_id);
create index idx_compliance_due_date on public.compliance_deadlines(due_date);

-- ===========================================
-- 5. Documents
-- ===========================================

create table public.documents (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references public.companies(id) on delete cascade,
  type text not null,                           -- 'employment_agreement', 'invoice', 'leave_policy'...
  title text not null,
  content text,                                 -- Generated document content (markdown/html)
  file_url text,                                -- Supabase Storage URL
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ===========================================
-- 6. RLS Policies
-- ===========================================

alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.subscriptions enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.compliance_deadlines enable row level security;
alter table public.documents enable row level security;

-- Profiles: users can only access their own
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Companies: users can only access their own
create policy "Users can CRUD own companies"
  on public.companies for all using (auth.uid() = user_id);

-- Subscriptions: users can only view their own
create policy "Users can view own subscription"
  on public.subscriptions for select using (auth.uid() = user_id);

-- Conversations: users can only access their own
create policy "Users can CRUD own conversations"
  on public.conversations for all using (auth.uid() = user_id);

-- Messages: users can access messages in their conversations
create policy "Users can CRUD messages in own conversations"
  on public.messages for all
  using (
    conversation_id in (
      select id from public.conversations where user_id = auth.uid()
    )
  );

-- Compliance: users can access their company deadlines
create policy "Users can CRUD own compliance deadlines"
  on public.compliance_deadlines for all
  using (
    company_id in (
      select id from public.companies where user_id = auth.uid()
    )
  );

-- Documents: users can access their company documents
create policy "Users can CRUD own documents"
  on public.documents for all
  using (
    company_id in (
      select id from public.companies where user_id = auth.uid()
    )
  );

-- ===========================================
-- 7. Functions & Triggers
-- ===========================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '')
  );

  insert into public.subscriptions (user_id, plan, status)
  values (new.id, 'free', 'active');

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

create trigger update_companies_updated_at
  before update on public.companies
  for each row execute function public.update_updated_at();
```

### Migration 002: Knowledge Base (RAG)

```sql
-- ===========================================
-- Knowledge Base for RAG
-- ===========================================

create table public.knowledge_documents (
  id uuid primary key default uuid_generate_v4(),
  source text not null,                          -- 'ird', 'employment_nz', 'companies_office', 'worksafe', 'custom'
  source_url text,
  title text not null,
  content text not null,
  content_zh text,                               -- Chinese translation
  category text,                                 -- 'gst', 'paye', 'employment', 'company_law'...
  applicable_entity_types text[],                -- ['company', 'sole_trader', ...]
  effective_date date,
  expiry_date date,
  last_verified_at timestamptz,
  embedding vector(1536),                        -- text-embedding-3-small dimension
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Vector similarity search index
create index idx_knowledge_embedding on public.knowledge_documents
  using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create index idx_knowledge_source on public.knowledge_documents(source);
create index idx_knowledge_category on public.knowledge_documents(category);

-- Knowledge base is public read, admin write
alter table public.knowledge_documents enable row level security;
create policy "Anyone can read knowledge"
  on public.knowledge_documents for select using (true);
```

### Migration 003: Jobs & GP

```sql
-- ===========================================
-- Job Listings (华人招聘平台)
-- ===========================================

create table public.job_listings (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references public.companies(id) on delete cascade,
  poster_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  title_zh text,                                 -- Chinese title
  description text not null,
  description_zh text,
  job_type text not null default 'full_time'
    check (job_type in ('full_time', 'part_time', 'casual', 'contract', 'internship')),
  location text not null,                        -- city/region
  salary_min numeric,
  salary_max numeric,
  salary_type text default 'annual'
    check (salary_type in ('hourly', 'annual')),
  languages_required text[],                     -- ['chinese', 'english']
  visa_sponsorship boolean default false,
  is_active boolean default true,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_jobs_poster_id on public.job_listings(poster_id);
create index idx_jobs_location on public.job_listings(location);
create index idx_jobs_active on public.job_listings(is_active) where is_active = true;

alter table public.job_listings enable row level security;

-- Anyone can view active jobs
create policy "Anyone can view active jobs"
  on public.job_listings for select using (is_active = true);
-- Poster can manage own jobs
create policy "Posters can manage own jobs"
  on public.job_listings for all using (auth.uid() = poster_id);

-- ===========================================
-- GP Directory (家庭医生)
-- ===========================================

create table public.gp_practices (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address text not null,
  suburb text,
  city text not null,
  region text not null,
  latitude numeric,
  longitude numeric,
  phone text,
  website text,
  healthpoint_url text,
  languages_spoken text[],                       -- ['english', 'mandarin', 'cantonese']
  accepting_new_patients boolean,
  fee_adult numeric,                             -- Standard adult consultation fee
  fee_child numeric,
  fee_csc numeric,                               -- Community Services Card fee
  enrolled_population int,
  last_scraped_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_gp_city on public.gp_practices(city);
create index idx_gp_languages on public.gp_practices using gin(languages_spoken);
create index idx_gp_accepting on public.gp_practices(accepting_new_patients)
  where accepting_new_patients = true;

alter table public.gp_practices enable row level security;
create policy "Anyone can view GP practices"
  on public.gp_practices for select using (true);

-- ===========================================
-- Flight Price Tracking (机票监控)
-- ===========================================

create table public.flight_alerts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  origin text not null default 'AKL',
  destination text not null,                     -- 'PVG', 'PEK', 'CAN', 'CTU'...
  target_price numeric,                          -- Alert when below this price
  is_active boolean default true,
  created_at timestamptz not null default now()
);

create table public.flight_prices (
  id uuid primary key default uuid_generate_v4(),
  origin text not null,
  destination text not null,
  departure_date date not null,
  airline text,
  price numeric not null,
  currency text not null default 'NZD',
  is_direct boolean default false,
  scraped_at timestamptz not null default now()
);

create index idx_flight_prices_route on public.flight_prices(origin, destination);
create index idx_flight_prices_date on public.flight_prices(departure_date);

alter table public.flight_alerts enable row level security;
create policy "Users can manage own alerts"
  on public.flight_alerts for all using (auth.uid() = user_id);

alter table public.flight_prices enable row level security;
create policy "Anyone can view flight prices"
  on public.flight_prices for select using (true);
```

---

## API Design

### Core Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/chat` | AI对话 (streaming SSE) | Required |
| GET | `/api/chat/history` | 获取对话历史 | Required |
| POST | `/api/chat/[id]/messages` | 发送新消息 | Required |
| POST | `/api/webhooks/stripe` | Stripe webhook | Stripe sig |
| GET | `/api/cron/compliance-reminders` | 合规提醒cron | Cron secret |
| GET | `/api/cron/flight-prices` | 机票价格更新cron | Cron secret |

### AI Chat Endpoint (`POST /api/chat`)

```typescript
// Request
{
  conversationId?: string,    // null = new conversation
  message: string,
  companyId?: string,         // context for company-specific questions
  language: 'zh' | 'en'
}

// Response: Server-Sent Events (SSE) stream
data: {"type": "text", "content": "根据NZ税法..."}
data: {"type": "text", "content": "GST税率为15%..."}
data: {"type": "tool_call", "name": "calculate_gst", "result": {...}}
data: {"type": "sources", "citations": [{url, title, snippet}]}
data: {"type": "done", "conversationId": "xxx", "messageId": "xxx"}
```

### Claude Tool Use Definitions

AI可以调用的NZ规则引擎工具：

```typescript
const tools = [
  {
    name: "calculate_gst",
    description: "Calculate NZ GST (15%). Use this when user asks about GST amounts.",
    input_schema: {
      type: "object",
      properties: {
        amount: { type: "number" },
        operation: { enum: ["add_gst", "remove_gst"] }
      }
    }
  },
  {
    name: "calculate_paye",
    description: "Calculate NZ PAYE income tax. Use for salary/wage tax questions.",
    input_schema: {
      type: "object",
      properties: {
        gross_salary: { type: "number", description: "Annual gross salary in NZD" },
        tax_code: { type: "string", default: "M" }
      }
    }
  },
  {
    name: "calculate_kiwisaver",
    description: "Calculate KiwiSaver contributions for employee and employer.",
    input_schema: {
      type: "object",
      properties: {
        gross_salary: { type: "number" },
        employee_rate: { enum: [3, 4, 6, 8, 10] },
        employer_rate: { type: "number", minimum: 3 }
      }
    }
  },
  {
    name: "get_compliance_dates",
    description: "Get upcoming compliance deadlines for a company.",
    input_schema: {
      type: "object",
      properties: {
        gst_frequency: { enum: ["monthly", "2monthly", "6monthly"] },
        balance_date: { type: "string", format: "date" }
      }
    }
  },
  {
    name: "search_knowledge_base",
    description: "Search NZ business regulations knowledge base. Use for any NZ law/regulation question.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string" },
        category: { enum: ["gst", "paye", "employment", "company_law", "health_safety", "general"] }
      }
    }
  }
]
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://waoufcrcmijcauyfmzin.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Wclo0MajHz2_GDymluzLxQ_Pq02a-wt
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhb3VmY3JjbWlqY2F1eWZtemluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDc3MTk0NSwiZXhwIjoyMDkwMzQ3OTQ1fQ.U4TJzyZoGM70OKaMdEnA_fsGZde2WzQmgNqv2pd4lhg

# AI
ANTHROPIC_API_KEY=
OPENAI_API_KEY=                    # For embeddings only

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Email
RESEND_API_KEY=

# Integrations
SKYSCANNER_API_KEY=                # Phase 2

# Cron
CRON_SECRET=                       # Vercel Cron authentication

# App
NEXT_PUBLIC_APP_URL=https://bizmate.nz

# GitHub: https://github.com/bigbigraydeng-maker/bizmate
```
