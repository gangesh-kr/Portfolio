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

  useEffect(() => {
    if (!containerRef.current) return;

    const words = containerRef.current.querySelectorAll('.anim-word');
    if (words.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.02,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            end: 'bottom 40%',
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [text]);

  const words = text.split(' ');

  return (
    <p
      ref={containerRef}
      style={style}
      className={`${className} flex flex-wrap justify-center relative select-none leading-relaxed w-full gap-x-[0.22em] gap-y-[0.1em]`}
    >
      {words.map((word, i) => (
        <span key={i} className="anim-word inline-block opacity-[0.15] will-change-[opacity]">
          {word}
        </span>
      ))}
    </p>
  );
}

export default AnimatedText;
