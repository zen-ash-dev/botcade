'use client'

import { useState, useEffect, useCallback } from 'react';

interface PlayerStats {
  level: number;
  xp: number;
  wins: number;
}

export function useProgression() {
  const [stats, setStats] = useState<PlayerStats>({ level: 1, xp: 0, wins: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('botcade_stats');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  const addWin = useCallback((xpGained: number = 50) => {
    setStats(prev => {
      const newXp = prev.xp + xpGained;
      const newLevel = Math.floor(newXp / 100) + 1;
      const newStats = {
        level: newLevel,
        xp: newXp,
        wins: prev.wins + 1
      };

      localStorage.setItem('botcade_stats', JSON.stringify(newStats));
      return newStats;
    });
  }, []);

  return { stats, addWin };
}
