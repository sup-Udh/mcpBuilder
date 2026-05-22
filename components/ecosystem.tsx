"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const clients = [
  {
    id: "cursor",
    name: "Cursor",
    icon: "code",
    desc: "Seamlessly integrate with Cursor's built-in MCP engine. Add the HTTP+SSE endpoint directly via Cursor Settings.",
    config: `{
  "mcpServers": {
    "my-server": {
      "url": "https://mcp-worker.dev/sse"
    }
  }
}`
  },
  {
    id: "claude",
    name: "Claude Desktop",
    icon: "smart_toy",
    desc: "Claude Desktop operates on stdio. Use the official mcp-remote bridge to connect to the cloud SSE endpoint.",
    config: `{
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp-worker.dev/sse"]
    }
  }
}`
  },
  {
    id: "vscode",
    name: "VS Code",
    icon: "terminal",
    desc: "Configure VS Code with GitHub Copilot Chat (version 1.99+). Add the configuration under your settings.json settings.",
    config: `{
  "mcp": {
    "servers": {
      "my-server": {
        "type": "sse",
        "url": "https://mcp-worker.dev/sse"
      }
    }
  }
}`
  }
]

const sdks = [
  {
    lang: "Python",
    code: `import asyncio
from mcp.client.session import ClientSession
from mcp.client.sse import sse_client

async def main():
    async with sse_client("https://mcp-worker.dev/sse") as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            print(await session.list_tools())

asyncio.run(main())`,
    install: "pip install mcp"
  },
  {
    lang: "TypeScript",
    code: `import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

const transport = new SSEClientTransport(new URL("https://mcp-worker.dev/sse"));
const client = new Client({ name: "my-client", version: "1.0.0" });
await client.connect(transport);
console.log(await client.listTools());`,
    install: "npm install @modelcontextprotocol/sdk"
  },
  {
    lang: "Go",
    code: `package main

import (
    "context"
    "fmt"
    "github.com/mark3labs/mcp-go/client"
)

func main() {
    c, _ := client.NewSSEMCPClient("https://mcp-worker.dev/sse")
    defer c.Close()
    c.Start(context.Background())
    fmt.Println(c.ListTools(context.Background()))
}`,
    install: "go get github.com/mark3labs/mcp-go"
  }
]

export default function ConnectionEcosystem() {
  const [activeClient, setActiveClient] = useState("cursor")
  const [activeSdk, setActiveSdk] = useState("Python")
  const [copied, setCopied] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const selectedClient = clients.find(c => c.id === activeClient) || clients[0]
  const selectedSdk = sdks.find(s => s.lang === activeSdk) || sdks[0]

  return (
    <section id="ecosystem" className="relative mx-auto mb-40 max-w-7xl px-6">
      {/* Ambient gradient */}
      <div className="pointer-events-none absolute top-[10%] left-[10%] h-[450px] w-[450px] rounded-full bg-[radial-gradient(circle_at_center,rgba(124,77,255,0.03)_0,transparent_60%)] blur-3xl" />

      {/* HEADER */}
      <div className="mb-24 text-center">
        <span className="font-mono text-xs uppercase tracking-widest text-[#7C4DFF]">
          Integrations & SDKs
        </span>
        <h2 
          className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          Connect Any AI Client
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Whether you use Cursor, Claude Desktop, VS Code, or custom agent systems built with official SDKs.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-12 items-start relative z-10">
        
        {/* LEFT COLUMN: Client Config (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex pb-4 gap-6 border-b" style={{ borderColor: 'var(--border-primary)' }}>
            {clients.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveClient(c.id)}
                className="relative pb-4 text-sm font-semibold tracking-tight transition-all duration-300 cursor-pointer flex items-center gap-2"
                style={{
                  color: activeClient === c.id ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {c.icon}
                </span>
                {c.name}
                {activeClient === c.id && (
                  <motion.div
                    layoutId="activeClientTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF6B35] to-[#FF4081]"
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeClient}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {selectedClient.desc}
              </p>

              {/* Code/Config block */}
              <div className="relative rounded-2xl border p-5 font-mono text-xs overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                  <span className="text-[10px] uppercase tracking-widest font-mono" style={{ color: 'var(--text-muted)' }}>JSON Config</span>
                  <button 
                    onClick={() => handleCopy(selectedClient.config)}
                    className="flex items-center justify-center h-8 w-8 rounded-lg border cursor-pointer transition active:scale-95"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-primary)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {copied ? "check" : "content_copy"}
                    </span>
                  </button>
                </div>
                <pre className="leading-relaxed overflow-x-auto pt-4 select-all" style={{ color: 'var(--text-primary)' }}>
                  {selectedClient.config}
                </pre>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: Code SDKs (5 cols) */}
        <div 
          className="landing-card lg:col-span-5 rounded-[2rem] border p-6 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 relative group"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)'
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF4081]">Code SDKs</span>
              
              <div className="flex gap-2">
                {sdks.map((s) => (
                  <button
                    key={s.lang}
                    onClick={() => setActiveSdk(s.lang)}
                    className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold cursor-pointer transition"
                    style={{
                      backgroundColor: activeSdk === s.lang ? 'rgba(255, 64, 129, 0.15)' : 'var(--bg-secondary)',
                      color: activeSdk === s.lang ? '#FF4081' : 'var(--text-secondary)',
                      border: activeSdk === s.lang ? '1px solid rgba(255, 64, 129, 0.3)' : '1px solid transparent'
                    }}
                  >
                    {s.lang}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              Access the server endpoint programmatically in your favorite codebase context with standard SDK adapters.
            </p>

            {/* SDK Code Snippet */}
            <div className="relative rounded-xl border p-4 font-mono text-[10px] overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
              <div className="absolute top-2 right-2 z-10">
                <button 
                  onClick={() => handleCopy(selectedSdk.code)}
                  className="flex items-center justify-center h-6 w-6 rounded border cursor-pointer transition"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-muted)'
                  }}
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {copied ? "check" : "content_copy"}
                  </span>
                </button>
              </div>
              <pre className="overflow-x-auto leading-relaxed select-all pt-2 whitespace-pre" style={{ color: 'var(--text-secondary)' }}>
                {selectedSdk.code}
              </pre>
            </div>
          </div>

          {/* Installation Tag */}
          <div className="mt-4 pt-4 border-t flex items-center justify-between text-[10px] font-mono" style={{ borderColor: 'var(--border-primary)' }}>
            <span style={{ color: 'var(--text-muted)' }}>INSTALLATION:</span>
            <code className="text-[#FF6B35] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(255, 107, 53, 0.05)', border: '1px solid rgba(255, 107, 53, 0.15)' }}>
              {selectedSdk.install}
            </code>
          </div>
        </div>

      </div>
    </section>
  )
}
