'use client'

import { useChallenges } from '@/hooks/useChallenges';
import { motion } from 'framer-motion';

export default function DailyChallenges() {
  const { challenges } = useChallenges();

  return (
    <div className="bg-white border border-black/5 p-6 w-full max-w-sm">
      <h3 className="font-display text-lg tracking-tight text-black mb-5 flex items-center gap-2">
        <svg className="w-4 h-4 text-black/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        Daily Quests
      </h3>

      <div className="flex flex-col gap-3">
        {challenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className={`p-4 border transition-all duration-300 ${
              challenge.completed
                ? 'border-black/20 bg-black/5'
                : 'border-black/5 bg-[#f6f6f6]'
            }`}
          >
            <div className="flex justify-between items-start gap-3">
              <h4 className={`text-sm font-medium tracking-tight ${
                challenge.completed ? 'text-black/40 line-through' : 'text-black/80'
              }`}>
                {challenge.title}
              </h4>
              <span className="shrink-0 text-[10px] font-bold text-black/60 bg-black/5 px-2 py-1 tracking-wide uppercase">
                +{challenge.rewardXp} XP
              </span>
            </div>

            <div className="w-full bg-black/10 rounded-full h-1 mt-3 overflow-hidden">
              <motion.div
                className="h-1 rounded-full bg-black"
                initial={{ width: 0 }}
                animate={{ width: `${(challenge.progress / challenge.goal) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-right text-[10px] text-black/40 mt-1 font-medium tracking-tight">
              {challenge.progress} / {challenge.goal}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
