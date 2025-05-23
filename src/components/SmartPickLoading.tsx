
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
// import { motion, AnimatePresence } from 'framer-motion'; // Temporarily remove framer-motion

// Define the messages to cycle through
const messages = [
  '🔍 IA buscando previsões...',
  '⏳ Aguarde um instante...',
  '🧠 Processando números...',
  '✅ Pronto!',
];

const SmartPickLoading: React.FC = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showNumbers, setShowNumbers] = useState(false);

  useEffect(() => {
    // Reset state when component mounts (in case it's reused)
    setCurrentMessageIndex(0);
    setShowNumbers(false);

    // Timer to cycle through messages
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= messages.length) {
          clearInterval(interval); // Stop interval when messages end
          setShowNumbers(true); // Show numbers after the last message
          return messages.length - 1; // Stay on the last message
        }
        return nextIndex;
      });
    }, 1800); // Interval from reference HTML script

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    // Mimic body styles from reference HTML for centering
    <div className="flex flex-col items-center justify-center p-5 min-h-[300px]">
      {/* Loader Glow - Removed Framer Motion */}
      <div 
        className="loader-glow w-[110px] h-[110px] rounded-full bg-transparent shadow-[0_0_20px_rgba(139,92,246,0.4),_0_0_40px_rgba(0,255,224,0.15)] flex items-center justify-center mb-6 relative overflow-hidden bg-transparent"
        // Removed animation props
      >
        {/* Use the transparent logo - Added bg-transparent to ensure no default background */}
        <Image 
          src="/logos/lottowins-ai-logo-transparent.png" // Use the transparent logo path
          alt="LottoWins AI Logo" 
          width={70} // Adjust size to fit nicely within the circle
          height={70} 
          className="object-contain bg-transparent z-10 bg-transparent" // Ensure image is on top and background is transparent
        />
      </div>

      {/* Message Wrapper - Removed Animation */}
      <div className="message-wrapper min-h-[28px] mb-8">
        {/* Removed AnimatePresence */}
          <div
            key={currentMessageIndex} // Keep key for React updates
            // Removed animation props
            className="loading-text text-xl text-center text-muted"
          >
            {messages[currentMessageIndex]}
          </div>
        {/* Removed AnimatePresence */}
      </div>

      {/* Numbers - Conditionally display */}
      {showNumbers && (
        <div className="numbers text-3xl font-bold tracking-[8px] text-accent animate-fadein">
          {/* Placeholder numbers - Real numbers will be shown when loading finishes */}
          -- • -- • -- • -- • --
        </div>
      )}
    </div>
  );
};

export default SmartPickLoading;

