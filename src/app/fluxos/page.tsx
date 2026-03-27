'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '@/context/OnboardingContext';
import {
  Bug, Rocket, Palette, Flame, Sparkles, RefreshCw,
  ChevronRight, X, CheckCircle2, Circle, Clock, User,
  Wrench, AlertTriangle, HelpCircle, Search, Check,
  ArrowRight, Zap,
} from 'lucide-react';

/* ─── Tipos ──────────────────────────────────────────────────────────────── */

interface StepDetail {
  id: string;
  label: string;
  description: string;
  responsible: string;
  tool: string;
  toolUrl?: string;
  sla: string;
  checklist: string[];
}

interface Flow {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;           // Tailwind accent text
  border: string;          // Tailwind border
  bg: string;              // Tailwind bg
  activeBg: string;
  glow: string;            // rgba for box-shadow
  bar: string;             // Tailwind bg for bar
  steps: StepDetail[];
  antiPatterns: string[];
  whenToUse: string;
}

/* ─── Dados ──────────────────────────────────────────────────────────────── */

const FLOWS: Flow[] = [
  {
    id: 'bug',
    title: 'Fluxo de Bug',
    subtitle: 'Correção de defeitos em produção ou staging',
    icon: <Bug size={16} />,
    color: 'text-red-400',
    border: 'border-red-500/30',
    bg: 'bg-red-500/5',
    activeBg: 'bg-red-500/10',
    glow: 'rgba(239,68,68,0.18)',
    bar: 'bg-red-500',
    whenToUse: 'Use quando um defeito for reportado em produção ou staging e precisar de correção imediata.',
    antiPatterns: [
      'Pular a triagem de severidade e ir direto para o código',
      'Fazer deploy sem passar pelo QA',
      'Não registrar o bug no Jira antes de corrigir',
      'Corrigir sem reproduzir o problema localmente',
      'Fechar o ticket sem validar em produção',
    ],
    steps: [
      {
        id: 'bug-1',
        label: 'Identificado pelo N2',
        description: 'O time de suporte (N2) identifica e registra o bug reportado pelo usuário ou monitoramento.',
        responsible: 'Suporte (N2)',
        tool: 'Jira',
        sla: 'até 30 min',
        checklist: [
          'Registrar ticket no Jira com título claro',
          'Descrever passos para reprodução',
          'Anexar prints ou logs relevantes',
          'Marcar ambiente afetado (prod/staging)',
        ],
      },
      {
        id: 'bug-2',
        label: 'Triagem de Severidade',
        description: 'QA ou Tech Lead classifica o impacto do bug e define a prioridade de atendimento.',
        responsible: 'QA / Tech Lead',
        tool: 'Jira',
        sla: 'até 2h',
        checklist: [
          'Avaliar impacto no usuário final',
          'Verificar frequência de ocorrência',
          'Definir severidade (S1/S2/S3)',
          'Atribuir ao time responsável',
          'Comunicar no canal adequado',
        ],
      },
      {
        id: 'bug-3',
        label: 'Correção Tech',
        description: 'O desenvolvedor do time responsável implementa a correção e abre o Pull Request.',
        responsible: 'Time responsável',
        tool: 'GitHub / VS Code',
        sla: 'até 1 dia (S1: até 4h)',
        checklist: [
          'Criar branch a partir da main/release',
          'Implementar a correção',
          'Adicionar testes cobrindo o caso',
          'Abrir PR com descrição do fix',
          'Solicitar code review',
        ],
      },
      {
        id: 'bug-4',
        label: 'QA',
        description: 'Time de QA valida a correção em ambiente de staging antes do deploy.',
        responsible: 'Time QA',
        tool: 'Staging / Jira',
        sla: 'até 4h',
        checklist: [
          'Validar correção no ambiente de staging',
          'Executar testes de regressão na área afetada',
          'Confirmar que o bug não se reproduz mais',
          'Verificar que não houve regressão',
          'Aprovar o PR para merge',
        ],
      },
      {
        id: 'bug-5',
        label: 'Deploy Hotfix',
        description: 'Deploy da correção em produção com monitoramento pós-deploy.',
        responsible: 'Tech Lead / DevOps',
        tool: 'GitHub Actions / AWS',
        sla: 'até 2h após QA',
        checklist: [
          'Merge do PR aprovado',
          'Acionar pipeline de deploy',
          'Monitorar logs pós-deploy',
          'Validar em produção',
          'Fechar ticket no Jira',
          'Comunicar resolução ao time',
        ],
      },
    ],
  },
  {
    id: 'release',
    title: 'Fluxo de Release',
    subtitle: 'Entrega planejada de funcionalidades ao fim da sprint',
    icon: <Rocket size={16} />,
    color: 'text-sky-400',
    border: 'border-sky-500/30',
    bg: 'bg-sky-500/5',
    activeBg: 'bg-sky-500/10',
    glow: 'rgba(14,165,233,0.18)',
    bar: 'bg-sky-500',
    whenToUse: 'Use ao final de cada sprint para entregar as funcionalidades desenvolvidas e validadas.',
    antiPatterns: [
      'Fazer merge de features não testadas na release branch',
      'Pular o Regression Test por pressão de prazo',
      'Deploy sem aprovação do negócio',
      'Não criar a tag no Git antes do deploy',
      'Não comunicar o Release Check ao time',
    ],
    steps: [
      {
        id: 'rel-1',
        label: 'Cut off da Sprint',
        description: 'Encerramento do desenvolvimento da sprint — nenhuma feature nova entra após este ponto.',
        responsible: 'Tech Lead / Scrum Master',
        tool: 'Jira / GitHub',
        sla: 'último dia da sprint',
        checklist: [
          'Confirmar quais tickets estão prontos para release',
          'Mover tickets incompletos para próxima sprint',
          'Criar branch de release a partir da develop',
          'Comunicar cut off ao time',
        ],
      },
      {
        id: 'rel-2',
        label: 'Regression Test',
        description: 'Execução de testes de regressão para garantir que nada foi quebrado durante a sprint.',
        responsible: 'Time QA',
        tool: 'Staging / Jira',
        sla: 'até 1 dia',
        checklist: [
          'Executar suite de testes de regressão',
          'Testar fluxos críticos do produto',
          'Registrar bugs encontrados no Jira',
          'Validar correções de bugs da sprint',
          'Gerar relatório de QA',
        ],
      },
      {
        id: 'rel-3',
        label: 'Aprovação de Negócio',
        description: 'Product Manager valida as funcionalidades entregues e aprova o release.',
        responsible: 'Product Manager',
        tool: 'Staging / Jira',
        sla: 'até 4h',
        checklist: [
          'Demo das funcionalidades para o PM',
          'Validar critérios de aceite',
          'Confirmar aprovação no Jira',
          'Alinhar comunicado de release',
        ],
      },
      {
        id: 'rel-4',
        label: 'Tag no Git',
        description: 'Criação da tag de versão no repositório para rastreabilidade.',
        responsible: 'Tech Lead',
        tool: 'GitHub',
        sla: 'até 1h após aprovação',
        checklist: [
          'Definir número de versão (semver)',
          'Criar tag no repositório',
          'Gerar changelog com as mudanças',
          'Publicar release notes no GitHub',
        ],
      },
      {
        id: 'rel-5',
        label: 'Release Check',
        description: 'Validação final em produção após o deploy e comunicação ao time.',
        responsible: 'Tech Lead / QA',
        tool: 'Produção / Slack',
        sla: 'até 2h após deploy',
        checklist: [
          'Validar funcionalidades em produção',
          'Monitorar métricas e erros',
          'Comunicar release no Slack',
          'Atualizar documentação se necessário',
          'Fechar sprint no Jira',
        ],
      },
    ],
  },
  {
    id: 'design-system',
    title: 'Design System',
    subtitle: 'Evolução e publicação de componentes do DS',
    icon: <Palette size={16} />,
    color: 'text-violet-400',
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/5',
    activeBg: 'bg-violet-500/10',
    glow: 'rgba(139,92,246,0.18)',
    bar: 'bg-violet-500',
    whenToUse: 'Use ao criar ou evoluir componentes visuais que serão compartilhados entre produtos.',
    antiPatterns: [
      'Criar componente sem proposta no Figma',
      'Pular a revisão do Comitê DS',
      'Publicar sem testes visuais',
      'Não documentar no Storybook',
      'Alterar componente existente sem versionamento',
    ],
    steps: [
      {
        id: 'ds-1',
        label: 'Proposta no Figma',
        description: 'Designer cria a proposta visual do componente no Figma com variações e estados.',
        responsible: 'Designer',
        tool: 'Figma',
        sla: 'variável',
        checklist: [
          'Criar frame com todas as variações',
          'Documentar estados (default, hover, disabled)',
          'Definir tokens de design utilizados',
          'Compartilhar link para revisão',
        ],
      },
      {
        id: 'ds-2',
        label: 'Revisão do Comitê DS',
        description: 'Comitê de Design System revisa a proposta e aprova ou solicita ajustes.',
        responsible: 'Comitê DS',
        tool: 'Figma / Meet',
        sla: 'até 2 dias',
        checklist: [
          'Apresentar proposta ao comitê',
          'Verificar consistência com o DS atual',
          'Validar acessibilidade',
          'Aprovar ou solicitar revisões',
          'Documentar decisões tomadas',
        ],
      },
      {
        id: 'ds-3',
        label: 'Desenvolvimento do Componente',
        description: 'Desenvolvedor implementa o componente seguindo a especificação aprovada.',
        responsible: 'Desenvolvedor Frontend',
        tool: 'GitHub / VS Code',
        sla: 'variável',
        checklist: [
          'Implementar seguindo o Figma aprovado',
          'Usar tokens de design corretos',
          'Garantir responsividade',
          'Escrever testes unitários',
          'Abrir PR para revisão',
        ],
      },
      {
        id: 'ds-4',
        label: 'Testes Visuais',
        description: 'Validação visual do componente em diferentes contextos e tamanhos de tela.',
        responsible: 'QA / Designer',
        tool: 'Storybook / Chromatic',
        sla: 'até 1 dia',
        checklist: [
          'Validar visual contra o Figma',
          'Testar em diferentes viewports',
          'Verificar temas (light/dark)',
          'Aprovar snapshots visuais',
        ],
      },
      {
        id: 'ds-5',
        label: 'Publicação no Storybook',
        description: 'Componente publicado no Storybook com documentação completa.',
        responsible: 'Tech Lead DS',
        tool: 'Storybook / npm',
        sla: 'até 1 dia após aprovação',
        checklist: [
          'Merge do PR aprovado',
          'Publicar nova versão do pacote',
          'Atualizar documentação no Storybook',
          'Comunicar novo componente ao time',
          'Atualizar changelog do DS',
        ],
      },
    ],
  },
  {
    id: 'incident',
    title: 'Fluxo de Incidente',
    subtitle: 'Resposta a incidentes críticos em produção',
    icon: <Flame size={16} />,
    color: 'text-orange-400',
    border: 'border-orange-500/30',
    bg: 'bg-orange-500/5',
    activeBg: 'bg-orange-500/10',
    glow: 'rgba(249,115,22,0.18)',
    bar: 'bg-orange-500',
    whenToUse: 'Use quando houver indisponibilidade total ou parcial de um produto em produção afetando usuários.',
    antiPatterns: [
      'Não declarar o incidente formalmente',
      'Tentar resolver sem comunicar o time',
      'Fazer múltiplas mudanças ao mesmo tempo',
      'Não fazer post-mortem após resolução',
      'Fechar sem identificar causa raiz',
    ],
    steps: [
      {
        id: 'inc-1',
        label: 'Detecção & Alerta',
        description: 'Incidente identificado por monitoramento ou reporte de usuário.',
        responsible: 'Monitoramento / Suporte',
        tool: 'Datadog / Slack',
        sla: 'imediato',
        checklist: [
          'Confirmar que é um incidente real',
          'Avaliar impacto inicial',
          'Acionar canal #incidentes no Slack',
          'Notificar Tech Lead e VPE',
        ],
      },
      {
        id: 'inc-2',
        label: 'Declaração do Incidente',
        description: 'Incidente formalmente declarado com severidade e responsável definidos.',
        responsible: 'Tech Lead / VPE',
        tool: 'Jira / Slack',
        sla: 'até 15 min',
        checklist: [
          'Criar ticket de incidente no Jira',
          'Definir severidade (P1/P2)',
          'Nomear Incident Commander',
          'Abrir bridge de comunicação',
          'Comunicar stakeholders',
        ],
      },
      {
        id: 'inc-3',
        label: 'Investigação',
        description: 'Time técnico investiga a causa raiz do incidente.',
        responsible: 'Time técnico',
        tool: 'Datadog / GitHub / AWS',
        sla: 'até 30 min',
        checklist: [
          'Analisar logs e métricas',
          'Identificar último deploy/mudança',
          'Isolar componente afetado',
          'Propor hipóteses de causa',
          'Documentar achados em tempo real',
        ],
      },
      {
        id: 'inc-4',
        label: 'Mitigação',
        description: 'Ação imediata para reduzir o impacto, mesmo que não resolva a causa raiz.',
        responsible: 'Time técnico',
        tool: 'GitHub / AWS',
        sla: 'o mais rápido possível',
        checklist: [
          'Aplicar rollback se necessário',
          'Ativar feature flag de contingência',
          'Escalar recursos se necessário',
          'Comunicar progresso a cada 15 min',
        ],
      },
      {
        id: 'inc-5',
        label: 'Resolução & Post-mortem',
        description: 'Incidente resolvido e análise de causa raiz documentada.',
        responsible: 'Tech Lead / Time',
        tool: 'Jira / Confluence',
        sla: 'até 48h após resolução',
        checklist: [
          'Confirmar resolução em produção',
          'Comunicar resolução ao time',
          'Fechar ticket de incidente',
          'Realizar post-mortem (blameless)',
          'Documentar causa raiz e ações preventivas',
          'Criar tickets de melhoria',
        ],
      },
    ],
  },
  {
    id: 'feature',
    title: 'Fluxo de Feature',
    subtitle: 'Desenvolvimento de novas funcionalidades',
    icon: <Sparkles size={16} />,
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/5',
    activeBg: 'bg-emerald-500/10',
    glow: 'rgba(16,185,129,0.18)',
    bar: 'bg-emerald-500',
    whenToUse: 'Use para desenvolver novas funcionalidades planejadas no roadmap do produto.',
    antiPatterns: [
      'Começar o desenvolvimento sem refinamento',
      'Não ter critérios de aceite definidos',
      'Fazer PR gigante sem quebrar em partes menores',
      'Não envolver o designer desde o início',
      'Entregar sem validação do PM',
    ],
    steps: [
      {
        id: 'feat-1',
        label: 'Refinamento',
        description: 'Time refina o ticket com PM e Designer para alinhar escopo e critérios de aceite.',
        responsible: 'PM + Tech Lead + Designer',
        tool: 'Jira / Figma',
        sla: 'antes da sprint',
        checklist: [
          'Definir critérios de aceite claros',
          'Estimar pontos de complexidade',
          'Validar design no Figma',
          'Identificar dependências técnicas',
          'Quebrar em subtarefas se necessário',
        ],
      },
      {
        id: 'feat-2',
        label: 'Desenvolvimento',
        description: 'Desenvolvedor implementa a feature seguindo os critérios de aceite.',
        responsible: 'Desenvolvedor',
        tool: 'GitHub / VS Code',
        sla: 'conforme estimativa',
        checklist: [
          'Criar branch a partir da develop',
          'Implementar seguindo o design aprovado',
          'Escrever testes unitários e de integração',
          'Fazer commits semânticos',
          'Abrir PR com descrição detalhada',
        ],
      },
      {
        id: 'feat-3',
        label: 'Code Review',
        description: 'Tech Lead ou par revisa o código antes do merge.',
        responsible: 'Tech Lead / Par',
        tool: 'GitHub',
        sla: 'até 1 dia',
        checklist: [
          'Revisar lógica e legibilidade',
          'Verificar cobertura de testes',
          'Checar performance e segurança',
          'Aprovar ou solicitar mudanças',
        ],
      },
      {
        id: 'feat-4',
        label: 'QA & Validação',
        description: 'QA valida os critérios de aceite e PM aprova a entrega.',
        responsible: 'QA + PM',
        tool: 'Staging / Jira',
        sla: 'até 1 dia',
        checklist: [
          'Testar todos os critérios de aceite',
          'Validar fluxos de borda',
          'Aprovação do PM no staging',
          'Atualizar status no Jira',
        ],
      },
      {
        id: 'feat-5',
        label: 'Deploy & Monitoramento',
        description: 'Feature deployada em produção com monitoramento ativo.',
        responsible: 'Tech Lead',
        tool: 'GitHub Actions / Datadog',
        sla: 'na release da sprint',
        checklist: [
          'Merge na branch de release',
          'Deploy via pipeline',
          'Monitorar métricas pós-deploy',
          'Validar em produção',
          'Comunicar entrega ao time',
        ],
      },
    ],
  },
  {
    id: 'tech-debt',
    title: 'Débito Técnico',
    subtitle: 'Refatoração e melhoria de código existente',
    icon: <RefreshCw size={16} />,
    color: 'text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/5',
    activeBg: 'bg-amber-500/10',
    glow: 'rgba(245,158,11,0.18)',
    bar: 'bg-amber-500',
    whenToUse: 'Use para endereçar débitos técnicos identificados que impactam a velocidade ou qualidade do time.',
    antiPatterns: [
      'Refatorar sem cobertura de testes prévia',
      'Misturar débito técnico com features no mesmo PR',
      'Não medir o impacto antes e depois',
      'Refatorar tudo de uma vez sem entregas incrementais',
      'Não comunicar ao PM o impacto no roadmap',
    ],
    steps: [
      {
        id: 'td-1',
        label: 'Identificação & Registro',
        description: 'Débito técnico identificado e registrado com impacto e justificativa.',
        responsible: 'Desenvolvedor / Tech Lead',
        tool: 'Jira',
        sla: 'quando identificado',
        checklist: [
          'Descrever o problema atual',
          'Documentar impacto na velocidade/qualidade',
          'Estimar esforço de resolução',
          'Priorizar junto ao Tech Lead',
        ],
      },
      {
        id: 'td-2',
        label: 'Priorização',
        description: 'Tech Lead e PM alinham a prioridade do débito no backlog.',
        responsible: 'Tech Lead + PM',
        tool: 'Jira',
        sla: 'no refinamento',
        checklist: [
          'Avaliar impacto vs esforço',
          'Alocar na sprint adequada',
          'Comunicar ao time',
        ],
      },
      {
        id: 'td-3',
        label: 'Implementação',
        description: 'Desenvolvedor resolve o débito com testes garantindo não regressão.',
        responsible: 'Desenvolvedor',
        tool: 'GitHub / VS Code',
        sla: 'conforme estimativa',
        checklist: [
          'Garantir cobertura de testes antes de refatorar',
          'Refatorar incrementalmente',
          'Manter comportamento externo igual',
          'Abrir PR com contexto claro',
        ],
      },
      {
        id: 'td-4',
        label: 'Validação Técnica',
        description: 'Code review focado em garantir que a refatoração não introduziu regressões.',
        responsible: 'Tech Lead',
        tool: 'GitHub',
        sla: 'até 1 dia',
        checklist: [
          'Revisar que comportamento externo não mudou',
          'Validar melhoria de qualidade',
          'Confirmar cobertura de testes',
          'Aprovar merge',
        ],
      },
      {
        id: 'td-5',
        label: 'Deploy & Medição',
        description: 'Deploy e medição do impacto da melhoria.',
        responsible: 'Tech Lead',
        tool: 'GitHub Actions / Datadog',
        sla: 'na release da sprint',
        checklist: [
          'Deploy via pipeline normal',
          'Medir métricas de performance/qualidade',
          'Documentar ganhos obtidos',
          'Fechar ticket com resultado',
        ],
      },
    ],
  },
];

