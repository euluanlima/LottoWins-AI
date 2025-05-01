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

// Server Component for a specific lottery page
// Using inline type for props to potentially resolve build error
export default async function LotteryPage({ params }: { params: { lotteryId: string } }) {
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

