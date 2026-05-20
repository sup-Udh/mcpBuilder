import Sidebar from "../../components/dashboard/sidebar"
import TopNavbar from "../../components/dashboard/top-navbar"
import FloatingButton from "../../components/dashboard/floating-button"

export default function DashboardPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] text-white">

      <Sidebar />

      <TopNavbar />

      {/* MAIN CONTENT */}
      <div className="ml-64 mt-16 h-[calc(100vh-64px)] overflow-y-auto">

        <div className="relative flex min-h-full flex-col overflow-hidden">

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

          {/* GLOWS */}
          <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[140px]" />

          <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[140px]" />

          {/* CONTENT */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16">

            {/* ICON */}
            <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_0_40px_rgba(59,130,246,0.08)] backdrop-blur-xl">

              <span className="material-symbols-outlined text-6xl text-blue-200">
                dns
              </span>

            </div>

            {/* TITLE */}
            <h1 className="mb-4 text-center text-5xl font-bold tracking-tight">

              No MCP Servers Yet

            </h1>

            {/* SUBTEXT */}
            <p className="mb-12 max-w-2xl text-center text-lg leading-relaxed text-white/50">

              Create your first MCP server to begin ingesting websites,
              documentation, PDFs, and AI context sources into your
              infrastructure runtime.

            </p>

            {/* ACTIONS */}
            <div className="flex flex-wrap items-center justify-center gap-4">

              {/* PRIMARY */}
              <button className="flex items-center gap-3 rounded-2xl bg-blue-200 px-8 py-4 font-semibold text-[#020617] shadow-[0_0_35px_rgba(173,198,255,0.25)] transition hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]">

                <span className="material-symbols-outlined">
                  add
                </span>

                Create MCP Server

              </button>

              {/* SECONDARY */}
              <button className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-4 text-white/70 backdrop-blur-xl transition hover:border-blue-300/20 hover:bg-white/[0.05] hover:text-white active:scale-[0.98]">

                <span className="material-symbols-outlined">
                  auto_awesome
                </span>

                View Documentation

              </button>

            </div>

            {/* INFO CARDS */}
            <div className="mt-20 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">

              {/* CARD 1 */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">

                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-400/10">

                  <span className="material-symbols-outlined text-3xl text-blue-200">
                    language
                  </span>

                </div>

                <h3 className="mb-2 text-xl font-semibold">
                  Website Ingestion
                </h3>

                <p className="leading-relaxed text-white/50">

                  Crawl websites and automatically transform them into
                  searchable AI-ready context.

                </p>

              </div>

              {/* CARD 2 */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">

                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-400/10">

                  <span className="material-symbols-outlined text-3xl text-violet-200">
                    picture_as_pdf
                  </span>

                </div>

                <h3 className="mb-2 text-xl font-semibold">
                  Document Parsing
                </h3>

                <p className="leading-relaxed text-white/50">

                  Ingest PDFs, docs, and markdown files with automatic
                  chunking and semantic indexing.

                </p>

              </div>

              {/* CARD 3 */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">

                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10">

                  <span className="material-symbols-outlined text-3xl text-cyan-200">
                    hub
                  </span>

                </div>

                <h3 className="mb-2 text-xl font-semibold">
                  MCP Runtime
                </h3>

                <p className="leading-relaxed text-white/50">

                  Deploy scalable MCP infrastructure with integrated vector
                  search and runtime orchestration.

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      <FloatingButton />

      {/* MATERIAL ICONS */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />

    </main>
  )
}