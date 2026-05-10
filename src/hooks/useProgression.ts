'use client'

import { useState, useCallback, useMemo } from 'react';

export function getLevel(xp: number): number {
  return Math.floor((1 + Math.sqrt(1 + 8 * xp / 100)) / 2);
}

export function xpForLevel(level: number): number {
  return 100 * (level - 1) * level / 2;
}

export function xpToNextLevel(xp: number): number {
  const level = getLevel(xp);
  return xpForLevel(level + 1) - xp;
}

export function levelProgress(xp: number): number {
  const level = getLevel(xp);
  const current = xpForLevel(level);
  const next = xpForLevel(level + 1);
  if (next === current) return 0;
  return Math.round(((xp - current) / (next - current)) * 100);
}

interface StoredStats {
  xp: number;
  wins: number;
}

function loadStats(): StoredStats {
  if (typeof window === 'undefined') return { xp: 0, wins: 0 };
  try {
    const saved = localStorage.getItem('botcade_stats');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { xp: parsed.xp ?? 0, wins: parsed.wins ?? 0 };
    }
  } catch {}
  return { xp: 0, wins: 0 };
}

export function useProgression() {
  const [stats, setStats] = useState<StoredStats>(loadStats);
  const level = useMemo(() => getLevel(stats.xp), [stats.xp]);

  const addWin = useCallback((xpGained: number = 50) => {
    setStats(prev => {
      const newStats: StoredStats = {
        xp: prev.xp + xpGained,
        wins: prev.wins + 1
      };
      localStorage.setItem('botcade_stats', JSON.stringify(newStats));
      return newStats;
    });
  }, []);

  return { stats: { ...stats, level }, addWin };
}
