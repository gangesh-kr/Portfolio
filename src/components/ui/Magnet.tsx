import { useRef, useEffect, ReactNode, CSSProperties } from 'react';

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  className?: string;
}

export function Magnet({
  children,
  padding = 380,      // large zone — felt across the whole hero center
  strength = 2.8,
  className = '',
}: MagnetProps) {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const rafRef    = useRef<number>(0);
  const cur       = useRef({ x: 0, y: 0 });
  const target    = useRef({ x: 0, y: 0 });
  const hovering  = useRef(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    // Continuous RAF lerp — never blocked by React renders
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      // Faster pull-in when hovering, slower release when leaving
      const speed = hovering.current ? 0.10 : 0.06;
      cur.current.x = lerp(cur.current.x, target.current.x, speed);
      cur.current.y = lerp(cur.current.y, target.current.y, speed);
      el.style.transform = `translate3d(${cur.current.x}px,${cur.current.y}px,0)`;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      const rect     = el.getBoundingClientRect();
      const cx       = rect.left + rect.width  / 2;
      const cy       = rect.top  + rect.height / 2;
      const inX      = e.clientX >= rect.left - padding && e.clientX <= rect.right  + padding;
      const inY      = e.clientY >= rect.top  - padding && e.clientY <= rect.bottom + padding;

      if (inX && inY) {
        hovering.current = true;
        target.current = {
          x: (e.clientX - cx) / strength,
          y: (e.clientY - cy) / strength,
        };
      } else {
        hovering.current = false;
        target.current = { x: 0, y: 0 };
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [padding, strength]);

  const style: CSSProperties = {
    display: 'inline-block',
    willChange: 'transform',
  };

  return (
    <div ref={wrapRef} style={style} className={className}>
      {children}
    </div>
  );
}

export default Magnet;
