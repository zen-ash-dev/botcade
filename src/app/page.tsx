'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import XOGame from '@/components/games/XO';
import Connect4 from '@/components/games/Connect4';
import MemoryMatch from '@/components/games/Memory';
import Sudoku from '@/components/games/Sudoku';
import ChessGame from '@/components/games/ChessGame';
import DailyChallenges from '@/components/DailyChallenges';
import { useProgression } from '@/hooks/useProgression';

type Game = 'xo' | 'connect4' | 'memory' | 'sudoku' | 'chess' | null;

const games = [
  { id: 'xo' as const, name: 'XO', desc: 'Classic Tic Tac Toe with Minimax AI', color: 'text-neon-green', icon: '✕', gradient: 'from-green-500/20 to-transparent' },
  { id: 'connect4' as const, name: 'Connect 4', desc: 'Drop tokens against Alpha-Beta bot', color: 'text-neon-blue', icon: '●', gradient: 'from-blue-500/20 to-transparent' },
  { id: 'memory' as const, name: 'Memory Match', desc: 'Test your recall against the clock', color: 'text-yellow-400', icon: '🧠', gradient: 'from-yellow-500/20 to-transparent' },
  { id: 'sudoku' as const, name: 'Sudoku', desc: 'Fill the grid with backtracking AI', color: 'text-neon-purple', icon: '9', gradient: 'from-purple-500/20 to-transparent' },
  { id: 'chess' as const, name: 'Chess', desc: 'Checkmate with Minimax depth 3', color: 'text-white', icon: '♚', gradient: 'from-white/10 to-transparent' },
];

const gameComponents: Record<string, React.ComponentType> = {
  xo: XOGame,
  connect4: Connect4,
  memory: MemoryMatch,
  sudoku: Sudoku,
  chess: ChessGame,
};

function ScrollText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-30%' });

  return (
    <div ref={ref} className={`scroll-text ${isInView ? 'visible' : ''} ${className}`}>
      {children}
    </div>
  );
}

function AnimatedStat({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const [displayed, setDisplayed] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView || value === 0) return;
    const duration = 1500;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayed(value);
        clearInterval(timer);
      } else {
        setDisplayed(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value, isInView]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-3xl md:text-4xl font-bold text-white">{displayed}{suffix}</div>
      <div className="text-xs text-gray-600 font-body mt-1 tracking-[0.15em] uppercase">{label}</div>
    </div>
  );
}

function TiltCard({
  children,
  className = '',
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouse = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      className={`cursor-pointer transition-transform duration-200 ease-out ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [activeGame, setActiveGame] = useState<Game>(null);
  const { stats } = useProgression();

  if (activeGame) {
    const GameComponent = gameComponents[activeGame];
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full max-w-2xl"
        >
          <button
            onClick={() => setActiveGame(null)}
            className="group mb-6 inline-flex items-center gap-2 text-sm font-body text-gray-600 hover:text-neon-purple-light transition-colors tracking-wider"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            BACK TO ARCADE
          </button>
          <GameComponent />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative px-6 min-h-screen flex items-center justify-center">
        <div className="max-w-6xl mx-auto relative">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple-light text-xs font-body tracking-[0.15em] mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                A I   A R C A D E
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="font-display text-6xl md:text-8xl lg:text-9xl font-black tracking-[0.15em] mb-6 leading-none"
            >
              <span className="hero-gradient">
                BOTCADE
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-gray-600 font-body text-sm md:text-base max-w-xl tracking-[0.15em] leading-relaxed"
            >
              <span className="text-gray-500">P L A Y   F A S T .</span><br />
              <span className="text-gray-600">Intelligent AI opponents. No accounts. No limits.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-10"
            >
              <a
                href="#games"
                className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-neon-purple to-neon-rose text-white font-display text-sm tracking-[0.15em] hover:shadow-lg hover:shadow-neon-purple/30 transition-all duration-300"
              >
                E X P L O R E   G A M E S
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="scroll-section px-6">
        <ScrollText className="text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green text-[10px] font-body tracking-[0.15em] mb-6">
            P H I L O S O P H Y
          </div>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-[0.08em] leading-tight mb-6">
            FUN, FAST,<br />
            <span className="text-neon-purple-light">INTELLIGENT</span>
          </h2>
          <p className="text-gray-600 font-body text-sm md:text-base max-w-2xl mx-auto tracking-wider leading-relaxed">
            Games playable anytime. AI opponents that adapt. A progression system that rewards skill.
          </p>
        </ScrollText>
      </section>

      <section className="scroll-section px-6">
        <ScrollText className="text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-rose/10 border border-neon-rose/20 text-neon-rose text-[10px] font-body tracking-[0.15em] mb-6">
            E X P E R I E N C E
          </div>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-[0.08em] leading-tight mb-6">
            NO WAITING.<br />
            <span className="text-neon-green">NO ACCOUNTS.</span>
          </h2>
          <p className="text-gray-600 font-body text-sm md:text-base max-w-2xl mx-auto tracking-wider leading-relaxed">
            Select a game. Choose difficulty. Play instantly. Your progress saves locally.
          </p>
        </ScrollText>
      </section>

      {stats.wins > 0 && (
        <section className="px-6 mb-16">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20%' }}
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple-light text-[10px] font-body tracking-[0.15em] mb-4">
                  P R O G R E S S
                </div>
                <h2 className="font-display text-2xl text-white tracking-[0.15em]">YOUR ARCADE STATS</h2>
              </div>
              <div className="glass-panel rounded-2xl px-8 py-6 max-w-lg mx-auto">
                <div className="grid grid-cols-3 gap-8">
                  <AnimatedStat value={stats.level} label="Level" />
                  <AnimatedStat value={stats.xp} label="Experience" suffix=" XP" />
                  <AnimatedStat value={stats.wins} label="Victories" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <section id="games" className="px-6 mb-16 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-[10px] font-body tracking-[0.15em] mb-4">
              G A M E S
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-white tracking-[0.15em]">
              S E L E C T   Y O U R   C H A L L E N G E
            </h2>
            <p className="text-gray-600 text-sm font-body mt-3 tracking-wider max-w-xl mx-auto">
              Every game features intelligent AI opponents trained on classic algorithms.
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 max-w-2xl">
              {games.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <TiltCard onClick={() => setActiveGame(game.id)}>
                    <div className="glass-card rounded-2xl p-6 text-left relative overflow-hidden group">
                      <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      <div className="relative">
                        <div className={`text-3xl mb-3 ${game.color}`}>{game.icon}</div>
                        <h3 className="font-display text-lg text-white mb-1.5 tracking-[0.1em]">{game.name}</h3>
                        <p className="text-gray-500 text-xs font-body leading-relaxed">{game.desc}</p>
                        <div className="mt-4 flex items-center gap-1 text-xs font-body text-gray-600 group-hover:text-neon-purple-light transition-colors tracking-wider">
                          PLAY NOW
                          <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>

            <motion.div
              id="challenges"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:self-start lg:sticky lg:top-28"
            >
              <DailyChallenges />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="scroll-section px-6">
        <ScrollText className="text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple-light text-[10px] font-body tracking-[0.15em] mb-6">
            L I M I T S   N O T   F O U N D
          </div>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-[0.08em] leading-tight mb-6">
            MORE GAMES<br />
            <span className="hero-gradient">COMING SOON</span>
          </h2>
          <p className="text-gray-600 font-body text-sm md:text-base max-w-2xl mx-auto tracking-wider leading-relaxed">
            Chess, Sudoku, and more intelligent AI opponents are on the horizon.
          </p>
        </ScrollText>
      </section>
    </div>
  );
}
