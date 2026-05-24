import { useRef, useState, useEffect, ReactNode, CSSProperties } from 'react';

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

export function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className = '',
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const hoveredRef = useRef(false);
  const rafRef = useRef<number>(0);
  const [renderState, setRenderState] = useState({ x: 0, y: 0, hovered: false });

  useEffect(() => {
    let pending = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const isWithinX = e.clientX >= rect.left - padding && e.clientX <= rect.right + padding;
      const isWithinY = e.clientY >= rect.top - padding && e.clientY <= rect.bottom + padding;

      if (isWithinX && isWithinY) {
        posRef.current = {
          x: (e.clientX - centerX) / strength,
          y: (e.clientY - centerY) / strength,
        };
        hoveredRef.current = true;
      } else {
        posRef.current = { x: 0, y: 0 };
        hoveredRef.current = false;
      }

      // Throttle state updates via rAF
      if (!pending) {
        pending = true;
        rafRef.current = requestAnimationFrame(() => {
          setRenderState({
            x: posRef.current.x,
            y: posRef.current.y,
            hovered: hoveredRef.current,
          });
          pending = false;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [padding, strength]);

  const style: CSSProperties = {
    transform: `translate3d(${renderState.x}px, ${renderState.y}px, 0)`,
    transition: renderState.hovered ? activeTransition : inactiveTransition,
    willChange: renderState.hovered ? 'transform' : 'auto',
    display: 'inline-block',
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}

export default Magnet;