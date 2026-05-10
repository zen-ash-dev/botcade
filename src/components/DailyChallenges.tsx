'use client'

import { useChallenges } from '@/hooks/useChallenges';
import { motion } from 'framer-motion';

export default function DailyChallenges() {
  const { challenges } = useChallenges();

  return (
    <div className="glass-panel p-6 rounded-2xl w-full max-w-sm">
      <h3 className="font-display text-base text-white tracking-[0.15em] mb-5 flex items-center gap-2">
        <svg className="w-4 h-4 text-neon-rose" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        D A I L Y   Q U E S T S
      </h3>

      <div className="flex flex-col gap-3">
        {challenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className={`p-4 rounded-xl border transition-all duration-300 ${
              challenge.completed
                ? 'border-neon-green/30 bg-neon-green/5'
                : 'border-white/5 bg-dark-800/50 hover:border-neon-purple/20'
            }`}
          >
            <div className="flex justify-between items-start gap-3">
              <h4 className={`text-sm font-body tracking-wider ${
                challenge.completed ? 'text-neon-green line-through opacity-60' : 'text-gray-300'
              }`}>
                {challenge.title}
              </h4>
              <span className="shrink-0 text-[10px] font-bold text-neon-rose bg-neon-rose/10 px-2 py-1 rounded tracking-wider">
                +{challenge.rewardXp} XP
              </span>
            </div>

            <div className="w-full bg-dark-900/80 rounded-full h-1.5 mt-3 overflow-hidden">
              <motion.div
                className={`h-1.5 rounded-full ${challenge.completed ? 'bg-neon-green' : 'bg-gradient-to-r from-neon-purple to-neon-rose'}`}
                initial={{ width: 0 }}
                animate={{ width: `${(challenge.progress / challenge.goal) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-right text-[10px] text-gray-600 mt-1 font-body tracking-wider">
              {challenge.progress} / {challenge.goal}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
