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
      lerp: 0.06,
      easing: (t) => 1 - Math.pow(1 - t, 3),

      smoothWheel: true,
      wheelMultiplier: 0.8,

      smoothTouch: true,
      touchMultiplier: 0.7,
      syncTouch: false,

      orientation: "vertical",
      gestureOrientation: "vertical",

      prevent: (node) => node.closest?.("[data-lenis-prevent]") != null,
    });

    lenisRef.current = lenis;

    const update = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(update);

    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
  );
}