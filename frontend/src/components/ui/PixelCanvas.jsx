import { useEffect, useRef, useCallback, forwardRef } from "react";

function getAdaptivePixelSize(canvasWidth) {
  if (canvasWidth < 300) return 8;
  if (canvasWidth < 500) return 6;
  if (canvasWidth < 800) return 5;
  return 4;
}

const isMobile = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768);

const PixelCanvas = forwardRef(function PixelCanvas(
  { src, pixelSize, anchor = "bottom-right" },
  ref,
) {
  const canvasRef = useRef(null);
  const pixelsRef = useRef([]);
  const phaseRef = useRef("idle");
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const animRef = useRef(null);
  const visibleRef = useRef(true);
  const mobileRef = useRef(false);
  const retryRef = useRef(null);

  const handleMouseEnter = useCallback(() => {
    if (mobileRef.current) return;
    mouseRef.current.active = true;
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (mobileRef.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
    mouseRef.current.active = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (mobileRef.current) return;
    mouseRef.current.active = false;
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    mobileRef.current = isMobile();

    const ioObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    ioObserver.observe(canvas);

    const init = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        // Layout not ready yet (common on mobile first paint) — retry shortly.
        retryRef.current = setTimeout(init, 50);
        return;
      }

      const W = Math.round(rect.width);
      const H = Math.round(rect.height);
      canvas.width = W;
      canvas.height = H;

      const pSize = pixelSize || getAdaptivePixelSize(W);
      const img = new Image();
      img.src = src;

      img.onerror = () => {
        console.error("PixelCanvas: failed to load image", src);
      };

      img.onload = () => {
        const cols = Math.floor(W / pSize);
        const rows = Math.floor(H / pSize);

        const offscreen = document.createElement("canvas");
        offscreen.width = W;
        offscreen.height = H;
        const offCtx = offscreen.getContext("2d");

        const scale = Math.min(W / img.width, H / img.height);
        const sw = img.width * scale;
        const sh = img.height * scale;

        let drawX, drawY;
        if (anchor.includes("right")) drawX = W - sw;
        else if (anchor.includes("left")) drawX = 0;
        else drawX = (W - sw) / 2;

        if (anchor.includes("bottom")) drawY = H - sh;
        else if (anchor.includes("top")) drawY = 0;
        else drawY = (H - sh) / 2;

        offCtx.drawImage(img, drawX, drawY, sw, sh);

        let imageData;
        try {
          imageData = offCtx.getImageData(0, 0, W, H).data;
        } catch (err) {
          // Tainted canvas (CORS) — bail out gracefully.
          console.error("PixelCanvas: getImageData failed (CORS?)", err);
          return;
        }

        const pixels = [];

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const targetX = c * pSize;
            const targetY = r * pSize;
            const sx = Math.min(targetX + (pSize >> 1), W - 1);
            const sy = Math.min(targetY + (pSize >> 1), H - 1);
            const idx = (sy * W + sx) * 4;
            const red = imageData[idx];
            const green = imageData[idx + 1];
            const blue = imageData[idx + 2];
            const alpha = imageData[idx + 3];
            if (alpha < 30) continue;
            const brightness = red * 0.299 + green * 0.587 + blue * 0.114;
            if (brightness > 248 && alpha < 180) continue;

            const angle = Math.random() * Math.PI * 2;
            const dist = Math.max(W, H) * (0.8 + Math.random() * 0.6);

            pixels.push({
              targetX,
              targetY,
              currentX: W * 0.5 + Math.cos(angle) * dist,
              currentY: H * 0.5 + Math.sin(angle) * dist,
              r: red,
              g: green,
              b: blue,
              a: alpha,
              delay:
                Math.sqrt((targetX - W * 0.5) ** 2 + (targetY - H * 0.5) ** 2) /
                Math.max(W, H),
              vx: 0,
              vy: 0,
            });
          }
        }

        pixelsRef.current = pixels;
        phaseRef.current = "assembling";
        startAnimation(ctx, W, H, pSize);
      };
    };

    const startAnimation = (ctx, W, H, pSize) => {
      const startTime = performance.now();
      const ASSEMBLE_MS = 1400;

      const MOUSE_RADIUS = 110;
      const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS;
      const MOUSE_FORCE = 1.6;
      const VEL_THRESHOLD = 0.15;
      const SPRING = 0.08;
      const DAMPING = 0.88;

      const frameData = ctx.createImageData(W, H);
      const buf = frameData.data;
      const onMobile = mobileRef.current;

      const drawFrame = (now) => {
        const elapsed = now - startTime;
        const pixels = pixelsRef.current;
        const mouse = mouseRef.current;

        buf.fill(0);
        let anyMoving = false;

        for (let i = 0, len = pixels.length; i < len; i++) {
          const px = pixels[i];
          const phase = phaseRef.current;

          if (phase === "assembling") {
            const pxDelay = px.delay * 500;
            const progress = Math.max(
              0,
              Math.min(1, (elapsed - pxDelay) / ASSEMBLE_MS),
            );
            const ease = 1 - (1 - progress) ** 3;
            px.currentX += (px.targetX - px.currentX) * ease * 0.12;
            px.currentY += (px.targetY - px.currentY) * ease * 0.12;
            if (
              Math.abs(px.currentX - px.targetX) > 0.3 ||
              Math.abs(px.currentY - px.targetY) > 0.3
            ) {
              anyMoving = true;
            } else {
              px.currentX = px.targetX;
              px.currentY = px.targetY;
            }
          } else if (!onMobile) {
            if (mouse.active) {
              const dx = px.currentX - mouse.x;
              const dy = px.currentY - mouse.y;
              const distSq = dx * dx + dy * dy;
              if (distSq < MOUSE_RADIUS_SQ && distSq > 0) {
                const dist = Math.sqrt(distSq);
                const falloff = 1 - dist / MOUSE_RADIUS;
                const smooth = falloff * falloff;
                px.vx += (dx / dist) * MOUSE_FORCE * smooth;
                px.vy += (dy / dist) * MOUSE_FORCE * smooth;
              }
            }
            px.vx = (px.vx + (px.targetX - px.currentX) * SPRING) * DAMPING;
            px.vy = (px.vy + (px.targetY - px.currentY) * SPRING) * DAMPING;
            px.currentX += px.vx;
            px.currentY += px.vy;
            if (
              Math.abs(px.vx) > VEL_THRESHOLD ||
              Math.abs(px.vy) > VEL_THRESHOLD
            )
              anyMoving = true;
          }

          const bx = Math.round(px.currentX);
          const by = Math.round(px.currentY);
          if (bx + pSize <= 0 || bx >= W || by + pSize <= 0 || by >= H)
            continue;

          const r = px.r,
            g = px.g,
            b = px.b,
            a = px.a;
          for (let dy = 0; dy < pSize; dy++) {
            const py2 = by + dy;
            if (py2 < 0 || py2 >= H) continue;
            const rowOff = py2 * W;
            for (let dx = 0; dx < pSize; dx++) {
              const ppx = bx + dx;
              if (ppx < 0 || ppx >= W) continue;
              const idx = (rowOff + ppx) << 2;
              buf[idx] = r;
              buf[idx + 1] = g;
              buf[idx + 2] = b;
              buf[idx + 3] = a;
            }
          }
        }

        ctx.putImageData(frameData, 0, 0);
        return anyMoving;
      };

      const loop = (now) => {
        if (!visibleRef.current) {
          animRef.current = requestAnimationFrame(loop);
          return;
        }

        const anyMoving = drawFrame(now);

        if (phaseRef.current === "assembling" && !anyMoving) {
          phaseRef.current = "settled";
          return;
        }

        if (
          phaseRef.current === "settled" &&
          !anyMoving &&
          !mouseRef.current.active
        ) {
          return;
        }

        animRef.current = requestAnimationFrame(loop);
      };

      // Draw the very first frame synchronously so something appears immediately,
      // then continue the animation loop.
      drawFrame(startTime);
      animRef.current = requestAnimationFrame(loop);
    };

    init();

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(animRef.current);
      clearTimeout(retryRef.current);
      init();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animRef.current);
      clearTimeout(retryRef.current);
      ro.disconnect();
      ioObserver.disconnect();
    };
  }, [src, pixelSize, anchor]);

  return (
    <canvas
      ref={canvasRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        cursor: "default",
      }}
    />
  );
});

export default PixelCanvas;
