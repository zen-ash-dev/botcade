'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useProgression } from '@/hooks/useProgression';

const games = [
  { id: 'xo', name: 'XO', desc: 'Classic Tic Tac Toe with Minimax AI', icon: '✕', cover: 'bg-gradient-to-br from-neutral-900 to-black' },
  { id: 'connect4', name: 'Connect 4', desc: 'Drop tokens against Alpha-Beta bot', icon: '●', cover: 'bg-gradient-to-br from-neutral-900 to-black' },
  { id: 'memory', name: 'Memory Match', desc: 'Test your recall against the clock', icon: '🧠', cover: 'bg-gradient-to-br from-neutral-900 to-black' },
  { id: 'sudoku', name: 'Sudoku', desc: 'Fill the grid with backtracking AI', icon: '9', cover: 'bg-gradient-to-br from-neutral-900 to-black' },
  { id: 'chess', name: 'Chess', desc: 'Checkmate with Minimax depth 3', icon: '♚', cover: 'bg-gradient-to-br from-neutral-900 to-black' },
];

const categories = [
  { title: 'Strategy Games', desc: 'Chess & Connect 4 — deep tactical play against adaptive AI opponents that challenge your foresight at every turn.' },
  { title: 'Casual & Party', desc: 'Memory Match & XO — quick, accessible fun with surprising strategic depth beneath the surface.' },
  { title: 'Logic Puzzles', desc: 'Sudoku — number placement with backtracking AI that generates unique puzzles at any difficulty level.' },
  { title: 'Classic Arcade', desc: 'All games reimagined with intelligent AI. No accounts, no ads, no tracking — just pure gameplay.' },
];

const edges = [
  { title: 'Design as Strategic Value', desc: 'Every game is crafted with purpose — clean interfaces that fade away, letting the challenge take center stage.' },
  { title: 'Intelligent AI Opponents', desc: 'Minimax, Alpha-Beta pruning, backtracking solvers — purpose-built AI for every game, not one-size-fits-all.' },
  { title: 'Business-Driven Engineering', desc: 'No accounts. No downloads. Play instantly. Your progress saves locally. Built for you, not for data collection.' },
  { title: 'Purposeful Immersion', desc: 'A living 3D backdrop responds to your movement, creating a spatial arcade atmosphere without distraction.' },
];

const faqs = [
  { q: 'What kinds of games are on BOTCADE?', a: 'Five classic games: XO (Tic Tac Toe), Connect 4, Memory Match, Sudoku, and Chess. Each features intelligent AI opponents built on classic algorithms like Minimax and backtracking solvers.' },
  { q: 'How does the AI difficulty work?', a: 'Easy mode uses random or weaker moves — great for learning. Hard mode activates the full AI: Minimax at maximum depth for XO and Chess, Alpha-Beta pruning for Connect 4, and backtracking solvers for Sudoku.' },
  { q: 'Do I need an account to play?', a: 'No accounts, no sign-ups, no emails. Pick a game and play instantly. Your progress is saved locally in your browser.' },
  { q: 'How do daily quests work?', a: 'Each day brings new challenges — win a game on Hard, solve a Sudoku under a time limit, or complete a Memory Match in minimal moves. Completing quests earns XP toward your level.' },
  { q: 'What does my level and XP do?', a: 'Level and XP track your mastery across all games. Win matches, complete daily quests, and climb the ranks. It\'s a personal record of your arcade journey.' },
  { q: 'Can you work alongside our internal team?', a: 'BOTCADE is a solo arcade experience — every game is you versus the AI. But the platform is built to expand, with more games and features on the roadmap.' },
];

function ScrollReveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: isInView ? 'translateY(0)' : 'translateY(100%)',
        transition: `translate 1000ms ${500 + delay}ms var(--ease-out-cubic, cubic-bezier(0.33, 1, 0.68, 1))`,
      }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#f6f6f6] overflow-x-clip">
      {/* ===== HERO ===== */}
      <section id="hero" className="group/section px-6 pt-[calc(var(--navbar-height,5rem)+1rem)] h-screen flex flex-col">
        <div className="container max-w-none flex flex-col items-center justify-between gap-6 mx-auto py-6 flex-1">
          <h1 data-split-heading id="hero-heading" className="text-[52px] md:text-[90px] leading-[52px] md:leading-[90px] font-display font-normal text-center tracking-tight mt-auto">
            High-end games.<br />Crafted AI.
          </h1>

          <div className="flex flex-col items-center justify-end gap-6 pb-8">
            <p data-split-text id="hero-description" className="text-base md:text-lg text-center max-w-[64ch] text-black/70 leading-relaxed font-light">
              We build AI-powered arcade games for players who see intelligent design and
              sharp engineering as the competitive advantage. From classic puzzles to
              strategic combat, every game features purpose-built AI opponents.
            </p>

            <a href="#games" className="size-[clamp(3rem,2.8rem+0.8vw,3.5rem)] rounded-full bg-[#e1fc06] text-black hover:bg-black hover:text-white transition-colors flex items-center justify-center">
              <svg viewBox="0 0 9 15" fill="none" className="w-3 h-auto rotate-90">
                <path d="M1 13.6953L7.34767 7.34767L1 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="sr-only">scroll to games section</span>
            </a>
          </div>
        </div>
      </section>

      {/* ===== ABOUT / STATS CARDS ===== */}
      <section id="about" className="group/section px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-3">
          <ScrollReveal delay={0}>
            <div className="bg-white aspect-[32/14] md:aspect-[35/16] py-8 flex flex-col items-center justify-end gap-4 rounded-2xl">
              <svg viewBox="0 0 48 52" fill="none" className="h-8 md:h-10 text-black flex-1">
                <path d="M25.9639 34.3394C30.7679 34.3394 34.6622 30.5245 34.6622 25.8186C34.6622 21.1127 30.7679 17.2979 25.9639 17.2979C21.16 17.2979 17.2656 21.1127 17.2656 25.8186C17.2656 30.5245 21.16 34.3394 25.9639 34.3394Z" fill="currentColor" />
                <path d="M36.2977 36.3888C33.6817 38.6952 30.2154 39.9765 26.4222 39.9765C24.4951 40.03 22.5773 39.6965 20.7868 38.9966C18.9962 38.2968 17.3709 37.2453 16.0108 35.9069C14.6506 34.5686 13.5846 32.9717 12.8782 31.2145C12.1717 29.4574 11.84 27.5772 11.9032 25.6898C11.9032 17.4252 17.8547 11.6593 26.4222 11.6593C30.15 11.6593 33.6817 12.8765 36.3631 15.1829L38.1943 16.7205L46.304 8.77632L44.2766 6.98247C39.3655 2.69152 33.0028 0.339921 26.4222 0.383656C11.38 0.383656 0.458063 11.0186 0.458063 25.6257C0.378141 28.9932 0.994105 32.3417 2.26896 35.47C3.54381 38.5983 5.45122 41.4418 7.87653 43.8296C10.3018 46.2174 13.195 48.1001 16.382 49.3647C19.5691 50.6292 22.9842 51.2495 26.4222 51.1881C33.2893 51.1881 39.6985 48.8176 44.4074 44.5252L46.3694 42.7314L38.1289 34.7872L36.2977 36.3888Z" fill="currentColor" />
              </svg>
              <p className="text-sm md:text-base text-black/80">5 AI-Powered Games</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <div className="bg-white aspect-[32/14] md:aspect-[35/16] py-8 flex flex-col items-center justify-end gap-4 rounded-2xl">
              <svg viewBox="0 0 203 86" fill="none" className="h-8 md:h-10 text-black flex-1">
                <path fillRule="evenodd" clipRule="evenodd" d="M109.406 8.09008C108.344 8.09018 107.292 7.88099 106.31 7.47447C105.329 7.06794 104.437 6.47203 103.686 5.72078C102.934 4.96952 102.338 4.07764 101.932 3.09606C101.525 2.11448 101.316 1.06243 101.316 0H100.796C100.796 1.06235 100.587 2.11432 100.181 3.09585C99.7745 4.07738 99.1787 4.96923 98.4275 5.72048C97.6764 6.47173 96.7846 7.06766 95.8031 7.47424C94.8217 7.88081 93.7697 8.09008 92.7074 8.09008V8.61038C93.7697 8.61018 94.8216 8.81925 95.803 9.22566C96.7845 9.63207 97.6763 10.2279 98.4274 10.979C99.1786 11.7301 99.7744 12.6219 100.181 13.6033C100.587 14.5847 100.796 15.6366 100.796 16.6989H101.317C101.317 15.6366 101.526 14.5846 101.932 13.6032C102.339 12.6217 102.935 11.7299 103.686 10.9788C104.437 10.2277 105.329 9.63192 106.31 9.22554C107.292 8.81916 108.344 8.61012 109.406 8.61038V8.09008Z" fill="currentColor" />
              </svg>
              <p className="text-sm md:text-base text-black/80">Intelligent AI Opponents</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="bg-white aspect-[32/14] md:aspect-[35/16] py-8 flex flex-col items-center justify-end gap-4 rounded-2xl">
              <svg viewBox="0 0 58 52" fill="none" className="h-8 md:h-10 text-black flex-1">
                <path d="M29 0L35.5 19.5H58L39.5 31.5L45 51L29 39L13 51L18.5 31.5L0 19.5H22.5L29 0Z" fill="currentColor" />
              </svg>
              <p className="text-sm md:text-base text-black/80">No Accounts, No Limits</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== GAMES / WORK ===== */}
      <section id="games" className="group/section px-6 py-24 md:py-32">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[90px] leading-[90px] font-display font-normal text-black mb-4">Games</h2>
          <p className="text-base md:text-lg text-black/70 mb-12 max-w-xl font-light">Five AI-powered challenges. Pick your game, choose your difficulty, play instantly.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => (
              <Link key={game.id} href={`/games/${game.id}`} className="group block no-underline">
                <div className={`relative ${game.cover} aspect-[4/3] overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="text-2xl text-white/80 mb-2">{game.icon}</div>
                    <h3 className="text-[18px] leading-[18px] font-display font-normal text-white mb-1">{game.name}</h3>
                    <p className="text-sm text-white/60 leading-relaxed">{game.desc}</p>
                  </div>
                  <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHAT WE BUILD ===== */}
      <section className="bg-black text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="overflow-hidden mb-12">
            <div className="marquee" style={{ '--duration': '40s' } as React.CSSProperties}>
              <h2 className="marquee-content text-[120px] md:text-[172px] leading-[100px] md:leading-[146px] font-display font-normal text-white/10 whitespace-nowrap select-none">
                WHAT WE BUILD&nbsp;&nbsp;&mdash;&nbsp;&nbsp;WHAT WE BUILD&nbsp;&nbsp;&mdash;&nbsp;&nbsp;
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <div key={cat.title} className="border-t border-white/20 pt-6">
                <h3 className="text-[18px] leading-[18px] font-display font-normal text-white mb-3">{cat.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed font-light">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OUR EDGE ===== */}
      <section className="bg-[#f6f6f6] overflow-hidden py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="overflow-hidden mb-12">
            <div className="marquee" style={{ '--duration': '40s', '--direction': 'reverse' } as React.CSSProperties}>
              <h2 className="marquee-content text-[120px] md:text-[172px] leading-[100px] md:leading-[146px] font-display font-normal text-black/[0.04] whitespace-nowrap select-none">
                OUR EDGE&nbsp;&nbsp;&mdash;&nbsp;&nbsp;OUR EDGE&nbsp;&nbsp;&mdash;&nbsp;&nbsp;
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 -mt-20">
            {edges.map((edge) => (
              <div key={edge.title} className="bg-white border border-black/5 p-6 md:p-8">
                <h3 className="text-[18px] leading-[18px] font-display font-normal text-black mb-4">{edge.title}</h3>
                <p className="text-sm text-black/60 leading-relaxed font-light">{edge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS / SENIOR-LED ===== */}
      <section className="bg-black text-white overflow-hidden py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="overflow-hidden mb-12">
            <div className="marquee" style={{ '--duration': '40s' } as React.CSSProperties}>
              <h2 className="marquee-content text-[120px] md:text-[172px] leading-[100px] md:leading-[146px] font-display font-normal text-white/10 whitespace-nowrap select-none">
                YOUR ARCADE&nbsp;&nbsp;&mdash;&nbsp;&nbsp;YOUR ARCADE&nbsp;&nbsp;&mdash;&nbsp;&nbsp;
              </h2>
            </div>
          </div>

          <h2 className="text-[42px] leading-[42px] font-display font-normal text-white mb-12">Player Stats</h2>
          <PlayerStatsCards />
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="bg-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h2 className="text-[42px] leading-[42px] font-display font-normal text-black mb-4">FAQ</h2>
            <p className="text-base text-black/70 mb-12 font-light">Everything you need to know about BOTCADE.</p>

            <div>
              {faqs.map((faq, i) => (
                <div key={i} className="border-t border-black/10 py-5">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left flex justify-between items-center gap-4 group"
                  >
                    <span className="font-display text-lg md:text-xl tracking-tight text-black/80 group-hover:text-black transition-colors">{faq.q}</span>
                    <span className={`text-black/40 transition-transform duration-300 shrink-0 ${openFaq === i ? 'rotate-45' : ''}`}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </span>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-black/60 pt-3 pb-1 max-w-xl leading-relaxed font-light">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-[#f6f6f6] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[14px] text-black/40 font-body uppercase tracking-wider mb-4">Ready to play?</p>
          <h2 className="text-[90px] leading-[90px] font-display font-normal text-black mb-8">Let&rsquo;s play</h2>
          <Link
            href="#games"
            className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white text-sm font-display hover:bg-black/80 transition-colors no-underline"
          >
            Browse All Games
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

function PlayerStatsCards() {
  const { stats } = useProgression();
  const xpForCurrent = (stats.level - 1) * 100;
  const xpForNext = stats.level * 100;
  const progress = stats.xp - xpForCurrent;
  const needed = xpForNext - xpForCurrent;
  const pct = Math.min(Math.round((progress / needed) * 100), 100);

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
        <div className="text-center">
          <svg className="w-5 h-5 mx-auto mb-3 text-white/40" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/></svg>
          <div className="text-[64px] leading-[64px] font-display font-normal text-white">{stats.level}</div>
          <div className="text-[14px] text-[#d1d1d1] font-body mt-2 uppercase tracking-wider">Level</div>
        </div>
        <div className="text-center">
          <svg className="w-5 h-5 mx-auto mb-3 text-white/40" viewBox="0 0 24 24" fill="none"><path d="M13 10V3L4 14h7v7l9-11h-7z" fill="currentColor"/></svg>
          <div className="text-[64px] leading-[64px] font-display font-normal text-white">{stats.xp}</div>
          <div className="text-[14px] text-[#d1d1d1] font-body mt-2 uppercase tracking-wider">XP</div>
        </div>
        <div className="text-center">
          <svg className="w-5 h-5 mx-auto mb-3 text-white/40" viewBox="0 0 24 24" fill="none"><path d="M12 15l-5 3 1-6-4-4 6-1 2-5 2 5 6 1-4 4 1 6-5-3z" fill="currentColor"/></svg>
          <div className="text-[64px] leading-[64px] font-display font-normal text-white">{stats.wins}</div>
          <div className="text-[14px] text-[#d1d1d1] font-body mt-2 uppercase tracking-wider">Wins</div>
        </div>
      </div>
      <div className="max-w-xs mx-auto">
        <div className="flex justify-between text-xs text-white/40 font-body mb-2">
          <span>Level {stats.level}</span>
          <span>Level {stats.level + 1}</span>
        </div>
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-white/60 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-center text-xs text-white/30 font-body mt-2">{progress} / {needed} XP</p>
      </div>
      {stats.wins === 0 && (
        <p className="text-center text-sm text-white/40 font-body">Play a game to start earning XP and climb the ranks.</p>
      )}
    </div>
  );
}
