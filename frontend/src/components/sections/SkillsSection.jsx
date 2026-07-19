import React, { useRef } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import {
  Monitor,
  Braces,
  Server,
  Database,
  Component,
  Boxes,
  Layers3,
  Cpu,
} from 'lucide-react';
import { AnimatedSpan, Terminal, TypingAnimation } from '../ui/terminal';
import { useDirectionalReveal } from '../../hooks/useDirectionalReveal';
import TrueFocus from '../ui/TrueFocus';

const MODULES = [
  {
    id: '01',
    title: 'Frontend',
    icon: Monitor,
    tags: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux'],
    tone: 'from-orange-500/30 via-orange-500/10 to-transparent',
    accent: 'text-orange-400',
    border: 'border-orange-500/20',
    glow: '255,138,76',
  },
  {
    id: '02',
    title: 'Backend',
    icon: Server,
    tags: ['Node.js', 'Express.js', 'JWT', 'REST APIs', 'Multer', 'Cloudinary'],
    tone: 'from-sky-400/30 via-sky-400/10 to-transparent',
    accent: 'text-sky-300',
    border: 'border-sky-400/20',
    glow: '110,203,255',
  },
  {
    id: '03',
    title: 'Database',
    icon: Braces,
    tags: ['MongoDB', 'SQL', 'Mongoose', 'Redis'],
    tone: 'from-emerald-400/30 via-emerald-400/10 to-transparent',
    accent: 'text-emerald-300',
    border: 'border-emerald-400/20',
    glow: '80,230,180',
  },
  {
    id: '04',
    title: 'Dev Workflow',
    icon: Database,
    tags: ['Git', 'GitHub', 'Postman'],
    tone: 'from-amber-400/30 via-amber-400/10 to-transparent',
    accent: 'text-amber-300',
    border: 'border-amber-400/20',
    glow: '250,204,110',
  },
];

const AI_SKILLS = [
  { label: 'OpenAI API', value: 95 },
  { label: 'LangChain', value: 60 },
  { label: 'Prompt Engineering', value: 85 },
  { label: 'Python', value: 70 },
];

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

const fadeInFromRight = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

/* ------------------------------------------------------------------ */
/* Background — static, no infinite animation loops                   */
/* ------------------------------------------------------------------ */

function HoloBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_35%),radial-gradient(circle_at_20%_20%,rgba(255,94,58,0.16),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(110,203,255,0.12),transparent_26%),radial-gradient(circle_at_70%_80%,rgba(180,140,255,0.1),transparent_26%)]" />
      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_center,black_35%,transparent_85%)]" />
      <div className="absolute -left-32 -top-24 h-[420px] w-[420px] rounded-full bg-orange-500/15 blur-[50px]" />
      <div className="absolute -right-36 top-56 h-[480px] w-[480px] rounded-full bg-sky-400/10 blur-[55px]" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* HoloCard — mousemove writes a CSS var directly, no React state,    */
/* no 3D tilt, blur-fade title inherits stagger from parent variant   */
/* ------------------------------------------------------------------ */

