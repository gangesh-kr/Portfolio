import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ChapterLabel {
    id: string;
    label: string;
    progress: number; // 0-1
}

const CHAPTERS: ChapterLabel[] = [
    { id: 'hero', label: 'Entry Point', progress: 0 },
    { id: 'warp', label: 'Warp Drive', progress: 0.17 },
    { id: 'skills', label: 'Skills Orbit', progress: 0.35 },
    { id: 'experience', label: 'Mission Log', progress: 0.58 },
    { id: 'contact', label: 'Transmission', progress: 0.80 },
];

export function StoryOverlay() {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeChapter, setActiveChapter] = useState('hero');
    const [showChapterLabel, setShowChapterLabel] = useState(false);
    const labelRef = useRef<HTMLDivElement>(null);
    const labelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const prevChapterRef = useRef('hero');

    useEffect(() => {
        const handleScroll = () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
            setScrollProgress(progress);

            // Determine active chapter
            let current = CHAPTERS[0];
            for (let i = CHAPTERS.length - 1; i >= 0; i--) {
                if (progress >= CHAPTERS[i].progress) {
                    current = CHAPTERS[i];
                    break;
                }
            }

            if (current.id !== prevChapterRef.current) {
                prevChapterRef.current = current.id;
                setActiveChapter(current.id);
                setShowChapterLabel(true);

                if (labelTimeoutRef.current) clearTimeout(labelTimeoutRef.current);
                labelTimeoutRef.current = setTimeout(() => {
                    setShowChapterLabel(false);
                }, 2000);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Animate chapter label in/out
    useEffect(() => {
        if (!labelRef.current) return;
        if (showChapterLabel) {
            gsap.fromTo(labelRef.current,
                { autoAlpha: 0, y: 8 },
                { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }
            );
        } else {
            gsap.to(labelRef.current, { autoAlpha: 0, y: -6, duration: 0.5, ease: 'power2.in' });
        }
    }, [showChapterLabel]);

    const activeChapterData = CHAPTERS.find(c => c.id === activeChapter);

    return (
        <>
            {/* Progress bar — top edge */}
            <div className="fixed top-0 left-0 right-0 z-40 h-[2px]">
                <div
                    className="h-full bg-gradient-to-r from-gold via-yellow-300 to-gold transition-none"
                    style={{ width: `${scrollProgress * 100}%`, willChange: 'width' }}
                />
            </div>

            {/* Chapter indicator — top right */}
            <div className="fixed top-6 right-8 z-40 flex flex-col items-end gap-3">
                {/* Chapter pips */}
                <div className="flex flex-col gap-2">
                    {CHAPTERS.map((ch, i) => (
                        <button
                            key={ch.id}
                            onClick={() => {
                                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                                window.scrollTo({ top: ch.progress * maxScroll, behavior: 'smooth' });
                            }}
                            title={ch.label}
                            className="group flex items-center gap-2 cursor-pointer"
                        >
                            <span className={`
                                font-mono text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100
                                transition-all duration-300 text-gold
                                ${ch.id === activeChapter ? 'opacity-70' : ''}
                            `}>
                                {ch.label}
                            </span>
                            <div className={`
                                w-[6px] h-[6px] rounded-full transition-all duration-500
                                ${ch.id === activeChapter
                                    ? 'bg-gold scale-150 shadow-[0_0_6px_2px_rgba(212,175,55,0.6)]'
                                    : 'bg-white/20 hover:bg-white/50'
                                }
                            `} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Cinematic chapter label — center bottom */}
            <div
                ref={labelRef}
                className="fixed bottom-16 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
                style={{ opacity: 0 }}
            >
                <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm border border-gold/20 px-6 py-3 rounded-sm">
                    <div className="w-1 h-1 bg-gold rounded-full animate-pulse" />
                    <span className="font-mono text-xs text-gold/80 uppercase tracking-[0.3em]">
                        {activeChapterData?.label}
                    </span>
                    <div className="w-1 h-1 bg-gold rounded-full animate-pulse" />
                </div>
            </div>

            {/* Scroll percentage — bottom left */}
            <div className="fixed bottom-6 left-8 z-40 font-mono text-[10px] text-gold/30 tracking-widest">
                {String(Math.round(scrollProgress * 100)).padStart(3, '0')}%
            </div>

            {/* Scan lines overlay — subtle aesthetic */}
            <div
                className="fixed inset-0 z-30 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 3px)',
                    backgroundSize: '100% 3px',
                }}
            />
        </>
    );
}