'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { OrgNode } from '@/types/organograma';
import React from 'react';
import {
  Crown, Award, Building2, Cpu, Code2, Users,
  ChevronRight, ArrowLeft, Home, X, LayoutGrid, List,
  User, Layers, Package, Columns3, GitBranch, Rows3,
} from 'lucide-react';

/* ─── Tipos e helpers ────────────────────────────────────────────────────── */

interface OrgChartProps {
  data: OrgNode;
  highlightedArea?: string | null;
  externalSelectedNode?: OrgNode | null;
  onExternalNodeConsumed?: () => void;
}

const AREA_THEME = {
  engenharia: {
    border: 'border-emerald-500/25',
    activeBorder: 'border-emerald-500/60',
    bg: 'bg-emerald-500/5',
    activeBg: 'bg-emerald-500/10',
    badge: 'bg-emerald-500/12 text-emerald-400 border-emerald-500/20',
    role: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    ring: 'ring-emerald-500/30',
    dot: 'bg-emerald-500',
    accent: 'text-emerald-400',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.12)]',
    activeGlow: 'shadow-[0_0_28px_rgba(16,185,129,0.22)]',
    bar: 'bg-emerald-500',
    glowColor: 'rgba(16,185,129,0.15)',
    label: 'Engenharia',
  },
  qa: {
    border: 'border-sky-500/25',
    activeBorder: 'border-sky-500/60',
    bg: 'bg-sky-500/5',
    activeBg: 'bg-sky-500/10',
    badge: 'bg-sky-500/12 text-sky-400 border-sky-500/20',
    role: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    ring: 'ring-sky-500/30',
    dot: 'bg-sky-500',
    accent: 'text-sky-400',
    glow: 'shadow-[0_0_20px_rgba(14,165,233,0.12)]',
    activeGlow: 'shadow-[0_0_28px_rgba(14,165,233,0.22)]',
    bar: 'bg-sky-500',
    glowColor: 'rgba(14,165,233,0.15)',
    label: 'QA',
  },
  processos: {
    border: 'border-violet-500/25',
    activeBorder: 'border-violet-500/60',
    bg: 'bg-violet-500/5',
    activeBg: 'bg-violet-500/10',
    badge: 'bg-violet-500/12 text-violet-400 border-violet-500/20',
    role: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    ring: 'ring-violet-500/30',
    dot: 'bg-violet-500',
    accent: 'text-violet-400',
    glow: 'shadow-[0_0_20px_rgba(139,92,246,0.12)]',
    activeGlow: 'shadow-[0_0_28px_rgba(139,92,246,0.22)]',
    bar: 'bg-violet-500',
    glowColor: 'rgba(139,92,246,0.15)',
    label: 'Processos',
  },
  suporte: {
    border: 'border-slate-500/25',
    activeBorder: 'border-slate-500/60',
    bg: 'bg-slate-500/5',
    activeBg: 'bg-slate-500/10',
    badge: 'bg-slate-500/12 text-slate-400 border-slate-500/20',
    role: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    ring: 'ring-slate-500/30',
    dot: 'bg-slate-400',
    accent: 'text-slate-400',
    glow: 'shadow-[0_0_20px_rgba(100,116,139,0.12)]',
    activeGlow: 'shadow-[0_0_28px_rgba(100,116,139,0.22)]',
    bar: 'bg-slate-400',
    glowColor: 'rgba(100,116,139,0.15)',
    label: 'Suporte',
  },
  dados: {
    border: 'border-amber-500/25',
    activeBorder: 'border-amber-500/60',
    bg: 'bg-amber-500/5',
    activeBg: 'bg-amber-500/10',
    badge: 'bg-amber-500/12 text-amber-400 border-amber-500/20',
    role: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    ring: 'ring-amber-500/30',
    dot: 'bg-amber-500',
    accent: 'text-amber-400',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.12)]',
    activeGlow: 'shadow-[0_0_28px_rgba(245,158,11,0.22)]',
    bar: 'bg-amber-500',
    glowColor: 'rgba(245,158,11,0.15)',
    label: 'Dados',
  },
  infra: {
    border: 'border-orange-500/25',
    activeBorder: 'border-orange-500/60',
    bg: 'bg-orange-500/5',
    activeBg: 'bg-orange-500/10',
    badge: 'bg-orange-500/12 text-orange-400 border-orange-500/20',
    role: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    ring: 'ring-orange-500/30',
    dot: 'bg-orange-500',
    accent: 'text-orange-400',
    glow: 'shadow-[0_0_20px_rgba(249,115,22,0.12)]',
    activeGlow: 'shadow-[0_0_28px_rgba(249,115,22,0.22)]',
    bar: 'bg-orange-500',
    glowColor: 'rgba(249,115,22,0.15)',
    label: 'Infra',
  },
  design: {
    border: 'border-pink-500/25',
    activeBorder: 'border-pink-500/60',
    bg: 'bg-pink-500/5',
    activeBg: 'bg-pink-500/10',
    badge: 'bg-pink-500/12 text-pink-400 border-pink-500/20',
    role: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    ring: 'ring-pink-500/30',
    dot: 'bg-pink-500',
    accent: 'text-pink-400',
    glow: 'shadow-[0_0_20px_rgba(236,72,153,0.12)]',
    activeGlow: 'shadow-[0_0_28px_rgba(236,72,153,0.22)]',
    bar: 'bg-pink-500',
    glowColor: 'rgba(236,72,153,0.15)',
    label: 'Design',
  },
  produto: {
    border: 'border-cyan-500/25',
    activeBorder: 'border-cyan-500/60',
    bg: 'bg-cyan-500/5',
    activeBg: 'bg-cyan-500/10',
    badge: 'bg-cyan-500/12 text-cyan-400 border-cyan-500/20',
    role: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    ring: 'ring-cyan-500/30',
    dot: 'bg-cyan-500',
    accent: 'text-cyan-400',
    glow: 'shadow-[0_0_20px_rgba(6,182,212,0.12)]',
    activeGlow: 'shadow-[0_0_28px_rgba(6,182,212,0.22)]',
    bar: 'bg-cyan-500',
    glowColor: 'rgba(6,182,212,0.15)',
    label: 'Produto',
  },
};

const MGMT_THEME = {
  border: 'border-medcof-red/25',
  activeBorder: 'border-medcof-red/60',
  bg: 'bg-medcof-red/5',
  activeBg: 'bg-medcof-red/10',
  badge: 'bg-medcof-red/12 text-medcof-red border-medcof-red/20',
  role: 'bg-medcof-red/10 text-medcof-red border-medcof-red/20',
  ring: 'ring-medcof-red/30',
  dot: 'bg-medcof-red',
  accent: 'text-medcof-red',
  glow: 'shadow-[0_0_20px_rgba(220,38,38,0.12)]',
  activeGlow: 'shadow-[0_0_28px_rgba(220,38,38,0.25)]',
  bar: 'bg-medcof-red',
  glowColor: 'rgba(220,38,38,0.18)',
  label: 'Gestão',
};

const getTheme = (node: OrgNode) =>
  node.area && AREA_THEME[node.area as keyof typeof AREA_THEME]
    ? AREA_THEME[node.area as keyof typeof AREA_THEME]
    : MGMT_THEME;

const TYPE_ICON: Record<OrgNode['type'], React.ReactNode> = {
  root:        <Crown size={15} />,
  vp:          <Award size={15} />,
  executive:   <Building2 size={14} />,
  coordinator: <Cpu size={14} />,
  lead:        <Code2 size={13} />,
  team:        <User size={13} />,
};

/** Coleta todos os nós folha de uma sub-árvore */
function collectLeaves(node: OrgNode): OrgNode[] {
  if (!node.children || node.children.length === 0) return [node];
  return node.children.flatMap(collectLeaves);
}

