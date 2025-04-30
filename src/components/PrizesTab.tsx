import React from 'react';
import mockPrizesData from '@/data/mockPrizes.json';

interface PrizeTier {
  match: string;
  prize: string;
  odds: string;
}

interface LotteryPrizes {
  name: string;
  prizes: PrizeTier[];
  powerPlayNote?: string;
  megaplierNote?: string;
  cashBallNote?: string;
}

interface MockPrizes {
  powerball: LotteryPrizes;
  'mega-millions': LotteryPrizes;
  cash4life: LotteryPrizes;
}

interface PrizesTabProps {
  lotteryId: string;
}

const PrizesTab: React.FC<PrizesTabProps> = ({ lotteryId }) => {
  const prizesData = mockPrizesData as MockPrizes;
  const currentPrizes = prizesData[lotteryId as keyof MockPrizes];

  if (!currentPrizes) {
    return <div className="p-4 text-center text-red-600">Informações de prêmios não disponíveis para esta loteria.</div>;
  }

  const getNote = () => {
    if (lotteryId === 'powerball') return currentPrizes.powerPlayNote;
    if (lotteryId === 'mega-millions') return currentPrizes.megaplierNote;
    if (lotteryId === 'cash4life') return currentPrizes.cashBallNote;
    return null;
  };

  return (
    <div className="p-4 md:p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-center mb-6">{currentPrizes.name}</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Acertos
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Prêmio
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Probabilidade (1 em)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentPrizes.prizes.map((tier, index) => (
              <tr key={index} className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {tier.match}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {tier.prize}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {tier.odds.replace('1 in ', '')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {getNote() && (
        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-200">{getNote()}</p>
        </div>
      )}
       <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">Nota: Valores e probabilidades são baseados em dados de exemplo e podem não refletir os valores oficiais atuais.</p>
    </div>
  );
};

export default PrizesTab;

