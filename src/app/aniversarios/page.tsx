'use client';
import { useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Cake, PartyPopper, Gift, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

/* ─── Dados ─────────────────────────────────────────────────────────────── */

interface Pessoa {
  nome: string;
  /** DD/MM */
  data: string;
}

const PESSOAS: Pessoa[] = [
  // Janeiro
  { nome: 'Matheus Fernandes Pinho',        data: '10/01' },
  { nome: 'Vinicius Henrique Abdon Alves',  data: '31/01' },
  // Fevereiro
  { nome: 'Daniel Brandão Bezerra',         data: '01/02' },
  { nome: 'Érika Laís da Silva',            data: '02/02' },
  { nome: 'Felipi Estevão Matos da Trindade', data: '04/02' },
  { nome: 'Gabriela Andrade Dias',          data: '19/02' },
  { nome: 'Pedro Henrique Miotto Ramos',    data: '28/02' },
  // Março
  { nome: 'Vitor Ferraz Maciel',            data: '11/03' },
  { nome: 'Pilar Beatriz',                  data: '25/03' },
  { nome: 'Leonardo Emiliano dos Reis',     data: '28/03' },
  { nome: 'Rogério Alves',                  data: '28/03' },
  { nome: 'Cesar Henrique Vito Bueno',      data: '31/03' },
  { nome: 'Igor Henrique de Souza Tieso',   data: '31/03' },
  // Abril
  { nome: 'Wellington Gustavo Santos',      data: '01/04' },
  { nome: 'Pedro Yago Gomes Silva',         data: '04/04' },
  { nome: 'Yago Luiz Militão',              data: '04/04' },
  { nome: 'Carla Silveira Costantino',      data: '10/04' },
  { nome: 'Vinicius Ferrari Selvino Ladeira', data: '16/04' },
  { nome: 'Jose Machado de Campos Neto',    data: '17/04' },
  { nome: 'Bruno Faria Pacheco de Mello',   data: '19/04' },
  { nome: 'João Eduardo Gomes',             data: '21/04' },
  { nome: 'Rafael Ornelas',                 data: '21/04' },
  { nome: 'Roberto Pereira de Souza Neto',  data: '30/04' },
  // Maio
  { nome: 'Leonardo Feres Rosin',           data: '03/05' },
  { nome: 'Yasmin Danielli Sampaio',        data: '03/05' },
  { nome: 'Raquel Madruga Omegna de Moraes', data: '11/05' },
  { nome: 'Yuri Muniz Gonzalez',            data: '31/05' },
  // Junho
  { nome: 'Yasmin Coelho Ramos',            data: '11/06' },
  { nome: 'Juan Matheus Moreira Amaral',    data: '16/06' },
  { nome: 'Luis Henirque Gonçalves Angelim', data: '26/06' },
  // Julho
  { nome: 'João Vitor Fernandes de Souza',  data: '02/07' },
  { nome: 'Bruno Ricardo Coutinho Buzzo',   data: '06/07' },
  { nome: 'Pablo Leonardo dos Reis',        data: '08/07' },
  { nome: 'Gabriel Fidel Bononi',           data: '12/07' },
  { nome: 'Henrique Bissoli Silva',         data: '14/07' },
  { nome: 'Luca Gonzalez Watson',           data: '15/07' },
  { nome: 'Jonatas Figueiroba da Rocha',    data: '26/07' },
  // Agosto
  { nome: 'Willian da Silva Bresciani',     data: '02/08' },
  { nome: 'André Macedo Rodrigues',         data: '11/08' },
  { nome: 'Victor Thadeu Santos Marciano',  data: '12/08' },
  { nome: 'Nathan Henrique Dias Ferraz',    data: '19/08' },
  { nome: 'Gabriel Henrique da Silva',      data: '21/08' },
  { nome: 'Jean Bernardo Silva',            data: '22/08' },
  { nome: 'Anderson Moraes dos Santos',     data: '23/08' },
  { nome: 'Pedro Henrique dos Santos Pinheiro', data: '23/08' },
  { nome: 'Thais Narumi Tanizaki',          data: '26/08' },
  // Setembro
  { nome: 'Bruno Coimbra de Oliveira',      data: '13/09' },
  { nome: 'Jonata Souza e Lima',            data: '13/09' },
  { nome: 'Gabriel Lopes de Paula',         data: '17/09' },
  { nome: 'Maria Vitória Jarzinski Oliveira', data: '21/09' },
  { nome: 'Victor da Silva Martins',        data: '26/09' },
  { nome: 'Ravel Sbrissa Okada',            data: '27/09' },
  // Outubro
  { nome: 'Leonardo Torres Branco',         data: '01/10' },
  { nome: 'Mário Gomes Ramos Loureiro',     data: '01/10' },
  { nome: 'Alex Matsumoto Kaneshigue Junior', data: '06/10' },
  { nome: 'Luiz Gustavo Nascimento dos Santos', data: '17/10' },
  { nome: 'Juliano Augusto Torquato de Souza', data: '26/10' },
  { nome: 'Elvis Henrique Tavernari da Silva', data: '29/10' },
  { nome: 'Guilherme Pereira Lopes',        data: '29/10' },
  { nome: 'Eduardo de Oliveira Bombarda',   data: '30/10' },
  { nome: 'Rafael Bombarda Oda',            data: '30/10' },
  // Novembro
  { nome: 'Bernard Ferreira Ladeia Almeida', data: '06/11' },
  { nome: 'Leonardo Queiroz de Oliveira',   data: '06/11' },
  { nome: 'Gabriel Tarrafa Hirayama',       data: '13/11' },
  { nome: 'Vinícius de Assis Azevedo',      data: '18/11' },
  { nome: 'Thiago Ryuiti Ito',              data: '19/11' },
  { nome: 'André Pires Faria de Oliveira',  data: '21/11' },
  { nome: 'Matheus Jimenez Falzetta',       data: '22/11' },
  { nome: 'Giordano Mendes Bueno',          data: '23/11' },
  { nome: 'Alisson Desandro Bovenzo',       data: '26/11' },
  { nome: 'Douglas Scola Lopes',            data: '29/11' },
  // Dezembro
  { nome: 'Albert Siqueira Cosme Emidio',   data: '02/12' },
  { nome: 'Felipe Galdino Porcelli',        data: '07/12' },
  { nome: 'Rafael Trevisan',                data: '09/12' },
  { nome: 'Vinicius Cézar de Oliveira',     data: '21/12' },
  { nome: 'Tabacha Macedo de Paula',        data: '31/12' },
];

const MESES = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
];

