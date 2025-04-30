// Dados das matrizes de prêmios das loterias
// Fonte: Baseado em dados públicos das loterias

// Interface genérica para nível de prêmio
export interface PrizeLevel {
  matches: string; // Descrição dos acertos (ex: "5 + Powerball")
  odds: string;    // Chances (ex: "1 em 292,201,338")
  prize: string;   // Prêmio base (ex: "Jackpot", "$1,000,000")
  multiplierPrizes?: { // Opcional, para loterias com multiplicador (Power Play, Megaplier)
    [key: string]: string; // ex: x2: "$2,000,000"
  };
}

// --- Mega Millions --- 
export const megaMillionsPrizeLevels: PrizeLevel[] = [
  {
    matches: "5 + Mega Ball",
    odds: "1 em 302,575,350",
    prize: "Jackpot",
    multiplierPrizes: { // Megaplier
      x2: "Jackpot",
      x3: "Jackpot",
      x4: "Jackpot",
      x5: "Jackpot"
    }
  },
  {
    matches: "5",
    odds: "1 em 12,607,306",
    prize: "$1,000,000",
    multiplierPrizes: {
      x2: "$2,000,000",
      x3: "$3,000,000",
      x4: "$4,000,000",
      x5: "$5,000,000"
    }
  },
  {
    matches: "4 + Mega Ball",
    odds: "1 em 931,001",
    prize: "$10,000",
    multiplierPrizes: {
      x2: "$20,000",
      x3: "$30,000",
      x4: "$40,000",
      x5: "$50,000"
    }
  },
  {
    matches: "4",
    odds: "1 em 38,792",
    prize: "$500",
    multiplierPrizes: {
      x2: "$1,000",
      x3: "$1,500",
      x4: "$2,000",
      x5: "$2,500"
    }
  },
  {
    matches: "3 + Mega Ball",
    odds: "1 em 14,547",
    prize: "$200",
    multiplierPrizes: {
      x2: "$400",
      x3: "$600",
      x4: "$800",
      x5: "$1,000"
    }
  },
  {
    matches: "3",
    odds: "1 em 606",
    prize: "$10",
    multiplierPrizes: {
      x2: "$20",
      x3: "$30",
      x4: "$40",
      x5: "$50"
    }
  },
  {
    matches: "2 + Mega Ball",
    odds: "1 em 693",
    prize: "$10",
    multiplierPrizes: {
      x2: "$20",
      x3: "$30",
      x4: "$40",
      x5: "$50"
    }
  },
  {
    matches: "1 + Mega Ball",
    odds: "1 em 89",
    prize: "$4",
    multiplierPrizes: {
      x2: "$8",
      x3: "$12",
      x4: "$16",
      x5: "$20"
    }
  },
  {
    matches: "0 + Mega Ball",
    odds: "1 em 37",
    prize: "$2",
    multiplierPrizes: {
      x2: "$4",
      x3: "$6",
      x4: "$8",
      x5: "$10"
    }
  }
];

// --- Powerball --- (Estrutura similar, mas com Power Play)
export const powerballPrizeLevels: PrizeLevel[] = [
  {
    matches: "5 + Powerball",
    odds: "1 em 292,201,338",
    prize: "Jackpot",
    multiplierPrizes: { // Power Play (x10 disponível para jackpots < $150M)
      x2: "Jackpot",
      x3: "Jackpot",
      x4: "Jackpot",
      x5: "Jackpot",
      x10: "Jackpot"
    }
  },
  {
    matches: "5",
    odds: "1 em 11,688,054",
    prize: "$1,000,000",
    multiplierPrizes: {
      x2: "$2,000,000", // Prêmio fixo com Power Play
      x3: "$2,000,000",
      x4: "$2,000,000",
      x5: "$2,000,000",
      x10: "$2,000,000"
    }
  },
  {
    matches: "4 + Powerball",
    odds: "1 em 913,129",
    prize: "$50,000",
    multiplierPrizes: {
      x2: "$100,000",
      x3: "$150,000",
      x4: "$200,000",
      x5: "$250,000",
      x10: "$500,000"
    }
  },
  {
    matches: "4",
    odds: "1 em 36,525",
    prize: "$100",
    multiplierPrizes: {
      x2: "$200",
      x3: "$300",
      x4: "$400",
      x5: "$500",
      x10: "$1,000"
    }
  },
  {
    matches: "3 + Powerball",
    odds: "1 em 14,494",
    prize: "$100",
    multiplierPrizes: {
      x2: "$200",
      x3: "$300",
      x4: "$400",
      x5: "$500",
      x10: "$1,000"
    }
  },
  {
    matches: "3",
    odds: "1 em 580",
    prize: "$7",
    multiplierPrizes: {
      x2: "$14",
      x3: "$21",
      x4: "$28",
      x5: "$35",
      x10: "$70"
    }
  },
  {
    matches: "2 + Powerball",
    odds: "1 em 701",
    prize: "$7",
    multiplierPrizes: {
      x2: "$14",
      x3: "$21",
      x4: "$28",
      x5: "$35",
      x10: "$70"
    }
  },
  {
    matches: "1 + Powerball",
    odds: "1 em 92",
    prize: "$4",
    multiplierPrizes: {
      x2: "$8",
      x3: "$12",
      x4: "$16",
      x5: "$20",
      x10: "$40"
    }
  },
  {
    matches: "0 + Powerball",
    odds: "1 em 38",
    prize: "$4",
    multiplierPrizes: {
      x2: "$8",
      x3: "$12",
      x4: "$16",
      x5: "$20",
      x10: "$40"
    }
  }
];

// --- Cash4Life --- (Sem multiplicador)
export const cash4lifePrizeLevels: PrizeLevel[] = [
  {
    matches: "5 + Cash Ball",
    odds: "1 em 21,846,048",
    prize: "$1,000/dia para a vida"
  },
  {
    matches: "5",
    odds: "1 em 7,282,016",
    prize: "$1,000/semana para a vida"
  },
  {
    matches: "4 + Cash Ball",
    odds: "1 em 79,440",
    prize: "$2,500"
  },
  {
    matches: "4",
    odds: "1 em 26,480",
    prize: "$500"
  },
  {
    matches: "3 + Cash Ball",
    odds: "1 em 1,471",
    prize: "$100"
  },
  {
    matches: "3",
    odds: "1 em 490",
    prize: "$25"
  },
  {
    matches: "2 + Cash Ball",
    odds: "1 em 83",
    prize: "$10"
  },
  {
    matches: "2",
    odds: "1 em 28",
    prize: "$4"
  },
  {
    matches: "1 + Cash Ball",
    odds: "1 em 13",
    prize: "$2"
  }
];

// Mapeamento de loterias para seus níveis de prêmio
const lotteryPrizeMap: { [key: string]: PrizeLevel[] } = {
  "mega-millions": megaMillionsPrizeLevels,
  "powerball": powerballPrizeLevels,
  "cash4life": cash4lifePrizeLevels
};

// Função para obter os níveis de prêmio de uma loteria específica
export function getPrizeLevels(lotteryId: string): PrizeLevel[] {
  return lotteryPrizeMap[lotteryId] || []; // Retorna array vazio se não encontrar
}

// A função getLotteryInfo foi movida para lottery.ts
// Se precisar de informações gerais aqui, importe de lottery.ts

