
'use client';

import React, { useState } from 'react';
import { 
  getPastResults, 
  PastResult 
} from '@/lib/pastResults';
import { 
  LotteryInfo, 
  getLotteryInfo 
} from '@/lib/lottery';
import Link from 'next/link'; // Import Link for buttons

// Modal component (remains the same)
function Modal({ isOpen, onClose, title, children }: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode 
}) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-[hsl(var(--border))] flex justify-between items-center sticky top-0 bg-card z-10">
          <h3 className="text-xl font-bold text-card-foreground">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label="Fechar modal"
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

interface PastResultsComponentProps {
  lotteryId: string;
}

export default function PastResultsComponent({ lotteryId }: PastResultsComponentProps) {
  const [resultsLimit, setResultsLimit] = useState(5);
  const pastResults = getPastResults(resultsLimit, lotteryId);
  const lotteryInfo = getLotteryInfo(lotteryId);

  const handleLoadMore = () => {
    setResultsLimit(prev => Math.min(prev + 5, 15)); 
  };

  if (!lotteryInfo) {
     return (
        <div className="p-6 rounded-lg border border-[hsl(var(--border))] bg-card shadow-sm">
            <p className="text-lg text-muted-foreground">Informações da loteria "{lotteryId}" não encontradas.</p>
        </div>
    ); 
  }

  return (
    <div className="p-4 sm:p-6 rounded-lg border border-[hsl(var(--border))] bg-card shadow-sm space-y-6">
      <div className="text-center border-b border-[hsl(var(--border))] pb-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Resultados Anteriores ({lotteryInfo.name})</h2>
        <p className="text-base sm:text-lg text-muted-foreground">Últimos sorteios da {lotteryInfo.name}.</p>
      </div>
      
      {/* Help text removed for cleaner look, similar to reference */}
      
      <div className="space-y-4">
        {pastResults.map((result, index) => (
          <ResultCard key={`${lotteryId}-${index}`} result={result} lotteryInfo={lotteryInfo} />
        ))}
      </div>
      
      {resultsLimit < 15 && (
        <div className="flex justify-center pt-4">
          <button
            onClick={handleLoadMore}
            className="btn bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-primary-foreground w-full max-w-xs"
          >
            Carregar Mais Resultados
          </button>
        </div>
      )}
    </div>
  );
}

// Updated ResultCard to match LotteryUSA style
function ResultCard({ result, lotteryInfo }: { result: PastResult; lotteryInfo: LotteryInfo }) {
  const numbers = result.numbers.split('-');
  const specialBall = result.specialBall;
  const specialBallName = lotteryInfo.specialBallName;
  
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPaymentsModal, setShowPaymentsModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  
  return (
    <div className="p-4 rounded-lg border border-[hsl(var(--border))] bg-card shadow-sm">
      {/* Header: Lottery Name (Optional, if needed), Date */}
      <div className="mb-3">
        {/* <h3 className="text-xl font-semibold text-foreground">{lotteryInfo.name}</h3> */}
        <p className="text-base text-muted-foreground">{result.drawDate}</p>
      </div>
      
      {/* Numbers - Larger and centered */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap my-4">
        {numbers.map((num, i) => (
          <span 
            key={`num-${i}-${num}`}
            className="lottery-ball lottery-ball-regular text-xl w-10 h-10 sm:w-12 sm:h-12"
          >
            {num}
          </span>
        ))}
        {specialBall && (
          <span 
            title={specialBallName}
            className="lottery-ball lottery-ball-special text-xl w-10 h-10 sm:w-12 sm:h-12"
          >
            {specialBall}
          </span>
        )}
      </div>
      
      {/* Jackpot and Multiplier Info */}
      <div className="text-center mb-4">
        <p className="text-lg text-foreground">Jackpot: <span className="font-bold">{result.jackpot}</span></p>
        {result.multiplier !== 'N/A' && (
          <p className="text-base text-muted-foreground mt-1">
            Multiplicador: {result.multiplier}
          </p>
        )}
      </div>

      {/* Action Button - Link to lottery page (example) */}
      <div className="mt-4 pt-4 border-t border-[hsl(var(--border))] flex justify-center">
         <Link href={`/${lotteryInfo.id}`} passHref>
             <button className="btn bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-primary-foreground">
                 Ir para {lotteryInfo.name}
             </button>
         </Link>
        {/* Removed old action buttons for simplicity, matching reference */}
        {/* <button onClick={() => setShowDetailsModal(true)} ...>Ver Detalhes</button> */}
        {/* <button onClick={() => setShowPaymentsModal(true)} ...>Pagamentos</button> */}
        {/* <button onClick={() => setShowVerifyModal(true)} ...>Verificar Bilhete</button> */}
      </div>
      
      {/* Modals remain available if needed later, but buttons are removed for now */}
      {/* <Modal isOpen={showDetailsModal} ... /> */}
      {/* <Modal isOpen={showPaymentsModal} ... /> */}
      {/* <Modal isOpen={showVerifyModal} ... /> */}
    </div>
  );
}

