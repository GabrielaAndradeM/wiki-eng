'use client';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Users, LinkIcon, Workflow, ArrowRight, BookOpen, Fingerprint } from 'lucide-react';
import { useOnboarding } from '@/context/OnboardingContext';

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Home() {
  const { activeStep } = useOnboarding();
  const isS1Active = activeStep?.id === 's1';

  return (
    <motion.div 
      className="flex flex-col gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      
      {isS1Active && (
        <motion.div
          variants={item}
          className="flex items-center gap-3 rounded-2xl border border-medcof-red/30 bg-medcof-red/8 px-5 py-3.5"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-medcof-red text-white text-xs font-black">1</span>
          <p className="text-sm font-semibold text-medcof-red">
            Passo 1 do Onboarding — leia nossa visão e navegue pelo painel abaixo.
          </p>
        </motion.div>
      )}

      {/* Hero Banner */}
      <motion.div
        variants={item}
        className={`group relative w-full overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-[0_4px_40px_-14px_rgba(0,0,0,0.08)] transition-all duration-500 dark:border-white/10 dark:from-[#0c0e12] dark:via-[#12151c] dark:to-[#1a1f2a] dark:shadow-[0_12px_48px_-12px_rgba(0,0,0,0.55)] ${
          isS1Active ? 'ring-4 ring-medcof-red ring-offset-4 ring-offset-background shadow-hover dark:ring-offset-[#0b0c10]' : ''
        }`}
      >
        {/* Camadas decorativas */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.4] dark:hidden"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.055) 1px, transparent 1px)`,
              backgroundSize: '28px 28px',
            }}
          />
          <div
            className="absolute inset-0 hidden opacity-[0.28] dark:block"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }}
          />
          <div className="absolute -top-[30%] right-[5%] h-[500px] w-[500px] rounded-full bg-medcof-red/10 blur-[110px] transition-colors duration-1000 group-hover:bg-medcof-red/16 dark:bg-medcof-red/18 dark:group-hover:bg-medcof-red/26" />
          <div className="absolute -bottom-[30%] -left-[8%] h-[360px] w-[360px] rounded-full bg-orange-500/10 blur-[90px] dark:bg-orange-500/14" />
        </div>

        {/* Conteúdo */}
        <div className="relative z-10 px-10 py-12 md:px-14 md:py-14 lg:px-16 lg:py-16">

          {/* Badge */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-medcof-red/30 bg-medcof-red/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-medcof-red shadow-sm dark:border-medcof-red/40 dark:bg-medcof-red/15 dark:text-medcof-lightRed">
              <Fingerprint size={12} strokeWidth={2.5} /> Engenharia v2.0
            </span>
          </div>

          {/* Título */}
          <h1 className="mb-5 max-w-2xl text-4xl font-black leading-[1.06] tracking-tighter text-gray-900 dark:text-white sm:text-5xl md:text-[3.25rem] lg:text-6xl">
            Hub Central da{' '}
            <span className="block bg-gradient-to-r from-medcof-red via-medcof-lightRed to-orange-400 bg-clip-text text-transparent">
              Engenharia MedCof
            </span>
          </h1>

          {/* Descrição */}
          <p className="mb-8 max-w-xl text-[1.0625rem] font-medium leading-relaxed text-gray-600 dark:text-gray-300 md:mb-10">
            Sua navegação master para a cultura de desenvolvimento corporativa.
            Acesse a topografia dos nossos Squads, identifique lideranças e domine nossas esteiras ágeis.
          </p>

          {/* CTAs */}
          <div className="mb-10 flex flex-wrap gap-3 md:gap-4">
            <Link
              href="/times"
              className="inline-flex items-center gap-2 rounded-xl bg-medcof-red px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-medcof-red/30 transition hover:bg-medcof-darkRed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-medcof-red md:px-8 md:py-4"
            >
              Conhecer Times <ArrowRight size={17} aria-hidden />
            </Link>
            <Link
              href="/processos"
              className="inline-flex items-center rounded-xl border-2 border-gray-300 bg-white/80 px-7 py-3.5 text-base font-bold text-gray-800 backdrop-blur-sm transition hover:border-gray-400 hover:bg-white dark:border-white/20 dark:bg-white/8 dark:text-white dark:hover:border-white/35 dark:hover:bg-white/14 md:px-8 md:py-4"
            >
              Nossos Processos
            </Link>
          </div>

          {/* Stats inline */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-gray-200/60 pt-6 dark:border-white/10">
            {[
              { value: '7', label: 'Squads ativos' },
              { value: '10+', label: 'Tech Leads' },
              { value: '5', label: 'Rituais ágeis' },
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

      {/* Bento Grid — Acesso Rápido */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5">
        {[
          {
            href: '/times',
            icon: Users,
            title: 'Squads & Pessoas',
            desc: 'Conheça a composição de cada tribo, quem está no comando e onde os times atuam tecnicamente.',
            DecorIcon: Users,
          },
          {
            href: '/organograma',
            icon: Workflow,
            title: 'Visão Top-Down',
            desc: 'Visualize o organograma completo da Diretoria de Engenharia em formato de mapa mental interativo.',
            DecorIcon: Workflow,
          },
          {
            href: '/links',
            icon: LinkIcon,
            title: 'Setup & Ferramentas',
            desc: 'Diretório mestre com todos os links vitais: Jira, Figma, Storybook e canais centrais de código.',
            DecorIcon: BookOpen,
          },
        ].map(({ href, icon: Icon, title, desc, DecorIcon }) => (
          <Link key={href} href={href} className="group block outline-none">
            <motion.div
              variants={item}
              className="relative h-full overflow-hidden rounded-2xl border border-border bg-surface p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-medcof-red/35 hover:bg-medcof-red/[0.03] hover:shadow-hover focus-within:ring-2 focus-within:ring-medcof-red/40"
            >
              <div className="pointer-events-none absolute right-[-16px] top-[-16px] opacity-[0.035] transition-opacity duration-300 group-hover:opacity-[0.065]">
                <DecorIcon size={160} strokeWidth={1} />
              </div>

              <div className="relative z-10 mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-gray-400 transition-colors duration-300 group-hover:border-medcof-red/30 group-hover:bg-medcof-red/5 group-hover:text-medcof-red">
                <Icon size={20} strokeWidth={2} />
              </div>

              <h2 className="relative z-10 mb-2 text-lg font-bold tracking-tight text-foreground">{title}</h2>
              <p className="relative z-10 text-sm font-medium leading-relaxed text-gray-500">{desc}</p>

              <div className="relative z-10 mt-5 flex items-center gap-1 text-xs font-bold text-gray-400 transition-colors duration-300 group-hover:text-medcof-red">
                Acessar <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
