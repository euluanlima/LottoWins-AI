
'use client';

import React, { useState } from 'react';
import Link from 'next/link'; import Image from 'next/image'; // Import Image component
import SmartPickComponent from '@/components/SmartPick';
import PastResultsComponent from '@/components/PastResults';
import FrequencyChartComponent from '@/components/FrequencyChart';
import NumberMatcherComponent from '@/components/NumberMatcher';
import PrizeMatrixComponent from '@/components/PrizeMatrix';

// Define the available tabs
type Tab = 'Previsões' | 'Resultados' | 'Frequência' | 'Verificador' | 'Prêmios';

// Define lottery names based on IDs for display
const lotteryNames: { [key: string]: string } = {
  'mega-millions': 'Mega Millions',
  'powerball': 'Powerball',
  'cash4life': 'Cash4Life',
};

// Define lottery logo paths based on IDs
const lotteryLogos: { [key: string]: string } = {
  'mega-millions': '/logos/mega-millions-official.png',
  'powerball': '/logos/powerball-official.png',
  'cash4life': '/logos/cash4life-official.png',
};

// Props for the client component
interface LotteryPageClientProps {
  lotteryId: string;
}

// Client Component for a specific lottery
export default function LotteryPageClient({ lotteryId }: LotteryPageClientProps) {
  const lotteryName = lotteryNames[lotteryId] || 'Loteria Desconhecida'; // Get display name
  const [activeTab, setActiveTab] = useState<Tab>('Previsões');

  // Pass lotteryId to components
  const renderContent = () => {
    switch (activeTab) {
      case 'Previsões':
        return <SmartPickComponent lotteryId={lotteryId} />;
      case 'Resultados':
        return <PastResultsComponent lotteryId={lotteryId} />;
      case 'Frequência':
        return <FrequencyChartComponent lotteryId={lotteryId} />;
      case 'Verificador':
        return <NumberMatcherComponent lotteryId={lotteryId} />;
      case 'Prêmios':
        return <PrizeMatrixComponent lotteryId={lotteryId} />;
      default:
        return <SmartPickComponent lotteryId={lotteryId} />;
    }
  };

  const tabs: Tab[] = ['Previsões', 'Resultados', 'Frequência', 'Verificador', 'Prêmios'];

  // Handle case where lotteryId is invalid (optional, but good practice)
  if (!lotteryNames[lotteryId]) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600">Loteria Inválida</h1>
        <p className="text-lg text-muted-foreground mt-2">A loteria "{lotteryId}" não foi encontrada.</p>
        <Link href="/" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Voltar para Seleção</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full p-4 sm:p-6">
      {/* Header with Back Button and Lottery Logo */}
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <Link href="/" className="text-lg text-blue-600 hover:underline w-32 shrink-0">
          &larr; Voltar para Seleção
        </Link>
        <div className="flex-grow flex justify-center">
          <Image 
            src={lotteryLogos[lotteryId]} 
            alt={lotteryName} 
            width={300} // Larger intrinsic width
            height={80}  // Larger intrinsic height
            priority // Prioritize loading header logo
            className="h-12 sm:h-16 w-auto max-w-full" // Responsive height, auto width
          />
        </div>
        {/* Placeholder to balance the flex layout, same width as back button */}
        <div className="w-32 shrink-0"></div> 
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border mb-6">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                ${activeTab === tab
                  ? 'border-[hsl(var(--lotto-authority))] text-[hsl(var(--lotto-authority))]'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                }
                whitespace-nowrap py-3 px-3 sm:px-4 border-b-2 font-semibold text-lg sm:text-xl focus:outline-none transition-colors duration-200
              `}
              aria-current={activeTab === tab ? 'page' : undefined}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area based on active tab */}
      <div className="mt-4">
        {renderContent()}
      </div>
    </div>
  );
}

