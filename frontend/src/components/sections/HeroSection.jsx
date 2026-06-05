import { motion } from "framer-motion";
import ScrollReveal from "../common/ScrollReveal";
import MagneticButton from "../common/MagneticButton";
import Tag from "../ui/Tag";
import PixelCanvas from "../ui/PixelCanvas";
import { SITE_CONFIG } from "../../constants/data";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-end px-12 pb-16 relative overflow-hidden border-b border-line max-[960px]:px-6 max-[960px]:pb-12"
    >
      {/* ─── Pixelated Image (bottom-right) ─── */}
      <div
        className="absolute -bottom-20 right-0 select-none"
        style={{
          width: "clamp(320px, 42vw, 620px)",
          height: "clamp(420px, 88vh, 820px)",
          zIndex: 1,
        }}
      >
        <PixelCanvas src="/logo_2.png" pixelSize={5} />
      </div>

      {/* Top bar */}
      <div
        className="absolute top-[120px] left-12 right-12 flex items-start justify-between max-[960px]:left-6 max-[960px]:right-6"
        style={{ zIndex: 2 }}
      >
        <span className="font-mono text-[10px] text-ink-4 tracking-[2px] uppercase mt-1">
          [01] — Portfolio 2025
        </span>
        <ScrollReveal delay={0.2}>
          <div className="max-w-[340px] text-right text-sm text-ink-3 leading-[1.7] font-mono font-light text-[12px]">
            {SITE_CONFIG.heroDescription}
          </div>
        </ScrollReveal>
      </div>

      {/* Main heading */}
      <motion.h1
        className="font-playfair font-bold leading-[0.95] mb-12"
        style={{
          fontSize: "clamp(72px, 10vw, 148px)",
          letterSpacing: "-5px",
          position: "relative",
          zIndex: 2,
          maxWidth: "55%",
        }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        I build
        <br />
        <em className="italic text-accent font-pixelify">digital</em>
        <br />
        products.
      </motion.h1>

      {/* Bottom bar */}
      <motion.div
        className="flex items-end justify-between max-[960px]:flex-col max-[960px]:items-start max-[960px]:gap-5"
        style={{ position: "relative", zIndex: 2 }}
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
          <MagneticButton href="#projects" className="font-pixelify">
            View Work →
          </MagneticButton>
          <span className="font-mono text-[12px] text-ink-4 tracking-[1.5px] uppercase">
            ↓ Scroll
          </span>
        </div>
      </motion.div>
    </section>
  );
}
