
"use client";

import { useState, useEffect, useCallback } from 'react';
import { PredictionData, getLotteryInfo } from '@/lib/lottery'; // Import types and helper from lib

// Hook para buscar os dados de previsão do arquivo JSON para uma loteria específica
export function usePredictionData(lotteryId: string) {
  const [data, setData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Obter informações da loteria
  const lotteryInfo = getLotteryInfo(lotteryId);
  
  // Definir o arquivo de dados com base na loteria
  const dataFile = lotteryInfo?.dataFile || 'predictions.json'; // Fallback, mas deve ser baseado no lotteryInfo

  // Encapsulate fetch logic in a useCallback
  const fetchPredictions = useCallback(async () => {
    if (!lotteryInfo) {
      setError(`Informações da loteria não encontradas para ID: ${lotteryId}`);
      setLoading(false);
      setData({ hotNumbers: [], overdueNumbers: [], hotPowerBalls: [], overduePowerBalls: [], combinations: [], lastUpdated: 'N/A', basedOn: 0 });
      return;
    }
    try {
      setLoading(true);
      // Add cache-busting query parameter to ensure fresh data
      const response = await fetch(`/${dataFile}?t=${new Date().getTime()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: PredictionData = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(`Erro ao carregar dados de previsão para ${lotteryInfo.name}. Verifique se o arquivo ${dataFile} existe na pasta public.`);
      console.error(err);
      // Define dados padrão em caso de erro para evitar quebrar a UI
      setData({
        hotNumbers: [],
        overdueNumbers: [],
        hotPowerBalls: [],
        overduePowerBalls: [],
        combinations: [],
        lastUpdated: 'N/A',
        basedOn: 0
      });
    } finally {
      setLoading(false);
    }
  }, [dataFile, lotteryId, lotteryInfo]); // useCallback dependency array includes dataFile and lotteryId

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]); // useEffect depends on fetchPredictions

  // Return the fetch function as 'refetch' instead of 'mutate'
  return { data, loading, error, refetch: fetchPredictions, lotteryInfo };
}

