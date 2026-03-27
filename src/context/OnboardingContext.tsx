'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

export interface OnboardingStep {
  id: string;
  title: string;
  desc: string;
  path: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: 's1', title: 'Conhecer a MedCof', desc: 'Leia a nossa visão na Home Page para entender o propósito do portal.', path: '/' },
  { id: 's2', title: 'Conhecer os Times', desc: 'Explore as principais squads da engenharia.', path: '/times' },
  { id: 's3', title: 'Entender o Organograma', desc: 'Veja como nossa liderança técnica está estruturada.', path: '/organograma' },
  { id: 's4', title: 'Conhecer seu Time', desc: 'Clique em qualquer squad na tela de Times para expandir os detalhes.', path: '/times' },
  { id: 's5', title: 'Processos Ágeis', desc: 'Entenda o ciclo completo de uma feature até produção.', path: '/processos' },
  { id: 's6', title: 'Entender Fluxos', desc: 'Como e quando atuar em Bugs e Releases específicas.', path: '/fluxos' },
  { id: 's7', title: 'Acessar Ferramentas', desc: 'Encontre acessos pro Jira, Slack, Figma, etc.', path: '/links' },
];

interface OnboardingContextType {
  completedSteps: string[];
  completeStep: (id: string) => void;
  progress: number;
  activeStep: OnboardingStep | null;
  isCompletedAll: boolean;
  showWelcome: boolean;
  dismissWelcome: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('@MedCof:Onboarding');
    const dismissed = localStorage.getItem('@MedCof:WelcomeDismissed');
    
    if (stored) {
      setCompletedSteps(JSON.parse(stored));
    }
    
    if (!dismissed && (!stored || JSON.parse(stored).length === 0)) {
      setShowWelcome(true);
    }
    
    setIsReady(true);
  }, []);

  const dismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('@MedCof:WelcomeDismissed', 'true');
  };

  const completeStep = (id: string) => {
    if (!completedSteps.includes(id)) {
      const newCompleted = [...completedSteps, id];
      setCompletedSteps(newCompleted);
      localStorage.setItem('@MedCof:Onboarding', JSON.stringify(newCompleted));

      if (newCompleted.length === ONBOARDING_STEPS.length) {
        setTimeout(() => {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#E3000F', '#111827', '#ffffff']
          });
        }, 300);
      }
    }
  };

  if (!isReady) return null; // Avoid hydration mismatch

  const progress = Math.round((completedSteps.length / ONBOARDING_STEPS.length) * 100);
  const isCompletedAll = completedSteps.length === ONBOARDING_STEPS.length;
  const activeStep = ONBOARDING_STEPS.find(s => !completedSteps.includes(s.id)) || null;

  return (
    <OnboardingContext.Provider value={{
      completedSteps, completeStep, progress, activeStep, isCompletedAll, showWelcome, dismissWelcome
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within Provider');
  return ctx;
}
