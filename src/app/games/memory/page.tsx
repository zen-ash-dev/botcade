import GameLayout from '@/components/GameLayout';
import MemoryMatch from '@/components/games/Memory';

export default function MemoryPage() {
  return (
    <GameLayout title="Memory">
      <MemoryMatch />
    </GameLayout>
  );
}
