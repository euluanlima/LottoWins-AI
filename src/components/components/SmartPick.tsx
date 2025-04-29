
'use client';

import React, { useState, useEffect, useCallback } from 'react';
// Import necessary types from lottery lib
import { 
  PredictionData, 
  PredictionCombination, 
  LotteryInfo, 
  getLotteryInfo 
} from '@/lib/lottery';
// Import the hook from its new location
import { usePredictionData } from '@/hooks/usePredictionData';

// Helper function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray<T>(array: T[]): T[] {
  let currentIndex = array.length, randomIndex;
  const newArray = [...array]; // Create a copy to avoid mutating the original

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
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

// Helper function to map confidence level to text and simplified style
const getConfidenceStyle = (level: 'high' | 'medium' | 'low') => {
  switch (level) {
    case 'high':
      return { text: 'Alta', style: 'bg-green-600 text-white font-semibold' }; 
    case 'medium':
      return { text: 'Média', style: 'bg-yellow-500 text-black font-semibold' };
    case 'low':
      return { text: 'Baixa', style: 'bg-orange-500 text-white font-semibold' };
    default:
      // Fallback, though getRandomConfidence should prevent this
      return { text: 'N/A', style: 'bg-gray-400 text-black font-semibold' };
  }
};

// Helper function to determine heat map class
const getHeatClass = (num: number, predictionData: PredictionData | null): string => {
  if (!predictionData) return "bg-gray-300 text-black"; // Neutral default
  if (predictionData.hotNumbers.includes(num)) return "heat-map-hot"; // Red background, white text
  if (predictionData.overdueNumbers.includes(num)) return "heat-map-cold"; // Blue background, white text
  return "bg-gray-300 text-black"; // Neutral
};

// Define props for the component
interface SmartPickComponentProps {
  lotteryId: string;
}

