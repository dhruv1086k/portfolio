import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PixelButton from "../ui/PixelButton";

const NAV_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Work", href: "/#projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];

const STRIP_COUNT = 5;
const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/01XYZ#%&";
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];
const EASE_IN_OUT = [0.65, 0, 0.35, 1];

/* ── Boot scramble: starts as glitch, resolves to real text ────────────── */
function BootScramble({ text, delay = 0, onDone, hovered, bootDone }) {
  const [display, setDisplay] = useState(() =>
    text
      .split("")
      .map(() => GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)])
      .join(""),
  );
  const [visible, setVisible] = useState(false);
  const [pixelFont, setPixelFont] = useState(false);
  const intervalRef = useRef(null);
  const frameRef = useRef(0);
  const isBootDone = useRef(false);

  // Initial boot scramble
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setVisible(true);
      let frame = 0;
      const totalFrames = 16;
      const iv = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const next = text
          .split("")
          .map((char, i) => {
            if (progress > i / text.length + 0.2) return char;
            return GLITCH_CHARS[
              Math.floor(Math.random() * GLITCH_CHARS.length)
            ];
          })
          .join("");
        setDisplay(next);
        if (frame >= totalFrames) {
          clearInterval(iv);
          setDisplay(text);
          isBootDone.current = true;
          onDone?.();
        }
      }, 38);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(showTimer);
  }, []);

  // Hover scramble after boot done
  useEffect(() => {
    if (!bootDone) return;
    clearInterval(intervalRef.current);
    frameRef.current = 0;
    const totalFrames = 10;
    setPixelFont(hovered);
    intervalRef.current = setInterval(() => {
      frameRef.current++;
      const progress = frameRef.current / totalFrames;
      const next = text
        .split("")
        .map((char, i) => {
          if (progress > i / text.length + 0.3) return char;
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        })
        .join("");
      setDisplay(next);
      if (frameRef.current >= totalFrames) {
        clearInterval(intervalRef.current);
        setDisplay(text);
      }
    }, 35);
  }, [hovered]);

  return (
    <span
      className={`uppercase ${pixelFont ? "font-pixelify" : "font-mono"}`}
      style={{
        fontSize: "13px",
        letterSpacing: "1.5px",
        transform: pixelFont ? "scale(1.15)" : "scale(1)",
        transformOrigin: "left center",
        display: "inline-block",
        lineHeight: 1,
        opacity: visible ? 1 : 0,
        color: isBootDone.current ? "inherit" : "#C4501A",
        transition: "color 0.4s ease",
      }}
    >
      {display}
    </span>
  );
}

/* ── Hover scramble ─────────────────────────────────────────────────────── */
function ScrambleText({ text, trigger }) {
  const [display, setDisplay] = useState(text);
  const [pixelFont, setPixelFont] = useState(false);
  const intervalRef = useRef(null);
  const frameRef = useRef(0);

  const runScramble = (toPixel) => {
    clearInterval(intervalRef.current);
    frameRef.current = 0;
    const totalFrames = 10;
    setPixelFont(toPixel);
    intervalRef.current = setInterval(() => {
      frameRef.current++;
      const progress = frameRef.current / totalFrames;
      const next = text
        .split("")
        .map((char, i) => {
          if (progress > i / text.length + 0.3) return char;
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        })
        .join("");
      setDisplay(next);
      if (frameRef.current >= totalFrames) {
        clearInterval(intervalRef.current);
        setDisplay(text);
      }
    }, 35);
  };

  useEffect(() => {
    runScramble(trigger);
  }, [trigger]);

  return (
    <span
      className={pixelFont ? "font-pixelify" : "font-mono"}
      style={{
        fontSize: "13px",
        transform: pixelFont ? "scale(1.15)" : "scale(1)",
        transformOrigin: "left center",
        display: "inline-block",
        lineHeight: 1,
      }}
    >
      {display}
    </span>
  );
}

