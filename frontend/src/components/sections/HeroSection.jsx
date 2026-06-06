import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import ScrollReveal from "../common/ScrollReveal";
import PixelButton from "../ui/PixelButton";
import Tag from "../ui/Tag";
import PixelCanvas from "../ui/PixelCanvas";
import { SITE_CONFIG } from "../../constants/data";

export default function HeroSection() {
  const sectionRef = useRef(null);

  /* ── Parallax motion (desktop only) ── */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springConfig = { stiffness: 60, damping: 20, mass: 1 };
  const mx = useSpring(rawX, springConfig);
  const my = useSpring(rawY, springConfig);

  const h1RotateX = useTransform(my, [-0.5, 0.5], [5, -5]);
  const h1RotateY = useTransform(mx, [-0.5, 0.5], [-5, 5]);
  const imgX = useTransform(mx, [-0.5, 0.5], [18, -18]);
  const imgY = useTransform(my, [-0.5, 0.5], [14, -14]);
  const tagsX = useTransform(mx, [-0.5, 0.5], [12, -12]);
  const tagsY = useTransform(my, [-0.5, 0.5], [10, -10]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const handleMouseMove = (e) => {
      const rect = section.getBoundingClientRect();
      rawX.set((e.clientX - (rect.left + rect.width / 2)) / rect.width);
      rawY.set((e.clientY - (rect.top + rect.height / 2)) / rect.height);
    };
    const handleMouseLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };
    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [rawX, rawY]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative overflow-hidden border-b border-line"
      style={{ perspective: "1200px" }}
    >
      {/* Noise texture overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "180px 180px",
          opacity: 0.028,
        }}
      />

      {/* ═══════════════════════════════════════════════════════
          DESKTOP: Top bar (absolute, md+ only)
          ═══════════════════════════════════════════════════════ */}
      <div
        className="hidden md:flex absolute top-[120px] left-12 right-12 items-start justify-between"
        style={{ zIndex: 5, pointerEvents: "none" }}
      >
        <span className="font-mono text-[10px] text-ink-4 tracking-[2px] uppercase">
          [01] — Portfolio 2025
        </span>
        <ScrollReveal delay={0.2}>
          <div className="max-w-[340px] text-right text-[12px] text-ink-3 leading-[1.7] font-mono font-light">
            {SITE_CONFIG.heroDescription}
          </div>
        </ScrollReveal>
      </div>

      {/* ═══════════════════════════════════════════════════════
          DESKTOP: Pixel canvas (absolute, md+ only)
          Pinned bottom-right, sized to fit without cropping
          ═══════════════════════════════════════════════════════ */}
      <motion.div
        className="hidden md:block absolute select-none"
        style={{
          bottom: 0,
          right: 0,
          width: "clamp(240px, 35vw, 500px)",
          height: "100vh",
          zIndex: 1,
          x: imgX,
          y: imgY,
        }}
      >
        <PixelCanvas src="/logo_2.png" pixelSize={4} anchor="bottom-center" />
      </motion.div>

      {/* ═══════════════════════════════════════════════════════
          CONTENT WRAPPER — flows naturally, no overlap
          Desktop: min-h-screen + flex-1 spacer pushes to bottom
          Mobile:  everything stacks vertically, no absolute
          ═══════════════════════════════════════════════════════ */}
      <div className="relative flex flex-col min-h-screen">
        {/* ── Mobile top info (flows in document, NOT absolute) ── */}
        <div className="md:hidden pt-24 px-6 space-y-2">
          <span className="font-mono text-[10px] text-ink-4 tracking-[2px] uppercase block">
            [01] — Portfolio 2025
          </span>
          <div className="text-[12px] text-ink-3 leading-[1.7] font-mono font-light max-w-[320px]">
            {SITE_CONFIG.heroDescription}
          </div>
        </div>

        {/* Spacer — pushes content to bottom on desktop, collapses on mobile */}
        <div className="flex-1 min-h-6 md:min-h-0" />

        {/* ── Heading ── */}
        <motion.h1
          className="font-playfair font-bold leading-[0.95] mb-6 md:mb-12 px-6 sm:px-8 md:px-12 md:max-w-[55%]"
          style={{
            fontSize: "clamp(46px, 11vw, 148px)",
            letterSpacing: "clamp(-2px, -0.4vw, -5px)",
            position: "relative",
            zIndex: 3,
            rotateX: h1RotateX,
            rotateY: h1RotateY,
            transformStyle: "preserve-3d",
            pointerEvents: "none",
            textShadow: `
              1px  1px  0px rgba(0,0,0,0.06),
              2px  2px  0px rgba(0,0,0,0.05),
              4px  4px  0px rgba(0,0,0,0.04),
              8px  8px  0px rgba(0,0,0,0.03),
              14px 14px 28px rgba(0,0,0,0.08)
            `,
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          I build
          <br />
          <em
            className="italic text-accent font-pixelify"
            style={{
              display: "inline-block",
              textShadow: `
                1px  1px  0px rgba(0,0,0,0.08),
                3px  3px  0px rgba(0,0,0,0.06),
                6px  6px  0px rgba(0,0,0,0.05),
                10px 10px 0px rgba(0,0,0,0.04),
                18px 18px 32px rgba(0,0,0,0.12)
              `,
              transform: "translateZ(20px) scale(1.01)",
              transformStyle: "preserve-3d",
            }}
          >
            digital
          </em>
          <br />
          products.
        </motion.h1>

        {/* ── Mobile pixel image (flows inline, NOT absolute) ── */}
        <div
          className="block md:hidden mx-auto mb-6"
          style={{
            width: "min(85vw, 380px)",
            aspectRatio: "3 / 4",
            position: "relative",
            zIndex: 2,
          }}
        >
          <PixelCanvas src="/logo_2.png" anchor="center" />
        </div>

        {/* ── Tags + CTA ── */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 sm:gap-4 px-6 sm:px-8 md:px-12 pb-10 md:pb-16"
          style={{
            position: "relative",
            zIndex: 4,
            x: tagsX,
            y: tagsY,
            pointerEvents: "none",
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
        >
          <div
            className="flex gap-2 flex-wrap"
            style={{
              width: "fit-content",
              maxWidth: "100%",
              pointerEvents: "auto",
            }}
          >
            {SITE_CONFIG.heroTags.map((tag, idx) => (
              <motion.div
                key={tag}
                style={{
                  display: "inline-block",
                  boxShadow: `0 ${2 + idx}px ${6 + idx * 2}px rgba(0,0,0,${0.06 + idx * 0.01})`,
                  borderRadius: "9999px",
                  transform: `translateZ(${idx * 2}px)`,
                }}
                whileHover={{
                  y: -3,
                  boxShadow: `0 8px 20px rgba(0,0,0,0.12)`,
                  transition: { duration: 0.2 },
                }}
              >
                <Tag>{tag}</Tag>
              </motion.div>
            ))}
          </div>

          <div
            style={{
              width: "fit-content",
              flexShrink: 0,
              pointerEvents: "auto",
              overflow: "visible",
            }}
          >
            <PixelButton href="#projects" pixelSize={6}>
              <span className="text-shadow-xl text-shadow-black">
                View Work
              </span>
            </PixelButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
