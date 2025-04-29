'use client';

import React, { useState } from 'react';
import { getPastResults, PastResult } from '@/lib/pastResults';
import { getLotteryInfo } from '@/lib/lottery';

// Define props for the component
interface NumberMatcherComponentProps {
  lotteryId: string;
}

export default function NumberMatcherComponent({ lotteryId }: NumberMatcherComponentProps) {
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
  
  const [userNumbers, setUserNumbers] = useState<string[]>(Array(lotteryInfo.regularNumberCount).fill(''));
  const [userSpecialBall, setUserSpecialBall] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [matchResult, setMatchResult] = useState<{
    matched: boolean;
    matchedNumbers: number[];
    matchedSpecialBall: boolean;
    prize: string | null;
  } | null>(null);
  
  // Fetch only necessary data (e.g., last 15 results for the dropdown) for the specific lottery
  const pastResults = getPastResults(15, lotteryId); 
  
  // Handle input change for regular numbers - improved validation and focus management
  const handleNumberChange = (index: number, value: string) => {
    const sanitizedValue = value.replace(/[^0-9]/g, ''); // Allow only numbers
    if (sanitizedValue === '' || (parseInt(sanitizedValue) >= 1 && parseInt(sanitizedValue) <= lotteryInfo.maxRegularNumber)) {
      const newNumbers = [...userNumbers];
      newNumbers[index] = sanitizedValue;
      setUserNumbers(newNumbers);

      // Move focus to the next input if the current one is filled (2 digits)
      if (sanitizedValue.length === 2 && index < lotteryInfo.regularNumberCount - 1) {
        const nextInput = document.getElementById(`num-input-${index + 1}`);
        nextInput?.focus();
      }
    }
  };
  
  // Handle input change for Special Ball - improved validation and focus management
  const handleSpecialBallChange = (value: string) => {
    const sanitizedValue = value.replace(/[^0-9]/g, ''); // Allow only numbers
    if (sanitizedValue === '' || (parseInt(sanitizedValue) >= 1 && parseInt(sanitizedValue) <= lotteryInfo.maxSpecialNumber)) {
      setUserSpecialBall(sanitizedValue);
      // Optionally move focus to the date select or check button
      if (sanitizedValue.length === 2) {
         const dateSelect = document.getElementById('date-select');
         dateSelect?.focus();
      }
    }
  };
  
  // Check for matches - Simplified logic and clearer feedback
  const checkMatches = () => {
    setMatchResult(null); // Clear previous result first
    if (!selectedDate) {
      alert('Por favor, selecione uma data de sorteio.');
      return;
    }
    if (userNumbers.some(num => num === '') || userSpecialBall === '') {
        alert(`Por favor, preencha todos os ${lotteryInfo.regularNumberCount} números regulares e ${lotteryInfo.specialBallName}.`);
        return;
    }
    
    const result = pastResults.find(r => r.drawDate === selectedDate);
    if (!result) {
      // This should ideally not happen if the dropdown is populated correctly
      alert('Erro: Data de sorteio não encontrada nos dados disponíveis.');
      return;
    }
    
    const drawnNumbers = result.numbers.split('-').map(n => parseInt(n.trim()));
    const drawnSpecialBall = parseInt(result.specialBall.trim());
    
    const userNumbersInt = userNumbers.map(n => parseInt(n));
    const userSpecialBallInt = parseInt(userSpecialBall);
    
    const matchedNumbers = userNumbersInt.filter(num => drawnNumbers.includes(num));
    const matchedSpecialBall = userSpecialBallInt === drawnSpecialBall;
    
    // Determine prize based on matches (Simplified prize structure for example)
    // Note: Prize structures vary by lottery, this is a simplified example
    let prize: string | null = null;
    const matchCount = matchedNumbers.length;

    // Different prize structures based on lottery type
    if (lotteryId === 'mega-millions' || lotteryId === 'powerball') {
      if (matchCount === 5 && matchedSpecialBall) prize = 'Jackpot!';
      else if (matchCount === 5) prize = '$1,000,000';
      else if (matchCount === 4 && matchedSpecialBall) prize = '$10,000';
      else if (matchCount === 4) prize = '$500';
      else if (matchCount === 3 && matchedSpecialBall) prize = '$200';
      else if (matchCount === 3) prize = '$10';
      else if (matchCount === 2 && matchedSpecialBall) prize = '$10';
      else if (matchCount === 1 && matchedSpecialBall) prize = '$4';
      else if (matchedSpecialBall) prize = '$2';
    } else if (lotteryId === 'cash4life') {
      if (matchCount === 5 && matchedSpecialBall) prize = '$1,000 por dia para a vida!';
      else if (matchCount === 5) prize = '$1,000 por semana para a vida!';
      else if (matchCount === 4 && matchedSpecialBall) prize = '$2,500';
      else if (matchCount === 4) prize = '$500';
      else if (matchCount === 3 && matchedSpecialBall) prize = '$100';
      else if (matchCount === 3) prize = '$25';
      else if (matchCount === 2 && matchedSpecialBall) prize = '$10';
      else if (matchCount === 2) prize = '$4';
      else if (matchCount === 1 && matchedSpecialBall) prize = '$2';
    }
    
    setMatchResult({
      matched: matchCount > 0 || matchedSpecialBall,
      matchedNumbers: matchedNumbers,
      matchedSpecialBall: matchedSpecialBall,
      prize: prize
    });
  };
  
  // Clear all inputs
  const clearInputs = () => {
    setUserNumbers(Array(lotteryInfo.regularNumberCount).fill(''));
    setUserSpecialBall('');
    setSelectedDate('');
    setMatchResult(null);
    // Focus the first input after clearing
    document.getElementById('num-input-0')?.focus();
  };
  
  return (
    <div className="p-4 sm:p-6 rounded-lg border bg-card shadow-sm space-y-6">
      {/* Section Title and Description - Use lottery name */}
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Verificador de Números</h2>
        <p className="text-base sm:text-lg text-muted-foreground">Verifique se seus números da {lotteryInfo.name} foram premiados.</p>
      </div>
      
      {/* Help text with icon - Use lottery specific info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
        <div className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0 mt-0.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-base">
            Digite os {lotteryInfo.regularNumberCount} números regulares e {lotteryInfo.specialBallName} do seu bilhete. Depois, selecione a data do sorteio e clique em "Verificar" para ver se você ganhou.
          </p>
        </div>
      </div>
      
      {/* Number Input Section - Simplified and Larger */}
      <div className="space-y-5 pt-4 border-t">
        {/* Regular Numbers Input - Dynamic based on lottery */}
        <div>
          <label className="block text-lg font-semibold text-foreground mb-2">
            1. Digite seus {lotteryInfo.regularNumberCount} Números Regulares (1-{lotteryInfo.maxRegularNumber})
          </label>
          <div className="flex flex-wrap gap-3">
            {userNumbers.map((num, index) => (
              <input
                id={`num-input-${index}`}
                key={`num-${index}`}
                type="tel" // Use tel for numeric keyboard on mobile
                inputMode="numeric" // Hint for numeric keyboard
                value={num}
                onChange={(e) => handleNumberChange(index, e.target.value)}
                className="w-14 h-14 sm:w-16 sm:h-16 text-center text-xl font-semibold rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                maxLength={2}
                placeholder="--"
              />
            ))}
          </div>
        </div>
        
        {/* Special Ball Input - Use lottery specific name */}
        <div>
          <label className="block text-lg font-semibold text-foreground mb-2">
            2. Digite {lotteryInfo.specialBallName} (1-{lotteryInfo.maxSpecialNumber})
          </label>
          <input
            id="specialball-input"
            type="tel"
            inputMode="numeric"
            value={userSpecialBall}
            onChange={(e) => handleSpecialBallChange(e.target.value)}
            className="w-14 h-14 sm:w-16 sm:h-16 text-center text-xl font-semibold rounded-lg border-2 border-yellow-400 bg-yellow-50 focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600 outline-none transition-colors"
            maxLength={2}
            placeholder="--"
          />
        </div>
        
        {/* Date Selection */}
        <div>
          <label htmlFor="date-select" className="block text-lg font-semibold text-foreground mb-2">3. Selecione a Data do Sorteio</label>
          <select
            id="date-select"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full max-w-md p-3 text-lg rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors bg-white"
          >
            <option value="">-- Selecione a data --</option>
            {pastResults.map((result, index) => (
              <option key={`date-${index}`} value={result.drawDate}>
                {result.drawDate}
              </option>
            ))}
          </select>
        </div>
        
        {/* Action Buttons - Larger and Clearer */}
        <div className="flex flex-col sm:flex-row gap-3 pt-3">
          <button
            onClick={checkMatches}
            className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-md transition-colors duration-200 flex-1 disabled:opacity-60"
            disabled={!selectedDate || userNumbers.some(num => num === '') || userSpecialBall === ''}
          >
            Verificar Números
          </button>
          <button
            onClick={clearInputs}
            className="px-6 py-3 rounded-lg bg-gray-500 hover:bg-gray-600 text-white font-bold text-lg shadow-md transition-colors duration-200"
          >
            Limpar Tudo
          </button>
        </div>
      </div>
      
      {/* Results Section - Simplified and Clearer */}
      {matchResult && (
        <div className="mt-6 p-4 rounded-lg border-2 border-gray-300 bg-gray-50 space-y-3">
          <h3 className="text-xl font-semibold text-foreground text-center mb-3">Resultado da Verificação ({selectedDate})</h3>
          
          {matchResult.matched ? (
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-green-700">
                Parabéns!
                {matchResult.matchedNumbers.length > 0 && (
                  ` Você acertou ${matchResult.matchedNumbers.length} número(s) regular(es)${matchResult.matchedSpecialBall ? ' e' : ''}`
                )}
                {matchResult.matchedSpecialBall && (
                  ` ${lotteryInfo.specialBallName}!`
                )}
                {!matchResult.matchedNumbers.length && matchResult.matchedSpecialBall && (
                    ` Você acertou ${lotteryInfo.specialBallName}!`
                )}
              </p>
              
              {matchResult.prize && (
                <div className="p-3 bg-green-100 border border-green-300 rounded-lg inline-block">
                  <p className="text-xl font-bold text-green-800">
                    Prêmio Estimado: {matchResult.prize}
                  </p>
                </div>
              )}
              {!matchResult.prize && (
                 <p className="text-base text-muted-foreground">Nenhum prêmio ganho com esta combinação.</p>
              )}
            </div>
          ) : (
            <p className="text-lg text-center text-red-700 font-semibold">
              Infelizmente, você não acertou nenhum número neste sorteio.
            </p>
          )}
          
          <div className="pt-3 border-t text-center">
            <p className="text-sm text-muted-foreground">
              Nota: Este é um verificador não oficial. Confirme os resultados no site oficial da loteria.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