/** Coleta todos os nós de um tipo específico */
function collectByType(node: OrgNode, type: OrgNode['type']): OrgNode[] {
  const result: OrgNode[] = [];
  if (node.type === type) result.push(node);
  node.children?.forEach(c => result.push(...collectByType(c, type)));
  return result;
}

/** Iniciais de um nome */
function initials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/* ─── Avatar ─────────────────────────────────────────────────────────────── */

const AVATAR_GRADIENTS = [
  'from-rose-500 to-pink-700',
  'from-orange-400 to-red-600',
  'from-amber-400 to-orange-600',
  'from-emerald-400 to-teal-700',
  'from-sky-400 to-blue-700',
  'from-violet-400 to-purple-700',
  'from-fuchsia-400 to-pink-700',
  'from-cyan-400 to-sky-700',
];

function avatarGradient(name: string) {
  const sum = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_GRADIENTS[sum % AVATAR_GRADIENTS.length];
}

function Avatar({ node, size = 'md', glow = false }: { node: OrgNode; size?: 'sm' | 'md' | 'lg'; glow?: boolean }) {
  const sz = size === 'lg' ? 'w-14 h-14 text-base' : size === 'sm' ? 'w-8 h-8 text-[10px]' : 'w-10 h-10 text-xs';
  const theme = getTheme(node);
  const grad = avatarGradient(node.label);
  const glowStyle = glow ? { boxShadow: `0 0 16px ${theme.glowColor}` } : {};

  if (node.imageUrl) {
    return (
      <div className={`${sz} rounded-full overflow-hidden ring-2 ring-white/15 shadow-lg shrink-0`} style={glowStyle}>
        <img src={node.imageUrl} alt={node.label} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className={`${sz} rounded-full bg-gradient-to-br ${grad} flex items-center justify-center font-black text-white shadow-md shrink-0 ring-1 ring-white/10`}
      style={glowStyle}
    >
      {initials(node.label)}
    </div>
  );
}

/* ─── Modal de detalhes de um nó ─────────────────────────────────────────── */

function NodeModal({ node, onClose, onDrillDown }: { node: OrgNode; onClose: () => void; onDrillDown?: (n: OrgNode) => void }) {
  const theme = getTheme(node);
  const directChildren = node.children ?? [];
  const allMembers = collectLeaves(node);
  const areaLabel = node.area ? (AREA_META[node.area]?.label ?? node.area) : null;
  const hasChildren = directChildren.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.93, y: 40, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 360, damping: 30 }}
        onClick={e => e.stopPropagation()}
        className={`relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border ${theme.activeBorder} bg-surface/95 backdrop-blur-xl overflow-hidden`}
        style={{ boxShadow: `0 25px 60px rgba(0,0,0,0.5), 0 0 40px ${theme.glowColor}` }}
      >
        {/* Glow radial no topo */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl overflow-hidden">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-48 h-24 rounded-full blur-2xl opacity-40"
            style={{ background: theme.glowColor }} />
        </div>

        {/* Barra de cor no topo */}
        <div className={`h-[2px] w-full ${theme.bar} opacity-80`} />

        <div className="relative p-5 sm:p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
              <Avatar node={node} size="lg" glow />
              <div className="flex-1 min-w-0">
                <p className="font-black text-lg text-foreground leading-tight tracking-tight">{node.label}</p>
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {node.role && (
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${theme.badge}`}>
                      {TYPE_ICON[node.type]} {node.role}
                    </span>
                  )}
                  {node.domain && (
                    <span className={`inline-flex items-center text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${theme.badge}`}>
                      {node.domain}
                    </span>
                  )}
                  {areaLabel && (
                    <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface border border-border/60 text-gray-500">
                      {areaLabel}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 shrink-0 rounded-xl flex items-center justify-center text-gray-500 hover:text-foreground hover:bg-surface-hover transition-all ml-2"
            >
              <X size={14} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            <div className={`rounded-xl border ${theme.border} ${theme.bg} p-3.5`}>
              <div className={`text-2xl font-black ${theme.accent} leading-none`}>{directChildren.length}</div>
              <div className="text-[10px] font-semibold text-gray-500 mt-1 uppercase tracking-wider">Diretos</div>
            </div>
            <div className={`rounded-xl border ${theme.border} ${theme.bg} p-3.5`}>
              <div className={`text-2xl font-black ${theme.accent} leading-none`}>{allMembers.length}</div>
              <div className="text-[10px] font-semibold text-gray-500 mt-1 uppercase tracking-wider">Total na área</div>
            </div>
          </div>

          {/* Descrição / nota de co-responsabilidade */}
          {node.description && (
            <div className={`mb-5 px-3.5 py-3 rounded-xl border ${theme.border} ${theme.bg}`}>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1.5">Sobre</p>
              <p className="text-[12px] text-gray-400 leading-relaxed">{node.description}</p>
            </div>
          )}

          {/* Produtos */}
          {(node.products?.length ?? 0) > 0 && (
            <div className="mb-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2.5">Produtos</p>
              <div className="flex flex-wrap gap-1.5">
                {node.products!.map(p => (
                  <motion.span
                    key={p}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg border ${theme.badge}`}
                  >
                    <Package size={9} /> {p}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {/* Membros diretos */}
          {hasChildren && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2.5">
                Subordinados diretos ({directChildren.length})
              </p>
              <ul className="flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-0.5">
                {directChildren.map((child, i) => {
                  const childHasKids = (child.children?.length ?? 0) > 0;
                  return (
                    <motion.li
                      key={child.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <button
                        onClick={() => { onClose(); onDrillDown?.(child); }}
                        className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border ${theme.border} bg-surface/40 hover:bg-surface/80 hover:${theme.activeBorder} transition-all group`}
                      >
                        <Avatar node={child} size="sm" />
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-[13px] font-semibold text-foreground truncate leading-tight">{child.label}</p>
                          {child.role && <p className={`text-[10px] ${theme.accent} truncate mt-0.5`}>{child.role}</p>}
                        </div>
                        {childHasKids && (
                          <span className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${theme.badge} opacity-0 group-hover:opacity-100 transition-opacity`}>
                            {child.children!.length}
                          </span>
                        )}
                        <ChevronRight size={12} className={`${theme.accent} opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0`} />
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Ação principal */}
          {hasChildren && onDrillDown && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { onClose(); onDrillDown(node); }}
              className={`mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm ${theme.bar} text-white transition-all`}
              style={{ boxShadow: `0 0 20px ${theme.glowColor}` }}
            >
              Explorar time <ChevronRight size={14} />
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Card compacto para a view de mapa ─────────────────────────────────── */

function MapCard({ node, onClick, dimmed, highlighted, index = 0 }: {
  node: OrgNode;
  onClick: () => void;
  dimmed?: boolean;
  highlighted?: boolean;
  index?: number;
}) {
  const theme = getTheme(node);
  const memberCount = collectLeaves(node).length;
  const hasChildren = (node.children?.length ?? 0) > 0;
  const products = node.products ?? [];
  const isLead = node.type === 'lead';
  const isExec = node.type === 'root' || node.type === 'executive' || node.type === 'vp';

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: dimmed ? 0.12 : 1, y: 0, scale: highlighted ? 1.02 : 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24, delay: index * 0.04 }}
      onClick={onClick}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`group relative w-full text-left rounded-2xl border backdrop-blur-sm cursor-pointer overflow-hidden transition-all duration-300
        ${isExec ? 'p-5' : 'p-4'}
        ${highlighted
          ? `${theme.activeBorder} ${theme.activeBg} ${theme.activeGlow}`
          : `${theme.border} ${theme.bg} hover:${theme.activeBorder} ${theme.glow} hover:${theme.activeGlow}`}`}
    >
      {/* Barra superior de cor */}
      <div className={`absolute top-0 left-0 right-0 ${isExec ? 'h-[2px]' : 'h-[1.5px]'} ${theme.bar} ${highlighted ? 'opacity-80' : 'opacity-25 group-hover:opacity-60'} transition-opacity duration-300`} />

      {/* Glow interno no hover */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${theme.glowColor} 0%, transparent 70%)` }}
      />

      <div className="relative flex items-start gap-3">
        <Avatar node={node} size={isExec ? 'md' : 'sm'} glow={highlighted} />
        <div className="flex-1 min-w-0">
          {/* Nome + squad badge */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className={`font-bold text-foreground leading-snug line-clamp-2 ${isExec ? 'text-sm' : 'text-[13px]'}`}>
              {node.label}
            </p>
            {node.domain && (
              <span className={`shrink-0 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border ${theme.badge} mt-0.5 whitespace-nowrap`}>
                {node.domain}
              </span>
            )}
          </div>
          {/* Cargo */}
          {node.role && (
            <p className={`text-[11px] font-semibold ${theme.accent} leading-none tracking-wide`}>{node.role}</p>
          )}

          {/* Produtos — apenas para leads */}
          {isLead && products.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {products.slice(0, 3).map(p => (
                <span key={p} className="flex items-center gap-0.5 text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-surface/80 border border-border/50 text-gray-400">
                  <Package size={7} /> {p}
                </span>
              ))}
              {products.length > 3 && (
                <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-surface/80 border border-border/50 text-gray-500">
                  +{products.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Rodapé */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/20">
            {hasChildren ? (
              <span className="flex items-center gap-1 text-[10px] font-medium text-gray-500">
                <Users size={9} />
                {memberCount} {memberCount === 1 ? 'membro' : 'membros'}
              </span>
            ) : (
              <span className="text-[10px] text-gray-600">Membro</span>
            )}
            <span className={`text-[10px] font-bold ${theme.accent} opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-0.5 translate-x-1 group-hover:translate-x-0`}>
              Ver <ChevronRight size={9} />
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

/* ─── View: Mapa de Squads ───────────────────────────────────────────────── */

/** Agrupa nós por área, preservando a ordem de aparição */
function groupByArea(nodes: OrgNode[]): Map<string, OrgNode[]> {
  const map = new Map<string, OrgNode[]>();
  for (const n of nodes) {
    const key = n.area ?? '__mgmt';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(n);
  }
  return map;
}

const AREA_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  engenharia: { label: 'Engenharia',  icon: <Code2 size={12} />,    color: 'text-emerald-400' },
  qa:         { label: 'QA',          icon: <Award size={12} />,    color: 'text-sky-400'     },
  processos:  { label: 'Processos',   icon: <Layers size={12} />,   color: 'text-violet-400'  },
  suporte:    { label: 'Suporte',     icon: <Users size={12} />,    color: 'text-slate-400'   },
  dados:      { label: 'Dados',       icon: <Cpu size={12} />,      color: 'text-amber-400'   },
  infra:      { label: 'Infra',       icon: <Building2 size={12} />,color: 'text-orange-400'  },
  design:     { label: 'Design',      icon: <User size={12} />,     color: 'text-pink-400'    },
  produto:    { label: 'Produto',     icon: <Crown size={12} />,    color: 'text-cyan-400'    },
  __mgmt:     { label: 'Gestão',      icon: <Crown size={12} />,    color: 'text-medcof-red'  },
};

function matchesHighlight(node: OrgNode, highlightedArea: string | null | undefined): boolean {
  if (!highlightedArea) return false;
  if (highlightedArea.startsWith('search:')) {
    const q = highlightedArea.slice(7).toLowerCase();
    return (
      node.label.toLowerCase().includes(q) ||
      (node.role?.toLowerCase().includes(q) ?? false) ||
      (node.domain?.toLowerCase().includes(q) ?? false)
    );
  }
  return node.area === highlightedArea;
}

function isDimmedNode(node: OrgNode, highlightedArea: string | null | undefined): boolean {
  if (!highlightedArea) return false;
  return !matchesHighlight(node, highlightedArea);
}

function MapView({ data, highlightedArea, onNodeSelect }: {
  data: OrgNode;
  highlightedArea?: string | null;
  onNodeSelect: (node: OrgNode) => void;
}) {
  const leads        = useMemo(() => collectByType(data, 'lead'), [data]);
  const coordinators = useMemo(() => collectByType(data, 'coordinator'), [data]);
  const executives   = useMemo(() => collectByType(data, 'executive'), [data]);

  const coordsByArea = useMemo(() => groupByArea(coordinators), [coordinators]);
  const leadsByArea  = useMemo(() => groupByArea(leads), [leads]);

  const renderSection = (nodes: OrgNode[], cols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', baseDelay = 0) => (
    <div className={`grid gap-3 ${cols}`}>
      {nodes.map((node, i) => (
        <MapCard
          key={node.id}
          node={node}
          index={baseDelay + i}
          onClick={() => onNodeSelect(node)}
          dimmed={isDimmedNode(node, highlightedArea)}
          highlighted={matchesHighlight(node, highlightedArea)}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-10">

      {/* ══ NÍVEL 1 — Liderança Executiva ══════════════════════════════════ */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-medcof-red/10 border border-medcof-red/20">
            <Crown size={12} className="text-medcof-red" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-medcof-red">Liderança Executiva</h3>
          </div>
          <div className="flex-1 h-px bg-medcof-red/15" />
          <span className="text-[10px] text-gray-600 font-medium">{1 + executives.length} pessoas</span>
        </div>
        {renderSection([data, ...executives], 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4')}
      </section>

      {/* ══ NÍVEL 2 — Coordenações ══════════════════════════════════════════ */}
      {coordsByArea.size > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/20">
              <Layers size={12} className="text-sky-400" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-sky-400">Liderança Técnica & Coordenações</h3>
            </div>
            <div className="flex-1 h-px bg-sky-500/15" />
            <span className="text-[10px] text-gray-600 font-medium">{coordinators.length} coordenações</span>
          </div>
          <div className="space-y-5">
            {[...coordsByArea.entries()].map(([area, nodes]) => {
              const meta = AREA_META[area] ?? AREA_META.__mgmt;
              return (
                <div key={`coord-${area}`}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className={`${meta.color} opacity-70`}>{meta.icon}</span>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${meta.color} opacity-70`}>{meta.label}</span>
                    <div className="flex-1 h-px bg-border/30" />
                  </div>
                  {renderSection(nodes, 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3')}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ══ NÍVEL 3 — Squads / Tech Leads ══════════════════════════════════ */}
      {leadsByArea.size > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Code2 size={12} className="text-emerald-400" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Times & Squads</h3>
            </div>
            <div className="flex-1 h-px bg-emerald-500/15" />
            <span className="text-[10px] text-gray-600 font-medium">{leads.length} squads</span>
          </div>
          <div className="space-y-6">
            {[...leadsByArea.entries()].map(([area, nodes]) => {
              const meta = AREA_META[area] ?? AREA_META.__mgmt;
              return (
                <div key={`lead-${area}`}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className={`${meta.color} opacity-70`}>{meta.icon}</span>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${meta.color} opacity-70`}>{meta.label}</span>
                    <div className="flex-1 h-px bg-border/30" />
                    <span className="text-[9px] text-gray-600">{nodes.length} squad{nodes.length !== 1 ? 's' : ''}</span>
                  </div>
                  {renderSection(nodes)}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

/* ─── View: Drilldown ────────────────────────────────────────────────────── */

function DrilldownView({ data, highlightedArea, onNodeSelect }: {
  data: OrgNode;
  highlightedArea?: string | null;
  onNodeSelect: (node: OrgNode) => void;
}) {
  const [stack, setStack] = useState<OrgNode[]>([data]);
  const current = stack[stack.length - 1];
  const currentTheme = getTheme(current);

  const drillInto = (node: OrgNode) => {
    if ((node.children?.length ?? 0) === 0) return;
    setStack(prev => [...prev, node]);
  };

  const goTo = (idx: number) => setStack(prev => prev.slice(0, idx + 1));

  const colClass = useMemo(() => {
    const n = current.children?.length ?? 0;
    if (n <= 2) return 'grid-cols-1 sm:grid-cols-2';
    if (n <= 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  }, [current]);

  return (
    <div className="flex flex-col gap-5">
      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-1 flex-wrap bg-surface/50 border border-border/50 rounded-xl px-3 py-2">
        {stack.map((node, i) => {
          const isLast = i === stack.length - 1;
          return (
            <span key={node.id} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={10} className="text-gray-600" />}
              <button
                onClick={() => !isLast && goTo(i)}
                className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md transition-all
                  ${isLast
                    ? `${currentTheme.accent} cursor-default font-black`
                    : 'text-gray-500 hover:text-foreground hover:bg-surface-hover cursor-pointer rounded-md'}`}
              >
                {i === 0 && <Home size={9} />}
                <span className="max-w-[120px] truncate">{node.label}</span>
              </button>
            </span>
          );
        })}
      </nav>

      {/* ── Nó atual ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id + '-header'}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          className="flex items-center gap-3"
        >
          {stack.length > 1 && (
            <button
              onClick={() => goTo(stack.length - 2)}
              className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center text-gray-400 hover:text-foreground hover:bg-surface-hover transition-all shrink-0"
              title="Voltar"
            >
              <ArrowLeft size={14} />
            </button>
          )}
          <button
            onClick={() => onNodeSelect(current)}
            className={`flex-1 flex items-center gap-3 p-3.5 rounded-2xl border ${currentTheme.border} ${currentTheme.bg} hover:${currentTheme.activeBorder} transition-all group`}
          >
            <Avatar node={current} size="md" />
            <div className="min-w-0 text-left flex-1">
              <p className="font-bold text-sm text-foreground leading-snug">{current.label}</p>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                {current.role && (
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${currentTheme.accent}`}>
                    {current.role}
                  </span>
                )}
                {current.domain && (
                  <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border ${currentTheme.badge}`}>
                    {current.domain}
                  </span>
                )}
              </div>
            </div>
            <span className={`text-[10px] font-bold ${currentTheme.accent} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 shrink-0`}>
              Info <ChevronRight size={10} />
            </span>
          </button>
        </motion.div>
      </AnimatePresence>

      {/* ── Divisor com contagem ── */}
      {(current.children?.length ?? 0) > 0 && (
        <div className="flex items-center gap-3">
          <div className={`flex-1 h-px ${currentTheme.bar} opacity-20`} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${currentTheme.accent}`}>
            {current.children!.length} {current.children!.length === 1 ? 'subordinado' : 'subordinados'}
          </span>
          <div className={`flex-1 h-px ${currentTheme.bar} opacity-20`} />
        </div>
      )}

      {/* ── Filhos ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id + '-children'}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={`grid gap-3 ${colClass}`}
        >
          {current.children?.map(child => {
            const theme = getTheme(child);
            const hasKids = (child.children?.length ?? 0) > 0;
            const highlighted = matchesHighlight(child, highlightedArea);
            const dimmed = isDimmedNode(child, highlightedArea);
            const memberCount = collectLeaves(child).length;

            return (
              <motion.div
                key={child.id}
                layout
                animate={{ opacity: dimmed ? 0.15 : 1, scale: highlighted ? 1.02 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className={`group relative rounded-2xl border transition-all duration-200 overflow-hidden
                  ${highlighted ? `${theme.activeBorder} ${theme.activeBg} shadow-md` : `${theme.border} ${theme.bg} hover:${theme.activeBorder} hover:shadow-sm`}`}
              >
                {/* Barra de cor */}
                <div className={`h-0.5 w-full ${theme.bar} ${highlighted ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'} transition-opacity`} />

                <div className="p-4">
                  {/* Topo: avatar + nome + badge */}
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar node={child} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1.5">
                        <p className="text-sm font-bold text-foreground leading-snug line-clamp-2">{child.label}</p>
                        {child.domain && (
                          <span className={`shrink-0 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border ${theme.badge} mt-0.5`}>
                            {child.domain}
                          </span>
                        )}
                      </div>
                      {child.role && (
                        <p className={`text-[11px] font-semibold ${theme.accent} mt-0.5 leading-none`}>{child.role}</p>
                      )}
                    </div>
                  </div>

                  {/* Rodapé: membros + ações */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-border/30 gap-2">
                    {hasKids ? (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-gray-500 shrink-0">
                        <Users size={10} /> {memberCount}
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-600">Membro</span>
                    )}
                    <div className="flex gap-1.5 ml-auto">
                      <button
                        onClick={() => onNodeSelect(child)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${theme.border} ${theme.accent} hover:bg-surface transition-colors`}
                      >
                        Info
                      </button>
                      {hasKids && (
                        <button
                          onClick={() => drillInto(child)}
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg ${theme.bar} text-white hover:opacity-90 transition-opacity flex items-center gap-0.5`}
                        >
                          Ver time <ChevronRight size={9} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {(!current.children || current.children.length === 0) && (
        <div className="py-10 text-center">
          <p className="text-sm text-gray-500">Nenhum subordinado direto cadastrado.</p>
          {stack.length > 1 && (
            <button
              onClick={() => goTo(stack.length - 2)}
              className="mt-3 text-xs font-semibold text-gray-400 hover:text-foreground transition-colors flex items-center gap-1 mx-auto"
            >
              <ArrowLeft size={11} /> Voltar
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── View: Árvore ───────────────────────────────────────────────────────── */

const TREE_INDENT = 36;
const CONNECTOR_COLOR = 'rgba(255,255,255,0.10)';
const CONNECTOR_ACTIVE = 'rgba(255,255,255,0.22)';

/** Nível de profundidade → rótulo de seção */
const DEPTH_LABEL: Record<number, string> = {
  0: 'CEO',
  1: 'Diretoria & VP',
  2: 'Coordenação & Tech Leads',
  3: 'Times',
};

interface TreeNodeProps {
  node: OrgNode;
  depth?: number;
  isLast?: boolean;
  onSelect: (node: OrgNode) => void;
  highlightedArea?: string | null;
  globalIndex?: number;
  forceExpand?: boolean;
}

function TreeNode({
  node, depth = 0, isLast = true,
  onSelect, highlightedArea,
  globalIndex = 0, forceExpand,
}: TreeNodeProps) {
  const [expanded, setExpanded] = useState(depth <= 1);
  const theme = getTheme(node);
  const hasChildren = (node.children?.length ?? 0) > 0;
  const highlighted = matchesHighlight(node, highlightedArea);
  const dimmed = isDimmedNode(node, highlightedArea);
  const products = node.products ?? [];
  const teamMembers = collectDirectTeam(node);

  const isRoot   = depth === 0;
  const isExec   = node.type === 'executive' || node.type === 'director' || node.type === 'vp';
  const isLead   = node.type === 'lead' || node.type === 'coordinator';
  const isMember = node.type === 'team';

  /* Sincroniza com forceExpand externo */
  useEffect(() => {
    if (forceExpand !== undefined) setExpanded(forceExpand);
  }, [forceExpand]);

  const avatarSize: 'lg' | 'md' | 'sm' = isRoot ? 'lg' : isExec ? 'md' : 'sm';
  const cardPad   = isRoot ? 'p-4' : isExec ? 'p-3.5' : isLead ? 'p-3' : 'py-2 px-3';
  const barH      = isRoot ? 'h-[3px]' : isExec ? 'h-[2px]' : 'h-[1.5px]';
  const nameSize  = isRoot ? 'text-[15px]' : isExec ? 'text-[13px]' : isLead ? 'text-[12px]' : 'text-[11px]';

  /* Cor da linha conectora baseada no tema do pai */
  const connColor = highlighted ? CONNECTOR_ACTIVE : CONNECTOR_COLOR;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: dimmed ? 0.08 : 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(globalIndex * 0.018, 0.4) }}
      className="relative"
    >
      {/* ── Conector em L arredondado ────────────────────────────────────── */}
      {depth > 0 && (
        <svg
          className="absolute pointer-events-none overflow-visible"
          style={{ left: -TREE_INDENT + TREE_INDENT / 2 - 0.5, top: 0 }}
          width={TREE_INDENT / 2 + 4}
          height={32}
          fill="none"
        >
          {/* Linha vertical do pai */}
          {!isLast && (
            <line
              x1="0.5" y1="0" x2="0.5" y2="32"
              stroke={connColor} strokeWidth="1"
            />
          )}
          {/* Curva L */}
          <path
            d={`M 0.5 0 L 0.5 20 Q 0.5 26 6 26 L ${TREE_INDENT / 2 + 3} 26`}
            stroke={connColor} strokeWidth="1"
          />
        </svg>
      )}

      {/* ── Card ─────────────────────────────────────────────────────────── */}
      <div style={{ paddingLeft: depth > 0 ? TREE_INDENT : 0 }} className="mb-1.5">
        <motion.div
          layout="position"
          whileHover={!isMember ? { y: -1 } : {}}
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
          className={`group relative rounded-2xl border backdrop-blur-sm overflow-hidden transition-colors duration-150
            ${highlighted
              ? `${theme.activeBorder} ${theme.activeBg}`
              : `${theme.border} ${theme.bg} hover:${theme.activeBorder}`}`}
          style={
            highlighted
              ? { boxShadow: `0 0 24px ${theme.glowColor}, 0 2px 14px rgba(0,0,0,0.35)` }
              : { boxShadow: '0 1px 5px rgba(0,0,0,0.18)' }
          }
        >
          {/* Barra de cor superior */}
          <div className={`${barH} w-full ${theme.bar} transition-opacity duration-200
            ${highlighted ? 'opacity-100' : 'opacity-20 group-hover:opacity-70'}`} />

          {/* Glow radial interno no hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 50% -10%, ${theme.glowColor} 0%, transparent 65%)` }}
          />

          <div className={`relative flex items-center gap-3 ${cardPad}`}>
            {/* Avatar */}
            <Avatar node={node} size={avatarSize} glow={highlighted} />

            {/* Conteúdo central */}
            <div className="flex-1 min-w-0">
              {/* Nome + badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`font-bold text-foreground leading-snug ${nameSize}`}>
                  {node.label}
                </span>
                {node.domain && (
                  <span className={`shrink-0 text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border ${theme.badge}`}>
                    {node.domain}
                  </span>
                )}
                {node.description && (
                  <span className="shrink-0 text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-400">
                    Co-coord.
                  </span>
                )}
              </div>

              {/* Cargo */}
              {node.role && (
                <p className={`${theme.accent} font-semibold leading-none mt-0.5 ${isRoot ? 'text-[11px]' : 'text-[10px]'}`}>
                  {node.role}
                </p>
              )}

              {/* Produtos */}
              {products.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {products.slice(0, 4).map(p => (
                    <span key={p} className="flex items-center gap-0.5 text-[8px] font-medium px-1.5 py-0.5 rounded-md bg-surface/70 border border-border/40 text-gray-400">
                      <Package size={6} className="shrink-0" /> {p}
                    </span>
                  ))}
                  {products.length > 4 && (
                    <span className="text-[8px] px-1.5 py-0.5 rounded-md bg-surface/70 border border-border/40 text-gray-500">
                      +{products.length - 4}
                    </span>
                  )}
                </div>
              )}

              {/* Mini-avatares do time */}
              {isLead && teamMembers.length > 0 && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="flex -space-x-1.5">
                    {teamMembers.slice(0, 6).map(m => (
                      <div
                        key={m.id}
                        title={m.label}
                        className={`w-[14px] h-[14px] rounded-full bg-gradient-to-br ${avatarGradient(m.label)} flex items-center justify-center text-[5px] font-black text-white ring-1 ring-surface shrink-0`}
                      >
                        {initials(m.label)}
                      </div>
                    ))}
                    {teamMembers.length > 6 && (
                      <div className="w-[14px] h-[14px] rounded-full bg-surface border border-border flex items-center justify-center text-[5px] font-bold text-gray-400 ring-1 ring-surface">
                        +{teamMembers.length - 6}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-gray-500 font-medium">
                    {teamMembers.length} dev{teamMembers.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>

            {/* Ações */}
            <div className="flex items-center gap-1.5 shrink-0">
              {!isMember && (
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={(e) => { e.stopPropagation(); onSelect(node); }}
                  className={`text-[9px] font-bold px-2 py-1 rounded-lg border ${theme.border} ${theme.accent} bg-surface/60 transition-all opacity-0 group-hover:opacity-100`}
                >
                  Info
                </motion.button>
              )}
              {hasChildren && (
                <motion.button
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setExpanded(v => !v)}
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all
                    ${expanded
                      ? `${theme.activeBorder} ${theme.activeBg}`
                      : `${theme.border} bg-surface/30 hover:${theme.activeBg}`}`}
                  title={expanded ? 'Recolher' : `Expandir (${node.children!.length})`}
                >
                  <motion.span
                    animate={{ rotate: expanded ? 90 : 0 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 24 }}
                    className={`${theme.accent} flex items-center`}
                  >
                    <ChevronRight size={11} />
                  </motion.span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Filhos ───────────────────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {expanded && hasChildren && (
          <motion.div
            key="ch"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {/* Wrapper com linha vertical lateral */}
            <div
              className="relative"
              style={{ paddingLeft: TREE_INDENT + (depth === 0 ? 0 : TREE_INDENT) }}
            >
              {/* Linha vertical contínua ao lado dos filhos */}
              <div
                className="absolute top-0 bottom-3 w-px"
                style={{
                  left: TREE_INDENT / 2 - 0.5 + (depth === 0 ? 0 : TREE_INDENT),
                  background: `linear-gradient(to bottom, ${CONNECTOR_ACTIVE}, ${CONNECTOR_COLOR} 80%, transparent)`,
                }}
              />
              {node.children!.map((child, idx) => (
                <TreeNode
                  key={child.id}
                  node={child}
                  depth={depth + 1}
                  isLast={idx === node.children!.length - 1}
                  onSelect={onSelect}
                  highlightedArea={highlightedArea}
                  globalIndex={globalIndex + idx + 1}
                  forceExpand={forceExpand}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TreeView({ data, highlightedArea, onNodeSelect }: {
  data: OrgNode;
  highlightedArea?: string | null;
  onNodeSelect: (node: OrgNode) => void;
}) {
  const [forceExpand, setForceExpand] = useState<boolean | undefined>(undefined);
  const totalNodes = useMemo(() => collectLeaves(data).length, [data]);

  const LEVELS = [
    { label: 'CEO', color: 'bg-medcof-red', dot: 'text-medcof-red' },
    { label: 'Diretoria / VPE', color: 'bg-sky-500', dot: 'text-sky-400' },
    { label: 'Coordenação / Tech Leads', color: 'bg-emerald-500', dot: 'text-emerald-400' },
    { label: 'Devs', color: 'bg-gray-500', dot: 'text-gray-400' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Barra de controles */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Legenda */}
        <div className="flex items-center gap-4 flex-wrap">
          {LEVELS.map(l => (
            <span key={l.label} className="flex items-center gap-1.5 text-[10px] text-gray-500">
              <span className={`w-1.5 h-1.5 rounded-full ${l.color} opacity-75 shrink-0`} />
              {l.label}
            </span>
          ))}
        </div>

        {/* Ações globais */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-600 mr-1">{totalNodes} pessoas</span>
          <button
            onClick={() => setForceExpand(true)}
            className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-border/50 text-gray-400 hover:text-foreground hover:border-border transition-colors bg-surface/50"
          >
            Expandir tudo
          </button>
          <button
            onClick={() => setForceExpand(false)}
            className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-border/50 text-gray-400 hover:text-foreground hover:border-border transition-colors bg-surface/50"
          >
            Recolher tudo
          </button>
        </div>
      </div>

      {/* Separador de nível com rótulo */}
      {Object.entries(DEPTH_LABEL).map(([d, label]) => (
        <div key={d} className="hidden" aria-label={label} />
      ))}

      {/* Árvore */}
      <div className="overflow-x-auto -mx-1 px-1">
        <div className="min-w-[540px]">
          <TreeNode
            node={data}
            depth={0}
            onSelect={onNodeSelect}
            highlightedArea={highlightedArea}
            forceExpand={forceExpand}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── View: Domínios em Colunas ──────────────────────────────────────────── */

interface DomainColumn {
  id: string;
  label: string;
  icon: React.ReactNode;
  accentColor: string;
  borderColor: string;
  bgColor: string;
  glowColor: string;
  nodes: OrgNode[];
}

/** Extrai membros diretos (type=team) de um nó de squad */
function collectDirectTeam(node: OrgNode): OrgNode[] {
  return node.children?.filter(c => c.type === 'team') ?? [];
}

function DomainsView({ data, highlightedArea, onNodeSelect }: {
  data: OrgNode;
  highlightedArea?: string | null;
  onNodeSelect: (node: OrgNode) => void;
}) {
  const executives = useMemo(() => collectByType(data, 'executive'), [data]);
  const leads      = useMemo(() => collectByType(data, 'lead'), [data]);

  const columns: DomainColumn[] = useMemo(() => [
    {
      id: 'lideranca',
      label: 'Liderança',
      icon: <Crown size={13} />,
      accentColor: 'text-medcof-red',
      borderColor: 'border-medcof-red/25',
      bgColor: 'bg-medcof-red/5',
      glowColor: 'rgba(220,38,38,0.12)',
      nodes: [data, ...executives],
    },
    {
      id: 'coordenacao',
      label: 'Coordenação',
      icon: <Cpu size={13} />,
      accentColor: 'text-sky-400',
      borderColor: 'border-sky-500/25',
      bgColor: 'bg-sky-500/5',
      glowColor: 'rgba(14,165,233,0.12)',
      nodes: collectByType(data, 'coordinator'),
    },
    {
      id: 'engenharia',
      label: 'Engenharia',
      icon: <Code2 size={13} />,
      accentColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/25',
      bgColor: 'bg-emerald-500/5',
      glowColor: 'rgba(16,185,129,0.12)',
      nodes: leads.filter(n => n.area === 'engenharia'),
    },
    {
      id: 'suporte-areas',
      label: 'Áreas de Suporte',
      icon: <Layers size={13} />,
      accentColor: 'text-violet-400',
      borderColor: 'border-violet-500/25',
      bgColor: 'bg-violet-500/5',
      glowColor: 'rgba(139,92,246,0.12)',
      nodes: [
        ...leads.filter(n => n.area === 'qa'),
        ...collectByType(data, 'lead').filter(n => ['dados', 'infra', 'design', 'produto'].includes(n.area ?? '')),
      ],
    },
  ], [data, executives, leads]);

  const isMatch = (node: OrgNode) => matchesHighlight(node, highlightedArea);
  const isDimmed = (node: OrgNode) => isDimmedNode(node, highlightedArea);

  return (
    <div className="overflow-x-auto pb-2 -mx-1 px-1">
      <div className="flex gap-4 min-w-[900px]">
        {columns.map((col, colIdx) => (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: colIdx * 0.08, duration: 0.35 }}
            className="flex-1 min-w-0 flex flex-col gap-3"
          >
            {/* Cabeçalho da coluna */}
            <div
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border ${col.borderColor} ${col.bgColor} backdrop-blur-sm sticky top-0 z-10`}
              style={{ boxShadow: `0 4px 20px ${col.glowColor}` }}
            >
              <span className={col.accentColor}>{col.icon}</span>
              <span className={`text-[11px] font-black uppercase tracking-widest ${col.accentColor}`}>{col.label}</span>
              <span className="ml-auto text-[10px] font-bold text-gray-500 bg-surface/60 px-1.5 py-0.5 rounded-md border border-border/40">
                {col.nodes.length}
              </span>
            </div>

            {/* Cards da coluna */}
            <div className="flex flex-col gap-2.5">
              {col.nodes.map((node, i) => {
                const theme = getTheme(node);
                const products = node.products ?? [];
                const teamMembers = collectDirectTeam(node);
                const highlighted = isMatch(node);
                const dimmed = isDimmed(node);

                return (
                  <motion.button
                    key={node.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: dimmed ? 0.12 : 1, x: 0, scale: highlighted ? 1.02 : 1 }}
                    transition={{ delay: colIdx * 0.08 + i * 0.05, duration: 0.3 }}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onNodeSelect(node)}
                    className={`group relative w-full text-left rounded-xl border backdrop-blur-sm overflow-hidden transition-all duration-250 cursor-pointer
                      ${highlighted
                        ? `${theme.activeBorder} ${theme.activeBg}`
                        : `${theme.border} ${theme.bg} hover:${theme.activeBorder}`}`}
                    style={highlighted ? { boxShadow: `0 0 20px ${theme.glowColor}` } : {}}
                  >
                    {/* Barra de cor lateral */}
                    <div className={`absolute left-0 top-0 bottom-0 w-[2px] ${theme.bar} ${highlighted ? 'opacity-80' : 'opacity-20 group-hover:opacity-50'} transition-opacity`} />

                    <div className="pl-3.5 pr-3 py-3">
                      {/* Avatar + Nome + Cargo */}
                      <div className="flex items-center gap-2.5 mb-2">
                        <Avatar node={node} size="sm" glow={highlighted} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-bold text-foreground leading-tight truncate">{node.label}</p>
                          {node.role && (
                            <p className={`text-[10px] font-semibold ${theme.accent} leading-none mt-0.5 truncate`}>{node.role}</p>
                          )}
                        </div>
                        {node.domain && (
                          <span className={`shrink-0 text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${theme.badge}`}>
                            {node.domain}
                          </span>
                        )}
                      </div>

                      {/* Produtos */}
                      {products.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {products.slice(0, 2).map(p => (
                            <span key={p} className="flex items-center gap-0.5 text-[9px] font-medium px-1.5 py-0.5 rounded bg-surface/70 border border-border/40 text-gray-400">
                              <Package size={7} /> {p}
                            </span>
                          ))}
                          {products.length > 2 && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface/70 border border-border/40 text-gray-500">
                              +{products.length - 2}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Time (avatares compactos) */}
                      {teamMembers.length > 0 && (
                        <div className="flex items-center gap-1.5 pt-2 border-t border-border/20">
                          <div className="flex -space-x-1.5">
                            {teamMembers.slice(0, 4).map(m => (
                              <div
                                key={m.id}
                                title={m.label}
                                className={`w-5 h-5 rounded-full bg-gradient-to-br ${avatarGradient(m.label)} flex items-center justify-center text-[7px] font-black text-white ring-1 ring-surface shrink-0`}
                              >
                                {initials(m.label)}
                              </div>
                            ))}
                            {teamMembers.length > 4 && (
                              <div className="w-5 h-5 rounded-full bg-surface border border-border flex items-center justify-center text-[7px] font-bold text-gray-400 ring-1 ring-surface">
                                +{teamMembers.length - 4}
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-500 font-medium">
                            {teamMembers.length} dev{teamMembers.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}

              {col.nodes.length === 0 && (
                <div className="py-6 text-center text-[11px] text-gray-600 border border-dashed border-border/30 rounded-xl">
                  Nenhum membro
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── View: Níveis Hierárquicos ──────────────────────────────────────────── */

interface LevelConfig {
  key: string;
  label: string;
  icon: React.ReactNode;
  accent: string;
  border: string;
  bg: string;
  glow: string;
  bar: string;
  types: OrgNode['type'][];
  /** Se definido, filtra apenas nós dessas áreas */
  areas?: OrgNode['area'][];
  /** Se true, exclui nós com isArea=true */
  excludeAreaNodes?: boolean;
}

const LEVEL_CONFIG: LevelConfig[] = [
  {
    key: 'root',
    label: 'CEO',
    icon: <Crown size={12} />,
    accent: 'text-medcof-red',
    border: 'border-medcof-red/30',
    bg: 'bg-medcof-red/5',
    glow: 'rgba(220,38,38,0.18)',
    bar: 'bg-medcof-red',
    types: ['root'],
  },
  {
    key: 'exec',
    label: 'Diretoria & VPE',
    icon: <Award size={12} />,
    accent: 'text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/5',
    glow: 'rgba(245,158,11,0.15)',
    bar: 'bg-amber-500',
    types: ['executive', 'director', 'vp'],
    excludeAreaNodes: true,
  },
  {
    key: 'coord',
    label: 'Coordenação',
    icon: <Cpu size={12} />,
    accent: 'text-sky-400',
    border: 'border-sky-500/30',
    bg: 'bg-sky-500/5',
    glow: 'rgba(14,165,233,0.15)',
    bar: 'bg-sky-500',
    types: ['coordinator'],
    excludeAreaNodes: true,
  },
  {
    key: 'lead-eng',
    label: 'Tech Leads',
    icon: <Code2 size={12} />,
    accent: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/5',
    glow: 'rgba(16,185,129,0.15)',
    bar: 'bg-emerald-500',
    types: ['lead'],
    areas: ['engenharia'],
  },
  {
    key: 'lead-other',
    label: 'Líderes de Área',
    icon: <Layers size={12} />,
    accent: 'text-violet-400',
    border: 'border-violet-500/30',
    bg: 'bg-violet-500/5',
    glow: 'rgba(139,92,246,0.15)',
    bar: 'bg-violet-500',
    types: ['lead'],
    areas: ['qa', 'produto', 'dados', 'infra', 'design', 'processos', 'suporte'],
  },
  {
    key: 'team',
    label: 'Desenvolvedores & Times',
    icon: <Users size={12} />,
    accent: 'text-gray-400',
    border: 'border-gray-500/20',
    bg: 'bg-gray-500/5',
    glow: 'rgba(107,114,128,0.12)',
    bar: 'bg-gray-500',
    types: ['team'],
  },
];

/** Card para a LevelsView — layout horizontal para líderes, vertical para devs */
function LevelCard({ node, onSelect, highlighted, dimmed, compact = false }: {
  node: OrgNode;
  onSelect: (n: OrgNode) => void;
  highlighted: boolean;
  dimmed: boolean;
  compact?: boolean;
}) {
  const theme = getTheme(node);
  const products = node.products ?? [];

  /* Devs: layout vertical (avatar centralizado + nome embaixo) */
  if (compact) {
    return (
      <motion.button
        layout
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: dimmed ? 0.08 : 1, scale: highlighted ? 1.04 : 1 }}
        whileHover={{ y: -2, scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        onClick={() => onSelect(node)}
        className={`group relative w-full text-center rounded-xl border backdrop-blur-sm overflow-hidden transition-colors duration-150 cursor-pointer
          ${highlighted
            ? `${theme.activeBorder} ${theme.activeBg}`
            : `${theme.border} ${theme.bg} hover:${theme.activeBorder}`}`}
        style={highlighted ? { boxShadow: `0 0 16px ${theme.glowColor}` } : { boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}
      >
        <div className={`h-[1.5px] w-full ${theme.bar} ${highlighted ? 'opacity-100' : 'opacity-15 group-hover:opacity-50'} transition-opacity`} />
        <div className="relative flex flex-col items-center gap-1.5 px-2 py-3">
          <Avatar node={node} size="sm" glow={highlighted} />
          <div className="w-full min-w-0">
            <p className="text-[10px] font-bold text-foreground leading-tight line-clamp-2 text-center">
              {node.label}
            </p>
            {node.role && (
              <p className={`${theme.accent} text-[8px] font-semibold mt-0.5 leading-none text-center`}>
                {node.role}
              </p>
            )}
          </div>
        </div>
      </motion.button>
    );
  }

  /* Líderes: layout horizontal */
  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: dimmed ? 0.08 : 1, scale: highlighted ? 1.03 : 1 }}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      onClick={() => onSelect(node)}
      className={`group relative w-full h-full text-left rounded-xl border backdrop-blur-sm overflow-hidden transition-colors duration-150 cursor-pointer
        ${highlighted
          ? `${theme.activeBorder} ${theme.activeBg}`
          : `${theme.border} ${theme.bg} hover:${theme.activeBorder}`}`}
      style={
        highlighted
          ? { boxShadow: `0 0 20px ${theme.glowColor}, 0 2px 10px rgba(0,0,0,0.3)` }
          : { boxShadow: '0 1px 4px rgba(0,0,0,0.18)' }
      }
    >
      <div className={`h-[2px] w-full ${theme.bar} ${highlighted ? 'opacity-100' : 'opacity-20 group-hover:opacity-60'} transition-opacity`} />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${theme.glowColor} 0%, transparent 70%)` }}
      />
      <div className="relative flex items-start gap-2.5 p-3">
        <div className="shrink-0 mt-0.5">
          <Avatar node={node} size="sm" glow={highlighted} />
        </div>
        <div className="flex-1 min-w-0">
          {/* Nome — quebra em 2 linhas se necessário */}
          <p className="text-[11px] font-bold text-foreground leading-snug line-clamp-2">
            {node.label}
          </p>
          {node.role && (
            <p className={`${theme.accent} font-semibold leading-none mt-0.5 text-[9px]`}>
              {node.role}
            </p>
          )}
          {node.domain && (
            <span className={`inline-block mt-1 text-[6px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${theme.badge}`}>
              {node.domain}
            </span>
          )}
          {node.description && (
            <span className="inline-block mt-1 text-[6px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-400">
              Co-coord.
            </span>
          )}
          {products.length > 0 && (
            <div className="flex flex-wrap gap-0.5 mt-1">
              {products.slice(0, 2).map(p => (
                <span key={p} className="text-[7px] font-medium px-1 py-0.5 rounded bg-surface/70 border border-border/40 text-gray-500">
                  {p}
                </span>
              ))}
              {products.length > 2 && (
                <span className="text-[7px] px-1 py-0.5 rounded bg-surface/70 border border-border/40 text-gray-600">
                  +{products.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}

function LevelsView({ data, highlightedArea, onNodeSelect }: {
  data: OrgNode;
  highlightedArea?: string | null;
  onNodeSelect: (node: OrgNode) => void;
}) {
  const [focusedLevel, setFocusedLevel] = useState<string | null>(null);

  const levelNodes = useMemo(() => {
    const map = new Map<string, OrgNode[]>();
    LEVEL_CONFIG.forEach(lv => {
      if (lv.key === 'root') {
        map.set(lv.key, [data]);
        return;
      }
      let nodes = lv.types.flatMap(t => collectByType(data, t));
      if (lv.excludeAreaNodes) nodes = nodes.filter(n => !n.isArea);
      if (lv.areas)            nodes = nodes.filter(n => lv.areas!.includes(n.area));
      map.set(lv.key, nodes);
    });
    return map;
  }, [data]);

  const totalPeople = useMemo(() => collectLeaves(data).length, [data]);

  return (
    <div className="flex flex-col gap-2">
      {LEVEL_CONFIG.map((lv, lvIdx) => {
        const nodes = levelNodes.get(lv.key) ?? [];
        if (nodes.length === 0) return null;

        const isFocused = focusedLevel === lv.key;
        const isOtherFocused = focusedLevel !== null && !isFocused;

        return (
          <motion.div
            key={lv.key}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: isOtherFocused ? 0.35 : 1, x: 0 }}
            transition={{ delay: lvIdx * 0.06, duration: 0.28 }}
            className="relative"
          >
            {/* Linha conectora entre faixas */}
            {lvIdx > 0 && (
              <div className="flex justify-center mb-0 -mt-0.5 pointer-events-none">
                <div className="w-px h-3 bg-gradient-to-b from-border/40 to-border/10" />
              </div>
            )}

            {/* Faixa do nível */}
            <div
              className={`rounded-2xl border transition-all duration-200 overflow-hidden
                ${isFocused ? `${lv.border} ${lv.bg}` : 'border-border/30 bg-surface/30 hover:border-border/50'}`}
              style={isFocused ? { boxShadow: `0 0 30px ${lv.glow}` } : {}}
            >
              {/* Header da faixa */}
              <button
                onClick={() => setFocusedLevel(isFocused ? null : lv.key)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left group"
              >
                {/* Ícone + label */}
                <div className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border ${lv.border} ${lv.bg}`}>
                  <span className={lv.accent}>{lv.icon}</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${lv.accent}`}>{lv.label}</span>
                </div>

                {/* Barra de progresso visual */}
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-px bg-border/20 relative overflow-hidden rounded-full">
                    <motion.div
                      className={`absolute left-0 top-0 h-full ${lv.bar} opacity-40`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((nodes.length / totalPeople) * 100 * 4, 100)}%` }}
                      transition={{ delay: lvIdx * 0.06 + 0.2, duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                  <span className={`text-[10px] font-bold ${lv.accent} shrink-0`}>{nodes.length}</span>
                </div>

                {/* Chevron */}
                <motion.span
                  animate={{ rotate: isFocused ? 90 : 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                  className="text-gray-600 group-hover:text-gray-400 transition-colors"
                >
                  <ChevronRight size={13} />
                </motion.span>
              </button>

              {/* Grid de cards */}
              <AnimatePresence initial={false}>
                {(isFocused || focusedLevel === null) && (
                  <motion.div
                    key="cards"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className={`px-3 pb-3 grid gap-2 items-stretch
                      ${lv.key === 'root'       ? 'grid-cols-1 max-w-xs mx-auto' : ''}
                      ${lv.key === 'exec'       ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : ''}
                      ${lv.key === 'coord'      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : ''}
                      ${lv.key === 'lead-eng'   ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : ''}
                      ${lv.key === 'lead-other' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : ''}
                      ${lv.key === 'team'       ? 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' : ''}`}
                    >
                      {nodes.map((node, i) => (
                        <motion.div
                          key={node.id}
                          className="h-full"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.02, duration: 0.2 }}
                        >
                          <LevelCard
                            node={node}
                            onSelect={onNodeSelect}
                            highlighted={matchesHighlight(node, highlightedArea)}
                            dimmed={isDimmedNode(node, highlightedArea)}
                            compact={lv.key === 'team'}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Componente principal ───────────────────────────────────────────────── */

export default function OrgChart({ data, highlightedArea, externalSelectedNode, onExternalNodeConsumed }: OrgChartProps) {
  const [view, setView] = useState<'levels' | 'tree' | 'domains' | 'map' | 'drill'>('levels');
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);
  const [drillTarget, setDrillTarget] = useState<OrgNode | null>(null);

  useEffect(() => {
    if (externalSelectedNode) {
      setSelectedNode(externalSelectedNode);
      onExternalNodeConsumed?.();
    }
  }, [externalSelectedNode, onExternalNodeConsumed]);

  const handleSelectFromModal = (node: OrgNode) => {
    setSelectedNode(null);
    setDrillTarget(node);
    setView('drill');
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Toggle de view */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface/80 border border-border/60 backdrop-blur-sm">
          {([
            { id: 'levels',  icon: <Rows3 size={13} />,     label: 'Níveis' },
            { id: 'tree',    icon: <GitBranch size={13} />, label: 'Árvore' },
            { id: 'domains', icon: <Columns3 size={13} />,  label: 'Domínios' },
            { id: 'map',     icon: <LayoutGrid size={13} />, label: 'Mapa' },
            { id: 'drill',   icon: <List size={13} />,      label: 'Hierarquia' },
          ] as const).map(btn => (
            <motion.button
              key={btn.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setView(btn.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200
                ${view === btn.id
                  ? 'bg-medcof-red text-white shadow-[0_0_14px_rgba(220,38,38,0.35)]'
                  : 'text-gray-500 hover:text-foreground hover:bg-surface-hover'}`}
            >
              {btn.icon} {btn.label}
            </motion.button>
          ))}
        </div>
        <p className="text-[11px] text-gray-600 hidden sm:block">
          {view === 'levels'  && 'Faixas por nível — clique numa faixa para focar'}
          {view === 'tree'    && 'Clique em › para expandir ou recolher ramos'}
          {view === 'domains' && 'Visão por domínio — colunas com time e produtos'}
          {view === 'map'     && 'Clique em qualquer card para ver detalhes'}
          {view === 'drill'   && 'Navegue pela hierarquia clicando em Ver time'}
        </p>
      </div>

      {/* Conteúdo da view */}
      <AnimatePresence mode="wait">
        {view === 'levels' && (
          <motion.div key="levels" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <LevelsView data={data} highlightedArea={highlightedArea} onNodeSelect={setSelectedNode} />
          </motion.div>
        )}
        {view === 'tree' && (
          <motion.div key="tree" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <TreeView data={data} highlightedArea={highlightedArea} onNodeSelect={setSelectedNode} />
          </motion.div>
        )}
        {view === 'domains' && (
          <motion.div key="domains" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <DomainsView data={data} highlightedArea={highlightedArea} onNodeSelect={setSelectedNode} />
          </motion.div>
        )}
        {view === 'map' && (
          <motion.div key="map" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <MapView data={data} highlightedArea={highlightedArea} onNodeSelect={setSelectedNode} />
          </motion.div>
        )}
        {view === 'drill' && (
          <motion.div key="drill" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <DrilldownView
              data={drillTarget ?? data}
              highlightedArea={highlightedArea}
              onNodeSelect={setSelectedNode}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal — renderizado via portal no <body> para evitar sobreposição da sidebar */}
      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedNode && (
            <NodeModal
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
              onDrillDown={handleSelectFromModal}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
