'use client'

import { useState, useEffect, useCallback } from 'react';

export interface Challenge {
  id: string;
  title: string;
  goal: number;
  progress: number;
  rewardXp: number;
  completed: boolean;
}

const DEFAULT_CHALLENGES: Omit<Challenge, 'progress' | 'completed'>[] = [
  { id: 'win-xo', title: 'Win 3 XO games', goal: 3, rewardXp: 50 },
  { id: 'beat-hard', title: 'Beat Hard bot once', goal: 1, rewardXp: 100 },
  { id: 'connect4-win', title: 'Win a Connect 4 match', goal: 1, rewardXp: 75 },
  { id: 'memory-moves', title: 'Finish Memory under 20 moves', goal: 1, rewardXp: 60 },
  { id: 'sudoku-easy', title: 'Complete an Easy Sudoku', goal: 1, rewardXp: 80 },
];

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

function loadChallenges(): Challenge[] {
  if (typeof window === 'undefined') return [];

  const today = getTodayKey();
  const stored = localStorage.getItem('botcade_challenges');
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed.date === today) return parsed.challenges;
  }

  const fresh = DEFAULT_CHALLENGES.map(c => ({
    ...c,
    progress: 0,
    completed: false,
  }));
  localStorage.setItem('botcade_challenges', JSON.stringify({ date: today, challenges: fresh }));
  return fresh;
}

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    setChallenges(loadChallenges());
  }, []);

  const advanceChallenge = useCallback((id: string, amount: number = 1) => {
    setChallenges(prev => {
      const updated = prev.map(c => {
        if (c.id !== id) return c;
        const newProgress = Math.min(c.progress + amount, c.goal);
        return { ...c, progress: newProgress, completed: newProgress >= c.goal };
      });
      const today = getTodayKey();
      localStorage.setItem('botcade_challenges', JSON.stringify({ date: today, challenges: updated }));
      return updated;
    });
  }, []);

  return { challenges, advanceChallenge };
}
