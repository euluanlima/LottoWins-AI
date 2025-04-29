// Funções para análise de frequência dos números
import { getPastResults, PastResult } from './pastResults';
import { getLotteryInfo } from './lottery';

export interface NumberFrequency {
  number: number;
  frequency: number;
  percentage: number;
  isSpecialBall: boolean; // Renamed from isMegaBall for generality
}

// Função para calcular a frequência de todos os números para uma loteria específica
export function calculateNumberFrequencies(lotteryId: string): NumberFrequency[] {
  const lotteryInfo = getLotteryInfo(lotteryId);
  if (!lotteryInfo) {
    console.error(`Lottery info not found for ID: ${lotteryId}`);
    return []; // Return empty array if lottery info is missing
  }

  const results = getPastResults(1000, lotteryId); // Get a large number of results for analysis
  if (!results || results.length === 0) {
    console.warn(`No past results found for lottery ID: ${lotteryId}`);
    return []; // Return empty array if no results
  }

  const frequencies: NumberFrequency[] = [];
  const regularNumberCounts: { [key: number]: number } = {};
  const specialBallCounts: { [key: number]: number } = {};
  
  // Inicializar contadores para todos os números possíveis da loteria específica
  for (let i = 1; i <= lotteryInfo.maxRegularNumber; i++) {
    regularNumberCounts[i] = 0;
  }
  
  for (let i = 1; i <= lotteryInfo.maxSpecialNumber; i++) {
    specialBallCounts[i] = 0;
  }
  
  // Contar ocorrências de cada número
  results.forEach(result => {
    // Ensure numbers and specialBall are valid before processing
    if (result.numbers && result.specialBall) {
        const numbers = result.numbers.split('-').map(num => parseInt(num.trim(), 10));
        const specialBall = parseInt(result.specialBall.trim(), 10);
        
        numbers.forEach(num => {
          if (!isNaN(num) && num >= 1 && num <= lotteryInfo.maxRegularNumber) {
            regularNumberCounts[num]++;
          }
        });
        
        if (!isNaN(specialBall) && specialBall >= 1 && specialBall <= lotteryInfo.maxSpecialNumber) {
          specialBallCounts[specialBall]++;
        }
    } else {
        console.warn("Skipping result due to missing numbers or specialBall:", result);
    }
  });
  
  // Calcular frequências para números regulares
  const totalDraws = results.length;
  
  for (let i = 1; i <= lotteryInfo.maxRegularNumber; i++) {
    const count = regularNumberCounts[i] || 0;
    frequencies.push({
      number: i,
      frequency: count,
      percentage: totalDraws > 0 ? (count / totalDraws) * 100 : 0,
      isSpecialBall: false
    });
  }
  
  // Calcular frequências para Special Balls
  for (let i = 1; i <= lotteryInfo.maxSpecialNumber; i++) {
    const count = specialBallCounts[i] || 0;
    frequencies.push({
      number: i,
      frequency: count,
      percentage: totalDraws > 0 ? (count / totalDraws) * 100 : 0,
      isSpecialBall: true
    });
  }
  
  return frequencies;
}

// Função para obter os números mais frequentes para uma loteria específica
export function getMostFrequentNumbers(lotteryId: string, limit: number = 10, isSpecialBall: boolean = false): NumberFrequency[] {
  const frequencies = calculateNumberFrequencies(lotteryId);
  return frequencies
    .filter(item => item.isSpecialBall === isSpecialBall)
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, limit);
}

// Função para obter os números menos frequentes para uma loteria específica
export function getLeastFrequentNumbers(lotteryId: string, limit: number = 10, isSpecialBall: boolean = false): NumberFrequency[] {
  const frequencies = calculateNumberFrequencies(lotteryId);
  return frequencies
    .filter(item => item.isSpecialBall === isSpecialBall)
    .sort((a, b) => a.frequency - b.frequency)
    .slice(0, limit);
}

// Função para obter a frequência de um número específico para uma loteria específica
export function getNumberFrequency(lotteryId: string, number: number, isSpecialBall: boolean = false): NumberFrequency | undefined {
  const frequencies = calculateNumberFrequencies(lotteryId);
  return frequencies.find(item => item.number === number && item.isSpecialBall === isSpecialBall);
}

