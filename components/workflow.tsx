"use client"

import { motion } from "framer-motion"

const steps = [
  {
    step: "01",
    title: "Ingest & Extract",
    description: "Provide any doc page, REST reference, or PDF files. The crawler extracts, normalizes, and strips noise from HTML pages or documents automatically.",
    tag: "SOURCE INGEST",
    icon: "database_schema",
    element: (
      <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 font-mono text-[10px] text-[var(--text-secondary)] space-y-2 mt-4">
        <div className="flex items-center justify-between text-[#FF6B35]">
          <span>GET https://docs.mcp.io/api</span>
          <span className="text-green-400">200 OK</span>
        </div>
        <div className="text-[9px] text-[var(--text-muted)] truncate">➔ Fetching DOM structure...</div>
        <div className="text-[9px] text-[var(--text-muted)] truncate">➔ Found 12 header tags, 4 code blocks</div>
        <div className="text-[#FF4081]">✓ Text successfully extracted (4.2 KB clean Markdown)</div>
      </div>
    )
  },
  {
    step: "02",
    title: "Chunk & Vectorize",
    description: "Documents are split into semantic chunks, embedded using state-of-the-art vector models, and loaded into an isolated vector storage layer for fast retrieval.",
    tag: "COGNITIVE PIPELINE",
    icon: "flowsheet",
    element: (
      <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 font-mono text-[10px] text-[var(--text-secondary)] space-y-2.5 mt-4">
        <div className="flex items-center justify-between text-[var(--text-muted)]">
          <span>VECTOR PIPELINE</span>
          <span className="text-[#7C4DFF] animate-pulse">INDEXING</span>
        </div>
        <div className="w-full bg-[var(--border-primary)] h-[3px] rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-[#FF6B35] to-[#7C4DFF] h-full w-[80%] rounded-full animate-loading-bar" />
        </div>
        <div className="grid grid-cols-2 gap-2 text-[9px]">
          <div className="bg-[var(--bg-primary)] border border-[var(--border-primary)] p-1 rounded">
            <span className="text-[var(--text-muted)] block">CHUNKS</span>
            <span className="text-[var(--text-primary)]">18 Blocks</span>
          </div>
          <div className="bg-[var(--bg-primary)] border border-[var(--border-primary)] p-1 rounded">
            <span className="text-[var(--text-muted)] block">DIMENSION</span>
            <span className="text-[var(--text-primary)]">1536 (Float32)</span>
          </div>
        </div>
      </div>
    )
  },
  {
    step: "03",
    title: "Deploy Endpoint",
    description: "Deploy a global Cloudflare worker instance with standard SSE handlers. AI tools instantly detect functions like semantic search or knowledge retrieval.",
    tag: "SERVER RUNTIME",
    icon: "lan",
    element: (
      <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 font-mono text-[10px] text-[var(--text-secondary)] space-y-2 mt-4">
        <div className="flex items-center justify-between text-[var(--text-muted)]">
          <span>mcp.json CONFIG</span>
          <span className="text-green-400">READY</span>
        </div>
        <pre className="text-[9px] text-[var(--text-secondary)] leading-tight overflow-x-hidden">
{`{
  "mcpServers": {
    "my-server": {
      "url": "https://mcp-worker.dev/sse"
    }
  }
}`}
        </pre>
      </div>
    )
  }
]

export default function Workflow() {
  return (
    <section id="pipeline" className="relative mx-auto mb-40 max-w-7xl px-6 pt-12">
      {/* Background soft lighting */}
      <div className="pointer-events-none absolute top-[20%] left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(124,77,255,0.04)_0,transparent_60%)] blur-3xl" />

      {/* HEADING */}
      <div className="mb-24 text-center">
        <span className="font-mono text-xs uppercase tracking-widest text-[#FF4081]">
          Orchestration Process
        </span>
        <h2 
          className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          From Docs to Live AI Tools
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          A robust developer experience that bridges static knowledge with real-time agentic execution.
        </p>
      </div>

      {/* STAGGERED & ASYMMETRICAL STEP CARDS */}
      <div className="grid gap-8 lg:grid-cols-3 relative z-10">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="landing-card group relative flex flex-col justify-between rounded-3xl border p-6 backdrop-blur-xl transition-all duration-300"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-primary)',
            }}
          >
            {/* Ambient inner soft background glow on hover */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FF4081]/0 via-transparent to-[#7C4DFF]/0 group-hover:from-[#FF4081]/[0.015] group-hover:to-[#7C4DFF]/[0.02] pointer-events-none transition-all duration-500" />

            <div>
              {/* TOP HEADER */}
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-xs text-[#FF6B35] font-semibold tracking-wider">
                  {step.tag}
                </span>
                
                <div className="flex items-center gap-2">
                  <span 
                    className="material-symbols-outlined text-[18px] group-hover:text-[#FF4081] transition-colors duration-300"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {step.icon}
                  </span>
                  <span className="font-mono text-sm font-bold" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
                    {step.step}
                  </span>
                </div>
              </div>

              {/* TITLE */}
              <h3 
                className="mb-4 text-2xl font-bold tracking-tight"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                {step.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {step.description}
              </p>
            </div>

            {/* PIPELINE LOG/ELEMENT DISPLAY */}
            <div className="mt-6">
              {step.element}
            </div>

            {/* Connecting visual pointer for non-last steps on desktop */}
            {index !== steps.length - 1 && (
              <div className="absolute top-1/2 -right-4 hidden lg:flex items-center justify-center z-20 pointer-events-none">
                <span className="material-symbols-outlined text-white/10 text-xl font-bold">
                  chevron_right
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  )
}