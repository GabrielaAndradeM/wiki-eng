'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '@/context/OnboardingContext';
import {
  Lightbulb, Search, Presentation, Wrench, CheckCircle,
  Code2, ShieldCheck, Users, Rocket, ChevronDown,
  AlertTriangle, Layers, ScanEye, Route, LayoutGrid, List,
} from 'lucide-react';

// ─────────────────── Types ───────────────────

type StepStatus = 'ready' | 'caution' | 'neutral';

interface AntiPattern {
  label: string;
  tip: string;
}

interface ProcessStep {
  id: number;
  name: string;
  shortDesc: string;
  description: string;
  icon: React.ElementType;
  owner: string;
  artifact: string;
  status: StepStatus;
  details: string[];
  antiPatterns: AntiPattern[];
}

// ─────────────────── Data ───────────────────

const STEPS: ProcessStep[] = [
  {
    id: 1,
    name: 'Identificação',
    shortDesc: 'Perceber e registrar a necessidade',
    description:
      'Momento em que uma necessidade, problema ou oportunidade é percebida e registrada para avaliação. O ponto de ignição de tudo.',
    icon: Lightbulb,
    owner: 'PO / Stakeholder',
    artifact: 'Card criado no Jira com informações iniciais',
    status: 'neutral',
    details: [
      'O PO cria o card no Jira com as informações disponíveis',
      'Não precisa estar completo — só o suficiente para iniciar o processo',
      'Pode vir de feedback de usuário, negócio ou time técnico',
      'Priorização acontece após a identificação',
    ],
    antiPatterns: [
      { label: 'Sair construindo sem registrar', tip: 'Sem registro não há rastreabilidade nem priorização.' },
      { label: 'Esperar ter tudo claro para criar o card', tip: 'Crie com o que sabe — o refinamento completa o resto.' },
    ],
  },
  {
    id: 2,
    name: 'Discovery',
    shortDesc: 'Explorar e entender o problema',
    description:
      'Contexto é explorado para entender o problema, validar hipóteses e direcionar a melhor solução antes de qualquer compromisso de entrega.',
    icon: Search,
    owner: 'PO + UX + TL',
    artifact: 'Card detalhado no Jira com contexto e proposta',
    status: 'neutral',
    details: [
      'Pesquisa com usuários ou stakeholders sobre a dor real',
      'A descrição do card no Jira se torna mais detalhada',
      'Levantamento de hipóteses e opções de solução',
      'Definição de métricas de sucesso — como saber se funcionou?',
    ],
    antiPatterns: [
      { label: 'Pular discovery por pressão de prazo', tip: 'Sem discovery, as chances de retrabalho dobram.' },
      { label: 'Discovery virar um documento extenso sem decisão', tip: 'O objetivo é decidir, não documentar tudo.' },
    ],
  },
  {
    id: 3,
    name: 'Refinamento de Negócio',
    shortDesc: 'Detalhar valor, regras e critérios',
    description:
      'A demanda é detalhada do ponto de vista de valor, regra de negócio e entendimento funcional. O time entende o "por quê" antes do "como".',
    icon: Presentation,
    owner: 'PO + TL + Time',
    artifact: 'História de usuário com critérios de aceite claros',
    status: 'caution',
    details: [
      'Envolvimento do time é essencial — não apenas PO e TL',
      'Prototipação normalmente acontece aqui (low ou high fidelity)',
      'Critérios de aceite definidos e testáveis',
      'Edge cases e cenários alternativos levantados',
      'Alinhamento com stakeholders antes de ir para o técnico',
    ],
    antiPatterns: [
      { label: 'Aceitar story sem critério de aceite', tip: 'Sem critério, cada um entende uma coisa diferente.' },
      { label: 'PO refinar sozinho e só comunicar depois', tip: 'Refinamento é uma atividade colaborativa.' },
    ],
  },
  {
    id: 4,
    name: 'Refinamento Técnico',
    shortDesc: 'Planejar como implementar',
    description:
      'O time define como irá implementar a solução: arquitetura, estimativa, riscos e dependências. Histórias se tornam tarefas executáveis.',
    icon: Wrench,
    owner: 'Time de Desenvolvimento + TL',
    artifact: 'Tasks técnicas criadas e estimadas no Jira',
    status: 'caution',
    details: [
      'Avaliação técnica da solução proposta no negócio',
      'Levantamento de riscos e dependências externas',
      'Estimativa baseada em esforço e complexidade (story points)',
      'Decisões de arquitetura documentadas',
      'Todos do time participam — não só o Tech Lead',
    ],
    antiPatterns: [
      { label: 'TL resolver tudo sozinho', tip: 'Quem não participou do planejamento tem mais chance de travar na execução.' },
      { label: 'Estimativas sem discussão', tip: 'Números sem contexto geram comprometimentos irrealistas.' },
      { label: 'Ignorar débito técnico na estimativa', tip: 'Débito acumulado cobra um preço real em velocidade.' },
    ],
  },
  {
    id: 5,
    name: 'Pronto para Dev',
    shortDesc: 'Definition of Ready cumprida',
    description:
      'A demanda está madura para entrar em desenvolvimento. Respeita a Definition of Ready (DoR) acordada pelo time.',
    icon: CheckCircle,
    owner: 'Time + PO',
    artifact: 'Card com status "Ready" no backlog',
    status: 'ready',
    details: [
      'Critérios de aceite claros e validados',
      'Estimativa feita e aceita pelo time',
      'Dependências identificadas e sem bloqueio',
      'Mockups aprovados (se aplicável)',
      'Sem dúvida bloqueante em aberto',
    ],
    antiPatterns: [
      { label: 'Entrar em dev sem DoR', tip: 'CardS sem DoR geram bloqueios no meio da sprint.' },
      { label: 'DoR virar burocracia', tip: 'DoR é um checklist prático, não uma barreira formal.' },
    ],
  },
  {
    id: 6,
    name: 'Desenvolvimento',
    shortDesc: 'Construir a solução',
    description:
      'O time constrói a solução de forma incremental, com code review entre pares e integração contínua.',
    icon: Code2,
    owner: 'Time de Desenvolvimento',
    artifact: 'PR aberto e revisado, código integrado',
    status: 'neutral',
    details: [
      'Desenvolvimento incremental e focado na story',
      'Abertura de PR com descrição clara do que foi feito',
      'Code review obrigatório por pares',
      'Testes unitários escritos junto com o código',
      'Integração contínua rodando a cada push',
    ],
    antiPatterns: [
      { label: 'PR gigante sem review parcial', tip: 'PRs grandes demais bloqueiam review e aumentam risco de conflito.' },
      { label: 'Desenvolver sem testes', tip: 'Código sem teste é uma dívida que vai cobrar juro.' },
    ],
  },
  {
    id: 7,
    name: 'QA',
    shortDesc: 'Validar qualidade e critérios',
    description:
      'A entrega é validada contra os critérios de aceite, buscando garantir que o que foi construído funciona como esperado sem efeitos colaterais.',
    icon: ShieldCheck,
    owner: 'Time de QA',
    artifact: 'Relatório de testes + aprovação para homologação',
    status: 'neutral',
    details: [
      'Execução de testes manuais e automatizados',
      'Validação dos critérios de aceite definidos no refinamento',
      'Testes de regressão para garantir que nada quebrou',
      'Bugs encontrados reportados e priorizados',
      'QA é parte do time, não uma barreira externa',
    ],
    antiPatterns: [
      { label: 'QA só no final do ciclo', tip: 'QA precisa estar envolvido desde o refinamento, não só no final.' },
      { label: 'Ignorar bugs menores por pressa', tip: 'Bug "menor" hoje pode ser incidente amanhã.' },
    ],
  },
  {
    id: 8,
    name: 'Homologação',
    shortDesc: 'Validação pelo negócio',
    description:
      'O stakeholder ou área responsável valida a entrega no ambiente de homologação antes do go-live.',
    icon: Users,
    owner: 'PO + Stakeholders',
    artifact: 'Aprovação formal do stakeholder',
    status: 'caution',
    details: [
      'Ambiente de homologação espelha produção',
      'Validação guiada pelos critérios de aceite',
      'Feedback coletado e registrado',
      'Go/no-go decidido com base em critérios claros',
      'Sem homologação, não vai para produção',
    ],
    antiPatterns: [
      { label: 'Pular homologação por prazo', tip: 'Homologação evita incidentes em produção — não existe atalho seguro aqui.' },
      { label: 'Stakeholder que não testa', tip: 'A validação precisa ser real, não uma aprovação por e-mail.' },
    ],
  },
  {
    id: 9,
    name: 'Produção',
    shortDesc: 'Disponibilizar ao usuário final',
    description:
      'A solução é publicada em produção de forma controlada, com monitoramento ativo e plano de rollback caso necessário.',
    icon: Rocket,
    owner: 'Time de Engenharia',
    artifact: 'Deploy realizado + monitoramento ativo',
    status: 'ready',
    details: [
      'Deploy via pipeline de CI/CD automatizada',
      'Feature flags para rollout gradual quando aplicável',
      'Monitoramento de erros e métricas ativo no pós-deploy',
      'Plano de rollback definido antes de subir',
      'Comunicação ao time e stakeholders após go-live',
    ],
    antiPatterns: [
      { label: 'Deploy sem monitoramento', tip: 'Subir sem monitorar é nadar sem saber a profundidade.' },
      { label: 'Sem plano de rollback', tip: 'Todo deploy precisa de um caminho de volta se algo der errado.' },
    ],
  },
];

