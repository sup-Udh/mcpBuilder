"use client"

export default function AnimatedGrid() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* GRID */}
      <div
        className="
          absolute inset-0
          bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]
          bg-[size:50px_50px]
          opacity-70
        "
      />

      {/* GRADIENT FADE */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-primary)]" />

      {/* GLOW ORB 1 */}
      <div className="absolute left-[-10%] top-[10%] h-[500px] w-[500px] rounded-full bg-[var(--gradient-glow-1)] blur-[120px]" />

      {/* GLOW ORB 2 */}
      <div className="absolute right-[-10%] bottom-[10%] h-[500px] w-[500px] rounded-full bg-[var(--gradient-glow-3)] blur-[120px]" />
    </div>
  )
}