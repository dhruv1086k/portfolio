import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PixelButton from "../ui/PixelButton";
import { useLenis } from "../common/SmoothScroll";
import GridLogo from "../ui/GridLogo";
import { useLoader } from "../../context/LoaderContext";

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

function useScramble(text, { delay = 0, totalFrames = 12 } = {}) {
  const spanRef = useRef(null);
  const isBootDone = useRef(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const span = spanRef.current;
    if (!span) return;

    span.textContent = text
      .split("")
      .map(() => GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)])
      .join("");
    span.style.opacity = "0";

    const showTimer = setTimeout(() => {
      span.style.opacity = "1";
      span.style.color = "#C4501A";
      let frame = 0;
      const startTime = performance.now();
      const frameDuration = (totalFrames * 38) / totalFrames;

      const animate = (now) => {
        const elapsed = now - startTime;
        frame = Math.min(totalFrames, Math.floor(elapsed / frameDuration));
        const progress = frame / totalFrames;

        span.textContent = text
          .split("")
          .map((char, i) => {
            if (progress > i / text.length + 0.2) return char;
            return GLITCH_CHARS[
              Math.floor(Math.random() * GLITCH_CHARS.length)
            ];
          })
          .join("");

        if (frame < totalFrames) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          span.textContent = text;
          span.style.color = "";
          isBootDone.current = true;
        }
      };
      rafRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(showTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const triggerHoverScramble = useCallback(
    (toPixel) => {
      if (!isBootDone.current) return;
      const span = spanRef.current;
      if (!span) return;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      span.className = toPixel
        ? "font-pixelify uppercase"
        : "font-mono uppercase";
      span.style.transform = toPixel ? "scale(1.15)" : "scale(1)";

      let frame = 0;
      const frames = 10;
      const startTime = performance.now();

      const animate = (now) => {
        const elapsed = now - startTime;
        frame = Math.min(frames, Math.floor(elapsed / 30));
        const progress = frame / frames;

        span.textContent = text
          .split("")
          .map((char, i) => {
            if (progress > i / text.length + 0.3) return char;
            return GLITCH_CHARS[
              Math.floor(Math.random() * GLITCH_CHARS.length)
            ];
          })
          .join("");

        if (frame < frames) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          span.textContent = text;
        }
      };
      rafRef.current = requestAnimationFrame(animate);
    },
    [text],
  );

  return { spanRef, triggerHoverScramble, isBootDone };
}

function NavLink({ link, index, onBootDone }) {
  const LOGO_DURATION = 400;
  const LINK_STAGGER = 120;

  const { spanRef, triggerHoverScramble } = useScramble(link.label, {
    delay: LOGO_DURATION + index * LINK_STAGGER,
    totalFrames: 12,
  });

  useEffect(() => {
    const checkDone = setInterval(() => {
      if (spanRef.current && spanRef.current.style.color === "") {
        onBootDone();
        clearInterval(checkDone);
      }
    }, 100);
    return () => clearInterval(checkDone);
  }, []);

  return (
    <li
      onMouseEnter={() => triggerHoverScramble(true)}
      onMouseLeave={() => triggerHoverScramble(false)}
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
        <span
          ref={spanRef}
          className="font-mono uppercase"
          style={{
            fontSize: "13px",
            letterSpacing: "1.5px",
            transformOrigin: "left center",
            display: "inline-block",
            lineHeight: 1,
            transition: "color 0.6s ease, transform 0.2s ease",
          }}
        />
      </div>
    </li>
  );
}

export default function Navbar({ navLogoRef }) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [allBootDone, setAllBootDone] = useState(false);
  const bootCountRef = useRef(0);
  const lenisRef = useLenis();

  const { loaderDone } = useLoader();

  const handleBootDone = useCallback(() => {
    bootCountRef.current += 1;
    if (bootCountRef.current >= NAV_LINKS.length) {
      setAllBootDone(true);
    }
  }, []);

  const handleNavClick = (e, href) => {
    if (isHome && href.startsWith("/#")) {
      e.preventDefault();
      const target = document.getElementById(href.replace("/#", ""));
      if (target && lenisRef?.current) {
        lenisRef.current.scrollTo(target, { duration: 1.2 });
      } else if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-12 py-5 max-[960px]:px-6 max-[960px]:py-4"
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px) saturate(180%)",
          WebkitBackdropFilter: "blur(12px) saturate(180%)",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          willChange: "backdrop-filter",
          transform: "translateZ(0)",
        }}
      >
        {/* Logo — drops in after loaderDone */}
        <div ref={navLogoRef} style={{ overflow: "hidden", paddingBottom: 2 }}>
          <motion.div
            initial={{ y: "-120%", opacity: 0 }}
            animate={
              loaderDone ? { y: "0%", opacity: 1 } : { y: "-120%", opacity: 0 }
            }
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.05 }}
          >
            <Link to="/" className="flex items-center no-underline">
              <GridLogo SQ={10} GAP={2} />
            </Link>
          </motion.div>
        </div>

        {/* Desktop nav — gated on loaderDone */}
        <div className="hidden min-[961px]:flex items-center gap-9">
          <ul className="flex gap-8 list-none m-0 p-0">
            {NAV_LINKS.map((link, i) =>
              loaderDone ? (
                <NavLink
                  key={link.label}
                  link={link}
                  index={i}
                  onBootDone={handleBootDone}
                />
              ) : (
                <li
                  key={link.label}
                  style={{
                    minWidth: `${link.label.length * 12 + 10}px`,
                    height: 32,
                  }}
                />
              ),
            )}
          </ul>

          <div style={{ overflow: "hidden", paddingBottom: 2 }}>
            <motion.div
              initial={{ y: "-120%", opacity: 0 }}
              animate={
                loaderDone && allBootDone
                  ? { y: "0%", opacity: 1 }
                  : { y: "-120%", opacity: 0 }
              }
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.6 }}
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

        {/* Hamburger — gated on loaderDone */}
        <motion.button
          initial={{ y: "-120%", opacity: 0 }}
          animate={
            loaderDone ? { y: "0%", opacity: 1 } : { y: "-120%", opacity: 0 }
          }
          transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.2 }}
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
              transition={{ duration: 0.25, ease: EASE_IN_OUT }}
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
              transition={{ duration: 0.25, ease: EASE_IN_OUT }}
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

      {/* Mobile menu */}
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
                  duration: 0.35,
                  delay: i * 0.04,
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
              transition={{ delay: 0.25, duration: 0.25 }}
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
                      duration: 0.8,
                      delay: 0.8 + i * 0.06,
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
                    duration: 0.35,
                    delay: 1.2 + NAV_LINKS.length * 0.06,
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
                transition={{ duration: 0.5, delay: 1.85 }}
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
