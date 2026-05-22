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
  title: "MCP Builder",
  description:
    "Build, deploy, and manage AI-native MCP infrastructure",
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
          <GlobalDisclaimer />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}