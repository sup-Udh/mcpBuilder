"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="relative border-t py-12 lg:py-16" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-secondary)' }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-12 items-start mb-12">
          
          {/* BRAND COLUMN */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-tr from-[#FF6B35] via-[#FF4081] to-[#7C4DFF] p-[1.5px]">
                <div className="h-full w-full rounded-[6px] flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
                  <span className="material-symbols-outlined text-[15px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF4081]">
                    polymer
                  </span>
                </div>
              </div>
              <span className="text-lg font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                MCP <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4081] to-[#FF6B35]">Builder</span>
              </span>
            </Link>
            <p className="text-sm max-w-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Handcrafted infrastructure orchestration. Build, deploy, and index dynamic Model Context Protocol servers in seconds.
            </p>
          </div>

          {/* COLUMN 2: PRODUCT */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Product</h4>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>
                <a href="#features" className="hover:text-[var(--text-primary)] transition-colors duration-200">Features</a>
              </li>
              <li>
                <a href="#pipeline" className="hover:text-[var(--text-primary)] transition-colors duration-200">Pipeline Flow</a>
              </li>
              <li>
                <a href="#ecosystem" className="hover:text-[var(--text-primary)] transition-colors duration-200">Ecosystem</a>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: RESOURCES */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Legal</h4>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>
                <Link href="/terms" className="hover:text-[var(--text-primary)] transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <span style={{ color: 'var(--text-muted)', opacity: 0.5 }}>Privacy Policy (soon)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--border-primary)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © 2026 MCP Builder. Crafted for the intelligence epoch.
          </p>
          <div className="flex gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="transition-colors" style={{ color: 'var(--text-secondary)' }}>
              <span className="material-symbols-outlined text-[18px] hover:text-[var(--text-primary)]">terminal</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}