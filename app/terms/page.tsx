"use client"

export default function TermsPage() {
  return (
    <main className="relative min-h-screen  bg-[#020617] text-white">

      {/* GRID BACKGROUND */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundSize: "40px 40px",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
          maskImage:
            "radial-gradient(circle at center, black, transparent 80%)",
        }}
      />

      {/* GLOW EFFECTS */}
      <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[140px]" />

      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[140px]" />

      {/* CONTENT */}
      <section className="relative z-10 px-6 py-20">

        <div className="mx-auto max-w-5xl">

          {/* HEADER */}
          <div className="mb-16">

            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-blue-200/50">
              LEGAL
            </p>

            <h1 className="text-5xl font-bold tracking-tight">
              Terms & Conditions
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/50">
              Please read these terms carefully before using MCP Builder
              and its infrastructure services.
            </p>

          </div>

          {/* CARD */}
          <div className="rounded-[2rem] border border-white/10 bg-[#0B1120]/70 p-10 backdrop-blur-xl">

            <div className="space-y-10">

              {/* SECTION */}
              <div>

                <h2 className="mb-4 text-2xl font-semibold">
                  1. Acceptance of Terms
                </h2>

                <p className="leading-relaxed text-white/60">
                  By accessing or using MCP Builder, you agree to comply
                  with these Terms & Conditions. If you do not agree with
                  these terms, please discontinue use of the platform.
                </p>

              </div>

              {/* SECTION */}
              <div>

                <h2 className="mb-4 text-2xl font-semibold">
                  2. Platform Usage
                </h2>

                <p className="leading-relaxed text-white/60">
                  MCP Builder provides tooling for creating, managing,
                  and deploying MCP infrastructure, ingestion runtimes,
                  vector pipelines, and AI-ready knowledge systems.
                </p>

                <ul className="mt-5 space-y-3 text-white/60">

                  <li>
                    • Do not abuse infrastructure resources
                  </li>

                  <li>
                    • Do not upload malicious or illegal content
                  </li>

                  <li>
                    • Do not attempt unauthorized access
                  </li>

                  <li>
                    • Respect platform stability and security
                  </li>

                </ul>

              </div>

              {/* SECTION */}
              <div>

                <h2 className="mb-4 text-2xl font-semibold">
                  3. User Content
                </h2>

                <p className="leading-relaxed text-white/60">
                  You are responsible for all documents, URLs, files,
                  and external sources connected to MCP Builder.
                  You confirm that you have permission to ingest and
                  process such content.
                </p>

              </div>

              {/* SECTION */}
              <div>

                <h2 className="mb-4 text-2xl font-semibold">
                  4. AI Generated Outputs
                </h2>

                <p className="leading-relaxed text-white/60">
                  MCP Builder may generate embeddings, summaries,
                  semantic search results, and AI-assisted outputs.
                  These results may occasionally contain inaccuracies
                  and should be reviewed before production usage.
                </p>

              </div>

              {/* SECTION */}
              <div>

                <h2 className="mb-4 text-2xl font-semibold">
                  5. Availability
                </h2>

                <p className="leading-relaxed text-white/60">
                  Services may be updated, modified, or temporarily
                  unavailable during development, maintenance,
                  or infrastructure upgrades.
                </p>

              </div>

              {/* SECTION */}
              <div>

                <h2 className="mb-4 text-2xl font-semibold">
                  6. Privacy
                </h2>

                <p className="leading-relaxed text-white/60">
                  We aim to handle data responsibly and securely.
                  Users should avoid uploading highly sensitive
                  information unless necessary.
                </p>

              </div>

              {/* SECTION */}
              <div>

                <h2 className="mb-4 text-2xl font-semibold">
                  7. Limitation of Liability
                </h2>

                <p className="leading-relaxed text-white/60">
                  MCP Builder is provided “as available” without
                  guarantees or warranties. We are not liable for
                  service interruptions, AI inaccuracies, or
                  infrastructure-related issues.
                </p>

              </div>

              {/* SECTION */}
              <div>

                <h2 className="mb-4 text-2xl font-semibold">
                  8. Changes to Terms
                </h2>

                <p className="leading-relaxed text-white/60">
                  These terms may be updated periodically.
                  Continued use of the platform means you accept
                  the latest version of the Terms & Conditions.
                </p>

              </div>

            </div>

            {/* FOOTER */}
            <div className="mt-16 border-t border-white/10 pt-8">

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>

                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-blue-200/50">
                    MCP Builder
                  </p>

                  <p className="mt-2 text-sm text-white/40">
                    Infrastructure for AI-ready context systems.
                  </p>

                </div>
              

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  )
}