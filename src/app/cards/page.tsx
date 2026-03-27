'use client';
import { motion } from 'framer-motion';
import { 
  Rocket, BookOpen, CheckCircle2, Bug, Search, 
  Lightbulb, SquareStack, Target, Fingerprint 
} from 'lucide-react';

export default function CardsPage() {
  const cards = [
    { 
      tipo: 'Feature', 
      Icon: Rocket, 
      color: 'blue', 
      colorClasses: 'bg-blue-500/10 text-blue-500 border-blue-500/20', 
      desc: 'Nova funcionalidade de negócio que gera valor direto ao produto. Ex: "Cadastro de cartão de crédito".' 
    },
    { 
      tipo: 'User Story (História)', 
      Icon: BookOpen, 
      color: 'purple', 
      colorClasses: 'bg-purple-500/10 text-purple-500 border-purple-500/20', 
      desc: 'Narrativa do usuário gerando valor incremental. Ex: "Como usuário, quero logar para ver meus cursos..."' 
    },
    { 
      tipo: 'Task', 
      Icon: CheckCircle2, 
      color: 'green', 
      colorClasses: 'bg-green-500/10 text-green-500 border-green-500/20', 
      desc: 'Tarefa técnica necessária mas sem valor tangível imediato ao usuário final. Ex: "Configurar CI/CD".' 
    },
    { 
      tipo: 'Bug', 
      Icon: Bug, 
      color: 'red', 
      colorClasses: 'bg-red-500/10 text-red-500 border-red-500/20', 
      desc: 'Falha ou comportamento inesperado no sistema em produção relatado por cliente ou N2.' 
    },
    { 
      tipo: 'Sub-bug', 
      Icon: Search, 
      color: 'orange', 
      colorClasses: 'bg-orange-500/10 text-orange-500 border-orange-500/20', 
      desc: 'Bug impeditivo encontrado durante o desenvolvimento ou QA de uma história atual.' 
    },
    { 
      tipo: 'Débito Técnico', 
      Icon: Lightbulb, 
      color: 'yellow', 
      colorClasses: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-500', 
      desc: 'Refatoração necessária para saúde do código ou atualização de dependências obsoletas.' 
    }
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20 transition-all duration-700">
      
      {/* Universal MedCof Header Pattern */}
      <div className="mb-14 border-b border-border pb-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-medcof-red/10 text-medcof-red text-xs font-extrabold uppercase tracking-widest border border-medcof-red/20 shadow-sm mb-6">
            <SquareStack size={12} strokeWidth={3} /> Agile Standards 
          </div>
          <h1 className="text-5xl font-black mb-4 text-foreground tracking-tighter leading-tight">
            Tipos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-medcof-red to-orange-500">Cards</span>
          </h1>
          <p className="text-gray-500 text-lg font-medium leading-relaxed">
            Glossário técnico de tipos de issues no Jira. Entenda a aplicação correta de cada nomenclatura para garantir uma esteira de entrega limpa e monitorável.
          </p>
        </div>
      </div>
      
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ translateY: -5 }}
            className={`p-8 rounded-[2.5rem] border ${c.colorClasses} flex flex-col gap-6 backdrop-blur-sm group relative overflow-hidden transition-all duration-300 shadow-soft hover:shadow-xl`}
          >
            {/* Massive faded background logo */}
            <div className={`absolute -right-8 -top-8 opacity-[0.05] group-hover:opacity-[0.1] transition-all duration-500 group-hover:rotate-12`}>
               <c.Icon size={180} strokeWidth={1} />
            </div>

            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-900 border border-current/20 flex items-center justify-center shadow-sm relative z-10">
              <c.Icon size={26} strokeWidth={2.5} />
            </div>
            
            <div className="relative z-10">
              <h3 className="font-black text-2xl mb-3 tracking-tighter uppercase">{c.tipo}</h3>
              <p className="text-[15px] font-bold opacity-80 leading-relaxed">{c.desc}</p>
            </div>

            <div className="mt-auto pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest relative z-10 italic opacity-60">
               <Target size={12} /> Jira Engineering Standard
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 p-8 border border-dashed border-border rounded-3xl text-center bg-gray-50/10">
         <p className="text-gray-400 font-bold text-sm tracking-tight flex items-center justify-center gap-2">
            <Fingerprint size={14} /> MedCof Engenharia | Atualizado continuamente pelos Tech Leads
         </p>
      </div>
    </div>
  );
}
