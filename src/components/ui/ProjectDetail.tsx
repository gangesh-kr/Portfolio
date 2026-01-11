import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';

gsap.registerPlugin(CSSPlugin);
import { useStore } from '../../store/useStore';

export function ProjectDetail() {
    const activeProject = useStore((state) => state.activeProject);
    const setActiveProject = useStore((state) => state.setActiveProject);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeProject && containerRef.current) {
            gsap.fromTo(containerRef.current,
                { autoAlpha: 0, y: 50 },
                { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
        }
    }, [activeProject]);

    if (!activeProject) return null;

    const close = () => {
        gsap.to(containerRef.current, {
            autoAlpha: 0,
            y: 50,
            duration: 0.3,
            onComplete: () => setActiveProject(null)
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 pointer-events-none">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-charcoal/90 backdrop-blur-sm pointer-events-auto"
                onClick={close}
            />

            {/* Content */}
            <div
                ref={containerRef}
                className="relative z-10 w-full max-w-4xl bg-midnight border border-white/10 p-8 md:p-12 pointer-events-auto shadow-2xl"
            >
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <div className="text-gold font-mono text-sm mb-2">{activeProject.timeline} // {activeProject.role}</div>
                        <h2 className="text-4xl md:text-6xl font-bold font-sans text-whitesmoke tracking-tighter uppercase">
                            {activeProject.title}
                        </h2>
                    </div>
                    <button
                        onClick={close}
                        className="w-12 h-12 flex items-center justify-center border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <p className="font-mono text-sm text-gray-400 leading-relaxed">
                            {activeProject.description}
                        </p>
                        <div className="flex gap-4">
                            <button className="px-6 py-3 bg-white text-black font-mono text-xs uppercase hover:bg-gold hover:text-white transition-colors">
                                View Case Study
                            </button>
                            <button className="px-6 py-3 border border-white/20 text-white font-mono text-xs uppercase hover:bg-white/10 transition-colors">
                                Live Demo
                            </button>
                        </div>
                    </div>
                    <div className="h-64 bg-glass border border-white/5 flex items-center justify-center">
                        <span className="font-mono text-xs text-white/20">PROJECT_MEDIA_PLACEHOLDER</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
