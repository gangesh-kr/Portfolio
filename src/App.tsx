import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { WebGL } from './core/WebGL';
import { Preloader } from './components/ui/Preloader';
import { HeroText } from './components/ui/HeroText';
import { ProjectDetail } from './components/ui/ProjectDetail';
import SkillsSection from './components/ui/SkillsSection';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CSSPlugin } from 'gsap/CSSPlugin';

gsap.registerPlugin(ScrollTrigger, CSSPlugin);

function App() {
    const mountRef = useRef<HTMLDivElement>(null);
    const webglRef = useRef<WebGL | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Init Smooth Scroll
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
        });

        // Sync WebGL Scroll & GSAP ScrollTrigger
        lenis.on('scroll', () => {
            webglRef.current?.setScroll(lenis.scroll);
            ScrollTrigger.update();
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        if (!mountRef.current) return;

        // Init WebGL
        webglRef.current = new WebGL(mountRef.current);

        return () => {
            webglRef.current?.dispose();
            lenis.destroy();
        };
    }, []);

    return (
        <div className="relative w-full min-h-[500vh] bg-charcoal">
            {loading && <Preloader onComplete={() => setLoading(false)} />}

            <ProjectDetail />

            {/* 3D Layer */}
            <div ref={mountRef} className="fixed inset-0 z-0" />

            {/* UI Layer */}
            {!loading && (
                <>
                    {/* Hero Section */}
                    <main className="relative z-10 w-full h-screen pointer-events-none mix-blend-difference text-whitesmoke p-8 md:p-16 flex flex-col justify-center">
                        <HeroText
                            text="GANGESH KUMAR"
                            subtext="FULLSTACK DEVELOPER // CREATIVE TECHNOLOGIST"
                        />

                        <footer className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                            <div className="font-mono text-xs text-gold opacity-60">
                                EST. 2026<br />
                                SYSTEM.V2.READY
                            </div>
                            <div className="font-mono text-xs text-gold opacity-60 animate-bounce">
                                SCROLL ↓
                            </div>
                        </footer>
                    </main>

                    {/* Skills Section */}
                    <SkillsSection />
                </>
            )}
        </div>
    );
}

export default App;

