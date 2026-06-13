import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import ScrollReveal from "../common/ScrollReveal";
import PixelButton from "../ui/PixelButton";
import Tag from "../ui/Tag";
import PixelCanvas from "../ui/PixelCanvas";
import { SITE_CONFIG } from "../../constants/data";

/* ── Score Board (replaces top-right HUD, drops in from top center) ───────── */
function ScoreBoard({ score, total, onExit }) {
  const pct = total > 0 ? Math.min(1, score / total) : 0;

  return (
    <motion.div
      initial={{ y: -220, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -220, opacity: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      style={{
        position: "fixed",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        pointerEvents: "auto",
        background: "#1a0f08",
        borderLeft: "4px solid #C4501A",
        borderRight: "4px solid #C4501A",
        borderBottom: "4px solid #C4501A",
        borderTop: "none",
        borderRadius: 0,
        padding: "20px 28px 18px",
        minWidth: 260,
        imageRendering: "pixelated",
      }}
    >
      {/* Scanlines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 4px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: -4,
          right: -4,
          height: 4,
          background:
            "repeating-linear-gradient(90deg, #C4501A 0px, #C4501A 8px, #6b200a 8px, #6b200a 12px)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* Label */}
        <div
          style={{
            fontFamily: "'Pixelify Sans', monospace",
            fontSize: 12,
            letterSpacing: "5px",
            color: "#ff8c50",
            textTransform: "uppercase",
          }}
        >
          BUGS KILLED
        </div>

        {/* Score digits */}
        <div
          style={{
            display: "flex",
            gap: 6,
            background: "#0a0705",
            border: "3px solid #C4501A",
            padding: "10px 16px",
            outline: "2px solid #6b200a",
            outlineOffset: "3px",
          }}
        >
          {String(score)
            .padStart(4, "0")
            .split("")
            .map((d, i) => (
              <motion.div
                key={`${i}-${d}`}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.15 }}
                style={{
                  fontFamily: "'Pixelify Sans', monospace",
                  fontWeight: "bold",
                  fontSize: 48,
                  lineHeight: 1,
                  width: 34,
                  textAlign: "center",
                  color: score > 0 ? "#ff6b2b" : "#3d1a0a",
                  textShadow:
                    score > 0 ? "0 0 8px #ff6b2b, 2px 2px 0 #6b200a" : "none",
                }}
              >
                {d}
              </motion.div>
            ))}
        </div>

        {/* Segmented progress bar */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 3,
              height: 12,
              border: "2px solid #C4501A55",
              padding: 3,
              background: "#0a0705",
            }}
          >
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: i / 24 < pct ? "#C4501A" : "#1f1108",
                  boxShadow: i / 24 < pct ? "0 0 4px #C4501A88" : "none",
                  transition: "background 0.1s",
                }}
              />
            ))}
          </div>
          <div
            style={{
              fontFamily: "'Pixelify Sans', monospace",
              fontSize: 11,
              color: "#C4501A",
              letterSpacing: "3px",
              textAlign: "center",
              opacity: 0.8,
            }}
          >
            {score} / {total}
          </div>
        </div>

        {/* Exit button */}
        <button
          onClick={onExit}
          style={{
            fontFamily: "'Pixelify Sans', monospace",
            fontSize: 11,
            letterSpacing: "4px",
            color: "#ff8c50",
            background: "#0a0705",
            border: "2px solid #C4501A",
            borderRadius: 0,
            padding: "7px 20px",
            cursor: "pointer",
            outline: "none",
            transition: "all 0.1s",
            textTransform: "uppercase",
            boxShadow: "3px 3px 0 #6b200a",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#C4501A";
            e.currentTarget.style.color = "#0a0705";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.transform = "translate(3px, 3px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#0a0705";
            e.currentTarget.style.color = "#ff8c50";
            e.currentTarget.style.boxShadow = "3px 3px 0 #6b200a";
            e.currentTarget.style.transform = "none";
          }}
        >
          ✕ EXIT GAME
        </button>
      </div>
    </motion.div>
  );
}

