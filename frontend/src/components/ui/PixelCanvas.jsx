import { useEffect, useRef, useCallback } from 'react';

/* ─────────────────────────────────────────────────────────────────────────
   PixelCanvas
   • Loads an image source and samples it into a grid of SQUARE pixel blocks.
   • Assembly animation: pixels start scattered → fly in with staggered ease.
   • Mouse interaction: nearby pixels scatter outward, reform on leave.
   ───────────────────────────────────────────────────────────────────────── */

export default function PixelCanvas({ src, pixelSize = 6 }) {
  const canvasRef  = useRef(null);
  const pixelsRef  = useRef([]);
  const phaseRef   = useRef('idle');   // 'assembling' | 'settled'
  const mouseRef   = useRef({ x: -9999, y: -9999, active: false });
  const animRef    = useRef(null);
  const pSizeRef   = useRef(pixelSize);
  pSizeRef.current = pixelSize;

  /* ── Mouse handlers ───────────────────────────────────────────────────── */
  const handleMouseMove = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
    mouseRef.current.active = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.active = false;
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;
  }, []);

  /* ── Main setup + animation loop ──────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const init = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const W = Math.round(rect.width);
      const H = Math.round(rect.height);
      canvas.width  = W;
      canvas.height = H;

      const img = new Image();
      img.src   = src;

      img.onload = () => {
        const pSize = pSizeRef.current;
        const cols  = Math.floor(W / pSize);
        const rows  = Math.floor(H / pSize);

        /* Draw image scaled to canvas, then sample pixel colors */
        const offscreen    = document.createElement('canvas');
        offscreen.width    = W;
        offscreen.height   = H;
        const offCtx       = offscreen.getContext('2d');

        /* Scale to cover, anchored bottom-right */
        const scale = Math.max(W / img.width, H / img.height);
        const sw    = img.width * scale;
        const sh    = img.height * scale;
        offCtx.drawImage(img, W - sw, H - sh, sw, sh);

        const imageData = offCtx.getImageData(0, 0, W, H).data;
        const pixels    = [];

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const targetX = c * pSize;
            const targetY = r * pSize;

            /* Sample center of pixel block */
            const sx = Math.min(targetX + Math.floor(pSize / 2), W - 1);
            const sy = Math.min(targetY + Math.floor(pSize / 2), H - 1);
            const i  = (sy * W + sx) * 4;

            const red   = imageData[i];
            const green = imageData[i + 1];
            const blue  = imageData[i + 2];
            const alpha = imageData[i + 3];

            /* Skip nearly-transparent or near-background-color pixels */
            if (alpha < 30) continue;
            const brightness = red * 0.299 + green * 0.587 + blue * 0.114;
            if (brightness > 235 && alpha < 180) continue;

            /* Scatter start position: random far from canvas */
            const angle = Math.random() * Math.PI * 2;
            const dist  = Math.max(W, H) * (0.8 + Math.random() * 0.6);
            const startX = W * 0.5 + Math.cos(angle) * dist;
            const startY = H * 0.5 + Math.sin(angle) * dist;

            pixels.push({
              targetX,
              targetY,
              currentX: startX,
              currentY: startY,
              color: `rgba(${red},${green},${blue},${alpha / 255})`,
              /* Stagger: pixels closer to center arrive first */
              delay: Math.sqrt(
                (targetX - W * 0.5) ** 2 + (targetY - H * 0.5) ** 2
              ) / Math.max(W, H),
              settled: false,
              /* Velocity for mouse scatter */
              vx: 0,
              vy: 0,
            });
          }
        }

        pixelsRef.current = pixels;
        phaseRef.current  = 'assembling';
        startAnimation(ctx, W, H);
      };
    };

    /* ── Animation loop ─────────────────────────────────────────────────── */
    const startAnimation = (ctx, W, H) => {
      const pSize   = pSizeRef.current;
      let startTime = performance.now();
      const ASSEMBLE_DURATION = 1800; // ms

      const loop = (now) => {
        animRef.current = requestAnimationFrame(loop);
        ctx.clearRect(0, 0, W, H);

        const elapsed = now - startTime;
        const pixels  = pixelsRef.current;
        const mouse   = mouseRef.current;
        const MOUSE_RADIUS = 80;
        const MOUSE_FORCE  = 12;

        let allSettled = true;

        for (let i = 0; i < pixels.length; i++) {
          const px = pixels[i];

          if (phaseRef.current === 'assembling') {
            /* Staggered assembly ease-out */
            const pxDelay  = px.delay * 600;  // ms offset based on distance
            const progress = Math.max(0, Math.min(1, (elapsed - pxDelay) / ASSEMBLE_DURATION));
            const ease     = 1 - Math.pow(1 - progress, 3); // easeOutCubic

            px.currentX = px.currentX + (px.targetX - px.currentX) * ease * 0.12;
            px.currentY = px.currentY + (px.targetY - px.currentY) * ease * 0.12;

            if (Math.abs(px.currentX - px.targetX) < 0.3 &&
                Math.abs(px.currentY - px.targetY) < 0.3) {
              px.currentX = px.targetX;
              px.currentY = px.targetY;
              px.settled  = true;
            } else {
              allSettled = false;
            }
          } else {
            /* Settled phase — spring back + mouse interaction */
            /* Mouse repulsion */
            if (mouse.active) {
              const dx = px.currentX - mouse.x;
              const dy = px.currentY - mouse.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < MOUSE_RADIUS && dist > 0) {
                const force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
                px.vx += (dx / dist) * force;
                px.vy += (dy / dist) * force;
              }
            }

            /* Spring back to target */
            const springX = (px.targetX - px.currentX) * 0.08;
            const springY = (px.targetY - px.currentY) * 0.08;
            px.vx = (px.vx + springX) * 0.88; // damping
            px.vy = (px.vy + springY) * 0.88;

            px.currentX += px.vx;
            px.currentY += px.vy;
          }

          /* Draw square pixel block */
          ctx.fillStyle = px.color;
          ctx.fillRect(
            Math.round(px.currentX),
            Math.round(px.currentY),
            pSize,
            pSize,
          );
        }

        if (phaseRef.current === 'assembling' && allSettled) {
          phaseRef.current = 'settled';
        }
      };

      animRef.current = requestAnimationFrame(loop);
    };

    init();

    /* Resize handler */
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(animRef.current);
      init();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
