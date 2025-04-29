'use client';

import React from 'react';
import { getPrizeLevels } from '@/lib/prizeMatrix';
import { getLotteryInfo } from '@/lib/lottery';

// Define props for the component
interface PrizeMatrixComponentProps {
  lotteryId: string;
}

export default function PrizeMatrixComponent({ lotteryId }: PrizeMatrixComponentProps) {
  // Get lottery info and prize levels for the specific lottery
  const lotteryInfo = getLotteryInfo(lotteryId);
  const prizeLevels = getPrizeLevels(lotteryId);
  
  // Handle case where lotteryInfo is not found (though unlikely if routing is correct)
  if (!lotteryInfo) {
    return (
      <div className="p-6 rounded-lg border bg-card shadow-sm">
        <p className="text-lg text-muted-foreground">Informações da loteria "{lotteryId}" não encontradas.</p>
      </div>
    );
  }

  // Check if we have prize levels for this lottery
  if (!prizeLevels || prizeLevels.length === 0) {
    return (
      <div className="p-6 rounded-lg border bg-card shadow-sm">
        <p className="text-lg text-muted-foreground">Matriz de prêmios não disponível para {lotteryInfo.name}.</p>
      </div>
    );
  }

  // Determine if this lottery has a multiplier option
  const hasMultiplier = prizeLevels[0].multiplierPrizes !== undefined;
  // Get multiplier keys if available (e.g., x2, x3, x4, x5)
  const multiplierKeys = hasMultiplier && prizeLevels[0].multiplierPrizes 
    ? Object.keys(prizeLevels[0].multiplierPrizes) 
    : [];

  return (
    <div className="p-4 sm:p-6 rounded-lg border bg-card shadow-sm space-y-6">
      {/* Section Title and Description - Use lottery name */}
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Matriz de Prêmios ({lotteryInfo.name})</h2>
        <p className="text-base sm:text-lg text-muted-foreground">
          Detalhes sobre os prêmios, chances 
          {hasMultiplier && ` e a opção ${lotteryInfo.multiplierName}`}.
        </p>
      </div>

      {/* Help text with icon - Use lottery specific info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
        <div className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0 mt-0.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-base">
            Consulte a tabela abaixo para ver os diferentes níveis de prêmios da {lotteryInfo.name}, as chances de ganhar cada um
            {hasMultiplier && ` e como o ${lotteryInfo.multiplierName} (opção extra) pode multiplicar os prêmios (exceto o Jackpot)`}.
          </p>
        </div>
      </div>

      {/* Prize Matrix Table - Simplified and Accessible */}
      <div className="overflow-x-auto pt-4 border-t">
        <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">Níveis de Prêmio</h3>
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <table className="min-w-full text-base text-left">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-3 sm:px-5 sm:py-4">Acertos</th>
                <th className="px-4 py-3 sm:px-5 sm:py-4">Prêmio Base</th>
                <th className="px-4 py-3 sm:px-5 sm:py-4">Chances (1 em)</th>
                {/* Render multiplier columns only if this lottery has multipliers */}
                {hasMultiplier && multiplierKeys.map(key => (
                  <th key={key} className="px-4 py-3 sm:px-5 sm:py-4">
                    Com {lotteryInfo.multiplierName} {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-foreground bg-white">
              {prizeLevels.map((level, index) => (
                <tr key={index} className={`border-b last:border-b-0 ${index % 2 !== 0 ? 'bg-gray-50' : ''}`}>
                  <td className="px-4 py-3 sm:px-5 sm:py-4 font-medium whitespace-nowrap">{level.matches}</td>
                  <td className="px-4 py-3 sm:px-5 sm:py-4 whitespace-nowrap">{level.prize}</td>
                  {/* Format odds for better readability */}
                  <td className="px-4 py-3 sm:px-5 sm:py-4 whitespace-nowrap">
                    {parseInt(level.odds.split(' ')[2].replace(/,/g, '')).toLocaleString('pt-BR')}
                  </td>
                  {/* Render multiplier values only if this lottery has multipliers */}
                  {hasMultiplier && multiplierKeys.map(key => (
                    <td key={key} className="px-4 py-3 sm:px-5 sm:py-4 whitespace-nowrap">
                      {level.multiplierPrizes && level.multiplierPrizes[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* General Info - Simplified */}
      <div className="pt-4 border-t">
        <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">Informações Gerais da {lotteryInfo.name}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-base bg-gray-50 p-4 rounded-lg border">
          <div className="flex justify-between"><span className="font-medium text-gray-700">Sorteios:</span> <span className="text-right">{lotteryInfo.drawDays}</span></div>
          <div className="flex justify-between"><span className="font-medium text-gray-700">Preço do Bilhete:</span> <span className="text-right">{lotteryInfo.ticketPrice}</span></div>
          {hasMultiplier && (
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Opção {lotteryInfo.multiplierName}:</span> 
              <span className="text-right">{lotteryInfo.multiplierOption}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Faixa de Números:</span> 
            <span className="text-right">1-{lotteryInfo.maxRegularNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Faixa da {lotteryInfo.specialBallName}:</span> 
            <span className="text-right">1-{lotteryInfo.maxSpecialNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Chances Gerais de Ganhar:</span> 
            <span className="text-right">{lotteryInfo.overallOdds || "Varia"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
