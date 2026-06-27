import { useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";

// Floating square rests UP and to the RIGHT of its grid slot (col=2, row=0)
const FLOAT_DX = 12;
const FLOAT_DY = -12;

export default function GridLogo({ SQ, GAP }) {
  const floatingRef = useRef(null);
  const gridRefs = useRef([]);
  const isHovered = useRef(false);
  const leaveTimer = useRef(null);

  useEffect(() => {
    if (floatingRef.current) {
      // Start at rest: offset up-right from its grid slot
      anime.set(floatingRef.current, {
        translateX: FLOAT_DX,
        translateY: FLOAT_DY,
      });
    }
  }, []);

  // [col, row] for each of the 8 static squares (grid indices 0,1,3,4,5,6,7,8)
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

  const handleEnter = () => {
    if (isHovered.current) return;
    isHovered.current = true;

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
        // Fill solid orange once it lands
        floatingRef.current.style.background = "#f97316";
        floatingRef.current.style.border = "none";

        const squares = gridRefs.current.filter(Boolean);

        // Collision: squares get pushed away from top-right impact point
        // Direction of push: bottom-left (negative X, positive Y)
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
            });
          },
        });

        // Floating piece: micro-bounce in the direction it came from (up-right), then settle
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
    isHovered.current = false;

    leaveTimer.current = setTimeout(() => {
      if (floatingRef.current) {
        floatingRef.current.style.background = "transparent";
        floatingRef.current.style.border = "2px solid #f97316";
      }

      // Slide back to rest position: up and to the right
      anime({
        targets: floatingRef.current,
        translateX: FLOAT_DX,
        translateY: FLOAT_DY,
        duration: 500,
        easing: "easeInOutSine",
      });
    }, 540);
  };

  const staticIndices = [0, 1, 3, 4, 5, 6, 7, 8];

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
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
}
