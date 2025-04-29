// Dados históricos das loterias
// Fonte: Baseado em dados públicos das loterias
// Formato: { drawDate: string, numbers: string, specialBall: string, multiplier: string, jackpot: string }

import { getLotteryInfo } from './lottery';

export interface PastResult {
  drawDate: string;
  numbers: string;
  specialBall: string; // Mega Ball, Power Ball, Cash Ball, etc.
  multiplier: string;
  jackpot: string;
}

// Dados de exemplo para os últimos sorteios da Mega Millions
export const megaMillionsResults: PastResult[] = [
  {
    drawDate: "26/04/2025",
    numbers: "07-30-39-41-70",
    specialBall: "13",
    multiplier: "x3",
    jackpot: "$129,000,000"
  },
  {
    drawDate: "23/04/2025",
    numbers: "12-18-24-35-58",
    specialBall: "21",
    multiplier: "x2",
    jackpot: "$112,000,000"
  },
  {
    drawDate: "19/04/2025",
    numbers: "05-14-27-33-47",
    specialBall: "09",
    multiplier: "x4",
    jackpot: "$98,000,000"
  },
  {
    drawDate: "16/04/2025",
    numbers: "03-11-25-37-56",
    specialBall: "15",
    multiplier: "x2",
    jackpot: "$87,000,000"
  },
  {
    drawDate: "12/04/2025",
    numbers: "08-19-26-48-65",
    specialBall: "19",
    multiplier: "x3",
    jackpot: "$76,000,000"
  },
  {
    drawDate: "09/04/2025",
    numbers: "02-17-22-45-60",
    specialBall: "07",
    multiplier: "x5",
    jackpot: "$68,000,000"
  },
  {
    drawDate: "05/04/2025",
    numbers: "10-21-29-44-53",
    specialBall: "05",
    multiplier: "x2",
    jackpot: "$62,000,000"
  },
  {
    drawDate: "02/04/2025",
    numbers: "04-13-28-36-51",
    specialBall: "11",
    multiplier: "x3",
    jackpot: "$54,000,000"
  },
  {
    drawDate: "29/03/2025",
    numbers: "06-15-23-42-57",
    specialBall: "16",
    multiplier: "x4",
    jackpot: "$48,000,000"
  },
  {
    drawDate: "26/03/2025",
    numbers: "01-09-20-38-49",
    specialBall: "08",
    multiplier: "x2",
    jackpot: "$42,000,000"
  },
  {
    drawDate: "22/03/2025",
    numbers: "11-16-31-40-55",
    specialBall: "03",
    multiplier: "x3",
    jackpot: "$36,000,000"
  },
  {
    drawDate: "19/03/2025",
    numbers: "07-14-25-43-62",
    specialBall: "10",
    multiplier: "x2",
    jackpot: "$30,000,000"
  },
  {
    drawDate: "15/03/2025",
    numbers: "09-18-27-46-59",
    specialBall: "12",
    multiplier: "x4",
    jackpot: "$24,000,000"
  },
  {
    drawDate: "12/03/2025",
    numbers: "03-12-22-41-54",
    specialBall: "06",
    multiplier: "x3",
    jackpot: "$20,000,000"
  },
  {
    drawDate: "08/03/2025",
    numbers: "08-17-30-39-50",
    specialBall: "04",
    multiplier: "x2",
    jackpot: "$20,000,000"
  }
];

// Dados de exemplo para os últimos sorteios da Powerball (adaptados da Mega Millions para exemplo)
export const powerballResults: PastResult[] = [
  {
    drawDate: "27/04/2025",
    numbers: "10-22-35-47-65",
    specialBall: "08",
    multiplier: "x3",
    jackpot: "$145,000,000"
  },
  {
    drawDate: "24/04/2025",
    numbers: "03-15-27-42-56",
    specialBall: "17",
    multiplier: "x2",
    jackpot: "$132,000,000"
  },
  {
    drawDate: "20/04/2025",
    numbers: "08-19-31-44-59",
    specialBall: "12",
    multiplier: "x4",
    jackpot: "$120,000,000"
  },
  {
    drawDate: "17/04/2025",
    numbers: "05-16-28-40-52",
    specialBall: "21",
    multiplier: "x2",
    jackpot: "$105,000,000"
  },
  {
    drawDate: "13/04/2025",
    numbers: "11-23-36-48-63",
    specialBall: "04",
    multiplier: "x3",
    jackpot: "$95,000,000"
  },
  {
    drawDate: "10/04/2025",
    numbers: "07-18-29-41-54",
    specialBall: "14",
    multiplier: "x5",
    jackpot: "$85,000,000"
  },
  {
    drawDate: "06/04/2025",
    numbers: "02-13-25-37-49",
    specialBall: "06",
    multiplier: "x2",
    jackpot: "$75,000,000"
  },
  {
    drawDate: "03/04/2025",
    numbers: "09-21-33-45-57",
    specialBall: "19",
    multiplier: "x3",
    jackpot: "$65,000,000"
  },
  {
    drawDate: "30/03/2025",
    numbers: "04-16-28-39-51",
    specialBall: "10",
    multiplier: "x4",
    jackpot: "$55,000,000"
  },
  {
    drawDate: "27/03/2025",
    numbers: "12-24-36-47-60",
    specialBall: "03",
    multiplier: "x2",
    jackpot: "$45,000,000"
  },
  {
    drawDate: "23/03/2025",
    numbers: "06-18-30-42-55",
    specialBall: "15",
    multiplier: "x3",
    jackpot: "$40,000,000"
  },
  {
    drawDate: "20/03/2025",
    numbers: "01-14-26-38-50",
    specialBall: "22",
    multiplier: "x2",
    jackpot: "$35,000,000"
  },
  {
    drawDate: "16/03/2025",
    numbers: "08-20-32-44-58",
    specialBall: "11",
    multiplier: "x4",
    jackpot: "$30,000,000"
  },
  {
    drawDate: "13/03/2025",
    numbers: "05-17-29-41-53",
    specialBall: "07",
    multiplier: "x3",
    jackpot: "$25,000,000"
  },
  {
    drawDate: "09/03/2025",
    numbers: "11-23-35-46-61",
    specialBall: "02",
    multiplier: "x2",
    jackpot: "$20,000,000"
  }
];

