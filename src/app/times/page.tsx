'use client';

import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, Users, Package, ChevronRight,
  Bot, BookOpen, Globe, Layers, Monitor, Cpu, Building2,
} from 'lucide-react';

/* ─── Tipos ──────────────────────────────────────────────────────────────── */

interface Dev {
  name: string;
  role?: string;
}

interface Squad {
  id: string;
  name: string;
  domain: string;
  domainId: string;
  techLead: string;
  products: string[];
  devs: Dev[];
  description: string;
}

interface Domain {
  id: string;
  label: string;
  color: string;
  border: string;
  bg: string;
  activeBg: string;
  glow: string;
  bar: string;
  icon: React.ReactNode;
  squads: Squad[];
}

/* ─── Dados ──────────────────────────────────────────────────────────────── */

const DOMAINS: Domain[] = [
  {
    id: 'educacao',
    label: 'Educação / Core',
    color: 'text-sky-400',
    border: 'border-sky-500/30',
    bg: 'bg-sky-500/5',
    activeBg: 'bg-sky-500/10',
    glow: 'rgba(14,165,233,0.12)',
    bar: 'bg-sky-500',
    icon: <BookOpen size={16} />,
    squads: [
      {
        id: 'medcode',
        name: 'MedCode',
        domain: 'Educação / Core',
        domainId: 'educacao',
        techLead: 'Vinícius de Assis Azevedo',
        products: ['QBank'],
        description: 'Responsável pelo banco de questões e ferramentas de estudo core da plataforma MedCof.',
        devs: [
          { name: 'Daniel Brandão Bezerra' },
          { name: 'Yuri Muniz Gonzalez' },
          { name: 'Felipi Estevão Matos da Trindade' },
        ],
      },
      {
        id: 'tip',
        name: 'TIP (Apollo)',
        domain: 'Educação / Core',
        domainId: 'educacao',
        techLead: 'Thiago Gomes de Oliveira Silva',
        products: ['Apollo (Aulas)'],
        description: 'Cuida da plataforma de aulas e conteúdo em vídeo da MedCof.',
        devs: [
          { name: 'André Macedo Rodrigues' },
          { name: 'Vinicius Henrique Abdon Alves' },
          { name: 'Guilherme Pereira Lopes' },
          { name: 'Yago Luiz Militão' },
        ],
      },
      {
        id: 'internato',
        name: 'Internato',
        domain: 'Educação / Core',
        domainId: 'educacao',
        techLead: 'Juan Matheus Moreira Amaral',
        products: ['Internato'],
        description: 'Desenvolve e mantém o produto focado em internato médico.',
        devs: [
          { name: 'Bruno Coimbra de Oliveira' },
          { name: 'Giordano Mendes Bueno' },
        ],
      },
    ],
  },
  {
    id: 'plataforma',
    label: 'Plataforma / Interno',
    color: 'text-violet-400',
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/5',
    activeBg: 'bg-violet-500/10',
    glow: 'rgba(139,92,246,0.12)',
    bar: 'bg-violet-500',
    icon: <Layers size={16} />,
    squads: [
      {
        id: 'cot',
        name: 'COT (Plataforma)',
        domain: 'Plataforma / Interno',
        domainId: 'plataforma',
        techLead: 'Gabriel Henrique da Silva',
        products: ['Prometheus', 'Hermes', 'CofTimer', 'DailyCof'],
        description: 'Mantém os serviços de plataforma transversais usados por todos os outros times.',
        devs: [
          { name: 'Felipe Galdino Porcelli' },
          { name: 'Nathan Henrique Dias Ferraz' },
          { name: 'Vinicius Magalhães Gaspar' },
          { name: 'Vitor Ferraz Maciel' },
          { name: 'Leonardo Queiroz de Oliveira' },
          { name: 'Pedro Henrique Miotto Ramos' },
        ],
      },
      {
        id: 'intranetando',
        name: 'Intranetando',
        domain: 'Plataforma / Interno',
        domainId: 'plataforma',
        techLead: 'Matheus Fernandes Pinho',
        products: ['Intranet'],
        description: 'Desenvolve e mantém os sistemas internos e ferramentas de backoffice.',
        devs: [
          { name: 'Elvis Henrique Tavernari da Silva' },
          { name: 'Neto' },
          { name: 'Cesar Henrique Vito Bueno' },
        ],
      },
      {
        id: 'onboarding',
        name: 'Onboarding',
        domain: 'Plataforma / Interno',
        domainId: 'plataforma',
        techLead: 'Luca Gonzalez Watson',
        products: ['Onboarding'],
        description: 'Responsável pela jornada de entrada e ativação de novos alunos na plataforma.',
        devs: [
          { name: 'Luiz Sena' },
          { name: 'Rafael Trevisan' },
        ],
      },
    ],
  },
  {
    id: 'ia',
    label: 'IA / Inovação',
    color: 'text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/5',
    activeBg: 'bg-amber-500/10',
    glow: 'rgba(245,158,11,0.12)',
    bar: 'bg-amber-500',
    icon: <Bot size={16} />,
    squads: [
      {
        id: 'cofbot',
        name: 'CofBot',
        domain: 'IA / Inovação',
        domainId: 'ia',
        techLead: 'Ayk',
        products: ['CofBot', 'CofBot Extraordinário'],
        description: 'Desenvolve soluções de inteligência artificial e automação de tutoria para a MedCof.',
        devs: [
          { name: 'Jean Bernardo Silva' },
          { name: 'Victor da Silva Martins' },
        ],
      },
    ],
  },
  {
    id: 'comunidade',
    label: 'Comunidade',
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/5',
    activeBg: 'bg-emerald-500/10',
    glow: 'rgba(16,185,129,0.12)',
    bar: 'bg-emerald-500',
    icon: <Globe size={16} />,
    squads: [
      {
        id: 'cofmunidade',
        name: 'Cofmunidade',
        domain: 'Comunidade',
        domainId: 'comunidade',
        techLead: 'Igor Henrique de Souza Tieso',
        products: ['Mentoria Singular', 'Comunidade', 'B2B'],
        description: 'Cuida do hub social, fóruns, mentoria e funcionalidades de comunidade da plataforma.',
        devs: [
          { name: 'Yasmin Coelho Ramos' },
          { name: 'João Vitor Fernandes de Souza' },
        ],
      },
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

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const sz = size === 'sm' ? 'w-7 h-7 text-[9px]' : size === 'lg' ? 'w-12 h-12 text-sm' : 'w-9 h-9 text-[11px]';
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br ${avatarColor(name)} flex items-center justify-center font-black text-white shrink-0`}>
      {initials(name)}
    </div>
  );
}

function domainForSquad(squadId: string): Domain {
  return DOMAINS.find(d => d.squads.some(s => s.id === squadId))!;
}

/* ─── Modal de squad ─────────────────────────────────────────────────────── */

function SquadModal({ squad, onClose }: { squad: Squad; onClose: () => void }) {
  const domain = domainForSquad(squad.id);

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className={`relative z-10 w-full max-w-lg rounded-2xl border ${domain.border} bg-surface/95 backdrop-blur-md overflow-hidden`}
          style={{ boxShadow: `0 8px 48px ${domain.glow}` }}
        >
          {/* Barra de cor */}
          <div className={`h-[3px] w-full ${domain.bar}`} />

          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl border ${domain.border} ${domain.bg} ${domain.color} flex items-center justify-center shrink-0`}>
                  {domain.icon}
                </div>
                <div>
                  <h2 className="text-xl font-black text-foreground leading-tight">{squad.name}</h2>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${domain.color}`}>{squad.domain}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-gray-500 hover:text-foreground hover:border-border/80 transition-all"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-[12px] text-gray-400 leading-relaxed mb-5">{squad.description}</p>

            {/* Produtos */}
            <div className="mb-5">
              <p className={`text-[9px] font-black uppercase tracking-widest ${domain.color} mb-2 flex items-center gap-1.5`}>
                <Package size={10} /> Produtos
              </p>
              <div className="flex flex-wrap gap-1.5">
                {squad.products.map(p => (
                  <span key={p} className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border ${domain.border} ${domain.bg} ${domain.color}`}>
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Tech Lead */}
            <div className={`flex items-center gap-3 p-3 rounded-xl border ${domain.border} ${domain.activeBg} mb-5`}>
              <Avatar name={squad.techLead} size="md" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-0.5">Tech Lead</p>
                <p className="text-[13px] font-bold text-foreground">{squad.techLead}</p>
              </div>
            </div>

            {/* Devs */}
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-1.5">
                <Users size={10} /> Time ({squad.devs.length} devs)
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {squad.devs.map((dev, i) => (
                  <motion.div
                    key={dev.name}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-2.5 p-2 rounded-lg border border-border/40 bg-surface/50"
                  >
                    <Avatar name={dev.name} size="sm" />
                    <span className="text-[11px] font-semibold text-foreground">{dev.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}

/* ─── Card de squad ──────────────────────────────────────────────────────── */

function SquadCard({ squad, index, onClick }: { squad: Squad; index: number; onClick: () => void }) {
  const domain = domainForSquad(squad.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={`group cursor-pointer rounded-2xl border ${domain.border} bg-surface/60 backdrop-blur-sm overflow-hidden transition-all duration-200 hover:${domain.activeBg}`}
      style={{ boxShadow: `0 2px 12px ${domain.glow}` }}
    >
      {/* Barra de cor */}
      <div className={`h-[3px] w-full ${domain.bar}`} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl border ${domain.border} ${domain.bg} ${domain.color} flex items-center justify-center shrink-0`}>
              {domain.icon}
            </div>
            <div>
              <h3 className={`text-[14px] font-black text-foreground group-hover:${domain.color} transition-colors leading-tight`}>
                {squad.name}
              </h3>
              <span className={`text-[8px] font-black uppercase tracking-widest ${domain.color} opacity-70`}>
                {squad.domain}
              </span>
            </div>
          </div>
          <ChevronRight size={14} className={`${domain.color} opacity-0 group-hover:opacity-100 transition-opacity mt-1`} />
        </div>

        {/* Produtos */}
        <div className="flex flex-wrap gap-1 mb-3">
          {squad.products.map(p => (
            <span key={p} className={`text-[9px] font-semibold px-2 py-0.5 rounded-md border ${domain.border} ${domain.bg} ${domain.color}`}>
              {p}
            </span>
          ))}
        </div>

        {/* Tech Lead */}
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border/30">
          <Avatar name={squad.techLead} size="sm" />
          <div>
            <p className="text-[8px] text-gray-600 font-medium uppercase tracking-wider">Tech Lead</p>
            <p className="text-[11px] font-bold text-foreground leading-tight">{squad.techLead}</p>
          </div>
        </div>

        {/* Mini avatares do time */}
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1.5">
            {squad.devs.slice(0, 5).map(dev => (
              <div
                key={dev.name}
                title={dev.name}
                className={`w-6 h-6 rounded-full bg-gradient-to-br ${avatarColor(dev.name)} border-2 border-surface flex items-center justify-center text-[7px] font-black text-white`}
              >
                {initials(dev.name)}
              </div>
            ))}
            {squad.devs.length > 5 && (
              <div className="w-6 h-6 rounded-full bg-surface border-2 border-border flex items-center justify-center text-[7px] font-bold text-gray-500">
                +{squad.devs.length - 5}
              </div>
            )}
          </div>
          <span className="text-[9px] text-gray-600 ml-1">{squad.devs.length} devs</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Página principal ───────────────────────────────────────────────────── */

export default function TimesPage() {
  const [search, setSearch] = useState('');
  const [selectedSquad, setSelectedSquad] = useState<Squad | null>(null);
  const [activeDomain, setActiveDomain] = useState<string | null>(null);

  const allSquads = useMemo(() => DOMAINS.flatMap(d => d.squads), []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allSquads.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.techLead.toLowerCase().includes(q) ||
      s.products.some(p => p.toLowerCase().includes(q)) ||
      s.devs.some(d => d.name.toLowerCase().includes(q)) ||
      s.domain.toLowerCase().includes(q)
    );
  }, [search, allSquads]);

  const totalDevs = useMemo(() => allSquads.reduce((a, s) => a + s.devs.length, 0), [allSquads]);
  const totalLeads = useMemo(() => allSquads.length, [allSquads]);

  const domainsToShow = useMemo(() => {
    if (search) {
      const domainIds = new Set(filtered.map(s => s.domainId));
      return DOMAINS.filter(d => domainIds.has(d.id)).map(d => ({
        ...d,
        squads: d.squads.filter(s => filtered.some(f => f.id === s.id)),
      }));
    }
    if (activeDomain) return DOMAINS.filter(d => d.id === activeDomain);
    return DOMAINS;
  }, [search, activeDomain, filtered]);

  return (
    <div className="max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground flex items-center gap-2 mb-2">
          <span className="text-medcof-red">#</span> Times de Engenharia
        </h1>
        <p className="text-[13px] text-gray-500 mb-5">
          Estrutura operacional da engenharia, organizada por domínio de produto.
        </p>

        {/* Stats */}
        <div className="flex items-center gap-6 mb-5 flex-wrap">
          {[
            { label: 'Squads', value: allSquads.length, icon: <Cpu size={13} />, color: 'text-medcof-red' },
            { label: 'Desenvolvedores', value: totalDevs, icon: <Users size={13} />, color: 'text-sky-400' },
            { label: 'Tech Leads', value: totalLeads, icon: <Monitor size={13} />, color: 'text-violet-400' },
            { label: 'Domínios', value: DOMAINS.length, icon: <Building2 size={13} />, color: 'text-emerald-400' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <span className={`${s.color}`}>{s.icon}</span>
              <span className={`text-xl font-black ${s.color}`}>{s.value}</span>
              <span className="text-[11px] text-gray-500 font-medium">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Busca + filtros de domínio */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por pessoa, time ou produto..."
              className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-surface border border-border/50 text-sm text-foreground placeholder:text-gray-600 focus:outline-none focus:border-medcof-red/40 focus:shadow-[0_0_12px_rgba(220,38,38,0.12)] transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-foreground">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Pills de domínio */}
          {!search && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setActiveDomain(null)}
                className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all
                  ${activeDomain === null
                    ? 'bg-medcof-red text-white border-medcof-red'
                    : 'border-border/50 text-gray-500 hover:text-foreground hover:border-border'}`}
              >
                Todos
              </button>
              {DOMAINS.map(d => (
                <button
                  key={d.id}
                  onClick={() => setActiveDomain(activeDomain === d.id ? null : d.id)}
                  className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all
                    ${activeDomain === d.id
                      ? `${d.bar} text-white border-transparent`
                      : `${d.border} ${d.color} ${d.bg} hover:${d.activeBg}`}`}
                >
                  {d.icon}
                  {d.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Domínios e squads */}
      <div className="flex flex-col gap-10">
        <AnimatePresence mode="popLayout">
          {domainsToShow.map((domain, di) => (
            <motion.section
              key={domain.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: di * 0.06 }}
            >
              {/* Cabeçalho do domínio */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-xl border ${domain.border} ${domain.bg} ${domain.color} flex items-center justify-center`}>
                  {domain.icon}
                </div>
                <div>
                  <h2 className={`text-[13px] font-black uppercase tracking-widest ${domain.color}`}>{domain.label}</h2>
                  <p className="text-[10px] text-gray-600">{domain.squads.length} squad{domain.squads.length > 1 ? 's' : ''}</p>
                </div>
                <div className={`flex-1 h-px ${domain.bar} opacity-20 ml-2`} />
              </div>

              {/* Grid de cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {domain.squads.map((squad, si) => (
                  <SquadCard
                    key={squad.id}
                    squad={squad}
                    index={si}
                    onClick={() => setSelectedSquad(squad)}
                  />
                ))}
              </div>
            </motion.section>
          ))}
        </AnimatePresence>

        {domainsToShow.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-gray-500 text-sm">Nenhum resultado para &ldquo;{search}&rdquo;</p>
            <button onClick={() => setSearch('')} className="mt-3 text-xs text-medcof-red hover:underline">
              Limpar busca
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedSquad && (
        <SquadModal squad={selectedSquad} onClose={() => setSelectedSquad(null)} />
      )}
    </div>
  );
}