/* ── Navbar ─────────────────────────────────────────────────────────────── */
export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [bootDoneCount, setBootDoneCount] = useState(0);

  const allBootDone = bootDoneCount >= NAV_LINKS.length;

  // Each link's boot delay: staggered after logo finishes (~500ms)
  const LOGO_DURATION = 500;
  const LINK_STAGGER = 160;

  const handleNavClick = (e, href) => {
    if (isHome && href.startsWith("/#")) {
      e.preventDefault();
      document
        .getElementById(href.replace("/#", ""))
        ?.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-12 py-5 max-[960px]:px-6 max-[960px]:py-4"
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        {/* ── Logo: drops from above ── */}
        <div style={{ overflow: "hidden", paddingBottom: 2 }}>
          <motion.div
            initial={{ y: "-120%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 0.7,
              ease: EASE_OUT_EXPO,
              delay: 0.1,
            }}
          >
            <Link to="/" className="flex items-center no-underline">
              <img className="w-14" src="/logo.png" alt="logo" />
            </Link>
          </motion.div>
        </div>

        {/* ── Desktop nav ── */}
        <div className="hidden min-[961px]:flex items-center gap-9">
          <ul className="flex gap-8 list-none m-0 p-0">
            {NAV_LINKS.map((link, i) => (
              <li
                key={link.label}
                onMouseEnter={() => allBootDone && setHoveredLink(link.label)}
                onMouseLeave={() => allBootDone && setHoveredLink(null)}
                style={{
                  position: "relative",
                  minWidth: `${link.label.length * 12 + 10}px`,
                  height: "32px",
                  cursor: "pointer",
                }}
              >
                <div
                  className="text-xs text-black no-underline tracking-[1.5px] uppercase font-bold"
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    lineHeight: 1,
                    textShadow:
                      "-1px -1px 0 #fff,1px -1px 0 #fff,-1px 1px 0 #fff,1px 1px 0 #fff",
                  }}
                >
                  <BootScramble
                    text={link.label}
                    delay={LOGO_DURATION + i * LINK_STAGGER}
                    onDone={() => setBootDoneCount((c) => c + 1)}
                    hovered={hoveredLink === link.label}
                    bootDone={allBootDone}
                  />
                </div>
              </li>
            ))}
          </ul>

          {/* ── Resume: drops from above after all links done ── */}
          <div style={{ overflow: "hidden", paddingBottom: 2 }}>
            <motion.div
              initial={{ y: "-120%", opacity: 0 }}
              animate={
                allBootDone
                  ? { y: "0%", opacity: 1 }
                  : { y: "-120%", opacity: 0 }
              }
              transition={{
                duration: 0.6,
                ease: EASE_OUT_EXPO,
                delay: 0.05,
              }}
            >
              <PixelButton
                href="#projects"
                pixelSize={6}
                bgColor="#C4501A"
                textColor="#0D0C0A"
              >
                RESUME
              </PixelButton>
            </motion.div>
          </div>
        </div>

        {/* ── Hamburger ── */}
        <motion.button
          initial={{ y: "-120%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.1 }}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="min-[961px]:hidden relative z-[110] flex items-center justify-center"
          style={{
            width: 44,
            height: 44,
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <div style={{ width: 24, height: 14, position: "relative" }}>
            <motion.span
              animate={
                menuOpen
                  ? { rotate: 45, top: "50%", y: "-50%" }
                  : { rotate: 0, top: "0%", y: "0%" }
              }
              transition={{ duration: 0.3, ease: EASE_IN_OUT }}
              style={{
                position: "absolute",
                left: 0,
                width: "100%",
                height: 2,
                background: menuOpen ? "#F5F2EB" : "#0D0C0A",
                transformOrigin: "center",
              }}
            />
            <motion.span
              animate={
                menuOpen
                  ? { rotate: -45, bottom: "50%", y: "50%" }
                  : { rotate: 0, bottom: "0%", y: "0%" }
              }
              transition={{ duration: 0.3, ease: EASE_IN_OUT }}
              style={{
                position: "absolute",
                left: 0,
                width: "100%",
                height: 2,
                background: menuOpen ? "#F5F2EB" : "#0D0C0A",
                transformOrigin: "center",
              }}
            />
          </div>
        </motion.button>
      </nav>

      {/* ── Mobile menu ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-[90] min-[961px]:hidden">
            {Array.from({ length: STRIP_COUNT }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.06,
                  ease: [0.76, 0, 0.24, 1],
                }}
                style={{
                  position: "absolute",
                  top: `calc(${(i * 100) / STRIP_COUNT}% - 1px)`,
                  left: 0,
                  width: "100%",
                  height: `calc(${100 / STRIP_COUNT}% + 2px)`,
                  background: "#0D0C0A",
                  transformOrigin: "right",
                }}
              />
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.35, duration: 0.3 }}
              className="absolute inset-0 flex flex-col"
            >
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "repeating-linear-gradient(0deg, rgba(196,80,26,0.03) 0px, rgba(196,80,26,0.03) 1px, transparent 1px, transparent 4px)",
                  pointerEvents: "none",
                }}
              />

              <div className="flex-1 flex flex-col justify-center px-8 gap-1 relative z-10">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 24 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.45 + i * 0.08,
                      ease: EASE_OUT_EXPO,
                    }}
                    style={{
                      borderBottom: "1px solid rgba(196,80,26,0.12)",
                      paddingTop: "clamp(10px, 2.5vh, 22px)",
                      paddingBottom: "clamp(10px, 2.5vh, 22px)",
                    }}
                  >
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="font-PT-serif font-bold italic no-underline flex items-baseline gap-4"
                      style={{
                        fontSize: "clamp(32px, 11vw, 60px)",
                        color: "#F5F2EB",
                        letterSpacing: "-1px",
                        lineHeight: 1,
                      }}
                    >
                      <span
                        className="font-mono not-italic"
                        style={{
                          fontSize: 12,
                          color: "#C4501A",
                          letterSpacing: "2px",
                        }}
                      >
                        0{i + 1}
                      </span>
                      {link.label}
                    </a>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.45 + NAV_LINKS.length * 0.08,
                  }}
                  className="mt-6"
                >
                  <PixelButton
                    href="#projects"
                    pixelSize={6}
                    bgColor="#C4501A"
                    textColor="#0D0C0A"
                  >
                    RESUME
                  </PixelButton>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="px-8 pb-8 pt-4 relative z-10"
                style={{ borderTop: "1px solid rgba(196,80,26,0.12)" }}
              >
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p
                      className="font-mono text-[10px] tracking-[2px] uppercase mb-3"
                      style={{ color: "#5a4a3a" }}
                    >
                      Elsewhere
                    </p>
                    <div className="flex flex-col gap-2">
                      {["LinkedIn", "GitHub", "Twitter"].map((s) => (
                        <a
                          key={s}
                          href="#"
                          className="font-mono text-[12px] tracking-[1px] no-underline"
                          style={{ color: "#F5F2EB" }}
                        >
                          {s} ↗
                        </a>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p
                      className="font-mono text-[10px] tracking-[2px] uppercase mb-3"
                      style={{ color: "#5a4a3a" }}
                    >
                      Say hello
                    </p>
                    <a
                      href="mailto:hello@example.com"
                      className="font-mono text-[12px] tracking-[1px] no-underline block mb-2"
                      style={{ color: "#F5F2EB" }}
                    >
                      hello@example.com
                    </a>
                    <p
                      className="font-mono text-[10px] tracking-[1px] uppercase"
                      style={{ color: "#5a4a3a" }}
                    >
                      Based in India
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
