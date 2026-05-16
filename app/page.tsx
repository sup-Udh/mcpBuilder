import Navbar from "../components/navbar"
import Hero from "../components/hero"

import Centerpiece from "../components/centerpiece"
import Workflow from "../components/workflow"
import Features from "../components/features"
import Footer from "../components/footer"

export default function HomePage() {
  return (
    <main className="bg-[#020617] text-white overflow-hidden">
      <Navbar />

      <div className="pt-24">
        <Hero />
        <Centerpiece />
        <Workflow />
        <Features />
      </div>

      <Footer />
    </main>
  )
}