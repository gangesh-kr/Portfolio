import { ReactNode, ElementType, CSSProperties, useEffect, useRef } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

/**
 * Lightweight FadeIn using IntersectionObserver + CSS transitions.
 * Replaces Framer Motion whileInView to avoid JS animation overhead on scroll.
 */
export function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  as: Tag = 'div',
  className = '',
  style,
}: FadeInProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translate3d(0,0,0)';
          observer.disconnect(); // once = true equivalent
        }
      },
      { threshold: 0, rootMargin: '50px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const combinedStyle: CSSProperties = {
    opacity: 0,
    transform: `translate3d(${x}px, ${y}px, 0)`,
    transition: `opacity ${duration}s cubic-bezier(0.25,0.1,0.25,1) ${delay}s, transform ${duration}s cubic-bezier(0.25,0.1,0.25,1) ${delay}s`,
    willChange: 'opacity, transform',
    ...style,
  };

  // @ts-ignore — dynamic tag typing
  return (
    <Tag ref={ref} className={className} style={combinedStyle}>
      {children}
    </Tag>
  );
}