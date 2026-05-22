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

// Global SSE Session Store
const activeSessions = new Map();

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
// MCP JSON-RPC HANDLER
// ==========================================

async function handleJsonRpc(message) {
  const { jsonrpc, id, method, params } = message;

  if (jsonrpc !== '2.0') {
    return {
      jsonrpc: '2.0',
      id: id || null,
      error: {
        code: -32600,
        message: 'Invalid Request',
      },
    };
  }

  // Handle initialize request
  if (method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {},
        },
        serverInfo: {
          name: SERVER_NAME,
          version: '1.0.0',
        },
      },
    };
  }

  // Handle initialized notification
  if (method === 'notifications/initialized') {
    return null; // Notifications do not receive a response
  }

  // Handle tools/list request
  if (method === 'tools/list') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        tools: [
          {
            name: 'query',
            description: 'Search the knowledge base of ' + SERVER_NAME + ' for relevant information using semantic search.',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'The search query to match against the document chunks.',
                },
                topK: {
                  type: 'integer',
                  description: 'Number of results to return (default 8)',
                  default: 8,
                },
              },
              required: ['query'],
            },
          },
        ],
      },
    };
  }

  // Handle tools/call request
  if (method === 'tools/call') {
    const toolName = params?.name;
    const args = params?.arguments || {};

    if (toolName === 'query') {
      const query = args.query;
      const topK = args.topK || 8;

      if (!query) {
        return {
          jsonrpc: '2.0',
          id,
          error: {
            code: -32602,
            message: 'Invalid params: query is required',
          },
        };
      }

      try {
        // Embed query
        const embedding = await embedQuery(query);

        // Search vectors
        const chunks = await searchChunks(embedding, topK);

        // Format response content
        const results = (chunks || []).map((chunk, index) => ({
          rank: index + 1,
          text: chunk.text,
          heading: chunk.heading,
          source_url: chunk.source_url,
          similarity: chunk.similarity,
        }));

        let textContent = 'Search results for "' + query + '":\\n\\n';
        if (results.length === 0) {
          textContent += 'No relevant documents found.';
        } else {
          results.forEach(r => {
            textContent += '[Rank ' + r.rank + '] ' + (r.heading || 'Untitled') + '\\n';
            if (r.source_url) {
              textContent += 'Source: ' + r.source_url + '\\n';
            }
            textContent += 'Similarity: ' + r.similarity.toFixed(4) + '\\n';
            textContent += 'Content:\\n' + r.text + '\\n\\n';
          });
        }

        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: textContent,
              },
            ],
          },
        };
      } catch (error) {
        return {
          jsonrpc: '2.0',
          id,
          error: {
            code: -32603,
            message: 'Internal error: ' + error.message,
          },
        };
      }
    }

    return {
      jsonrpc: '2.0',
      id,
      error: {
        code: -32601,
        message: 'Method not found: ' + toolName,
      },
    };
  }

  // Fallback for ping or other methods
  if (method === 'ping') {
    return {
      jsonrpc: '2.0',
      id,
      result: {},
    };
  }

  return {
    jsonrpc: '2.0',
    id,
    error: {
      code: -32601,
      message: 'Method not found: ' + method,
    },
  };
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
    // GET /sse - ESTABLISH SSE CONNECTION
    // ======================================

    if (url.pathname === '/sse' && request.method === 'GET') {
      // Clean up old sessions (> 1 hour)
      const now = Date.now();
      for (const [id, sess] of activeSessions.entries()) {
        if (now - sess.timestamp > 3600000) {
          try { sess.writer.close(); } catch (e) {}
          activeSessions.delete(id);
        }
      }

      const sessionId = crypto.randomUUID();
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();
      const encoder = new TextEncoder();

      // Absolute message path is safer
      const messageUrl = new URL('/message?sessionId=' + sessionId, request.url).toString();
      const initPayload = 'event: endpoint\\ndata: ' + messageUrl + '\\n\\n';

      activeSessions.set(sessionId, {
        writer,
        encoder,
        timestamp: now,
      });

      // Write initial endpoint event
      await writer.write(encoder.encode(initPayload));

      // Keepalive ping interval (every 30s)
      const pingInterval = setInterval(() => {
        try {
          writer.write(encoder.encode(':\\n\\n'));
        } catch (e) {
          clearInterval(pingInterval);
          activeSessions.delete(sessionId);
        }
      }, 30000);

      request.signal.addEventListener('abort', () => {
        clearInterval(pingInterval);
        activeSessions.delete(sessionId);
      });

      return new Response(readable, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          ...corsHeaders,
        },
      });
    }

    // ======================================
    // POST /message - INCOMING MESSAGES FOR SSE
    // ======================================

    if (url.pathname === '/message' && request.method === 'POST') {
      const sessionId = url.searchParams.get('sessionId');
      if (!sessionId) {
        return new Response(
          JSON.stringify({ error: 'Session ID is required' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      const session = activeSessions.get(sessionId);
      if (!session) {
        return new Response(
          JSON.stringify({ error: 'Session not found or expired' }),
          { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      try {
        const message = await request.json();
        const response = await handleJsonRpc(message);
        
        if (response) {
          const ssePayload = 'event: message\\ndata: ' + JSON.stringify(response) + '\\n\\n';
          await session.writer.write(session.encoder.encode(ssePayload));
        }

        return new Response('Accepted', {
          status: 202,
          headers: corsHeaders,
        });
      } catch (error) {
        return new Response(
          JSON.stringify({ error: 'Invalid JSON request: ' + error.message }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    }

    // ======================================
    // POST /sse or /mcp - STATELESS JSON-RPC
    // ======================================

    if (request.method === 'POST' && (url.pathname === '/sse' || url.pathname === '/mcp' || url.pathname === '/')) {
      try {
        const message = await request.json();
        const response = await handleJsonRpc(message);
        
        return new Response(
          JSON.stringify(response),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({
            jsonrpc: '2.0',
            id: null,
            error: {
              code: -32700,
              message: 'Parse error: ' + error.message,
            },
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }
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
    // QUERY ENDPOINT (REST BACKWARDS COMPATIBILITY)
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
        available_endpoints: ['/health', '/query', '/sse', '/message'],
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
