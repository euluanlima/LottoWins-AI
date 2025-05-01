
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react'; // Import Loader2

interface Prediction {
  numbers: number[];
  megaBall: number; // Assuming Mega Millions for now
  confidence: 'Alta' | 'Média' | 'Baixa';
}

interface SmartPickProps {
  lotteryId: string; // Receive lotteryId as a prop
}

export default function SmartPickComponent({ lotteryId }: SmartPickProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const fetchPredictions = async (numCombinations = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Pass lotteryId to API if backend supports it in the future
      const response = await fetch(`/api/predict?num=${numCombinations}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data: Prediction[] = await response.json();
      setPredictions(data);
      // Show confetti effect on successful fetch
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    } catch (e) {
      console.error("Failed to fetch predictions:", e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred while fetching predictions.');
      setPredictions([]); // Clear predictions on error
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch predictions on initial component mount and when lotteryId changes
  useEffect(() => {
    fetchPredictions(10); // Fetch 10 predictions initially
  }, [lotteryId]); // Refetch if lotteryId changes

  const handleGenerateNewPicks = () => {
    fetchPredictions(10); // Fetch 10 new predictions
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'Alta': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'Média': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'Baixa': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Confetti animation (keep as is)
  const Confetti = () => {
    const confettiCount = 100;
    const colors = ['#3b82f6', '#4ade80', '#a855f7', '#f43f5e', '#f97316', '#facc15'];
    
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {Array.from({ length: confettiCount }).map((_, i) => {
          const size = Math.random() * 10 + 5;
          const color = colors[Math.floor(Math.random() * colors.length)];
          const left = Math.random() * 100;
          const animationDuration = Math.random() * 3 + 2;
          const delay = Math.random() * 0.5;
          
          return (
            <div 
              key={i}
              className="absolute top-0 rounded-sm"
              style={{
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color,
                animation: `confetti ${animationDuration}s ease-in ${delay}s forwards`,
                opacity: 0,
              }}
            />
          );
        })}
        <style jsx>{`
          @keyframes confetti {
            0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
        `}</style>
      </div>
    );
  };

  // Determine lottery name for display
  const lotteryName = lotteryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <motion.div 
      className="bg-card p-4 sm:p-6 rounded-xl shadow-lg border border-border relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative elements can be adjusted based on theme */}
      {/* <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full"></div> */}
      {/* <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/10 rounded-full"></div> */}
      
      {/* Confetti effect */}
      <AnimatePresence>
        {showConfetti && <Confetti />}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 relative z-10">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">{lotteryName} - Previsões Matemáticas</h2>
          <p className="text-sm text-muted-foreground">Combinações geradas por análise estatística</p>
        </div>
        {/* Optional: Add Lottery logo here if needed */}
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-destructive/10 text-destructive border border-destructive/30 rounded-lg relative z-10">
          <strong>Erro ao buscar previsões:</strong> {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-border relative z-10">
        <table className="min-w-full bg-card">
          <thead className="bg-muted/50">
            <tr className="text-muted-foreground uppercase text-xs sm:text-sm leading-normal">
              <th className="py-3 px-4 text-center">#</th>
              <th className="py-3 px-4 text-left">Combinação Prevista</th>
              <th className="py-3 px-4 text-center">Confiança</th>
            </tr>
          </thead>
          <motion.tbody 
            className="text-foreground text-sm font-light"
            variants={tableVariants}
            initial="hidden"
            animate={isLoading ? "hidden" : "visible"}
          >
            {isLoading ? (
              <tr>
                <td colSpan={3} className="text-center py-10">
                  <div className="flex justify-center items-center">
                    <Loader2 className="animate-spin mr-3 h-6 w-6 text-primary" />
                    <span className="text-lg font-medium text-muted-foreground">Calculando previsões...</span>
                  </div>
                </td>
              </tr>
            ) : predictions.length > 0 ? (
              predictions.map((pred, index) => (
                <motion.tr 
                  key={`${isLoading}-${index}-${pred.numbers.join('-')}`} // More robust key
                  className={`border-b border-border hover:bg-muted/50 ${index % 2 === 0 ? 'bg-muted/20' : ''}`}
                  variants={rowVariants}
                >
                  <td className="py-3 px-4 text-center font-medium">{index + 1}</td>
                  <td className="py-3 px-4 text-left">
                    <div className="flex items-center space-x-1 flex-wrap">
                      {pred.numbers.map((num, i) => (
                        <span key={`num-${i}`} 
                          className="font-semibold text-sm sm:text-base px-2 py-1 rounded-full bg-muted text-foreground my-0.5"
                        >
                          {num}
                        </span>
                      ))}
                      {/* Display the special ball based on lottery type - simplistic check for now */}
                      <span className="text-muted-foreground mx-1">+</span>
                      <span 
                        className={`font-semibold text-sm sm:text-base px-2 py-1 rounded-full ${lotteryId === 'powerball' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'} my-0.5`}
                      >
                        {pred.megaBall} {/* Rename field in Python or handle different ball names here */} 
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getConfidenceColor(pred.confidence)}`}>
                      {pred.confidence}
                    </span>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-10 text-muted-foreground">
                  Nenhuma previsão disponível no momento.
                  {error && <span className="block mt-2 text-destructive">Tente novamente mais tarde.</span>}
                </td>
              </tr>
            )}
          </motion.tbody>
        </table>
      </div>
      
      <div className="mt-8 text-center relative z-10">
        <motion.button 
          className={`relative overflow-hidden ${isLoading ? 'bg-gray-400 dark:bg-gray-600' : 'bg-gradient-to-r from-primary to-purple-600'} text-primary-foreground font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed`}
          onClick={handleGenerateNewPicks}
          disabled={isLoading}
          whileTap={{ scale: 0.95 }}
        >
          {/* Animated background */}
          {!isLoading && (
            <span className="absolute inset-0 w-full h-full">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary via-purple-600 to-primary bg-[length:200%_100%] animate-gradient"></span>
            </span>
          )}
          
          {/* Button text */}
          <span className="relative z-10 flex items-center justify-center">
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-foreground" />
                Calculando...
              </>
            ) : 'Gerar Novas Previsões'}
          </span>
        </motion.button>
      </div>
      
      {/* Gradient animation style */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </motion.div>
  );
}


