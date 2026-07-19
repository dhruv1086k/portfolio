import { useEffect, useRef } from "react";
import anime from "animejs";
import { getScrollDirection } from "../../lib/scrollDirection";

/**
 * Scroll-triggered blur fade — but direction-aware:
 * - Entering the viewport while scrolling DOWN  -> animates in (blur fade in).
 * - Entering the viewport while scrolling UP    -> snaps to visible instantly, no animation.
 * - Leaving the viewport while scrolling DOWN   -> animates out (blur fade out).
 * - Leaving the viewport while scrolling UP     -> snaps to hidden instantly, no animation.
 *
 * Net effect: you only ever see the animation while scrolling down.
 * Scrolling up just reveals/hides things plainly, and resets state so that
 * the NEXT downward pass through the element animates again.
 */
export default function ScrollBlurFade({
    children,
    className = "",
    as: Tag = "div",
    delay = 0,
    distance = 18,
    blur = 10,
    duration = 650,
    outDuration,
    threshold = 0.15,
    rootMargin = "0px 0px -8% 0px",
    ...rest
}) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const hiddenState = {
            opacity: 0,
            translateY: distance,
            filter: `blur(${blur}px)`,
        };
        const visibleState = {
            opacity: 1,
            translateY: 0,
            filter: "blur(0px)",
        };

        anime.set(el, hiddenState);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    anime.remove(el);
                    const scrollingDown = getScrollDirection() === "down";

                    if (entry.isIntersecting) {
                        if (scrollingDown) {
                            anime({
                                targets: el,
                                ...visibleState,
                                translateY: [distance, 0],
                                filter: [`blur(${blur}px)`, "blur(0px)"],
                                duration,
                                delay,
                                easing: "easeOutCubic",
                            });
                        } else {
                            // Scrolling up into view: just show it, no animation.
                            anime.set(el, visibleState);
                        }
                    } else {
                        if (scrollingDown) {
                            anime({
                                targets: el,
                                opacity: 0,
                                translateY: distance * -0.4,
                                filter: `blur(${blur}px)`,
                                duration: outDuration ?? duration * 0.55,
                                easing: "easeInCubic",
                            });
                        } else {
                            // Scrolling up out of view: just hide it instantly, and
                            // reset to the pre-animation state so the next downward
                            // pass triggers a fresh blur fade-in.
                            anime.set(el, hiddenState);
                        }
                    }
                });
            },
            { threshold, rootMargin }
        );

        observer.observe(el);

        return () => {
            observer.disconnect();
            anime.remove(el);
        };
    }, [delay, distance, blur, duration, outDuration, threshold, rootMargin]);

    return (
        <Tag ref={ref} className={className} {...rest}>
            {children}
        </Tag>
    );
}