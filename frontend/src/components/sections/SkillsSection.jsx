import { useEffect, useRef, useState, useCallback } from "react";
import anime from "animejs";

// ─── Orbit icon data ───
const ORBIT_ICONS = [
  { icon: "deployed_code", bg: "light" },
  { icon: "database", bg: "dark" },
  { icon: "terminal", bg: "light" },
  { icon: "cloud", bg: "light" },
  { icon: "code", bg: "light" },
  { icon: "dns", bg: "dark" },
];

// ─── MERN Stack data ───
const MERN_ITEMS = [
  { icon: "database", label: "MongoDB" },
  { icon: "dns", label: "Express.js" },
  { icon: "deployed_code", label: "React" },
  { icon: "terminal", label: "Node.js" },
];

// ─── AI Skills with progress ───
const AI_SKILLS = [
  { name: "OpenAI API", level: 95 },
  { name: "LangChain", level: 90 },
  { name: "Prompt Engineering", level: 85 },
  { name: "RAG Systems", level: 80 },
];

// ─── Light skill cards data ───
const LIGHT_CARDS = [
  {
    num: "01",
    title: "Frontend",
    icon: "desktop_windows",
    techs: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux"],
  },
  {
    num: "02",
    title: "JavaScript Ecosystem",
    icon: "code",
    techs: ["ES6+", "JavaScript", "TypeScript", "Framer Motion", "GSAP", "Webpack", "Vite"],
  },
  {
    num: "03",
    title: "Backend",
    icon: "dns",
    techs: ["Node.js", "Express.js", "REST API", "JWT", "Socket.io"],
  },
  {
    num: "04",
    title: "Database",
    icon: "database",
    techs: ["MongoDB", "Mongoose", "SQL", "Firebase"],
  },
  {
    num: "05",
    title: "Dev Workflow",
    icon: "terminal",
    techs: ["Git", "Vercel", "Figma", "Postman", "Docker"],
  },
];

// ─── Color palette (matching Stitch Kinetic Engineering design system) ───
const C = {
  surface: "#fef8f3",
  surfaceLow: "#f8f3ed",
  surfaceHigh: "#ece7e2",
  surfaceVariant: "#e7e2dc",
  onSurface: "#1d1b18",
  onSurfaceVariant: "#5b403a",
  outlineVariant: "#e4beb6",
  primary: "#b72301",
  primaryContainer: "#ff5733",
  inverseSurface: "#32302d",
};

/* ═══════════════════════════════════════════════════════════════════════════
   ORBITAL COMPONENT — Anime.js powered centerpiece
   ═══════════════════════════════════════════════════════════════════════════ */
