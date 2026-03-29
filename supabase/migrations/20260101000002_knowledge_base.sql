-- ===========================================
-- Knowledge Base for RAG
-- ===========================================

create table public.knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  source_url text,
  title text not null,
  content text not null,
  content_zh text,
  category text,
  applicable_entity_types text[],
  effective_date date,
  expiry_date date,
  last_verified_at timestamptz,
  embedding vector(1536),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_knowledge_embedding on public.knowledge_documents
  using hnsw (embedding vector_cosine_ops);

create index idx_knowledge_source on public.knowledge_documents(source);
create index idx_knowledge_category on public.knowledge_documents(category);

alter table public.knowledge_documents enable row level security;
create policy "Anyone can read knowledge"
  on public.knowledge_documents for select using (true);