/** Paleta de cores para avatares — determinística pelo índice do nome */
const AVATAR_COLORS = [
  'from-rose-400 to-pink-600',
  'from-orange-400 to-red-500',
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-teal-600',
  'from-sky-400 to-blue-600',
  'from-violet-400 to-purple-600',
  'from-fuchsia-400 to-pink-600',
  'from-cyan-400 to-sky-600',
];

/** Retorna as iniciais (até 2 letras) de um nome completo */
function initials(nome: string): string {
  const parts = nome.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Cor do avatar baseada na soma dos char codes do nome */
function avatarColor(nome: string): string {
  const sum = nome.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

/* ─── Animações ─────────────────────────────────────────────────────────── */

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

/* ─── Componente ─────────────────────────────────────────────────────────── */

export default function AniversariosPage() {
  const hoje = new Date();
  const mesAtual = hoje.getMonth(); // 0-indexed
  const diaAtual = hoje.getDate();
  const mesAtualStr = String(mesAtual + 1).padStart(2, '0');
  const diaAtualStr = String(diaAtual).padStart(2, '0');
  const dataHoje = `${diaAtualStr}/${mesAtualStr}`;

  /** Agrupa pessoas por mês, ordenadas por dia */
  const porMes = useMemo(() => {
    return MESES.map((nome, idx) => {
      const mm = String(idx + 1).padStart(2, '0');
      const pessoas = PESSOAS
        .filter(p => p.data.split('/')[1] === mm)
        .sort((a, b) => parseInt(a.data) - parseInt(b.data));
      return { nome, mm, pessoas };
    });
  }, []);

  const totalPessoas = PESSOAS.length;
  const aniversariantesHoje = PESSOAS.filter(p => p.data === dataHoje);
  const pessoasNoMesAtual = porMes[mesAtual].pessoas.length;

  /** Dispara confetti a partir do ponto clicado */
  function handleCelebrate(e: React.MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    confetti({
      particleCount: 60,
      spread: 55,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
      colors: ['#E3000F', '#FFD700', '#ffffff', '#4ade80', '#60a5fa'],
      zIndex: 200,
    });
  }

  return (
    <div className="mx-auto max-w-5xl pb-24">

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-medcof-red via-rose-600 to-orange-500 p-8 shadow-hover sm:p-12"
      >
        {/* Decoração */}
        <div className="pointer-events-none absolute -right-8 -top-8 rotate-12 opacity-10">
          <PartyPopper size={260} />
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-black/20 to-transparent" />

        <div className="relative z-10 text-white">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest backdrop-blur-sm">
            <Cake size={13} /> Celebration Board
          </span>

          <h1 className="mb-3 text-4xl font-black tracking-tight drop-shadow-sm sm:text-5xl">
            Aniversariantes MedCof
          </h1>
          <p className="mb-8 max-w-lg text-base font-medium leading-relaxed text-white/80">
            Celebre quem constrói essa engenharia com você. Nunca perca uma data especial.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-4">
            {[
              { value: String(totalPessoas), label: 'colaboradores' },
              { value: String(pessoasNoMesAtual), label: `em ${MESES[mesAtual]}` },
              { value: String(aniversariantesHoje.length || '—'), label: 'hoje' },
            ].map(({ value, label }) => (
              <div key={label} className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm">
                <div className="text-2xl font-black">{value}</div>
                <div className="text-xs font-semibold uppercase tracking-wider text-white/70">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Banner "Hoje é aniversário de…" ─────────────────────────────── */}
      {aniversariantesHoje.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-amber-400/40 bg-amber-400/10 px-5 py-4"
        >
          <Sparkles size={18} className="shrink-0 text-amber-500" />
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
            <span className="font-black">Hoje é aniversário de </span>
            {aniversariantesHoje.map(p => p.nome).join(' e ')}! 🎉
          </p>
        </motion.div>
      )}

      {/* ── Grade de Meses ───────────────────────────────────────────────── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-12"
      >
        {porMes.map(({ nome: mesNome, mm, pessoas }, mesIdx) => {
          if (pessoas.length === 0) return null;

          const isCurrentMonth = mesIdx === mesAtual;

          return (
            <motion.section key={mm} variants={cardVariant}>
              {/* Cabeçalho do mês */}
              <div className={`sticky top-0 z-20 mb-5 flex items-center gap-3 border-b py-3 backdrop-blur-md ${
                isCurrentMonth
                  ? 'border-medcof-red/30 bg-background/90'
                  : 'border-border bg-background/80'
              }`}>
                <h2 className={`text-xl font-black tracking-tight ${
                  isCurrentMonth
                    ? 'bg-gradient-to-r from-medcof-red to-orange-500 bg-clip-text text-transparent'
                    : 'text-foreground'
                }`}>
                  {mesNome}
                </h2>
                {isCurrentMonth && (
                  <span className="rounded-full bg-medcof-red px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                    Mês atual
                  </span>
                )}
                <div className="h-px flex-1 bg-border" />
                <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-bold text-gray-500">
                  {pessoas.length} {pessoas.length === 1 ? 'pessoa' : 'pessoas'}
                </span>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {pessoas.map((pessoa) => {
                  const isToday = pessoa.data === dataHoje;
                  const dia = pessoa.data.split('/')[0];
                  const color = avatarColor(pessoa.nome);
                  const ini = initials(pessoa.nome);

                  return (
                    <motion.button
                      key={`${pessoa.nome}-${pessoa.data}`}
                      onClick={handleCelebrate}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      className={`group relative w-full cursor-pointer overflow-hidden rounded-2xl border bg-surface p-4 text-left shadow-sm transition-all duration-200 hover:shadow-hover ${
                        isToday
                          ? 'border-amber-400/60 bg-amber-400/5 dark:bg-amber-400/8'
                          : 'border-border hover:border-medcof-red/35'
                      }`}
                    >
                      {/* Badge "Hoje!" */}
                      {isToday && (
                        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black text-amber-900">
                          🎉 Hoje!
                        </span>
                      )}

                      {/* Data ribbon */}
                      {!isToday && (
                        <div className="absolute right-0 top-0 rounded-bl-xl bg-medcof-red px-2.5 py-1 text-xs font-black text-white shadow-sm transition-colors group-hover:bg-medcof-darkRed">
                          {dia}
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${color} text-sm font-black text-white shadow-sm`}>
                          {ini}
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1 pr-6">
                          <p className="truncate text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-medcof-red">
                            {pessoa.nome}
                          </p>
                          <p className="mt-0.5 text-xs font-medium text-gray-500">
                            {pessoa.data.replace('/', ' de ').replace('/', '')} 
                            {' '}· {MESES[parseInt(mm) - 1]}
                          </p>
                        </div>
                      </div>

                      {/* Hover CTA */}
                      <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-gray-400 opacity-0 transition-all duration-200 group-hover:text-medcof-red group-hover:opacity-100">
                        <Gift size={12} /> Clique para celebrar
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.section>
          );
        })}
      </motion.div>
    </div>
  );
}
