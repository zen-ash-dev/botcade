'use client'

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useProgression } from '@/hooks/useProgression';
import { useChallenges } from '@/hooks/useChallenges';

const ICONS = ['🤖', '👽', '👾', '🚀', '⚡️', '🔥', '💻', '🔋'];

export default function MemoryMatch() {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const xpAwarded = useRef(false);
  const { addWin } = useProgression();
  const { advanceChallenge } = useChallenges();

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0 && !xpAwarded.current) {
      xpAwarded.current = true;
      const bonus = Math.max(0, 20 - moves) * 5;
      addWin(60 + bonus);
      advanceChallenge('memory-moves');
    }
  }, [solved, cards, moves, addWin, advanceChallenge]);

  const resetGame = () => {
    const shuffled = [...ICONS, ...ICONS].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
  };

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || solved.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setSolved([...solved, ...newFlipped]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm w-full max-w-md mx-auto">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="font-display text-lg text-neutral-900 tracking-tight">Memory</h2>
        <span className="text-neutral-400 text-xs font-medium">Moves: <span className="text-neutral-700 text-sm">{moves}</span></span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {cards.map((card, i) => {
          const isFlipped = flipped.includes(i) || solved.includes(i);
          return (
            <motion.div
              key={i}
              onClick={() => handleCardClick(i)}
              className="w-16 h-16 md:w-20 md:h-20 cursor-pointer"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className={`absolute inset-0 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center ${isFlipped ? 'hidden' : ''}`}>
                <span className="text-neutral-300 text-2xl font-display">?</span>
              </div>
              <div className={`absolute inset-0 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-3xl shadow-sm ${!isFlipped ? 'hidden' : ''}`} style={{ transform: 'rotateY(180deg)' }}>
                {card}
              </div>
            </motion.div>
          );
        })}
      </div>

      {solved.length === cards.length && cards.length > 0 && (
        <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-8 flex flex-col items-center gap-4"
        >
          <p className="font-display text-xl text-neutral-900 tracking-tight">All Matched</p>
          <button onClick={resetGame} className="px-6 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-medium tracking-tight hover:bg-neutral-800 transition-colors">
            Play Again
          </button>
        </motion.div>
      )}
    </div>
  );
}
