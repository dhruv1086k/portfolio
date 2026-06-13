import { useRef } from 'react';
import { motion } from 'framer-motion';

export default function MagneticButton({ children, className = '', href, onClick, ...props }) {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translateY(-2px) translate(${dx * 0.18}px, ${dy * 0.18}px)`;
  };

  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  const Tag = href ? 'a' : 'button';

  return (
    <Tag
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`cursor-hover inline-flex items-center gap-3 bg-ink text-cream no-underline text-[13px] tracking-[1px] uppercase px-8 py-4 rounded-full font-instrument font-normal transition-all duration-300 hover:bg-accent hover:-translate-y-0.5 ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