/* ── Flyswatter Cursor ────────────────────────────────────────────────────── */
function BugKillerCursor({ visible }) {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [isSwatting, setIsSwatting] = useState(false);

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const down = () => {
      setIsSwatting(true);
      setTimeout(() => setIsSwatting(false), 200);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
    };
  }, []);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0, scale: 0.5 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 120, opacity: 0, scale: 0.5 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          style={{
            position: "fixed",
            left: pos.x - 20,
            top: pos.y - 72,
            zIndex: 99999,
            pointerEvents: "none",
            transformOrigin: "center bottom",
          }}
        >
          <SwatterSVG isSwatting={isSwatting} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SwatterSVG({ isSwatting }) {
  return (
    <motion.svg
      width="52"
      height="88"
      viewBox="0 0 52 88"
      style={{
        filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))",
        display: "block",
      }}
      animate={isSwatting ? { rotate: [0, 30, -12, 0], y: [0, 8, -3, 0] } : {}}
      transition={{ duration: 0.22 }}
    >
      <rect x="23" y="46" width="7" height="42" rx="3.5" fill="#8B4513" />
      {[52, 58, 64, 70].map((y) => (
        <line
          key={y}
          x1="23"
          y1={y}
          x2="30"
          y2={y}
          stroke="#6b3410"
          strokeWidth="1.5"
          opacity="0.6"
        />
      ))}
      <rect
        x="4"
        y="4"
        width="44"
        height="44"
        rx="7"
        fill="rgba(196,80,26,0.10)"
        stroke="#C4501A"
        strokeWidth="3"
      />
      {[13, 22, 31, 40].map((x) => (
        <line
          key={`v${x}`}
          x1={x}
          y1="4"
          x2={x}
          y2="48"
          stroke="#C4501A"
          strokeWidth="1.2"
          opacity="0.55"
        />
      ))}
      {[13, 22, 31, 40].map((y) => (
        <line
          key={`h${y}`}
          x1="4"
          y1={y}
          x2="48"
          y2={y}
          stroke="#C4501A"
          strokeWidth="1.2"
          opacity="0.55"
        />
      ))}
      <circle cx="4" cy="4" r="2.5" fill="#C4501A" />
      <circle cx="48" cy="4" r="2.5" fill="#C4501A" />
      <circle cx="4" cy="48" r="2.5" fill="#C4501A" />
      <circle cx="48" cy="48" r="2.5" fill="#C4501A" />
      {isSwatting && (
        <rect
          x="4"
          y="4"
          width="44"
          height="44"
          rx="7"
          fill="rgba(196,80,26,0.25)"
        />
      )}
    </motion.svg>
  );
}

