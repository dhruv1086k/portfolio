import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import ScrollReveal from "../common/ScrollReveal";
import MagneticButton from "../common/MagneticButton";
import PixelButton from "../ui/PixelButton";
import Tag from "../ui/Tag";
import PixelCanvas from "../ui/PixelCanvas";
import { SITE_CONFIG } from "../../constants/data";

export default function HeroSection() {
  const sectionRef = useRef(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springConfig = { stiffness: 60, damping: 20, mass: 1 };
  const mx = useSpring(rawX, springConfig);
  const my = useSpring(rawY, springConfig);

  const h1RotateX = useTransform(my, [-0.5, 0.5], [5, -5]);
  const h1RotateY = useTransform(mx, [-0.5, 0.5], [-5, 5]);

  const imgX = useTransform(mx, [-0.5, 0.5], [18, -18]);
  const imgY = useTransform(my, [-0.5, 0.5], [14, -14]);

  const descX = useTransform(mx, [-0.5, 0.5], [8, -8]);
  const descY = useTransform(my, [-0.5, 0.5], [6, -6]);

  const tagsX = useTransform(mx, [-0.5, 0.5], [12, -12]);
  const tagsY = useTransform(my, [-0.5, 0.5], [10, -10]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleMouseMove = (e) => {
      const rect = section.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      rawX.set((e.clientX - cx) / rect.width);
      rawY.set((e.clientY - cy) / rect.height);
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
      className="min-h-screen flex flex-col justify-end px-12 pb-16 relative overflow-hidden border-b border-line max-[960px]:px-6 max-[960px]:pb-12"
      style={{ perspective: "1200px" }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "180px 180px",
          opacity: 0.028,
          pointerEvents: "none",
        }}
      />

      <motion.div
        className="absolute top-[120px] left-12 right-12 flex items-start justify-between max-[960px]:left-6 max-[960px]:right-6"
        style={{ zIndex: 1, x: descX, y: descY, pointerEvents: "none" }}
      >
        <span className="font-mono text-[10px] text-ink-4 tracking-[2px] uppercase mt-1">
          [01] — Portfolio 2025
        </span>
        <ScrollReveal delay={0.2}>
          <div className="max-w-[340px] text-right text-sm text-ink-3 leading-[1.7] font-mono font-light text-[12px]">
            {SITE_CONFIG.heroDescription}
          </div>
        </ScrollReveal>
      </motion.div>

      <motion.div
        className="absolute -bottom-20 right-0 select-none"
        style={{
          width: "clamp(320px, 42vw, 620px)",
          height: "clamp(420px, 88vh, 820px)",
          zIndex: 2,
          x: imgX,
          y: imgY,
        }}
      >
        <PixelCanvas src="/logo_2.png" pixelSize={5} />
      </motion.div>

      <motion.h1
        className="font-playfair font-bold leading-[0.95] mb-12"
        style={{
          fontSize: "clamp(72px, 10vw, 148px)",
          letterSpacing: "-5px",
          position: "relative",
          zIndex: 3,
          maxWidth: "55%",
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

      {/* ── Layer 4: pointer-events none on wrapper, re-enabled on children ── */}
      <motion.div
        className="flex items-end justify-between max-[960px]:flex-col max-[960px]:items-start max-[960px]:gap-5"
        style={{
          position: "relative",
          zIndex: 4,
          x: tagsX,
          y: tagsY,
          pointerEvents: "none", // ← transparent to mouse; image hover works through it
        }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5 }}
      >
        <div
          className="flex gap-2.5 flex-wrap"
          style={{
            width: "fit-content",
            maxWidth: "60%",
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
            <span className="text-shadow-xl text-shadow-black">View Work</span>
          </PixelButton>
        </div>
      </motion.div>
    </section>
  );
}