// Modify component to accept lotteryId prop
export default function SmartPickComponent({ lotteryId }: SmartPickComponentProps) {
  // Pass lotteryId to the hook
  const { data: predictionData, loading, error, lotteryInfo } = usePredictionData(lotteryId); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [displayedCombinations, setDisplayedCombinations] = useState<PredictionCombination[]>([]);

  // Function to set displayed combinations with random confidence
  const updateDisplayedCombinations = useCallback((combinationsSource: PredictionCombination[]) => {
    if (!combinationsSource || combinationsSource.length === 0) {
        setDisplayedCombinations([]);
        return;
    }
    // Ensure we don't try to slice more than available
    const count = Math.min(5, combinationsSource.length);
    const selected = combinationsSource.slice(0, count);
    // Assign random confidence levels for display
    const combinationsWithRandomConfidence = selected.map(pick => ({
      ...pick,
      confidence: getRandomConfidence(),
    }));
    setDisplayedCombinations(combinationsWithRandomConfidence);
  }, []);

  // Effect to set initial displayed combinations when data loads
  useEffect(() => {
    if (predictionData?.combinations) {
      updateDisplayedCombinations(predictionData.combinations);
    }
  }, [predictionData, updateDisplayedCombinations]);

  // Modified generation handler to shuffle and select 5 combinations with random confidence
  const handleGenerateNewPicks = useCallback(async () => {
    if (!predictionData?.combinations || predictionData.combinations.length === 0) {
      return;
    }
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 300)); 
    const shuffled = shuffleArray(predictionData.combinations);
    updateDisplayedCombinations(shuffled);
    setIsGenerating(false);
  }, [predictionData, updateDisplayedCombinations]);

  // Display loading state
  if (loading && !predictionData) {
    return (
      <div className="p-6 rounded-lg border bg-card shadow-sm flex flex-col items-center justify-center min-h-[200px]">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin mb-3"></div>
        <span className="text-lg text-muted-foreground">Carregando previsões para {lotteryInfo?.name}...</span>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="p-6 rounded-lg border border-red-500 bg-red-50 text-red-700">
        <h2 className="text-xl font-semibold mb-2">Erro ao Carregar Previsões</h2>
        {/* Display the specific error message from the hook */}
        <p>{error}</p> 
      </div>
    );
  }

  // Ensure predictionData and lotteryInfo are not null before rendering main content
  if (!predictionData || !lotteryInfo) {
    return (
        <div className="p-6 rounded-lg border bg-card shadow-sm">
            <p className="text-lg text-muted-foreground">Não há dados de previsão disponíveis para {lotteryId} no momento.</p>
        </div>
    ); 
  }

  // Get lottery specific details
  const maxNumber = lotteryInfo.maxRegularNumber;
  const specialBallName = lotteryInfo.specialBallName;

  return (
    <div className="p-4 sm:p-6 rounded-lg border bg-card shadow-sm space-y-6">
      
      {/* Section Title - Use lotteryInfo.name */}
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Previsões Inteligentes ({lotteryInfo.name})</h2>
        <p className="text-base sm:text-lg text-muted-foreground">Nossas sugestões baseadas em {predictionData.basedOn} sorteios anteriores.</p>
      </div>

      {/* Heat Map Section - Use maxNumber */}
      <div id="heat-map-section" className="space-y-3">
        {/* ... (legend remains the same) ... */}
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-foreground">Mapa de Calor</h3>
            <p className="text-base text-muted-foreground mt-1">Números mais (vermelho) e menos (azul) frequentes recentemente.</p>
          </div>
           {/* Simplified Legend */}
          <div className="flex items-center space-x-4 mt-2 sm:mt-0 text-base">
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full heat-map-hot mr-2"></div>
              <span>Quente</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-gray-300 mr-2"></div>
              <span>Neutro</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full heat-map-cold mr-2"></div>
              <span>Frio</span>
            </div>
          </div>
        </div>
        {/* Grid uses maxNumber from lotteryInfo */}
        <div className="grid grid-cols-7 sm:grid-cols-10 gap-2">
          {Array.from({ length: maxNumber }, (_, i) => i + 1).map(num => (
            <div 
              key={`heat-${num}`}
              // Adjust ball size slightly for potentially smaller grids if needed
              className={`w-10 h-10 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-semibold shadow-sm ${getHeatClass(num, predictionData)}`}
            >
              {num}
            </div>
          ))}
        </div>
      </div>
      
      {/* Predicted Combinations Section - Use specialBallName */}
      <div id="combinations-section" className="space-y-3 pt-4 border-t">
         {/* ... (title and legend remain the same) ... */}
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">Combinações Sugeridas</h3>
                <p className="text-base text-muted-foreground mt-1">5 sugestões com níveis de confiança.</p>
            </div>
            {/* Simplified Confidence Legend */}
            <div className="flex items-center space-x-3 mt-2 sm:mt-0 text-base flex-wrap">
                <span className={`px-2 py-0.5 rounded ${getConfidenceStyle('high').style}`}>Alta</span>
                <span className={`px-2 py-0.5 rounded ${getConfidenceStyle('medium').style}`}>Média</span>
                <span className={`px-2 py-0.5 rounded ${getConfidenceStyle('low').style}`}>Baixa</span>
            </div>
        </div>
        
        <div className="space-y-3">
          {displayedCombinations.map((pick: PredictionCombination, index: number) => {
            const confidenceStyle = getConfidenceStyle(pick.confidence);
            const numbers = pick.numbers.split("-");
            // Assuming 5 main numbers + 1 special ball structure for all
            const mainNumbers = numbers.slice(0, 5);
            const specialBall = numbers[5];

            return (
              <div 
                key={`${index}-${pick.numbers}`}
                className={`p-3 rounded-lg border flex flex-col sm:flex-row justify-between items-center bg-secondary/30`}
              >
                {/* Main Numbers */}
                <div className="flex items-center gap-2 flex-wrap mb-2 sm:mb-0">
                  {mainNumbers.map((num, i) => (
                    <span 
                      key={`main-${i}-${num}`}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold shadow-sm bg-white text-black border border-gray-300`}
                    >
                      {num}
                    </span>
                  ))}
                  {/* Special Ball - Use specialBallName in tooltip/aria-label if needed */}
                  <span
                    key={`special-${specialBall}`}
                    title={specialBallName} // Add tooltip with the ball name
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold shadow-sm bg-yellow-400 text-black border border-yellow-500`}
                  >
                    {specialBall}
                  </span>
                </div>
                {/* Confidence Level */}
                <div className="text-center mt-2 sm:mt-0">
                  <span className={`px-3 py-1 rounded-md text-sm ${confidenceStyle.style}`}>
                    Confiança: {confidenceStyle.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Generate New Picks Button Section */}
      <div id="generate-button-section" className="flex flex-col items-center pt-4 border-t">
        <p className="text-base text-muted-foreground text-center mb-4 max-w-lg">
          Clique abaixo para gerar um novo conjunto de previsões e combinações sugeridas para {lotteryInfo.name}.
        </p>
        <button
          onClick={handleGenerateNewPicks}
          disabled={isGenerating || loading || !predictionData || predictionData.combinations.length === 0}
          className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-md transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed w-full max-w-sm"
        >
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              <span>Gerando...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Gerar Novos Números</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

