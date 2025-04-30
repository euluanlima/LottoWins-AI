import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import mockResultsData from '@/data/mockResults.json'; // Keep mock data as fallback reference

// Interface for a single result (consistent with LotteryPageClient)
interface Result {
  drawDate: string;
  winningNumbers: string[];
  powerball?: string;
  megaBall?: string;
  cashBall?: string;
}

// Updated props to accept results array
interface CheckerTabProps {
  lotteryId: string;
  results: Result[]; // Receive results as a prop
}

const CheckerTab: React.FC<CheckerTabProps> = ({ lotteryId, results }) => {
  // Use the passed 'results' prop directly
  const pastResults = results;

  // Determine number ranges and counts based on lotteryId
  let mainNumbersCount = 5;
  let specialBallName = '';
  if (lotteryId === 'powerball') {
    mainNumbersCount = 5;
    specialBallName = 'Powerball';
  } else if (lotteryId === 'mega-millions') {
    mainNumbersCount = 5;
    specialBallName = 'Mega Ball';
  } else if (lotteryId === 'cash4life') {
    mainNumbersCount = 5;
    specialBallName = 'Cash Ball';
  }

  const [userNumbers, setUserNumbers] = useState<string[]>(Array(mainNumbersCount).fill(''));
  const [userSpecialBall, setUserSpecialBall] = useState<string>('');
  const [checkResult, setCheckResult] = useState<string | null>(null);

  const handleNumberChange = (index: number, value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 2);
    const newUserNumbers = [...userNumbers];
    newUserNumbers[index] = numericValue;
    setUserNumbers(newUserNumbers);
  };

  const handleSpecialBallChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 2);
    setUserSpecialBall(numericValue);
  };

  const handleCheckNumbers = () => {
    setCheckResult(null);

    const filledUserNumbers = userNumbers.filter(num => num !== '');
    if (filledUserNumbers.length !== mainNumbersCount || (specialBallName && !userSpecialBall)) {
      setCheckResult('Por favor, preencha todos os números e a bola especial.');
      return;
    }

    if (!pastResults || pastResults.length === 0) {
        setCheckResult('Não há resultados disponíveis para verificação.');
        return;
    }

    let matchFound = false;
    let bestMatchText = 'Nenhuma correspondência encontrada nos últimos sorteios disponíveis.';

    for (const result of pastResults) {
      // Ensure winningNumbers is an array
      if (!Array.isArray(result.winningNumbers)) continue;

      const winningNums = result.winningNumbers;
      let specialBallMatch = false;
      let matchedCount = 0;

      // Check main numbers
      filledUserNumbers.forEach(userNum => {
        if (winningNums.includes(userNum)) {
          matchedCount++;
        }
      });

      // Check special ball
      let winningSpecialBall: string | undefined;
      if (lotteryId === 'powerball') winningSpecialBall = result.powerball;
      else if (lotteryId === 'mega-millions') winningSpecialBall = result.megaBall;
      else if (lotteryId === 'cash4life') winningSpecialBall = result.cashBall;

      if (specialBallName && winningSpecialBall && userSpecialBall === winningSpecialBall) {
        specialBallMatch = true;
      }

      if (matchedCount > 0 || specialBallMatch) {
        matchFound = true;
        let currentMatchText = `Sorteio ${result.drawDate}: Você acertou ${matchedCount} número(s)`;
        if (specialBallMatch) {
          currentMatchText += ` e a ${specialBallName}!`;
        }
        currentMatchText += '.';
        bestMatchText = currentMatchText;
        break; // Stop checking after first match
      }
    }

    setCheckResult(bestMatchText);
  };

  // Determine the source of the data for the note
  const dataSourceNote = pastResults === (mockResultsData as any)[lotteryId as keyof typeof mockResultsData]
    ? "Nota: Verificação baseada apenas nos dados de exemplo disponíveis (API falhou ou não disponível)."
    : `Nota: Verificação baseada nos últimos ${pastResults.length} sorteios obtidos via API.`;


  return (
    <div className="p-4 md:p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-center mb-6">Verificador de Bilhetes</h2>
      <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-4">Insira seus números para verificar se correspondem a algum dos últimos resultados disponíveis.</p>

      <div className="flex flex-wrap justify-center items-center gap-2 mb-4">
        {userNumbers.map((num, index) => (
          <Input
            key={`main-${index}`}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={2}
            value={num}
            onChange={(e) => handleNumberChange(index, e.target.value)}
            placeholder="00"
            className="w-14 h-14 text-center text-lg font-bold border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-full focus:ring-primary focus:border-primary"
            aria-label={`Número principal ${index + 1}`}
          />
        ))}
        {specialBallName && (
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={2}
            value={userSpecialBall}
            onChange={(e) => handleSpecialBallChange(e.target.value)}
            placeholder="00"
            className={`w-14 h-14 text-center text-lg font-bold border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-full focus:ring-primary focus:border-primary ${lotteryId === 'powerball' ? 'border-red-500' : lotteryId === 'mega-millions' ? 'border-yellow-500' : 'border-green-500'}`}
            aria-label={specialBallName}
          />
        )}
      </div>

      <div className="text-center mt-6">
        <Button onClick={handleCheckNumbers} className="bg-[hsl(var(--lotto-authority))] hover:opacity-90">
          Verificar Números
        </Button>
      </div>

      {checkResult && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
          <p className="text-blue-800 dark:text-blue-200 font-medium">{checkResult}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{dataSourceNote}</p>
        </div>
      )}
    </div>
  );
};

export default CheckerTab;

