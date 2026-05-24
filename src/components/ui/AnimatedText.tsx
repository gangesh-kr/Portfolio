import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedText({ text, className = '', style }: AnimatedTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const words = containerRef.current.querySelectorAll<HTMLSpanElement>('.anim-word');
    if (words.length === 0) return;

    // Clean up any previous context
    ctxRef.current?.revert();

    ctxRef.current = gsap.context(() => {
      // Batch words into groups of 5 to reduce ScrollTrigger count
      const wordArray = Array.from(words);
      const BATCH = 5;
      const batches: HTMLSpanElement[][] = [];
      for (let i = 0; i < wordArray.length; i += BATCH) {
        batches.push(wordArray.slice(i, i + BATCH));
      }

      batches.forEach((batch, batchIndex) => {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top 85%',
          end: 'bottom 40%',
          scrub: 0.5,
          onUpdate: (self) => {
            // Map progress to each batch sequentially
            const batchStart = batchIndex / batches.length;
            const batchEnd = (batchIndex + 1) / batches.length;
            const rawP = (self.progress - batchStart) / (batchEnd - batchStart);
            const p = Math.max(0, Math.min(1, rawP));

            batch.forEach((word, wi) => {
              const wordProgress = (p * batch.length - wi);
              const opacity = Math.max(0.15, Math.min(1, wordProgress));
              word.style.opacity = String(opacity);
            });
          },
        });
      });
    });

    return () => {
      ctxRef.current?.revert();
    };
  }, [text]);

  const words = text.split(' ');

  return (
    <p
      ref={containerRef}
      style={style}
      className={`${className} flex flex-wrap justify-center relative select-none leading-relaxed w-full gap-x-[0.22em] gap-y-[0.1em]`}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="anim-word inline-block"
          style={{ opacity: 0.15 }}
        >
          {word}
        </span>
      ))}
    </p>
  );
}

export default AnimatedText;