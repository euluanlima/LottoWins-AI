import React from 'react';
import LotteryPageClient from '@/components/LotteryPageClient';
import { availableLotteries } from '@/lib/lottery';

// Required for static export with dynamic routes
export function generateStaticParams() {
  return availableLotteries.map(lottery => ({
    lotteryId: lottery.id,
  }));
}

// Server Component for a specific lottery page
// Removing explicit typing for props, relying on inference
export default function LotteryPage({ params }: any) { // Use 'any' or let TS infer
  const { lotteryId } = params;

  // Render the client component, passing the lotteryId
  return <LotteryPageClient lotteryId={lotteryId} />;
}
