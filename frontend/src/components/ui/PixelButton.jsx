import { useEffect, useRef, useState, useCallback } from "react";

// ─── constants ────────────────────────────────────────────────────────────────
const CELL_COLOR = "#FF6A00";
const GAP = 2; // px gap between cells
const CELL_RADIUS = 2; // border-radius per cell
const GRID_ROWS = 3; // always 3 rows tall
// Cols are derived dynamically: one col per ~TARGET_CELL_PX of button width
const TARGET_CELL_PX = 12;

// ─── helpers ──────────────────────────────────────────────────────────────────
const hexToRgb = (hex) => {
  const c = hex.replace("#", "");
  return {
    r: parseInt(c.slice(0, 2), 16),
    g: parseInt(c.slice(2, 4), 16),
    b: parseInt(c.slice(4, 6), 16),
  };
};

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ─── component ────────────────────────────────────────────────────────────────
export default function PixelButton({
  href = "#",
  children = "View Work →",
  className = "",
  textColor = "#FFFFFF",
  hoverTextColor = "#000000",
}) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const hiddenRef = useRef(null);
  const hoverRef = useRef(false);
  const rafRef = useRef(null);
  const progressRef = useRef(0); // 0 = resting color, 1 = hover color

  const [displayColor, setDisplayColor] = useState(textColor);

  const fromRgb = hexToRgb(textColor);
  const toRgb = hexToRgb(hoverTextColor);

  const lerpColor = (t) => {
    const r = Math.round(fromRgb.r + (toRgb.r - fromRgb.r) * t);
    const g = Math.round(fromRgb.g + (toRgb.g - fromRgb.g) * t);
    const b = Math.round(fromRgb.b + (toRgb.b - fromRgb.b) * t);
    return `rgb(${r},${g},${b})`;
  };

  // Smooth rAF-driven color transition (no CSS transition, no anime.js needed)
  const animateColor = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const target = hoverRef.current ? 1 : 0;
    const EASE = 0.18; // 0–1; higher = faster

    const tick = () => {
      const diff = target - progressRef.current;
      if (Math.abs(diff) < 0.004) {
        progressRef.current = target;
        setDisplayColor(lerpColor(target));
        return;
      }
      progressRef.current += diff * EASE;
      setDisplayColor(lerpColor(progressRef.current));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // ── draw grid ──────────────────────────────────────────────────────────────
  const drawGrid = useCallback(() => {
    const hidden = hiddenRef.current;
    const canvas = canvasRef.current;
    if (!hidden || !canvas) return;

    const W = hidden.offsetWidth;
    const H = hidden.offsetHeight;
    if (!W || !H) return;

    // Dynamic column count based on button width
    const cols = Math.max(3, Math.round(W / (TARGET_CELL_PX + GAP)));

    canvas.width = W;
    canvas.height = H;

    const cw = (W - GAP * (cols - 1)) / cols;
    const ch = (H - GAP * (GRID_ROWS - 1)) / GRID_ROWS;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, W, H);

    const { r, g, b } = hexToRgb(CELL_COLOR);

    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < cols; col++) {
        // Top-right cell is always empty
        if (row === 0 && col === cols - 1) continue;

        const x = col * (cw + GAP);
        const y = row * (ch + GAP);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        roundRect(
          ctx,
          Math.round(x),
          Math.round(y),
          Math.round(cw),
          Math.round(ch),
          CELL_RADIUS,
        );
        ctx.fill();
      }
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(drawGrid, 80);
    const ro = new ResizeObserver(drawGrid);
    if (hiddenRef.current) ro.observe(hiddenRef.current);
    return () => {
      clearTimeout(t);
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [children, drawGrid]);

  const handleEnter = () => {
    hoverRef.current = true;
    animateColor();
  };
  const handleLeave = () => {
    hoverRef.current = false;
    animateColor();
  };

  const textStyle = {
    fontSize: "clamp(11px, 2.5vw, 13px)",
    fontWeight: 600,
    letterSpacing: "clamp(0.8px, 0.2vw, 1.5px)",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  };

  const paddingStyle = {
    padding: "clamp(10px, 2.5vw, 14px) clamp(18px, 5vw, 30px)",
  };

  return (
    <a
      href={href}
      ref={wrapperRef}
      style={{
        position: "relative",
        display: "inline-block",
        textDecoration: "none",
        maxWidth: "100%",
        boxSizing: "border-box",
        borderRadius: `${CELL_RADIUS + GAP}px`,
        overflow: "hidden",
        cursor: "pointer",
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onTouchStart={handleEnter}
      onTouchEnd={handleLeave}
      onClick={(e) => {
        if (href.startsWith("#")) {
          e.preventDefault();
          document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
        }
      }}
    >
      {/* Invisible span — drives layout + canvas dimensions */}
      <span
        ref={hiddenRef}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          ...paddingStyle,
          ...textStyle,
          visibility: "hidden",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {children}
      </span>

      {/* Orange grid canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 0,
          imageRendering: "pixelated",
        }}
      />

      {/* Foreground label — color smoothly interpolated via rAF */}
      <span
        className={className}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: displayColor,
          ...textStyle,
          zIndex: 1,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {children}
      </span>
    </a>
  );
}
