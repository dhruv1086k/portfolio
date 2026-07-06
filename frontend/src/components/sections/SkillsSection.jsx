import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import anime from 'animejs';
import {
  Monitor,
  Braces,
  Server,
  Database,
  Sparkles,
  ExternalLink,
  Component,
  Boxes,
  Orbit,
  ScanLine,
  Layers3,
  ShieldCheck,
  Cpu,
  Activity,
} from 'lucide-react';
import { AnimatedSpan, Terminal, TypingAnimation } from '../ui/terminal';

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

// Subtle, layered scroll-reveal variants (Framer Motion — structural staggering)
// viewport.once is false everywhere so these replay on every re-entry
const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.04 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeInFromRight = {
  hidden: { opacity: 0, x: 24, scale: 0.99 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

function useReducedMotionSafe() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);
  return reduced;
}

// anime.js — subtle blur fade-in, used for headings.
// Now re-arms on exit so it replays every time the element re-enters view,
// whether scrolling down into it or back up into it.
function useBlurFadeIn({ y = 12, duration = 850, delay = 0, blur = 10 } = {}) {
  const ref = useRef(null);
  const reduced = useReducedMotionSafe();
  const animRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      el.style.opacity = 1;
      el.style.filter = 'blur(0px)';
      el.style.transform = 'none';
      return;
    }

    const reset = () => {
      if (animRef.current) animRef.current.pause();
      el.style.opacity = 0;
      el.style.filter = `blur(${blur}px)`;
      el.style.transform = `translateY(${y}px)`;
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animRef.current = anime({
            targets: el,
            opacity: [0, 1],
            translateY: [y, 0],
            filter: [`blur(${blur}px)`, 'blur(0px)'],
            duration,
            delay,
            easing: 'easeOutCubic',
          });
        } else {
          reset();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [y, duration, delay, blur, reduced]);

  return ref;
}

function AnimatedNumber({ value, decimals = 0, suffix = '' }) {
  const ref = useRef(null);
  const reduced = useReducedMotionSafe();
  const [display, setDisplay] = useState((0).toFixed(decimals));
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 65, damping: 20 });
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (!entry.isIntersecting) mv.set(0);
    }, { threshold: 0.35 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [mv]);

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, value, mv]);

  useEffect(() => {
    if (reduced) {
      setDisplay(Number(value).toFixed(decimals));
      return;
    }
    const unsub = spring.on('change', (v) => setDisplay(Number(v).toFixed(decimals)));
    return unsub;
  }, [spring, reduced, decimals, value]);

  return <span ref={ref}>{display}{suffix}</span>;
}

function HoloBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_35%),radial-gradient(circle_at_20%_20%,rgba(255,94,58,0.18),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(110,203,255,0.13),transparent_26%),radial-gradient(circle_at_70%_80%,rgba(180,140,255,0.12),transparent_26%)]" />
      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(circle_at_center,black_35%,transparent_85%)]" />
      <div className="absolute -left-32 -top-24 h-[460px] w-[460px] rounded-full bg-orange-500/20 blur-[60px] animate-[float_14s_ease-in-out_infinite]" />
      <div className="absolute -right-36 top-56 h-[560px] w-[560px] rounded-full bg-sky-400/15 blur-[70px] animate-[float_14s_ease-in-out_infinite] [animation-delay:-4s]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.045)_48%,transparent_52%,transparent_100%)] bg-[length:100%_240px] opacity-10 mix-blend-screen animate-[scan_8s_linear_infinite]" />
    </div>
  );
}


