'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { calculateWinner, getBestMove, getRandomMove } from '@/lib/ai/xo';
import { useProgression } from '@/hooks/useProgression';

type Player = 'X' | 'O' | null;
type Difficulty = 'Easy' | 'Hard';

export default function XOGame() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty>('Hard');
  const [winner, setWinner] = useState<Player | 'Draw'>(null);
  const { addWin } = useProgression();

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
    if (winner === 'X') addWin(50);
  }, [winner, addWin]);

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
    <div className="flex flex-col items-center p-6 glass-panel rounded-2xl max-w-md w-full mx-auto">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="font-display text-lg text-white tracking-wider">X O <span className="text-neon-rose text-sm font-body">({difficulty})</span></h2>
        <select
            className="bg-dark-800 text-gray-300 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-body outline-none focus:border-neon-purple transition-colors cursor-pointer"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            disabled={board.some(sq => sq !== null) && !winner}
        >
          <option value="Easy">EASY</option>
          <option value="Hard">HARD</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6 w-full aspect-square">
        {board.map((square, i) => (
          <button
            key={i}
            onClick={() => isXNext ? handlePlay(i, 'X') : null}
            disabled={!isXNext || !!square || !!winner}
            className="glass-card rounded-xl flex items-center justify-center text-4xl font-display border border-white/5 hover:border-neon-purple/30 transition-all duration-200"
          >
            {square && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={square === 'X' ? 'text-neon-green' : 'text-neon-pink'}
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
          <p className="font-display text-xl text-white tracking-wider">
            {winner === 'Draw' ? "D R A W" : `${winner}   W I N S`}
          </p>
          <button
            onClick={resetGame}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-neon-purple to-neon-rose text-white text-xs font-display tracking-wider hover:shadow-neon-purple transition-shadow duration-300"
          >
            PLAY AGAIN
          </button>
        </motion.div>
      )}
    </div>
  );
}
