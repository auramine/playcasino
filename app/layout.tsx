import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DebugPanel } from "@/components/debug-panel"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PlayCasino - Virtual Casino Games",
  description: "Play casino games with virtual currency. No real money involved.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-background to-background/90`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
              <Footer />
            </div>
            <DebugPanel />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'