
'use client';

import React, { useState, useEffect } from 'react'; // Import useEffect
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Loader2 } from 'lucide-react'; // Import Loader2 for loading state
import SmartPickComponent from '@/components/SmartPick';
import ResultsTab from '@/components/ResultsTab';
import FrequencyTab from '@/components/FrequencyTab';
import CheckerTab from '@/components/CheckerTab';
import PrizesTab from '@/components/PrizesTab';

// Import mock data as fallback
import mockResultsData from '@/data/mockResults.json';

// Define the available tabs
type Tab = 'Previsões' | 'Resultados' | 'Frequência' | 'Verificador' | 'Prêmios';

// Define lottery details
const lotteryDetails: { [key: string]: { name: string; logo: string; logoLarge: string } } = {
  'mega-millions': { name: 'Mega Millions', logo: '/logos/mega-millions-logo.png', logoLarge: '/logos/mega-millions-logo-large.png' },
  'powerball': { name: 'Powerball', logo: '/logos/powerball-logo.png', logoLarge: '/logos/powerball-logo-large.png' },
  'cash4life': { name: 'Cash4Life', logo: '/logos/cash4life-logo.png', logoLarge: '/logos/cash4life-logo-large.png' },
};

// Define structure for results (used by both API and mock)
interface Result {
  drawDate: string;
  winningNumbers: string[];
  powerball?: string;
  megaBall?: string;
  cashBall?: string;
  // Add other potential fields if needed
}

// Props for the client component
interface LotteryPageClientProps {
  lotteryId: string;
}

// Client Component for a specific lottery
export default function LotteryPageClient({ lotteryId }: LotteryPageClientProps) {
  const details = lotteryDetails[lotteryId];
  const [activeTab, setActiveTab] = useState<Tab>('Previsões');
  const [results, setResults] = useState<Result[]>([]); // State for results (API or mock)
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Load mock results directly instead of fetching from non-existent API
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    try {
      // Directly use mock data based on lotteryId
      const fallbackData = (mockResultsData as any)[lotteryId as keyof typeof mockResultsData] || [];
      setResults(fallbackData);
      if (fallbackData.length === 0) {
        console.warn(`No mock data found for lottery ID: ${lotteryId}`);
        // Optionally set an error or leave results empty
      }
    } catch (err) {
      console.error("Error loading mock results:", err);
      let errorMessage = "An unknown error occurred while loading mock results.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setResults([]); // Ensure results are empty on error
    } finally {
      // Simulate a small delay for loading state if needed, otherwise set false directly
      // setTimeout(() => setIsLoading(false), 300); // Optional simulated delay
       setIsLoading(false); 
    }
  }, [lotteryId]); // Re-run effect if lotteryId changes

  // Render content based on active tab, passing fetched results
  const renderContent = () => {
    if (isLoading && activeTab !== 'Previsões' && activeTab !== 'Prêmios') {
      return (
        <div className="flex justify-center items-center p-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Carregando resultados...</span>
        </div>
      );
    }

    if (error && activeTab !== 'Previsões' && activeTab !== 'Prêmios') {
      return (
        <div className="p-4 text-center text-red-600 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
          <p>Erro ao buscar resultados: {error}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Exibindo dados de exemplo como fallback.</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'Previsões':
        return <SmartPickComponent lotteryId={lotteryId} />;
      case 'Resultados':
        return <ResultsTab results={results} lotteryName={lotteryId} />;
      case 'Frequência':
        // FrequencyTab now needs the results data to calculate frequency
        return <FrequencyTab lotteryId={lotteryId} results={results} />;
      case 'Verificador':
        // CheckerTab now needs the results data to check against
        return <CheckerTab lotteryId={lotteryId} results={results} />;
      case 'Prêmios':
        // PrizesTab uses its own mock data source
        return <PrizesTab lotteryId={lotteryId} />;
      default:
        return <SmartPickComponent lotteryId={lotteryId} />;
    }
  };

  const tabs: Tab[] = ['Previsões', 'Resultados', 'Frequência', 'Verificador', 'Prêmios'];

  // Handle case where lotteryId is invalid
  if (!details) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600">Loteria Inválida</h1>
        <p className="text-lg text-muted-foreground mt-2">A loteria "{lotteryId}" não foi encontrada.</p>
        <Link href="/" className="mt-4 inline-flex items-center px-4 py-2 bg-[hsl(var(--lotto-authority))] text-white rounded-lg hover:opacity-90 transition-opacity">
          <ArrowLeft className="mr-2 h-5 w-5" /> Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-start mb-3 sm:mb-4 border-b pb-3 sm:pb-4">
        <Link href="/" className="flex items-center justify-center p-3 rounded-full hover:bg-muted transition-colors text-[hsl(var(--lotto-authority))] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" aria-label="Voltar para Seleção">
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only sm:not-sr-only sm:ml-2 font-medium">Voltar</span>
        </Link>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border mb-4 sm:mb-6 overflow-hidden">
        <nav className="-mb-px flex space-x-4 sm:space-x-6 overflow-x-auto pb-2 justify-start" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                whitespace-nowrap py-3 px-3 sm:px-4 border-b-2 font-semibold text-sm sm:text-base focus:outline-none transition-colors duration-200 flex-shrink-0
                ${activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }
              `}
              aria-current={activeTab === tab ? 'page' : undefined}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="mt-4">
        {renderContent()}
      </div>
    </div>
  );
}

