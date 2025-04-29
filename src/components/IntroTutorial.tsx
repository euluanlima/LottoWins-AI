
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define the steps for the tutorial
const tutorialSteps = [
  {
    title: 'Bem-vindo ao Lotto Wins AI!',
    text: 'Este rápido tutorial mostrará como usar as principais funcionalidades.',
    targetId: null, // No specific target for the welcome message
  },
  {
    title: 'Mapa de Calor',
    text: 'Aqui você vê os números "quentes" (mais sorteados recentemente - vermelho) e "frios" (menos sorteados - azul). Use isso como guia!',
    targetId: 'heat-map-section', // We'll need to add this ID to the heat map div
  },
  {
    title: 'Combinações Sugeridas',
    text: 'Nossa IA analisa padrões e sugere combinações com diferentes níveis de confiança (Alta, Média, Baixa).',
    targetId: 'combinations-section', // We'll need to add this ID to the combinations div
  },
  {
    title: 'Gerar Novos Números',
    text: 'Clique neste botão para ver novas sugestões de números a qualquer momento.',
    targetId: 'generate-button-section', // We'll need to add this ID to the button's container div
  },
  {
    title: 'Pronto!',
    text: 'Agora você está pronto para usar o Lotto Wins AI e aumentar suas chances. Boa sorte!',
    targetId: null,
  },
];

export default function IntroTutorial() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if the tutorial has been seen before
    const tutorialSeen = localStorage.getItem('lottoWinsAiTutorialSeen');
    if (!tutorialSeen) {
      setShowTutorial(true);
    }
  }, []);

  const handleNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Tutorial finished
      localStorage.setItem('lottoWinsAiTutorialSeen', 'true');
      setShowTutorial(false);
    }
  };

  const handleSkipTutorial = () => {
    localStorage.setItem('lottoWinsAiTutorialSeen', 'true');
    setShowTutorial(false);
  };

  // Basic modal styling (can be enhanced)
  const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000, // Ensure it's above other content
  };

  const modalContentStyle: React.CSSProperties = {
    backgroundColor: 'hsl(var(--card))',
    color: 'hsl(var(--foreground))',
    padding: '25px',
    borderRadius: '10px',
    maxWidth: '400px',
    textAlign: 'center',
    border: '1px solid hsl(var(--border))',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
  };

  if (!showTutorial) {
    return null;
  }

  const step = tutorialSteps[currentStep];

  return (
    <AnimatePresence>
      {showTutorial && (
        <motion.div
          style={modalOverlayStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            style={modalContentStyle}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h3 className="text-lg font-bold mb-3 text-[hsl(var(--lotto-authority))]">{step.title}</h3>
            <p className="text-sm mb-5 text-muted-foreground">{step.text}</p>
            <div className="flex justify-between items-center">
              <button 
                onClick={handleSkipTutorial}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Pular Tutorial
              </button>
              <button
                onClick={handleNextStep}
                className="px-4 py-2 rounded-md bg-[hsl(var(--lotto-authority))] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                {currentStep === tutorialSteps.length - 1 ? 'Concluir' : 'Próximo'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

