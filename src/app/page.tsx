
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import Image component

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
    logoPath: '/logos/mega-millions-official.png',
    description: 'Uma das maiores loterias dos EUA, com jackpots gigantescos.'
  },
  {
    id: 'powerball',
    name: 'Powerball',
    logoPath: '/logos/powerball-official.png',
    description: 'Outra loteria popular com grandes prêmios e sorteios frequentes.'
  },  {
    id: 'cash4life',
    name: 'Cash4Life',
    logoPath: '/logos/cash4life-official.png',
    description: 'Ganhe $1.000 por dia pelo resto da vida!'
  },
  // Add more lotteries here in the future
];

// New Home Page Component for Lottery Selection
export default function LotterySelectionPage() {
  return (
    <div className="flex flex-col w-full p-4 sm:p-6">
      <div className="text-center mb-8 border-b pb-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Lotto Wins AI</h1>
        <p className="text-lg sm:text-xl text-muted-foreground">Selecione a loteria para ver previsões e resultados:</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableLotteries.map((lottery) => (
          <Link key={lottery.id} href={`/${lottery.id}`} passHref>
            <div className="block p-6 rounded-lg border bg-card shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full flex flex-col">
              <div className="flex items-center mb-4">
                {/* Display the logo */}
                <Image 
                  src={lottery.logoPath} 
                  alt={`${lottery.name} Logo`} 
                  width={200} // Larger intrinsic width for aspect ratio
                  height={60}  // Larger intrinsic height for aspect ratio
                  objectFit="contain" // Contain the image within the element bounds
                  className="mr-3 h-12 w-auto max-w-[150px]" // Set display height, auto width, max width
                />
                <h2 className="text-2xl font-semibold text-foreground">{lottery.name}</h2>
              </div>
              <p className="text-base text-muted-foreground flex-grow">{lottery.description}</p>
              <div className="mt-4 text-right">
                 <span className="text-blue-600 font-medium hover:underline">Ver Previsões →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Optional: Add a section about the AI or general info */}
      <div className="mt-12 p-6 rounded-lg border bg-secondary/30">
          <h3 className="text-xl font-semibold mb-2">Sobre o Lotto Wins AI</h3>
          <p className="text-base text-muted-foreground">
              Utilizamos inteligência artificial e análise de dados históricos para fornecer previsões e insights sobre as principais loterias. Aumente suas chances de ganhar com nossas ferramentas!
          </p>
      </div>
    </div>
  );
}

