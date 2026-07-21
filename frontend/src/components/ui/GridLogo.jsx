import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import anime from "animejs/lib/anime.es.js";

// Floating square rests UP and to the RIGHT of its grid slot (col=2, row=0)
const FLOAT_DX = 12;
const FLOAT_DY = -12;

// How long the logo stays "settled" after a tap before auto-resetting (mobile/touch flow)
const AUTO_RESET_DELAY = 1500;

const GridLogo = forwardRef(function GridLogo({ SQ, GAP }, ref) {
  const floatingRef = useRef(null);
  const gridRefs = useRef([]);
  const animState = useRef("idle"); // "idle" | "entering" | "settled"
  const pendingCallbacks = useRef([]);
  const leaveTimer = useRef(null);
  const clickResetTimer = useRef(null);
  const isHovering = useRef(false);
  const supportsHover = useRef(true); // assume desktop-like until we check

  useEffect(() => {
    if (floatingRef.current) {
      anime.set(floatingRef.current, {
        translateX: FLOAT_DX,
        translateY: FLOAT_DY,
      });
    }

    // Devices that can't truly hover (most touch devices) are the only ones
    // that should rely on tap-to-play + auto-reset. On real hover-capable
    // devices, mouseenter/mouseleave already handle everything correctly.
    if (typeof window !== "undefined" && window.matchMedia) {
      supportsHover.current = window.matchMedia("(hover: hover)").matches;
    }

    // Clean up any pending timers on unmount
    return () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
      if (clickResetTimer.current) clearTimeout(clickResetTimer.current);
    };
  }, []);

  const positions = [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [0, 2],
    [1, 2],
    [2, 2],
  ];

  // onSettled fires once the ENTIRE animation (fly-in + collision + spring settle) is done.
  // Safe to call this multiple times in quick succession (e.g. ghost mouseenter + click on mobile) —
  // it will never skip the animation, it just queues callbacks until the real settle happens.
  const handleEnter = (onSettled) => {
    if (animState.current === "settled") {
      // Already sitting in place from a previous play — fine to resolve instantly.
      onSettled?.();
      return;
    }

    if (animState.current === "entering") {
      // Animation already running (e.g. started by a mobile ghost mouseenter) —
      // don't skip it, just wait for it to actually finish.
      if (onSettled) pendingCallbacks.current.push(onSettled);
      return;
    }

    animState.current = "entering";
    if (onSettled) pendingCallbacks.current.push(onSettled);

    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }

    // Fly FROM top-right INTO slot → translateX 0, translateY 0
    anime({
      targets: floatingRef.current,
      translateX: 0,
      translateY: 0,
      duration: 200,
      easing: "easeInQuart",
      complete: () => {
        floatingRef.current.style.background = "#f97316";
        floatingRef.current.style.border = "none";

        const squares = gridRefs.current.filter(Boolean);

        anime({
          targets: squares,
          translateX: (_, i) => {
            const [col, row] = positions[i];
            const dist = Math.sqrt((2 - col) ** 2 + (0 - row) ** 2);
            return -(10 / (dist + 0.6));
          },
          translateY: (_, i) => {
            const [col, row] = positions[i];
            const dist = Math.sqrt((2 - col) ** 2 + (0 - row) ** 2);
            return 10 / (dist + 0.6);
          },
          duration: 130,
          easing: "easeOutQuart",
          complete: () => {
            anime({
              targets: squares,
              translateX: 0,
              translateY: 0,
              duration: 700,
              easing: "spring(1, 80, 10, 5)",
              complete: () => {
                animState.current = "settled";
                const cbs = pendingCallbacks.current;
                pendingCallbacks.current = [];
                cbs.forEach((cb) => cb?.());
              },
            });
          },
        });

        anime({
          targets: floatingRef.current,
          keyframes: [
            {
              translateX: 2,
              translateY: -2,
              duration: 60,
              easing: "easeOutQuart",
            },
            {
              translateX: 0,
              translateY: 0,
              duration: 600,
              easing: "spring(1, 80, 10, 5)",
            },
          ],
        });
      },
    });
  };

  const handleLeave = () => {
    animState.current = "idle";

    // Cancel any pending auto-reset from a click, since we're resetting now anyway
    if (clickResetTimer.current) {
      clearTimeout(clickResetTimer.current);
      clickResetTimer.current = null;
    }

    leaveTimer.current = setTimeout(() => {
      if (floatingRef.current) {
        floatingRef.current.style.background = "transparent";
        floatingRef.current.style.border = "2px solid #f97316";
      }

      anime({
        targets: floatingRef.current,
        translateX: FLOAT_DX,
        translateY: FLOAT_DY,
        duration: 500,
        easing: "easeInOutSine",
      });
    }, 540);
  };

  // Tap/click entry point — mainly for touch devices where hover doesn't apply.
  // Plays the animation, then auto-resets AUTO_RESET_DELAY ms after it actually settles,
  // regardless of whether the user taps elsewhere on the page.
  //
  // On real hover-capable devices we skip the auto-reset scheduling entirely —
  // mouseenter/mouseleave already own the lifecycle there, and letting a click
  // schedule a reset too can force-reset the logo out from under an active hover.
  const handleClick = () => {
    if (supportsHover.current) return;

    if (clickResetTimer.current) {
      clearTimeout(clickResetTimer.current);
      clickResetTimer.current = null;
    }

    handleEnter(() => {
      clickResetTimer.current = setTimeout(() => {
        // Extra safety: never yank the animation back while the pointer is
        // still genuinely hovering (e.g. hybrid touch+mouse devices).
        // mouseleave will trigger the real reset whenever the pointer leaves.
        if (isHovering.current) return;
        handleLeave();
        clickResetTimer.current = null;
      }, AUTO_RESET_DELAY);
    });
  };

  useImperativeHandle(ref, () => ({
    play: (onSettled) => handleEnter(onSettled),
    reset: () => handleLeave(),
  }));

  const staticIndices = [0, 1, 3, 4, 5, 6, 7, 8];

  return (
    <div
      onMouseEnter={() => {
        isHovering.current = true;
        handleEnter();
      }}
      onMouseLeave={() => {
        isHovering.current = false;
        handleLeave();
      }}
      onClick={handleClick}
      style={{
        paddingTop: Math.abs(FLOAT_DY) + 4,
        paddingRight: FLOAT_DX + 4,
        display: "inline-block",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(3, ${SQ}px)`,
          gridTemplateRows: `repeat(3, ${SQ}px)`,
          gap: GAP,
        }}
      >
        {Array.from({ length: 9 }, (_, idx) => {
          const isFloating = idx === 2;
          const staticOrder = staticIndices.indexOf(idx);

          if (isFloating) {
            return (
              <div
                key={idx}
                ref={floatingRef}
                style={{
                  width: SQ,
                  height: SQ,
                  borderRadius: 2,
                  border: "2px solid #f97316",
                  background: "transparent",
                  boxSizing: "border-box",
                  willChange: "transform",
                }}
              />
            );
          }

          return (
            <div
              key={idx}
              ref={(el) => (gridRefs.current[staticOrder] = el)}
              style={{
                width: SQ,
                height: SQ,
                borderRadius: 2,
                background: "#f97316",
                willChange: "transform",
              }}
            />
          );
        })}
      </div>
    </div>
  );
});

export default GridLogo;