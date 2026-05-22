import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Features from "@/components/features"
import Workflow from "@/components/workflow"
import ConnectionEcosystem from "@/components/ecosystem"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <main 
      className="landing-theme min-h-screen relative overflow-hidden transition-colors duration-300 selection:bg-[#FF4081]/30 selection:text-white" 
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {/* CINEMATIC BACKGROUND SYSTEM */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Layer 1: Fine-mesh structure grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px] opacity-70" />
        
        {/* Layer 2: Subtle light grids alignment */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,107,53,0.07)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,64,129,0.05)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_90%,rgba(124,77,255,0.06)_0%,transparent_60%)]" />

        {/* Layer 3: Vignette for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#030008_100%)] opacity-90" />
      </div>

      {/* CORE NAVIGATION */}
      <Navbar />

      {/* PAGE SECTIONS */}
      <div className="relative z-10 pt-28 space-y-16 md:space-y-24">
        {/* Hero Area */}
        <Hero />

        {/* Core Capabilities Feature Grid */}
        <Features />

        {/* Ingestion Pipeline Staggered Steps */}
        <Workflow />

        {/* Connection Ecosystem Tactile Integration Docs */}
        <ConnectionEcosystem />
      </div>

      {/* FOOTER */}
      <Footer />
    </main>
  )
}