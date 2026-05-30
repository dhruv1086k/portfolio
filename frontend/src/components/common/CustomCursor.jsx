import { useEffect, useRef, useState } from 'react';
import useMousePosition from '../../hooks/useMousePosition';
import useMediaQuery from '../../hooks/useMediaQuery';

export default function CustomCursor() {
  const { x, y } = useMousePosition();
  const ringRef = useRef(null);
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [isBig, setIsBig] = useState(false);
  const isMobile = useMediaQuery('(max-width: 960px)');

  // Smooth ring follow
  useEffect(() => {
    let animId;
    const animate = () => {
      setRingPos((prev) => ({
        x: prev.x + (x - prev.x) * 0.1,
        y: prev.y + (y - prev.y) * 0.1,
      }));
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [x, y]);

  // Listen for hover on interactive elements
  useEffect(() => {
    const selectors = 'a, button, .cursor-hover';
    const handleEnter = () => setIsBig(true);
    const handleLeave = () => setIsBig(false);

    const elements = document.querySelectorAll(selectors);
    elements.forEach((el) => {
      el.addEventListener('mouseenter', handleEnter);
      el.addEventListener('mouseleave', handleLeave);
    });

    // Use MutationObserver to pick up dynamically added elements
    const observer = new MutationObserver(() => {
      const newElements = document.querySelectorAll(selectors);
      newElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleEnter);
        el.removeEventListener('mouseleave', handleLeave);
        el.addEventListener('mouseenter', handleEnter);
        el.addEventListener('mouseleave', handleLeave);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', handleEnter);
        el.removeEventListener('mouseleave', handleLeave);
      });
      observer.disconnect();
    };
  }, []);

  if (isMobile) return null;

  return (
    <>
      <div
        className="custom-cursor"
        style={{ left: `${x}px`, top: `${y}px` }}
      />
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${isBig ? 'big' : ''}`}
        style={{ left: `${ringPos.x}px`, top: `${ringPos.y}px` }}
      />
    </>
  );
}
