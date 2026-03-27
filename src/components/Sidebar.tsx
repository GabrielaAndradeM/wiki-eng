'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Users, Workflow, UserCog, Route, Layers,
  Settings2, CalendarDays, Cake, SquareKanban, LinkIcon,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Times', href: '/times', icon: Users },
  { name: 'Organograma', href: '/organograma', icon: Workflow },
  { name: 'Tech Leads', href: '/tech-leads', icon: UserCog },
  { name: 'Processos Ágeis', href: '/processos', icon: Route },
  { name: 'Fluxos', href: '/fluxos', icon: Layers },
  { name: 'Áreas Técnicas', href: '/areas', icon: Settings2 },
  { name: 'Agendas & Rituais', href: '/rituais', icon: CalendarDays },
  { name: 'Aniversariantes', href: '/aniversarios', icon: Cake },
  { name: 'Tipos de Cards', href: '/cards', icon: SquareKanban },
  { name: 'Links', href: '/links', icon: LinkIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Responsive Auto-Collapse
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize(); // Init on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="bg-surface border-r border-border flex flex-col h-screen sticky top-0 shadow-lg z-20 overflow-hidden shrink-0"
    >
      {/* Header com Logo Animado e Centralizado */}
      <div className={`border-b border-border flex items-center h-20 w-full px-4 ${isCollapsed ? 'justify-center p-0' : 'justify-between px-6'}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} w-full overflow-hidden shrink-0`}>
          <motion.div
            onClick={() => setIsCollapsed(!isCollapsed)}
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-10 h-10 rounded-xl bg-medcof-red flex items-center justify-center font-black text-white shadow-lg shadow-medcof-red/40 cursor-pointer shrink-0 z-50`}
          >
            M
          </motion.div>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-black text-xl tracking-tighter text-foreground whitespace-nowrap overflow-hidden"
              >
                Wiki<span className="text-medcof-red">Eng</span>
              </motion.span>
            )}
          </AnimatePresence>


        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto pt-6 px-4 flex flex-col gap-1 hide-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.name : ''}
              className={`relative flex items-center gap-4 px-3.5 py-3 rounded-xl text-[15px] font-bold transition-all z-10 group
                ${isCollapsed ? 'justify-center' : ''}
                ${isActive ? 'text-medcof-red' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-foreground'}`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-sidebar"
                  className="absolute inset-0 bg-medcof-hover rounded-xl -z-10 border border-medcof-red/20 shadow-sm"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon size={20} className={`shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-medcof-red' : 'text-gray-400'}`} />

              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="whitespace-nowrap overflow-hidden tracking-tight"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Footer Branding */}
      <div className={`p-6 border-t border-border mt-auto flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between'}`}>
        {!isCollapsed ? (
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Engenharia v2.0</span>
            <span className="text-xs font-bold text-foreground">MedCof Engine</span>
          </div>
        ) : (
          <div className="text-[10px] font-black text-medcof-red">v2</div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </motion.div>
  );
}
