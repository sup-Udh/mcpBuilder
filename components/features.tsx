const features = [
  {
    title: "Semantic Search",
    description:
      "Vector embeddings allow Claude to retrieve meaning, not just keywords.",
    image: "/semantic.png",
  },
  {
    title: "Cloudflare Deployment",
    description:
      "Generated MCP servers deploy globally in seconds.",
    image: "/cloudflare.png",
  },
  {
    title: "PDF + Docs Support",
    description:
      "Ingest technical docs, PDFs, RSS feeds, and websites.",
    image: "/docs.png",
  },
  {
    title: "No-Code Pipeline",
    description:
      "Build production MCP infrastructure without writing backend code.",
    image: "/nocode.png",
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

            {/* ICON */}
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">

              <img
                src={feature.image}
                alt={feature.title}
                className="h-6 w-6 object-contain"
              />

            </div>

            {/* TITLE */}
            <h3 className="mb-4 text-2xl font-semibold">
              {feature.title}
            </h3>

            {/* DESCRIPTION */}
            <p className="text-white/60">
              {feature.description}
            </p>

          </div>
        ))}

      </div>
    </section>
  )
}