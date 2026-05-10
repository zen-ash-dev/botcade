'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';
import Sudoku from '@/components/games/Sudoku';

export default function SudokuPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-lg">
        <Link href="/" className="mb-6 text-gray-400 hover:text-white transition-colors font-inter flex items-center gap-2">
          ← Back to Games
        </Link>
        <Sudoku />
      </motion.div>
    </div>
  );
}
