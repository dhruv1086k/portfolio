import { useEffect, useRef, useCallback } from "react";

function getAdaptivePixelSize(canvasWidth) {
  if (canvasWidth < 300) return 8;
  if (canvasWidth < 500) return 6;
  if (canvasWidth < 800) return 4;
  return 3;
}

export default function PixelCanvas({ src, pixelSize }) {
  const canvasRef = useRef(null);
  const pixelsRef = useRef([]);
  const phaseRef = useRef("idle");
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const animRef = useRef(null);
  const visibleRef = useRef(true);
  const cacheValidRef = useRef(false);

  const handleMouseMove = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
    mouseRef.current.active = true;
    cacheValidRef.current = false;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.active = false;
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;
  }, []);

  // Touch support
  const handleTouchMove = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const touch = e.touches[0];
    mouseRef.current.x = touch.clientX - rect.left;
    mouseRef.current.y = touch.clientY - rect.top;
    mouseRef.current.active = true;
    cacheValidRef.current = false;
  }, []);

  const handleTouchEnd = useCallback(() => {
    mouseRef.current.active = false;
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    const ioObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) cacheValidRef.current = false;
      },
      { threshold: 0.05 }
    );
    ioObserver.observe(canvas);

    const init = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const W = Math.round(rect.width);
      const H = Math.round(rect.height);
      canvas.width = W;
      canvas.height = H;

      const pSize = pixelSize || getAdaptivePixelSize(W);

      const img = new Image();
      img.src = src;

      img.onload = () => {
        const cols = Math.floor(W / pSize);
        const rows = Math.floor(H / pSize);

        const offscreen = document.createElement("canvas");
        offscreen.width = W;
        offscreen.height = H;
        const offCtx = offscreen.getContext("2d");

        const scale = Math.max(W / img.width, H / img.height);
        const sw = img.width * scale;
        const sh = img.height * scale;
        offCtx.drawImage(img, W - sw, H - sh, sw, sh);

        const imageData = offCtx.getImageData(0, 0, W, H).data;
        const pixels = [];

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const targetX = c * pSize;
            const targetY = r * pSize;

            const sx = Math.min(targetX + (pSize >> 1), W - 1);
            const sy = Math.min(targetY + (pSize >> 1), H - 1);
            const i = (sy * W + sx) * 4;

            const red = imageData[i];
            const green = imageData[i + 1];
            const blue = imageData[i + 2];
            const alpha = imageData[i + 3];

            if (alpha < 30) continue;
            const brightness = red * 0.299 + green * 0.587 + blue * 0.114;
            if (brightness > 248 && alpha < 180) continue;

            // Explode from random positions across the canvas (not a circle)
            const startX = Math.random() * W * 2 - W * 0.5;
            const startY = Math.random() * H * 2 - H * 0.5;

            // Give each pixel a random initial velocity — the "explosion"
            const speed = 4 + Math.random() * 14;
            const angle = Math.random() * Math.PI * 2;

            pixels.push({
              targetX,
              targetY,
              currentX: startX,
              currentY: startY,
              r: red,
              g: green,
              b: blue,
              a: alpha,
              // Stagger by distance from center, not radially
              delay: Math.random() * 0.6,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              // Individual drag per pixel for organic variation
              drag: 0.92 + Math.random() * 0.05,
              noiseOffset: Math.random() * Math.PI * 2,
              assembled: false,
            });
          }
        }

        pixelsRef.current = pixels;
        phaseRef.current = "assembling";
        cacheValidRef.current = false;

        startAnimation(ctx, W, H, pSize);
      };
    };

    const startAnimation = (ctx, W, H, pSize) => {
      const startTime = performance.now();

      // Assembly physics — same as before
      const SPRING = 0.055;
      const DAMPING = 0.91;
      const SETTLE_DAMPING = 0.84;
      const VEL_THRESHOLD = 0.12;

      // ParticleSlider-style hover: pure inverse-square repulsion, 0.89 velocity damping
      // MOUSE_FORCE scales with canvas area so it feels consistent at any size
      const MOUSE_FORCE = (W * H) * 0.012;
      const PS_DAMPING = 0.89; // matches ParticleSlider exactly

      const frameData = ctx.createImageData(W, H);
      const buf = frameData.data;

      const loop = (now) => {
        animRef.current = requestAnimationFrame(loop);

        if (!visibleRef.current) return;
        if (
          phaseRef.current === "settled" &&
          !mouseRef.current.active &&
          cacheValidRef.current
        ) return;

        const elapsed = now - startTime;
        const pixels = pixelsRef.current;
        const mouse = mouseRef.current;

        buf.fill(0);

        let anyMoving = false;

        for (let i = 0, len = pixels.length; i < len; i++) {
          const px = pixels[i];

          if (phaseRef.current === "assembling") {
            // Only start pulling after individual delay
            if (elapsed > px.delay * 1000) {
              const close =
                Math.abs(px.currentX - px.targetX) < W * 0.12 &&
                Math.abs(px.currentY - px.targetY) < H * 0.12;

              const damp = close ? SETTLE_DAMPING : DAMPING;
              px.vx = (px.vx + (px.targetX - px.currentX) * SPRING) * damp;
              px.vy = (px.vy + (px.targetY - px.currentY) * SPRING) * damp;
            }
            px.currentX += px.vx;
            px.currentY += px.vy;

            const settling =
              Math.abs(px.currentX - px.targetX) < 0.5 &&
              Math.abs(px.currentY - px.targetY) < 0.5 &&
              Math.abs(px.vx) < VEL_THRESHOLD &&
              Math.abs(px.vy) < VEL_THRESHOLD;

            if (!settling) anyMoving = true;
            else {
              px.currentX = px.targetX;
              px.currentY = px.targetY;
              px.vx = 0;
              px.vy = 0;
              px.assembled = true;
            }
          } else {
            // --- ParticleSlider hover physics ---
            // Gravity pull toward home (equivalent to psParticle.move's g * cos/sin)
            const gx = px.targetX - px.currentX;
            const gy = px.targetY - px.currentY;
            const dist = Math.sqrt(gx * gx + gy * gy);
            const g = dist * 0.005; // matches ParticleSlider's 0.005 coefficient

            px.vx += g * (gx / (dist || 1));
            px.vy += g * (gy / (dist || 1));

            // Mouse repulsion: identical formula to ParticleSlider
            // h = min(mouseForce / (dx² + dy²), mouseForce)
            if (mouse.active) {
              const dx = px.currentX - mouse.x;
              const dy = px.currentY - mouse.y;
              const distSq = dx * dx + dy * dy;

              if (distSq > 0) {
                const h = Math.min(MOUSE_FORCE / distSq, MOUSE_FORCE);
                const angle = Math.atan2(dy, dx);
                px.vx += h * Math.cos(angle);
                px.vy += h * Math.sin(angle);
              }
            }

            // 0.89 damping — straight from ParticleSlider
            px.vx *= PS_DAMPING;
            px.vy *= PS_DAMPING;

            px.currentX += px.vx;
            px.currentY += px.vy;

            if (
              Math.abs(px.vx) > VEL_THRESHOLD ||
              Math.abs(px.vy) > VEL_THRESHOLD
            ) anyMoving = true;
          }

          const bx = Math.round(px.currentX);
          const by = Math.round(px.currentY);

          if (bx + pSize <= 0 || bx >= W || by + pSize <= 0 || by >= H) continue;

          const r = px.r, g = px.g, b = px.b, a = px.a;

          for (let dy = 0; dy < pSize; dy++) {
            const py = by + dy;
            if (py < 0 || py >= H) continue;
            const rowOff = py * W;
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

        if (phaseRef.current === "assembling" && !anyMoving) {
          phaseRef.current = "settled";
        }

        if (phaseRef.current === "settled" && !anyMoving && !mouse.active) {
          cacheValidRef.current = true;
        }
      };

      animRef.current = requestAnimationFrame(loop);
    };

    init();

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(animRef.current);
      cacheValidRef.current = false;
      init();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      ioObserver.disconnect();
    };
  }, [src, pixelSize]);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}