// ─────────────────── Helpers ───────────────────

const STATUS_CONFIG = {
  ready: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    label: 'Gate de qualidade',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.12)]',
    hoverGlow: 'hover:shadow-[0_0_32px_rgba(16,185,129,0.22)]',
    border: 'border-emerald-500/25 hover:border-emerald-500/50',
    numberBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    connectorColor: 'bg-emerald-500/40',
  },
  caution: {
    dot: 'bg-amber-500',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    label: 'Atenção',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.10)]',
    hoverGlow: 'hover:shadow-[0_0_32px_rgba(245,158,11,0.20)]',
    border: 'border-amber-500/25 hover:border-amber-500/50',
    numberBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    connectorColor: 'bg-amber-500/40',
  },
  neutral: {
    dot: 'bg-medcof-red',
    badge: 'bg-medcof-red/10 text-medcof-red border-medcof-red/20',
    label: 'Etapa principal',
    glow: 'shadow-[0_0_20px_rgba(227,0,15,0.10)]',
    hoverGlow: 'hover:shadow-[0_0_32px_rgba(227,0,15,0.20)]',
    border: 'border-medcof-red/20 hover:border-medcof-red/50',
    numberBg: 'bg-medcof-red/10 text-medcof-red border-medcof-red/20',
    connectorColor: 'bg-medcof-red/30',
  },
};

