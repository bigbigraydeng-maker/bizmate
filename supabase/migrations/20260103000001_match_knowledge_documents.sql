-- RPC for pgvector similarity search (RAG)

create or replace function public.match_knowledge_documents(
  query_embedding vector(1536),
  match_count int default 5,
  filter_category text default null
)
returns table (
  id uuid,
  source text,
  source_url text,
  title text,
  content text,
  content_zh text,
  category text,
  similarity double precision
)
language sql
stable
as $$
  select
    kd.id,
    kd.source,
    kd.source_url,
    kd.title,
    kd.content,
    kd.content_zh,
    kd.category,
    (1 - (kd.embedding <=> query_embedding))::double precision as similarity
  from public.knowledge_documents kd
  where kd.embedding is not null
    and (filter_category is null or kd.category = filter_category)
  order by kd.embedding <=> query_embedding
  limit greatest(1, least(coalesce(match_count, 5), 50));
$$;

grant execute on function public.match_knowledge_documents(vector, int, text) to anon, authenticated;
