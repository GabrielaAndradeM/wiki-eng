'use client';
import { useOnboarding } from '@/context/OnboardingContext';
import { motion } from 'framer-motion';
import { ExternalLink, LinkIcon } from 'lucide-react';

export default function LinksPage() {
  const { activeStep } = useOnboarding();
  const isS7Active = activeStep?.id === 's7';

  const links = [
    { nome: 'Jira Software', icon: '📝', cat: 'Gestão', rel: 'Boards da Engenharia' },
    { nome: 'Slack Eng', icon: '💬', cat: 'Comunicação', rel: '#eng-general' },
    { nome: 'Confluence', icon: '📚', cat: 'Documentos', rel: 'Docs de Arquitetura' },
    { nome: 'Miro', icon: '🗺️', cat: 'Design', rel: 'Mapeamentos e Fluxos' },
    { type: 'divider' },
    { nome: 'Storybook', icon: '🎨', cat: 'Design System', rel: 'Componentes UI v1' },
    { nome: 'Figma', icon: '✨', cat: 'Design System', rel: 'Hand-off de telas' },
    { nome: 'GitHub', icon: '🐙', cat: 'Código', rel: 'Repositórios MedCof' }
  ];

  return (
    <div className={`transition-all duration-700 max-w-7xl mx-auto pb-20 ${isS7Active ? 'p-8 sm:p-12 rounded-[3rem] bg-medcof-red/[0.03] ring-4 ring-medcof-red/20 ring-offset-8 shadow-inner mt-6' : ''}`}>
      
      {/* Universal MedCof Header Pattern */}
      <div className="mb-14 border-b border-border pb-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-medcof-red/10 text-medcof-red text-xs font-extrabold uppercase tracking-widest border border-medcof-red/20 shadow-sm mb-6">
            <LinkIcon size={12} strokeWidth={3} /> Resources 
          </div>
          <h1 className="text-5xl font-black mb-4 text-foreground tracking-tighter leading-tight">
            Diretório de <span className="text-transparent bg-clip-text bg-gradient-to-r from-medcof-red to-orange-500">Links</span>
          </h1>
          <p className="text-gray-500 text-lg font-medium leading-relaxed">
            Acesso rápido aos principais sistemas, ferramentas e boards da engenharia. Centralize seu setup em um único lugar.
          </p>
        </div>
      </div>
      
      {isS7Active && (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-4 bg-medcof-red/10 border border-medcof-red/20 text-medcof-red font-bold rounded-2xl flex items-center gap-3 text-center justify-center animate-pulse"
        >
            👉 Passo 7 Final: Salve estes links nos seus favoritos e marque como concluído! 🏆
        </motion.div>
      )}

      {/* Grid container to match "Times" list feel */}
      <div className={`bg-surface border divide-y divide-border rounded-[2rem] overflow-hidden shadow-soft max-w-5xl ${isS7Active ? 'border-medcof-red/40' : 'border-border'}`}>
        {links.map((l, i) => l.type === 'divider' ? (
          <div key={i} className="bg-gray-50/50 dark:bg-gray-800/20 px-8 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400">
             Ecossistema de Design & Código
          </div>
        ) : (
          <a 
            key={i} 
            href="#" 
            className="flex gap-6 items-center p-6 sm:p-8 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-all group relative"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-medcof-red scale-y-0 group-hover:scale-y-100 transition-transform origin-center"></div>
            
            <div className="text-3xl bg-gray-50 dark:bg-gray-800/50 w-16 h-16 rounded-2xl flex items-center justify-center border border-border group-hover:border-medcof-red/50 group-hover:bg-medcof-red/10 transition-all shadow-inner shrink-0 group-hover:shadow-soft">
              {l.icon}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                 <h3 className="font-extrabold text-2xl text-foreground group-hover:text-medcof-red transition-colors tracking-tight">{l.nome}</h3>
                 <ExternalLink size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
              </div>
              <p className="text-[15px] text-gray-500 font-medium group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors uppercase tracking-tight opacity-80">{l.rel}</p>
            </div>
            
            <div className="hidden sm:block text-[11px] bg-gray-100 dark:bg-gray-800/80 border border-border px-5 py-2 rounded-xl text-gray-500 font-black uppercase tracking-widest group-hover:bg-medcof-red group-hover:text-white group-hover:border-medcof-red transition-all shadow-sm">
              {l.cat}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
