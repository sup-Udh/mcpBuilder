"use client"

import { useState, useCallback, useEffect } from "react"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ConnectionGuideProps {
  endpoint: string
  serverName: string
  isOpen: boolean
  onClose: () => void
}

type MainTab = "ai-ides" | "claude-desktop" | "code-sdks"
type SdkLang = "python" | "typescript" | "java" | "csharp" | "go" | "rust"

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function sanitizeName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function trimEndpoint(ep: string) {
  return ep.replace(/\/+$/, "")
}

/* ------------------------------------------------------------------ */
/*  Copy button                                                       */
/* ------------------------------------------------------------------ */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }, [text])

  return (
    <button
      onClick={handleCopy}
      className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-elevated)] px-2.5 py-1.5 text-[11px] text-[var(--text-secondary)] transition hover:bg-[var(--bg-elevated-hover)] hover:text-[var(--text-primary)]"
    >
      <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
        {copied ? "check" : "content_copy"}
      </span>
      {copied ? "Copied" : "Copy"}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Code block                                                        */
/* ------------------------------------------------------------------ */

function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  return (
    <div className="relative mt-3">
      <CopyButton text={code} />
      <pre className="overflow-x-auto rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 pr-24 font-mono text-xs leading-relaxed text-[var(--text-secondary)]">
        <code>{code}</code>
      </pre>
      {lang && (
        <span className="absolute bottom-3 right-3 font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)]">
          {lang}
        </span>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  IDE Card                                                          */
/* ------------------------------------------------------------------ */

function IdeCard({
  icon,
  title,
  children,
}: {
  icon: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-[16px] border border-[var(--border-primary)] bg-[var(--bg-card)] p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-primary)] bg-[var(--bg-elevated)]">
          <span className="material-symbols-outlined text-[var(--accent-primary)]" style={{ fontSize: 20 }}>
            {icon}
          </span>
        </div>
        <h3 className="text-base font-semibold text-[var(--text-primary)]">{title}</h3>
      </div>
      <div className="space-y-3 text-xs leading-relaxed text-[var(--text-secondary)]">{children}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab: AI IDEs                                                      */
/* ------------------------------------------------------------------ */

function AiIdesTab({ ep, name }: { ep: string; name: string }) {
  return (
    <div className="space-y-6">
      {/* Cursor */}
      <IdeCard icon="edit_note" title="Cursor">
        <p>
          Go to <span className="text-[var(--text-primary)] font-medium">Settings → MCP</span>, click{" "}
          <span className="text-[var(--accent-primary)] font-medium">&quot;Add MCP Server&quot;</span>, and configure:
        </p>
        <CodeBlock
          lang="json"
          code={JSON.stringify(
            { mcpServers: { [name]: { url: `${ep}/sse` } } },
            null,
            2
          )}
        />
        <p className="mt-2 text-[var(--text-muted)]">
          Alternatively, add the above to{" "}
          <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5 text-xs text-[var(--accent-secondary)]">
            .cursor/mcp.json
          </code>{" "}
          in your project root.
        </p>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/5 px-3 py-2 text-xs text-[var(--accent-primary)]">
          <span className="material-symbols-outlined text-sm">
            info
          </span>
          Cursor supports HTTP+SSE transport.
        </div>
      </IdeCard>

      {/* VS Code */}
      <IdeCard icon="code_blocks" title="VS Code (Copilot)">
        <p>
          Open <span className="text-[var(--text-primary)] font-medium">Settings (JSON)</span> and add to your{" "}
          <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5 text-xs text-[var(--accent-secondary)]">
            settings.json
          </code>
          :
        </p>
        <CodeBlock
          lang="json"
          code={JSON.stringify(
            {
              mcp: {
                servers: {
                  [name]: { type: "sse", url: `${ep}/sse` },
                },
              },
            },
            null,
            2
          )}
        />
        <p className="mt-2 text-[var(--text-muted)]">
          Or use the Command Palette →{" "}
          <span className="text-[var(--text-secondary)]">&quot;MCP: Add Server&quot;</span> and paste the URL.
        </p>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-[var(--accent-secondary)]/20 bg-[var(--accent-secondary)]/5 px-3 py-2 text-xs text-[var(--accent-secondary)]">
          <span className="material-symbols-outlined text-sm">
            info
          </span>
          Requires VS Code 1.99+ with GitHub Copilot.
        </div>
      </IdeCard>

      {/* Windsurf */}
      <IdeCard icon="air" title="Windsurf">
        <p>
          Open <span className="text-[var(--text-primary)] font-medium">Settings → MCP Configuration</span>, or edit:
        </p>
        <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">
          ~/.codeium/windsurf/mcp_config.json
        </p>
        <CodeBlock
          lang="json"
          code={JSON.stringify(
            {
              mcpServers: {
                [name]: { serverUrl: `${ep}/sse` },
              },
            },
            null,
            2
          )}
        />
      </IdeCard>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab: Claude Desktop                                               */
/* ------------------------------------------------------------------ */

function ClaudeDesktopTab({ ep, name }: { ep: string; name: string }) {
  return (
    <div className="space-y-6">
      <IdeCard icon="smart_toy" title="Claude Desktop">
        <p>
          Open <span className="text-[var(--text-primary)] font-medium">Claude Desktop → Settings → Developer → Edit Config</span>.
          Edit the file{" "}
          <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5 text-xs text-[var(--accent-secondary)]">
            claude_desktop_config.json
          </code>
          :
        </p>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <span className="material-symbols-outlined text-sm">
              laptop_mac
            </span>
            <span className="font-mono">
              ~/Library/Application Support/Claude/claude_desktop_config.json
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <span className="material-symbols-outlined text-sm">
              desktop_windows
            </span>
            <span className="font-mono">
              %APPDATA%\Claude\claude_desktop_config.json
            </span>
          </div>
        </div>

        <CodeBlock
          lang="json"
          code={JSON.stringify(
            {
              mcpServers: {
                [name]: {
                  command: "npx",
                  args: ["-y", "mcp-remote", `${ep}/sse`],
                },
              },
            },
            null,
            2
          )}
        />

        <div className="mt-4 rounded-xl border border-[var(--accent-secondary)]/20 bg-[var(--accent-secondary)]/5 p-4 text-xs leading-relaxed text-[var(--text-secondary)]">
          <div className="mb-2 flex items-center gap-2 font-semibold text-[var(--accent-secondary)]">
            <span className="material-symbols-outlined text-base">
              info
            </span>
            Why mcp-remote?
          </div>
          Claude Desktop uses <span className="text-[var(--text-primary)]">stdio</span> transport, so{" "}
          <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5 text-[var(--accent-primary)] font-mono">
            mcp-remote
          </code>{" "}
          acts as a bridge to connect to your HTTP+SSE endpoint. After saving the config,{" "}
          <span className="text-[var(--text-primary)]">restart Claude Desktop</span> for changes to take effect.
        </div>
      </IdeCard>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab: Code SDKs                                                    */
/* ------------------------------------------------------------------ */

const SDK_TABS: { key: SdkLang; label: string; icon: string }[] = [
  { key: "python", label: "Python", icon: "code" },
  { key: "typescript", label: "TypeScript", icon: "javascript" },
  { key: "java", label: "Java", icon: "coffee" },
  { key: "csharp", label: "C#", icon: "tag" },
  { key: "go", label: "Go", icon: "terminal" },
  { key: "rust", label: "Rust", icon: "settings" },
]

function sdkSnippets(ep: string): Record<SdkLang, { code: string; note: string; lang: string }> {
  return {
    python: {
      lang: "python",
      note: "pip install mcp",
      code: `import asyncio
from mcp.client.session import ClientSession
from mcp.client.sse import sse_client

async def main():
    async with sse_client("${ep}/sse") as (read_stream, write_stream):
        async with ClientSession(read_stream, write_stream) as session:
            await session.initialize()
            
            # List available tools
            tools = await session.list_tools()
            print("Available tools:", tools)
            
            # Call a tool
            result = await session.call_tool("query", {
                "query": "How does this work?",
                "topK": 5
            })
            print("Result:", result)

asyncio.run(main())`,
    },
    typescript: {
      lang: "typescript",
      note: "npm install @modelcontextprotocol/sdk",
      code: `import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

const transport = new SSEClientTransport(
  new URL("${ep}/sse")
);

const client = new Client({
  name: "my-client",
  version: "1.0.0",
});

await client.connect(transport);

// List available tools
const tools = await client.listTools();
console.log("Tools:", tools);

// Call a tool
const result = await client.callTool({
  name: "query",
  arguments: {
    query: "How does this work?",
    topK: 5,
  },
});
console.log("Result:", result);`,
    },
    java: {
      lang: "java",
      note: "Add io.modelcontextprotocol:mcp-client to your build.",
      code: `import io.modelcontextprotocol.client.McpClient;
import io.modelcontextprotocol.client.transport.HttpClientSseClientTransport;

var transport = new HttpClientSseClientTransport("${ep}/sse");
var client = McpClient.sync(transport).build();
client.initialize();

// List tools
var tools = client.listTools();
System.out.println("Tools: " + tools);

// Call a tool
var result = client.callTool(
    new CallToolRequest("query", Map.of(
        "query", "How does this work?",
        "topK", 5
    ))
);
System.out.println("Result: " + result);`,
    },
    csharp: {
      lang: "csharp",
      note: "dotnet add package ModelContextProtocol",
      code: `using ModelContextProtocol.Client;
using ModelContextProtocol.Client.Transport;

var transport = new SseClientTransport(
    new Uri("${ep}/sse")
);

var client = await McpClientFactory.CreateAsync(transport);

// List tools
var tools = await client.ListToolsAsync();
Console.WriteLine($"Tools: {tools}");

// Call a tool
var result = await client.CallToolAsync("query", new {
    query = "How does this work?",
    topK = 5
});
Console.WriteLine($"Result: {result}");`,
    },
    go: {
      lang: "go",
      note: "go get github.com/mark3labs/mcp-go",
      code: `package main

import (
    "context"
    "fmt"
    "github.com/mark3labs/mcp-go/client"
)

func main() {
    c, _ := client.NewSSEMCPClient("${ep}/sse")
    defer c.Close()
    
    ctx := context.Background()
    c.Start(ctx)
    
    initReq := mcp.InitializeRequest{}
    initReq.Params.ClientInfo = mcp.Implementation{
        Name:    "my-client",
        Version: "1.0.0",
    }
    c.Initialize(ctx, initReq)
    
    // List tools
    tools, _ := c.ListTools(ctx, mcp.ListToolsRequest{})
    fmt.Println("Tools:", tools)
    
    // Call a tool
    result, _ := c.CallTool(ctx, mcp.CallToolRequest{
        Params: mcp.CallToolParams{
            Name: "query",
            Arguments: map[string]interface{}{
                "query": "How does this work?",
                "topK":  5,
            },
        },
    })
    fmt.Println("Result:", result)
}`,
    },
    rust: {
      lang: "rust",
      note: "Add mcp-client to Cargo.toml",
      code: `use mcp_client::{ClientBuilder, McpClient};
use mcp_client::transport::sse::SseTransport;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let transport = SseTransport::new(
        "${ep}/sse"
    );
    
    let client = ClientBuilder::new(transport)
        .name("my-client")
        .version("1.0.0")
        .build()
        .await?;
    
    // List tools
    let tools = client.list_tools().await?;
    println!("Tools: {:?}", tools);
    
    // Call a tool
    let result = client.call_tool("query", serde_json::json!({
        "query": "How does this work?",
        "topK": 5
    })).await?;
    println!("Result: {:?}", result);
    
    Ok(())
}`,
    },
  }
}

function CodeSdksTab({ ep }: { ep: string }) {
  const [lang, setLang] = useState<SdkLang>("python")
  const snippets = sdkSnippets(ep)
  const current = snippets[lang]

  return (
    <div className="space-y-6">
      {/* Language selector */}
      <div className="flex flex-wrap gap-2">
        {SDK_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setLang(t.key)}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition ${
              lang === t.key
                ? "border border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                : "border border-[var(--border-primary)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated-hover)] hover:text-[var(--text-primary)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Code snippet */}
      <div className="rounded-[16px] border border-[var(--border-primary)] bg-[var(--bg-card)] p-6">
        <CodeBlock code={current.code} lang={current.lang} />
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-2 font-mono text-xs text-[var(--text-muted)]">
          <span className="material-symbols-outlined text-sm">
            download
          </span>
          {current.note}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main tabs config                                                  */
/* ------------------------------------------------------------------ */

const MAIN_TABS: { key: MainTab; label: string; icon: string }[] = [
  { key: "ai-ides", label: "AI IDEs", icon: "code" },
  { key: "claude-desktop", label: "Claude Desktop", icon: "smart_toy" },
  { key: "code-sdks", label: "Code SDKs", icon: "integration_instructions" },
]

/* ------------------------------------------------------------------ */
/*  ConnectionGuide                                                   */
/* ------------------------------------------------------------------ */

export default function ConnectionGuide({
  endpoint,
  serverName,
  isOpen,
  onClose,
}: ConnectionGuideProps) {
  const [activeTab, setActiveTab] = useState<MainTab>("ai-ides")

  /* Close on Escape */
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const ep = trimEndpoint(endpoint)
  const name = sanitizeName(serverName)

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative mx-4 flex max-h-[85vh] w-full max-w-4xl flex-col rounded-[20px] border border-[var(--border-primary)] bg-[var(--bg-primary)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle background glow */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-[var(--gradient-glow-1)] blur-[140px]" />

        {/* ─── Header ─── */}
        <div className="relative z-10 flex items-center justify-between border-b border-[var(--border-primary)] px-8 py-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Connection Guide</h2>
            <p className="mt-1 font-mono text-[11px] text-[var(--text-muted)]">{ep}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-primary)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] transition hover:bg-[var(--bg-elevated-hover)] hover:text-[var(--text-primary)]"
          >
            <span className="material-symbols-outlined text-[18px]">
              close
            </span>
          </button>
        </div>

        {/* ─── Tabs ─── */}
        <div className="relative z-10 flex gap-2 border-b border-[var(--border-primary)] px-8 py-4">
          {MAIN_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium transition ${
                activeTab === tab.key
                  ? "border border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-semibold"
                  : "border border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── Scrollable content ─── */}
        <div className="relative z-10 flex-1 overflow-y-auto px-8 py-6">
          {activeTab === "ai-ides" && <AiIdesTab ep={ep} name={name} />}
          {activeTab === "claude-desktop" && <ClaudeDesktopTab ep={ep} name={name} />}
          {activeTab === "code-sdks" && <CodeSdksTab ep={ep} />}
        </div>

        {/* ─── Footer ─── */}
        <div className="relative z-10 border-t border-[var(--border-primary)] px-8 py-4">
          <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[12px]">
              lock
            </span>
            Your MCP server endpoint is unique to this deployment
          </p>
        </div>
      </div>
    </div>
  )
}
