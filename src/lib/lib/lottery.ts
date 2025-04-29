// Arquivo para definir a estrutura de dados e funções relacionadas a loterias

// Tipos para os dados de previsão
export interface PredictionCombination {
  numbers: string; // Formato "01-02-03-04-05-06"
  confidence: 'high' | 'medium' | 'low';
}

export interface PredictionData {
  hotNumbers: number[];
  overdueNumbers: number[];
  hotPowerBalls: number[]; // Mega Ball ou Power Ball, dependendo da loteria
  overduePowerBalls: number[];
  combinations: PredictionCombination[];
  lastUpdated: string; // Formato "DD/MM/YYYY HH:MM"
  basedOn: number; // Número de sorteios analisados
}

// Informações sobre cada loteria
export interface LotteryInfo {
  id: string; // e.g., 'mega-millions'
  name: string; // e.g., 'Mega Millions'
  logoPath: string; // Path to the logo image
  description: string;
  dataFile: string; // Nome do arquivo JSON com os dados
  maxRegularNumber: number; // Número máximo para os números regulares
  maxSpecialNumber: number; // Número máximo para o número especial (Mega Ball, Power Ball, etc.)
  specialBallName: string; // Nome do número especial
  regularNumberCount: number; // Quantidade de números regulares a serem escolhidos
  multiplierName?: string; // Nome da opção multiplicadora (ex: Megaplier, Power Play)
  multiplierOption?: string; // Custo da opção multiplicadora
  drawDays?: string; // Dias dos sorteios
  ticketPrice?: string; // Preço do bilhete
  overallOdds?: string; // Chances gerais de ganhar
}

// Lista de loterias disponíveis
export const availableLotteries: LotteryInfo[] = [
  {
    id: 'mega-millions',
    name: 'Mega Millions',
    logoPath: '/lotto-wins-ai-logo.png',
    description: 'Uma das maiores loterias dos EUA, com jackpots gigantescos.',
    dataFile: 'mega-millions-predictions.json',
    maxRegularNumber: 70,
    maxSpecialNumber: 25,
    specialBallName: 'Mega Ball',
    regularNumberCount: 5,
    multiplierName: 'Megaplier',
    multiplierOption: '$1.00 adicional',
    drawDays: 'Terças e Sextas-feiras',
    ticketPrice: '$2.00',
    overallOdds: '1 em 24'
  },
  {
    id: 'powerball',
    name: 'Powerball',
    logoPath: '/lotto-wins-ai-logo.png',
    description: 'Outra loteria popular com grandes prêmios e sorteios frequentes.',
    dataFile: 'powerball-predictions.json',
    maxRegularNumber: 69,
    maxSpecialNumber: 26,
    specialBallName: 'Power Ball',
    regularNumberCount: 5,
    multiplierName: 'Power Play',
    multiplierOption: '$1.00 adicional',
    drawDays: 'Segundas, Quartas e Sábados',
    ticketPrice: '$2.00',
    overallOdds: '1 em 24.9'
  },
  {
    id: 'cash4life',
    name: 'Cash4Life',
    logoPath: '/lotto-wins-ai-logo.png',
    description: 'Ganhe $1.000 por dia pelo resto da vida!',
    dataFile: 'cash4life-predictions.json',
    maxRegularNumber: 60,
    maxSpecialNumber: 4,
    specialBallName: 'Cash Ball',
    regularNumberCount: 5,
    // multiplierName: undefined, // Cash4Life não tem multiplicador padrão
    // multiplierOption: undefined,
    drawDays: 'Diariamente',
    ticketPrice: '$2.00',
    overallOdds: '1 em 8'
  },
];

// Função para obter informações de uma loteria pelo ID
export function getLotteryInfo(lotteryId: string): LotteryInfo | undefined {
  return availableLotteries.find(lottery => lottery.id === lotteryId);
}

