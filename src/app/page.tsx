
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Define the available lotteries with local PNG logo paths
interface LotteryInfo {
  id: string;
  name: string;
  logoPath: string; // Path to the PNG logo
  logoWidth: number; // Define width for Image component
  logoHeight: number; // Define height for Image component
  jackpot: string;
  nextDraw: string;
}

const availableLotteries: LotteryInfo[] = [
  {
    id: 'mega-millions',
    name: 'Mega Millions',
    logoPath: '/logos/megamillions.png',
    logoWidth: 240, // Further increased size
    logoHeight: 70, // Adjusted height
    jackpot: '$125 Milhões',
    nextDraw: 'Sexta-feira',
  },
  {
    id: 'powerball',
    name: 'Powerball',
    logoPath: '/logos/powerball.png',
    logoWidth: 240, // Further increased size
    logoHeight: 70, // Adjusted height
    jackpot: '$80 Milhões',
    nextDraw: 'Sábado',
  },
  {
    id: 'cash4life',
    name: 'Cash4Life',
    logoPath: '/logos/cash4life.png',
    logoWidth: 210, // Further increased size
    logoHeight: 65, // Adjusted height
    jackpot: '$1.000/Dia',
    nextDraw: 'Esta noite',
  },
];

// Home Page Component - Redesigned based on pasted_content.txt
export default function LotterySelectionPage() {

  return (
    // Removed the outer div and header as they are now in layout.tsx
    <>
      {/* Section Title */}
      <div className="text-center text-xl md:text-2xl font-semibold text-primary mb-8">
        Escolha sua Loteria
      </div>

      {/* Lottery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {availableLotteries.map((lottery) => (
          <div
            key={lottery.id}
            className="bg-card border border-border rounded-[20px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,255,224,0.1)] dark:bg-card dark:border-border flex flex-col justify-between" // Added flex for better alignment
          >
            <div> {/* Content wrapper */}
              {/* Adjusted logo container: Increased height and margin */}
              <div className="text-center mb-6 h-[80px] flex items-center justify-center"> {/* Increased container height */}
                <Image
                  src={lottery.logoPath}
                  alt={`${lottery.name} Logo`}
                  width={lottery.logoWidth}
                  height={lottery.logoHeight}
                  className="object-contain max-h-full"
                  priority
                />
              </div>
              <div className="text-center text-2xl md:text-[26px] font-bold text-highlight mb-1">
                {lottery.jackpot}
              </div>
              <div className="text-center text-muted text-sm mb-5">
                Próximo Sorteio: {lottery.nextDraw}
              </div>
            </div>
            {/* Button at the bottom */}
            <Link href={`/${lottery.id}`} passHref>
              <button
                className="mt-5 w-full bg-gradient-to-r from-primary to-highlight text-black py-3.5 px-5 text-[15px] font-semibold rounded-xl cursor-pointer transition-all duration-300 shadow-[0_0_10px_rgba(0,255,224,0.15)] hover:opacity-95 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,255,224,0.3)]"
              >
                🎯 Smart Pick AI
              </button>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

