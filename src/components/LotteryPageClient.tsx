
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2 } from "lucide-react";

// Only import essential components for the minimal version
import SmartPickComponent from "@/components/SmartPick";
import ResultsTab from "@/components/ResultsTab";
// FrequencyTab, CheckerTab, PrizesTab are removed for now

// Import mock data as fallback
import mockResultsData from "@/data/mockResults.json";

// Define the available tabs (will be filtered later)
type Tab = "Previsões" | "Resultados" | "Frequência" | "Verificador" | "Prêmios";

// Define lottery details (keep as is)
const lotteryDetails: { [key: string]: { name: string; logo: string; logoLarge: string } } = {
  "mega-millions": { name: "Mega Millions", logo: "/logos/mega-millions-logo.png", logoLarge: "/logos/mega-millions-logo-large.png" },
  "powerball": { name: "Powerball", logo: "/logos/powerball-logo.png", logoLarge: "/logos/powerball-logo-large.png" },
  "cash4life": { name: "Cash4Life", logo: "/logos/cash4life-logo.png", logoLarge: "/logos/cash4life-logo-large.png" },
};

// Define structure for results (keep as is)
interface Result {
  drawDate: string;
  winningNumbers: string[];
  powerball?: string;
  megaBall?: string;
  cashBall?: string;
}

// Props for the client component
interface LotteryPageClientProps {
  lotteryId: string;
}

// Client Component - Rewritten for simplicity
export default function LotteryPageClient({ lotteryId }: LotteryPageClientProps) {
  const details = lotteryDetails[lotteryId];
  // Start with essential tabs only for the minimal version
  const essentialTabs: Tab[] = ["Previsões", "Resultados"]; 
  const [activeTab, setActiveTab] = useState<Tab>(essentialTabs[0]); // Default to first essential tab
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load mock results (simplified error handling)
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    try {
      const fallbackData = (mockResultsData as any)[lotteryId as keyof typeof mockResultsData] || [];
      setResults(fallbackData);
    } catch (err) {
      console.error("Error loading mock results:", err);
      setError("Falha ao carregar dados de exemplo.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [lotteryId]);

  // Render content for essential tabs only
  const renderContent = () => {
    // Simplified loading/error display for Results tab
    if (activeTab === "Resultados") {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center p-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Carregando...</span>
                </div>
            );
        }
        if (error) {
             return (
                <div className="p-4 text-center text-red-600 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                <p>{error}</p>
                </div>
            );
        }
        return <ResultsTab results={results} lotteryName={lotteryId} />;
    }

    // Default to Previsões
    return <SmartPickComponent />;
  };

  // Handle invalid lotteryId
  if (!details) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600">Loteria Inválida</h1>
        <p className="text-lg text-muted-foreground mt-2">A loteria \"{lotteryId}\" não foi encontrada.</p>
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

      {/* Tab Navigation - Only essential tabs */}
      <div className="border-b border-border mb-4 sm:mb-6 overflow-hidden">
        <nav className="-mb-px flex space-x-4 sm:space-x-6 overflow-x-auto pb-2 justify-start" aria-label="Tabs">
          {essentialTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                relative whitespace-nowrap py-3 px-3 sm:px-4 border-b-2 font-semibold text-sm sm:text-base focus:outline-none transition-colors duration-200 flex-shrink-0
                ${activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
                }
              `}
              aria-current={activeTab === tab ? "page" : undefined}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area - Simplified */}
      <div className="mt-4">
        {renderContent()}
      </div>

    </div>
  );
}

