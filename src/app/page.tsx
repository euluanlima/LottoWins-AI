
'use client';

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import Link from 'next/link';
import Image from 'next/image';
import StatesList from '@/components/StatesList';
// No longer importing useSearchParams or Suspense here

// Define the available lotteries
interface LotteryInfo {
  id: string;
  name: string;
  logoPath: string;
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
];

// Define usStates here
const usStates = [
  { name: 'Alabama', abbr: 'AL' }, { name: 'Alaska', abbr: 'AK' }, { name: 'Arizona', abbr: 'AZ' }, 
  { name: 'Arkansas', abbr: 'AR' }, { name: 'California', abbr: 'CA' }, { name: 'Colorado', abbr: 'CO' },
  { name: 'Connecticut', abbr: 'CT' }, { name: 'Delaware', abbr: 'DE' }, { name: 'District of Columbia', abbr: 'DC' },
  { name: 'Florida', abbr: 'FL' }, { name: 'Georgia', abbr: 'GA' }, { name: 'Hawaii', abbr: 'HI' },
  { name: 'Idaho', abbr: 'ID' }, { name: 'Illinois', abbr: 'IL' }, { name: 'Indiana', abbr: 'IN' },
  { name: 'Iowa', abbr: 'IA' }, { name: 'Kansas', abbr: 'KS' }, { name: 'Kentucky', abbr: 'KY' },
  { name: 'Louisiana', abbr: 'LA' }, { name: 'Maine', abbr: 'ME' }, { name: 'Maryland', abbr: 'MD' },
  { name: 'Massachusetts', abbr: 'MA' }, { name: 'Michigan', abbr: 'MI' }, { name: 'Minnesota', abbr: 'MN' },
  { name: 'Mississippi', abbr: 'MS' }, { name: 'Missouri', abbr: 'MO' }, { name: 'Montana', abbr: 'MT' },
  { name: 'Nebraska', abbr: 'NE' }, { name: 'Nevada', abbr: 'NV' }, { name: 'New Hampshire', abbr: 'NH' },
  { name: 'New Jersey', abbr: 'NJ' }, { name: 'New Mexico', abbr: 'NM' }, { name: 'New York', abbr: 'NY' },
  { name: 'North Carolina', abbr: 'NC' }, { name: 'North Dakota', abbr: 'ND' }, { name: 'Ohio', abbr: 'OH' },
  { name: 'Oklahoma', abbr: 'OK' }, { name: 'Oregon', abbr: 'OR' }, { name: 'Pennsylvania', abbr: 'PA' },
  { name: 'Rhode Island', abbr: 'RI' }, { name: 'South Carolina', abbr: 'SC' }, { name: 'South Dakota', abbr: 'SD' },
  { name: 'Tennessee', abbr: 'TN' }, { name: 'Texas', abbr: 'TX' }, { name: 'Utah', abbr: 'UT' },
  { name: 'Vermont', abbr: 'VT' }, { name: 'Virginia', abbr: 'VA' }, { name: 'Washington', abbr: 'WA' },
  { name: 'West Virginia', abbr: 'WV' }, { name: 'Wisconsin', abbr: 'WI' }, { name: 'Wyoming', abbr: 'WY' },
];

// Main Page Component using client-side state update
export default function LotterySelectionPage() {
  const [pageTitle, setPageTitle] = useState("Lotto Wins AI");
  const [pageSubtitle, setPageSubtitle] = useState("Selecione a loteria para ver previsões e resultados:");

  useEffect(() => {
    // This code runs only on the client, after the initial render
    const params = new URLSearchParams(window.location.search);
    const selectedStateAbbr = params.get("estado");

    if (selectedStateAbbr) {
      const currentState = usStates.find(state => state.abbr.toLowerCase() === selectedStateAbbr.toLowerCase());
      if (currentState) {
        setPageTitle(`Loterias da ${currentState.name}`);
        setPageSubtitle(`Resultados e previsões para ${currentState.name}`);
      }
    }
    // No dependency array means this runs once after mount
  }, []); 

  // TODO: Filter availableLotteries based on selectedStateAbbr if needed (would also need state)

  return (
    <div className="flex flex-col w-full p-4 sm:p-6">
      <div className="text-center mb-8 border-b border-[hsl(var(--border))] pb-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">{pageTitle}</h1>
        <p className="text-lg sm:text-xl text-muted-foreground">{pageSubtitle}</p>
      </div>

      {/* Lottery Cards */}
      <div className="grid grid-cols-1 gap-6 mb-10">
        {availableLotteries.map((lottery) => (
          <Link key={lottery.id} href={`/${lottery.id}`} passHref>
            <div className="block p-6 rounded-lg border border-[hsl(var(--border))] bg-card shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
              <div className="flex items-center mb-4">
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

