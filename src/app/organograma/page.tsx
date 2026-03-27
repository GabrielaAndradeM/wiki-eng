'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Network, Fingerprint, Microscope, Zap, Filter, Search, X,
  Users, Code2, Layers, Database, Server, Palette, Package,
  ChevronRight, Target, Sparkles,
} from 'lucide-react';
import OrgChart from '@/components/OrgChart';
import { OrgNode } from '@/types/organograma';

/* ─── Dados ──────────────────────────────────────────────────────────────── */

const ORG_DATA: OrgNode = {
  id: 'ceo',
  label: 'Augusto Coelho',
  role: 'CEO',
  type: 'root',
  children: [
    {
      id: 'cto',
      label: 'Matheus Jimenez Falzetta',
      role: 'CTO',
      type: 'executive',
      children: [
        {
          id: 'vp-eng',
          label: 'Vinicius Cézar de Oliveira',
          role: 'Vice-Presidente de Engenharia',
          type: 'vp',
          children: [
            /* Marciano e JAT são co-coordenadores — todos os times ficam sob os dois */
            {
              id: 'coord-marciano',
              label: 'Victor Thadeu Santos Marciano',
              role: 'Tech Coordinator',
              type: 'coordinator',
              area: 'engenharia',
              description: 'Co-coordenador junto ao JAT de todos os times de engenharia, QA e Processos.',
              children: [
                {
                  id: 'coord-jat',
                  label: 'JAT',
                  role: 'Tech Coordinator',
                  type: 'coordinator',
                  area: 'engenharia',
                  description: 'Co-coordenador junto ao Marciano de todos os times de engenharia, QA e Processos.',
                },
                /* Tech Leads */
                {
                  id: 'squad-cofbot', domain: 'COFBOT', label: 'Ayk', role: 'Tech Lead', type: 'lead', area: 'engenharia',
                  products: ['CofBot', 'CofBot Extraordinário'],
                  children: [
                    { id: 'cofbot-d1', label: 'Jean Bernardo Silva', role: 'Desenvolvedor', type: 'team', area: 'engenharia' },
                    { id: 'cofbot-d2', label: 'Victor da Silva Martins', role: 'Desenvolvedor', type: 'team', area: 'engenharia' },
                  ],
                },
                {
                  id: 'squad-internato', domain: 'INTERNATO', label: 'Juan Matheus Moreira Amaral', role: 'Tech Lead', type: 'lead', area: 'engenharia',
                  products: ['Internato'],
                  children: [
                    { id: 'int-d1', label: 'Bruno Coimbra de Oliveira', role: 'Desenvolvedor', type: 'team', area: 'engenharia' },
                    { id: 'int-d2', label: 'Giordano Mendes Bueno', role: 'Desenvolvedor', type: 'team', area: 'engenharia' },
                  ],
                },
                {
                  id: 'squad-cofmunidade', domain: 'COFMUNIDADE', label: 'Igor Henrique de Souza Tieso', role: 'Tech Lead', type: 'lead', area: 'engenharia',
                  products: ['Mentoria Singular', 'Comunidade', 'B2B'],
                  children: [
                    { id: 'cofm-d1', label: 'Yasmin Coelho Ramos', role: 'Desenvolvedor', type: 'team', area: 'engenharia' },
                    { id: 'cofm-d2', label: 'João Vitor Fernandes de Souza', role: 'Desenvolvedor', type: 'team', area: 'engenharia' },
                  ],
                },
                {
                  id: 'squad-medcode', domain: 'MEDCODE', label: 'Vinícius de Assis Azevedo', role: 'Tech Lead', type: 'lead', area: 'engenharia',
                  products: ['QBank'],
                  children: [
                    { id: 'mec-d1', label: 'Daniel Brandão Bezerra', role: 'Desenvolvedor', type: 'team', area: 'engenharia' },
                    { id: 'mec-d2', label: 'Yuri Muniz Gonzalez', role: 'Desenvolvedor', type: 'team', area: 'engenharia' },
                    { id: 'mec-d3', label: 'Felipi Estevão Matos da Trindade', role: 'Desenvolvedor', type: 'team', area: 'engenharia' },
                  ],
                },
                {
                  id: 'squad-tip', domain: 'TIP (APOLLO)', label: 'Thiago Gomes de Oliveira Silva', role: 'Tech Lead', type: 'lead', area: 'engenharia',
                  products: ['Apollo (Aulas)'],
                  children: [
                    { id: 'tip-d1', label: 'André Macedo Rodrigues', role: 'Desenvolvedor', type: 'team', area: 'engenharia' },
                    { id: 'tip-d2', label: 'Vinicius Henrique Abdon Alves', role: 'Desenvolvedor', type: 'team', area: 'engenharia' },
                    { id: 'tip-d3', label: 'Guilherme Pereira Lopes', role: 'Desenvolvedor', type: 'team', area: 'engenharia' },
                    { id: 'tip-d4', label: 'Yago Luiz Militão', role: 'Desenvolvedor', type: 'team', area: 'engenharia' },
                  ],
                },
                {
                  id: 'squad-onboarding', domain: 'ONBOARDING', label: 'Luca Gonzalez Watson', role: 'Tech Lead', type: 'lead', area: 'engenharia',
                  products: ['Onboarding'],
                  children: [
                    { id: 'onb-d1', label: 'Luiz Sena', role: 'Desenvolvedor', type: 'team', area: 'engenharia' },
                    { id: 'onb-d2', label: 'Rafael Trevisan', role: 'Desenvolvedor', type: 'team', area: 'engenharia' },
                  ],
                },
                {
                  id: 'squad-cot', domain: 'COT (PLATAFORMA)', label: 'Gabriel Henrique da Silva', role: 'Tech Lead', type: 'lead', area: 'engenharia',
                  products: ['Prometheus', 'Hermes', 'CofTimer', 'DailyCof'],
                  children: [
                    { id: 'cot-d1', label: 'Felipe Galdino Porcelli', role: 'Desenvolvedor', type: 'team', area: 'engenharia' },
                    { id: 'cot-d2', label: 'Nathan Henrique Dias Ferraz', role: 'Desenvolvedor', type: 'team', area: 'engenharia' },
                    { id: 'cot-d3', label: 'Vinicius Magalhães Gaspar', role: 'Desenvolvedor', type: 'team', area: 'engenharia' },
                    { id: 'cot-d4', label: 'Vitor Ferraz Maciel', role: 'Desenvolvedor', type: 'team', area: 'engenharia' },
                    { id: 'cot-d5', label: 'Leonardo Queiroz de Oliveira', role: 'Desenvolvedor', type: 'team', area: 'engenharia' },
                    { id: 'cot-d6', label: 'Pedro Henrique Miotto Ramos', role: 'Desenvolvedor', type: 'team', area: 'engenharia' },
                  ],
                },
                {
                  id: 'squad-intranetando', domain: 'INTRANETANDO', label: 'Matheus Fernandes Pinho', role: 'Tech Lead', type: 'lead', area: 'engenharia',
                  products: ['Intranet'],
                  children: [
                    { id: 'intra-d1', label: 'Elvis Henrique Tavernari da Silva', role: 'Desenvolvedor', type: 'team', area: 'engenharia' },
                    { id: 'intra-d2', label: 'Neto', role: 'Desenvolvedor', type: 'team', area: 'engenharia' },
                    { id: 'intra-d3', label: 'Cesar Henrique Vito Bueno', role: 'Desenvolvedor', type: 'team', area: 'engenharia' },
                  ],
                },
                /* QA Leads */
                {
                  id: 'qa-l1', label: 'Gabriel Fidel Bononi', role: 'QA Lead', type: 'lead', area: 'qa',
                  children: [
                    { id: 'qa1', label: 'Alex Matsumoto Kaneshigue Junior', role: 'QA', type: 'team', area: 'qa' },
                    { id: 'qa2', label: 'Yasmin Danielli Sampaio', role: 'QA', type: 'team', area: 'qa' },
                    { id: 'qa3', label: 'Denise Faggionato Bernardo', role: 'QA', type: 'team', area: 'qa' },
                    { id: 'qa4', label: 'Douglas Scola Lopes', role: 'QA', type: 'team', area: 'qa' },
                    { id: 'qa5', label: 'Mário Gomes Ramos Loureiro', role: 'QA', type: 'team', area: 'qa' },
                  ],
                },
                { id: 'qa-l2', label: 'Wellington Gustavo Santos', role: 'QA Lead', type: 'lead', area: 'qa' },
                /* Processos */
                {
                  id: 'processos-area',
                  label: 'Willian da Silva Bresciani',
                  role: 'Process Manager',
                  type: 'coordinator',
                  area: 'processos',
                  children: [
                    { id: 'proc-sm1', label: 'Jonata Souza e Lima', role: 'Scrum Master', type: 'team', area: 'processos' },
                    { id: 'proc-sm2', label: 'Gabi', role: 'Scrum Master', type: 'team', area: 'processos' },
                    { id: 'proc-sm3', label: 'Leo', role: 'Scrum Master', type: 'team', area: 'processos' },
                  ],
                },
              ],
            },
            {
              id: 'suporte-area',
              label: 'Bernard Ferreira Ladeia Almeida',
              role: 'Support Coordinator',
              type: 'coordinator',
              area: 'suporte',
              children: [
                { id: 'sup-d1', label: 'João Eduardo Gomes', role: 'Desenvolvedor', type: 'team', area: 'suporte' },
                { id: 'sup-d2', label: 'Pedro Henrique dos Santos Pinheiro', role: 'Analista', type: 'team', area: 'suporte' },
                { id: 'sup-d3', label: 'Eduardo de Oliveira Bombarda', role: 'Analista', type: 'team', area: 'suporte' },
                { id: 'sup-d4', label: 'Luis Henrique Gonçalves Angelim', role: 'Analista', type: 'team', area: 'suporte' },
                { id: 'sup-d5', label: 'Maria Vitória Jarzinski Oliveira', role: 'Analista', type: 'team', area: 'suporte' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'cpo',
      label: 'Leonardo Torres Branco',
      role: 'CPO',
      type: 'executive',
      children: [
        {
          id: 'produto-area',
          label: 'Produto',
          role: 'Product Management',
          type: 'coordinator',
          isArea: true,
          area: 'produto',
          children: [
            { id: 'pm1', label: 'Anderson Moraes dos Santos', role: 'PM Experimentação', type: 'lead', area: 'produto' },
            { id: 'pm2', label: 'Bruno Faria Pacheco de Mello', role: 'PM Marketing', type: 'lead', area: 'produto' },
            {
              id: 'pm3', label: 'Rafael Bombarda Oda', role: 'PM Analytics', type: 'lead', area: 'produto',
              children: [
                { id: 'po1', label: 'Roberto Pereira de Souza Neto', role: 'PO', type: 'team', area: 'produto' },
                { id: 'po2', label: 'Raquel Madruga Omegna de Moraes', role: 'PO', type: 'team', area: 'produto' },
                { id: 'po3', label: 'Will', role: 'PO', type: 'team', area: 'produto' },
              ],
            },
          ],
        },
        {
          id: 'design-area',
          label: 'André',
          role: 'Design Coordinator',
          type: 'coordinator',
          area: 'design',
          children: [
            { id: 'des-d1', label: 'Thais Narumi Tanizaki', role: 'Designer', type: 'team', area: 'design' },
            { id: 'des-d2', label: 'Carla Silveira Costantino', role: 'Designer', type: 'team', area: 'design' },
            { id: 'des-d3', label: 'Érika Laís da Silva', role: 'Designer', type: 'team', area: 'design' },
            { id: 'des-d4', label: 'Pedro', role: 'Designer', type: 'team', area: 'design' },
          ],
        },
      ],
    },
    {
      id: 'csa',
      label: 'Henrique Bissoli Silva',
      role: 'CSA',
      type: 'executive',
      children: [
        {
          id: 'dados-area',
          label: 'Lucas Frascarelli',
          role: 'Head de Dados',
          type: 'coordinator',
          area: 'dados',
          children: [
            { id: 'dados-d1', label: 'Gabriel Lopes de Paula', role: 'Dados', type: 'team', area: 'dados' },
            { id: 'dados-d2', label: 'Pablo Leonardo dos Reis', role: 'Dados', type: 'team', area: 'dados' },
          ],
        },
        {
          id: 'infra-area',
          label: 'Ravel Sbrissa Okada',
          role: 'Head de Estrutura',
          type: 'coordinator',
          area: 'infra',
          children: [
            {
              id: 'infra-it', label: 'Thiago Ryuiti Ito', role: 'IT Coordinator', type: 'lead', area: 'infra',
              children: [
                { id: 'infra-d1', label: 'Albert Siqueira Cosme Emidio', role: 'IT Ops', type: 'team', area: 'infra' },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/* ─── Índice de busca contextual ─────────────────────────────────────────── */

interface SearchEntry {
  type: 'pessoa' | 'time' | 'produto';
  label: string;
  sublabel: string;
  node: OrgNode;
  /** squad/time pai, se aplicável */
  parentLabel?: string;
}

function buildSearchIndex(node: OrgNode, parent?: OrgNode): SearchEntry[] {
  const entries: SearchEntry[] = [];

  if (node.type === 'team' || node.type === 'lead' || node.type === 'coordinator' || node.type === 'vp' || node.type === 'executive' || node.type === 'root') {
    entries.push({
      type: 'pessoa',
      label: node.label,
      sublabel: [node.role, node.domain ? `Squad ${node.domain}` : parent?.domain ? `Squad ${parent.domain}` : ''].filter(Boolean).join(' · '),
      node,
      parentLabel: parent?.label,
    });
  }

  if (node.domain) {
    entries.push({
      type: 'time',
      label: node.domain,
      sublabel: `Tech Lead: ${node.label}`,
      node,
    });
  }

  if (node.products) {
    for (const p of node.products) {
      entries.push({
        type: 'produto',
        label: p,
        sublabel: `${node.label} · ${node.domain ?? ''}`,
        node,
      });
    }
  }

  node.children?.forEach(c => entries.push(...buildSearchIndex(c, node)));
  return entries;
}

const SEARCH_INDEX = buildSearchIndex(ORG_DATA);

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const AREAS = [
  { id: 'engenharia', label: 'Engenharia', icon: Network,    color: 'text-emerald-400', dot: 'bg-emerald-500' },
  { id: 'qa',         label: 'QA',         icon: Microscope, color: 'text-sky-400',     dot: 'bg-sky-500'     },
  { id: 'processos',  label: 'Processos',  icon: Zap,        color: 'text-violet-400',  dot: 'bg-violet-500'  },
  { id: 'suporte',    label: 'Suporte',    icon: Users,      color: 'text-slate-400',   dot: 'bg-slate-400'   },
  { id: 'dados',      label: 'Dados',      icon: Database,   color: 'text-amber-400',   dot: 'bg-amber-500'   },
  { id: 'infra',      label: 'Infra',      icon: Server,     color: 'text-orange-400',  dot: 'bg-orange-500'  },
  { id: 'design',     label: 'Design',     icon: Palette,    color: 'text-pink-400',    dot: 'bg-pink-500'    },
  { id: 'produto',    label: 'Produto',    icon: Package,    color: 'text-cyan-400',    dot: 'bg-cyan-500'    },
];

function countByType(node: OrgNode, type: OrgNode['type']): number {
  let n = node.type === type ? 1 : 0;
  node.children?.forEach(c => { n += countByType(c, type); });
  return n;
}

function countAll(node: OrgNode): number {
  return 1 + (node.children?.reduce((a, c) => a + countAll(c), 0) ?? 0);
}

const TYPE_ICON_SEARCH: Record<SearchEntry['type'], React.ReactNode> = {
  pessoa:  <Users size={11} />,
  time:    <Layers size={11} />,
  produto: <Package size={11} />,
};

const TYPE_COLOR: Record<SearchEntry['type'], string> = {
  pessoa:  'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  time:    'text-sky-400 bg-sky-500/10 border-sky-500/20',
  produto: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
};

const TYPE_LABEL: Record<SearchEntry['type'], string> = {
  pessoa:  'Pessoa',
  time:    'Time',
  produto: 'Produto',
};

/* ─── Componente de busca contextual ─────────────────────────────────────── */

function SmartSearch({ onHighlight, onSelectNode }: {
  onHighlight: (q: string) => void;
  onSelectNode: (node: OrgNode) => void;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();
    return SEARCH_INDEX.filter(e =>
      e.label.toLowerCase().includes(q) || e.sublabel.toLowerCase().includes(q)
    ).slice(0, 12);
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<SearchEntry['type'], SearchEntry[]>();
    for (const r of results) {
      if (!map.has(r.type)) map.set(r.type, []);
      map.get(r.type)!.push(r);
    }
    return map;
  }, [results]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setFocused(false); }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (v: string) => { setQuery(v); setOpen(true); onHighlight(v); };
  const handleSelect = (entry: SearchEntry) => { setQuery(entry.label); setOpen(false); onHighlight(entry.label); onSelectNode(entry.node); };
  const clear = () => { setQuery(''); setOpen(false); onHighlight(''); };

  return (
    <div ref={ref} className="relative w-full max-w-2xl">
      <div className={`relative transition-all duration-300 ${focused ? 'drop-shadow-[0_0_20px_rgba(220,38,38,0.15)]' : ''}`}>
        <Search
          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-200 ${focused ? 'text-medcof-red scale-110' : 'text-gray-500'}`}
          size={15}
        />
        <input
          type="text"
          placeholder="Buscar pessoa, time ou produto... (ex: QBank, COT, Gabriel)"
          value={query}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => { setFocused(true); query.length >= 2 && setOpen(true); }}
          onBlur={() => setFocused(false)}
          className={`w-full rounded-2xl border py-3 pl-11 pr-10 text-sm transition-all duration-200
            placeholder:text-gray-600 focus:outline-none
            ${focused
              ? 'border-medcof-red/40 bg-surface ring-4 ring-medcof-red/10 shadow-lg'
              : 'border-border/50 bg-surface/70 hover:border-border'}`}
        />
        {query && (
          <button onClick={clear} className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-surface-hover text-gray-400 hover:text-foreground transition-colors">
            <X size={11} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full mt-2 w-full z-50 rounded-2xl border border-border/80 bg-surface/95 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            {(['pessoa', 'time', 'produto'] as SearchEntry['type'][]).map(type => {
              const items = grouped.get(type);
              if (!items?.length) return null;
              return (
                <div key={type}>
                  <div className={`flex items-center gap-2 px-4 py-2.5 border-b border-border/40 bg-surface/50`}>
                    <span className={`flex items-center justify-center w-5 h-5 rounded-md border text-[9px] ${TYPE_COLOR[type]}`}>
                      {TYPE_ICON_SEARCH[type]}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${TYPE_COLOR[type].split(' ')[0]}`}>{TYPE_LABEL[type]}s</span>
                    <span className="ml-auto text-[10px] text-gray-600 font-medium">{items.length}</span>
                  </div>
                  {items.map((entry, i) => (
                    <motion.button
                      key={`${type}-${i}`}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => handleSelect(entry)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-hover transition-colors text-left border-b border-border/15 last:border-0 group"
                    >
                      <div className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-xl border ${TYPE_COLOR[type]}`}>
                        {TYPE_ICON_SEARCH[type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate leading-tight">{entry.label}</p>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">{entry.sublabel}</p>
                      </div>
                      <ChevronRight size={13} className="text-gray-600 group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
                    </motion.button>
                  ))}
                </div>
              );
            })}
          </motion.div>
        )}
        {open && query.length >= 2 && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute top-full mt-2 w-full z-50 rounded-2xl border border-border bg-surface/95 backdrop-blur-xl shadow-2xl p-6 text-center"
          >
            <p className="text-sm text-gray-400">Nenhum resultado para <strong className="text-foreground">&ldquo;{query}&rdquo;</strong></p>
            <p className="text-xs text-gray-600 mt-1">Tente buscar por nome, cargo ou produto</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Feature: Encontrar Responsável ─────────────────────────────────────── */

function FindOwner() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchEntry | null>(null);
  const [searched, setSearched] = useState(false);

  const search = () => {
    if (!query.trim()) return;
    const q = query.toLowerCase();
    const found = SEARCH_INDEX.find(
      e => e.type === 'produto' && e.label.toLowerCase().includes(q)
    ) ?? SEARCH_INDEX.find(
      e => e.type === 'time' && e.label.toLowerCase().includes(q)
    );
    setResult(found ?? null);
    setSearched(true);
  };

  const clear = () => { setQuery(''); setResult(null); setSearched(false); };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-medcof-red/25 bg-gradient-to-br from-medcof-red/8 via-surface/60 to-surface/40 p-5 backdrop-blur-sm">
      {/* Glow decorativo */}
      <div className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-medcof-red/10 blur-2xl" />

      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-medcof-red/15 border border-medcof-red/25 text-medcof-red shadow-[0_0_12px_rgba(220,38,38,0.2)]">
          <Target size={16} />
        </div>
        <div>
          <p className="text-sm font-black text-foreground leading-none tracking-tight">Encontrar Responsável</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Digite um produto ou sistema para descobrir quem cuida</p>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="ex: QBank, Apollo, Hermes, Intranet..."
          value={query}
          onChange={e => { setQuery(e.target.value); setSearched(false); }}
          onKeyDown={e => e.key === 'Enter' && search()}
          className="flex-1 rounded-xl border border-border/50 bg-surface/80 py-2.5 px-3.5 text-sm placeholder:text-gray-600 focus:border-medcof-red/40 focus:outline-none focus:ring-2 focus:ring-medcof-red/15 transition-all"
        />
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={search}
          className="shrink-0 px-5 py-2.5 rounded-xl bg-medcof-red text-white text-sm font-bold shadow-[0_0_16px_rgba(220,38,38,0.3)] hover:shadow-[0_0_24px_rgba(220,38,38,0.45)] transition-all"
        >
          Buscar
        </motion.button>
        {searched && (
          <button onClick={clear} className="shrink-0 p-2.5 rounded-xl border border-border/50 text-gray-500 hover:text-foreground hover:bg-surface-hover transition-colors">
            <X size={14} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {searched && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-border/30">
              {result ? (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                    <Code2 size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-foreground leading-tight">{result.node.label}</p>
                    <p className="text-xs text-emerald-400 font-semibold mt-0.5">{result.node.role}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {result.node.domain && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                          {result.node.domain}
                        </span>
                      )}
                      {result.node.products?.map(p => (
                        <span key={p} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface border border-border/60 text-gray-400">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-2">
                  Nenhum responsável encontrado para <strong className="text-foreground">&ldquo;{query}&rdquo;</strong>
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Página principal ───────────────────────────────────────────────────── */

export default function OrganogramaPage() {
  const [highlightedArea, setHighlightedArea] = useState<string | null>(null);
  const [searchHighlight, setSearchHighlight] = useState('');
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);

  const activeHighlight = useMemo(() => {
    if (searchHighlight.trim()) return `search:${searchHighlight}`;
    return highlightedArea;
  }, [searchHighlight, highlightedArea]);

  const stats = useMemo(() => [
    { icon: Users,      label: 'Pessoas',    value: countAll(ORG_DATA),              color: 'text-medcof-red',  bg: 'bg-medcof-red/10',  border: 'border-medcof-red/20'  },
    { icon: Code2,      label: 'Tech Leads', value: countByType(ORG_DATA, 'lead'),   color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { icon: Layers,     label: 'Squads',     value: 8,                               color: 'text-sky-400',     bg: 'bg-sky-500/10',     border: 'border-sky-500/20'     },
    { icon: Package,    label: 'Produtos',   value: SEARCH_INDEX.filter(e => e.type === 'produto').length, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { icon: Network,    label: 'Áreas',      value: AREAS.length,                    color: 'text-violet-400',  bg: 'bg-violet-500/10',  border: 'border-violet-500/20'  },
  ], []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-8"
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="flex flex-col gap-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-medcof-red/30 bg-medcof-red/10 text-medcof-red shrink-0 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
              <Network size={22} />
              <div className="absolute inset-0 rounded-2xl bg-medcof-red/5 blur-sm" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-foreground leading-none">
                Visão <span className="text-medcof-red drop-shadow-[0_0_12px_rgba(220,38,38,0.4)]">Organizacional</span>
              </h1>
              <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
                <Fingerprint size={10} className="text-gray-600" />
                Estrutura completa da MedCof
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface border border-border/60 text-gray-400 font-medium">
                  {countAll(ORG_DATA)} pessoas
                </span>
              </p>
            </div>
          </div>

          <motion.a
            href="/tech-leads"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="hidden md:flex items-center gap-2 shrink-0 rounded-xl border border-medcof-red/25 bg-medcof-red/8 px-3.5 py-2.5 text-xs font-bold text-medcof-red hover:bg-medcof-red/15 hover:border-medcof-red/40 hover:shadow-[0_0_16px_rgba(220,38,38,0.15)] transition-all"
          >
            <Sparkles size={12} />
            Novo no time? Tech Leads
            <ChevronRight size={11} />
          </motion.a>
        </div>

        {/* Busca contextual */}
        <SmartSearch
          onHighlight={q => { setSearchHighlight(q); setHighlightedArea(null); }}
          onSelectNode={setSelectedNode}
        />

        {/* Filtros por área */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => { setHighlightedArea(null); setSearchHighlight(''); }}
            className={`shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold border transition-all duration-200
              ${!activeHighlight
                ? 'bg-medcof-red border-medcof-red text-white shadow-[0_0_14px_rgba(220,38,38,0.35)]'
                : 'border-border/50 bg-surface/50 text-gray-500 hover:text-foreground hover:border-border'}`}
          >
            <Filter size={10} /> Todos
          </motion.button>
          {AREAS.map((area, i) => (
            <motion.button
              key={area.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.03 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { setHighlightedArea(area.id); setSearchHighlight(''); }}
              className={`shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold border transition-all duration-200
                ${highlightedArea === area.id
                  ? 'bg-surface border-border text-foreground shadow-md ring-1 ring-border'
                  : 'border-border/35 bg-surface/35 text-gray-500 hover:text-foreground hover:border-border/60 hover:bg-surface/60'}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${area.dot} shrink-0 ${highlightedArea === area.id ? 'shadow-[0_0_6px_currentColor]' : ''}`} />
              {area.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ── Stats ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.35 }}
            className={`group relative overflow-hidden flex items-center gap-3 rounded-2xl border ${s.border} ${s.bg} p-4 hover:shadow-md transition-all duration-300`}
          >
            <div className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${s.border} ${s.color}`}>
              <s.icon size={16} />
            </div>
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className="text-2xl font-black text-foreground leading-none"
              >
                {s.value}
              </motion.div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mt-0.5">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Encontrar Responsável ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.35 }}
      >
        <FindOwner />
      </motion.div>

      {/* ── Organograma ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        className="relative rounded-3xl border border-border/40 bg-gradient-to-b from-surface/50 via-surface/30 to-surface/20 p-6 shadow-xl backdrop-blur-sm md:p-8"
      >
        {/* Glow radial central */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute left-1/2 top-0 h-64 w-[700px] -translate-x-1/2 rounded-full bg-medcof-red/6 blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/4 h-48 w-96 rounded-full bg-emerald-500/5 blur-[80px]" />
          <div className="absolute bottom-1/4 right-1/4 h-40 w-72 rounded-full bg-sky-500/5 blur-[70px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full bg-medcof-red/4 blur-[60px]" />
        </div>
        <div className="relative">
          <OrgChart
            data={ORG_DATA}
            highlightedArea={activeHighlight}
            externalSelectedNode={selectedNode}
            onExternalNodeConsumed={() => setSelectedNode(null)}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
