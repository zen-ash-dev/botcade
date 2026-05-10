'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ICONS = ['🤖', '👽', '👾', '🚀', '⚡️', '🔥', '💻', '🔋'];

export default function MemoryMatch() {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    resetGame();
  }, []);

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
    <div className="flex flex-col items-center p-6 glass-panel rounded-2xl w-full max-w-md mx-auto">
      <div className="w-full flex justify-between items-center mb-6 font-display">
        <h2 className="text-lg text-white tracking-wider">M E M O R Y</h2>
        <span className="text-gray-500 text-xs font-body">MOVES: <span className="text-white text-sm">{moves}</span></span>
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
              <div className={`absolute inset-0 rounded-xl glass-card border border-white/5 flex items-center justify-center ${isFlipped ? 'hidden' : ''}`}>
                <span className="text-neon-purple opacity-40 text-2xl font-display">?</span>
              </div>
              <div className={`absolute inset-0 rounded-xl bg-dark-700/80 border border-white/10 flex items-center justify-center text-3xl ${!isFlipped ? 'hidden' : ''}`} style={{ transform: 'rotateY(180deg)' }}>
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
          <p className="font-display text-xl text-white tracking-wider">A L L   M A T C H E D</p>
          <button onClick={resetGame} className="px-6 py-2.5 rounded-full bg-gradient-to-r from-neon-purple to-neon-rose text-white text-xs font-display tracking-wider hover:shadow-neon-purple transition-shadow duration-300">
            PLAY AGAIN
          </button>
        </motion.div>
      )}
    </div>
  );
}
