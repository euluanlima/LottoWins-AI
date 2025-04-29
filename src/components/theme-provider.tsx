
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Removendo a definição local de ThemeProviderProps e a tipagem explícita
export function ThemeProvider({ children, ...props }: { children: React.ReactNode; [key: string]: any }) {
  // Passando as props diretamente para NextThemesProvider
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

