"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"

export default function TermsPage() {
  return (
    <main 
      className="landing-theme min-h-screen relative overflow-hidden transition-colors duration-300 selection:bg-[#FF4081]/30 selection:text-white"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {/* CINEMATIC BACKGROUND SYSTEM */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Layer 1: Fine-mesh structure grid */}
        <div 
          className="absolute inset-0 bg-[size:48px_48px] opacity-70" 
          style={{
            backgroundImage: 'linear-gradient(var(--l-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--l-grid-line) 1px, transparent 1px)'
          }}
        />
        
        {/* Layer 2: Subtle light grids alignment */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,107,53,0.07)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,64,129,0.05)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_90%,rgba(124,77,255,0.06)_0%,transparent_60%)]" />

        {/* Layer 3: Vignette for depth */}
        <div 
          className="absolute inset-0 opacity-95 transition-all duration-500" 
          style={{
            backgroundImage: 'radial-gradient(circle at center, transparent 30%, var(--bg-primary) 100%)'
          }}
        />
      </div>

      {/* CORE NAVIGATION */}
      <Navbar />

      {/* CONTENT */}
      <section className="relative z-10 px-6 pt-32 pb-20">
        <div className="mx-auto max-w-4xl">
          
          {/* BREADCRUMB / BACK LINK */}
          <div className="mb-6 flex items-center gap-2">
            <Link 
              href="/" 
              className="inline-flex items-center gap-1.5 text-xs font-mono tracking-widest uppercase transition-all duration-200 hover:scale-102 group cursor-pointer"
              style={{ color: 'var(--accent-primary)' }}
            >
              <span className="material-symbols-outlined text-[14px] transition-transform duration-200 group-hover:-translate-x-0.5">arrow_back</span>
              Back to Home
            </Link>
          </div>

          {/* HEADER */}
          <div className="mb-12">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--text-muted)' }}>
              LEGAL DOCUMENTATION
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4081] to-[#FF6B35]">Conditions</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Please read these terms carefully before utilizing the MCP Builder platform, 
              generation endpoints, and deployment infrastructure.
            </p>
          </div>

          {/* MAIN CARD */}
          <div 
            className="landing-card rounded-[2rem] p-8 md:p-12 border backdrop-blur-xl"
            style={{
              borderColor: 'var(--border-primary)',
              background: 'var(--bg-card)'
            }}
          >
            <div className="space-y-8">
              
              {/* SECTION 1 */}
              <div className="group transition-all duration-300 hover:translate-x-1">
                <h2 className="mb-3 text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  <span className="text-[10px] font-mono border px-2 py-0.5 rounded-full" style={{ borderColor: 'var(--border-accent)', color: 'var(--accent-primary)' }}>01</span>
                  Acceptance of Terms
                </h2>
                <p className="leading-relaxed text-sm" style={{ color: 'var(--text-secondary)' }}>
                  By accessing, deploying to, or interacting with MCP Builder, you agree to comply
                  with these Terms & Conditions. If you do not agree with any portion of these terms,
                  please discontinue use of the platform and delete your generated infrastructure immediately.
                </p>
              </div>

              <div className="h-[1px] w-full" style={{ background: 'var(--border-primary)' }} />

              {/* SECTION 2 */}
              <div className="group transition-all duration-300 hover:translate-x-1">
                <h2 className="mb-3 text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  <span className="text-[10px] font-mono border px-2 py-0.5 rounded-full" style={{ borderColor: 'var(--border-accent)', color: 'var(--accent-primary)' }}>02</span>
                  Platform Usage
                </h2>
                <p className="leading-relaxed text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  MCP Builder provides automated tools for scaffolding, constructing, compiling, 
                  and hosting Model Context Protocol (MCP) servers, ingestion modules, and knowledge pipelines.
                </p>
                <div 
                  className="rounded-xl border p-5 font-mono text-[11px] space-y-2.5" 
                  style={{ background: 'rgba(255, 255, 255, 0.01)', borderColor: 'var(--border-primary)', color: 'var(--text-secondary)' }}
                >
                  <div className="flex gap-2.5 items-start">
                    <span style={{ color: 'var(--accent-primary)' }}>→</span>
                    <span>Do not overload or abuse shared build container resources.</span>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <span style={{ color: 'var(--accent-primary)' }}>→</span>
                    <span>Do not submit, ingest, or pipeline malware or copyrighted materials.</span>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <span style={{ color: 'var(--accent-primary)' }}>→</span>
                    <span>Do not exploit the deployment runner or expose unauthorized microservices.</span>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <span style={{ color: 'var(--accent-primary)' }}>→</span>
                    <span>Abide by standard Claude developer policies and API quotas.</span>
                  </div>
                </div>
              </div>

              <div className="h-[1px] w-full" style={{ background: 'var(--border-primary)' }} />

              {/* SECTION 3 */}
              <div className="group transition-all duration-300 hover:translate-x-1">
                <h2 className="mb-3 text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  <span className="text-[10px] font-mono border px-2 py-0.5 rounded-full" style={{ borderColor: 'var(--border-accent)', color: 'var(--accent-primary)' }}>03</span>
                  User Content Responsibility
                </h2>
                <p className="leading-relaxed text-sm" style={{ color: 'var(--text-secondary)' }}>
                  You retain ownership of any inputs, schema configurations, code snippets, or database schemas 
                  you provide. However, you assert that you hold complete permission and license to ingest, index,
                  and process any content, documents, or websites connected to your MCP endpoints.
                </p>
              </div>

              <div className="h-[1px] w-full" style={{ background: 'var(--border-primary)' }} />

              {/* SECTION 4 */}
              <div className="group transition-all duration-300 hover:translate-x-1">
                <h2 className="mb-3 text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  <span className="text-[10px] font-mono border px-2 py-0.5 rounded-full" style={{ borderColor: 'var(--border-accent)', color: 'var(--accent-primary)' }}>04</span>
                  AI Outputs & Code Scaffolding
                </h2>
                <p className="leading-relaxed text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Code architectures, schemas, and endpoint responses generated by MCP Builder are generated 
                  by AI models (such as Claude 3.5 Sonnet). These templates are provided "as is" and should be 
                  rigorously reviewed and tested locally before being integrated into sensitive or production systems.
                </p>
              </div>

              <div className="h-[1px] w-full" style={{ background: 'var(--border-primary)' }} />

              {/* SECTION 5 */}
              <div className="group transition-all duration-300 hover:translate-x-1">
                <h2 className="mb-3 text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  <span className="text-[10px] font-mono border px-2 py-0.5 rounded-full" style={{ borderColor: 'var(--border-accent)', color: 'var(--accent-primary)' }}>05</span>
                  Platform Availability & Beta Disclaimer
                </h2>
                <p className="leading-relaxed text-sm" style={{ color: 'var(--text-secondary)' }}>
                  MCP Builder is currently in active Beta (v1.0). Features, hosted runners, and container templates
                  may be adjusted, rebuilt, or temporarily taken offline without prior notification. We make no
                  guarantee of persistent server uptimes during this development phase.
                </p>
              </div>

              <div className="h-[1px] w-full" style={{ background: 'var(--border-primary)' }} />

              {/* SECTION 6 */}
              <div className="group transition-all duration-300 hover:translate-x-1">
                <h2 className="mb-3 text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  <span className="text-[10px] font-mono border px-2 py-0.5 rounded-full" style={{ borderColor: 'var(--border-accent)', color: 'var(--accent-primary)' }}>06</span>
                  Privacy Policy & Data Sharding
                </h2>
                <p className="leading-relaxed text-sm" style={{ color: 'var(--text-secondary)' }}>
                  We handle vector embeddings, file uploads, and session details with top-tier security standards.
                  Please do not pipeline highly sensitive personal data or proprietary credentials into public vector databases
                  or non-encrypted database configurations.
                </p>
              </div>

              <div className="h-[1px] w-full" style={{ background: 'var(--border-primary)' }} />

              {/* SECTION 7 */}
              <div className="group transition-all duration-300 hover:translate-x-1">
                <h2 className="mb-3 text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  <span className="text-[10px] font-mono border px-2 py-0.5 rounded-full" style={{ borderColor: 'var(--border-accent)', color: 'var(--accent-primary)' }}>07</span>
                  Limitation of Liability
                </h2>
                <p className="leading-relaxed text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Under no circumstances shall MCP Builder, its founders, or contributors be held liable for any data loss,
                  infrastructure cost overruns, security vulnerabilities, or code defects arising from the use of 
                  servers created on this platform.
                </p>
              </div>

              <div className="h-[1px] w-full" style={{ background: 'var(--border-primary)' }} />

              {/* SECTION 8 */}
              <div className="group transition-all duration-300 hover:translate-x-1">
                <h2 className="mb-3 text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  <span className="text-[10px] font-mono border px-2 py-0.5 rounded-full" style={{ borderColor: 'var(--border-accent)', color: 'var(--accent-primary)' }}>08</span>
                  Modifications of Terms
                </h2>
                <p className="leading-relaxed text-sm" style={{ color: 'var(--text-secondary)' }}>
                  We reserve the right to revise these Terms & Conditions at any point. Your continued usage of 
                  MCP Builder signifies your acceptance of the updated legal specifications.
                </p>
              </div>

            </div>

            {/* MINI CARD FOOTER */}
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-[#FF4081]">
                  MCP Builder Core System
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Enabling fluid context ingestion & tools for AI models.
                </p>
              </div>
              <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                Last updated: May 2026
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </main>
  )
}