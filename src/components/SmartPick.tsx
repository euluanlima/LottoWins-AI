
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image'; // Import Image component
import { 
  PredictionData, 
  PredictionCombination, 
  LotteryInfo, 
  getLotteryInfo 
} from '@/lib/lottery';
import { usePredictionData } from '@/hooks/usePredictionData';
// Import the NEW loading component
import SmartPickLoading from './SmartPickLoading'; 

// Helper function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray<T>(array: T[]): T[] {
  let currentIndex = array.length, randomIndex;
  const newArray = [...array];
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex], newArray[currentIndex]];
  }
  return newArray;
}

// Define possible confidence levels
const confidenceLevels: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];

// Helper function to get a random confidence level
const getRandomConfidence = (): 'high' | 'medium' | 'low' => {
  return confidenceLevels[Math.floor(Math.random() * confidenceLevels.length)];
};

// Helper function to map confidence level to text and style using theme-aware classes or variables
const getConfidenceStyle = (level: 'high' | 'medium' | 'low') => {
  // Using theme-aware text/background colors. Adjust specifics if needed.
  switch (level) {
    case 'high':
      return { text: 'Confiança Alta', style: 'bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400' }; 
    case 'medium':
      return { text: 'Confiança Média', style: 'bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' };
    case 'low':
      return { text: 'Confiança Baixa', style: 'bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400' };
    default:
      return { text: 'N/A', style: 'bg-muted text-muted-foreground' }; // Fallback
  }
};

// Helper function to determine heat map class using NEW CSS variables
const getHeatClass = (num: number, predictionData: PredictionData | null): string => {
  const baseStyle = "ball h-11 w-11 md:h-12 md:w-12 rounded-full flex items-center justify-center font-semibold text-sm transition-transform duration-200 hover:scale-110"; // Increased mobile size (h-11 w-11)
  if (!predictionData) return `${baseStyle} bg-[var(--default-ball-bg)] text-[var(--default-ball-text)]`; // Default ball style
  if (predictionData.hotNumbers.includes(num)) return `${baseStyle} bg-[var(--hot)] shadow-[0_0_10px_var(--hot)] text-[var(--hot-text)]`; // Hot ball style
  if (predictionData.overdueNumbers.includes(num)) return `${baseStyle} bg-[var(--cold)] text-[var(--cold-text)]`; // Cold ball style
  return `${baseStyle} bg-[var(--neutral)] text-[var(--neutral-text)]`; // Neutral ball style
};

// Define props for the component
interface SmartPickComponentProps {
  lotteryId: string;
}

