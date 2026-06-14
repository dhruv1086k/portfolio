import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const springConfig = { stiffness: 150, damping: 15, mass: 0.5 };

export default function MagneticButton({
  children,
  className = "",
  href,
  onClick,
  ...props
}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * 0.18);
    y.set(dy * 0.18 - 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Tag = href ? motion.a : motion.button;

  return (
    <Tag
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`cursor-hover inline-flex items-center gap-3 bg-ink text-cream no-underline text-[13px] tracking-[1px] uppercase px-8 py-4 rounded-full font-instrument font-normal transition-colors duration-300 hover:bg-accent ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
