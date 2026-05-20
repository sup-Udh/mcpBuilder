"use client"

import Sidebar from "@/components/dashboard/sidebar"
import { useParams, useRouter } from "next/navigation"

const servers = [
  {
    id: "docs-context-engine",
    name: "Docs Context Engine",
    type: "DOCUMENTATION",
    status: "Running",
    endpoint: "mcp://docs-engine.local",
    requests: "12.4k",
    latency: "142ms",
    icon: "description",
  },
  {
    id: "website-knowledge-base",
    name: "Website Knowledge Base",
    type: "WEBSITE",
    status: "Indexing",
    endpoint: "mcp://website-runtime.local",
    requests: "8.1k",
    latency: "89ms",
    icon: "language",
  },
]

export default function MCPServerDetails() {

  const params = useParams()
  const router = useRouter()

  const server = servers.find(
    (s) => s.id === params.serverId
  )

  if (!server) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020617] text-white">
        <h1 className="text-3xl font-bold">
          MCP Server Not Found
        </h1>
      </main>
    )
  }

  return (
    <>
    
      <Sidebar />

      <main className="min-h-screen bg-[#020617] pl-64 text-white">

        {/* BACKGROUND */}
        <div
          className="pointer-events-none fixed inset-0 opacity-40"
          style={{
            backgroundSize: "40px 40px",
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
            maskImage:
              "radial-gradient(circle at center, black, transparent 80%)",
          }}
        />

        {/* GLOWS */}
        <div className="pointer-events-none fixed left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[140px]" />

        <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[140px]" />

        {/* CONTENT */}
        <section className="relative z-10 px-8 py-10">

          {/* TOP BAR */}
          <div className="mb-8 flex items-center justify-between">

            <button
              onClick={() => router.back()}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-white/70 transition hover:bg-white/[0.05] hover:text-white"
            >

              <span className="material-symbols-outlined text-sm">
                arrow_back
              </span>

              Back

            </button>

            <div className="flex items-center gap-3 rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2">

              <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

              <span className="font-mono text-xs uppercase tracking-widest text-green-300">
                {server.status}
              </span>

            </div>

          </div>

          {/* SERVER HEADER */}
          <div className="mb-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">

            <div className="flex items-start gap-6">

              {/* ICON */}
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-blue-400/10">

                <span className="material-symbols-outlined text-5xl text-blue-200">
                  {server.icon}
                </span>

              </div>

              {/* INFO */}
              <div className="flex-1">

                <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-blue-200/50">
                  MCP SERVER
                </p>

                <h1 className="text-5xl font-bold tracking-tight">
                  {server.name}
                </h1>

                <div className="mt-5 flex flex-wrap items-center gap-3">

                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-white/60">
                    {server.type}
                  </span>

                  <span className="rounded-full border border-blue-300/10 bg-blue-400/10 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-blue-200">
                    AI READY
                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

            {/* REQUESTS */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">

              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-white/40">
                Requests
              </p>

              <h2 className="text-4xl font-bold">
                {server.requests}
              </h2>

            </div>

            {/* LATENCY */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">

              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-white/40">
                Latency
              </p>

              <h2 className="text-4xl font-bold">
                {server.latency}
              </h2>

            </div>

            {/* STATUS */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">

              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-white/40">
                Runtime
              </p>

              <h2 className="text-4xl font-bold text-green-300">
                Healthy
              </h2>

            </div>

          </div>

          {/* ENDPOINT */}
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">

            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-white/40">
              MCP Endpoint
            </p>

            <div className="flex items-center justify-between rounded-2xl border border-blue-300/10 bg-blue-400/10 px-5 py-4">

              <code className="font-mono text-sm text-blue-200">
                {server.endpoint}
              </code>

              <button className="cursor-pointer text-white/40 transition hover:text-blue-200">

                <span className="material-symbols-outlined">
                  content_copy
                </span>

              </button>

            </div>

          </div>

          {/* TERMINAL */}
          <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl">

            {/* TERMINAL TOP */}
            <div className="flex items-center gap-2 border-b border-white/10 px-6 py-4">

              <div className="h-3 w-3 rounded-full bg-red-400/70" />
              <div className="h-3 w-3 rounded-full bg-yellow-400/70" />
              <div className="h-3 w-3 rounded-full bg-green-400/70" />

              <span className="ml-4 font-mono text-xs uppercase tracking-widest text-white/40">
                runtime.logs
              </span>

            </div>

            {/* TERMINAL CONTENT */}
            <div className="space-y-3 p-6 font-mono text-sm">

              <p className="text-blue-300">
                &gt; Connecting runtime...
              </p>

              <p className="text-violet-300">
                &gt; Fetching vector indexes...
              </p>

              <p className="text-cyan-300">
                &gt; Processing semantic embeddings...
              </p>

              <p className="text-green-300">
                &gt; MCP runtime operational.
              </p>

            </div>

          </div>

        </section>

      </main>
    
    </>
  )
}