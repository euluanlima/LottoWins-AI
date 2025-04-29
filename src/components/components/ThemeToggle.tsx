'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  const isLight = theme === 'light';
  
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      className="flex items-center justify-center p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 transition-colors"
      aria-label={`Alternar para tema ${isLight ? 'escuro' : 'claro'}`}
      title={`Alternar para tema ${isLight ? 'escuro' : 'claro'}`}
    >
      {isLight ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
      <span className="ml-2 text-sm font-medium hidden sm:inline">
        {isLight ? 'Modo Escuro' : 'Modo Claro'}
      </span>
    </motion.button>
  );
}
