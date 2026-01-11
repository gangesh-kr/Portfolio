import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';

gsap.registerPlugin(CSSPlugin);

const ROLES = [
    "FULLSTACK DEVELOPER",
    "CREATIVE TECHNOLOGIST",
    "WEBGL EXPERT",
    "SYSTEM ARCHITECT",
    "UI/UX ENGINEER"
];

const GARBLE = "0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/";

export function HeroText({ text, subtext }: { text: string, subtext: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const [displayRole, setDisplayRole] = useState(subtext);
    const [roleIndex, setRoleIndex] = useState(0);

    // 1. Split Text Entrance Animation
    useEffect(() => {
        if (!textRef.current) return;

        const chars = text.split('');
        textRef.current.innerHTML = '';
        chars.forEach((char) => {
            const span = document.createElement('span');
            span.innerText = char;
            span.style.display = 'inline-block';
            textRef.current?.appendChild(span);
            // Use GSAP to set initial state for consistency
            gsap.set(span, { autoAlpha: 0, y: 100 });
        });

        const spans = textRef.current.querySelectorAll('span');
        gsap.to(spans, {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            stagger: 0.05,
            ease: "power4.out",
            delay: 0.5
        });

    }, [text]);

    // 2. Role Scrambler
    useEffect(() => {
        const cycle = setInterval(() => {
            const nextIndex = (roleIndex + 1) % ROLES.length;
            setRoleIndex(nextIndex);

            const target = ROLES[nextIndex];
            let iter = 0;
            const scramble = setInterval(() => {
                setDisplayRole(target.split('').map((char, i) => {
                    if (i < iter) return char;
                    return GARBLE[Math.floor(Math.random() * GARBLE.length)];
                }).join(''));

                iter += 1 / 3;
                if (iter >= target.length) clearInterval(scramble);
            }, 30);

        }, 4000);

        return () => clearInterval(cycle);
    }, [roleIndex]);

    // 3. Mouse Light Effect (Flashlight on Text)
    // We update a CSS variable --x and --y on the container
    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            containerRef.current.style.setProperty('--x', `${x}px`);
            containerRef.current.style.setProperty('--y', `${y}px`);
        };

        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);

    return (
        <div
            ref={containerRef}
            className="flex flex-col select-none relative group"
            style={{
                perspective: '1000px',
                // Flashlight gradient mask
            } as any}
        >
            <h1
                ref={textRef}
                className="text-6xl md:text-9xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 transition-transform duration-100 ease-out will-change-transform"
                style={{
                    // Dynamic Lighting via mix-blend or gradient tracking
                    backgroundImage: `radial-gradient(circle at var(--x, 50%) var(--y, 50%), #FFD700 0%, #FFFFFF 30%, #333333 100%)`
                }}
            >
                {/* Content injected via JS for split text */}
            </h1>

            <div className="flex items-center gap-4">
                <div className="h-[2px] w-12 bg-gold" />
                <span className="font-mono text-sm md:text-base text-gold/80 tracking-widest uppercase">
                    {displayRole}
                </span>
            </div>
        </div>
    );
}
