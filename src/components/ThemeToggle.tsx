
'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    // Render a placeholder or null during server rendering/hydration
    // Make placeholder smaller to match icon-only button
    return <div className="w-8 h-8 bg-muted/20 rounded-full"></div>; 
  }
  
  const isLight = theme === 'light';
  
  return (
    <button
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      // Minimalist styles: remove text, adjust padding, make it rounder/circular if desired
      className="text-lg bg-[#1e1e1e] dark:bg-[#1e1e1e] p-2 rounded-full flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
      aria-label={`Alternar para tema ${isLight ? 'escuro' : 'claro'}`}
      title={`Alternar para tema ${isLight ? 'escuro' : 'claro'}`}
    >
      {/* Only the icon */}
      <span>{isLight ? '☀️' : '🌙'}</span> 
      {/* Removed the text span */}
    </button>
  );
}