function HoloCard({ mod, index, bgImage }) {
  const circuitBg = `
    linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px) 0 0/64px 64px,
    linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px) 0 0/64px 64px,
    radial-gradient(circle, rgba(255,255,255,0.5) 1.5px, transparent 1.5px) 0 0/64px 64px
  `;

  const ref = useRef(null);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const titleRef = useBlurFadeIn({ y: 10, duration: 750, delay: index * 90 + 120, blur: 8 });

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMouse({ x, y });
  };

  return (
    <motion.article
      ref={ref}
      className="group relative min-h-[280px] rounded-[30px]"
      initial={{ opacity: 0, y: 22, scale: 0.99 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.22 }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -8,
        rotateX: 4,
        rotateY: index % 2 === 0 ? -4 : 4,
        scale: 1.015,
      }}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ '--glow': mod.glow, transformStyle: 'preserve-3d' }}
    >
      {/* Clipping layer: flat, owns overflow-hidden + rounded corners + all visuals */}
      <div
        className={`absolute inset-0 overflow-hidden rounded-[30px] border ${mod.border} bg-gradient-to-b from-white/10 to-white/5 shadow-[0_26px_70px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${mod.tone} opacity-80`} />

        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{
            opacity: hovered ? 1 : 0,
          }}
          transition={{ duration: 0.35 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(8,8,10,0.2), rgba(8,8,10,0.78) 62%), url(${bgImage})`,
            }}
          />
          <div
            className="absolute inset-y-0 right-0 w-[55%] bg-cover bg-center opacity-45 blur-[0.2px]"
            style={{
              backgroundImage: `url(${bgImage})`,
              clipPath: 'polygon(18% 0, 100% 0, 100% 100%, 0 100%)',
              transform: 'scale(1.05)',
            }}
          />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, rgba(${mod.glow},0.22), transparent 30%)`,
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
            boxShadow: `inset 0 0 0 1px rgba(var(--glow), 0.42), 0 0 36px -8px rgba(var(--glow), 0.42)`,
          }}
        />

        <div className="relative z-10 flex h-full flex-col justify-between p-6 lg:p-7">
          <div className="flex items-start justify-between">
            <span className="font-mono text-[15px] tracking-[0.08em] text-white/55">{mod.id}</span>
            <motion.div
              initial={{ opacity: 0, rotate: -35, scale: 0.7 }}
              whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.6 }}
              transition={{ duration: 0.5, delay: index * 0.06 + 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              <mod.icon
                size={20}
                strokeWidth={1.5}
                className={`${mod.accent} transition-transform duration-300 group-hover:scale-110`}
              />
            </motion.div>
          </div>

          <div>
            <h3
              ref={titleRef}
              style={{ opacity: 0, filter: 'blur(8px)' }}
              className="mt-4 font-grotesk font-semibold text-[clamp(30px,3vw,42px)] leading-none tracking-[-0.05em] text-white transition-transform duration-300 group-hover:translate-y-[-2px]"
            >
              {mod.title}
            </h3>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {mod.tags.map((tag, tagIndex) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.6 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.06 + 0.28 + tagIndex * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative z-10 rounded-full border border-white/10 bg-white/6 px-3 py-2 font-mono text-[12px] text-white/90 backdrop-blur-md transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/10 group-hover:translate-y-[-1px]"
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

function SkillRow({ label, value, delay = 0 }) {
  const wrapRef = useRef(null);
  const fillRef = useRef(null);
  const [pct, setPct] = useState(0);
  const rafRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const animateIn = () => {
      timeoutRef.current = setTimeout(() => {
        if (fillRef.current) fillRef.current.style.width = `${value}%`;
        const start = 0;
        const end = value;
        const dur = 1200;
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setPct(Math.round(start + (end - start) * eased));
          if (p < 1) rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      }, delay);
    };

    const reset = () => {
      clearTimeout(timeoutRef.current);
      cancelAnimationFrame(rafRef.current);
      if (fillRef.current) fillRef.current.style.width = '0%';
      setPct(0);
    };

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animateIn();
      } else {
        reset();
      }
    }, { threshold: 0.35 });
    obs.observe(el);

    return () => {
      obs.disconnect();
      clearTimeout(timeoutRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [value, delay]);

  return (
    <motion.div
      ref={wrapRef}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ duration: 0.45, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-2 flex items-baseline justify-between font-mono text-[12px] uppercase tracking-[0.08em] text-white/70">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
        <div
          ref={fillRef}
          className="h-full w-0 rounded-full bg-gradient-to-r from-orange-500 to-amber-300 shadow-[0_0_18px_rgba(180,140,255,0.35)] transition-[width] duration-[1200ms] ease-out"
        />
      </div>
    </motion.div>
  );
}

function AIOrbit() {
  return (
    <motion.section
      className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.05)]"
      initial={{ opacity: 0, y: 14, scale: 0.99 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="grid gap-4">
        {AI_SKILLS.map((s, i) => (
          <SkillRow key={s.label} label={s.label} value={s.value} delay={i * 120} />
        ))}
      </div>
    </motion.section>
  );
}

function MERNPanel() {
  const icons = [
    { Icon: Database, label: 'MongoDB', color: '#4ADE80', glow: 'rgba(74,222,128,0.35)' },
    { Icon: Component, label: 'Express', color: '#E5E7EB', glow: 'rgba(229,231,235,0.3)' },
    { Icon: Boxes, label: 'React', color: '#7DD3FC', glow: 'rgba(125,211,252,0.35)' },
    { Icon: Cpu, label: 'Node', color: '#86EFAC', glow: 'rgba(134,239,172,0.35)' },
  ];

  const headingRef = useBlurFadeIn({ y: 10, duration: 800, delay: 200, blur: 8 });

  return (
    <motion.section
      className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.05)]"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full blur-[70px] opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.55), transparent 70%)' }}
      />

      <div className="relative flex items-center justify-between">
        <span className="font-mono text-[15px] tracking-[0.08em] text-white/50">06</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-violet-400/25 bg-violet-400/10">
          <Layers3 size={16} className="text-violet-300" />
        </div>
      </div>

      <h3
        ref={headingRef}
        style={{ opacity: 0, filter: 'blur(8px)' }}
        className="relative mt-4 font-display text-[30px] leading-none tracking-[-0.04em] text-white"
      >
        MERN Full Stack
      </h3>
      <p className="relative mt-3 font-display text-[15px] leading-[1.65] text-white/60">
        End-to-end integration mapping for high-performance distributed systems utilizing the modern web standards.
      </p>

      <div className="relative mt-5 grid grid-cols-2 gap-3">
        {icons.map(({ Icon, label, color, glow }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.45, delay: 0.15 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            className="group relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-4 transition-colors duration-300 hover:border-white/20"
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
            <span className="relative font-mono text-[12px] tracking-[0.02em] text-white/75">
              {label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}


export default function TechStackSection() {
  const headingRef = useBlurFadeIn({ y: 14, duration: 900, delay: 0, blur: 12 });

  return (
    <section className="relative overflow-hidden bg-[#08080a] px-4 py-16 text-white sm:px-6 lg:px-6 lg:py-24">
      <HoloBackdrop />

      <div className="relative z-10 mx-auto flex max-w-[1500px] flex-col gap-10">
        <motion.div
          className='w-full h-auto flex'
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
        >
          <div className="w-[60%]">
            <motion.div variants={fadeUp} className="mb-4 font-mono text-[13px] tracking-[0.16em] text-violet-300">
              PORTFOLIO.CORE.MODULES
            </motion.div>
            <h2
              ref={headingRef}
              style={{ opacity: 0, filter: 'blur(12px)' }}
              className="font-grotesk text-[clamp(44px,7vw,92px)] leading-[0.96] tracking-[-0.06em] text-white font-semibold"
            >
              Engineering
              <br />
              <span className="text-orange-400 drop-shadow-[0_0_26px_rgba(255,94,58,0.28)]">
                Ecosystem
              </span>
            </h2>
            <motion.p variants={fadeUp} className="mt-5 max-w-3xl font-mono text-[16px] leading-8 text-white/70">
              A holographic interface for your stack — layered, luminous, and tuned for subtle motion rather than visual noise.
            </motion.p>
          </div>
          <motion.div variants={fadeInFromRight} className='w-[40%] flex justify-end'>
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
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="h-[min(42vw,540px)] w-[min(42vw,540px)] rounded-full bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.24),transparent_18%),radial-gradient(circle_at_50%_50%,rgba(255,94,58,0.38),rgba(180,140,255,0.10)_42%,rgba(0,0,0,0)_72%)] shadow-[inset_0_0_60px_rgba(255,255,255,0.06),0_0_120px_rgba(200,80,42,0.22)] [transform:perspective(1300px)_rotateX(68deg)] animate-[pulse_9s_ease-in-out_infinite]" />
          </motion.div>

          <div className="relative z-10 grid gap-6 xl:grid-cols-[1.35fr_0.72fr]">
            <div className="grid gap-6 md:grid-cols-2 [perspective:1600px]">
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
  );
}