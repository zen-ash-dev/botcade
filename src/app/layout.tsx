import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Scene3D from "@/components/Scene3D";
import SceneLoader from "@/components/SceneLoader";
import SplitText from "@/components/SplitText";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "BOTCADE — AI Arcade",
  description: "Single-player AI arcade platform with strategy and casual games.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var mode = localStorage.getItem("mode");
                if (mode === "dark") {
                  document.documentElement.classList.add("dark");
                } else if (!mode && window.matchMedia("(prefers-color-scheme: dark)").matches) {
                  document.documentElement.classList.add("dark");
                  localStorage.setItem("mode", "dark");
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-body antialiased min-h-screen flex flex-col overflow-x-hidden`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener("mousemove", function(e) {
                var p = document.getElementById("scene-progress-wrapper");
                if (!p) return;
                p.classList.remove("opacity-0");
                var x = e.clientX - p.offsetWidth / 2 + 48;
                var y = e.clientY - p.offsetHeight / 2 + 48;
                p.style.transform = "translate(" + x + "px, " + y + "px)";
              });
            `,
          }}
        />
        <canvas id="canvas" className="fixed z-0 top-0 left-0 w-full h-lvh lg:h-screen pointer-events-none scene-block hidden" />
        <Scene3D />
        <SceneLoader />
        <SplitText />

        <div
          id="switch-wrapper"
          className="fixed top-0 left-0 w-full h-(--navbar-height) z-91 pointer-events-none flex items-center justify-center -translate-y-full scene-ready-show transition-transform duration-1500 ease-out-cubic"
        >
          <div id="switch" className="pointer-events-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[clamp(2rem,0.857rem+1.786vw,3rem)] bg-black border border-black dark:border-white/10 rounded-full flex flex-row items-center justify-center">
            <button data-mode="light" className="relative z-1 h-full w-[clamp(3.5rem,2.5rem+1.786vw,5rem)] text-sm font-light text-white dark:text-black transition-colors duration-500 ease-in-out-quart">
              Light
            </button>
            <button data-mode="dark" className="relative z-1 h-full w-[clamp(3.5rem,2.5rem+1.786vw,5rem)] text-sm font-light text-white dark:text-black transition-colors duration-500 ease-in-out-quart">
              Dark
            </button>
            <div className="absolute top-1/2 left-px -translate-y-1/2 dark:translate-x-[calc(clamp(3.5rem,2.5rem+1.786vw,5rem)-0.125rem)] w-[clamp(3.5rem,2.5rem+1.786vw,5rem)] h-[calc(100%-0.125rem)] rounded-full bg-white transition-transform duration-500 ease-in-out-quart"></div>
          </div>
        </div>

        <nav id="navigation" className="group/nav fixed top-0 left-0 w-full h-(--navbar-height) z-90 bg-[#f6f6f6] dark:bg-black border-b border-black/5 dark:border-white/10 -translate-y-full scene-ready-show transition-transform duration-1500 ease-out-cubic">
          <div className="relative w-full h-full flex flex-row items-center justify-between px-6 lg:px-10">
            <a href="/" className="flex flex-row items-center gap-2 text-base font-light no-underline text-black dark:text-white">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path fillRule="evenodd" clipRule="evenodd" d="M24 11.5C22.4731 11.5001 20.961 11.3267 19.5503 10.7425C18.1395 10.1582 16.8577 9.30173 15.778 8.22201C14.6983 7.1423 13.8418 5.86046 13.2576 4.44972C12.6733 3.03897 12.4999 1.52695 12.5 0H11.5C11.5002 1.52683 11.3252 3.03875 10.7411 4.44942C10.1569 5.86009 9.30065 7.14188 8.2211 8.22159C7.14154 9.3013 5.85988 10.1578 4.44929 10.7421C3.03871 11.3265 1.52683 11.5 0 11.5V12.5C1.52672 12.4997 3.03855 12.6752 4.44912 13.2593C5.8597 13.8434 7.14138 14.6997 8.22096 15.7792C9.30054 16.8587 10.1569 18.1404 10.741 19.5509C11.3252 20.9615 11.5002 22.4733 11.5 24H12.5C12.4999 22.4732 12.6738 20.9613 13.2581 19.5508C13.8424 18.1402 14.6988 16.8585 15.7785 15.779C16.8582 14.6994 18.14 13.8432 19.5506 13.2591C20.9613 12.6751 22.4732 12.4996 24 12.5V11.5Z" fill="currentColor"/>
              </svg>
              <span className="hidden lg:inline-block">BOTCADE</span>
            </a>
            <ul className="flex items-center justify-end gap-6 flex-col absolute h-[calc(100dvh-var(--navbar-height))] w-full top-(--navbar-height) left-0 bg-[#f6f6f6] dark:bg-black border-t border-black/10 dark:border-white/20 opacity-0 invisible pointer-events-none p-6 lg:flex-row lg:relative lg:h-auto lg:w-auto lg:top-auto lg:left-auto lg:opacity-100 lg:visible lg:pointer-events-auto lg:border-none lg:p-0 lg:bg-transparent lg:dark:bg-transparent group-[.opened]/nav:opacity-100 group-[.opened]/nav:visible group-[.opened]/nav:pointer-events-auto transition-[opacity,visibility] duration-200 ease-out-cubic">
              <li>
                <a href="/#games" className="group/link relative text-black dark:text-white overflow-hidden flex items-center text-4xl lg:text-base pb-4 border-b border-black/10 dark:border-white/20 uppercase justify-end lg:w-auto lg:pb-0 lg:border-none lg:normal-case lg:justify-start">
                  <span className="lg:group-hover/link:-translate-y-full transition-transform duration-300 ease-out-cubic">Games</span>
                  <span className="hidden lg:block absolute bottom-0 translate-y-full group-hover/link:translate-y-0 transition-transform duration-300 ease-out-cubic left-0">Games</span>
                </a>
              </li>
              <li>
                <a href="/#about" className="group/link relative text-black dark:text-white overflow-hidden flex items-center text-4xl lg:text-base pb-4 border-b border-black/10 dark:border-white/20 uppercase justify-end lg:w-auto lg:pb-0 lg:border-none lg:normal-case lg:justify-start">
                  <span className="lg:group-hover/link:-translate-y-full transition-transform duration-300 ease-out-cubic">About</span>
                  <span className="hidden lg:block absolute bottom-0 translate-y-full group-hover/link:translate-y-0 transition-transform duration-300 ease-out-cubic left-0">About</span>
                </a>
              </li>
              <li>
                <a href="/#faq" className="group/link relative text-black dark:text-white overflow-hidden flex items-center text-4xl lg:text-base pb-4 border-b border-black/10 dark:border-white/20 uppercase justify-end lg:w-auto lg:pb-0 lg:border-none lg:normal-case lg:justify-start">
                  <span className="lg:group-hover/link:-translate-y-full transition-transform duration-300 ease-out-cubic">FAQ</span>
                  <span className="hidden lg:block absolute bottom-0 translate-y-full group-hover/link:translate-y-0 transition-transform duration-300 ease-out-cubic left-0">FAQ</span>
                </a>
              </li>
            </ul>
            <button id="menu-open" className="size-[clamp(2.5rem,2.356rem+0.616vw,2.75rem)] rounded-full bg-black dark:bg-white flex flex-col items-center justify-center lg:hidden">
              <span className="h-px w-1/2 bg-white dark:bg-black rounded-full -translate-y-0.5 group-[.opened]/nav:translate-y-px group-[.opened]/nav:rotate-45 transition-transform duration-300 ease-out-cubic"></span>
              <span className="h-px w-1/3 bg-white dark:bg-black rounded-full translate-y-0.5 translate-x-1/4 group-[.opened]/nav:w-1/2 group-[.opened]/nav:translate-y-0 group-[.opened]/nav:-rotate-45 transition-all duration-300 ease-out-cubic"></span>
              <span className="sr-only">open menu</span>
            </button>
          </div>
        </nav>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener("DOMContentLoaded", function() {
                var menuBtn = document.getElementById("menu-open");
                var nav = document.getElementById("navigation");
                var links = nav ? nav.querySelectorAll("a") : [];

                function toggleMenu() {
                  if (window.innerWidth > 1024) return;
                  nav.classList.toggle("opened");
                }

                if (menuBtn) {
                  menuBtn.addEventListener("click", toggleMenu);
                }

                links.forEach(function(link) {
                  if (link.getAttribute("href") && link.getAttribute("href").includes("#")) {
                    link.addEventListener("click", toggleMenu);
                  }
                });

                var modeButtons = document.querySelectorAll("#switch button");
                modeButtons.forEach(function(btn) {
                  btn.addEventListener("click", function() {
                    var mode = this.getAttribute("data-mode");
                    if (mode === "dark") {
                      document.documentElement.classList.add("dark");
                    } else {
                      document.documentElement.classList.remove("dark");
                    }
                    localStorage.setItem("mode", mode);
                    window.dispatchEvent(new CustomEvent("switchMode", { detail: { mode: mode } }));
                  });
                });
              });
            `,
          }}
        />

        <main className="flex flex-col gap-6xl overflow-x-clip relative" style={{ zIndex: 1 }}>
          {children}
        </main>

        <footer className="relative bg-black text-white" style={{ zIndex: 1 }}>
          <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
            <div className="flex flex-col lg:flex-row justify-between gap-12">
              <div>
                <p className="text-[14px] text-[#d1d1d1] font-body mb-3 uppercase tracking-wider">Want to play?</p>
                <a href="https://botcade.vercel.app/" className="text-white/80 hover:text-white text-sm transition-colors block no-underline">botcade.vercel.app</a>
              </div>
              <div>
                <p className="text-[14px] text-[#d1d1d1] font-body mb-3 uppercase tracking-wider">Stay in the loop</p>
                <div className="flex gap-4">
                  <a href="https://github.com/zen-ash-dev" className="text-white/60 hover:text-white text-sm transition-colors no-underline">GitHub</a>
                </div>
              </div>
              <div className="lg:text-right lg:ml-auto">
                <p className="text-[14px] text-[#d1d1d1] font-body">&copy; 2026 BOTCADE</p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
