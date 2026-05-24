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
  activeTransition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  inactiveTransition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  className = '',
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const currentPos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });
  const isHoveredRef = useRef(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // RAF loop for buttery smooth lerp — not tied to mousemove rate
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      const speed = isHoveredRef.current ? 0.12 : 0.08;

      currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, speed);
      currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, speed);

      // Only apply transform if there's meaningful movement
      const dx = Math.abs(currentPos.current.x - targetPos.current.x);
      const dy = Math.abs(currentPos.current.y - targetPos.current.y);

      el.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`;

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const isWithinX = e.clientX >= rect.left - padding && e.clientX <= rect.right + padding;
      const isWithinY = e.clientY >= rect.top - padding && e.clientY <= rect.bottom + padding;

      if (isWithinX && isWithinY) {
        if (!isHoveredRef.current) {
          isHoveredRef.current = true;
          setIsHovered(true);
        }
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        targetPos.current = {
          x: distX / strength,
          y: distY / strength,
        };
      } else {
        if (isHoveredRef.current) {
          isHoveredRef.current = false;
          setIsHovered(false);
        }
        targetPos.current = { x: 0, y: 0 };
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [padding, strength]); // only re-run if config changes

  const style: CSSProperties = {
    willChange: 'transform',
    display: 'inline-block',
    // We handle transform via RAF, CSS transition only for the snap-back feel
    transition: isHovered ? activeTransition : inactiveTransition,
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}

export default Magnet;