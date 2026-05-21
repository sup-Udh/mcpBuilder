// lib/deployment/deploy.ts

import { generateWorkerScript, WorkerConfig } from './worker-template';

// ==========================================
// CONFIG
// ==========================================

const CLOUDFLARE_API_BASE = 'https://api.cloudflare.com/client/v4';

// ==========================================
// TYPES
// ==========================================

export interface DeployOptions {
  serverId: string;
  serverName: string;
}

export interface DeployResult {
  success: boolean;
  endpoint: string;
  workerName: string;
  error?: string;
}

// ==========================================
// GET CLOUDFLARE CREDENTIALS
// ==========================================

function getCloudflareCredentials() {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

  if (!apiToken) {
    throw new Error(
      'Missing CLOUDFLARE_API_TOKEN environment variable. ' +
      'Create a token at https://dash.cloudflare.com/profile/api-tokens with Workers Scripts:Edit permission.'
    );
  }

  if (!accountId) {
    throw new Error(
      'Missing CLOUDFLARE_ACCOUNT_ID environment variable. ' +
      'Find your Account ID at https://dash.cloudflare.com/ in the sidebar.'
    );
  }

  return { apiToken, accountId };
}

// ==========================================
// SANITIZE WORKER NAME
// ==========================================

function sanitizeWorkerName(name: string): string {
  return 'mcp-'
    + name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 50);
}

// ==========================================
// DEPLOY TO CLOUDFLARE WORKERS
// ==========================================

export async function deployToCloudflare(
  options: DeployOptions
): Promise<DeployResult> {
  console.log('\n====================================');
  console.log('DEPLOYING TO CLOUDFLARE WORKERS');
  console.log('====================================');
  console.log(`Server ID: ${options.serverId}`);
  console.log(`Server Name: ${options.serverName}`);

  const { apiToken, accountId } = getCloudflareCredentials();

  const workerName = sanitizeWorkerName(
    options.serverName + '-' + options.serverId.slice(0, 8)
  );

  console.log(`Worker Name: ${workerName}`);

  // ======================================
  // GENERATE WORKER SCRIPT
  // ======================================

  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  const openaiKey =
    process.env.OPENAI_API_KEY;

  if (!supabaseUrl || !supabaseKey || !openaiKey) {
    throw new Error(
      'Missing required environment variables for Worker deployment: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY'
    );
  }

  const workerConfig: WorkerConfig = {
    serverId: options.serverId,
    serverName: options.serverName,
    supabaseUrl,
    supabaseKey,
    openaiKey,
  };

  const workerScript = generateWorkerScript(workerConfig);

  console.log(
    `Generated Worker script (${workerScript.length} chars)`
  );

  // ======================================
  // UPLOAD WORKER SCRIPT
  // ======================================

  console.log('Uploading Worker script to Cloudflare...');

  // Use FormData with metadata for module workers
  const formData = new FormData();

  // Worker module
  const scriptBlob = new Blob([workerScript], {
    type: 'application/javascript+module',
  });

  formData.append('worker.js', scriptBlob, 'worker.js');

  // Metadata
  const metadata = {
    main_module: 'worker.js',
    compatibility_date: '2024-01-01',
  };

  formData.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], {
      type: 'application/json',
    })
  );

  const uploadUrl =
    `${CLOUDFLARE_API_BASE}/accounts/${accountId}/workers/scripts/${workerName}`;

  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
    body: formData,
  });

  const uploadResult = await uploadResponse.json();

  if (!uploadResponse.ok || !uploadResult.success) {
    const errorMsg =
      uploadResult.errors?.map((e: any) => e.message).join(', ') ||
      'Unknown error';

    console.error('Worker upload failed:', errorMsg);

    throw new Error(`Cloudflare Worker upload failed: ${errorMsg}`);
  }

  console.log('Worker script uploaded successfully');

  // ======================================
  // ENABLE WORKERS.DEV SUBDOMAIN
  // ======================================

  console.log('Enabling workers.dev subdomain...');

  const subdomainUrl =
    `${CLOUDFLARE_API_BASE}/accounts/${accountId}/workers/scripts/${workerName}/subdomain`;

  const subdomainResponse = await fetch(subdomainUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ enabled: true }),
  });

  if (!subdomainResponse.ok) {
    console.warn('Failed to enable workers.dev subdomain (may already be enabled)');
  }

  // ======================================
  // GET WORKERS.DEV SUBDOMAIN
  // ======================================

  console.log('Fetching workers.dev subdomain...');

  const accountSubdomainUrl =
    `${CLOUDFLARE_API_BASE}/accounts/${accountId}/workers/subdomain`;

  const accountSubdomainResponse = await fetch(accountSubdomainUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });

  let workersSubdomain = '';

  if (accountSubdomainResponse.ok) {
    const subdomainData = await accountSubdomainResponse.json();
    workersSubdomain = subdomainData.result?.subdomain || '';
  }

  const endpoint = workersSubdomain
    ? `https://${workerName}.${workersSubdomain}.workers.dev`
    : `https://${workerName}.workers.dev`;

  console.log(`\nDeployment successful!`);
  console.log(`Endpoint: ${endpoint}`);

  console.log('\n====================================');
  console.log('CLOUDFLARE DEPLOYMENT COMPLETE');
  console.log('====================================');

  return {
    success: true,
    endpoint,
    workerName,
  };
}
