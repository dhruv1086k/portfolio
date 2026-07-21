import { useState, useRef, useEffect, useCallback } from "react";
import { Link, redirect, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PixelButton from "../ui/PixelButton";
import { useLenis } from "../common/SmoothScroll";
import GridLogo from "../ui/GridLogo";
import { useLoader } from "../../context/LoaderContext";
import PixelChipButton from "../ui/pixel-chip-button";

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
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [allBootDone, setAllBootDone] = useState(false);
  const bootCountRef = useRef(0);
  const lenisRef = useLenis();
  const gridLogoRef = useRef(null);

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

  const handleLogoClick = () => {
    if (gridLogoRef.current?.play) {
      gridLogoRef.current.play();
    }

    setTimeout(() => {
      if (!isHome) {
        redirect("/");
      }
      requestAnimationFrame(() => {
        if (lenisRef?.current) {
          lenisRef.current.scrollTo(0, { duration: 1.2 });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    }, 500);
  };

  useEffect(() => {
    if (menuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [menuOpen]);

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
            <button
              type="button"
              onClick={handleLogoClick}
              aria-label="Go to homepage"
              className="flex items-center"
              style={{
                background: "none",
                border: "none",
                padding: 0,
                margin: 0,
                cursor: "pointer",
                font: "inherit",
              }}
            >
              <GridLogo ref={gridLogoRef} SQ={10} GAP={2} />
            </button>
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

          <div style={{ overflow: "hidden" }}>
            <motion.div
              initial={{ y: "-120%", opacity: 0 }}
              animate={
                loaderDone && allBootDone
                  ? { y: "0%", opacity: 1 }
                  : { y: "-120%", opacity: 0 }
              }
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.6 }}
            >
              <PixelChipButton
                label="RESUME"
                href="https://drive.google.com/uc?export=download&id=1B4aD0ZWQ12C_ghx3IUw6vwu7WENgAZgz"
                cols={8}
                cell={11}
                fontSize={12}
              />
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
            width: 48,
            height: 48,
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <svg
            viewBox="0 0 32 32"
            style={{
              height: "2em",
              transform: menuOpen ? "rotate(-45deg)" : "rotate(0deg)",
              transition: "transform 1200ms cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            <path
              d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
              style={{
                fill: "none",
                stroke: menuOpen ? "#F5F2EB" : "#0D0C0A",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 3,
                strokeDasharray: menuOpen ? "20 300" : "12 63",
                strokeDashoffset: menuOpen ? -32.42 : 0,
                transition:
                  "stroke-dasharray 1200ms cubic-bezier(0.4,0,0.2,1), stroke-dashoffset 1200ms cubic-bezier(0.4,0,0.2,1), stroke 1200ms ease",
              }}
            />
            <path
              d="M7 16 27 16"
              style={{
                fill: "none",
                stroke: menuOpen ? "#F5F2EB" : "#0D0C0A",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 3,
                transition: "stroke 1200ms ease",
              }}
            />
          </svg>
        </motion.button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <div
            className="fixed inset-0 z-[90] min-[961px]:hidden"
            style={{ overscrollBehavior: "contain" }}
          >
            {Array.from({ length: STRIP_COUNT }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scaleX: 0 }}
                animate={{
                  scaleX: 1,
                  transition: {
                    duration: 0.35,
                    delay: i * 0.04,
                    ease: [0.76, 0, 0.24, 1],
                  },
                }}
                exit={{
                  scaleX: 0,
                  transition: {
                    duration: 0.3,
                    delay: 0.42 + (STRIP_COUNT - 1 - i) * 0.025,
                    ease: [0.76, 0, 0.24, 1],
                  },
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
              animate={{ opacity: 1, transition: { delay: 0.25, duration: 0.25 } }}
              exit={{ opacity: 0, transition: { delay: 0.28, duration: 0.15 } }}
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
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.8,
                        delay: 0.8 + i * 0.06,
                        ease: EASE_OUT_EXPO,
                      },
                    }}
                    exit={{
                      opacity: 0,
                      y: 16,
                      transition: {
                        duration: 0.22,
                        delay: (NAV_LINKS.length - 1 - i) * 0.03,
                        ease: EASE_IN_OUT,
                      },
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
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.35,
                      delay: 1.2 + NAV_LINKS.length * 0.06,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    y: 16,
                    transition: { duration: 0.2, delay: 0.09 },
                  }}
                  className="mt-6"
                >
                  <PixelChipButton
                    label="RESUME"
                    accentColor="#FF6A00"
                    textColor="#fff"
                    bgColor="#100D0A"
                    href="https://drive.google.com/uc?export=download&id=1B4aD0ZWQ12C_ghx3IUw6vwu7WENgAZgz"
                    cols={8}
                    cell={11}
                    fontSize={12}
                  />
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.5, delay: 1.85 } }}
                exit={{ opacity: 0, transition: { duration: 0.2, delay: 0.05 } }}
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
              </motion.div >
            </motion.div >
          </div >
        )
        }
      </AnimatePresence >
    </>
  );
}