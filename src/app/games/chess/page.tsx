import GameLayout from '@/components/GameLayout';
import ChessGame from '@/components/games/ChessGame';

export default function ChessPage() {
  return (
    <GameLayout title="Chess">
      <ChessGame />
    </GameLayout>
  );
}
