import React from 'react';

// Interface for a single result (consistent with LotteryPageClient)
interface Result {
  drawDate: string;
  winningNumbers: string[];
  powerball?: string;
  megaBall?: string;
  cashBall?: string;
}

// Updated props to accept results array
interface FrequencyTabProps {
  lotteryId: string;
  results: Result[]; // Receive results as a prop
}

const FrequencyTab: React.FC<FrequencyTabProps> = ({ lotteryId, results }) => {

  // Use the passed 'results' prop directly
  if (!results || results.length === 0) {
    return <p className="text-center text-gray-500 dark:text-gray-400 mt-4">Dados insuficientes ou indisponíveis para calcular a frequência.</p>;
  }

  const numberFrequency: { [key: string]: number } = {};
  const specialBallFrequency: { [key: string]: number } = {};

  results.forEach(result => {
    // Ensure winningNumbers is an array before iterating
    if (Array.isArray(result.winningNumbers)) {
        result.winningNumbers.forEach(num => {
            if (num) { // Check if num is not null or undefined
                numberFrequency[num] = (numberFrequency[num] || 0) + 1;
            }
        });
    }

    let specialBall: string | undefined;
    if (lotteryId === 'powerball') specialBall = result.powerball;
    else if (lotteryId === 'mega-millions') specialBall = result.megaBall;
    else if (lotteryId === 'cash4life') specialBall = result.cashBall;

    if (specialBall) {
      specialBallFrequency[specialBall] = (specialBallFrequency[specialBall] || 0) + 1;
    }
  });

  // Sort frequencies for display
  const sortedNumbers = Object.entries(numberFrequency).sort(([, a], [, b]) => b - a);
  const sortedSpecialBalls = Object.entries(specialBallFrequency).sort(([, a], [, b]) => b - a);

  const getSpecialBallName = (id: string) => {
    if (id === 'powerball') return 'Powerball';
    if (id === 'mega-millions') return 'Mega Ball';
    if (id === 'cash4life') return 'Cash Ball';
    return 'Bola Especial';
  };

  const dataSourceNote = results === (mockResultsData as any)[lotteryId as keyof typeof mockResultsData]
    ? "Nota: A frequência é calculada com base nos dados de exemplo disponíveis (API falhou ou não disponível)."
    : `Nota: A frequência é calculada com base nos últimos ${results.length} sorteios obtidos via API.`;

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-semibold text-center mb-6">Frequência dos Números</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Numbers Frequency */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-3 text-center">Números Principais</h3>
          {sortedNumbers.length > 0 ? (
            <div className="overflow-x-auto max-h-96"> {/* Added max height and scroll */}
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0"> {/* Sticky header */}
                  <tr>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Número</th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Frequência</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedNumbers.map(([number, freq]) => (
                    <tr key={`main-${number}`}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{number}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{freq}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-4">Nenhuma frequência para calcular.</p>
          )}
        </div>

        {/* Special Ball Frequency */}
        {sortedSpecialBalls.length > 0 && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-3 text-center">{getSpecialBallName(lotteryId)}</h3>
             <div className="overflow-x-auto max-h-96"> {/* Added max height and scroll */}
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0"> {/* Sticky header */}
                  <tr>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Número</th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Frequência</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedSpecialBalls.map(([number, freq]) => (
                    <tr key={`special-${number}`}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{number}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{freq}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
       <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6">{dataSourceNote}</p>
    </div>
  );
};

export default FrequencyTab;

