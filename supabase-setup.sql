-- Enable pgvector
create extension if not exists vector with schema extensions;

-- mcp_servers table
create table if not exists public.mcp_servers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  source_url text not null,
  source_type text not null default 'Website',
  deployment_status text not null default 'pending',
  ingest_status text not null default 'pending',
  endpoint text,
  total_documents integer default 0,
  total_chunks integer default 0,
  total_embeddings integer default 0,
  error_message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- mcp_documents table
create table if not exists public.mcp_documents (
  id uuid default gen_random_uuid() primary key,
  server_id uuid references public.mcp_servers(id) on delete cascade not null,
  title text not null,
  url text not null,
  content text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- mcp_chunks table
create table if not exists public.mcp_chunks (
  id uuid default gen_random_uuid() primary key,
  server_id uuid references public.mcp_servers(id) on delete cascade not null,
  document_id uuid references public.mcp_documents(id) on delete cascade,
  chunk_index integer not null,
  text text not null,
  heading text,
  source_url text,
  embedding vector(1536),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Vector similarity index
create index if not exists mcp_chunks_embedding_idx
  on public.mcp_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Index for filtering by server_id
create index if not exists mcp_chunks_server_id_idx
  on public.mcp_chunks(server_id);

create index if not exists mcp_documents_server_id_idx
  on public.mcp_documents(server_id);

create index if not exists mcp_servers_user_id_idx
  on public.mcp_servers(user_id);

-- Updated_at trigger
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_mcp_servers_updated_at
  before update on public.mcp_servers
  for each row execute function public.update_updated_at_column();

-- Vector similarity search RPC
create or replace function public.match_mcp_chunks(
  query_embedding vector(1536),
  target_server_id uuid,
  match_count int default 10
)
returns table (
  id uuid,
  server_id uuid,
  document_id uuid,
  chunk_index int,
  text text,
  heading text,
  source_url text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    mc.id,
    mc.server_id,
    mc.document_id,
    mc.chunk_index,
    mc.text,
    mc.heading,
    mc.source_url,
    mc.metadata,
    1 - (mc.embedding <=> query_embedding) as similarity
  from public.mcp_chunks mc
  where mc.server_id = target_server_id
    and mc.embedding is not null
  order by mc.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- RLS policies
alter table public.mcp_servers enable row level security;
alter table public.mcp_documents enable row level security;
alter table public.mcp_chunks enable row level security;

-- mcp_servers: users can only see their own
create policy "Users can view own servers"
  on public.mcp_servers for select
  using (auth.uid() = user_id);

create policy "Users can insert own servers"
  on public.mcp_servers for insert
  with check (auth.uid() = user_id);

create policy "Users can update own servers"
  on public.mcp_servers for update
  using (auth.uid() = user_id);

create policy "Users can delete own servers"
  on public.mcp_servers for delete
  using (auth.uid() = user_id);

-- Service role bypass (for API routes using service role key)
create policy "Service role full access to servers"
  on public.mcp_servers for all
  using (auth.role() = 'service_role');

-- mcp_documents: accessible if user owns the parent server
create policy "Users can view own documents"
  on public.mcp_documents for select
  using (
    exists (
      select 1 from public.mcp_servers
      where id = mcp_documents.server_id
      and user_id = auth.uid()
    )
  );

create policy "Service role full access to documents"
  on public.mcp_documents for all
  using (auth.role() = 'service_role');

-- mcp_chunks: accessible if user owns the parent server
create policy "Users can view own chunks"
  on public.mcp_chunks for select
  using (
    exists (
      select 1 from public.mcp_servers
      where id = mcp_chunks.server_id
      and user_id = auth.uid()
    )
  );

create policy "Service role full access to chunks"
  on public.mcp_chunks for all
  using (auth.role() = 'service_role');
