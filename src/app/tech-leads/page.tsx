'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2, Search, X, ChevronRight, Package,
  Users, Layers, Filter, ExternalLink, Fingerprint,
} from 'lucide-react';

/* ─── Dados ─────────────────────────────────────────────────────────────── */

type Dominio = 'Plataforma Core' | 'Plataforma' | 'Onboarding' | 'Comunidade' | 'IA & Bots' | 'Qualidade' | 'Educação';

interface TechLead {
  id: string;
  nome: string;
  time: string;
  dominio: Dominio;
  produtos: string[];
  /** Cor do avatar (gradiente Tailwind) */
  cor: string;
  descricao: string;
  jira?: string;
}

const LEADS: TechLead[] = [
  {
    id: 'igor',
    nome: 'Igor Tieso',
    time: 'Cofmunidade',
    dominio: 'Comunidade',
    produtos: ['Mentoria Singular', 'Comunidade', 'B2B'],
    cor: 'from-violet-500 to-purple-700',
    descricao: 'Responsável pela plataforma de comunidade e conexões entre alunos e mentores. Lidera o desenvolvimento dos produtos que fortalecem o ecossistema MedCof.',
  },
  {
    id: 'luca',
    nome: 'Luca Watson',
    time: 'Onboarding',
    dominio: 'Onboarding',
    produtos: ['Onboarding'],
    cor: 'from-sky-500 to-blue-700',
    descricao: 'Cuida da jornada de entrada do aluno na plataforma. Garante que a primeira experiência seja fluida, clara e motivadora.',
  },
  {
    id: 'gabriel',
    nome: 'Gabriel Henrique',
    time: 'COT',
    dominio: 'Plataforma Core',
    produtos: ['Prometheus', 'Hermes', 'CofTimer', 'DailyCof'],
    cor: 'from-emerald-500 to-teal-700',
    descricao: 'Lidera o time de plataforma core. Responsável pelos serviços de infraestrutura de produto, notificações, timers e rotinas diárias dos alunos.',
  },
  {
    id: 'pinho',
    nome: 'Matheus Pinho',
    time: 'Intranetando',
    dominio: 'Plataforma',
    produtos: ['Intranet'],
    cor: 'from-orange-500 to-amber-700',
    descricao: 'Responsável pela intranet interna da MedCof. Garante que ferramentas e processos internos estejam sempre disponíveis e evoluindo.',
  },
  {
    id: 'vinicius',
    nome: 'Vinicius de Assis',
    time: 'MedCode',
    dominio: 'Plataforma Core',
    produtos: ['QBank'],
    cor: 'from-rose-500 to-pink-700',
    descricao: 'Lidera o desenvolvimento do banco de questões médicas. Produto crítico para a jornada de estudo e preparação dos alunos.',
  },
  {
    id: 'juan',
    nome: 'Juan Amaral',
    time: 'Internato',
    dominio: 'Educação',
    produtos: ['Internato'],
    cor: 'from-cyan-500 to-sky-700',
    descricao: 'Responsável pelo produto de internato, que apoia alunos na fase final da graduação médica com conteúdo e ferramentas específicas.',
  },
  {
    id: 'thiago',
    nome: 'Thiago Gomes',
    time: 'TIP (Test in Prod)',
    dominio: 'Plataforma Core',
    produtos: ['Apollo (Aulas)'],
    cor: 'from-amber-500 to-orange-700',
    descricao: 'Lidera o desenvolvimento da plataforma de aulas. Responsável pela experiência de consumo de conteúdo educacional dos alunos MedCof.',
  },
  {
    id: 'leo',
    nome: 'Leonardo Reis',
    time: 'CofBot',
    dominio: 'IA & Bots',
    produtos: ['CofBot', 'CofBot Extraordinário'],
    cor: 'from-fuchsia-500 to-violet-700',
    descricao: 'Responsável pelos produtos de IA da MedCof. Lidera o desenvolvimento do CofBot e suas variantes, integrando LLMs e automações inteligentes.',
  },
];

const DOMINIOS: Dominio[] = ['Plataforma Core', 'Plataforma', 'Onboarding', 'Comunidade', 'IA & Bots', 'Qualidade', 'Educação'];

