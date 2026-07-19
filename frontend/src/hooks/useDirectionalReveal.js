import { useEffect, useRef, useState } from "react";
import { getScrollDirection } from "../lib/scrollDirection";

/**
 * Directional scroll-reveal, driven by plain React state instead of
 * useAnimation() imperative controls.
 *
 * Why: passing a variant *label* (string) to `animate` lets Framer Motion's
 * own engine own the interruption/propagation logic — including down to
 * nested children that declare their own `variants`. Imperative
 * controls.start()/.set()/.stop() calls on nested useAnimation() instances
 * can race each other under bursty IntersectionObserver events (e.g. fast
 * scrollbar drags), leaving some children synced to the new state and
 * others stuck on a stale one. Plain state sidesteps that whole class of bug.
 *
 * - Entering the viewport while scrolling DOWN -> animates to "visible".
 * - Entering while scrolling UP                -> snaps to "visible" instantly.
 * - Leaving the viewport (either direction)     -> animates to "hidden".
 *
 * Usage:
 *   const { ref, animate, transition } = useDirectionalReveal();
 *   <motion.div ref={ref} variants={variants} initial="hidden" animate={animate} transition={transition} />
 */
export function useDirectionalReveal({
    threshold = 0.2,
    rootMargin = "0px",
    enterTransition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    exitTransition = { duration: 0.35, ease: [0.4, 0, 1, 1] },
} = {}) {
    const ref = useRef(null);
    const [animate, setAnimate] = useState("hidden");
    const [transition, setTransition] = useState(exitTransition);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const scrollingDown = getScrollDirection() === "down";

                if (entry.isIntersecting) {
                    setTransition(scrollingDown ? enterTransition : { duration: 0 });
                    setAnimate("visible");
                } else {
                    setTransition(exitTransition);
                    setAnimate("hidden");
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, rootMargin]);

    return { ref, animate, transition };
}