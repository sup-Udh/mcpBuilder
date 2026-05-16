export default function AnimatedGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">

      {/* GRID */}
      <div
        className="
          absolute inset-0
          bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)]
          bg-[size:40px_40px]
        "
      />

      {/* GRADIENT FADE */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020617]" />

      {/* GLOW ORB 1 */}
      <div className="absolute left-[-10%] top-[10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />

      {/* GLOW ORB 2 */}
      <div className="absolute right-[-10%] bottom-[10%] h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-3xl" />

    </div>
  )
}