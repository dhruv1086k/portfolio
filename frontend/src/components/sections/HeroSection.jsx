import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../common/ScrollReveal';
import MagneticButton from '../common/MagneticButton';
import Tag from '../ui/Tag';
import { SITE_CONFIG } from '../../constants/data';

export default function HeroSection() {
  const bgTextRef = useRef(null);

  // Parallax effect on background text
  useEffect(() => {
    const handleScroll = () => {
      if (!bgTextRef.current) return;
      const y = window.scrollY;
      bgTextRef.current.style.transform = `translate(-50%, calc(-54% + ${y * 0.15}px))`;
      bgTextRef.current.style.opacity = Math.max(0, 1 - y / 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-end px-12 pb-16 relative overflow-hidden border-b border-line max-[960px]:px-6 max-[960px]:pb-12"
    >
      {/* Background initials */}
      <motion.div
        ref={bgTextRef}
        className="absolute top-1/2 left-1/2 font-playfair font-black text-transparent leading-none whitespace-nowrap pointer-events-none select-none"
        style={{
          fontSize: 'clamp(200px, 28vw, 420px)',
          WebkitTextStroke: '1px var(--color-line)',
          letterSpacing: '-10px',
          transform: 'translate(-50%, -54%)',
        }}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {SITE_CONFIG.initials}
      </motion.div>

      {/* Top bar */}
      <div className="absolute top-[120px] left-12 right-12 flex items-start justify-between max-[960px]:left-6 max-[960px]:right-6">
        <span className="font-mono text-[11px] text-ink-4 tracking-[2px] uppercase mt-1">
          [01] — Portfolio 2025
        </span>
        <ScrollReveal delay={0.2}>
          <div className="max-w-[340px] text-right text-sm text-ink-3 leading-[1.7] font-light">
            {SITE_CONFIG.heroDescription}
          </div>
        </ScrollReveal>
      </div>

      {/* Main heading */}
      <motion.h1
        className="relative z-2 font-playfair font-black leading-[0.92] mb-12"
        style={{
          fontSize: 'clamp(72px, 10vw, 148px)',
          letterSpacing: '-5px',
        }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        I build<br />
        <em className="italic text-accent">digital</em><br />
        products.
      </motion.h1>

      {/* Bottom bar */}
      <motion.div
        className="relative z-2 flex items-end justify-between max-[960px]:flex-col max-[960px]:items-start max-[960px]:gap-5"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5 }}
      >
        <div className="flex gap-2.5 flex-wrap">
          {SITE_CONFIG.heroTags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <div className="flex items-center gap-5">
          <MagneticButton href="#projects">View Work →</MagneticButton>
          <span className="font-mono text-[11px] text-ink-4 tracking-[1.5px] uppercase">
            ↓ Scroll
          </span>
        </div>
      </motion.div>
    </section>
  );
}
