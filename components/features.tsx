"use client"

import { motion } from "framer-motion"
import { useState } from "react"

export default function Features() {
  const [queryText, setQueryText] = useState("")
  const [searchResults, setSearchResults] = useState<Array<{ text: string, score: number }>>([])
  const [searching, setSearching] = useState(false)

  const handleTestQuery = () => {
    if (searching) return
    setSearching(true)
    setSearchResults([])
    setTimeout(() => {
      setSearchResults([
        { text: "Initialize client connection with SSE endpoint...", score: 0.94 },
        { text: "Define query schema parameter for tools list handlers...", score: 0.88 }
      ])
      setSearching(false)
    }, 800)
  }

  return (
    <section id="features" className="relative mx-auto mb-40 max-w-7xl px-6">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -bottom-[10%] right-[5%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,64,129,0.03)_0,transparent_70%)] blur-3xl" />

      {/* HEADING */}
      <div className="mb-24 text-left max-w-3xl">
        <span className="font-mono text-xs uppercase tracking-widest text-[#FF6B35]">
          Core Capabilities
        </span>
        <h2 
          className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Intelligent Tool Infrastructure for Agent Workforces
        </h2>
        <p className="mt-6 text-base text-[#A69EAF] leading-relaxed">
          Everything you need to compile raw documentation, specifications, and files into structured semantic systems that AI agents can consume securely.
        </p>
      </div>

      {/* ASYMMETRICAL OFFSET GRID */}
      <div className="grid gap-6 md:grid-cols-6 items-stretch">
        
        {/* CARD 1: SEMANTIC SEARCH & RETRIEVAL (Large - col-span-4) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="md:col-span-4 rounded-[2rem] border border-white/5 bg-[#0D081D]/30 p-8 backdrop-blur-xl flex flex-col justify-between hover:border-white/10 transition-all duration-300 relative group"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6B35]/10 border border-[#FF6B35]/20">
                <span className="material-symbols-outlined text-[#FF6B35] text-[20px]">
                  manage_search
                </span>
              </div>
              <span className="font-mono text-xs text-[#FF6B35] uppercase tracking-wider">Retrieval Engine</span>
            </div>

            <h3 className="mb-3 text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Deep Semantic Search & Vector Indexes
            </h3>
            <p className="text-sm text-[#A69EAF] leading-relaxed max-w-xl">
              Equip AI models with pinpoint context. Instead of basic keyword matches, the system splits content into optimized vectors, matching queries against contextual concepts dynamically.
            </p>
          </div>

          {/* Interactive Semantic Preview Widget */}
          <div className="mt-8 rounded-2xl border border-white/5 bg-[#06030c]/70 p-4 font-mono text-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-white/40">QUERY:</span>
              <input
                type="text"
                placeholder="Type semantic query (e.g. auth flow)"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                className="flex-1 bg-white/5 border border-white/5 rounded px-2.5 py-1 text-white outline-none focus:border-[#FF6B35]/40 transition text-[11px]"
              />
              <button 
                onClick={handleTestQuery}
                className="bg-[#FF6B35] text-white px-3 py-1 rounded text-[10px] font-bold hover:opacity-90 active:scale-95 transition"
              >
                {searching ? "CRAWLING..." : "RETRIEVE"}
              </button>
            </div>
            
            <div className="space-y-2 border-t border-white/5 pt-3">
              {searchResults.length > 0 ? (
                searchResults.map((res, i) => (
                  <div key={i} className="flex justify-between items-start text-[10px] bg-white/[0.02] border border-white/5 p-2 rounded">
                    <span className="text-white/70 truncate max-w-[80%]">{res.text}</span>
                    <span className="text-[#FF6B35] font-bold">score: {res.score}</span>
                  </div>
                ))
              ) : (
                <div className="text-[10px] text-white/30 italic">Click retrieve to run vector match...</div>
              )}
            </div>
          </div>
        </motion.div>

        {/* CARD 2: INSTANT EDGE HOSTING (Small - col-span-2) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="md:col-span-2 rounded-[2rem] border border-white/5 bg-[#0D081D]/30 p-8 backdrop-blur-xl flex flex-col justify-between hover:border-white/10 transition-all duration-300 relative group"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF4081]/10 border border-[#FF4081]/20">
                <span className="material-symbols-outlined text-[#FF4081] text-[20px]">
                  cloud_done
                </span>
              </div>
              <span className="font-mono text-xs text-[#FF4081] uppercase tracking-wider">Worker Edge</span>
            </div>

            <h3 className="mb-3 text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Serverless Edge Hosting
            </h3>
            <p className="text-sm text-[#A69EAF] leading-relaxed">
              Deploy your MCP server globally onto low-latency Cloudflare Edge networks instantly. Zero server management required.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-white/5 bg-[#06030c]/70 p-4 font-mono text-[10px] text-[#A69EAF] space-y-1.5">
            <div className="flex justify-between">
              <span>DEPLOYED LOCATION:</span>
              <span className="text-white">Global Edge (275+ PoPs)</span>
            </div>
            <div className="flex justify-between">
              <span>RESPONSE TIME:</span>
              <span className="text-green-400 font-bold">12ms avg</span>
            </div>
            <div className="flex justify-between">
              <span>BANDWIDTH:</span>
              <span className="text-white">Unlimited SSL</span>
            </div>
          </div>
        </motion.div>

        {/* CARD 3: RICH INGEST PIPELINES (Small - col-span-2) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:col-span-2 rounded-[2rem] border border-white/5 bg-[#0D081D]/30 p-8 backdrop-blur-xl flex flex-col justify-between hover:border-white/10 transition-all duration-300 relative group"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C4DFF]/10 border border-[#7C4DFF]/20">
                <span className="material-symbols-outlined text-[#7C4DFF] text-[20px]">
                  article
                </span>
              </div>
              <span className="font-mono text-xs text-[#7C4DFF] uppercase tracking-wider">Multi-Format</span>
            </div>

            <h3 className="mb-3 text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Rich File & Doc Parsing
            </h3>
            <p className="text-sm text-[#A69EAF] leading-relaxed">
              Accept crawls, structured OpenAPI schema files, raw markdown manuals, PDF documents, or feeds.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            <span className="bg-white/5 border border-white/5 rounded-full px-3 py-1 text-[10px] font-mono text-white/70">.pdf docs</span>
            <span className="bg-white/5 border border-white/5 rounded-full px-3 py-1 text-[10px] font-mono text-white/70">web urls</span>
            <span className="bg-white/5 border border-white/5 rounded-full px-3 py-1 text-[10px] font-mono text-white/70">openapi.json</span>
            <span className="bg-white/5 border border-white/5 rounded-full px-3 py-1 text-[10px] font-mono text-white/70">rss feeds</span>
          </div>
        </motion.div>

        {/* CARD 4: BUILT-IN SECURITY (Large - col-span-4) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="md:col-span-4 rounded-[2rem] border border-white/5 bg-[#0D081D]/30 p-8 backdrop-blur-xl flex flex-col justify-between hover:border-white/10 transition-all duration-300 relative group"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20">
                <span className="material-symbols-outlined text-green-400 text-[20px]">
                  security
                </span>
              </div>
              <span className="font-mono text-xs text-green-400 uppercase tracking-wider">Enterprise Security</span>
            </div>

            <h3 className="mb-3 text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Fine-Grained Permissions & Safe Sandboxing
            </h3>
            <p className="text-sm text-[#A69EAF] leading-relaxed max-w-xl">
              Keep your sensitive credentials isolated. The generated server runtime runs inside secure, sandboxed execution scopes. Scopes limit tools to read-only configurations, prevent external injection, and rotate keys regularly.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-white/5 bg-[#06030c]/70 p-4 font-mono text-[10px] space-y-2">
            <div className="flex items-center gap-2 text-green-400">
              <span className="material-symbols-outlined text-xs">check_circle</span>
              <span>Sandboxed Execution Engine (V8 Isolated)</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <span className="material-symbols-outlined text-xs">check_circle</span>
              <span>Read-Only File Scopes Configured</span>
            </div>
            <div className="flex items-center gap-2 text-[#FF6B35]">
              <span className="material-symbols-outlined text-xs animate-pulse">lock_open</span>
              <span>Dynamic API Key Injection Rotated</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}