// ─────────────────── Step Card ───────────────────

function StepCard({ step, compact }: { step: ProcessStep; compact: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [showAnti, setShowAnti] = useState(false);
  const cfg = STATUS_CONFIG[step.status];
  const Icon = step.icon;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-5%' }}
        transition={{ duration: 0.25, delay: step.id * 0.03 }}
        className={[
          'flex items-center gap-4 p-4 rounded-xl border backdrop-blur-sm',
          'bg-surface/40 hover:bg-surface/70 transition-all duration-200 cursor-default',
          cfg.border,
        ].join(' ')}
      >
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0 ${cfg.numberBg}`}>
          <span className="text-xs font-black">{step.id}</span>
        </div>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/5`}>
          <Icon size={16} className="text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-foreground truncate">{step.name}</p>
          <p className="text-[11px] text-gray-500 truncate">{step.shortDesc}</p>
        </div>
        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border hidden sm:inline-flex ${cfg.badge}`}>
          {step.owner.split('+')[0].trim()}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.28, delay: step.id * 0.04 }}
      className={[
        'relative rounded-2xl border backdrop-blur-sm overflow-hidden',
        'bg-surface/50 hover:bg-surface/70 transition-all duration-300 group',
        cfg.border,
        cfg.glow,
        cfg.hoverGlow,
      ].join(' ')}
    >
      {/* top line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      {/* Header — always visible */}
      <button
        className="w-full text-left p-5 flex gap-4 items-start"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Number badge */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 font-black text-sm ${cfg.numberBg}`}>
          {step.id}
        </div>

        {/* Icon */}
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/8 flex-shrink-0 group-hover:border-white/15 transition-colors">
          <Icon size={18} className="text-gray-400 group-hover:text-gray-300 transition-colors" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-black text-[14px] text-foreground leading-tight">{step.name}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{step.shortDesc}</p>
            </div>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.18 }}
              className="text-gray-600 flex-shrink-0 mt-1"
            >
              <ChevronDown size={15} />
            </motion.div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-2 mt-2.5">
            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${cfg.badge}`}>
              {step.owner}
            </span>
          </div>
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 flex flex-col gap-4 border-t border-white/5 pt-4">
              {/* Description */}
              <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>

              {/* Artifact */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/4 border border-white/8">
                <Layers size={13} className="text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-0.5">Artefato</p>
                  <p className="text-[12px] text-gray-300 font-medium">{step.artifact}</p>
                </div>
              </div>

              {/* Details list */}
              <ul className="space-y-1.5">
                {step.details.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] text-gray-400">
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} mt-1.5 flex-shrink-0`} />
                    {d}
                  </li>
                ))}
              </ul>

              {/* Anti-patterns toggle */}
              {step.antiPatterns.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowAnti((v) => !v)}
                    className="flex items-center gap-2 text-amber-400 text-xs font-bold hover:text-amber-300 transition-colors w-full"
                  >
                    <AlertTriangle size={13} />
                    Anti-padrões a evitar ({step.antiPatterns.length})
                    <motion.span animate={{ rotate: showAnti ? 180 : 0 }} transition={{ duration: 0.16 }} className="ml-auto">
                      <ChevronDown size={13} />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {showAnti && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2.5 space-y-2">
                          {step.antiPatterns.map((ap, i) => (
                            <div key={i} className="flex gap-2.5 p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/15">
                              <AlertTriangle size={12} className="text-amber-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-[11px] font-bold text-amber-300">{ap.label}</p>
                                <p className="text-[11px] text-gray-500 mt-0.5">{ap.tip}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────── Page ───────────────────

export default function ProcessosPage() {
  const { activeStep } = useOnboarding();
  const isS5Active = activeStep?.id === 's5';
  const [compact, setCompact] = useState(false);

  return (
    <div className={`transition-all duration-500 pb-16 ${isS5Active ? 'p-6 rounded-3xl bg-medcof-red/5 ring-4 ring-medcof-red/40 mt-6' : ''}`}>

      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-medcof-red/20 to-medcof-red/5 border border-medcof-red/20 flex items-center justify-center text-medcof-red">
              <Route size={20} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground">
              Processos <span className="text-medcof-red">Ágeis</span>
            </h1>
          </div>
          <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
            Da ideia até a entrega em produção — o fluxo completo de como o time trabalha.
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1.5 p-1.5 bg-surface/60 border border-border/60 rounded-2xl self-start sm:self-end backdrop-blur-sm">
          <button
            onClick={() => setCompact(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${!compact ? 'bg-medcof-red/15 text-medcof-red ring-1 ring-medcof-red/30' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
          >
            <LayoutGrid size={13} /> Detalhado
          </button>
          <button
            onClick={() => setCompact(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${compact ? 'bg-medcof-red/15 text-medcof-red ring-1 ring-medcof-red/30' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
          >
            <List size={13} /> Resumido
          </button>
        </div>
      </div>

      {isS5Active && (
        <div className="mb-8 text-medcof-red/90 text-sm tracking-wider uppercase font-bold animate-pulse p-4 bg-medcof-red/10 rounded-2xl border border-medcof-red/30">
          👉 Passo 5: Explore o fluxo completo de desenvolvimento abaixo.
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        {[
          { label: 'Etapas', value: '9', color: 'text-medcof-red' },
          { label: 'Gates de qualidade', value: '2', color: 'text-emerald-400' },
          { label: 'Pontos de atenção', value: '3', color: 'text-amber-400' },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-xl border border-border/50 bg-surface/40 text-center backdrop-blur-sm">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-8">
        {[
          { dot: 'bg-medcof-red', label: 'Etapa principal' },
          { dot: 'bg-emerald-500', label: 'Gate de qualidade' },
          { dot: 'bg-amber-500', label: 'Atenção / Risco' },
        ].map((l) => (
          <span key={l.label} className="flex items-center gap-1.5 text-[11px] text-gray-500 font-semibold">
            <span className={`w-2 h-2 rounded-full ${l.dot}`} />
            {l.label}
          </span>
        ))}
      </div>

      {/* Steps */}
      <div className={compact ? 'flex flex-col gap-2' : 'flex flex-col gap-3'}>
        {STEPS.map((step, index) => {
          const isLast = index === STEPS.length - 1;
          const cfg = STATUS_CONFIG[step.status];
          return (
            <div key={step.id}>
              <StepCard step={step} compact={compact} />
              {!isLast && !compact && (
                <div className="flex justify-center py-1">
                  <div className={`w-px h-5 ${cfg.connectorColor}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer insight */}
      <div className="mt-12 p-6 rounded-2xl border border-medcof-red/15 bg-gradient-to-br from-medcof-red/5 to-surface/30 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-medcof-red/40 to-transparent" />
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-medcof-red/10 border border-medcof-red/20 flex items-center justify-center text-medcof-red flex-shrink-0">
            <ScanEye size={18} />
          </div>
          <div>
            <p className="font-black text-[14px] text-foreground mb-1">O processo é um meio, não um fim.</p>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              Seguir o fluxo não é burocracia — é garantir que o time entregue com qualidade e previsibilidade. O que importa é que cada etapa gere valor real para quem consome o produto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
