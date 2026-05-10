'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function GameLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-24 bg-[#f6f6f6]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Link
          href="/"
          className="group mb-8 inline-flex items-center gap-1.5 text-sm text-black/40 hover:text-black transition-colors no-underline"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-[42px] leading-[42px] font-display font-normal text-black tracking-tight">
            {title}
          </h1>
        </div>

        {children}
      </motion.div>
    </div>
  );
}