function TechOrbit() {
  const containerRef = useRef(null);
  const outerRingRef = useRef(null);
  const innerRingRef = useRef(null);
  const hubRef = useRef(null);
  const hubGlowRef = useRef(null);
  const tooltipRef = useRef(null);
  const orbitWrapRef = useRef(null);
  const iconRefs = useRef([]);
  const [entered, setEntered] = useState(false);

  const storeIcon = useCallback((el, i) => {
    if (el) iconRefs.current[i] = el;
  }, []);

  // Intersection observer — trigger once
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setEntered(true); obs.disconnect(); } },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // All animations
  useEffect(() => {
    if (!entered) return;
    const icons = iconRefs.current.filter(Boolean);

    // Orbit rings scale in
    anime({ targets: outerRingRef.current, scale: [0, 1], opacity: [0, 1], duration: 1200, easing: "easeOutExpo", delay: 200 });
    anime({ targets: innerRingRef.current, scale: [0, 1], opacity: [0, 1], duration: 1200, easing: "easeOutExpo", delay: 400 });

    // Hub bounce in
    anime({ targets: hubRef.current, scale: [0, 1], opacity: [0, 1], duration: 800, easing: "easeOutBack", delay: 600 });

    // Hub glow pulse (loops)
    anime({ targets: hubGlowRef.current, opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9], duration: 4000, easing: "easeInOutSine", loop: true });

    // Icons pop in with stagger
    anime({ targets: icons, scale: [0, 1], opacity: [0, 1], duration: 600, delay: anime.stagger(120, { start: 800 }), easing: "easeOutBack" });

    // Tooltip slide in
    anime({ targets: tooltipRef.current, translateX: [40, 0], opacity: [0, 1], duration: 800, easing: "easeOutExpo", delay: 1400 });

    // Continuous orbit rotation
    anime({ targets: orbitWrapRef.current, rotate: "1turn", duration: 60000, easing: "linear", loop: true });

    // Counter-rotate icons so they stay upright
    anime({ targets: icons, rotate: "-1turn", duration: 60000, easing: "linear", loop: true });

    // Subtle float per icon
    icons.forEach((icon, i) => {
      anime({ targets: icon, translateY: [-3, 3, -3], duration: 2500 + i * 400, easing: "easeInOutSine", loop: true, delay: i * 300 });
    });
  }, [entered]);

  // Precompute positions around a circle
  const R = 170;
  const positions = ORBIT_ICONS.map((_, i) => {
    const a = (i / ORBIT_ICONS.length) * Math.PI * 2 - Math.PI / 2;
    return { x: Math.cos(a) * R, y: Math.sin(a) * R };
  });

  return (
    <div ref={containerRef} className="relative w-full flex items-center justify-center" style={{ height: 500 }}>
      {/* Dotted grid corner decoration */}
      <div className="absolute right-0 top-0 w-32 h-32 opacity-30 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle, ${C.outlineVariant} 1.5px, transparent 1.5px)`, backgroundSize: "16px 16px" }} />

      <div className="relative flex items-center justify-center" style={{ width: 400, height: 400 }}>
        {/* Outer ring */}
        <div ref={outerRingRef} className="absolute rounded-full" style={{ width: "100%", height: "100%", border: `1px solid ${C.outlineVariant}4D`, opacity: 0 }} />
        {/* Inner ring */}
        <div ref={innerRingRef} className="absolute rounded-full" style={{ width: "80%", height: "80%", border: `1px solid ${C.outlineVariant}80`, opacity: 0 }} />

        {/* Center hub */}
        <div ref={hubRef} className="z-20 relative flex items-center justify-center"
          style={{ width: 128, height: 128, backgroundColor: C.inverseSurface, borderRadius: "50%", border: `4px solid ${C.surface}`, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", opacity: 0 }}>
          <div ref={hubGlowRef} className="absolute inset-0 rounded-full" style={{ background: `linear-gradient(135deg, ${C.primary}66, transparent 70%)`, filter: "blur(12px)" }} />
          <span className="relative z-10" style={{ color: C.primary, fontWeight: 700, fontSize: 36, letterSpacing: "-0.05em", fontFamily: "'Epilogue', sans-serif" }}>{"[{p}]"}</span>
        </div>

        {/* Orbiting icons wrapper */}
        <div ref={orbitWrapRef} className="absolute" style={{ width: "100%", height: "100%" }}>
          {ORBIT_ICONS.map((item, i) => {
            const isDark = item.bg === "dark";
            return (
              <div key={i} ref={(el) => storeIcon(el, i)}
                className="absolute cursor-pointer transition-shadow duration-300"
                style={{
                  top: "50%", left: "50%",
                  transform: `translate(calc(-50% + ${positions[i].x}px), calc(-50% + ${positions[i].y}px))`,
                  padding: 12,
                  backgroundColor: isDark ? C.inverseSurface : "#fff",
                  borderRadius: 12,
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                  border: `1px solid ${isDark ? C.primary + "4D" : C.outlineVariant}`,
                  opacity: 0,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 20px ${C.primary}33`; e.currentTarget.style.borderColor = C.primary; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(0,0,0,0.1)"; e.currentTarget.style.borderColor = isDark ? C.primary + "4D" : C.outlineVariant; }}
              >
                <span className="material-symbols-outlined" style={{ color: isDark ? "#fff" : C.primary, fontSize: 24 }}>{item.icon}</span>
              </div>
            );
          })}
        </div>

        {/* TypeScript floating tooltip card */}
        <div ref={tooltipRef} className="absolute z-30 hidden md:block"
          style={{ top: 40, right: -40, backgroundColor: C.inverseSurface, color: "#fff", padding: 24, borderRadius: 16, width: 208, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.1)", opacity: 0 }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center rounded" style={{ width: 24, height: 24, background: "#3178c6", fontSize: 10, fontWeight: 700, color: "#fff" }}>TS</div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14 }}>TypeScript</span>
          </div>
          {[
            { label: "Experience", value: "3+ years", color: C.primary },
            { label: "Used In", value: "12+ projects", color: "#fff" },
            { label: "Love", value: "Type safety & developer experience", color: C.surfaceVariant },
          ].map((r) => (
            <div key={r.label} className="mb-3">
              <p style={{ fontSize: 10, color: "#a8a5a0", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2, fontFamily: "'JetBrains Mono', monospace" }}>{r.label}</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: r.color, fontFamily: "'JetBrains Mono', monospace" }}>{r.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LIGHT SKILL CARD
   ═══════════════════════════════════════════════════════════════════════════ */
function SkillCardLight({ num, title, icon, techs }) {
  return (
    <div className="flex flex-col justify-between transition-all duration-300 cursor-pointer"
      style={{ backgroundColor: C.surfaceLow, border: `1px solid ${C.outlineVariant}66`, borderRadius: 12, padding: 32, minHeight: 220 }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.boxShadow = `0 0 15px ${C.primary}1A`; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.outlineVariant + "66"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div>
        <div className="flex justify-between items-start mb-6">
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: "0.1em", fontWeight: 500, color: C.primary }}>{num}</span>
          <span className="material-symbols-outlined" style={{ color: C.onSurfaceVariant + "80", fontSize: 24 }}>{icon}</span>
        </div>
        <h3 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 32, fontWeight: 700, lineHeight: 1.2, color: C.onSurface, marginBottom: 24 }}>{title}</h3>
        <div className="flex flex-wrap gap-2 mb-8">
          {techs.map((t) => (
            <span key={t} style={{ backgroundColor: C.surfaceHigh, padding: "4px 16px", borderRadius: 9999, fontSize: 13, fontWeight: 500, fontFamily: "'Hanken Grotesk', sans-serif", color: C.onSurface }}>{t}</span>
          ))}
        </div>
      </div>
      <button className="flex items-center gap-2 group" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: "0.1em", fontWeight: 500, color: C.onSurface, textTransform: "uppercase", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
        View Details
        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ fontSize: 14 }}>arrow_forward</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   AI DEVELOPMENT CARD — Dark with animated progress bars
   ═══════════════════════════════════════════════════════════════════════════ */
function AICard() {
  const cardRef = useRef(null);
  const barRefs = useRef([]);
  const [entered, setEntered] = useState(false);

  const storeBar = useCallback((el, i) => { if (el) barRefs.current[i] = el; }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setEntered(true); obs.disconnect(); } },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!entered) return;
    barRefs.current.filter(Boolean).forEach((bar, i) => {
      anime({ targets: bar, width: [`0%`, `${AI_SKILLS[i].level}%`], duration: 1200, easing: "easeOutExpo", delay: 300 + i * 150 });
    });
  }, [entered]);

  return (
    <div ref={cardRef} className="flex flex-col justify-between relative overflow-hidden"
      style={{ backgroundColor: C.inverseSurface, color: C.surface, borderRadius: 12, padding: 32, minHeight: 220 }}>
      {/* Glowing corner */}
      <div className="absolute" style={{ top: -40, right: -40, width: 160, height: 160, background: `${C.primary}33`, filter: "blur(60px)" }} />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: "0.1em", fontWeight: 500, color: C.primary }}>06</span>
          <span className="material-symbols-outlined" style={{ color: C.primary + "80", fontSize: 24 }}>auto_awesome</span>
        </div>
        <h3 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 32, fontWeight: 700, lineHeight: 1.2, marginBottom: 32 }}>AI Development</h3>

        <div className="flex flex-col gap-4 mb-10">
          {AI_SKILLS.map((skill, i) => (
            <div key={skill.name} className="flex flex-col gap-1">
              <div className="flex justify-between" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: C.surfaceVariant, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                <span>{skill.name}</span>
                <span style={{ color: C.primary }}>{skill.level}%</span>
              </div>
              <div className="relative w-full" style={{ height: 2, backgroundColor: "rgba(255,255,255,0.1)" }}>
                <div ref={(el) => storeBar(el, i)} className="absolute top-0 left-0 h-full" style={{ backgroundColor: C.primary, boxShadow: `0 0 8px ${C.primaryContainer}`, width: "0%" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <button className="flex items-center gap-2 group" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: "0.1em", fontWeight: 500, color: C.primary, textTransform: "uppercase", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          View Details
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ fontSize: 14 }}>arrow_forward</span>
        </button>
        <div className="flex items-center justify-center" style={{ width: 64, height: 64, background: `linear-gradient(135deg, ${C.primary}4D, transparent)`, borderRadius: 12, backdropFilter: "blur(4px)", backgroundColor: "rgba(255,255,255,0.1)" }}>
          <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: 30 }}>token</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MERN FULL STACK BANNER
   ═══════════════════════════════════════════════════════════════════════════ */
function MERNBanner() {
  const bannerRef = useRef(null);
  const iconRefs = useRef([]);
  const [entered, setEntered] = useState(false);

  const storeIcon = useCallback((el, i) => { if (el) iconRefs.current[i] = el; }, []);

  useEffect(() => {
    const el = bannerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setEntered(true); obs.disconnect(); } },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!entered) return;
    anime({ targets: iconRefs.current.filter(Boolean), scale: [0.5, 1], opacity: [0, 1], duration: 600, delay: anime.stagger(100, { start: 300 }), easing: "easeOutBack" });
  }, [entered]);

  return (
    <div ref={bannerRef} className="relative overflow-hidden flex items-center justify-between flex-wrap gap-8 group"
      style={{ marginTop: 24, backgroundColor: C.inverseSurface, borderRadius: 12, padding: "32px 48px" }}>
      {/* Background gradient */}
      <div className="absolute inset-0 opacity-50" style={{ background: `linear-gradient(90deg, ${C.primary}0D 0%, transparent 50%, ${C.primary}0D 100%)` }} />

      <div className="relative z-10">
        <span className="block mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: "0.1em", fontWeight: 500, color: C.primary }}>07</span>
        <h3 style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 32, fontWeight: 700, lineHeight: 1.2, color: "#fff" }}>MERN Full Stack</h3>
      </div>

      <div className="relative z-10 flex items-center gap-12 flex-wrap justify-center">
        {MERN_ITEMS.map((item, i) => (
          <div key={item.label} className="flex items-center">
            <div ref={(el) => storeIcon(el, i)} className="flex flex-col items-center gap-2" style={{ opacity: 0 }}>
              <div className="flex items-center justify-center transition-colors duration-300 group-hover:border-[#b7230180]"
                style={{ width: 48, height: 48, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)" }}>
                <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: 24 }}>{item.icon}</span>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: C.surfaceVariant }}>{item.label}</span>
            </div>
            {i < MERN_ITEMS.length - 1 && <div className="hidden md:block ml-6" style={{ width: 32, height: 1, backgroundColor: "rgba(255,255,255,0.1)" }} />}
          </div>
        ))}
      </div>

      <button className="relative z-10 flex items-center justify-center rounded-full transition-colors duration-300"
        style={{ backgroundColor: C.primary + "1A", color: C.primary, width: 48, height: 48, border: "none", cursor: "pointer" }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.primary + "33"; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.primary + "1A"; }}>
        <span className="material-symbols-outlined">arrow_right_alt</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN SKILLS SECTION
   ═══════════════════════════════════════════════════════════════════════════ */
export default function SkillsSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const gridRef = useRef(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setEntered(true); obs.disconnect(); } },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!entered) return;

    anime({ targets: headingRef.current, translateY: [60, 0], opacity: [0, 1], duration: 1000, easing: "easeOutExpo", delay: 100 });
    anime({ targets: subRef.current, translateY: [40, 0], opacity: [0, 1], duration: 1000, easing: "easeOutExpo", delay: 400 });

    const cards = gridRef.current?.children;
    if (cards) {
      anime({ targets: Array.from(cards), translateY: [40, 0], opacity: [0, 1], duration: 700, delay: anime.stagger(100, { start: 600 }), easing: "easeOutExpo" });
    }
  }, [entered]);

  return (
    <section id="skills" ref={sectionRef} style={{ backgroundColor: C.surface, color: C.onSurface, fontFamily: "'Hanken Grotesk', sans-serif", minHeight: "100vh", position: "relative" }}>
      {/* Google Fonts for this section */}
      <link href="https://fonts.googleapis.com/css2?family=Epilogue:ital,wght@0,400;0,700;0,800;1,800&family=Hanken+Grotesk:wght@400;500&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px" }}>

        {/* ─── HERO: heading left + orbit right ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-12 relative overflow-hidden">
          {/* Left column */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <span style={{ color: C.primary, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: "0.1em", fontWeight: 500 }}>[ 03 ] — STACK</span>
            </div>

            <h1 ref={headingRef} style={{ fontFamily: "'Epilogue', sans-serif", fontSize: "clamp(48px, 6vw, 84px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 32, opacity: 0 }}>
              Tools I<br />
              <span style={{ fontStyle: "italic", color: C.primary }}>master</span><br />
              daily.
            </h1>

            <p ref={subRef} style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: 16, lineHeight: 1.6, color: C.onSurfaceVariant, maxWidth: 384, marginBottom: 40, opacity: 0 }}>
              A carefully curated toolkit powering everything I build — from intuitive interfaces to robust backend systems.
            </p>
          </div>

          {/* Right column — Orbit */}
          <div className="lg:col-span-7">
            <TechOrbit />
          </div>
        </div>

        {/* ─── Vertical decorative sidebar ─── */}
        <div className="fixed left-6 top-1/2 -translate-y-1/2 rotate-180 pointer-events-none hidden lg:block"
          style={{ writingMode: "vertical-lr", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: "0.5em", fontWeight: 500, color: C.onSurfaceVariant + "4D", textTransform: "uppercase", zIndex: 5 }}>
          : ENGINEERING. SOLVED.
        </div>

        {/* ─── SKILLS GRID ─── */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {LIGHT_CARDS.map((s) => (
            <SkillCardLight key={s.num} {...s} />
          ))}
          <AICard />
        </div>

        {/* ─── MERN BANNER ─── */}
        <MERNBanner />

        {/* Bottom spacing */}
        <div style={{ height: 80 }} />
      </div>

      {/* Material Symbols baseline settings */}
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
    </section>
  );
}
