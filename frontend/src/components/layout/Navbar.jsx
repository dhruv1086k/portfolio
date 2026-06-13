import { useState } from "react";
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

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (e, href) => {
    if (isHome && href.startsWith("/#")) {
      e.preventDefault();
      const id = href.replace("/#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-12 py-5 max-[960px]:px-6 max-[960px]:py-4"
        style={{
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        <Link to="/" className="flex items-center no-underline">
          <img className="w-14" src="/logo.png" alt="logo" />
        </Link>

        <div className="hidden min-[961px]:flex items-center gap-9">
          <ul className="flex gap-8 list-none m-0 p-0">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-xs text-ink-3 no-underline tracking-[1.5px] uppercase font-normal transition-colors duration-250 hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <PixelButton
            href="#projects"
            pixelSize={6}
            bgColor="#C4501A"
            textColor="#0D0C0A"
          >
            RESUME
          </PixelButton>
        </div>

        <button
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
          <div style={{ width: 24, height: 16, position: "relative" }}>
            <motion.span
              animate={
                menuOpen
                  ? { rotate: 45, top: "50%", y: "-50%" }
                  : { rotate: 0, top: 0, y: "0%" }
              }
              transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
              style={{
                position: "absolute",
                left: 0,
                width: "100%",
                height: 2,
                background: menuOpen ? "#F5F2EB" : "#F5F2EB",
                transformOrigin: "center",
              }}
            />
            <motion.span
              animate={menuOpen ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                width: "100%",
                height: 2,
                background: "#F5F2EB",
                transform: "translateY(-50%)",
              }}
            />
            <motion.span
              animate={
                menuOpen
                  ? { rotate: -45, bottom: "50%", y: "50%" }
                  : { rotate: 0, bottom: 0, y: "0%" }
              }
              transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
              style={{
                position: "absolute",
                left: 0,
                width: "100%",
                height: 2,
                background: "#F5F2EB",
                transformOrigin: "center",
              }}
            />
          </div>
        </button>
      </nav>

      {/* MOBILE STRIP-REVEAL MENU */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-[90] min-[961px]:hidden">
            {/* Strips sweeping in from the right */}
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

            {/* Content layer */}
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
                      ease: [0.16, 1, 0.3, 1],
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
                      className="font-playfair font-bold italic no-underline flex items-baseline gap-4"
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

              {/* Footer info block */}
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
