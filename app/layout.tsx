import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Newspaper } from "lucide-react"
import Link from "next/link"
import { SearchNews } from "./search-news"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI News Agent",
  description: "AI-powered news generation and management",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
              <Link href="/" className="flex items-center space-x-2 px-4">
                <Newspaper className="h-6 w-6" />
                <span className="font-bold tracking-wide text-xl">AI News Agent</span>
              </Link>
              <div className="flex-1 flex items-center justify-end px-4">
                <SearchNews />
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  )
}

