-- ==========================================
-- MIGRATION: Update existing mcp_servers table
-- and create new mcp_documents + mcp_chunks tables
-- Run this in your Supabase SQL Editor
-- ==========================================

-- Enable pgvector
create extension if not exists vector with schema extensions;

-- ==========================================
-- FIX EXISTING mcp_servers TABLE
-- ==========================================

-- Add missing columns (safe: does nothing if they already exist)
DO $$
BEGIN
  -- deployment_status (replaces old 'status' column)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'mcp_servers'
    AND column_name = 'deployment_status'
  ) THEN
    ALTER TABLE public.mcp_servers
      ADD COLUMN deployment_status text NOT NULL DEFAULT 'pending';
  END IF;

  -- ingest_status
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'mcp_servers'
    AND column_name = 'ingest_status'
  ) THEN
    ALTER TABLE public.mcp_servers
      ADD COLUMN ingest_status text NOT NULL DEFAULT 'pending';
  END IF;

  -- total_documents
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'mcp_servers'
    AND column_name = 'total_documents'
  ) THEN
    ALTER TABLE public.mcp_servers
      ADD COLUMN total_documents integer DEFAULT 0;
  END IF;

  -- total_chunks
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'mcp_servers'
    AND column_name = 'total_chunks'
  ) THEN
    ALTER TABLE public.mcp_servers
      ADD COLUMN total_chunks integer DEFAULT 0;
  END IF;

  -- total_embeddings
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'mcp_servers'
    AND column_name = 'total_embeddings'
  ) THEN
    ALTER TABLE public.mcp_servers
      ADD COLUMN total_embeddings integer DEFAULT 0;
  END IF;

  -- error_message
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'mcp_servers'
    AND column_name = 'error_message'
  ) THEN
    ALTER TABLE public.mcp_servers
      ADD COLUMN error_message text;
  END IF;

  -- endpoint (may already exist)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'mcp_servers'
    AND column_name = 'endpoint'
  ) THEN
    ALTER TABLE public.mcp_servers
      ADD COLUMN endpoint text;
  END IF;

  -- source_url (may already exist)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'mcp_servers'
    AND column_name = 'source_url'
  ) THEN
    ALTER TABLE public.mcp_servers
      ADD COLUMN source_url text NOT NULL DEFAULT '';
  END IF;

  -- source_type (may already exist)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'mcp_servers'
    AND column_name = 'source_type'
  ) THEN
    ALTER TABLE public.mcp_servers
      ADD COLUMN source_type text NOT NULL DEFAULT 'Website';
  END IF;

  -- updated_at
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'mcp_servers'
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.mcp_servers
      ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- ==========================================
-- CREATE mcp_documents TABLE
-- ==========================================

create table if not exists public.mcp_documents (
  id uuid default gen_random_uuid() primary key,
  server_id uuid references public.mcp_servers(id) on delete cascade not null,
  title text not null,
  url text not null,
  content text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- ==========================================
-- CREATE mcp_chunks TABLE
-- ==========================================

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

-- ==========================================
-- INDEXES
-- ==========================================

create index if not exists mcp_chunks_embedding_idx
  on public.mcp_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create index if not exists mcp_chunks_server_id_idx
  on public.mcp_chunks(server_id);

create index if not exists mcp_documents_server_id_idx
  on public.mcp_documents(server_id);

create index if not exists mcp_servers_user_id_idx
  on public.mcp_servers(user_id);

-- ==========================================
-- UPDATED_AT TRIGGER
-- ==========================================

create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Drop trigger if it exists then recreate
DROP TRIGGER IF EXISTS update_mcp_servers_updated_at ON public.mcp_servers;

create trigger update_mcp_servers_updated_at
  before update on public.mcp_servers
  for each row execute function public.update_updated_at_column();

-- ==========================================
-- VECTOR SEARCH RPC
-- ==========================================

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

-- ==========================================
-- RLS
-- ==========================================

alter table public.mcp_servers enable row level security;
alter table public.mcp_documents enable row level security;
alter table public.mcp_chunks enable row level security;

-- Drop existing policies first (safe if they don't exist)
DROP POLICY IF EXISTS "Users can view own servers" ON public.mcp_servers;
DROP POLICY IF EXISTS "Users can insert own servers" ON public.mcp_servers;
DROP POLICY IF EXISTS "Users can update own servers" ON public.mcp_servers;
DROP POLICY IF EXISTS "Users can delete own servers" ON public.mcp_servers;
DROP POLICY IF EXISTS "Service role full access to servers" ON public.mcp_servers;
DROP POLICY IF EXISTS "Users can view own documents" ON public.mcp_documents;
DROP POLICY IF EXISTS "Service role full access to documents" ON public.mcp_documents;
DROP POLICY IF EXISTS "Users can view own chunks" ON public.mcp_chunks;
DROP POLICY IF EXISTS "Service role full access to chunks" ON public.mcp_chunks;

-- mcp_servers policies
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

create policy "Service role full access to servers"
  on public.mcp_servers for all
  using (auth.role() = 'service_role');

-- mcp_documents policies
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

-- mcp_chunks policies
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
