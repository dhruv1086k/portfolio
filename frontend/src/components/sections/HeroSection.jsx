import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useScroll,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Tag from "../ui/Tag";
import PixelCanvas from "../ui/PixelCanvas";
import { SITE_CONFIG } from "../../constants/data";
import CircularText from "../ui/CircularText";
import { useLoader } from "../../context/LoaderContext";
import { PointerHighlight } from "../ui/pointer-highlight";

const EASE_EXPO = [0.6, 2, 0.76, 1];

function ParallaxShape({ shape, mx, my, baseDelay }) {
  const x = useTransform(mx, [-0.5, 0.5], shape.dx);
  const y = useTransform(my, [-0.5, 0.5], shape.dy);

  const anim = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      duration: 0.9,
      ease: "easeOut",
      delay: baseDelay + shape.delay,
    },
  };

  if (shape.isCross) {
    return (
      <motion.div
        {...anim}
        style={{ ...shape.style, x, y, position: "absolute" }}
      >
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: 1.5,
            background: "rgba(0,0,0,0.1)",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            height: "100%",
            width: 1.5,
            background: "rgba(0,0,0,0.1)",
            left: "50%",
            top: 0,
            transform: "translateX(-50%)",
          }}
        />
      </motion.div>
    );
  }

  if (shape.isDotGrid) {
    return (
      <motion.div
        {...anim}
        style={{ ...shape.style, x, y, position: "absolute" }}
      >
        {Array.from({ length: 20 }).map((_, j) => (
          <div
            key={j}
            style={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.15)",
            }}
          />
        ))}
      </motion.div>
    );
  }

  return <motion.div {...anim} style={{ ...shape.style, x, y }} />;
}

