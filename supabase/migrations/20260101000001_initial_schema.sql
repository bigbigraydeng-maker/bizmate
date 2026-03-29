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
  nzbn text,
  company_number text,
  gst_number text,
  entity_type text not null default 'company'
    check (entity_type in ('company', 'sole_trader', 'partnership', 'trust', 'lp')),
  gst_filing_frequency text default 'monthly'
    check (gst_filing_frequency in ('monthly', '2monthly', '6monthly', 'not_registered')),
  balance_date date default '2026-03-31',
  industry text,
  employee_count int default 0,
  annual_revenue_band text,
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
  sources jsonb,
  tool_calls jsonb,
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
  type text not null,
  title text not null,
  content text,
  file_url text,
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

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can CRUD own companies"
  on public.companies for all using (auth.uid() = user_id);

create policy "Users can view own subscription"
  on public.subscriptions for select using (auth.uid() = user_id);

create policy "Users can CRUD own conversations"
  on public.conversations for all using (auth.uid() = user_id);

create policy "Users can CRUD messages in own conversations"
  on public.messages for all
  using (
    conversation_id in (
      select id from public.conversations where user_id = auth.uid()
    )
  );

create policy "Users can CRUD own compliance deadlines"
  on public.compliance_deadlines for all
  using (
    company_id in (
      select id from public.companies where user_id = auth.uid()
    )
  );

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