function HoloCard({ mod, index, bgImage }) {
  const circuitBg = `
    linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px) 0 0/64px 64px,
    linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px) 0 0/64px 64px,
    radial-gradient(circle, rgba(255,255,255,0.5) 1.5px, transparent 1.5px) 0 0/64px 64px
  `;

  const cardRef = useRef(null);
  const { ref: revealRef, animate, transition } = useDirectionalReveal({ threshold: 0.22 });

  const setRefs = (node) => {
    cardRef.current = node;
    revealRef.current = node;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        delay: index * 0.05,
        ease: EASE,
        staggerChildren: 0.045,
        delayChildren: index * 0.05 + 0.12,
      },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: EASE } },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 8, filter: 'blur(6px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease: EASE } },
  };

  const tagVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
  };

  // Direct DOM write — no setState, no re-render on mousemove.
  const handleMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--mx', `${x}%`);
    el.style.setProperty('--my', `${y}%`);
  };

  return (
    <motion.article
      ref={setRefs}
      className="group relative min-h-[280px] rounded-[30px] transition-transform duration-300 will-change-transform hover:-translate-y-2"
      variants={cardVariants}
      initial="hidden"
      animate={animate}
      transition={transition}
      onMouseMove={handleMove}
      style={{ '--glow': mod.glow, '--mx': '50%', '--my': '50%' }}
    >
      <div
        className={`absolute inset-0 overflow-hidden rounded-[30px] border ${mod.border} bg-gradient-to-b from-white/10 to-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${mod.tone} opacity-80`} />

        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(8,8,10,0.2), rgba(8,8,10,0.78) 62%), url(${bgImage})`,
            }}
          />
          <div
            className="absolute inset-y-0 right-0 w-[55%] bg-cover bg-center opacity-45"
            style={{
              backgroundImage: `url(${bgImage})`,
              clipPath: 'polygon(18% 0, 100% 0, 100% 100%, 0 100%)',
            }}
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at var(--mx) var(--my), rgba(${mod.glow},0.2), transparent 32%)`,
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-[0.08]"
          style={{
            backgroundImage: circuitBg,
            maskImage: 'radial-gradient(ellipse at center, black 45%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 45%, transparent 85%)',
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 rounded-[30px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            boxShadow: `inset 0 0 0 1px rgba(var(--glow), 0.4), 0 0 30px -8px rgba(var(--glow), 0.4)`,
          }}
        />

        <div className="relative z-10 flex h-full flex-col justify-between p-6 lg:p-7">
          <div className="flex items-start justify-between">
            <span className="font-mono text-[15px] tracking-[0.08em] text-white/55">{mod.id}</span>
            <motion.div variants={iconVariants}>
              <mod.icon
                size={20}
                strokeWidth={1.5}
                className={`${mod.accent} transition-transform duration-300 group-hover:scale-110`}
              />
            </motion.div>
          </div>

          <motion.h3
            variants={titleVariants}
            className="mt-4 font-grotesk font-semibold text-[clamp(30px,3vw,42px)] leading-none tracking-[-0.05em] text-white"
          >
            {mod.title}
          </motion.h3>

          <div className="mt-6 flex flex-wrap gap-2">
            {mod.tags.map((tag) => (
              <motion.span
                key={tag}
                variants={tagVariants}
                className="relative z-10 rounded-full border border-white/10 bg-white/6 px-3 py-2 font-mono text-[12px] text-white/90 backdrop-blur-md transition-colors duration-300 group-hover:border-white/20 group-hover:bg-white/10"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/* SkillRow — scaleX transform instead of width, no RAF/setState loop */
/* ------------------------------------------------------------------ */

function SkillRow({ label, value }) {
  const rowVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
  };
  const fillVariants = {
    hidden: { scaleX: 0 },
    visible: { scaleX: value / 100, transition: { duration: 0.85, ease: EASE, delay: 0.1 } },
  };

  return (
    <motion.div variants={rowVariants}>
      <div className="mb-2 flex items-baseline justify-between font-mono text-[12px] uppercase tracking-[0.08em] text-white/70">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
        <motion.div
          variants={fillVariants}
          style={{ transformOrigin: 'left' }}
          className="h-full w-full rounded-full bg-gradient-to-r from-orange-500 to-amber-300"
        />
      </div>
    </motion.div>
  );
}

function AIOrbit() {
  const { ref, animate, transition } = useDirectionalReveal({ threshold: 0.25 });
  const variants = {
    hidden: { opacity: 0, y: 14, scale: 0.99 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: EASE, staggerChildren: 0.09, delayChildren: 0.1 },
    },
  };

  return (
    <motion.section
      ref={ref}
      className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_16px_50px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]"
      variants={variants}
      initial="hidden"
      animate={animate}
      transition={transition}
    >
      <div className="grid gap-4">
        {AI_SKILLS.map((s) => (
          <SkillRow key={s.label} label={s.label} value={s.value} />
        ))}
      </div>
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/* MERNPanel — icon tiles inherit stagger, hover is CSS-only          */
/* ------------------------------------------------------------------ */

function RevealIconTile({ Icon, label, color, glow }) {
  const variants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
  };

  return (
    <motion.div
      variants={variants}
      className="group relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-4 transition-[colors,transform] duration-300 hover:-translate-y-1 hover:border-white/20"
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glow }}
      />
      <div
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110"
        style={{ borderColor: `${color}33`, backgroundColor: `${color}14` }}
      >
        <Icon size={16} strokeWidth={1.75} style={{ color }} />
      </div>
      <span className="relative font-mono text-[12px] tracking-[0.02em] text-white/75">{label}</span>
    </motion.div>
  );
}

function MERNPanel() {
  const icons = [
    { Icon: Database, label: 'MongoDB', color: '#4ADE80', glow: 'rgba(74,222,128,0.35)' },
    { Icon: Component, label: 'Express', color: '#E5E7EB', glow: 'rgba(229,231,235,0.3)' },
    { Icon: Boxes, label: 'React', color: '#7DD3FC', glow: 'rgba(125,211,252,0.35)' },
    { Icon: Cpu, label: 'Node', color: '#86EFAC', glow: 'rgba(134,239,172,0.35)' },
  ];

  const { ref, animate, transition } = useDirectionalReveal({ threshold: 0.25 });

  const panelVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: EASE, staggerChildren: 0.07, delayChildren: 0.15 },
    },
  };

  const headingVariants = {
    hidden: { opacity: 0, y: 10, filter: 'blur(6px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: EASE } },
  };

  return (
    <motion.section
      ref={ref}
      className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_16px_50px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]"
      variants={panelVariants}
      initial="hidden"
      animate={animate}
      transition={transition}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full blur-[70px] opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.5), transparent 70%)' }}
      />

      <div className="relative flex items-center justify-between">
        <span className="font-mono text-[15px] tracking-[0.08em] text-white/50">06</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-violet-400/25 bg-violet-400/10">
          <Layers3 size={16} className="text-violet-300" />
        </div>
      </div>

      <motion.h3
        variants={headingVariants}
        className="relative mt-4 font-display text-[30px] leading-none tracking-[-0.04em] text-white"
      >
        MERN Full Stack
      </motion.h3>
      <p className="relative mt-3 font-display text-[15px] leading-[1.65] text-white/60">
        End-to-end integration mapping for high-performance distributed systems utilizing the modern web standards.
      </p>

      <div className="relative mt-5 grid grid-cols-2 gap-3">
        {icons.map((props) => (
          <RevealIconTile key={props.label} {...props} />
        ))}
      </div>
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                            */
/* ------------------------------------------------------------------ */