/* ── Hanging Button (no chain) ───────────────────────────────────────────── */
function HangingButton({ onClick, pulled }) {
  const [hovered, setHovered] = useState(false);

  return (
    <AnimatePresence>
      {!pulled && (
        <motion.button
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{
            y: 40,
            opacity: 0,
            transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
          }}
          transition={{
            type: "tween",
            duration: 1,
            ease: [0.22, 0.0, 0.36, 1.0],
            delay: 0.6,
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={onClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.93, y: 3 }}
          style={{
            position: "relative",
            pointerEvents: "auto",
            fontFamily: "'Pixelify Sans', 'Courier New', monospace",
            fontSize: 13,
            fontWeight: "bold",
            letterSpacing: "1.5px",
            color: "#F5F2EB",
            background: "#0D0C0A",
            border: "2px solid #C4501A",
            borderRadius: 4,
            padding: "10px 20px",
            cursor: "pointer",
            outline: "none",
            boxShadow: hovered
              ? "0 0 20px rgba(196,80,26,0.6), 0 4px 0 #6b200a, inset 0 0 8px rgba(196,80,26,0.1)"
              : "0 4px 0 #6b200a, 0 6px 16px rgba(0,0,0,0.4)",
            transition: "box-shadow 0.2s",
            whiteSpace: "nowrap",
          }}
        >
          {[
            { top: -1, left: -1 },
            { top: -1, right: -1 },
            { bottom: -1, left: -1 },
            { bottom: -1, right: -1 },
          ].map((s, i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                width: 4,
                height: 4,
                background: "#C4501A",
                ...s,
              }}
            />
          ))}
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            REMOVE BUGS
          </span>
          {hovered && (
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 3,
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(196,80,26,0.04) 2px, rgba(196,80,26,0.04) 4px)",
                pointerEvents: "none",
              }}
            />
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ── Main HeroSection ─────────────────────────────────────────────────────── */
export default function HeroSection() {
  const sectionRef = useRef(null);
  const pixelCanvasRef = useRef(null);
  const [gameMode, setGameMode] = useState(false);
  const [score, setScore] = useState(0);
  const [totalBugs, setTotalBugs] = useState(0);
  const [buttonPulled, setButtonPulled] = useState(false);
  const [bugKillerVisible, setBugKillerVisible] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [exitScore, setExitScore] = useState(null);

  /* ── Parallax motion ── */
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
      if (gameMode) return;
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
  }, [rawX, rawY, gameMode]);

  const handleBugsSpawned = useCallback((count) => {
    setTotalBugs(count);
  }, []);

  const handleRemoveBugs = useCallback(() => {
    setButtonPulled(true);
    setScore(0);
    setGameOver(false);
    setExitScore(null);
    setTotalBugs(0);
    setTimeout(() => {
      setGameMode(true);
      pixelCanvasRef.current?.triggerGameBugs();
      setBugKillerVisible(true);
    }, 400);
  }, []);

  const handleBugKilled = useCallback(() => {
    setScore((prev) => prev + 1);
  }, []);

  const handleAllBugsKilled = useCallback((killedCount) => {
    setBugKillerVisible(false);
    setGameOver(true);
    if (killedCount != null) setScore(killedCount);

    pixelCanvasRef.current?.resetGame(); // ← ADD: reassemble immediately

    setTimeout(() => {
      setGameMode(false);
      setButtonPulled(false);
      setScore(0);
      setGameOver(false);
    }, 3500);
  }, []);

  const handleExit = useCallback(() => {
    setBugKillerVisible(false);
    setExitScore(score);
    setGameOver(false);

    pixelCanvasRef.current?.resetGame(); // ← ADD: reassemble immediately

    setTimeout(() => {
      setGameMode(false);
      setButtonPulled(false);
      setScore(0);
      setExitScore(null);
    }, 3000);
  }, [score]);

  useEffect(() => {
    document.body.style.cursor = gameMode ? "none" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [gameMode]);

  const headingX = useTransform(mx, [-0.5, 0.5], [-15, 15]);
  const headingY = useTransform(my, [-0.5, 0.5], [-10, 10]);

  return (
    <div style={{ position: "relative" }}>
      <section
        id="hero"
        ref={sectionRef}
        className="relative overflow-hidden border-b border-line"
        style={{ perspective: "1200px" }}
      >
        {/* Bug killer custom cursor */}
        <BugKillerCursor visible={bugKillerVisible} />

        {/* Score board */}
        <AnimatePresence>
          {gameMode && (
            <ScoreBoard score={score} total={totalBugs} onExit={handleExit} />
          )}
        </AnimatePresence>

        {/* All-bugs-killed banner */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 99998,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                background: "rgba(13,12,10,0.55)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Pixelify Sans', monospace",
                  fontSize: "clamp(32px, 6vw, 80px)",
                  fontWeight: "bold",
                  color: "#C4501A",
                  textShadow:
                    "2px 2px 0 #0D0C0A, 4px 4px 0 #0D0C0A, 6px 6px 0 #0D0C0A, 0 0 40px rgba(196,80,26,0.9), 0 0 80px rgba(196,80,26,0.5)",
                  letterSpacing: "4px",
                  textAlign: "center",
                  padding: "0 24px",
                }}
              >
                BUGS REMOVED!
                <div
                  style={{
                    fontSize: "0.38em",
                    marginTop: 12,
                    color: "#F5F2EB",
                    textShadow:
                      "1px 1px 0 #0D0C0A, 3px 3px 0 #0D0C0A, 0 0 20px rgba(0,0,0,0.9)",
                    letterSpacing: "3px",
                  }}
                >
                  {score} / {totalBugs} SQUASHED
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exit score display */}
        <AnimatePresence>
          {exitScore !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 99998,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                background: "rgba(13,12,10,0.60)",
              }}
            >
              <div style={{ textAlign: "center", padding: "0 24px" }}>
                <div
                  style={{
                    fontFamily: "'Pixelify Sans', monospace",
                    fontSize: "clamp(11px, 1.4vw, 18px)",
                    letterSpacing: "4px",
                    color: "#F5F2EB",
                    textShadow: "1px 1px 0 #0D0C0A, 3px 3px 0 #0D0C0A",
                    opacity: 0.7,
                    marginBottom: 10,
                  }}
                >
                  GAME OVER
                </div>
                <div
                  style={{
                    fontFamily: "'Pixelify Sans', monospace",
                    fontSize: "clamp(56px, 12vw, 140px)",
                    fontWeight: "bold",
                    color: "#C4501A",
                    lineHeight: 1,
                    textShadow:
                      "3px 3px 0 #0D0C0A, 6px 6px 0 #0D0C0A, 9px 9px 0 #0D0C0A, 0 0 50px rgba(196,80,26,0.8)",
                    letterSpacing: "-2px",
                  }}
                >
                  {exitScore}
                </div>
                <div
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: "clamp(10px, 1.2vw, 14px)",
                    letterSpacing: "3px",
                    color: "#F5F2EB",
                    textShadow: "1px 1px 0 #0D0C0A, 2px 2px 0 #0D0C0A",
                    opacity: 0.55,
                    marginTop: 8,
                  }}
                >
                  BUGS KILLED
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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

        {/* ═══ DESKTOP: Top bar ═══ */}
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

        {/* ═══ DESKTOP: Pixel canvas ═══ */}
        <motion.div
          className="hidden md:block absolute select-none"
          style={{
            bottom: 0,
            right: 0,
            width: "clamp(240px, 35vw, 500px)",
            height: "100vh",
            zIndex: gameMode ? 10 : 1,
          }}
        >
          <PixelCanvas
            ref={pixelCanvasRef}
            src="/logo_2.png"
            pixelSize={4}
            anchor="bottom-center"
            gameMode={gameMode}
            onBugKilled={handleBugKilled}
            onAllBugsKilled={handleAllBugsKilled}
            onBugsSpawned={handleBugsSpawned}
          />
        </motion.div>

        {/* ═══ CONTENT WRAPPER ═══ */}
        <div className="relative flex flex-col min-h-screen">
          {/* Mobile top info */}
          <div className="md:hidden pt-24 px-6 space-y-2">
            <span className="font-mono text-[10px] text-ink-4 tracking-[2px] uppercase block">
              [01] — Portfolio 2025
            </span>
            <div className="text-[12px] text-ink-3 leading-[1.7] font-mono font-light max-w-[320px]">
              {SITE_CONFIG.heroDescription}
            </div>
          </div>

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
              x: headingX,
              y: headingY,
              transformStyle: "preserve-3d",
              pointerEvents: "none",
              textShadow: `1px 1px 0px rgba(0,0,0,0.06), 2px 2px 0px rgba(0,0,0,0.05), 4px 4px 0px rgba(0,0,0,0.04), 8px 8px 0px rgba(0,0,0,0.03), 14px 14px 28px rgba(0,0,0,0.08)`,
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            I build
            <br />
            <em
              className="italic font-pixelify"
              style={{
                display: "inline-block",
                color: "var(--color-accent)",
                textShadow: `1px 1px 0px rgba(0,0,0,0.08), 3px 3px 0px rgba(0,0,0,0.06), 6px 6px 0px rgba(0,0,0,0.05), 10px 10px 0px rgba(0,0,0,0.04), 18px 18px 32px rgba(0,0,0,0.12)`,
                transform: "translateZ(20px) scale(1.01)",
                transformStyle: "preserve-3d",
              }}
            >
              digital
            </em>
            <br />
            products.
          </motion.h1>

          {/* ── Mobile pixel image ── */}
          <div
            className="block md:hidden mx-auto mb-6"
            style={{
              width: "min(85vw, 380px)",
              aspectRatio: "3 / 4",
              position: "relative",
              zIndex: 2,
            }}
          >
            <PixelCanvas src="/logo_2.png" anchor="center" gameMode={false} />
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

            <div style={{ pointerEvents: "auto" }}>
              <HangingButton onClick={handleRemoveBugs} pulled={buttonPulled} />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
