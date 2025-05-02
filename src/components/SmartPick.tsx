
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
// import { motion, AnimatePresence } from 'framer-motion'; // Temporarily remove framer-motion
import { Loader2 } from 'lucide-react';
import SmartPickLoading from './SmartPickLoading'; // Assuming this exists for loading animation

// Interface for the prediction data fetched from the API
interface Prediction {
  numbers: number[];
  megaBall: number; // Assuming Mega Millions for now
  confidence: 'Alta' | 'Média' | 'Baixa';
}

// Helper function to map confidence level to text and style (similar to original)
const getConfidenceStyle = (level: 'Alta' | 'Média' | 'Baixa') => {
  switch (level) {
    case 'Alta':
      return { text: 'Confiança Alta', style: 'bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400' }; 
    case 'Média':
      return { text: 'Confiança Média', style: 'bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' };
    case 'Baixa':
      return { text: 'Confiança Baixa', style: 'bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400' };
    default:
      return { text: 'N/A', style: 'bg-muted text-muted-foreground' }; // Fallback
  }
};

// Define props for the component
interface SmartPickComponentProps {
  lotteryId: string;
}

// Mock LotteryInfo structure based on original usage (replace with actual if available)
interface LotteryInfo {
  name: string;
  maxRegularNumber: number;
}

// Mock getLotteryInfo function (replace with actual if available)
const getLotteryInfo = (id: string): LotteryInfo | null => {
  if (id === 'mega-millions') {
    return { name: 'Mega Millions', maxRegularNumber: 70 };
  }
  if (id === 'powerball') {
    return { name: 'Powerball', maxRegularNumber: 69 };
  }
   if (id === 'cash4life') {
    return { name: 'Cash4Life', maxRegularNumber: 60 };
  }
  return null;
};