function TypewriterText({
  text,
  delay = 0,
  charDuration = 0.02,
  className,
  style,
}) {
  const duration = text.length * charDuration;
  return (
    <motion.span
      className={className}
      style={{ ...style }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.01, delay }}
    >
      <motion.span
        style={{
          display: "inline",
          backgroundImage:
            "linear-gradient(90deg, currentColor 50%, transparent 50%)",
          backgroundSize: "200% 100%",
          backgroundPosition: "100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
        initial={{ backgroundPosition: "100%" }}
        animate={{ backgroundPosition: "0%" }}
        transition={{
          duration,
          delay,
          ease: "linear",
        }}
      >
        {text}
      </motion.span>
    </motion.span>
  );
}

function HeroShapes({ mx, my, baseDelay }) {
  const shapes = [
    {
      dx: [-40, 40],
      dy: [-26, 26],
      delay: 0.0,
      style: {
        position: "absolute",
        bottom: "18%",
        right: "38%",
        width: 200,
        height: 200,
        borderRadius: "50%",
        border: "1.5px solid rgba(0,0,0,0.09)",
        pointerEvents: "none",
      },
    },
    {
      dx: [-60, 60],
      dy: [-40, 40],
      delay: 0.12,
      style: {
        position: "absolute",
        top: "12%",
        right: "28%",
        width: 120,
        height: 120,
        borderRadius: "50%",
        border: "1.5px solid rgba(180,70,20,0.18)",
        pointerEvents: "none",
      },
    },
    {
      dx: [-80, 80],
      dy: [-50, 50],
      delay: 0.22,
      style: {
        position: "absolute",
        top: "22%",
        right: "14%",
        width: 80,
        height: 80,
        border: "1.5px solid rgba(0,0,0,0.08)",
        transform: "rotate(20deg)",
        pointerEvents: "none",
      },
    },
    {
      dx: [-32, 32],
      dy: [-54, 54],
      delay: 0.08,
      style: {
        position: "absolute",
        bottom: "22%",
        right: "44%",
        width: 2,
        height: 110,
        background: "rgba(0,0,0,0.08)",
        pointerEvents: "none",
      },
    },
    {
      dx: [-68, 68],
      dy: [-44, 44],
      delay: 0.18,
      isCross: true,
      style: {
        position: "absolute",
        top: "38%",
        right: "32%",
        width: 28,
        height: 28,
        pointerEvents: "none",
      },
    },
    {
      dx: [-26, 26],
      dy: [-32, 32],
      delay: 0.14,
      isDotGrid: true,
      style: {
        position: "absolute",
        top: "55%",
        right: "42%",
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 7,
        pointerEvents: "none",
      },
    },
  ];

  return (
    <>
      {shapes.map((shape, i) => (
        <ParallaxShape
          key={i}
          shape={shape}
          mx={mx}
          my={my}
          baseDelay={baseDelay}
        />
      ))}
    </>
  );
}

export default function HeroSection() {
  const sectionRef = useRef(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const [isMd, setIsMd] = useState(false);

  const { loaderDone } = useLoader();
  const T = {
    label: 0.5,
    heading: 0.7,
    tags: 1.2,
    description: 1.7,
    canvas: 2200,
    circularText: 2.4,
  };

  // Track md breakpoint (768px)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsMd(mq.matches);
    const handler = (e) => setIsMd(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const shapesY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springConfig = { stiffness: 55, damping: 18, mass: 1 };
  const mx = useSpring(rawX, springConfig);
  const my = useSpring(rawY, springConfig);

  const h1RotateX = useTransform(my, [-0.5, 0.5], [6, -6]);
  const h1RotateY = useTransform(mx, [-0.5, 0.5], [-6, 6]);
  const headingX = useTransform(mx, [-0.5, 0.5], [-30, 30]);
  const headingY = useTransform(my, [-0.5, 0.5], [-20, 20]);
  const tagsX = useTransform(mx, [-0.5, 0.5], [-30, 30]);
  const tagsY = useTransform(my, [-0.5, 0.5], [-20, 20]);
  const shapesContainerX = useTransform(mx, [-0.5, 0.5], [15, -15]);

  useEffect(() => {
    if (!loaderDone) return;
    const t = setTimeout(() => setShowCanvas(true), T.canvas);
    return () => clearTimeout(t);
  }, [loaderDone]);

  // Listen on window so nothing can block the events
  useEffect(() => {
    const section = sectionRef.current;

    const handleMouseMove = (e) => {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      // Only react when cursor is inside the hero section
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        rawX.set(0);
        rawY.set(0);
        return;
      }
      rawX.set((e.clientX - (rect.left + rect.width / 2)) / rect.width);
      rawY.set((e.clientY - (rect.top + rect.height / 2)) / rect.height);
    };

    const handleMouseLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [loaderDone, rawX, rawY]);

  if (!loaderDone) return <div className="h-screen" />;

  return (
    <div style={{ position: "relative" }}>
      <section
        id="hero"
        ref={sectionRef}
        className="relative overflow-hidden border-b border-line h-screen"
        style={{ perspective: "1200px" }}
      >
        {/* Noise texture */}
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

        {/* Top bar — label + description */}
        <motion.div
          className="hidden md:flex absolute top-[120px] left-12 right-12 items-start justify-between"
          style={{
            zIndex: 5,
            pointerEvents: "none",
            y: heroY,
            opacity: heroOpacity,
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <motion.span
              className="font-mono text-[10px] w-62.5 text-ink-4 tracking-[2px] uppercase block"
              initial={{ x: -56, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE_EXPO, delay: T.label }}
            >
              [0X.IX] - DHRUV PAL
            </motion.span>
          </div>
          <div style={{ overflow: "hidden" }}>
            <div className="max-w-[340px] text-right text-[12px] text-ink-3 leading-[2] font-mono font-light">
              <TypewriterText
                text={SITE_CONFIG.heroDescription}
                delay={T.description}
                charDuration={0.015}
              />
            </div>
          </div>
        </motion.div>

        {/* Decorative shapes — own parallax plane */}
        <motion.div
          className="hidden md:block absolute"
          style={{
            bottom: 0,
            right: 0,
            width: "clamp(240px, 35vw, 500px)",
            height: "100vh",
            zIndex: 0,
            y: shapesY,
            x: isMd ? shapesContainerX : 0,
          }}
        >
          <HeroShapes mx={mx} my={my} baseDelay={T.tags / 1000 + 0.4} />
        </motion.div>

        {/* Pixel canvas + circular text */}
        <div
          className="hidden md:block absolute select-none"
          style={{
            bottom: 0,
            right: 0,
            width: "clamp(240px, 35vw, 500px)",
            height: "100vh",
            zIndex: 1,
          }}
        >
          <motion.div
            className="absolute -left-16 bottom-6 -z-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.6,
              ease: EASE_EXPO,
              delay: T.circularText,
            }}
          >
            <CircularText
              text="DHRUV*PAL*DEVELOPER*"
              onHover="speedUp"
              spinDuration={20}
              className=""
            />
          </motion.div>
          {showCanvas && (
            <PixelCanvas
              src="/logo_2.png"
              pixelSize={4}
              anchor="bottom-center"
            />
          )}
        </div>

        {/* Main content column */}
        <div className="relative flex flex-col h-full">
          {/* Mobile top info */}
          <div className="md:hidden pt-24 px-6 space-y-2">
            <div style={{ overflow: "hidden" }}>
              <motion.span
                className="font-mono text-[10px] text-ink-4 tracking-[2px] uppercase block"
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: EASE_EXPO, delay: T.label }}
              >
                [09.03] - DHRUV PAL
              </motion.span>
            </div>
            <div style={{ overflow: "hidden" }}>
              <div className="text-[12px] text-ink-3 leading-[1.7] font-mono font-light w-full">
                <TypewriterText
                  text={SITE_CONFIG.heroDescription}
                  delay={T.description}
                  charDuration={0.015}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-6 md:min-h-0" />

          {/* Heading */}
          <motion.div
            className="font-PT-serif font-bold leading-[0.95] mb-6 md:mb-12 px-6 sm:px-8 md:px-12 md:max-w-[55%]"
            style={{
              fontSize: "clamp(58px, 11vw, 148px)",
              letterSpacing: "clamp(-2px, -0.4vw, -5px)",
              position: "relative",
              zIndex: 3,
              pointerEvents: "none",
              y: heroY,
              opacity: heroOpacity,
            }}
          >
            {/* Line 1 — "I build" */}
            <motion.div
              style={{
                x: isMd ? headingX : 0,
                y: isMd ? headingY : 0,
                rotateX: isMd ? h1RotateX : 0,
                rotateY: isMd ? h1RotateY : 0,
                transformStyle: "preserve-3d",
              }}
            >
              <div style={{ overflow: "hidden" }}>
                <motion.span
                  style={{
                    display: "block",
                    textShadow: `1px 1px 0px rgba(0,0,0,0.06), 2px 2px 0px rgba(0,0,0,0.04), 8px 8px 16px rgba(0,0,0,0.06)`,
                  }}
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 0.7,
                    ease: EASE_EXPO,
                    delay: T.heading,
                  }}
                >
                  I build
                </motion.span>
              </div>
            </motion.div>

            {/* Line 2 — "digital" */}
            <motion.div
              style={{
                x: isMd ? headingX : 0,
                y: isMd ? headingY : 0,
                rotateX: isMd ? h1RotateX : 0,
                rotateY: isMd ? h1RotateY : 0,
                transformStyle: "preserve-3d",
              }}
            >
              <div style={{ overflow: "hidden" }}>
                <motion.span
                  style={{ display: "block" }}
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 0.7,
                    ease: EASE_EXPO,
                    delay: T.heading + 0.15,
                  }}
                >
                  <em
                    className="italic font-pixelify"
                    style={{
                      display: "inline-block",
                      color: "var(--color-accent)",
                      textShadow: `1px 1px 0px rgba(0,0,0,0.06), 3px 3px 0px rgba(0,0,0,0.04), 10px 10px 20px rgba(0,0,0,0.08)`,
                      transform: "translateZ(20px) scale(1.01)",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    digital
                  </em>
                </motion.span>
              </div>
            </motion.div>

            {/* Line 3 — "products." */}
            <motion.div
              style={{
                x: isMd ? headingX : 0,
                y: isMd ? headingY : 0,
                rotateX: isMd ? h1RotateX : 0,
                rotateY: isMd ? h1RotateY : 0,
                transformStyle: "preserve-3d",
              }}
            >
              <div style={{ overflow: "hidden" }}>
                <motion.span
                  style={{
                    display: "block",
                    textShadow: `1px 1px 0px rgba(0,0,0,0.06), 2px 2px 0px rgba(0,0,0,0.04), 8px 8px 16px rgba(0,0,0,0.06)`,
                  }}
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 0.7,
                    ease: EASE_EXPO,
                    delay: T.heading + 0.3,
                  }}
                >
                  products.
                </motion.span>
              </div>
            </motion.div>
          </motion.div>

          {/* Mobile pixel canvas */}
          <div
            className="block md:hidden mx-auto mb-6"
            style={{
              width: "min(85vw, 380px)",
              aspectRatio: "3 / 4",
              position: "relative",
              zIndex: 2,
              overflow: "hidden",
            }}
          >
            {showCanvas && (
              <PixelCanvas
                src="/logo_2.png"
                anchor="center"
                style={{ width: "100%", height: "100%" }}
              />
            )}
          </div>

          {/* Tags */}
          <motion.div
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 sm:gap-4 px-6 sm:px-8 md:px-12 pb-10 md:pb-16"
            style={{
              position: "relative",
              zIndex: 4,
              x: isMd ? tagsX : 0,
              y: isMd ? tagsY : 0,
              pointerEvents: "none",
            }}
          >
            <div
              className="flex gap-2 flex-wrap"
              style={{
                width: "fit-content",
                maxWidth: "100%",
                pointerEvents: "auto",
                position: "relative",
              }}
            >
              {SITE_CONFIG.heroTags.map((tag, idx) => (
                <motion.div
                  key={tag}
                  initial={{ x: -(60 + idx * 56), opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    duration: 0.5 + idx * 0.04,
                    ease: EASE_EXPO,
                    delay: T.tags + idx * 0.08,
                  }}
                  style={{
                    display: "inline-block",
                    position: "relative",
                    zIndex: SITE_CONFIG.heroTags.length - idx,
                    borderRadius: "9999px",
                  }}
                  whileHover={{
                    y: -3,
                    transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] },
                  }}
                >
                  <Tag>{tag}</Tag>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