const DOMINIO_STYLE: Record<Dominio, { bg: string; text: string; border: string; dot: string }> = {
  'Plataforma Core': { bg: 'bg-teal-500/10',    text: 'text-teal-400',    border: 'border-teal-500/25',    dot: 'bg-teal-500'    },
  'Plataforma':      { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/25', dot: 'bg-emerald-500' },
  'Onboarding':      { bg: 'bg-sky-500/10',     text: 'text-sky-400',     border: 'border-sky-500/25',     dot: 'bg-sky-500'     },
  'Comunidade':      { bg: 'bg-violet-500/10',  text: 'text-violet-400',  border: 'border-violet-500/25',  dot: 'bg-violet-500'  },
  'IA & Bots':       { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-400', border: 'border-fuchsia-500/25', dot: 'bg-fuchsia-500' },
  'Qualidade':       { bg: 'bg-amber-500/10',   text: 'text-amber-400',   border: 'border-amber-500/25',   dot: 'bg-amber-500'   },
  'Educação':        { bg: 'bg-rose-500/10',    text: 'text-rose-400',    border: 'border-rose-500/25',    dot: 'bg-rose-500'    },
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function initials(nome: string) {
  const parts = nome.trim().split(' ');
  return parts.length === 1
    ? parts[0][0].toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/* ─── Modal de detalhes ──────────────────────────────────────────────────── */

function LeadModal({ lead, onClose }: { lead: TechLead; onClose: () => void }) {
  const ds = DOMINIO_STYLE[lead.dominio];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.93, y: 20 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl"
      >
        {/* Barra de cor */}
        <div className={`h-1 w-full bg-gradient-to-r ${lead.cor}`} />

        <div className="p-6">
          {/* Header */}
          <div className="mb-5 flex items-start justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${lead.cor} text-xl font-black text-white shadow-lg`}>
                {initials(lead.nome)}
              </div>
              <div>
                <h2 className="text-xl font-black text-foreground">{lead.nome}</h2>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                    <Users size={11} /> {lead.time}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${ds.bg} ${ds.text} ${ds.border}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${ds.dot}`} /> {lead.dominio}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-gray-400 transition hover:bg-surface-hover hover:text-foreground"
            >
              <X size={15} />
            </button>
          </div>

          {/* Descrição */}
          <p className="mb-5 text-sm leading-relaxed text-gray-500">{lead.descricao}</p>

          {/* Produtos */}
          <div className="mb-5">
            <p className="mb-2.5 text-[10px] font-black uppercase tracking-widest text-gray-500">
              Produtos sob responsabilidade
            </p>
            <div className="flex flex-wrap gap-2">
              {lead.produtos.map(p => (
                <span
                  key={p}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold ${ds.bg} ${ds.text} ${ds.border}`}
                >
                  <Package size={11} /> {p}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-2 border-t border-border pt-4">
            <a
              href={lead.jira ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-hover px-3 py-2 text-xs font-bold text-gray-500 transition hover:text-foreground"
            >
              <ExternalLink size={12} /> Jira do time
            </a>
            <a
              href="/organograma"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-hover px-3 py-2 text-xs font-bold text-gray-500 transition hover:text-foreground"
            >
              <Layers size={12} /> Ver no organograma
            </a>
            <a
              href="/times"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-hover px-3 py-2 text-xs font-bold text-gray-500 transition hover:text-foreground"
            >
              <Users size={12} /> Ver time
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Card ───────────────────────────────────────────────────────────────── */

function LeadCard({ lead, onOpen, searchQuery }: { lead: TechLead; onOpen: () => void; searchQuery: string }) {
  const ds = DOMINIO_STYLE[lead.dominio];

  const highlight = (text: string) => {
    if (!searchQuery.trim()) return <>{text}</>;
    const idx = text.toLowerCase().indexOf(searchQuery.toLowerCase());
    if (idx === -1) return <>{text}</>;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-amber-400/30 text-inherit rounded px-0.5">{text.slice(idx, idx + searchQuery.length)}</mark>
        {text.slice(idx + searchQuery.length)}
      </>
    );
  };

  return (
    <motion.button
      layout
      onClick={onOpen}
      whileHover={{ y: -4, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      className="group relative w-full overflow-hidden rounded-2xl border border-border bg-surface text-left shadow-sm transition-all duration-200 hover:border-border hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-medcof-red"
    >
      {/* Barra de cor no topo */}
      <div className={`h-0.5 w-full bg-gradient-to-r ${lead.cor} opacity-60 transition-opacity duration-200 group-hover:opacity-100`} />

      <div className="p-5">
        {/* Avatar + nome */}
        <div className="mb-4 flex items-center gap-3">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${lead.cor} text-sm font-black text-white shadow-md`}>
            {initials(lead.nome)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-black text-base text-foreground leading-snug">
              {highlight(lead.nome)}
            </p>
            <p className="flex items-center gap-1 text-xs font-semibold text-gray-500 mt-0.5">
              <Users size={10} /> {highlight(lead.time)}
            </p>
          </div>
          <span className={`ml-auto shrink-0 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${ds.bg} ${ds.text} ${ds.border}`}>
            <span className={`h-1 w-1 rounded-full ${ds.dot}`} /> {lead.dominio}
          </span>
        </div>

        {/* Produtos */}
        <div className="mb-4">
          <p className="mb-2 text-[9px] font-black uppercase tracking-widest text-gray-400">Produtos</p>
          <div className="flex flex-wrap gap-1.5">
            {lead.produtos.map(p => (
              <span
                key={p}
                className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold ${ds.bg} ${ds.text} ${ds.border}`}
              >
                <Package size={9} /> {highlight(p)}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between border-t border-border pt-3">
          <p className="text-[11px] font-medium text-gray-500 line-clamp-1">{lead.descricao.slice(0, 60)}…</p>
          <ChevronRight size={14} className="shrink-0 text-gray-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground ml-2" />
        </div>
      </div>
    </motion.button>
  );
}

/* ─── Página ─────────────────────────────────────────────────────────────── */

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const cardAnim = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 280, damping: 22 } },
};

export default function TechLeadsPage() {
  const [search, setSearch] = useState('');
  const [dominioFilter, setDominioFilter] = useState<Dominio | null>(null);
  const [selectedLead, setSelectedLead] = useState<TechLead | null>(null);
  const [productSearch, setProductSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const pq = productSearch.toLowerCase().trim();
    return LEADS.filter(l => {
      const matchDominio = !dominioFilter || l.dominio === dominioFilter;
      const matchSearch = !q || l.nome.toLowerCase().includes(q) || l.time.toLowerCase().includes(q) || l.produtos.some(p => p.toLowerCase().includes(q));
      const matchProduct = !pq || l.produtos.some(p => p.toLowerCase().includes(pq));
      return matchDominio && matchSearch && matchProduct;
    });
  }, [search, dominioFilter, productSearch]);

  /** Todos os produtos únicos para o modo "Quem é responsável?" */
  const allProducts = useMemo(() => Array.from(new Set(LEADS.flatMap(l => l.produtos))).sort(), []);

  const responsavelPorProduto = useMemo(() => {
    if (!productSearch.trim()) return null;
    return LEADS.find(l => l.produtos.some(p => p.toLowerCase().includes(productSearch.toLowerCase()))) ?? null;
  }, [productSearch]);

  return (
    <div className="flex flex-col gap-8 pb-24">

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-white via-gray-50 to-gray-100 p-8 shadow-sm dark:border-white/10 dark:from-[#0c0e12] dark:via-[#12151c] dark:to-[#1a1f2a] sm:p-10"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-medcof-red/8 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-violet-500/8 blur-[70px]" />

        <div className="relative z-10">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-medcof-red/25 bg-medcof-red/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-medcof-red">
            <Fingerprint size={11} /> Tech Leads & Domínios
          </span>
          <h1 className="mb-3 text-4xl font-black tracking-tighter text-gray-900 dark:text-white sm:text-5xl">
            Mapa de <span className="bg-gradient-to-r from-medcof-red to-orange-400 bg-clip-text text-transparent">Responsabilidade</span>
          </h1>
          <p className="mb-8 max-w-xl text-base font-medium leading-relaxed text-gray-600 dark:text-gray-300">
            Encontre rapidamente quem lidera cada time, quais produtos estão sob responsabilidade e como a engenharia está organizada por domínio.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-4">
            {[
              { value: LEADS.length,                                  label: 'Tech Leads' },
              { value: [...new Set(LEADS.map(l => l.dominio))].length, label: 'Domínios' },
              { value: LEADS.flatMap(l => l.produtos).length,         label: 'Produtos' },
            ].map(({ value, label }, i) => (
              <div key={label} className="flex items-center gap-2">
                {i > 0 && <span className="h-4 w-px bg-gray-300 dark:bg-white/15" />}
                <span className="text-xl font-black text-gray-900 dark:text-white">{value}</span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Modo "Quem é responsável?" ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-border bg-surface p-5"
      >
        <p className="mb-3 flex items-center gap-2 text-sm font-black text-foreground">
          <Package size={15} className="text-medcof-red" /> Quem é responsável por este produto?
        </p>
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Digite o nome do produto…"
            value={productSearch}
            onChange={e => setProductSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-9 text-sm placeholder:text-gray-500 focus:border-medcof-red/50 focus:outline-none focus:ring-2 focus:ring-medcof-red/20 transition-all"
          />
          {productSearch && (
            <button onClick={() => setProductSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-foreground transition-colors">
              <X size={13} />
            </button>
          )}
        </div>

        <AnimatePresence>
          {productSearch.trim() && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden"
            >
              {responsavelPorProduto ? (
                <button
                  onClick={() => setSelectedLead(responsavelPorProduto)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition hover:opacity-90 ${DOMINIO_STYLE[responsavelPorProduto.dominio].bg} ${DOMINIO_STYLE[responsavelPorProduto.dominio].border}`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${responsavelPorProduto.cor} text-sm font-black text-white`}>
                    {initials(responsavelPorProduto.nome)}
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${DOMINIO_STYLE[responsavelPorProduto.dominio].text}`}>{responsavelPorProduto.nome}</p>
                    <p className="text-xs text-gray-500">{responsavelPorProduto.time} · {responsavelPorProduto.dominio}</p>
                  </div>
                  <ChevronRight size={14} className="ml-auto text-gray-400" />
                </button>
              ) : (
                <p className="text-sm text-gray-500">Nenhum responsável encontrado para &ldquo;{productSearch}&rdquo;.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Filtros ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Busca geral */}
        <div className="relative group">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-medcof-red" />
          <input
            type="text"
            placeholder="Buscar por nome, time ou produto…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-9 text-sm placeholder:text-gray-500 focus:border-medcof-red/50 focus:outline-none focus:ring-2 focus:ring-medcof-red/20 transition-all sm:w-72"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-foreground transition-colors">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filtro por domínio */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setDominioFilter(null)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all
              ${!dominioFilter ? 'border-medcof-red/40 bg-medcof-red/10 text-medcof-red' : 'border-border text-gray-500 hover:text-foreground'}`}
          >
            <Filter size={11} /> Todos
          </button>
          {DOMINIOS.filter(d => LEADS.some(l => l.dominio === d)).map(d => {
            const ds = DOMINIO_STYLE[d];
            return (
              <button
                key={d}
                onClick={() => setDominioFilter(dominioFilter === d ? null : d)}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all
                  ${dominioFilter === d ? `${ds.bg} ${ds.text} ${ds.border}` : 'border-border text-gray-500 hover:text-foreground'}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${ds.dot}`} /> {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Grid de cards ────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {filtered.length > 0 ? (
          <motion.div
            key="grid"
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filtered.map(lead => (
              <motion.div key={lead.id} variants={cardAnim}>
                <LeadCard lead={lead} onOpen={() => setSelectedLead(lead)} searchQuery={search} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3 py-20 text-center"
          >
            <Code2 size={40} className="text-gray-300" />
            <p className="font-bold text-gray-400">Nenhum Tech Lead encontrado</p>
            <p className="text-sm text-gray-500">Tente ajustar os filtros ou a busca.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Visão por domínio ────────────────────────────────────────────── */}
      {!dominioFilter && !search && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-4 flex items-center gap-2">
            <Layers size={14} className="text-gray-400" />
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-500">Visão por domínio</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DOMINIOS.filter(d => LEADS.some(l => l.dominio === d)).map(d => {
              const ds = DOMINIO_STYLE[d];
              const leadsNoDominio = LEADS.filter(l => l.dominio === d);
              const produtosNoDominio = [...new Set(leadsNoDominio.flatMap(l => l.produtos))];
              return (
                <button
                  key={d}
                  onClick={() => setDominioFilter(d)}
                  className={`group rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${ds.bg} ${ds.border}`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-wider ${ds.text}`}>
                      <span className={`h-2 w-2 rounded-full ${ds.dot}`} /> {d}
                    </span>
                    <span className={`text-[10px] font-bold ${ds.text}`}>{leadsNoDominio.length} lead{leadsNoDominio.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {leadsNoDominio.map(l => (
                      <span key={l.id} className="flex items-center gap-1 rounded-lg bg-white/50 px-2 py-0.5 text-[11px] font-semibold text-gray-700 dark:bg-white/8 dark:text-gray-300">
                        {initials(l.nome)} {l.nome.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {produtosNoDominio.length} produto{produtosNoDominio.length > 1 ? 's' : ''}: {produtosNoDominio.slice(0, 3).join(', ')}{produtosNoDominio.length > 3 ? '…' : ''}
                  </p>
                </button>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* ── Modal ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedLead && (
          <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
