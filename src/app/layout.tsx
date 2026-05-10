import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import Scene3D from "@/components/Scene3D";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });

export const metadata: Metadata = {
  title: "BOTCADE | AI Arcade",
  description: "Single-player AI arcade platform with strategy and casual games.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${orbitron.variable} font-body antialiased min-h-screen flex flex-col scanline overflow-x-hidden`}>
        <Scene3D />

        <nav className="fixed top-4 left-4 right-4 z-50 max-w-6xl mx-auto lg:left-1/2 lg:-translate-x-1/2">
          <div className="glass-panel rounded-2xl px-6 py-3 flex items-center justify-between"
               style={{ background: 'rgba(7, 7, 18, 0.7)', backdropFilter: 'blur(20px)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-rose flex items-center justify-center text-white font-display text-sm font-bold shadow-lg shadow-neon-purple/20">
                B
              </div>
              <span className="font-display text-lg font-bold text-white tracking-[0.2em] hidden sm:block">
                BOTCADE
              </span>
            </div>
            <div className="flex items-center gap-1">
              <a href="#games" className="px-3 py-2 text-xs font-body text-gray-500 hover:text-neon-purple-light transition-colors rounded-lg hover:bg-white/5 tracking-wider">
                GAMES
              </a>
              <a href="#challenges" className="px-3 py-2 text-xs font-body text-gray-500 hover:text-neon-rose transition-colors rounded-lg hover:bg-white/5 tracking-wider">
                QUESTS
              </a>
            </div>
          </div>
        </nav>

        <main className="flex-grow relative" style={{ zIndex: 1 }}>
          {children}
        </main>

        <footer className="relative border-t border-white/5 mt-48" style={{ zIndex: 1 }}>
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-neon-purple to-neon-rose flex items-center justify-center text-white font-display text-xs font-bold">
                  B
                </div>
                <span className="font-display text-sm text-white tracking-[0.2em]">
                  BOTCADE
                </span>
              </div>
              <p className="text-xs text-gray-700 font-body tracking-wider">
                © 2026 BOTCADE — A I   A R C A D E
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
