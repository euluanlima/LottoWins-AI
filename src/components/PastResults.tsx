
'use client';

import React, { useState } from 'react';
// Import necessary types and functions from lottery lib
import { 
  getPastResults, 
  PastResult 
} from '@/lib/pastResults';
import { 
  LotteryInfo, 
  getLotteryInfo 
} from '@/lib/lottery'; // Import LotteryInfo and getter

// Modal component (remains the same)
function Modal({ isOpen, onClose, title, children }: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode 
}) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// Define props for the component
interface PastResultsComponentProps {
  lotteryId: string;
}

// Modify component to accept lotteryId prop
export default function PastResultsComponent({ lotteryId }: PastResultsComponentProps) {
  const [resultsLimit, setResultsLimit] = useState(5);
  // Pass lotteryId to getPastResults
  const pastResults = getPastResults(resultsLimit, lotteryId);
  // Get lottery info for display
  const lotteryInfo = getLotteryInfo(lotteryId);

  const handleLoadMore = () => {
    // Assuming all lists have at least 15 results for now
    setResultsLimit(prev => Math.min(prev + 5, 15)); 
  };

  // Handle case where lotteryInfo is not found (though unlikely if routing is correct)
  if (!lotteryInfo) {
     return (
        <div className="p-6 rounded-lg border bg-card shadow-sm">
            <p className="text-lg text-muted-foreground">Informações da loteria "{lotteryId}" não encontradas.</p>
        </div>
    ); 
  }

  return (
    <div className="p-4 sm:p-6 rounded-lg border bg-card shadow-sm space-y-6">
      {/* Section Title and Description - Use lotteryInfo.name */}
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Resultados Anteriores ({lotteryInfo.name})</h2>
        <p className="text-base sm:text-lg text-muted-foreground">Últimos sorteios da {lotteryInfo.name}.</p>
      </div>
      
      {/* Help text - Use lotteryInfo.name */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
        <div className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 flex-shrink-0 mt-0.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-base">
            Confira os resultados dos sorteios anteriores da {lotteryInfo.name}. Você pode usar esses dados para analisar padrões e tendências nos números sorteados.
          </p>
        </div>
      </div>
      
      {/* Results Cards - Pass lotteryInfo to ResultCard */}
      <div className="space-y-4">
        {pastResults.map((result, index) => (
          <ResultCard key={`${lotteryId}-${index}`} result={result} lotteryInfo={lotteryInfo} />
        ))}
      </div>
      
      {/* Load More Button */}
      {/* Check against the actual length of the source data if possible, or keep max 15 */}
      {resultsLimit < 15 && (
        <div className="flex justify-center pt-2">
          <button
            onClick={handleLoadMore}
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-md transition-colors duration-200 w-full max-w-sm"
          >
            Carregar Mais Resultados
          </button>
        </div>
      )}
    </div>
  );
}

// Modify ResultCard to accept lotteryInfo
function ResultCard({ result, lotteryInfo }: { result: PastResult; lotteryInfo: LotteryInfo }) {
  const numbers = result.numbers.split('-');
  const specialBall = result.specialBall; // Use generic name from data
  const specialBallName = lotteryInfo.specialBallName; // Get specific name from lotteryInfo
  
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPaymentsModal, setShowPaymentsModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  
  return (
    <div className="p-4 rounded-lg border bg-secondary/30 shadow-sm">
      {/* Header (Date, Jackpot, Multiplier) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground">{result.drawDate}</h3>
          <p className="text-base text-muted-foreground mt-1">Jackpot: {result.jackpot}</p>
        </div>
        {/* Conditionally show multiplier if it's not N/A */}
        {result.multiplier !== 'N/A' && (
          <div className="mt-2 sm:mt-0">
            <span className="px-3 py-1 rounded-md text-base font-semibold bg-purple-600 text-white">
              Multiplicador: {result.multiplier}
            </span>
          </div>
        )}
      </div>
      
      {/* Numbers */}
      <div className="flex items-center gap-2 flex-wrap">
        {numbers.map((num, i) => (
          <span 
            key={`num-${i}-${num}`}
            className="lottery-ball lottery-ball-regular"
          >
            {num}
          </span>
        ))}
        {/* Special Ball - Use specialBallName in title */}
        <span 
          title={specialBallName} // Add tooltip
          className="lottery-ball lottery-ball-special"
        >
          {specialBall}
        </span>
      </div>
      
      {/* Actions */}
      <div className="mt-4 pt-3 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <button 
          onClick={() => setShowDetailsModal(true)}
          className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 text-base font-medium transition-colors"
        >
          Ver Detalhes
        </button>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <button 
            onClick={() => setShowPaymentsModal(true)}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 text-base font-medium transition-colors"
          >
            Pagamentos
          </button>
          <button 
            onClick={() => setShowVerifyModal(true)}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 text-base font-medium transition-colors"
          >
            Verificar Bilhete
          </button>
        </div>
      </div>
      
      {/* Details Modal - Use specialBallName */}
      <Modal 
        isOpen={showDetailsModal} 
        onClose={() => setShowDetailsModal(false)}
        title={`Detalhes do Sorteio (${lotteryInfo.name}) - ${result.drawDate}`}
      >
         <div className="space-y-4">
          <div className="p-4 bg-secondary/30 rounded-lg">
            <h4 className="text-lg font-semibold mb-2">Informações do Sorteio</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Data do Sorteio</p>
                <p className="text-base font-medium">{result.drawDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Jackpot</p>
                <p className="text-base font-medium">{result.jackpot}</p>
              </div>
              {/* Conditionally show multiplier */}
              {result.multiplier !== 'N/A' && (
                <div>
                  <p className="text-sm text-muted-foreground">Multiplicador</p>
                  <p className="text-base font-medium">{result.multiplier}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Números Sorteados</p>
                <div className="flex items-center gap-1 mt-1">
                  {numbers.map((num, i) => (
                    <span 
                      key={`detail-num-${i}-${num}`}
                      className="lottery-ball lottery-ball-regular text-sm w-8 h-8"
                    >
                      {num}
                    </span>
                  ))}
                  <span 
                    title={specialBallName}
                    className="lottery-ball lottery-ball-special text-sm w-8 h-8"
                  >
                    {specialBall}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-secondary/30 rounded-lg">
            <h4 className="text-lg font-semibold mb-2">Estatísticas</h4>
            <p className="text-base">
              Este sorteio da {lotteryInfo.name} teve um jackpot de {result.jackpot}. Os números sorteados foram {result.numbers}-{specialBall}
              {result.multiplier !== 'N/A' ? `, com um multiplicador de ${result.multiplier}.` : '.'}
            </p>
            <p className="text-base mt-2">
              Informações adicionais sobre este sorteio estarão disponíveis em breve.
            </p>
          </div>
        </div>
      </Modal>
      
      {/* Payments Modal - Use specialBallName, adjust based on lottery */}
      {/* TODO: Payment structure varies significantly between lotteries. This is a placeholder. */}
      <Modal 
        isOpen={showPaymentsModal} 
        onClose={() => setShowPaymentsModal(false)}
        title={`Pagamentos (${lotteryInfo.name}) - ${result.drawDate}`}
      >
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="p-3 text-left font-semibold border">Acertos</th>
                  <th className="p-3 text-left font-semibold border">Prêmio</th>
                  {result.multiplier !== 'N/A' && (
                    <th className="p-3 text-left font-semibold border">Com Multiplicador ({result.multiplier})</th>
                  )}
                  <th className="p-3 text-left font-semibold border">Ganhadores (Exemplo)</th>
                </tr>
              </thead>
              <tbody>
                {/* Example Rows - Needs real data structure per lottery */}
                <tr>
                  <td className="p-3 border">5 + {specialBallName}</td>
                  <td className="p-3 border">{result.jackpot}</td>
                  {result.multiplier !== 'N/A' && <td className="p-3 border">Não aplicável</td>}
                  <td className="p-3 border">0-1</td>
                </tr>
                <tr>
                  <td className="p-3 border">5</td>
                  <td className="p-3 border">$1,000,000+</td>
                  {result.multiplier !== 'N/A' && <td className="p-3 border">$2,000,000+</td>}
                  <td className="p-3 border">1-5</td>
                </tr>
                 <tr>
                  <td className="p-3 border">4 + {specialBallName}</td>
                  <td className="p-3 border">$10,000+</td>
                  {result.multiplier !== 'N/A' && <td className="p-3 border">Variável</td>}
                  <td className="p-3 border">10-50</td>
                </tr>
                {/* Add more rows based on specific lottery prize structure */}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground">
            * Os valores e estruturas de prêmios variam por loteria e sorteio. Consulte o site oficial da {lotteryInfo.name} para informações precisas.
          </p>
        </div>
      </Modal>
      
      {/* Verify Ticket Modal - Use lotteryInfo for limits */}
      <Modal 
        isOpen={showVerifyModal} 
        onClose={() => setShowVerifyModal(false)}
        title={`Verificar Bilhete (${lotteryInfo.name}) - ${result.drawDate}`}
      >
         <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
            <p className="text-base">
              Insira os números do seu bilhete da {lotteryInfo.name} para verificar se você ganhou neste sorteio.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-lg font-semibold">Números Sorteados</h4>
            <div className="flex items-center gap-2 flex-wrap">
              {numbers.map((num, i) => (
                <span 
                  key={`verify-drawn-${i}-${num}`}
                  className="lottery-ball lottery-ball-regular"
                >
                  {num}
                </span>
              ))}
              <span 
                title={specialBallName}
                className="lottery-ball lottery-ball-special"
              >
                {specialBall}
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-lg font-semibold">Seus Números</h4>
            <div className="grid grid-cols-6 gap-2">
              {/* Adjust number of inputs if needed, assuming 5 main numbers */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={`number-input-${i}`} className="col-span-1">
                  <input 
                    type="number" 
                    min="1" 
                    max={lotteryInfo.maxRegularNumber} // Use lottery max number
                    placeholder={`#${i}`}
                    className="w-full p-2 text-center text-lg font-medium border rounded-md"
                  />
                </div>
              ))}
              <div className="col-span-1">
                <input 
                  type="number" 
                  min="1" 
                  max={lotteryInfo.maxSpecialNumber} // Use lottery max special number
                  placeholder={specialBallName.substring(0, 2).toUpperCase()} // e.g., MB, PB, CB
                  title={specialBallName}
                  className="w-full p-2 text-center text-lg font-medium border rounded-md bg-yellow-50"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-center pt-2">
            {/* TODO: Implement actual verification logic */}
            <button
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-md transition-colors duration-200 w-full max-w-sm disabled:opacity-50"
              disabled // Disable until logic is implemented
            >
              Verificar Bilhete (Em breve)
            </button>
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            Esta é uma simulação. Para verificações oficiais, consulte o site da {lotteryInfo.name}.
          </p>
        </div>
      </Modal>
    </div>
  );
}

