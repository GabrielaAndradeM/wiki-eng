'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, Sunrise, ClipboardList, Star, RotateCcw,
  BookOpen, Wrench, Heart, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, Users, Clock, Tag, Zap,
  Filter,
} from 'lucide-react';

// ─────────────────── Types ───────────────────

type FilterTag = 'todos' | 'alinhamento' | 'planejamento' | 'entrega' | 'melhoria';

interface Ritual {
  id: string;
  name: string;
  tagline: string;
  description: string;
  frequency: string;
  participants: string;
  impact: string;
  tags: FilterTag[];
  icon: React.ElementType;
  color: {
    border: string;
    glow: string;
    hoverGlow: string;
    badge: string;
    icon: string;
    tagPill: string;
    impactBg: string;
    dot: string;
  };
  goodPractices: string[];
  badPractices: string[];
}

// ─────────────────── Data ───────────────────

const RITUALS: Ritual[] = [
  {
    id: 'daily',
    name: 'Daily',
    tagline: 'O pulso diário do time',
    description:
      'Reunião rápida para sincronizar o que cada pessoa fez, vai fazer e se tem algum bloqueio. Não é status update para o gestor — é o time falando entre si.',
    frequency: 'Diária (15 min)',
    participants: 'Todo o squad',
    impact:
      'Quando bem usada, a Daily identifica bloqueios antes que virem problema.',
    tags: ['alinhamento'],
    icon: Sunrise,
    color: {
      border: 'border-violet-500/30',
      glow: 'shadow-[0_0_24px_rgba(139,92,246,0.10)]',
      hoverGlow: 'hover:shadow-[0_0_36px_rgba(139,92,246,0.25)]',
      badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
      icon: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
      tagPill: 'bg-violet-500/10 text-violet-400',
      impactBg: 'bg-violet-950/30 border-violet-500/20 text-violet-300',
      dot: 'bg-violet-500',
    },
    goodPractices: [
      'Ser objetivo: o que fiz, o que vou fazer, tenho bloqueio?',
      'Resolver impedimentos fora da daily com quem precisa',
      'Começar no horário mesmo sem todo mundo',
      'Focar em colaboração, não em reportar para o gestor',
    ],
    badPractices: [
      'Transformar em reunião de status detalhada',
      'Discutir soluções técnicas durante a daily',
      'Participar sem câmera e sem atenção',
      'Deixar passar bloqueios porque "não quero incomodar"',
    ],
  },
  {
    id: 'planning',
    name: 'Planning',
    tagline: 'Onde a sprint começa com clareza',
    description:
      'Cerimônia de início de sprint onde o time seleciona as tarefas do backlog, entende o escopo e define o que se compromete a entregar no ciclo.',
    frequency: 'A cada início de sprint',
    participants: 'Squad + Tech Lead + PO (quando disponível)',
    impact:
      'Uma Planning bem feita evita surpresas no meio da sprint e mantém o ritmo previsível.',
    tags: ['planejamento'],
    icon: ClipboardList,
    color: {
      border: 'border-blue-500/30',
      glow: 'shadow-[0_0_24px_rgba(59,130,246,0.10)]',
      hoverGlow: 'hover:shadow-[0_0_36px_rgba(59,130,246,0.25)]',
      badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      icon: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      tagPill: 'bg-blue-500/10 text-blue-400',
      impactBg: 'bg-blue-950/30 border-blue-500/20 text-blue-300',
      dot: 'bg-blue-500',
    },
    goodPractices: [
      'Só entrar tasks com "Definition of Ready"',
      'Time todo participando — não só o Tech Lead',
      'Deixar claro o objetivo da sprint (sprint goal)',
      'Perguntar sobre dependências e riscos antes de aceitar',
    ],
    badPractices: [
      'Aceitar tasks que ninguém entendeu direito',
      'Ignorar a capacidade real do time (férias, feriados)',
      'Planejar sem dar voz a quem vai executar',
      'Pular a planning "porque a sprint vai ser tranquila"',
    ],
  },
  {
    id: 'review',
    name: 'Review',
    tagline: 'Mostrar o que foi construído',
    description:
      'Apresentação do que foi entregue na sprint para stakeholders e demais interessados. Momento de validar o trabalho com quem vai usar o produto.',
    frequency: 'Ao final de cada sprint',
    participants: 'Squad + stakeholders + liderança',
    impact:
      'A Review fecha o ciclo de feedback e garante que o time entregou o que realmente importa.',
    tags: ['entrega'],
    icon: Star,
    color: {
      border: 'border-amber-500/30',
      glow: 'shadow-[0_0_24px_rgba(245,158,11,0.10)]',
      hoverGlow: 'hover:shadow-[0_0_36px_rgba(245,158,11,0.25)]',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      icon: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      tagPill: 'bg-amber-500/10 text-amber-400',
      impactBg: 'bg-amber-950/30 border-amber-500/20 text-amber-300',
      dot: 'bg-amber-500',
    },
    goodPractices: [
      'Mostrar produto funcionando, não slides',
      'Envolver o time na apresentação, não só o TL',
      'Coletar feedback real dos stakeholders',
      'Registrar pontos de melhoria levantados na reunião',
    ],
    badPractices: [
      'Mostrar features incompletas ou com bug conhecido',
      'Fazer a review virar uma reunião técnica',
      'Não convidar quem tem interesse no resultado',
      'Usar a review só como formalidade sem feedback real',
    ],
  },
  {
    id: 'retrospectiva',
    name: 'Retrospectiva',
    tagline: 'Melhorar o jeito de trabalhar',
    description:
      'Espaço seguro para o time refletir sobre o que funcionou, o que não funcionou e o que pode ser diferente na próxima sprint. O ritual mais humano de todos.',
    frequency: 'Ao final de cada sprint',
    participants: 'Squad + Tech Lead (sem stakeholders externos)',
    impact:
      'Times que fazem retros com seriedade evoluem mais rápido do que os que só entregam código.',
    tags: ['melhoria'],
    icon: RotateCcw,
    color: {
      border: 'border-emerald-500/30',
      glow: 'shadow-[0_0_24px_rgba(16,185,129,0.10)]',
      hoverGlow: 'hover:shadow-[0_0_36px_rgba(16,185,129,0.25)]',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      tagPill: 'bg-emerald-500/10 text-emerald-400',
      impactBg: 'bg-emerald-950/30 border-emerald-500/20 text-emerald-300',
      dot: 'bg-emerald-500',
    },
    goodPractices: [
      'Criar ambiente seguro — críticas ao processo, não às pessoas',
      'Gerar ações concretas com responsável e prazo',
      'Revisar ações da retro anterior no início',
      'Participar de forma honesta e construtiva',
    ],
    badPractices: [
      'Transformar em sessão de reclamação sem resolução',
      'Nunca agir sobre o que foi levantado',
      'Deixar de fazer porque "ja sabemos os problemas"',
      'Não dar espaço para pessoas mais quietas falarem',
    ],
  },
  {
    id: 'refinamento-negocio',
    name: 'Refinamento de Negócio',
    tagline: 'Entender o problema antes de resolver',
    description:
      'Sessão onde PMs e TLs detalham requisitos, quebram épicos e preparam histórias de usuário antes de chegar no técnico. O time entende o "por quê".',
    frequency: 'Uma vez por sprint (ou sob demanda)',
    participants: 'Tech Lead + PM + Coordenador',
    impact:
      'Refinar bem de negócio evita retrabalho técnico por requisito errado ou incompleto.',
    tags: ['planejamento'],
    icon: BookOpen,
    color: {
      border: 'border-rose-500/30',
      glow: 'shadow-[0_0_24px_rgba(244,63,94,0.10)]',
      hoverGlow: 'hover:shadow-[0_0_36px_rgba(244,63,94,0.25)]',
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      icon: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      tagPill: 'bg-rose-500/10 text-rose-400',
      impactBg: 'bg-rose-950/30 border-rose-500/20 text-rose-300',
      dot: 'bg-rose-500',
    },
    goodPractices: [
      'Fazer perguntas até entender o problema de verdade',
      'Definir critérios de aceite claros e testáveis',
      'Registrar decisões e premissas discutidas',
      'Sair com tasks prontas para o refinamento técnico',
    ],
    badPractices: [
      'Aceitar stories sem critérios de aceite',
      'Não perguntar "qual o problema que isso resolve?"',
      'Ignorar edge cases por pressa',
      'Levar para o técnico o que ainda não está claro',
    ],
  },
  {
    id: 'refinamento-tecnico',
    name: 'Refinamento Técnico',
    tagline: 'Preparar o trabalho antes de executar',
    description:
      'O time de desenvolvimento planeja a solução técnica: arquitetura, modelagem, estimativa e identificação de riscos. Stories viram tarefas prontas para execução.',
    frequency: 'Uma vez por sprint',
    participants: 'Todo o squad de desenvolvimento',
    impact:
      'Refinamento técnico reduz bloqueios no meio da sprint e aumenta a previsibilidade da entrega.',
    tags: ['planejamento', 'entrega'],
    icon: Wrench,
    color: {
      border: 'border-cyan-500/30',
      glow: 'shadow-[0_0_24px_rgba(6,182,212,0.10)]',
      hoverGlow: 'hover:shadow-[0_0_36px_rgba(6,182,212,0.25)]',
      badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      icon: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      tagPill: 'bg-cyan-500/10 text-cyan-400',
      impactBg: 'bg-cyan-950/30 border-cyan-500/20 text-cyan-300',
      dot: 'bg-cyan-500',
    },
    goodPractices: [
      'Pontuar esforço com o time todo (não só o TL)',
      'Identificar dependências antes de commitar',
      'Documentar decisões técnicas relevantes',
      'Garantir que todos entenderam a task antes de sair',
    ],
    badPractices: [
      'TL resolver tudo sozinho e só comunicar depois',
      'Não questionar estimativas improváveis',
      'Ignorar débito técnico na hora de estimar',
      'Sair sem definir responsável por cada task',
    ],
  },
  {
    id: '1-1',
    name: '1:1',
    tagline: 'Conversa que importa, sem plateia',
    description:
      'Encontro periódico entre liderança e cada membro do time para falar sobre carreira, desafios pessoais, feedbacks e alinhamento individual. Fora do fluxo operacional.',
    frequency: 'Quinzenal ou mensal',
    participants: 'Tech Lead / Coordenador + cada dev individualmente',
    impact:
      'Pessoas que têm 1:1 consistentes se sentem mais ouvidas e retêm melhor na empresa.',
    tags: ['alinhamento', 'melhoria'],
    icon: Heart,
    color: {
      border: 'border-pink-500/30',
      glow: 'shadow-[0_0_24px_rgba(236,72,153,0.10)]',
      hoverGlow: 'hover:shadow-[0_0_36px_rgba(236,72,153,0.25)]',
      badge: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      icon: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      tagPill: 'bg-pink-500/10 text-pink-400',
      impactBg: 'bg-pink-950/30 border-pink-500/20 text-pink-300',
      dot: 'bg-pink-500',
    },
    goodPractices: [
      'Ter uma agenda compartilhada para os dois anotarem pontos',
      'A liderança falar menos e ouvir mais',
      'Tratar como reunion sagrada — não cancelar à toa',
      'Falar de carreira, não só de tarefas do dia a dia',
    ],
    badPractices: [
      'Transformar em checkpoint de sprint',
      'Cancelar ou adiar repetidamente',
      'Só a liderança falar o tempo todo',
      'Não tomar nenhuma ação após o que foi conversado',
    ],
  },
];

