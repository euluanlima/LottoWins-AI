'use client';

import React, { useState } from 'react';
import { calculateNumberFrequencies, getMostFrequentNumbers, getLeastFrequentNumbers, NumberFrequency } from '@/lib/frequencyAnalysis';
import { getLotteryInfo } from '@/lib/lottery';

// Define button styles for active/inactive states
const activeButtonStyle = "bg-blue-600 text-white font-semibold";
const inactiveButtonStyle = "bg-gray-200 text-gray-700 hover:bg-gray-300";

// Define props for the component
interface FrequencyChartComponentProps {
  lotteryId: string;
}

export default function FrequencyChartComponent({ lotteryId }: FrequencyChartComponentProps) {
  const [chartType, setChartType] = useState<'regular' | 'special'>('regular');
  const [viewType, setViewType] = useState<'all' | 'most' | 'least'>('all');
  
  // Get lottery info
  const lotteryInfo = getLotteryInfo(lotteryId);
  
  // Handle case where lotteryInfo is not found (though unlikely if routing is correct)
  if (!lotteryInfo) {
    return (
      <div className="p-6 rounded-lg border bg-card shadow-sm">
        <p className="text-lg text-muted-foreground">Informações da loteria "{lotteryId}" não encontradas.</p>
      </div>
    );
  }
  
  // Get frequency data for the specific lottery
  const allFrequencies = calculateNumberFrequencies(lotteryId);
  const regularNumbers = allFrequencies.filter(item => !item.isSpecialBall);
  const specialBallNumbers = allFrequencies.filter(item => item.isSpecialBall);
  
  // Determine which data to display based on user selection
  let displayData: NumberFrequency[] = [];
  
  if (chartType === 'regular') {
    if (viewType === 'all') {
      displayData = regularNumbers;
    } else if (viewType === 'most') {
      displayData = getMostFrequentNumbers(lotteryId, 10, false);
    } else {
      displayData = getLeastFrequentNumbers(lotteryId, 10, false);
    }
  } else {
    if (viewType === 'all') {
      displayData = specialBallNumbers;
    } else if (viewType === 'most') {
      displayData = getMostFrequentNumbers(lotteryId, 5, true); // Show fewer for special ball
    } else {
      displayData = getLeastFrequentNumbers(lotteryId, 5, true); // Show fewer for special ball
    }
  }
  
  // Find max frequency for scaling
  const maxFrequency = displayData.length > 0 ? Math.max(...displayData.map(item => item.frequency)) : 1;
  
  return (
    <div className="p-4 sm:p-6 rounded-lg border bg-card shadow-sm space-y-6">
      {/* Section Title and Description - Use lottery name */}
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Gráfico de Frequência</h2>
        <p className="text-base sm:text-lg text-muted-foreground">Análise de frequência dos números sorteados na {lotteryInfo.name}.</p>
      </div>
      
      {/* Help text with icon - Use lottery name and special ball name */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
        <div className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0 mt-0.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-base">
            Este gráfico mostra quantas vezes cada número foi sorteado. Barras mais altas indicam números mais frequentes. Use os filtros para ver números regulares ou {lotteryInfo.specialBallName}, e para focar nos mais ou menos frequentes.
          </p>
        </div>
      </div>
      
      {/* Filter Controls - Larger buttons, more spacing */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-4 border-t">
        {/* Type Filter - Use special ball name */}
        <div className="flex flex-col sm:flex-row gap-2">
          <span className="text-base font-semibold text-foreground mb-1 sm:mb-0 sm:mr-2">Mostrar:</span>
          <div className="flex rounded-md overflow-hidden shadow-sm">
            <button 
              className={`px-4 py-2 text-base transition-colors duration-150 ${chartType === 'regular' ? activeButtonStyle : inactiveButtonStyle}`}
              onClick={() => setChartType('regular')}
            >
              Números Regulares
            </button>
            <button 
              className={`px-4 py-2 text-base transition-colors duration-150 ${chartType === 'special' ? activeButtonStyle : inactiveButtonStyle}`}
              onClick={() => setChartType('special')}
            >
              {lotteryInfo.specialBallName}
            </button>
          </div>
        </div>
        
        {/* View Filter */}
        <div className="flex flex-col sm:flex-row gap-2">
           <span className="text-base font-semibold text-foreground mb-1 sm:mb-0 sm:mr-2">Ver:</span>
          <div className="flex rounded-md overflow-hidden shadow-sm">
            <button 
              className={`px-4 py-2 text-base transition-colors duration-150 ${viewType === 'all' ? activeButtonStyle : inactiveButtonStyle}`}
              onClick={() => setViewType('all')}
            >
              Todos
            </button>
            <button 
              className={`px-4 py-2 text-base transition-colors duration-150 ${viewType === 'most' ? activeButtonStyle : inactiveButtonStyle}`}
              onClick={() => setViewType('most')}
            >
              Mais Frequentes
            </button>
            <button 
              className={`px-4 py-2 text-base transition-colors duration-150 ${viewType === 'least' ? activeButtonStyle : inactiveButtonStyle}`}
              onClick={() => setViewType('least')}
            >
              Menos Frequentes
            </button>
          </div>
        </div>
      </div>
      
      {/* Frequency Chart - Simplified */}
      <div className="bg-gray-50 rounded-lg border p-4 min-h-[300px]">
        {displayData.length > 0 ? (
          <div className="h-72 flex items-end justify-around gap-1 sm:gap-2">
            {displayData.map((item) => {
              const heightPercentage = Math.max(1, (item.frequency / maxFrequency) * 100); // Ensure minimum height of 1%
              const barColor = item.isSpecialBall ? 'bg-yellow-400' : 'bg-blue-500';
              const textColor = item.isSpecialBall ? 'text-black' : 'text-white';
              const ballBgColor = item.isSpecialBall ? 'bg-yellow-400 border-yellow-500' : 'bg-white border-gray-300';
              const ballTextColor = item.isSpecialBall ? 'text-black' : 'text-black';
              
              return (
                <div 
                  key={`${item.isSpecialBall ? 'special-' : ''}${item.number}`} 
                  className="flex flex-col items-center flex-1 min-w-0 h-full justify-end"
                  title={`Número ${item.number}: ${item.frequency} vezes (${item.percentage.toFixed(1)}%)`}
                >
                  {/* Frequency Label */}
                  <div className="text-sm font-semibold text-gray-700 mb-1 h-5">
                    {item.frequency}
                  </div>
                  {/* Bar */}
                  <div 
                    className={`w-full max-w-[40px] ${barColor} rounded-t-md transition-height duration-300 ease-out`}
                    style={{ height: `${heightPercentage}%` }}
                  >
                  </div>
                  {/* Number Ball */}
                  <div className={`mt-2 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shadow-sm border ${ballBgColor} ${ballTextColor}`}>
                    {item.number}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-72 flex items-center justify-center text-muted-foreground text-lg">
            Nenhum dado para exibir com os filtros selecionados.
          </div>
        )}
      </div>
      
      {/* Simplified Legend - Use special ball name */}
      <div className="mt-4 flex justify-center gap-6 text-base">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded-sm mr-2"></div>
          <span>Números Regulares</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-400 rounded-sm mr-2"></div>
          <span>{lotteryInfo.specialBallName}</span>
        </div>
      </div>
    </div>
  );
}
