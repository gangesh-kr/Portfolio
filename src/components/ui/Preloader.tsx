import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
    onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Stars
        const stars: { x: number; y: number; z: number }[] = [];
        for (let i = 0; i < 1000; i++) {
            stars.push({
                x: (Math.random() - 0.5) * width,
                y: (Math.random() - 0.5) * height,
                z: Math.random() * width
            });
        }

        let animationId: number;
        let speed = 25; // Initial Speed (Warp)

        const render = () => {
            // Clear trails effect
            ctx.fillStyle = 'rgba(18, 18, 18, 0.4)'; // Charcoal with trail
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = '#FFD700'; // Gold stars

            const cx = width / 2;
            const cy = height / 2;

            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];
                star.z -= speed;

                if (star.z <= 0) {
                    star.z = width;
                    star.x = (Math.random() - 0.5) * width;
                    star.y = (Math.random() - 0.5) * height;
                }

                const x = (star.x - cx) * (width / star.z) + cx;
                const y = (star.y - cy) * (width / star.z) + cy;
                const size = (1 - star.z / width) * 3;

                if (x >= 0 && x <= width && y >= 0 && y <= height) {
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            animationId = requestAnimationFrame(render);
        };

        render();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', handleResize);

        // Sequence
        const tl = gsap.timeline({
            onComplete: () => {
                cancelAnimationFrame(animationId);
                window.removeEventListener('resize', handleResize);
                onComplete();
            }
        });

        // 1. Warp Speed Duration
        tl.to({}, {
            duration: 3.5, onUpdate: () => {
                // Speed up slightly then slow down?
                // Keep constant warp for impact
            }
        })
            // 2. Slow Down & Fade
            .to(textRef.current, { autoAlpha: 0, duration: 0.8 }, "-=1")
            .to(containerRef.current, { autoAlpha: 0, duration: 1.2 });

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
        };
    }, [onComplete]);

    return (
        <div ref={containerRef} className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal text-whitesmoke">
            <canvas ref={canvasRef} className="absolute inset-0" />

            <div ref={textRef} className="relative z-10 flex flex-col items-center">
                <div className="text-6xl md:text-8xl font-black tracking-tighter mix-blend-difference mb-4">
                    INITIALIZING
                </div>
                <div className="flex gap-2">
                    <span className="w-2 h-2 bg-gold animate-pulse" />
                    <span className="w-2 h-2 bg-gold animate-pulse delay-75" />
                    <span className="w-2 h-2 bg-gold animate-pulse delay-150" />
                </div>
                <div className="mt-4 font-mono text-xs text-gold/60">
                    ESTABLISHING_UPLINK...
                </div>
            </div>
        </div>
    );
}