const FILTER_OPTIONS: { id: FilterTag; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'alinhamento', label: 'Alinhamento' },
  { id: 'planejamento', label: 'Planejamento' },
  { id: 'entrega', label: 'Entrega' },
  { id: 'melhoria', label: 'Melhoria' },
];

const TAG_COLORS: Record<FilterTag, string> = {
  todos: '',
  alinhamento: 'bg-violet-500/10 text-violet-400',
  planejamento: 'bg-blue-500/10 text-blue-400',
  entrega: 'bg-amber-500/10 text-amber-400',
  melhoria: 'bg-emerald-500/10 text-emerald-400',
};

// ─────────────────── Ritual Card ───────────────────

function RitualCard({ ritual }: { ritual: Ritual }) {
  const [expanded, setExpanded] = useState(false);
  const [showGood, setShowGood] = useState(false);
  const [showBad, setShowBad] = useState(false);
  const Icon = ritual.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10, scale: 0.97 }}
      whileHover={{ y: expanded ? 0 : -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className={[
        'relative rounded-2xl border backdrop-blur-sm overflow-hidden transition-shadow duration-300 cursor-pointer',
        ritual.color.border,
        ritual.color.glow,
        ritual.color.hoverGlow,
        expanded ? 'bg-surface/80' : 'bg-surface/50 hover:bg-surface/70',
      ].join(' ')}
      onClick={() => setExpanded((v) => !v)}
    >
      {/* Top gradient line */}
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent`} />

      {/* Card header */}
      <div className="p-6 flex gap-4 items-start">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border flex-shrink-0 ${ritual.color.icon}`}>
          <Icon size={22} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-black text-[15px] text-foreground leading-tight">{ritual.name}</p>
              <p className={`text-[11px] font-semibold mt-0.5 ${ritual.color.tagPill.replace('bg-', 'text-').split(' ')[1]}`}>
                {ritual.tagline}
              </p>
            </div>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-gray-500 flex-shrink-0 mt-0.5"
              onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
            >
              <ChevronDown size={16} />
            </motion.div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="flex items-center gap-1 text-[10px] font-semibold text-gray-500">
              <Clock size={10} /> {ritual.frequency}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-gray-500">
              <Users size={10} /> {ritual.participants}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {ritual.tags.filter(t => t !== 'todos').map((tag) => (
              <span key={tag} className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${TAG_COLORS[tag]}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 pb-6 flex flex-col gap-4 border-t border-white/5 pt-5">
              {/* Description */}
              <p className="text-sm text-gray-400 leading-relaxed">{ritual.description}</p>

              {/* Impact highlight */}
              <div className={`flex items-start gap-3 p-3.5 rounded-xl border ${ritual.color.impactBg}`}>
                <Zap size={14} className="flex-shrink-0 mt-0.5" />
                <p className="text-[12px] font-semibold leading-relaxed">{ritual.impact}</p>
              </div>

              {/* Good practices */}
              <div>
                <button
                  onClick={() => setShowGood((v) => !v)}
                  className="flex items-center gap-2 text-emerald-400 text-xs font-bold hover:text-emerald-300 transition-colors w-full"
                >
                  <CheckCircle2 size={14} />
                  Boas práticas
                  <motion.span animate={{ rotate: showGood ? 180 : 0 }} transition={{ duration: 0.18 }} className="ml-auto">
                    <ChevronDown size={13} />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {showGood && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2.5 space-y-1.5 overflow-hidden"
                    >
                      {ritual.goodPractices.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-[12px] text-gray-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                          {p}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {/* Bad practices */}
              <div>
                <button
                  onClick={() => setShowBad((v) => !v)}
                  className="flex items-center gap-2 text-red-400 text-xs font-bold hover:text-red-300 transition-colors w-full"
                >
                  <XCircle size={14} />
                  Más práticas
                  <motion.span animate={{ rotate: showBad ? 180 : 0 }} transition={{ duration: 0.18 }} className="ml-auto">
                    <ChevronDown size={13} />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {showBad && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2.5 space-y-1.5 overflow-hidden"
                    >
                      {ritual.badPractices.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-[12px] text-gray-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                          {p}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────── Page ───────────────────

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 280, damping: 24 } },
};

export default function RituaisPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTag>('todos');

  const filtered = activeFilter === 'todos'
    ? RITUALS
    : RITUALS.filter((r) => r.tags.includes(activeFilter));

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8 pb-16"
    >
      {/* Header */}
      <motion.div variants={item} className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <CalendarDays size={20} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground">
            Agendas &amp; <span className="text-violet-400">Rituais</span>
          </h1>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          Como o time se organiza, se alinha e evolui continuamente.
        </p>
      </motion.div>

      {/* Manifesto banner */}
      <motion.div
        variants={item}
        className="relative rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/40 to-surface/30 backdrop-blur-sm p-6 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[100px] bg-violet-500/10 blur-[60px] rounded-full" />
        <div className="relative flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0">
            <Zap size={18} />
          </div>
          <div>
            <p className="text-[15px] font-black text-foreground leading-snug">
              &ldquo;Rituais não existem para ocupar agenda.
            </p>
            <p className="text-[15px] font-black text-violet-400 leading-snug">
              Eles existem para ajudar o time a trabalhar melhor.&rdquo;
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Rituais', value: '7', color: 'text-violet-400' },
          { label: 'Alinhamento', value: '2', color: 'text-violet-400' },
          { label: 'Planejamento', value: '3', color: 'text-blue-400' },
          { label: 'Entrega & Melhoria', value: '2', color: 'text-emerald-400' },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-xl border border-border/50 bg-surface/40 text-center backdrop-blur-sm">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Filter bar */}
      <motion.div variants={item} className="flex items-center gap-3 flex-wrap">
        <span className="flex items-center gap-1.5 text-[11px] text-gray-600 font-bold uppercase tracking-widest">
          <Filter size={11} /> Filtrar
        </span>
        <div className="flex flex-wrap gap-1.5 p-1.5 bg-surface/60 border border-border/60 rounded-2xl backdrop-blur-sm">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setActiveFilter(opt.id)}
              className={[
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
                activeFilter === opt.id
                  ? 'bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30'
                  : 'text-gray-500 hover:bg-white/5 hover:text-gray-300',
              ].join(' ')}
            >
              {opt.id !== 'todos' && (
                <span className={`w-1.5 h-1.5 rounded-full ${TAG_COLORS[opt.id].split(' ')[0].replace('bg-', 'bg-').replace('/10', '')}`} />
              )}
              {opt.label}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-gray-600">
          {filtered.length} {filtered.length === 1 ? 'ritual' : 'rituais'}
        </span>
      </motion.div>

      {/* Cards grid */}
      <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((ritual) => (
            <RitualCard key={ritual.id} ritual={ritual} />
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
