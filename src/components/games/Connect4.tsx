'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ROWS, COLS, Player, checkConnect4Win, getConnect4BestMove } from '@/lib/ai/connect4';
import { useProgression } from '@/hooks/useProgression';
import { useChallenges } from '@/hooks/useChallenges';

export default function Connect4() {
  const [board, setBoard] = useState<Player[][]>(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<Player | 'Draw'>(null);
  const { addWin } = useProgression();
  const { advanceChallenge } = useChallenges();

  const dropToken = (col: number, player: Player) => {
    if (winner || board[0][col] !== null) return;

    const newBoard = board.map(row => [...row]);
    let droppedRow = -1;

    for (let r = ROWS - 1; r >= 0; r--) {
      if (newBoard[r][col] === null) {
        newBoard[r][col] = player;
        droppedRow = r;
        break;
      }
    }

    setBoard(newBoard);

    const gameResult = checkConnect4Win(newBoard);
    if (gameResult) {
      setWinner(gameResult);
      if (gameResult === 'Red') {
        addWin(100);
        advanceChallenge('connect4-win');
      }
    } else {
      setIsPlayerTurn(player === 'Yellow');

      if (player === 'Red') {
        setTimeout(() => {
          const aiMove = getConnect4BestMove(newBoard, 'Yellow');
          if (aiMove !== -1) dropToken(aiMove, 'Yellow');
        }, 800);
      }
    }
  };

  const reset = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setWinner(null);
    setIsPlayerTurn(true);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm max-w-2xl w-full mx-auto">
      <h2 className="font-display text-lg text-neutral-900 tracking-tight mb-6">Connect 4</h2>

      {!winner && (
        <div className="mb-4 text-xs font-medium tracking-tight text-neutral-500">
          {isPlayerTurn ? 'Your Turn (Red)' : 'AI Thinking...'}
        </div>
      )}
      <div className="bg-neutral-50 p-4 rounded-xl flex gap-2 border border-neutral-100">
        {Array.from({ length: COLS }).map((_, col) => (
          <div key={col} className="flex flex-col gap-2 cursor-pointer" onClick={() => isPlayerTurn && dropToken(col, 'Red')}>
            {board.map((row, r) => (
              <div key={r} className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white border border-neutral-200 overflow-hidden relative">
                {row[col] && (
                   <motion.div
                     initial={{ y: -300, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     transition={{ type: "spring", bounce: 0.5 }}
                     className={`w-full h-full rounded-full ${
                       row[col] === 'Red' ? 'bg-red-500' : 'bg-amber-400'
                     }`}
                   />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {winner && (
        <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-6 flex flex-col items-center gap-4"
        >
          <p className="font-display text-xl text-neutral-900 tracking-tight">{winner === 'Draw' ? "Draw" : `${winner} Wins`}</p>
          <button onClick={reset} className="px-6 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-medium tracking-tight hover:bg-neutral-800 transition-colors">
            Play Again
          </button>
        </motion.div>
      )}
    </div>
  );
}
