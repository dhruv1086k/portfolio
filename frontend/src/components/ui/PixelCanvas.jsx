import { useEffect, useRef, useCallback } from 'react';

/* ─────────────────────────────────────────────────────────────────────────
   PixelCanvas — Performance-Optimized

   Optimizations applied:
   1. Adaptive pixel size   — fewer particles on smaller/weaker devices
   2. ImageData rendering   — 1 putImageData call vs thousands of fillRect
   3. Settled-state caching — zero work per frame when nothing moves
   4. IntersectionObserver  — pauses entirely when scrolled off-screen
   5. Squared-distance test — avoids costly sqrt for out-of-range particles
   6. Raw RGBA storage      — no CSS color string parsing during render
   ───────────────────────────────────────────────────────────────────────── */

/* ─── Adaptive pixel size based on canvas width (proxy for device power) ── */
function getAdaptivePixelSize(canvasWidth) {
  if (canvasWidth < 300) return 8;   // tiny mobile  → ~1.5K particles
  if (canvasWidth < 500) return 6;   // small mobile → ~5K particles
  if (canvasWidth < 800) return 4;   // tablet       → ~12K particles
  return 3;                           // desktop      → ~30K particles
}

export default function PixelCanvas({ src, pixelSize }) {
  const canvasRef       = useRef(null);
  const pixelsRef       = useRef([]);
  const phaseRef        = useRef('idle');     // 'assembling' | 'settled'
  const mouseRef        = useRef({ x: -9999, y: -9999, active: false });
  const animRef         = useRef(null);
  const visibleRef      = useRef(true);       // IntersectionObserver flag
  const cacheValidRef   = useRef(false);      // is the on-canvas frame reusable?

  /* ── Mouse handlers ───────────────────────────────────────────────────── */
  const handleMouseMove = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current.x      = e.clientX - rect.left;
    mouseRef.current.y      = e.clientY - rect.top;
    mouseRef.current.active = true;
    cacheValidRef.current   = false;           // force re-render
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.active = false;
    mouseRef.current.x      = -9999;
    mouseRef.current.y      = -9999;
  }, []);

  /* ── Main setup + animation loop ──────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    /* IntersectionObserver — stop all work when hero is off-screen */
    const ioObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        // Invalidate cache when coming back into view
        if (entry.isIntersecting) cacheValidRef.current = false;
      },
      { threshold: 0.05 },
    );
    ioObserver.observe(canvas);

    const init = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const W = Math.round(rect.width);
      const H = Math.round(rect.height);
      canvas.width  = W;
      canvas.height = H;

      /* Decide pixel size: explicit prop, or adaptive */
      const pSize = pixelSize || getAdaptivePixelSize(W);

      const img = new Image();
      img.src   = src;

      img.onload = () => {
        const cols = Math.floor(W / pSize);
        const rows = Math.floor(H / pSize);

        /* Draw image to offscreen canvas for color sampling */
        const offscreen    = document.createElement('canvas');
        offscreen.width    = W;
        offscreen.height   = H;
        const offCtx       = offscreen.getContext('2d');

        /* Scale to cover, anchored bottom-right */
        const scale = Math.max(W / img.width, H / img.height);
        const sw    = img.width  * scale;
        const sh    = img.height * scale;
        offCtx.drawImage(img, W - sw, H - sh, sw, sh);

        const imageData = offCtx.getImageData(0, 0, W, H).data;
        const pixels    = [];

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const targetX = c * pSize;
            const targetY = r * pSize;

            /* Sample center of pixel block */
            const sx = Math.min(targetX + (pSize >> 1), W - 1);
            const sy = Math.min(targetY + (pSize >> 1), H - 1);
            const i  = (sy * W + sx) * 4;

            const red   = imageData[i];
            const green = imageData[i + 1];
            const blue  = imageData[i + 2];
            const alpha = imageData[i + 3];

            /* Skip transparent / near-background pixels */
            if (alpha < 30) continue;
            const brightness = red * 0.299 + green * 0.587 + blue * 0.114;
            if (brightness > 248 && alpha < 180) continue;

            /* Scatter start position: random far from canvas */
            const angle = Math.random() * Math.PI * 2;
            const dist  = Math.max(W, H) * (0.8 + Math.random() * 0.6);

            pixels.push({
              targetX,
              targetY,
              currentX: W * 0.5 + Math.cos(angle) * dist,
              currentY: H * 0.5 + Math.sin(angle) * dist,
              /* Raw RGBA (avoid string parsing during render loop) */
              r: red,
              g: green,
              b: blue,
              a: alpha,
              delay: Math.sqrt(
                (targetX - W * 0.5) ** 2 + (targetY - H * 0.5) ** 2,
              ) / Math.max(W, H),
              vx: 0,
              vy: 0,
            });
          }
        }

        pixelsRef.current     = pixels;
        phaseRef.current      = 'assembling';
        cacheValidRef.current = false;

        startAnimation(ctx, W, H, pSize);
      };
    };

    /* ── Animation loop ─────────────────────────────────────────────────── */
    const startAnimation = (ctx, W, H, pSize) => {
      const startTime        = performance.now();
      const ASSEMBLE_MS      = 1800;
      const MOUSE_RADIUS     = 80;
      const MOUSE_RADIUS_SQ  = MOUSE_RADIUS * MOUSE_RADIUS; // avoid sqrt
      const MOUSE_FORCE      = 12;
      const VEL_THRESHOLD    = 0.15;
      const SPRING           = 0.08;
      const DAMPING          = 0.88;

      /* Pre-allocate a single ImageData — reused every frame */
      const frameData = ctx.createImageData(W, H);
      const buf       = frameData.data;

      const loop = (now) => {
        animRef.current = requestAnimationFrame(loop);

        /* ── Skip entirely when off-screen ── */
        if (!visibleRef.current) return;

        /* ── Skip when settled and cache is valid (nothing moved) ── */
        if (phaseRef.current === 'settled' &&
            !mouseRef.current.active &&
            cacheValidRef.current) {
          return; // canvas retains last drawn content
        }

        const elapsed = now - startTime;
        const pixels  = pixelsRef.current;
        const mouse   = mouseRef.current;

        /* Clear the ImageData buffer (typed-array fill is very fast) */
        buf.fill(0);

        let anyMoving = false;

        for (let i = 0, len = pixels.length; i < len; i++) {
          const px = pixels[i];

          /* ── Phase: assembling ─── */
          if (phaseRef.current === 'assembling') {
            const pxDelay  = px.delay * 600;
            const progress = Math.max(0, Math.min(1, (elapsed - pxDelay) / ASSEMBLE_MS));
            const ease     = 1 - (1 - progress) * (1 - progress) * (1 - progress); // easeOutCubic

            px.currentX += (px.targetX - px.currentX) * ease * 0.12;
            px.currentY += (px.targetY - px.currentY) * ease * 0.12;

            if (Math.abs(px.currentX - px.targetX) > 0.3 ||
                Math.abs(px.currentY - px.targetY) > 0.3) {
              anyMoving = true;
            } else {
              px.currentX = px.targetX;
              px.currentY = px.targetY;
            }

          /* ── Phase: settled (spring + mouse) ─── */
          } else {
            /* Mouse repulsion — squared-distance check avoids sqrt */
            if (mouse.active) {
              const dx     = px.currentX - mouse.x;
              const dy     = px.currentY - mouse.y;
              const distSq = dx * dx + dy * dy;

              if (distSq < MOUSE_RADIUS_SQ && distSq > 0) {
                const dist  = Math.sqrt(distSq); // only for nearby particles
                const force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
                px.vx += (dx / dist) * force;
                px.vy += (dy / dist) * force;
              }
            }

            /* Spring return to target */
            px.vx = (px.vx + (px.targetX - px.currentX) * SPRING) * DAMPING;
            px.vy = (px.vy + (px.targetY - px.currentY) * SPRING) * DAMPING;
            px.currentX += px.vx;
            px.currentY += px.vy;

            if (Math.abs(px.vx) > VEL_THRESHOLD ||
                Math.abs(px.vy) > VEL_THRESHOLD) {
              anyMoving = true;
            }
          }

          /* ── Write pixel block into ImageData buffer ── */
          const bx = Math.round(px.currentX);
          const by = Math.round(px.currentY);

          /* Bounds check for the entire block */
          if (bx + pSize <= 0 || bx >= W || by + pSize <= 0 || by >= H) continue;

          const r = px.r, g = px.g, b = px.b, a = px.a;

          for (let dy = 0; dy < pSize; dy++) {
            const py = by + dy;
            if (py < 0 || py >= H) continue;
            const rowOff = py * W;
            for (let dx = 0; dx < pSize; dx++) {
              const ppx = bx + dx;
              if (ppx < 0 || ppx >= W) continue;
              const idx = (rowOff + ppx) << 2; // × 4
              buf[idx]     = r;
              buf[idx + 1] = g;
              buf[idx + 2] = b;
              buf[idx + 3] = a;
            }
          }
        }

        /* Single putImageData call — vastly faster than N fillRect calls */
        ctx.putImageData(frameData, 0, 0);

        /* Phase transition: assembling → settled */
        if (phaseRef.current === 'assembling' && !anyMoving) {
          phaseRef.current = 'settled';
        }

        /* Mark cache as valid when nothing is moving */
        if (phaseRef.current === 'settled' && !anyMoving && !mouse.active) {
          cacheValidRef.current = true;
        }
      };

      animRef.current = requestAnimationFrame(loop);
    };

    init();

    /* Resize handler */
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
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