export default function SmartPickComponent({ lotteryId }: SmartPickComponentProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false); // For button animation
  const [error, setError] = useState<string | null>(null);
  const [showEffects, setShowEffects] = useState(false); // For sound/visual effects
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Get static lottery info (mocked for now)
  const lotteryInfo = getLotteryInfo(lotteryId);

  // Fetch predictions from the API (adapted from current version)
  const fetchPredictions = useCallback(async (numCombinations = 3) => { // Fetch 3 like original
    setIsLoading(true);
    setIsGenerating(true); // Show loading state on button too
    setError(null);
    try {
      const response = await fetch(`/api/predict?num=${numCombinations}`);
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData: unknown = await response.json();
          if (typeof errorData === 'object' && errorData !== null && 'error' in errorData && typeof errorData.error === 'string') {
            errorMessage = errorData.error;
          } else {
            console.warn('API error response format unexpected:', errorData);
          }
        } catch (jsonError) {
          console.error('Failed to parse error response JSON:', jsonError);
        }
        throw new Error(errorMessage);
      }
      const data: Prediction[] = await response.json();
      setPredictions(data);
      
      // Play sound and show effects (from original)
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.error("Error playing sound:", e));
      }
      setShowEffects(true);
      setTimeout(() => setShowEffects(false), 3000);

    } catch (e) {
      console.error("Failed to fetch predictions:", e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred while fetching predictions.');
      setPredictions([]); // Clear predictions on error
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  }, [lotteryId]); // Added lotteryId dependency

  // Fetch predictions on initial mount and when lotteryId changes
  useEffect(() => {
    fetchPredictions(3);
  }, [fetchPredictions]); // Use fetchPredictions as dependency

  // Preload audio effect (from original)
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/effects/money-sound.mp3");
      audioRef.current.preload = "auto";
    }
  }, []);

  // Handle generate new picks button click
  const handleGenerateNewPicks = () => {
    fetchPredictions(3); // Fetch 3 new predictions
  };

  // Logo paths (from original)
  const logoPaths: { [key: string]: { path: string; width: number; height: number } } = {
    'mega-millions': { path: '/logos/mega-millions-logo-large.png', width: 400, height: 110 },
    'powerball': { path: '/logos/powerball-logo-large.png', width: 400, height: 110 },
    'cash4life': { path: '/logos/cash4life-logo-large.png', width: 320, height: 90 },
  };
  const currentLogo = logoPaths[lotteryId];

  // Loading state (similar to original, simplified)
  if (isLoading && predictions.length === 0 && !error) {
    return (
      <div className="container max-w-[1100px] mx-auto bg-surface rounded-[var(--radius)] p-6 md:p-8 shadow-[0_0_80px_rgba(0,255,224,0.04)] flex justify-center items-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  // Error state (using current error message)
  if (error) {
    return (
      <div className="container max-w-[1100px] mx-auto bg-surface rounded-[var(--radius)] p-6 md:p-8 shadow-[0_0_80px_rgba(0,255,224,0.04)]">
        <h2 className="text-xl font-semibold text-red-500 text-center">Erro ao Carregar Previsões</h2>
        <p className="text-muted-foreground text-center mt-2">{error}</p> 
      </div>
    );
  }

  // No data state (if API returns empty or info is missing)
  if (!lotteryInfo) { // Removed !predictions check, handled by loading/error
    return (
        <div className="container max-w-[1100px] mx-auto bg-surface rounded-[var(--radius)] p-6 md:p-8 shadow-[0_0_80px_rgba(0,255,224,0.04)]">
            <p className="text-lg text-muted-foreground text-center">Informações da loteria {lotteryId} não disponíveis.</p>
        </div>
    ); 
  }

  return (
    // Structure from original, styles adapted slightly
    <div className="container max-w-[1100px] mx-auto bg-surface rounded-[var(--radius)] p-5 md:p-6 shadow-[0_0_80px_rgba(0,255,224,0.04)] text-foreground">
      {/* Header with Logo (from original) */}
      <header className="text-center mb-6 md:mb-8">
        {currentLogo && (
          <div className="flex justify-center mb-4 h-[120px] md:h-[140px]">
            <Image 
              src={currentLogo.path} 
              alt={lotteryInfo?.name ? `${lotteryInfo.name} Logo` : "Lottery Logo"} 
              width={currentLogo.width}
              height={currentLogo.height}
              className="object-contain max-h-full bg-transparent mix-blend-normal"
              priority
              unoptimized 
            />
          </div>
        )}
      </header>

      {/* Heat Map Section REMOVED - Data not available from current Python script */}
      {/* <section className="section mb-6 md:mb-8"> ... </section> */}
      
      {/* Combinations Section (structure from original, data from API) */}
      <section className="section mb-6 md:mb-8">
        <div className="section-title text-lg md:text-xl font-semibold mb-4 md:mb-6 text-center text-primary">Combinações Sugeridas</div>
        {isGenerating && predictions.length === 0 ? ( // Show loading animation only when generating initially
          <SmartPickLoading />
        ) : predictions.length > 0 ? (
          <div className="combos grid gap-4 md:gap-5">
            {predictions.map((pred: Prediction, index: number) => {
              const confidenceStyle = getConfidenceStyle(pred.confidence);
              const mainNumbers = pred.numbers;
              const specialBall = pred.megaBall; // Assuming megaBall field from API

              return (
                <div // Replaced motion.div with div
                  key={`${index}-${mainNumbers.join("-")}-${specialBall}`}
                  className="combo-card bg-[var(--combo-card-bg)] rounded-[var(--radius)] p-4 md:p-5 px-5 md:px-7 flex flex-col sm:flex-row justify-between items-center sm:items-center gap-3 sm:gap-4 shadow-[0_0_16px_rgba(255,255,255,0.02)] border border-[var(--combo-card-border)]"
                  // initial={{ opacity: 0, y: 15 }} // Removed animation props
                  // animate={{ opacity: 1, y: 0 }}   // Removed animation props
                  // transition={{ duration: 0.3, delay: index * 0.1 }} // Removed animation props
                >
                  <div className="numbers flex flex-wrap gap-2 justify-center sm:justify-start items-center">
                    {/* Numbers Display (style from original) */}
                    {mainNumbers.map((num, i) => (
                       <div // Replaced motion.div with div
                         key={`combo-main-${i}`}
                         className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-black font-semibold text-sm hover-scale" // Kept hover-scale for potential CSS hover
                         // whileHover={{ scale: 1.15, rotate: 5 }} // Removed animation props
                         // transition={{ type: "spring", stiffness: 400, damping: 15 }} // Removed animation props
                       >
                         {num}
                       </div>
                    ))}
                    {/* Render Special Ball OUTSIDE the map loop */}
                    {specialBall !== undefined && (
                      <div // Replaced motion.div with div
                        key={`combo-special-${index}`}
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-black font-semibold text-sm ml-1 hover-scale ${lotteryId === "powerball" ? "bg-red-400" : "bg-yellow-400"}`} 
                        // whileHover={{ scale: 1.15, rotate: -5 }} // Removed animation props
                        // transition={{ type: "spring", stiffness: 400, damping: 15 }} // Removed animation props
                      >
                        {specialBall}
                      </div>
                    )}
                  </div>
                  {/* End of numbers div */}
                  {/* Confidence Level (style from original) */}
                  <span className={`confidence text-sm py-1.5 px-3 rounded-full bg-[var(--combo-confidence-bg)] ${confidenceStyle.style} whitespace-nowrap`}>
                    {confidenceStyle.text}
                  </span>
                </div> {/* Correct closing tag for the card motion.div */}
              );
            })}
          </div>
        ) : (
          // Display if loading finished but no predictions (and no error)
          <div className="text-center text-muted-foreground py-10">
             Nenhuma previsão disponível no momento.
             {error && <span className="block mt-2 text-destructive">Tente novamente mais tarde.</span>} 
          </div>
        )}
      </section>

      {/* Generate Button Section (style from original) */}
      <div className="relative mt-8 md:mt-10">
         {showEffects && (
          <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none overflow-hidden">
            {/* Placeholder for effects if needed */}
          </div>
        )}
        <button // Replaced motion.button with button
          onClick={handleGenerateNewPicks}
          disabled={isGenerating || isLoading} // Disable while loading or generating
          className={`btn block mx-auto text-sm md:text-base font-bold py-3.5 md:py-4 px-8 md:px-10 rounded-[var(--radius)] cursor-pointer transition-opacity duration-300 ease-in-out shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden ${isGenerating || isLoading ? "bg-muted" : "bg-primary text-primary-foreground animate-gradient-bg"}`}
          // whileHover={{ scale: 1.05, y: -2 }} // Removed animation props
          // whileTap={{ scale: 0.95 }} // Removed animation props
          // transition={{ type: "spring", stiffness: 300, damping: 20 }} // Removed animation props
        >
          {isGenerating ? (
             <span className="flex items-center justify-center">
               <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
               Gerando...
             </span>
          ) : (
            '✨ Gerar com Smart Pick AI'
          )}
        </button>
      </div>
    </div>
  );
}


