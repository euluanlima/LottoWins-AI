
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Temporarily remove SmartPickLoading import to simplify
// import SmartPickLoading from "./SmartPickLoading";

interface Prediction {
  mainNumbers: number[];
  specialBall: number;
  confidence: "Alta" | "Média" | "Baixa";
}

const SmartPick: React.FC = () => {
  // Use static mock data instead of fetching
  const [predictions, setPredictions] = useState<Prediction[]>([
    {
      mainNumbers: [10, 20, 30, 40, 50],
      specialBall: 5,
      confidence: "Alta",
    },
    {
      mainNumbers: [11, 22, 33, 44, 55],
      specialBall: 15,
      confidence: "Média",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false); // Keep isLoading state, but set to false initially
  const [error, setError] = useState<string | null>(null); // Keep error state

  // Remove useEffect hook for fetching data

  const getConfidenceColor = (confidence: "Alta" | "Média" | "Baixa") => {
    switch (confidence) {
      case "Alta":
        return "bg-green-500 hover:bg-green-600";
      case "Média":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "Baixa":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  if (isLoading) {
    // Render a simple loading message instead of the component
    return <div>Carregando previsões...</div>;
    // return <SmartPickLoading />;
  }

  if (error) {
    return <div className="text-red-500">Erro ao carregar previsões: {error}</div>;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Previsões Smart Pick</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Render static mock data */}
          {predictions.map((prediction, index) => (
            <div
              key={`${index}-${prediction.mainNumbers.join("-")}-${prediction.specialBall}`}
              className="p-4 border rounded-lg shadow-sm bg-card"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                <h3 className="text-lg font-semibold mb-2 sm:mb-0">
                  Combinação {index + 1}
                </h3>
                <Badge
                  className={`text-white ${getConfidenceColor(
                    prediction.confidence
                  )}`}
                >
                  Confiança: {prediction.confidence}
                </Badge>
              </div>
              <div className="numbers flex flex-wrap gap-2 justify-center sm:justify-start items-center">
                {/* Numbers Display (style from original) */}
                {prediction.mainNumbers.map((num) => (
                  <span
                    key={num}
                    className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white text-black text-sm font-medium"
                  >
                    {num}
                  </span>
                ))}
                <span className="flex items-center justify-center w-8 h-8 rounded-full border border-yellow-500 bg-yellow-400 text-black text-sm font-bold">
                  {prediction.specialBall}
                </span>
              </div>
              {/* End of numbers div */}
            </div>
          ))}
        </div>
        {/* Remove refresh button temporarily */}
        {/*
        <div className="mt-6 text-center">
          <Button
            onClick={fetchPredictions}
            disabled={isLoading}
            className={`btn block w-full ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Atualizando..." : "Atualizar Previsões"}
          </Button>
        </div>
        */}
      </CardContent>
    </Card>
  );
};

export default SmartPick;

