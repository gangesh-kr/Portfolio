import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── Lenis smooth scroll, wired into GSAP ticker ──────────────────────────────
const lenis = new Lenis({
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease
  smoothWheel: true,
  touchMultiplier: 2,
})

// Wire Lenis into GSAP's RAF so ScrollTrigger scrub stays in sync
gsap.ticker.add((time) => {
  lenis.raf(time * 1000) // gsap time is in seconds, lenis wants ms
})

// Disable GSAP's own lag smoothing — Lenis handles it
gsap.ticker.lagSmoothing(0)

// Also tell ScrollTrigger to use Lenis scroll position
lenis.on('scroll', ScrollTrigger.update)

// Expose lenis globally so components can pause it (e.g. modals)
;(window as any).__lenis = lenis

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)