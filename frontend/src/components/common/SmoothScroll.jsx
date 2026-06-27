import { useEffect, useRef, createContext, useContext } from "react";
import Lenis from "lenis";
import gsap from "gsap";

const LenisContext = createContext(null);

export function useLenis() {
  return useContext(LenisContext);
}

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      // ── The cinematic sweet spot ───────────────────────────────
      // DO NOT use duration + lerp together — lerp overrides duration.
      // Use lerp ONLY. This is the single most important setting.
      lerp: 0.1, // ← the ka1ki feel: responsive but weighted

      // ── Easing: expo out ──────────────────────────────────────
      // Fast response on input, then floats into rest.
      // This is what makes it feel like a camera with weight, not laggy.
      easing: (t) => 1 - Math.pow(1 - t, 4), // ease-out-quartic

      // ── Input ─────────────────────────────────────────────────
      smoothWheel: true,
      wheelMultiplier: 1, // keep native distance — don't slow the wheel
      touchMultiplier: 2,

      // ── Touch ─────────────────────────────────────────────────
      syncTouch: false, // let native touch inertia handle mobile
      orientation: "vertical",
      gestureOrientation: "vertical",

      // ── Prevent hijacking scrollable children ─────────────────
      prevent: (node) => node.closest?.("[data-lenis-prevent]") != null,
    });

    lenisRef.current = lenis;

    // ── GSAP ticker — frame-perfect, no drift ──────────────────
    // This is the key difference from raw rAF.
    // GSAP runs at a fixed framerate and handles tab visibility,
    // so the scroll never stutters when you tab back in.
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Disable GSAP lag smoothing so there's zero artificial delay
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
  );
}
