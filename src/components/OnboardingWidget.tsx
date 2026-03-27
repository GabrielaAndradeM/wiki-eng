'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useOnboarding, ONBOARDING_STEPS } from '@/context/OnboardingContext';
import { CheckCircle2, ChevronDown, Trophy, Play, Check, X } from 'lucide-react';

export default function OnboardingWidget() {
  const { progress, completedSteps, activeStep, completeStep, isCompletedAll, showWelcome, dismissWelcome } = useOnboarding();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleStepClick = (stepId: string, path: string) => {
    router.push(path);
  };

  return (
    <>
      <AnimatePresence>
        {showWelcome && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              className="bg-surface max-w-lg w-full rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center"
            >
              <div className="w-20 h-20 bg-medcof-hover mx-auto rounded-full flex items-center justify-center text-medcof-red mb-6 shadow-soft">
                <Play size={32} className="ml-1" />
              </div>
              <h2 className="text-3xl font-extrabold text-foreground mb-4">Bem-vindo à <span className="text-medcof-red">Engenharia MedCof</span></h2>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                Para te ajudar a entrar no ritmo o mais rápido possível, preparamos um Onboarding GUIADO. Conheça as áreas, ferramentas e nossa cultura passo a passo!
              </p>
              <button 
                onClick={() => {
                  dismissWelcome();
                  setIsOpen(true);
                }}
                className="bg-medcof-red hover:bg-medcof-darkRed text-white font-bold py-4 px-8 rounded-xl w-full flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-hover"
              >
                <Play size={18} /> Começar Onboarding
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex w-[340px] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.6)]"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-base font-bold text-foreground">Jornada de Onboarding</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-medcof-red"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="mt-1.5 text-[11px] font-semibold text-gray-400">
                    {completedSteps.length} de {ONBOARDING_STEPS.length} concluídos · {progress}%
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/10 dark:hover:text-gray-200"
                  aria-label="Fechar"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Lista de steps */}
              <div className="flex-1 overflow-y-auto p-3">
                {isCompletedAll ? (
                  <div className="flex flex-col items-center px-4 py-10 text-center">
                    <Trophy size={40} className="mb-3 text-yellow-500" />
                    <h4 className="mb-1 font-bold text-foreground">Onboarding Concluído!</h4>
                    <p className="text-sm text-gray-500">Você já domina a estrutura da nossa Engenharia. Excelente trabalho!</p>
                  </div>
                ) : (
                  <ul className="flex flex-col gap-1">
                    {ONBOARDING_STEPS.map((step, idx) => {
                      const isComplete = completedSteps.includes(step.id);
                      const isActive = activeStep?.id === step.id;

                      return (
                        <li key={step.id}>
                          <button
                            onClick={() => handleStepClick(step.id, step.path)}
                            className={`w-full text-left rounded-xl px-3 py-2.5 flex gap-3 items-start transition-all duration-150
                              ${isActive
                                ? 'bg-medcof-red/8 dark:bg-medcof-red/12'
                                : isComplete
                                  ? 'opacity-45'
                                  : 'hover:bg-surface-hover'}`}
                          >
                            {/* Indicador */}
                            <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-black transition-colors
                              ${isComplete
                                ? 'border-emerald-500 bg-emerald-500 text-white'
                                : isActive
                                  ? 'border-medcof-red text-medcof-red'
                                  : 'border-border text-gray-400'}`}
                            >
                              {isComplete ? <Check size={12} strokeWidth={3} /> : idx + 1}
                            </div>

                            {/* Texto */}
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm font-semibold leading-snug
                                ${isActive ? 'text-medcof-red dark:text-medcof-lightRed' : isComplete ? 'text-gray-400' : 'text-foreground'}`}>
                                {step.title}
                              </p>
                              <AnimatePresence>
                                {isActive && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.18 }}
                                  >
                                    <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                                      {step.desc}
                                    </p>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); completeStep(step.id); }}
                                      className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-medcof-red px-3 py-1.5 text-xs font-bold text-white transition hover:bg-medcof-darkRed"
                                    >
                                      <Check size={11} strokeWidth={3} /> Marcar como concluído
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botão flutuante */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`flex h-12 items-center gap-2.5 rounded-full px-5 font-bold text-white shadow-lg transition-colors
            ${isCompletedAll
              ? 'bg-gray-900 shadow-gray-900/20 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700'
              : 'bg-medcof-red shadow-medcof-red/25 hover:bg-medcof-darkRed'}`}
        >
          {isCompletedAll ? (
            <Trophy size={18} className="text-yellow-400" />
          ) : (
            <>
              <CheckCircle2 size={17} />
              <span className="text-sm">{Math.round(progress)}%</span>
            </>
          )}
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </motion.button>
      </div>
    </>
  );
}
