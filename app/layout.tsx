import type { Metadata } from "next"
import {
  Geist,
  Geist_Mono,
} from "next/font/google"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "MCP Builder",
  description: "AI Infrastructure for the AI Generation",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        antialiased
      `}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen overflow-x-hidden bg-[#020617] text-white">
        {children}
      </body>
    </html>
  )
}