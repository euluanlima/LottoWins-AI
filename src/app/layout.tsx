
import type { Metadata } from 'next'
// Import Manrope font
import { Manrope } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import ThemeToggle from '@/components/ThemeToggle';
import Image from 'next/image'; // Import Image for the logo

// Configure Manrope font
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope', // Define CSS variable
  weight: ['400', '600', '700'] // Specify weights used in reference
})

export const metadata: Metadata = {
  title: 'LottoWins AI - Previsões Inteligentes para Loteria',
  description: 'Sistema avançado de previsão de números para jogos de loteria com análise matemática e estatística',
  keywords: 'loteria, previsão, números da sorte, powerball, mega millions, análise estatística',
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // Apply Manrope font class to html tag
    <html lang="pt-BR" className={`${manrope.variable} font-sans`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      {/* Remove padding from body here, apply within ThemeProvider div */}
      <body className={`antialiased min-h-screen bg-background text-foreground`}>
        {/* Set defaultTheme to dark based on reference */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {/* Add padding here to match reference body padding */}
          <div className="flex flex-col min-h-screen p-6"> {/* Added p-6 based on reference body padding */}
            {/* Header with centered Logo and right-aligned toggle */}
            <header className="relative flex justify-center items-center pb-6"> {/* Centered header */}
              {/* Use the new LottoWins AI Logo */}
              <div className="flex-1 flex justify-center"> {/* Centering container */}
                <Image 
                  src="/logos/lottowins-ai-logo.png" 
                  alt="LottoWins AI Logo" 
                  width={180} // Adjust width as needed
                  height={50} // Adjust height as needed
                  priority
                />
              </div>
              {/* Position ThemeToggle absolutely on the right */}
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                <ThemeToggle />
              </div>
            </header>
            
            {/* Main content area */}
            <main className="flex-1 w-full">
              {children}
            </main>
            
            {/* Simplified Footer */}
            <footer className="pt-8 mt-8 border-t border-border/50">
              <div className="text-center text-xs text-muted">
                <p>© {new Date().getFullYear()} LottoWins AI. Todos os direitos reservados.</p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

