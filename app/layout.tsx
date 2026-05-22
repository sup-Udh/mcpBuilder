import type { Metadata } from "next"
import {
  Inter,
  Manrope,
} from "next/font/google"
import { Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/lib/theme-context"
import GlobalDisclaimer from "@/components/global-disclaimer"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://mcpbuilder.dev"),
  title: "MCP Builder | No-Code AI-Native Infrastructure",
  description:
    "Turn developer portals, API documentation, PDFs, and data streams into dynamic, deployment-ready Model Context Protocol (MCP) servers. Instantly expand the capabilities of Cursor, Claude, and custom agent teams.",
  keywords: [
    "MCP",
    "Model Context Protocol",
    "AI Agents",
    "Cloudflare Workers",
    "Developer Tools",
    "No-Code",
    "AI Infrastructure",
    "Cursor",
    "Claude Desktop",
  ],
  openGraph: {
    title: "MCP Builder | No-Code AI-Native Infrastructure",
    description:
      "Turn developer portals, API documentation, PDFs, and data streams into dynamic, deployment-ready Model Context Protocol (MCP) servers. Instantly expand the capabilities of Cursor, Claude, and custom agent teams.",
    url: "https://mcpbuilder.dev",
    siteName: "MCP Builder",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MCP Builder - Build intelligent MCP Infrastructure without writing code.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MCP Builder | No-Code AI-Native Infrastructure",
    description:
      "Turn developer portals, API documentation, PDFs, and data streams into dynamic, deployment-ready Model Context Protocol (MCP) servers. Instantly expand the capabilities of Cursor, Claude, and custom agent teams.",
    images: ["/og-image.png"],
    creator: "@mcpbuilder",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      data-scroll-behavior="smooth"
      className={`
        ${inter.variable}
        ${manrope.variable}
        ${geistMono.variable}
        antialiased
      `}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>

      <body className="min-h-screen overflow-x-hidden">
        <ThemeProvider>
          {children}
          <GlobalDisclaimer />
        </ThemeProvider>
      </body>
    </html>
  )
}