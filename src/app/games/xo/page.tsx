import GameLayout from '@/components/GameLayout';
import XOGame from '@/components/games/XO';

export default function XOPage() {
  return (
    <GameLayout title="XO">
      <XOGame />
    </GameLayout>
  );
}
