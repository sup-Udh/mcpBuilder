// lib/mcp/generate-server.ts

import fs from 'fs/promises';

import path from 'path';

// ==========================================
// TYPES
// ==========================================

export interface GenerateServerOptions {
  serverId: string;

  serverName: string;

  toolDescription: string;
}

// ==========================================
// PATHS
// ==========================================

const TEMPLATE_DIR = path.join(
  process.cwd(),
  'templates',
  'base-server'
);

const GENERATED_DIR = path.join(
  process.cwd(),
  'generated',
  'servers'
);

// ==========================================
// COPY DIRECTORY RECURSIVELY
// ==========================================

async function copyDirectory(
  source: string,
  destination: string
) {
  await fs.mkdir(destination, {
    recursive: true,
  });

  const entries =
    await fs.readdir(source, {
      withFileTypes: true,
    });

  for (const entry of entries) {
    const sourcePath = path.join(
      source,
      entry.name
    );

    const destinationPath =
      path.join(
        destination,
        entry.name
      );

    if (entry.isDirectory()) {
      await copyDirectory(
        sourcePath,
        destinationPath
      );
    } else {
      await fs.copyFile(
        sourcePath,
        destinationPath
      );
    }
  }
}

// ==========================================
// CREATE ENV FILE
// ==========================================

async function createEnvFile(
  serverPath: string,

  options: GenerateServerOptions
) {
  const envContent = `
# ==========================================
# MCP SERVER CONFIG
# ==========================================

SERVER_ID=${options.serverId}

SERVER_NAME=${options.serverName}

TOOL_DESCRIPTION=${options.toolDescription}

# ==========================================
# RAG API
# ==========================================

RAG_API_URL=http://localhost:3000
`;

  await fs.writeFile(
    path.join(serverPath, '.env'),

    envContent.trim(),

    'utf-8'
  );
}

// ==========================================
// GENERATE MCP SERVER
// ==========================================

export async function generateServer(
  options: GenerateServerOptions
) {
  console.log(
    '\n===================================='
  );

  console.log(
    'GENERATING MCP SERVER'
  );

  console.log(
    '===================================='
  );

  console.log(
    `Server ID: ${options.serverId}`
  );

  console.log(
    `Server Name: ${options.serverName}`
  );

  // ======================================
  // CREATE GENERATED ROOT
  // ======================================

  await fs.mkdir(
    GENERATED_DIR,
    {
      recursive: true,
    }
  );

  // ======================================
  // SERVER PATH
  // ======================================

  const serverPath =
    path.join(
      GENERATED_DIR,
      options.serverId
    );

  console.log(
    `Output Path: ${serverPath}`
  );

  // ======================================
  // COPY TEMPLATE
  // ======================================

  console.log(
    'Copying template files...'
  );

  await copyDirectory(
    TEMPLATE_DIR,
    serverPath
  );

  // ======================================
  // CREATE ENV FILE
  // ======================================

  console.log(
    'Generating .env file...'
  );

  await createEnvFile(
    serverPath,
    options
  );

  // ======================================
  // COMPLETE
  // ======================================

  console.log(
    '\n===================================='
  );

  console.log(
    'MCP SERVER GENERATED'
  );

  console.log(
    '===================================='
  );

  return {
    serverId:
      options.serverId,

    serverPath,

    success: true,
  };
}