// Dados de exemplo para os últimos sorteios da Cash4Life (adaptados da Mega Millions para exemplo)
export const cash4lifeResults: PastResult[] = [
  {
    drawDate: "28/04/2025",
    numbers: "09-15-27-38-49",
    specialBall: "03",
    multiplier: "N/A", // Cash4Life não tem multiplicador
    jackpot: "$1,000/dia para a vida"
  },
  {
    drawDate: "25/04/2025",
    numbers: "04-16-28-39-51",
    specialBall: "01",
    multiplier: "N/A",
    jackpot: "$1,000/dia para a vida"
  },
  {
    drawDate: "21/04/2025",
    numbers: "07-19-31-42-53",
    specialBall: "04",
    multiplier: "N/A",
    jackpot: "$1,000/dia para a vida"
  },
  {
    drawDate: "18/04/2025",
    numbers: "02-14-26-37-48",
    specialBall: "02",
    multiplier: "N/A",
    jackpot: "$1,000/dia para a vida"
  },
  {
    drawDate: "14/04/2025",
    numbers: "10-22-34-45-56",
    specialBall: "03",
    multiplier: "N/A",
    jackpot: "$1,000/dia para a vida"
  },
  {
    drawDate: "11/04/2025",
    numbers: "05-17-29-40-52",
    specialBall: "01",
    multiplier: "N/A",
    jackpot: "$1,000/dia para a vida"
  },
  {
    drawDate: "07/04/2025",
    numbers: "08-20-32-43-54",
    specialBall: "04",
    multiplier: "N/A",
    jackpot: "$1,000/dia para a vida"
  },
  {
    drawDate: "04/04/2025",
    numbers: "03-15-27-38-50",
    specialBall: "02",
    multiplier: "N/A",
    jackpot: "$1,000/dia para a vida"
  },
  {
    drawDate: "31/03/2025",
    numbers: "11-23-35-46-57",
    specialBall: "03",
    multiplier: "N/A",
    jackpot: "$1,000/dia para a vida"
  },
  {
    drawDate: "28/03/2025",
    numbers: "06-18-30-41-53",
    specialBall: "01",
    multiplier: "N/A",
    jackpot: "$1,000/dia para a vida"
  },
  {
    drawDate: "24/03/2025",
    numbers: "09-21-33-44-55",
    specialBall: "04",
    multiplier: "N/A",
    jackpot: "$1,000/dia para a vida"
  },
  {
    drawDate: "21/03/2025",
    numbers: "04-16-28-39-51",
    specialBall: "02",
    multiplier: "N/A",
    jackpot: "$1,000/dia para a vida"
  },
  {
    drawDate: "17/03/2025",
    numbers: "12-24-36-47-58",
    specialBall: "03",
    multiplier: "N/A",
    jackpot: "$1,000/dia para a vida"
  },
  {
    drawDate: "14/03/2025",
    numbers: "07-19-31-42-54",
    specialBall: "01",
    multiplier: "N/A",
    jackpot: "$1,000/dia para a vida"
  },
  {
    drawDate: "10/03/2025",
    numbers: "10-22-34-45-56",
    specialBall: "04",
    multiplier: "N/A",
    jackpot: "$1,000/dia para a vida"
  }
];

// Mapeamento de loterias para seus resultados
const lotteryResultsMap: { [key: string]: PastResult[] } = {
  'mega-millions': megaMillionsResults,
  'powerball': powerballResults,
  'cash4life': cash4lifeResults
};

// Função para obter os resultados anteriores de uma loteria específica
export function getPastResults(limit: number = 10, lotteryId: string = 'mega-millions'): PastResult[] {
  const results = lotteryResultsMap[lotteryId] || megaMillionsResults;
  return results.slice(0, limit);
}

// Função para obter um resultado específico por data e loteria
export function getResultByDate(date: string, lotteryId: string = 'mega-millions'): PastResult | undefined {
  const results = lotteryResultsMap[lotteryId] || megaMillionsResults;
  return results.find(result => result.drawDate === date);
}

// Função para obter o resultado mais recente de uma loteria específica
export function getLatestResult(lotteryId: string = 'mega-millions'): PastResult {
  const results = lotteryResultsMap[lotteryId] || megaMillionsResults;
  return results[0];
}
