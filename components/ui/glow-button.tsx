"use client"

import Link from "next/link"

export default function GlowButton({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Link href="/login">
      <button
        className="group relative cursor-pointer overflow-hidden rounded-xl px-8 py-3.5 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(var(--accent-rgb),0.2)] active:scale-[0.98]"
        style={{
          background: 'var(--gradient-primary)',
          boxShadow: '0 2px 10px rgba(var(--accent-rgb), 0.12)',
        }}
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </button>
    </Link>
  )
}