import GameLayout from '@/components/GameLayout';
import Sudoku from '@/components/games/Sudoku';

export default function SudokuPage() {
  return (
    <GameLayout title="Sudoku">
      <Sudoku />
    </GameLayout>
  );
}
