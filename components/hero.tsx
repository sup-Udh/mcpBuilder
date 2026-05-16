import GlowButton from "./ui/glow-button"

export default function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-32 text-center">

      {/* Badge */}
      <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
        <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />

        <span className="text-sm uppercase tracking-wide text-white/70">
          Claude Desktop Support
        </span>
      </div>

      {/* Heading */}
      <h1 className="mx-auto max-w-5xl text-6xl font-bold tracking-tight md:text-7xl">
        Build MCP Servers
        <br />
        Without Writing MCP Code
      </h1>

      {/* Description */}
      <p className="mx-auto mt-8 max-w-2xl text-lg text-white/60">
        Turn websites, docs, PDFs, and knowledge bases into AI-ready MCP
        servers for Claude and Cursor in minutes.
      </p>


      {/* Buttons */}
      <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
      <GlowButton>

        <button className="rounded-lg bg-blue-500 px-8 py-4 font-semibold text-black transition hover:scale-105">
          Generate MCP Server
        </button>
            </GlowButton>

        <button className="rounded-lg border border-white/10 px-8 py-4 text-white transition hover:bg-white/5">
          View Demo
        </button>
      </div>
    </section>
  )
}