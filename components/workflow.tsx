const steps = [
  {
    title: "Paste URL",
    description:
      "Provide any source of knowledge, from docs to PDFs.",
    icon: "🔗",
  },
  {
    title: "Extract Content",
    description:
      "Our scraper parses and cleans technical data automatically.",
    icon: "📄",
  },
  {
    title: "Generate Server",
    description:
      "AI creates the necessary MCP tool handlers for you.",
    icon: "⚙️",
  },
  {
    title: "Connect Claude",
    description:
      "Instantly use your new knowledge tools in Claude or Cursor.",
    icon: "🤖",
  },
]

export default function Workflow() {
  return (
    <section className="mx-auto mb-40 max-w-7xl px-6">

      {/* HEADING */}
      <div className="mb-20 text-center">
        <h2 className="text-5xl font-bold tracking-tight">
          The Path to Instant AI Tools
        </h2>

        <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-blue-500" />
      </div>

      {/* STEPS */}
      <div className="grid gap-12 md:grid-cols-4">

        {steps.map((step, index) => (
          <div
            key={index}
            className="group relative text-center"
          >

            {/* ICON */}
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-4xl transition-all duration-500 group-hover:scale-110 group-hover:border-blue-500/50">
              {step.icon}
            </div>

            {/* TITLE */}
            <h3 className="mb-3 text-2xl font-semibold">
              {step.title}
            </h3>

            {/* DESCRIPTION */}
            <p className="text-white/60">
              {step.description}
            </p>

            {/* CONNECTOR */}
            {index !== steps.length - 1 && (
              <div className="absolute left-[70%] top-12 hidden h-[2px] w-[60%] bg-gradient-to-r from-blue-500/40 to-transparent md:block" />
            )}

          </div>
        ))}

      </div>
    </section>
  )
}