export default function TechStackSection() {
  const { ref: topRef, animate: topAnimate, transition: topTransition } = useDirectionalReveal({ threshold: 0.4 });
  const { ref: pulseRef, animate: pulseAnimate, transition: pulseTransition } = useDirectionalReveal({ threshold: 0.2 });

  const topVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
  };

  const headingVariants = {
    hidden: { opacity: 0, y: 14, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE } },
  };

  const pulseVariants = {
    hidden: { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } },
  };

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative overflow-hidden bg-[#08080a] px-4 py-16 text-white sm:px-6 lg:px-6 lg:py-24">
        <HoloBackdrop />

        <div className="relative z-10 mx-auto flex max-w-[1500px] flex-col gap-10">
          <motion.div
            ref={topRef}
            className="w-full h-auto flex"
            variants={topVariants}
            initial="hidden"
            animate={topAnimate}
            transition={topTransition}
          >
            <div className="w-[60%]">
              <motion.div variants={fadeUp} className="mb-8 font-mono text-[13px] tracking-[0.16em] text-violet-300">
                PORTFOLIO.CORE.MODULES
              </motion.div>
              <motion.div variants={headingVariants}>
                <TrueFocus
                  sentence="Engineering Ecosystem"
                  manualMode={false}
                  blurAmount={6}
                  borderColor="#FF8A4C"
                  glowColor="rgba(255,138,76,0.6)"
                  animationDuration={0.5}
                  pauseBetweenAnimations={2}
                  containerClassName="flex flex-col items-start"
                  className="font-grotesk font-semibold leading-[0.96] tracking-[-0.06em] text-[clamp(44px,7vw,92px)] my-2"
                  wordClassName={(word) =>
                    word === 'Ecosystem'
                      ? 'text-orange-400 drop-shadow-[0_0_20px_rgba(255,94,58,0.25)]'
                      : 'text-white'
                  }
                />
              </motion.div>
              <motion.p variants={fadeUp} className="mt-10 max-w-3xl font-mono text-[16px] leading-8 text-white/70">
                A holographic interface for your stack — layered, luminous, and tuned for subtle motion rather than visual noise.
              </motion.p>
            </div>
            <motion.div variants={fadeInFromRight} className="w-[40%] flex justify-end">
              <Terminal>
                <TypingAnimation>&gt; pnpm dlx shadcn@latest init</TypingAnimation>
                <AnimatedSpan className="text-green-500">
                  ✔ Building MERN projects.
                </AnimatedSpan>
                <AnimatedSpan className="text-green-500">
                  ✔ Exploring AI integration.
                </AnimatedSpan>
                <AnimatedSpan className="text-green-500">
                  ✔ Designing scalable systems.
                </AnimatedSpan>
                <AnimatedSpan className="text-green-500">
                  ✔ Shipping production-ready apps.
                </AnimatedSpan>
                <TypingAnimation className="text-muted-foreground">
                  Status: Always Learning.
                </TypingAnimation>
              </Terminal>
            </motion.div>
          </motion.div>

          <div className="relative min-h-auto pt-2">
            <motion.div
              ref={pulseRef}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              variants={pulseVariants}
              initial="hidden"
              animate={pulseAnimate}
              transition={pulseTransition}
            >
              <div className="h-[min(42vw,540px)] w-[min(42vw,540px)] animate-pulse rounded-full bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.2),transparent_18%),radial-gradient(circle_at_50%_50%,rgba(255,94,58,0.32),rgba(180,140,255,0.08)_42%,rgba(0,0,0,0)_72%)] [transform:perspective(1300px)_rotateX(68deg)]" />
            </motion.div>

            <div className="relative z-10 grid gap-6 xl:grid-cols-[1.35fr_0.72fr]">
              <div className="grid gap-6 md:grid-cols-2">
                {MODULES.map((m, i) => (
                  <HoloCard
                    key={m.id}
                    mod={m}
                    index={i}
                    bgImage={[
                      "frontend_card.jpg",
                      "backend_card.jpg",
                      "database_card.jpg",
                      "tools_card.jpg",
                    ][i]}
                  />
                ))}
              </div>

              <div className="flex flex-col gap-5">
                <AIOrbit />
                <MERNPanel />
              </div>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}