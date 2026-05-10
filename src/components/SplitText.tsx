'use client'

import { useEffect, useRef } from 'react'

function splitIntoChars(el: HTMLElement) {
  const text = el.textContent || ''
  el.textContent = ''
  const chars = text.split('')
  chars.forEach((char) => {
    const span = document.createElement('span')
    span.className = 'char'
    span.textContent = char === ' ' ? '\u00A0' : char
    el.appendChild(span)
  })
}

function splitIntoLines(el: HTMLElement) {
  const text = el.textContent || ''
  el.textContent = ''
  const words = text.split(/(\s+)/)
  const container = document.createElement('span')
  container.className = 'line'
  words.forEach((word) => {
    const span = document.createElement('span')
    span.textContent = word
    container.appendChild(span)
  })
  el.appendChild(container)
}

export default function SplitText() {
  const done = useRef(false)

  useEffect(() => {
    if (done.current) return
    done.current = true

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    document.querySelectorAll('[data-split-heading]').forEach((el) => {
      splitIntoChars(el as HTMLElement)
      if (prefersReduced) (el as HTMLElement).style.opacity = '1'
    })

    document.querySelectorAll('[data-split-text]').forEach((el) => {
      splitIntoLines(el as HTMLElement)
      if (prefersReduced) (el as HTMLElement).style.opacity = '1'
    })

    if (prefersReduced) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const section = entry.target

          const heading = section.querySelector('[data-split-heading]')
          if (heading) {
            const h = heading as HTMLElement
            h.style.opacity = '1'
            h.querySelectorAll('.char').forEach((char, i) => {
              const c = char as HTMLElement
              c.style.opacity = '0'
              c.style.transform = 'translateY(60px) rotateX(-40deg)'
              requestAnimationFrame(() => {
                c.style.transitionDelay = `${i * 25}ms`
                c.style.opacity = '1'
                c.style.transform = 'translateY(0) rotateX(0)'
              })
            })
          }

          const body = section.querySelector('[data-split-text]')
          if (body) {
            const b = body as HTMLElement
            b.style.opacity = '1'
            b.querySelectorAll('.line').forEach((line, i) => {
              const l = line as HTMLElement
              l.style.opacity = '0'
              l.style.transform = 'translateY(30px)'
              requestAnimationFrame(() => {
                l.style.transitionDelay = `${i * 100}ms`
                l.style.opacity = '1'
                l.style.transform = 'translateY(0)'
              })
            })
          }

          observer.unobserve(section)
        })
      },
      { threshold: 0.05 }
    )

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  return null
}
