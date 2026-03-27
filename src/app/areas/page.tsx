'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cloud, BarChart3, Palette, Headphones, Shield,
  Database, Search, X, ChevronDown, CheckCircle2, XCircle,
  Users, Layers,
} from 'lucide-react';

/* ─── Tipos ──────────────────────────────────────────────────────────────── */

interface AreaContributor {
  name: string;
  role: string;
}

interface TechArea {
  id: string;
  name: string;
  tag: string;
  icon: React.ReactNode;
  color: string;
  border: string;
  bg: string;
  activeBg: string;
  glow: string;
  bar: string;
  description: string;
  whenToUse: { label: string; example: string }[];
  whenNotToUse: string[];
  contributors: AreaContributor[];
}

/* ─── Dados ──────────────────────────────────────────────────────────────── */

const AREAS: TechArea[] = [
  {
    id: 'infra',
    name: 'Infraestrutura & Cloud',
    tag: 'AWS · DevOps · Pipelines',
    icon: <Cloud size={18} />,
    color: 'text-orange-400',
    border: 'border-orange-500/30',
    bg: 'bg-orange-500/5',
    activeBg: 'bg-orange-500/10',
    glow: 'rgba(249,115,22,0.15)',
    bar: 'bg-orange-500',
    description: 'Conhecimento em provisionamento de ambientes, pipelines de CI/CD, redes, segurança de cloud e operações de infraestrutura.',
    whenToUse: [
      { label: 'Deploy falhando', example: 'Pipeline quebrou no GitHub Actions ou ECS não sobe' },
      { label: 'Acesso a recursos cloud', example: 'Precisa de acesso a bucket S3, RDS ou segredos no Secrets Manager' },
      { label: 'Configuração de ambiente', example: 'Criar novo ambiente de staging ou configurar variáveis de ambiente' },
      { label: 'Problemas de rede/VPN', example: 'Não consegue conectar ao banco de dados ou serviço interno' },
      { label: 'Escalabilidade', example: 'Serviço sobrecarregado e precisa de auto-scaling ou aumento de recursos' },
    ],
    whenNotToUse: [
      'Bugs de lógica de negócio na aplicação',
      'Problemas de interface ou experiência do usuário',
      'Dúvidas sobre modelagem de dados ou queries SQL',
      'Questões de design ou componentes visuais',
    ],
    contributors: [
      { name: 'Ravel Sbrissa Okada', role: 'Head de Estrutura' },
      { name: 'Thiago Ryuiti Ito', role: 'IT Coordinator' },
      { name: 'Albert Siqueira Cosme Emidio', role: 'IT Ops' },
    ],
  },
  {
    id: 'dados',
    name: 'Dados & Analytics',
    tag: 'BI · ETL · Data Engineering',
    icon: <BarChart3 size={18} />,
    color: 'text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/5',
    activeBg: 'bg-amber-500/10',
    glow: 'rgba(245,158,11,0.15)',
    bar: 'bg-amber-500',
    description: 'Conhecimento em modelagem de dados, pipelines de ingestão, dashboards analíticos, métricas de produto e qualidade de dados.',
    whenToUse: [
      { label: 'Criação de dashboards', example: 'Precisa de painel de métricas de conversão ou engajamento' },
      { label: 'Dúvidas de volumetria', example: 'Quantos usuários ativos? Qual a taxa de churn?' },
      { label: 'Pipeline de dados quebrado', example: 'ETL não está rodando ou dados desatualizados no BI' },
      { label: 'Modelagem de dados', example: 'Definir estrutura de tabelas para nova feature analítica' },
      { label: 'Exploração de dados', example: 'Analisar comportamento de usuários para embasar decisão de produto' },
    ],
    whenNotToUse: [
      'Bugs em APIs ou serviços de produção',
      'Problemas de infraestrutura ou deploy',
      'Questões de design visual ou UX',
      'Desenvolvimento de features de produto',
    ],
    contributors: [
      { name: 'Lucas Frascarelli', role: 'Head de Dados' },
      { name: 'Gabriel Lopes de Paula', role: 'Dados' },
      { name: 'Pablo Leonardo dos Reis', role: 'Dados' },
    ],
  },
  {
    id: 'design-system',
    name: 'Design System & UI',
    tag: 'Componentes · Tokens · Figma',
    icon: <Palette size={18} />,
    color: 'text-violet-400',
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/5',
    activeBg: 'bg-violet-500/10',
    glow: 'rgba(139,92,246,0.15)',
    bar: 'bg-violet-500',
    description: 'Conhecimento em criação e evolução de componentes reutilizáveis, tokens de design, acessibilidade e consistência visual entre produtos.',
    whenToUse: [
      { label: 'Novo componente compartilhado', example: 'Botão, modal ou formulário que será usado em múltiplos produtos' },
      { label: 'Inconsistência visual', example: 'Cores, tipografia ou espaçamentos diferentes entre telas' },
      { label: 'Padrão de interação', example: 'Como deve funcionar um dropdown ou um toast de notificação' },
      { label: 'Acessibilidade', example: 'Componente não passa em leitores de tela ou falta contraste' },
      { label: 'Evolução do Storybook', example: 'Documentar ou atualizar componente existente' },
    ],
    whenNotToUse: [
      'Bugs específicos de um único produto',
      'Lógica de negócio ou regras de domínio',
      'Infraestrutura ou deploy',
      'Análise de dados ou métricas',
    ],
    contributors: [
      { name: 'André', role: 'Design Coordinator' },
      { name: 'Thais Narumi Tanizaki', role: 'Designer' },
      { name: 'Carla Silveira Costantino', role: 'Designer' },
      { name: 'Érika Laís da Silva', role: 'Designer' },
      { name: 'Pedro', role: 'Designer' },
    ],
  },
  {
    id: 'suporte',
    name: 'Suporte & Atendimento',
    tag: 'N1 · N2 · Triagem',
    icon: <Headphones size={18} />,
    color: 'text-sky-400',
    border: 'border-sky-500/30',
    bg: 'bg-sky-500/5',
    activeBg: 'bg-sky-500/10',
    glow: 'rgba(14,165,233,0.15)',
    bar: 'bg-sky-500',
    description: 'Conhecimento em triagem de chamados, atendimento ao usuário, escalonamento de problemas e documentação de soluções recorrentes.',
    whenToUse: [
      { label: 'Usuário reportou problema', example: 'Cliente não consegue acessar ou funcionalidade não está funcionando para ele' },
      { label: 'Triagem de incidente', example: 'Precisa classificar severidade e escalar para o time correto' },
      { label: 'Dúvida operacional recorrente', example: 'Mesma pergunta aparece frequentemente de usuários' },
      { label: 'Documentação de solução', example: 'Registrar resolução de problema para evitar recorrência' },
    ],
    whenNotToUse: [
      'Desenvolvimento de novas funcionalidades',
      'Decisões de arquitetura técnica',
      'Criação de componentes ou design',
      'Análise de dados estratégicos',
    ],
    contributors: [
      { name: 'Bernard Ferreira Ladeia Almeida', role: 'Support Coordinator' },
      { name: 'João Eduardo Gomes', role: 'Suporte' },
      { name: 'Pedro Henrique dos Santos Pinheiro', role: 'Analista' },
      { name: 'Eduardo de Oliveira Bombarda', role: 'Analista' },
      { name: 'Luis Henrique Gonçalves Angelim', role: 'Analista' },
      { name: 'Maria Vitória Jarzinski Oliveira', role: 'Analista' },
    ],
  },
  {
    id: 'qa',
    name: 'Qualidade & Testes',
    tag: 'QA · Automação · Regressão',
    icon: <Shield size={18} />,
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/5',
    activeBg: 'bg-emerald-500/10',
    glow: 'rgba(16,185,129,0.15)',
    bar: 'bg-emerald-500',
    description: 'Conhecimento em estratégias de teste, automação, testes de regressão, análise de qualidade e definição de critérios de aceite.',
    whenToUse: [
      { label: 'Validação de feature', example: 'Feature desenvolvida precisa de validação antes do deploy' },
      { label: 'Regressão antes de release', example: 'Sprint fechando e precisa garantir que nada quebrou' },
      { label: 'Estratégia de testes', example: 'Como testar um fluxo complexo ou crítico' },
      { label: 'Bug reportado em produção', example: 'Reproduzir e validar correção de bug' },
      { label: 'Automação de testes', example: 'Criar ou evoluir suite de testes automatizados' },
    ],
    whenNotToUse: [
      'Desenvolvimento da correção ou feature em si',
      'Decisões de produto ou priorização',
      'Configuração de infraestrutura',
      'Criação de componentes de design',
    ],
    contributors: [
      { name: 'Gabriel Fidel Bononi', role: 'QA Lead' },
      { name: 'Wellington Gustavo Santos', role: 'QA Lead' },
      { name: 'Alex Matsumoto Kaneshigue Junior', role: 'QA' },
      { name: 'Yasmin Danielli Sampaio', role: 'QA' },
      { name: 'Denise Faggionato Bernardo', role: 'QA' },
      { name: 'Douglas Scola Lopes', role: 'QA' },
      { name: 'Mário Gomes Ramos Loureiro', role: 'QA' },
    ],
  },
  {
    id: 'produto',
    name: 'Produto & Estratégia',
    tag: 'PM · PO · Roadmap',
    icon: <Layers size={18} />,
    color: 'text-pink-400',
    border: 'border-pink-500/30',
    bg: 'bg-pink-500/5',
    activeBg: 'bg-pink-500/10',
    glow: 'rgba(236,72,153,0.15)',
    bar: 'bg-pink-500',
    description: 'Conhecimento em gestão de produto, priorização de backlog, definição de critérios de aceite, métricas de produto e alinhamento estratégico.',
    whenToUse: [
      { label: 'Dúvida sobre prioridade', example: 'O que deve ser desenvolvido primeiro nesta sprint?' },
      { label: 'Critérios de aceite', example: 'Como deve se comportar esta feature para ser considerada pronta?' },
      { label: 'Alinhamento de escopo', example: 'O que está dentro e fora do escopo desta entrega?' },
      { label: 'Decisão de produto', example: 'Qual caminho tomar quando há trade-offs de produto vs técnico?' },
      { label: 'Métricas de sucesso', example: 'Como medir se esta feature está funcionando bem?' },
    ],
    whenNotToUse: [
      'Decisões puramente técnicas de implementação',
      'Bugs de produção que precisam de correção imediata',
      'Questões de infraestrutura ou deploy',
      'Criação de componentes visuais',
    ],
    contributors: [
      { name: 'Anderson Moraes dos Santos', role: 'PM Experimentação' },
      { name: 'Bruno Faria Pacheco de Mello', role: 'PM Marketing' },
      { name: 'Rafael Bombarda Oda', role: 'PM Analytics' },
    ],
  },
  {
    id: 'processos',
    name: 'Processos & Agilidade',
    tag: 'Scrum · Rituais · Melhoria Contínua',
    icon: <Database size={18} />,
    color: 'text-teal-400',
    border: 'border-teal-500/30',
    bg: 'bg-teal-500/5',
    activeBg: 'bg-teal-500/10',
    glow: 'rgba(20,184,166,0.15)',
    bar: 'bg-teal-500',
    description: 'Conhecimento em metodologias ágeis, facilitação de rituais, melhoria de processos de desenvolvimento e gestão de fluxo de trabalho.',
    whenToUse: [
      { label: 'Dúvida sobre rituais', example: 'Como deve ser conduzida a retrospectiva ou o refinamento?' },
      { label: 'Processo travado', example: 'PRs acumulando, tickets sem movimento ou sprint desorganizada' },
      { label: 'Melhoria de fluxo', example: 'Time quer melhorar a forma como trabalha' },
      { label: 'Métricas de processo', example: 'Lead time, cycle time ou velocity do time' },
      { label: 'Onboarding de processo', example: 'Novo membro precisa entender como o time trabalha' },
    ],
    whenNotToUse: [
      'Decisões técnicas de arquitetura',
      'Bugs ou problemas de produção',
      'Criação de features ou componentes',
      'Análise de dados de produto',
    ],
    contributors: [
      { name: 'Willian da Silva Bresciani', role: 'Process Manager' },
      { name: 'Jonata Souza e Lima', role: 'Scrum Master' },
      { name: 'Gabi', role: 'Scrum Master' },
      { name: 'Leo', role: 'Scrum Master' },
    ],
  },
];

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function initials(name: string) {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_COLORS = [
  'from-red-500 to-rose-600',
  'from-orange-500 to-amber-600',
  'from-emerald-500 to-teal-600',
  'from-sky-500 to-blue-600',
  'from-violet-500 to-purple-600',
  'from-pink-500 to-rose-600',
  'from-teal-500 to-cyan-600',
  'from-amber-500 to-yellow-600',
];

function avatarColor(name: string) {
  const sum = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

/* ─── Componente: Card de área ───────────────────────────────────────────── */

function AreaCard({ area, index }: { area: TechArea; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<'when' | 'not' | 'who'>('when');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className={`rounded-2xl border ${area.border} bg-surface/60 backdrop-blur-sm overflow-hidden transition-all duration-200`}
      style={{ boxShadow: `0 2px 16px ${area.glow}` }}
    >
      {/* Barra de cor */}
      <div className={`h-[3px] w-full ${area.bar}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${area.border} ${area.bg} ${area.color} shrink-0`}>
            {area.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-black text-foreground leading-tight">{area.name}</h3>
            <span className={`inline-block mt-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${area.border} ${area.bg} ${area.color}`}>
              {area.tag}
            </span>
          </div>
        </div>

        {/* Descrição */}
        <p className="text-[12px] text-gray-400 leading-relaxed mb-4">{area.description}</p>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-surface/50 border border-border/30 mb-4">
          {([
            { id: 'when', label: 'Quando acionar' },
            { id: 'not',  label: 'Quando não' },
            { id: 'who',  label: `Quem ajuda (${area.contributors.length})` },
          ] as const).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 text-[9px] font-black uppercase tracking-wider py-1.5 rounded-lg transition-all duration-150
                ${tab === t.id
                  ? `${area.bar} text-white`
                  : 'text-gray-500 hover:text-gray-300'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Conteúdo das tabs */}
        <AnimatePresence mode="wait">
          {tab === 'when' && (
            <motion.ul
              key="when"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-2"
            >
              {area.whenToUse.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`rounded-xl border ${area.border} ${area.bg} p-3`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 size={11} className={area.color} />
                    <span className={`text-[11px] font-bold ${area.color}`}>{item.label}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-relaxed pl-[19px]">{item.example}</p>
                </motion.li>
              ))}
            </motion.ul>
          )}

          {tab === 'not' && (
            <motion.ul
              key="not"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-2"
            >
              {area.whenNotToUse.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-2.5 rounded-xl border border-red-500/15 bg-red-500/5 p-3"
                >
                  <XCircle size={11} className="text-red-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] text-gray-400 leading-relaxed">{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          )}

          {tab === 'who' && (
            <motion.div
              key="who"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <p className="text-[10px] text-gray-600 mb-3 leading-relaxed">
                Pessoas com conhecimento neste domínio. Qualquer dev pode contribuir — estas são referências.
              </p>
              <div className="grid grid-cols-1 gap-2">
                {area.contributors.map((person, i) => (
                  <motion.div
                    key={person.name}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border ${area.border} bg-surface/40`}
                  >
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${avatarColor(person.name)} flex items-center justify-center text-[9px] font-black text-white shrink-0`}>
                      {initials(person.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-foreground leading-tight truncate">{person.name}</p>
                      <p className={`text-[9px] font-medium ${area.color} leading-none mt-0.5`}>{person.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Página principal ───────────────────────────────────────────────────── */

export default function AreasPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    AREAS.filter(a =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.tag.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground flex items-center gap-2 mb-2">
          <span className="text-medcof-red">#</span> Áreas Técnicas
        </h1>

        {/* Frase de contexto */}
        <div className="flex items-start gap-3 p-4 rounded-2xl border border-medcof-red/20 bg-medcof-red/5 mb-5 max-w-2xl">
          <Users size={16} className="text-medcof-red shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground leading-snug">
              As áreas representam domínios de conhecimento.
            </p>
            <p className="text-[12px] text-gray-400 mt-0.5">
              Não são times fixos — qualquer dev pode contribuir. As pessoas listadas são referências naquele domínio.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-5 mb-5 flex-wrap">
          {[
            { label: 'Domínios', value: AREAS.length, color: 'text-medcof-red' },
            { label: 'Referências', value: AREAS.reduce((a, ar) => a + ar.contributors.length, 0), color: 'text-sky-400' },
            { label: 'Casos de uso', value: AREAS.reduce((a, ar) => a + ar.whenToUse.length, 0), color: 'text-emerald-400' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <span className={`text-xl font-black ${s.color}`}>{s.value}</span>
              <span className="text-[11px] text-gray-500 font-medium">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Busca */}
        <div className="relative max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar domínio ou especialidade..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface border border-border/50 text-sm text-foreground placeholder:text-gray-600 focus:outline-none focus:border-medcof-red/40 focus:shadow-[0_0_12px_rgba(220,38,38,0.12)] transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-foreground">
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Grid de áreas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((area, i) => (
            <AreaCard key={area.id} area={area} index={i} />
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="col-span-3 py-16 text-center">
            <p className="text-gray-500 text-sm">Nenhum domínio encontrado para &ldquo;{search}&rdquo;</p>
            <button onClick={() => setSearch('')} className="mt-3 text-xs text-medcof-red hover:underline">
              Limpar busca
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
