import React from 'react';

interface Result {
  drawDate: string;
  winningNumbers: string[];
  powerball?: string;
  megaBall?: string;
  cashBall?: string;
  jackpot?: string;
  topPrize?: string;
}

interface ResultsTabProps {
  results: Result[];
  lotteryName: string;
}

const ResultsTab: React.FC<ResultsTabProps> = ({ results, lotteryName }) => {
  if (!results || results.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400 mt-4">Nenhum resultado anterior disponível.</p>;
  }

  const getSpecialBallName = (name: string) => {
    if (name === 'powerball') return 'Powerball';
    if (name === 'mega-millions') return 'Mega Ball';
    if (name === 'cash4life') return 'Cash Ball';
    return '';
  };

  const getSpecialBallValue = (result: Result, name: string) => {
    if (name === 'powerball') return result.powerball;
    if (name === 'mega-millions') return result.megaBall;
    if (name === 'cash4life') return result.cashBall;
    return null;
  };

  const getPrizeInfo = (result: Result, name: string) => {
    if (name === 'cash4life') return result.topPrize;
    return result.jackpot;
  };

  const specialBallName = getSpecialBallName(lotteryName);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h2 className="text-xl font-semibold text-center mb-4">Últimos Resultados</h2>
      {results.map((result, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Data: {result.drawDate}</span>
            {getPrizeInfo(result, lotteryName) && (
              <span className="text-sm font-medium text-green-600 dark:text-green-400">{getPrizeInfo(result, lotteryName)}</span>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {result.winningNumbers.map((num, i) => (
              <span key={i} className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gray-100 dark:bg-gray-700 rounded-full text-lg font-bold text-gray-800 dark:text-gray-200">
                {num}
              </span>
            ))}
            {getSpecialBallValue(result, lotteryName) && (
              <span className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full text-lg font-bold text-white ${lotteryName === 'powerball' ? 'bg-red-500' : lotteryName === 'mega-millions' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                {getSpecialBallValue(result, lotteryName)}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsTab;

