import GameLayout from '@/components/GameLayout';
import Connect4 from '@/components/games/Connect4';

export default function Connect4Page() {
  return (
    <GameLayout title="Connect 4">
      <Connect4 />
    </GameLayout>
  );
}