export default function SmartPickComponent({ lotteryId }: SmartPickComponentProps) {
  const { data: predictionData, loading, error, lotteryInfo } = usePredictionData(lotteryId); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [showEffects, setShowEffects] = useState(false);
  const [displayedCombinations, setDisplayedCombinations] = useState<PredictionCombination[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Function to set displayed combinations with random confidence
  const updateDisplayedCombinations = useCallback((combinationsSource: PredictionCombination[]) => {
    if (!combinationsSource || combinationsSource.length === 0) {
        setDisplayedCombinations([]);
        return;
    }
    const count = Math.min(3, combinationsSource.length); // Show 3 combos like reference
    const selected = combinationsSource.slice(0, count);
    const combinationsWithRandomConfidence = selected.map(pick => ({
      ...pick,
      confidence: getRandomConfidence(),
    }));
    setDisplayedCombinations(combinationsWithRandomConfidence);
  }, []);

  useEffect(() => {
    if (predictionData?.combinations) {
      updateDisplayedCombinations(predictionData.combinations);
    }
  }, [predictionData, updateDisplayedCombinations]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/effects/money-sound.mp3");
      audioRef.current.preload = "auto";
    }
  }, []);

  const handleGenerateNewPicks = useCallback(async () => {
    if (!predictionData?.combinations || predictionData.combinations.length === 0) return;
    setIsGenerating(true);
    setShowEffects(false);
    // Keep the delay to allow the loading animation to show
    await new Promise(resolve => setTimeout(resolve, 4000)); // Increased delay to match loading messages duration
    const shuffled = shuffleArray(predictionData.combinations);
    updateDisplayedCombinations(shuffled);
    setIsGenerating(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.error("Error playing sound:", e));
    }
    setShowEffects(true);
    setTimeout(() => setShowEffects(false), 3000);
  }, [predictionData, updateDisplayedCombinations]);

  // Find the correct large logo path based on lotteryId
  const logoPaths: { [key: string]: { path: string; width: number; height: number } } = {
    'mega-millions': { path: '/logos/mega-millions-logo-large.png', width: 400, height: 110 }, // Further increased size
    'powerball': { path: '/logos/powerball-logo-large.png', width: 400, height: 110 }, // Further increased size
    'cash4life': { path: '/logos/cash4life-logo-large.png', width: 320, height: 90 }, // Further increased size
  };
  const currentLogo = logoPaths[lotteryId];

  // Loading state
  if (loading && !predictionData) {
    return (
      <div className="container max-w-[1100px] mx-auto bg-surface rounded-[var(--radius)] p-6 md:p-8 shadow-[0_0_80px_rgba(0,255,224,0.04)] flex justify-center items-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container max-w-[1100px] mx-auto bg-surface rounded-[var(--radius)] p-6 md:p-8 shadow-[0_0_80px_rgba(0,255,224,0.04)]">
        <h2 className="text-xl font-semibold text-red-500 text-center">Erro ao Carregar Previsões</h2>
        <p className="text-muted text-center mt-2">{error}</p> 
      </div>
    );
  }

  // No data state
  if (!predictionData || !lotteryInfo) {
    return (
        <div className="container max-w-[1100px] mx-auto bg-surface rounded-[var(--radius)] p-6 md:p-8 shadow-[0_0_80px_rgba(0,255,224,0.04)]">
            <p className="text-lg text-muted text-center">Não há dados de previsão disponíveis para {lotteryId} no momento.</p>
        </div>
    ); 
  }

  const maxNumber = lotteryInfo.maxRegularNumber;

  return (
    <div className="container max-w-[1100px] mx-auto bg-surface rounded-[var(--radius)] p-5 md:p-6 shadow-[0_0_80px_rgba(0,255,224,0.04)] text-foreground"> {/* Reduced padding */}
      {/* Header with Even Larger Logo - Reduced Spacing & No Tagline */}
      <header className="text-center mb-6 md:mb-8"> {/* Reduced bottom margin */}
        {currentLogo && (
          <div className="flex justify-center mb-4 h-[120px] md:h-[140px]"> {/* Adjusted height for even larger logo */}
            <Image 
              src={currentLogo.path} 
              alt={lotteryInfo?.name ? `${lotteryInfo.name} Logo` : "Lottery Logo"} 
              width={currentLogo.width}
              height={currentLogo.height}
              className="object-contain max-h-full bg-transparent mix-blend-normal" // Added mix-blend-normal just in case
              priority
              unoptimized 
            />
          </div>
        )}
        {/* Tagline Removed */}
      </header>

      {/* Heat Map Section - Reduced Spacing */}
      <section className="section mb-6 md:mb-8"> {/* Reduced bottom margin */}
        <div className="section-title text-lg md:text-xl font-semibold mb-4 md:mb-6 text-center text-primary">Mapa de Calor</div>
        {/* Legend */}
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mb-4 md:mb-6 text-sm text-muted">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-1.5 bg-[var(--hot)]`}></div>
              <span>Quente</span>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-1.5 bg-[var(--neutral)]`}></div> 
              <span>Neutro</span>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-1.5 bg-[var(--cold)]`}></div>
              <span>Frio</span>
            </div>
        </div>
        {/* Heatmap Grid */}
        <div className="heatmap grid grid-cols-[repeat(auto-fit,minmax(40px,1fr))] gap-2 md:gap-3">
          {Array.from({ length: maxNumber }, (_, i) => i + 1).map(num => (
            <div 
              key={`heat-${num}`}
              className={getHeatClass(num, predictionData)}
            >
              {num}
            </div>
          ))}
        </div>
      </section>
      
      {/* Combinations Section - Reduced Spacing */}
      <section className="section mb-6 md:mb-8"> {/* Reduced bottom margin */}
        <div className="section-title text-lg md:text-xl font-semibold mb-4 md:mb-6 text-center text-primary">Combinações Sugeridas</div>
        {isGenerating ? (
          <SmartPickLoading />
        ) : (
          <div className="combos grid gap-4 md:gap-5">
            {displayedCombinations.map((pick: PredictionCombination, index: number) => {
              const confidenceStyle = getConfidenceStyle(pick.confidence);
              const numbers = pick.numbers.split("-");
              const mainNumbers = numbers.slice(0, 5);
              const specialBall = numbers.length > 5 ? numbers[numbers.length - 1] : null;

              return (
                <div 
                  key={`${index}-${pick.numbers}`}
                  className="combo-card bg-[var(--combo-card-bg)] rounded-[var(--radius)] p-4 md:p-5 px-5 md:px-7 flex flex-col sm:flex-row justify-between items-center sm:items-center gap-3 sm:gap-4 shadow-[0_0_16px_rgba(255,255,255,0.02)] border border-[var(--combo-card-border)]"
                >
                  {/* Numbers Display - Optimized Mobile */}
                  <div className="numbers flex flex-wrap gap-2 justify-center sm:justify-start items-center">
                    {mainNumbers.map((num, i) => (
                       <div key={`combo-main-${i}`} className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-black font-semibold text-sm"> {/* Increased mobile size, standardized font */}
                         {num}
                       </div>
                    ))}
                    {specialBall && (
                      <div className="w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center text-black font-semibold text-sm ml-1"> {/* Increased mobile size, standardized font */}
                        {specialBall}
                      </div>
                    )}
                  </div>
                  {/* Confidence Level - Optimized Mobile */}
                  <span className={`confidence text-sm py-1.5 px-3 rounded-full bg-[var(--combo-confidence-bg)] ${confidenceStyle.style} whitespace-nowrap`}> {/* Standardized font/padding */}
                    {confidenceStyle.text}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Generate Button Section - Reduced Spacing */}
      <div className="relative mt-8 md:mt-10"> {/* Reduced top margin */}
         {showEffects && (
          <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none overflow-hidden">
            {/* Starburst effect placeholder */}
          </div>
        )}
        <button
          onClick={handleGenerateNewPicks}
          disabled={isGenerating || loading || !predictionData || predictionData.combinations.length === 0}
          className="btn block mx-auto bg-primary text-[var(--primary-foreground)] font-bold py-3.5 md:py-4 px-8 md:px-10 text-sm md:text-base border-none rounded-[var(--radius)] cursor-pointer transition-all duration-300 ease-in-out shadow-[0_0_20px_rgba(0,255,224,0.2)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,255,224,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {'✨ Gerar com Smart Pick AI'}
        </button>
      </div>
    </div>
  );
}