/* ─── Helper: qual fluxo usar ────────────────────────────────────────────── */

const FLOW_SELECTOR = [
  { question: 'Tem um bug em produção?', flowId: 'bug' },
  { question: 'Produção está fora do ar?', flowId: 'incident' },
  { question: 'Vai entregar a sprint?', flowId: 'release' },
  { question: 'Vai desenvolver uma feature?', flowId: 'feature' },
  { question: 'Vai criar/evoluir um componente de UI?', flowId: 'design-system' },
  { question: 'Precisa refatorar código legado?', flowId: 'tech-debt' },
];

/* ─── Componente: Modal de etapa ─────────────────────────────────────────── */

function StepModal({ step, flow, onClose }: { step: StepDetail; flow: Flow; onClose: () => void }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (item: string) =>
    setChecked(prev => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });

  const progress = step.checklist.length > 0 ? (checked.size / step.checklist.length) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, scale: 0.95, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 40, scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 360, damping: 30 }}
        onClick={e => e.stopPropagation()}
        className={`relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl border ${flow.border} bg-surface/95 backdrop-blur-xl overflow-hidden`}
        style={{ boxShadow: `0 25px 60px rgba(0,0,0,0.5), 0 0 40px ${flow.glow}` }}
      >
        {/* Glow radial */}
        <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-40 rounded-full blur-3xl opacity-30"
            style={{ background: flow.glow }} />
        </div>

        {/* Barra de cor */}
        <div className={`h-[3px] w-full ${flow.bar}`} />

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-black uppercase tracking-widest ${flow.color}`}>{flow.title}</span>
              </div>
              <h3 className="text-lg font-black text-foreground leading-tight">{step.label}</h3>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-foreground hover:bg-surface-hover transition-all shrink-0">
              <X size={14} />
            </button>
          </div>

          {/* Descrição */}
          <p className="text-sm text-gray-400 leading-relaxed mb-5">{step.description}</p>

          {/* Metadados */}
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            <div className={`rounded-xl border ${flow.border} ${flow.bg} p-3`}>
              <div className="flex items-center gap-1.5 mb-1">
                <User size={10} className={flow.color} />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Responsável</span>
              </div>
              <p className={`text-[11px] font-bold ${flow.color} leading-snug`}>{step.responsible}</p>
            </div>
            <div className={`rounded-xl border ${flow.border} ${flow.bg} p-3`}>
              <div className="flex items-center gap-1.5 mb-1">
                <Wrench size={10} className={flow.color} />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Ferramenta</span>
              </div>
              <p className={`text-[11px] font-bold ${flow.color} leading-snug`}>{step.tool}</p>
            </div>
            <div className={`rounded-xl border ${flow.border} ${flow.bg} p-3`}>
              <div className="flex items-center gap-1.5 mb-1">
                <Clock size={10} className={flow.color} />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">SLA</span>
              </div>
              <p className={`text-[11px] font-bold ${flow.color} leading-snug`}>{step.sla}</p>
            </div>
          </div>

          {/* Checklist */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Checklist</p>
              <span className={`text-[10px] font-bold ${flow.color}`}>{checked.size}/{step.checklist.length}</span>
            </div>
            {/* Barra de progresso */}
            <div className="h-1 rounded-full bg-border/30 mb-3 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${flow.bar}`}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <ul className="flex flex-col gap-2">
              {step.checklist.map(item => {
                const done = checked.has(item);
                return (
                  <motion.li key={item} whileTap={{ scale: 0.98 }}>
                    <button
                      onClick={() => toggle(item)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all
                        ${done ? `${flow.border} ${flow.activeBg}` : 'border-border/30 bg-surface/40 hover:border-border/60'}`}
                    >
                      <span className={`shrink-0 transition-colors ${done ? flow.color : 'text-gray-600'}`}>
                        {done ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                      </span>
                      <span className={`text-[12px] font-medium transition-colors ${done ? 'text-foreground line-through opacity-60' : 'text-gray-300'}`}>
                        {item}
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Componente: Card de fluxo ──────────────────────────────────────────── */

function FlowCard({ flow }: { flow: Flow }) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [selectedStep, setSelectedStep] = useState<StepDetail | null>(null);
  const [showAntiPatterns, setShowAntiPatterns] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border ${flow.border} bg-surface/60 backdrop-blur-sm overflow-hidden`}
      style={{ boxShadow: `0 2px 20px ${flow.glow}` }}
    >
      {/* Barra de cor */}
      <div className={`h-[3px] w-full ${flow.bar}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${flow.border} ${flow.bg} ${flow.color}`}>
              {flow.icon}
            </div>
            <div>
              <h2 className="text-[15px] font-black text-foreground leading-tight">{flow.title}</h2>
              <p className="text-[11px] text-gray-500 mt-0.5">{flow.subtitle}</p>
            </div>
          </div>
          <span className={`shrink-0 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${flow.border} ${flow.bg} ${flow.color}`}>
            {flow.steps.length} etapas
          </span>
        </div>

        {/* Stepper */}
        <div className="mt-5 overflow-x-auto pb-1 -mx-1 px-1">
          <div className="flex items-stretch gap-0 min-w-max">
            {flow.steps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <div key={step.id} className="flex items-center">
                  {/* Etapa */}
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onMouseEnter={() => setActiveStep(idx)}
                    onMouseLeave={() => setActiveStep(null)}
                    onClick={() => setSelectedStep(step)}
                    className={`relative group flex flex-col items-center gap-2 px-3 py-3 rounded-xl border transition-all duration-200 cursor-pointer min-w-[100px] max-w-[120px]
                      ${isActive ? `${flow.border} ${flow.activeBg}` : 'border-border/30 bg-surface/40 hover:border-border/60'}`}
                    style={isActive ? { boxShadow: `0 0 16px ${flow.glow}` } : {}}
                  >
                    {/* Número */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border transition-colors
                      ${isActive ? `${flow.bar} text-white border-transparent` : `border-border/50 text-gray-500 group-hover:${flow.color}`}`}>
                      {idx + 1}
                    </div>
                    {/* Label */}
                    <span className={`text-[10px] font-bold text-center leading-tight transition-colors line-clamp-2
                      ${isActive ? 'text-foreground' : 'text-gray-400 group-hover:text-gray-200'}`}>
                      {step.label}
                    </span>
                    {/* Responsável */}
                    <span className={`text-[8px] font-medium text-center leading-tight truncate w-full transition-colors
                      ${isActive ? flow.color : 'text-gray-600'}`}>
                      {step.responsible}
                    </span>
                    {/* SLA badge */}
                    <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-md border transition-colors
                      ${isActive ? `${flow.border} ${flow.bg} ${flow.color}` : 'border-border/30 text-gray-600'}`}>
                      {step.sla}
                    </span>
                    {/* Hint de clique */}
                    <span className={`text-[7px] font-medium transition-all opacity-0 group-hover:opacity-100 ${flow.color}`}>
                      ver detalhes →
                    </span>
                  </motion.button>

                  {/* Conector */}
                  {idx < flow.steps.length - 1 && (
                    <div className="flex items-center px-1 shrink-0">
                      <ArrowRight size={12} className={`transition-colors ${activeStep === idx || activeStep === idx + 1 ? flow.color : 'text-gray-700'}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Anti-padrões */}
        <div className="mt-4">
          <button
            onClick={() => setShowAntiPatterns(v => !v)}
            className="flex items-center gap-2 text-[10px] font-bold text-gray-500 hover:text-amber-400 transition-colors"
          >
            <AlertTriangle size={11} className="text-amber-500" />
            Erros comuns neste fluxo
            <motion.span animate={{ rotate: showAntiPatterns ? 90 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronRight size={10} />
            </motion.span>
          </button>
          <AnimatePresence>
            {showAntiPatterns && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-2 flex flex-col gap-1.5"
              >
                {flow.antiPatterns.map((ap, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-start gap-2 text-[11px] text-gray-400 bg-amber-500/5 border border-amber-500/15 rounded-lg px-3 py-2"
                  >
                    <span className="text-amber-500 shrink-0 mt-0.5">✕</span>
                    {ap}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal de etapa */}
      {typeof window !== 'undefined' && selectedStep && (
        <AnimatePresence>
          <StepModal
            step={selectedStep}
            flow={flow}
            onClose={() => setSelectedStep(null)}
          />
        </AnimatePresence>
      )}
    </motion.div>
  );
}

/* ─── Componente: Seletor de fluxo ───────────────────────────────────────── */

function FlowSelector({ onSelect, onClose }: { onSelect: (id: string) => void; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 16, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 360, damping: 30 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl border border-border/60 bg-surface/95 backdrop-blur-xl overflow-hidden"
        style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}
      >
        <div className="h-[3px] w-full bg-medcof-red" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-black text-foreground">Qual fluxo usar?</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Responda e vá direto ao fluxo certo</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-foreground hover:bg-surface-hover transition-all">
              <X size={14} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {FLOW_SELECTOR.map((item, i) => {
              const flow = FLOWS.find(f => f.id === item.flowId)!;
              return (
                <motion.button
                  key={item.flowId}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ x: 4 }}
                  onClick={() => { onSelect(item.flowId); onClose(); }}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border ${flow.border} ${flow.bg} text-left hover:${flow.activeBg} transition-all group`}
                >
                  <span className={flow.color}>{flow.icon}</span>
                  <span className="flex-1 text-[12px] font-semibold text-gray-300 group-hover:text-foreground transition-colors">
                    {item.question}
                  </span>
                  <span className={`text-[10px] font-black ${flow.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    {flow.title} →
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Página principal ───────────────────────────────────────────────────── */

export default function FluxosPage() {
  const { activeStep: onboardingStep } = useOnboarding();
  const isS6Active = onboardingStep?.id === 's6';

  const [search, setSearch] = useState('');
  const [showSelector, setShowSelector] = useState(false);
  const [highlightedFlow, setHighlightedFlow] = useState<string | null>(null);

  const filtered = useMemo(() =>
    FLOWS.filter(f =>
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.subtitle.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  const scrollToFlow = (id: string) => {
    setHighlightedFlow(id);
    setTimeout(() => {
      document.getElementById(`flow-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    setTimeout(() => setHighlightedFlow(null), 2000);
  };

  return (
    <div className={`transition-all duration-500 ${isS6Active ? 'p-6 rounded-3xl bg-medcof-red/5 ring-4 ring-medcof-red/40' : ''}`}>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-black text-foreground flex items-center gap-2">
              <span className="text-medcof-red">#</span> Fluxos Operacionais
            </h1>
            <p className="text-gray-500 mt-1.5 text-sm max-w-xl">
              Guia prático de execução — clique em qualquer etapa para ver responsável, SLA e checklist.
            </p>
          </div>

          {/* CTA: Qual fluxo usar */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowSelector(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-medcof-red/10 border border-medcof-red/30 text-medcof-red font-bold text-sm hover:bg-medcof-red/20 transition-all"
            style={{ boxShadow: '0 0 16px rgba(220,38,38,0.15)' }}
          >
            <HelpCircle size={14} />
            Não sabe qual fluxo usar?
          </motion.button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-5 flex-wrap">
          {[
            { label: 'Fluxos', value: FLOWS.length, color: 'text-medcof-red' },
            { label: 'Etapas totais', value: FLOWS.reduce((a, f) => a + f.steps.length, 0), color: 'text-sky-400' },
            { label: 'Com checklist', value: FLOWS.reduce((a, f) => a + f.steps.filter(s => s.checklist.length > 0).length, 0), color: 'text-emerald-400' },
          ].map(stat => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className={`text-xl font-black ${stat.color}`}>{stat.value}</span>
              <span className="text-[11px] text-gray-500 font-medium">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Busca */}
        <div className="relative mt-4 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar fluxo..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface border border-border/50 text-sm text-foreground placeholder:text-gray-600 focus:outline-none focus:border-medcof-red/40 focus:shadow-[0_0_12px_rgba(220,38,38,0.12)] transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-foreground">
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {isS6Active && (
        <div className="mb-6 text-medcof-red font-bold animate-pulse flex items-center gap-2">
          <Zap size={14} /> Passo 6: Atente-se aos gargalos de cada um destes fluxos diários.
        </div>
      )}

      {/* Lista de fluxos */}
      <div className="flex flex-col gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((flow, i) => (
            <motion.div
              key={flow.id}
              id={`flow-${flow.id}`}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{
                opacity: 1, y: 0,
                scale: highlightedFlow === flow.id ? 1.005 : 1,
              }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              style={highlightedFlow === flow.id ? { boxShadow: `0 0 30px ${flow.glow}` } : {}}
              className="rounded-2xl"
            >
              <FlowCard flow={flow} />
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-gray-500 text-sm">Nenhum fluxo encontrado para &ldquo;{search}&rdquo;</p>
            <button onClick={() => setSearch('')} className="mt-3 text-xs text-medcof-red hover:underline">Limpar busca</button>
          </div>
        )}
      </div>

      {/* Modal: seletor de fluxo */}
      {typeof window !== 'undefined' && (
        <AnimatePresence>
          {showSelector && (
            <FlowSelector
              onSelect={scrollToFlow}
              onClose={() => setShowSelector(false)}
            />
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
