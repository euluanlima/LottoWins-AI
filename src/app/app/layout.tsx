import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import ThemeToggle from '@/components/ThemeToggle';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Lotto Wins AI - Previsões Inteligentes para Loteria',
  description: 'Sistema avançado de previsão de números para jogos de loteria com análise matemática e estatística',
  keywords: 'loteria, previsão, números da sorte, powerball, mega millions, análise estatística',
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.variable} antialiased min-h-screen text-base`}> {/* Added text-base for potential global font size increase later */}
        {/* Changed defaultTheme to "light" */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <div className="flex flex-col min-h-screen">
            {/* Simplified Header */}
            <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/90 border-b shadow-sm">
              <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo and Title */}
                <div className="flex items-center gap-3">
                  {/* Increased size of the logo ball */}
                  <div className="lottery-ball w-10 h-10 text-lg lottery-ball-high text-white flex items-center justify-center font-semibold">LW</div>
                  {/* Increased size and simplified title style */}
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Lotto Wins AI
                  </h1>
                </div>
                {/* Removed old nav and mobile menu button */}
                {/* Keep Theme Toggle */}
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                </div>
              </div>
            </header>
            {/* Main content area will now include tab navigation and content */}
            <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </main>
            {/* Simplified Footer */}
            <footer className="border-t py-6 bg-background/90 backdrop-blur-md mt-8">
              <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} Lotto Wins AI. Todos os direitos reservados.</p>
                <p className="mt-1">Análise matemática avançada para previsão de números de loteria.</p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

