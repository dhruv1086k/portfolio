import { useEffect, useRef, useState } from "react";
import anime from "animejs/lib/anime.es.js";

const SQ = 20;
const GAP = 5;
const CELL = SQ + GAP;
const ORANGE = "#f97316";
const SQUARES = 9;
const MIN_DURATION = 2500;

export default function GridLoader({ isLoading = true, onDone }) {
  const cellRefs = useRef([]);
  const startTime = useRef(Date.now());
  const loadDoneTime = useRef(null);
  const animationDone = useRef(false);
  const sequenceRunning = useRef(false);
  const [exiting, setExiting] = useState(false);

  const tryComplete = () => {
    if (animationDone.current && loadDoneTime.current !== null) {
      setExiting(true);
      // Wait for the CSS transition to finish before calling onDone
      setTimeout(() => {
        onDone?.();
      }, 600); // matches transition duration below
    }
  };

  useEffect(() => {
    if (!isLoading) {
      loadDoneTime.current = Date.now();
      tryComplete();
    }
  }, [isLoading]);

  useEffect(() => {
    const els = cellRefs.current.filter(Boolean);

    const reset = () => {
      els.forEach((el) => {
        anime.set(el, {
          background: "transparent",
          border: `2px solid rgba(249,115,22,0.2)`,
          translateY: 0,
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
        });
      });
    };

    const runSequence = () => {
      if (sequenceRunning.current) return;
      sequenceRunning.current = true;

      reset();

      const indices = Array.from({ length: SQUARES }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }

      const elapsed = Date.now() - startTime.current;
      const totalBudget = Math.max(MIN_DURATION, elapsed) - elapsed;
      const dropBudget = totalBudget * 0.7;
      const DROP_INTERVAL = Math.max(80, dropBudget / SQUARES);
      const dropDuration = 300;

      indices.forEach((idx, order) => {
        const el = els[idx];
        const row = Math.floor(idx / 3);
        const dropFrom = -(row * CELL + SQ + 50);

        const t = setTimeout(() => {
          anime.set(el, {
            translateY: dropFrom,
            scaleX: 1,
            scaleY: 1,
            background: ORANGE,
            border: "none",
            opacity: 0,
          });

          anime({
            targets: el,
            opacity: 1,
            duration: 40,
            easing: "linear",
            complete: () => {
              anime({
                targets: el,
                keyframes: [
                  {
                    translateY: 0,
                    rotate: -8,
                    scaleY: 0.82,
                    scaleX: 1.18,
                    duration: 90,
                    easing: "easeOutQuad",
                  },
                  {
                    rotate: 6,
                    translateY: -2,
                    scaleY: 1.05,
                    scaleX: 0.96,
                    duration: 120,
                    easing: "easeOutQuad",
                  },
                  { rotate: -3, duration: 100 },
                  { rotate: 1, duration: 80 },
                  {
                    rotate: 0,
                    scaleX: 1,
                    scaleY: 1,
                    translateY: 0,
                    duration: 220,
                    easing: "easeOutElastic(1,.6)",
                  },
                ],
              });
            },
          });

          if (order === SQUARES - 1) {
            const settleDuration = dropDuration + 75 + 130 + 90 + 220 + 100;
            setTimeout(() => {
              anime({
                targets: els,
                scale: [1, 1.12, 1],
                duration: 420,
                easing: "easeInOutQuart",
                delay: anime.stagger(35, { from: "center", grid: [3, 3] }),
                complete: () => {
                  sequenceRunning.current = false;
                  animationDone.current = true;
                  tryComplete();
                },
              });
            }, settleDuration);
          }
        }, order * DROP_INTERVAL);
      });
    };

    const init = setTimeout(runSequence, 50);
    return () => clearTimeout(init);
  }, []);

  const gridW = 3 * CELL - GAP;
  const gridH = 3 * CELL - GAP;

  return (
    <div
      style={{
        transition: exiting
          ? "opacity 0.6s ease, filter 0.6s ease, transform 0.6s ease"
          : "none",
        opacity: exiting ? 0 : 1,
        filter: exiting ? "blur(12px)" : "blur(0px)",
        transform: exiting ? "scale(1.15)" : "scale(1)",
        willChange: "opacity, filter, transform",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(3, ${SQ}px)`,
          gridTemplateRows: `repeat(3, ${SQ}px)`,
          gap: GAP,
          width: gridW,
          height: gridH,
          overflow: "visible",
        }}
      >
        {Array.from({ length: SQUARES }, (_, idx) => (
          <div
            key={idx}
            ref={(el) => (cellRefs.current[idx] = el)}
            style={{
              width: SQ,
              height: SQ,
              borderRadius: 4,
              border: "2px solid rgba(249,115,22,0.2)",
              background: "transparent",
              boxSizing: "border-box",
              willChange: "transform, background",
              transformOrigin: "50% 120%",
            }}
          />
        ))}
      </div>
    </div>
  );
}
