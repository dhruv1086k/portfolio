import { useEffect, useRef, useState } from "react";
import anime from "animejs/lib/anime.es.js";

const SQ = 20;
const GAP = 5;
const CELL = SQ + GAP;
const ORANGE = "#f97316";
const SQUARES = 9;
const MIN_DURATION = 2500; // ms — minimum loader display time

/**
 * GridLoader
 *
 * Props:
 *   isLoading  {boolean}  — pass false when your data/page is ready.
 *                           Loader waits for animation to finish (min 2.5s)
 *                           before calling onDone.
 *   onDone     {function} — called when loader finishes and is ready to hide.
 */
export default function GridLoader({ isLoading = true, onDone }) {
  const cellRefs = useRef([]);
  const startTime = useRef(Date.now());
  const loadDoneTime = useRef(null);
  const animationDone = useRef(false);
  const sequenceRunning = useRef(false);

  // Called when both: animation finished AND isLoading is false
  const tryComplete = () => {
    if (animationDone.current && loadDoneTime.current !== null) {
      onDone?.();
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

      // Shuffle indices for random drop order
      const indices = Array.from({ length: SQUARES }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }

      // How long has it been since mount?
      const elapsed = Date.now() - startTime.current;
      // How much total time should the sequence take?
      // At least MIN_DURATION from mount. If loading is already done and took
      // longer, use that. Either way give the drops the full remaining budget.
      const totalBudget = Math.max(MIN_DURATION, elapsed) - elapsed;
      // Reserve ~30% of budget for the last bounce + complete pulse
      const dropBudget = totalBudget * 0.7;
      // Spread 9 drops across the budget
      const DROP_INTERVAL = Math.max(80, dropBudget / SQUARES);

      const dropDuration = 300; // ms for single square fall+settle

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
                  {
                    rotate: -3,
                    duration: 100,
                  },
                  {
                    rotate: 1,
                    duration: 80,
                  },
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

          // Last square dropped — run complete pulse then signal done
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

    // Small initial delay so React has painted before we read startTime
    const init = setTimeout(runSequence, 50);
    return () => clearTimeout(init);
  }, []);

  const gridW = 3 * CELL - GAP;
  const gridH = 3 * CELL - GAP;

  return (
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
  );
}
