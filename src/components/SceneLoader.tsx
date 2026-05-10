'use client'

import { useEffect } from 'react'

export default function SceneLoader() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const html = document.documentElement
      if (!html.classList.contains('scene-ready')) {
        html.classList.add('mounted', 'scene-ready')
        html.classList.remove('scroll-disabled')
      }
    }, 8000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="fixed z-100 w-full h-screen top-0 left-0 bg-[#f6f6f6] dark:bg-black items-center justify-center pointer-events-none scene-ready-hide mounted-hide transition-[opacity,visibility] duration-500 ease-out-cubic"
      style={{ display: 'flex' }}
    >
      <div className="flex flex-col items-center gap-6">
        <svg viewBox="0 0 24 24" fill="none" className="w-[clamp(2.5rem,2.356rem+0.616vw,2.75rem)] text-neutral-200 dark:text-neutral-800 scene-ready-scale transition-transform duration-300 ease-out-cubic">
          <path fillRule="evenodd" clipRule="evenodd" d="M24 11.5C22.4731 11.5001 20.961 11.3267 19.5503 10.7425C18.1395 10.1582 16.8577 9.30173 15.778 8.22201C14.6983 7.1423 13.8418 5.86046 13.2576 4.44972C12.6733 3.03897 12.4999 1.52695 12.5 0H11.5C11.5002 1.52683 11.3252 3.03875 10.7411 4.44942C10.1569 5.86009 9.30065 7.14188 8.2211 8.22159C7.14154 9.3013 5.85988 10.1578 4.44929 10.7421C3.03871 11.3265 1.52683 11.5 0 11.5V12.5C1.52672 12.4997 3.03855 12.6752 4.44912 13.2593C5.8597 13.8434 7.14138 14.6997 8.22096 15.7792C9.30054 16.8587 10.1569 18.1404 10.741 19.5509C11.3252 20.9615 11.5002 22.4733 11.5 24H12.5C12.4999 22.4732 12.6738 20.9613 13.2581 19.5508C13.8424 18.1402 14.6988 16.8585 15.7785 15.779C16.8582 14.6994 18.14 13.8432 19.5506 13.2591C20.9613 12.6751 22.4732 12.4996 24 12.5V11.5Z" fill="currentColor" />
        </svg>
        <div className="w-32 h-px bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div className="h-full bg-neutral-400 dark:bg-neutral-600 rounded-full transition-all duration-300 ease-out" id="scene-progress-bar" style={{ width: '0%' }} />
        </div>
        <span id="scene-progress" className="text-xs text-neutral-300 dark:text-neutral-700 tabular-nums font-mono">0%</span>
      </div>
    </div>
  )
}
