// lib/deployment/worker-template.ts

// ==========================================
// GENERATE WORKER SCRIPT
// ==========================================

export interface WorkerConfig {
  serverId: string;
  serverName: string;
  supabaseUrl: string;
  supabaseKey: string;
  openaiKey: string;
}

export function generateWorkerScript(
  config: WorkerConfig
): string {
  return `
// ==========================================
// MCP BUILDER - GENERATED WORKER
// Server: ${config.serverName}
// Server ID: ${config.serverId}
// ==========================================

const SUPABASE_URL = '${config.supabaseUrl}';
const SUPABASE_KEY = '${config.supabaseKey}';
const OPENAI_API_KEY = '${config.openaiKey}';
const SERVER_ID = '${config.serverId}';
const SERVER_NAME = '${config.serverName}';

// ==========================================
// CORS HEADERS
// ==========================================

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// ==========================================
// EMBED QUERY VIA OPENAI
// ==========================================

async function embedQuery(query) {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + OPENAI_API_KEY,
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: query,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error('OpenAI embedding failed: ' + response.status + ' ' + errorText);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

// ==========================================
// SEARCH PGVECTOR VIA SUPABASE
// ==========================================

async function searchChunks(embedding, matchCount = 10) {
  const response = await fetch(
    SUPABASE_URL + '/rest/v1/rpc/match_mcp_chunks',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
      },
      body: JSON.stringify({
        query_embedding: embedding,
        target_server_id: SERVER_ID,
        match_count: matchCount,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error('Supabase search failed: ' + response.status + ' ' + errorText);
  }

  return response.json();
}

// ==========================================
// HANDLE REQUEST
// ==========================================

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // ======================================
    // HEALTH CHECK
    // ======================================

    if (url.pathname === '/health' || url.pathname === '/') {
      return new Response(
        JSON.stringify({
          status: 'operational',
          server_name: SERVER_NAME,
          server_id: SERVER_ID,
          version: '1.0.0',
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // ======================================
    // QUERY ENDPOINT
    // ======================================

    if (url.pathname === '/query' && request.method === 'POST') {
      try {
        const body = await request.json();
        const query = body.query;
        const topK = body.topK || 8;

        if (!query) {
          return new Response(
            JSON.stringify({ error: 'Query is required' }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            }
          );
        }

        // Embed query
        const embedding = await embedQuery(query);

        // Search vectors
        const chunks = await searchChunks(embedding, topK);

        // Format response
        const results = (chunks || []).map((chunk, index) => ({
          rank: index + 1,
          text: chunk.text,
          heading: chunk.heading,
          source_url: chunk.source_url,
          similarity: chunk.similarity,
          metadata: chunk.metadata,
        }));

        return new Response(
          JSON.stringify({
            success: true,
            query,
            server_id: SERVER_ID,
            results,
            total: results.length,
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({
            error: error.message || 'Query failed',
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
      }
    }

    // ======================================
    // 404
    // ======================================

    return new Response(
      JSON.stringify({
        error: 'Not found',
        available_endpoints: ['/health', '/query'],
      }),
      {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  },
};
`;
}
