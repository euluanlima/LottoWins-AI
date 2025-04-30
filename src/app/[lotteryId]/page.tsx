import React from 'react';
import LotteryPageClient from '@/components/LotteryPageClient';
import { availableLotteries } from '@/lib/lottery';
// Optional: Import notFound for handling invalid IDs
// import { notFound } from 'next/navigation';

// Required for static export with dynamic routes
export function generateStaticParams() {
  return availableLotteries.map(lottery => ({
    lotteryId: lottery.id,
  }));
}

// Define the expected props type
interface LotteryPageProps {
  params: { lotteryId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Server Component for a specific lottery page
export default async function LotteryPage({ params }: LotteryPageProps) {
  // Pass params.lotteryId directly to the client component
  // This might help avoid the "params should be awaited" issue
  const lotteryId = params.lotteryId;

  // Validate lotteryId (can still do this here)
  if (!availableLotteries.some(l => l.id === lotteryId)) {
     console.error(`Invalid lotteryId accessed: ${lotteryId}`);
     // Consider uncommenting the next line to return a 404 page
     // notFound();
  }

  // Pass the validated lotteryId to the client component
  return <LotteryPageClient lotteryId={lotteryId} />;
}

