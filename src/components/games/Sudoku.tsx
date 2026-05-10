'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateSudokuBoard, solveSudoku, isValid } from '@/lib/ai/sudoku';
import { useProgression } from '@/hooks/useProgression';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

export default function Sudoku() {
  const [initialBoard, setInitialBoard] = useState<number[][]>([]);
  const [board, setBoard] = useState<number[][]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [isSolved, setIsSolved] = useState(false);
  const { addWin } = useProgression();

  useEffect(() => {
    startNewGame(difficulty);
  }, [difficulty]);

  const startNewGame = (level: Difficulty) => {
    const newBoard = generateSudokuBoard(level);
    setInitialBoard(newBoard.map(row => [...row]));
    setBoard(newBoard.map(row => [...row]));
    setIsSolved(false);
  };

  const handleInput = (row: number, col: number, value: string) => {
    if (initialBoard[row][col] !== 0 || isSolved) return;

    const num = value === '' ? 0 : parseInt(value);
    if (isNaN(num) || num < 0 || num > 9) return;

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = num;
    setBoard(newBoard);
    checkWinCondition(newBoard);
  };

  const checkWinCondition = (currentBoard: number[][]) => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (currentBoard[r][c] === 0) return;
      }
    }

    let valid = true;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = currentBoard[r][c];
        currentBoard[r][c] = 0;
        if (!isValid(currentBoard, r, c, val)) valid = false;
        currentBoard[r][c] = val;
      }
    }

    if (valid) {
      setIsSolved(true);
      addWin(difficulty === 'Hard' ? 200 : difficulty === 'Medium' ? 150 : 100);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 glass-panel rounded-2xl w-full max-w-lg mx-auto">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="font-display text-lg text-white tracking-wider">S U D O K U</h2>
        <select
            className="bg-dark-800 text-gray-300 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-body outline-none focus:border-neon-purple transition-colors cursor-pointer"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
        >
          <option value="Easy">EASY</option>
          <option value="Medium">MEDIUM</option>
          <option value="Hard">HARD</option>
        </select>
      </div>

      <div className="grid grid-cols-9 gap-0 bg-dark-800/50 p-1 rounded-lg border border-white/10">
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isInitial = initialBoard[r][c] !== 0;
            const borderRight = c % 3 === 2 && c !== 8 ? 'border-r-2 border-neon-purple/30' : 'border-r border-white/5';
            const borderBottom = r % 3 === 2 && r !== 8 ? 'border-b-2 border-neon-purple/30' : 'border-b border-white/5';

            return (
              <input
                key={`${r}-${c}`}
                type="text"
                maxLength={1}
                value={cell === 0 ? '' : cell}
                onChange={(e) => handleInput(r, c, e.target.value)}
                readOnly={isInitial}
                className={`w-8 h-8 sm:w-10 sm:h-10 text-center font-body text-lg sm:text-xl outline-none transition-colors
                  ${isInitial ? 'bg-dark-800 text-gray-300 font-bold' : 'bg-dark-900/60 text-neon-blue hover:bg-dark-700/80 focus:bg-dark-700/80'}
                  ${borderRight} ${borderBottom}
                `}
              />
            );
          })
        )}
      </div>

      {isSolved && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-6 flex flex-col items-center">
          <p className="font-display text-xl text-neon-green tracking-wider mb-4">G R I D   S O L V E D</p>
          <button onClick={() => startNewGame(difficulty)} className="px-6 py-2.5 rounded-full bg-gradient-to-r from-neon-purple to-neon-rose text-white text-xs font-display tracking-wider hover:shadow-neon-purple transition-shadow duration-300">
            PLAY AGAIN
          </button>
        </motion.div>
      )}
    </div>
  );
}
