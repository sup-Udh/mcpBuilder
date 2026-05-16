// templates/base-server/src/index.ts

import 'dotenv/config';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { z } from 'zod';

// ==========================================
// ENV
// ==========================================

const SERVER_ID =
  process.env.SERVER_ID;

const SERVER_NAME =
  process.env.SERVER_NAME ||
  'MCP Builder Server';

const TOOL_DESCRIPTION =
  process.env.TOOL_DESCRIPTION ||
  'Search the knowledge base';

const RAG_API_URL =
  process.env.RAG_API_URL;

// ==========================================
// VALIDATION
// ==========================================

if (!SERVER_ID) {
  throw new Error(
    'Missing SERVER_ID environment variable'
  );
}

if (!RAG_API_URL) {
  throw new Error(
    'Missing RAG_API_URL environment variable'
  );
}

// ==========================================
// MCP SERVER
// ==========================================

const server = new McpServer({
  name: SERVER_NAME,

  version: '1.0.0',
});

// ==========================================
// SEARCH TOOL
// ==========================================

server.tool(
  'search',

  TOOL_DESCRIPTION,

  {
    query: z.string(),
  },

  async ({ query }) => {
    try {
      // ======================================
      // CALL RETRIEVAL API
      // ======================================

      const response = await fetch(
        `${RAG_API_URL}/api/retrieve`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            serverId: SERVER_ID,

            query,
          }),
        }
      );

      if (!response.ok) {
        return {
          content: [
            {
              type: 'text',

              text: `Retrieval API failed with status ${response.status}`,
            },
          ],

          isError: true,
        };
      }

      const data =
        await response.json();

      const chunks =
        data.chunks || [];

      // ======================================
      // NO RESULTS
      // ======================================

      if (chunks.length === 0) {
        return {
          content: [
            {
              type: 'text',

              text: 'No relevant information found.',
            },
          ],
        };
      }

      // ======================================
      // FORMAT CHUNKS
      // ======================================

      const formatted =
        chunks
          .map(
            (
              chunk: any,
              index: number
            ) => {
              return `
[CHUNK ${index + 1}]

Title:
${chunk.source_title}

Heading:
${chunk.heading}

Content:
${chunk.content}
`;
            }
          )
          .join('\n\n');

      // ======================================
      // RETURN TO CLIENT
      // ======================================

      return {
        content: [
          {
            type: 'text',

            text: formatted,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',

            text: `Search failed: ${error.message}`,
          },
        ],

        isError: true,
      };
    }
  }
);

// ==========================================
// START SERVER
// ==========================================

async function main() {
  const transport =
    new StdioServerTransport();

  await server.connect(
    transport
  );
}

main().catch(() => {
  process.exit(1);
});