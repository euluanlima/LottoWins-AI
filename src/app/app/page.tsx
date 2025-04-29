'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import StatesList from '@/components/StatesList';

// Define the available lotteries
interface LotteryInfo {
  id: string; // e.g., 'mega-millions'
  name: string; // e.g., 'Mega Millions'
  logoPath: string; // Path to the logo image
  description: string;
}

const availableLotteries: LotteryInfo[] = [
  {
    id: 'mega-millions',
    name: 'Mega Millions',
    logoPath: '/logos/mega-millions-logo.svg',
    description: 'Uma das maiores loterias dos EUA, com jackpots gigantescos.'
  },
  {
    id: 'powerball',
    name: 'Powerball',
    logoPath: '/logos/powerball-logo.svg',
    description: 'Outra loteria popular com grandes prêmios e sorteios frequentes.'
  },  {
    id: 'cash4life',
    name: 'Cash4Life',
    logoPath: '/logos/cash4life-logo.svg',
    description: 'Ganhe $1.000 por dia pelo resto da vida!'
  },
  // Add more lotteries here in the future
];

// New Home Page Component for Lottery Selection
export default function LotterySelectionPage() {
  return (
    <div className="flex flex-col w-full p-4 sm:p-6">
      <div className="text-center mb-8 border-b border-[hsl(var(--border))] pb-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Lotto Wins AI</h1>
        <p className="text-lg sm:text-xl text-muted-foreground">Selecione a loteria para ver previsões e resultados:</p>
      </div>

      {/* Lottery Cards - Updated to match LotteryUSA style */}
      <div className="grid grid-cols-1 gap-6 mb-10">
        {availableLotteries.map((lottery) => (
          <Link key={lottery.id} href={`/${lottery.id}`} passHref>
            <div className="block p-6 rounded-lg border border-[hsl(var(--border))] bg-card shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
              <div className="flex items-center mb-4">
                {/* Display the logo */}
                <div className="w-1/3 mr-4">
                  <Image 
                    src={lottery.logoPath} 
                    alt={`${lottery.name} Logo`} 
                    width={200}
                    height={80}
                    style={{ objectFit: "contain" }}
                    className="max-h-16"
                  />
                </div>
                <div className="w-2/3">
                  <h2 className="text-2xl font-bold text-foreground">{lottery.name}</h2>
                  <p className="text-base text-muted-foreground mt-2">{lottery.description}</p>
                </div>
              </div>
              <div className="mt-4 text-right">
                <span className="text-[hsl(var(--primary))] font-medium hover:underline">Ver Previsões →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* States List Component */}
      <div className="mt-8">
        <StatesList />
      </div>
      
      {/* Footer Info */}
      <div className="mt-12 p-6 rounded-lg border border-[hsl(var(--border))] bg-card/50">
        <h3 className="text-xl font-bold mb-2">Sobre o Lotto Wins AI</h3>
        <p className="text-base text-muted-foreground">
          Utilizamos inteligência artificial e análise de dados históricos para fornecer previsões e insights sobre as principais loterias. Aumente suas chances de ganhar com nossas ferramentas!
        </p>
      </div>
    </div>
  );
}
