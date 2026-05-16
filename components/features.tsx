const features = [
  {
    title: "Semantic Search",
    description:
      "Vector embeddings allow Claude to retrieve meaning, not just keywords.",
  },
  {
    title: "Cloudflare Deployment",
    description:
      "Generated MCP servers deploy globally in seconds.",
  },
  {
    title: "PDF + Docs Support",
    description:
      "Ingest technical docs, PDFs, RSS feeds, and websites.",
  },
  {
    title: "No-Code Pipeline",
    description:
      "Build production MCP infrastructure without writing backend code.",
  },
]

export default function Features() {
  return (
    <section className="mx-auto mb-40 max-w-7xl px-6">

      <div className="mb-20 text-center">
        <h2 className="text-5xl font-bold tracking-tight">
          Built for AI Infrastructure
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
          Everything needed to transform knowledge into AI-native tooling.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">

        {features.map((feature, index) => (
          <div
            key={index}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-all hover:border-blue-500/40 hover:bg-white/[0.05]"
          >

            <div className="mb-5 h-12 w-12 rounded-xl bg-blue-500/10" />

            <h3 className="mb-4 text-2xl font-semibold">
              {feature.title}
            </h3>

            <p className="text-white/60">
              {feature.description}
            </p>

          </div>
        ))}

      </div>
    </section>
  )
}