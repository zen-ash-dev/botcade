'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { calculateWinner, getBestMove, getRandomMove } from '@/lib/ai/xo';
import { useProgression } from '@/hooks/useProgression';
import { useChallenges } from '@/hooks/useChallenges';

type Player = 'X' | 'O' | null;
type Difficulty = 'Easy' | 'Hard';

export default function XOGame() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty>('Hard');
  const [winner, setWinner] = useState<Player | 'Draw'>(null);
  const { addWin } = useProgression();
  const { advanceChallenge } = useChallenges();

  useEffect(() => {
    if (winner === 'X') {
      advanceChallenge('win-xo');
      if (difficulty === 'Hard') advanceChallenge('beat-hard');
    }
  }, [winner, difficulty, advanceChallenge]);

  useEffect(() => {
    if (!isXNext && !winner) {
      const timer = setTimeout(() => {
        const move = difficulty === 'Hard'
            ? getBestMove([...board], 'O', 'X')
            : getRandomMove([...board]);

        if (move !== -1) {
          handlePlay(move, 'O');
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isXNext, board, winner, difficulty]);

  useEffect(() => {
    if (winner === 'X') {
      addWin(50);
      advanceChallenge('win-xo');
      if (difficulty === 'Hard') advanceChallenge('beat-hard');
    }
  }, [winner, addWin, advanceChallenge, difficulty]);

  const handlePlay = (index: number, player: Player) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);

    const newWinner = calculateWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
    } else {
      setIsXNext(player === 'X' ? false : true);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm max-w-md w-full mx-auto">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="font-display text-lg text-neutral-900 tracking-tight">XO <span className="text-neutral-400 text-sm font-medium">({difficulty})</span></h2>
        <select
            className="bg-neutral-50 text-neutral-700 border border-neutral-200 rounded-lg px-3 py-1.5 text-xs font-medium outline-none focus:border-neutral-400 transition-colors cursor-pointer"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            disabled={board.some(sq => sq !== null) && !winner}
        >
          <option value="Easy">Easy</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {!winner && (
        <div className="mb-4 text-xs font-medium tracking-tight text-neutral-500">
          {isXNext ? 'Your Turn (X)' : 'AI Thinking...'}
        </div>
      )}
      <div className="grid grid-cols-3 gap-2 mb-6 w-full aspect-square">
        {board.map((square, i) => (
          <button
            key={i}
            onClick={() => isXNext ? handlePlay(i, 'X') : null}
            disabled={!isXNext || !!square || !!winner}
            className="bg-neutral-50 rounded-xl flex items-center justify-center text-4xl font-display border border-neutral-100 hover:border-neutral-300 transition-all duration-200"
          >
            {square && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={square === 'X' ? 'text-emerald-600' : 'text-neutral-400'}
              >
                {square}
              </motion.span>
            )}
          </button>
        ))}
      </div>

      {winner && (
        <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col items-center gap-4"
        >
          <p className="font-display text-xl text-neutral-900 tracking-tight">
            {winner === 'Draw' ? "Draw" : `${winner} Wins`}
          </p>
          <button
            onClick={resetGame}
            className="px-6 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-medium tracking-tight hover:bg-neutral-800 transition-colors"
          >
            Play Again
          </button>
        </motion.div>
      )}
    </div>
  );
}
