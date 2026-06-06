import { useEffect, useRef, useState } from "react";

function useResponsivePixelSize(breakpoints = { sm: 375, md: 768 }) {
  const [pixelSize, setPixelSize] = useState(6);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < breakpoints.sm) setPixelSize(4);
      else if (w < breakpoints.md) setPixelSize(5);
      else setPixelSize(6);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return pixelSize;
}

export default function PixelButton({
  href = "#",
  children = "View Work →",
  className = "",
  pixelSize: pixelSizeProp,
}) {
  const responsivePixelSize = useResponsivePixelSize();
  const pixelSize = pixelSizeProp ?? responsivePixelSize;

  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const hiddenRef = useRef(null);
  const pixelsRef = useRef([]);
  const animRef = useRef(null);
  const phaseRef = useRef("idle");

  const buildPixels = () => {
    const hidden = hiddenRef.current;
    const canvas = canvasRef.current;
    if (!hidden || !canvas) return;

    const W = hidden.offsetWidth;
    const H = hidden.offsetHeight;
    if (!W || !H) return;

    const PAD = 40;
    canvas.width = W + PAD * 2;
    canvas.height = H + PAD * 2;
    canvas.style.left = `-${PAD}px`;
    canvas.style.top = `-${PAD}px`;

    const pSize = pixelSize;
    const cols = Math.floor(W / pSize);
    const rows = Math.floor(H / pSize);
    const rad = 6;

    const insideRoundedRect = (bx, by) => {
      const cx = bx + pSize / 2;
      const cy = by + pSize / 2;
      const r = rad;
      if (cx < r && cy < r) return Math.hypot(cx - r, cy - r) <= r;
      if (cx > W - r && cy < r) return Math.hypot(cx - (W - r), cy - r) <= r;
      if (cx < r && cy > H - r) return Math.hypot(cx - r, cy - (H - r)) <= r;
      if (cx > W - r && cy > H - r)
        return Math.hypot(cx - (W - r), cy - (H - r)) <= r;
      return true;
    };

    const onBorder = (bx, by) => {
      const cx = bx + pSize / 2;
      const cy = by + pSize / 2;
      return cx < pSize || cx > W - pSize || cy < pSize || cy > H - pSize;
    };

    const px = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tx = col * pSize;
        const ty = row * pSize;
        if (!insideRoundedRect(tx, ty)) continue;

        const isBorder = onBorder(tx, ty);
        let r, g, b, a;

        if (isBorder) {
          const noise = Math.random() * 18 - 9;
          r = Math.max(0, 28 + noise);
          g = Math.max(0, 25 + noise);
          b = Math.max(0, 22 + noise);
          a = 230 + Math.random() * 25;
        } else {
          const noise = Math.random() * 14 - 7;
          r = Math.max(0, 30 + noise);
          g = Math.max(0, 28 + noise);
          b = Math.max(0, 24 + noise);
          a = 210 + Math.random() * 30;
        }

        px.push({
          tx: tx + PAD,
          ty: ty + PAD,
          cx: tx + PAD,
          cy: ty + PAD,
          r,
          g,
          b,
          a,
          vx: 0,
          vy: 0,
          ox: 0,
          oy: 0,
          isBorder,
          isAnchor: false,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    const interior = px.filter((p) => !p.isBorder);
    const anchorCount = Math.floor(interior.length * 0.35);
    for (let i = 0; i < anchorCount; i++) {
      interior[Math.floor(Math.random() * interior.length)].isAnchor = true;
    }

    pixelsRef.current = px;
    phaseRef.current = "idle";
    drawFrame(0);
  };

  const drawFrame = (t = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const pSize = pixelSize;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const px of pixelsRef.current) {
      const shimmer =
        phaseRef.current === "scatter"
          ? Math.sin(t * 0.002 + px.phase) * 0.1
          : 0;
      const alpha = Math.min(1, px.a / 255 + shimmer);
      ctx.fillStyle = `rgba(${Math.round(px.r)},${Math.round(px.g)},${Math.round(px.b)},${alpha.toFixed(2)})`;
      ctx.fillRect(Math.round(px.cx), Math.round(px.cy), pSize, pSize);
    }
  };

  const startLoop = () => {
    if (animRef.current) return;
    const SPRING = 0.11;
    const DAMPING = 0.78;
    const THRESH = 0.06;

    const loop = (t) => {
      const phase = phaseRef.current;
      const pixels = pixelsRef.current;

      if (phase === "scatter") {
        for (const px of pixels) {
          const tx = px.tx + px.ox;
          const ty = px.ty + px.oy;
          px.vx = (px.vx + (tx - px.cx) * SPRING) * DAMPING;
          px.vy = (px.vy + (ty - px.cy) * SPRING) * DAMPING;
          px.cx += px.vx;
          px.cy += px.vy;
        }
        drawFrame(t);
        animRef.current = requestAnimationFrame(loop);
      } else if (phase === "return") {
        let settled = true;
        for (const px of pixels) {
          px.vx = (px.vx + (px.tx - px.cx) * SPRING) * DAMPING;
          px.vy = (px.vy + (px.ty - px.cy) * SPRING) * DAMPING;
          px.cx += px.vx;
          px.cy += px.vy;
          if (Math.abs(px.vx) > THRESH || Math.abs(px.vy) > THRESH)
            settled = false;
        }
        drawFrame(t);
        if (settled) {
          for (const px of pixels) {
            px.cx = px.tx;
            px.cy = px.ty;
          }
          phaseRef.current = "idle";
          drawFrame(t);
          animRef.current = null;
          return;
        }
        animRef.current = requestAnimationFrame(loop);
      } else {
        animRef.current = null;
      }
    };
    animRef.current = requestAnimationFrame(loop);
  };

  const onMouseEnter = () => {
    for (const px of pixelsRef.current) {
      if (px.isAnchor) {
        const angle = Math.random() * Math.PI * 2;
        px.ox = Math.cos(angle) * (1 + Math.random() * 2);
        px.oy = Math.sin(angle) * (1 + Math.random() * 2);
      } else if (px.isBorder) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 10 + Math.random() * 18;
        px.ox = Math.cos(angle) * dist;
        px.oy = Math.sin(angle) * dist;
      } else {
        const angle = Math.random() * Math.PI * 2;
        const dist = 4 + Math.random() * 10;
        px.ox = Math.cos(angle) * dist;
        px.oy = Math.sin(angle) * dist;
      }
    }
    phaseRef.current = "scatter";
    startLoop();
  };

  const onMouseLeave = () => {
    phaseRef.current = "return";
    if (!animRef.current) startLoop();
  };

  // Touch support for mobile
  const onTouchStart = () => onMouseEnter();
  const onTouchEnd = () => onMouseLeave();

  useEffect(() => {
    const t = setTimeout(buildPixels, 80);
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
      buildPixels();
    });
    if (hiddenRef.current) ro.observe(hiddenRef.current);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, [children, pixelSize]);

  // Shared fluid typography styles — must be identical between hidden sizer and visible label
  const textStyle = {
    fontSize: "clamp(11px, 2.5vw, 13px)",
    fontWeight: 600,
    letterSpacing: "clamp(0.8px, 0.2vw, 1.5px)",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  };

  // Fluid padding
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
        // Ensure the anchor doesn't stretch wider than its container
        boxSizing: "border-box",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClick={(e) => {
        if (href.startsWith("#")) {
          e.preventDefault();
          document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
        }
      }}
    >
      {/* Invisible span — drives layout size; must match visible text metrics exactly */}
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

      {/* Pixel canvas — the button background */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          pointerEvents: "none",
          zIndex: 0,
          imageRendering: "pixelated",
        }}
      />

      {/* Visible label — crisp on top */}
      <span
        className={className}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#f0ece4",
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
