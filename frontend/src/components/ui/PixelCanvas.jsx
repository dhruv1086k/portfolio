import { useEffect, useRef, forwardRef } from "react";

function getAdaptivePixelSize(canvasWidth) {
  if (canvasWidth < 300) return 8;
  if (canvasWidth < 500) return 6;
  if (canvasWidth < 800) return 5;
  return 4;
}

const PixelCanvas = forwardRef(function PixelCanvas(
  { src, pixelSize, anchor = "bottom-right" },
  ref,
) {
  const canvasRef = useRef(null);
  const pixelsRef = useRef([]);
  const phaseRef = useRef("idle");
  const animRef = useRef(null);
  const visibleRef = useRef(true);
  const retryRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

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

      const MAX_SHIFT = Math.max(4, Math.round(pSize * 2));
      const BAND_COUNT = 4;

      const frameData = ctx.createImageData(W, H);
      const buf = frameData.data;

      const generateBands = () => {
        const bands = [];
        for (let i = 0; i < BAND_COUNT; i++) {
          bands.push({
            y0: Math.random() * H,
            height: H * (0.04 + Math.random() * 0.12),
            rShift: (Math.random() - 0.5) * 2 * MAX_SHIFT,
            bShift: (Math.random() - 0.5) * 2 * MAX_SHIFT,
          });
        }
        return bands;
      };

      // Draw a single static frame (no glitch)
      const drawStatic = () => {
        const pixels = pixelsRef.current;
        buf.fill(0);
        for (let i = 0, len = pixels.length; i < len; i++) {
          const px = pixels[i];
          const bx = Math.round(px.currentX);
          const by = Math.round(px.currentY);
          if (bx + pSize <= 0 || bx >= W || by + pSize <= 0 || by >= H) continue;
          for (let dy = 0; dy < pSize; dy++) {
            const py2 = by + dy;
            if (py2 < 0 || py2 >= H) continue;
            const rowOff = py2 * W;
            for (let dx = 0; dx < pSize; dx++) {
              const ppx = bx + dx;
              if (ppx < 0 || ppx >= W) continue;
              const idx = (rowOff + ppx) << 2;
              buf[idx] = px.r;
              buf[idx + 1] = px.g;
              buf[idx + 2] = px.b;
              buf[idx + 3] = px.a;
            }
          }
        }
        ctx.putImageData(frameData, 0, 0);
      };

      // Run a short glitch burst (rAF for ~200ms then stop)
      const runGlitchBurst = () => {
        if (!visibleRef.current) return;
        const bands = generateBands();
        const burstStart = performance.now();
        const BURST_MS = 180;
        let burstRaf = null;

        const burstFrame = (now) => {
          const elapsed = now - burstStart;
          if (elapsed > BURST_MS) {
            drawStatic();
            return;
          }
          const glitchT = elapsed / BURST_MS;
          let intensity = 0;
          if (glitchT < 0.15) intensity = glitchT / 0.15;
          else if (glitchT > 0.75) intensity = (1 - glitchT) / 0.25;
          else intensity = 1;

          const pixels = pixelsRef.current;
          buf.fill(0);
          for (let i = 0, len = pixels.length; i < len; i++) {
            const px = pixels[i];
            const bx = Math.round(px.currentX);
            const by = Math.round(px.currentY);
            if (bx + pSize <= 0 || bx >= W || by + pSize <= 0 || by >= H) continue;

            let rOffsetX = 0, bOffsetX = 0;
            for (let band = 0; band < bands.length; band++) {
              const bnd = bands[band];
              if (px.targetY >= bnd.y0 && px.targetY < bnd.y0 + bnd.height) {
                rOffsetX = Math.round(bnd.rShift * intensity);
                bOffsetX = Math.round(bnd.bShift * intensity);
                break;
              }
            }

            for (let dy = 0; dy < pSize; dy++) {
              const py2 = by + dy;
              if (py2 < 0 || py2 >= H) continue;
              const rowOff = py2 * W;
              for (let dx = 0; dx < pSize; dx++) {
                const ppx = bx + dx;
                if (ppx < 0 || ppx >= W) continue;
                const idx = (rowOff + ppx) << 2;
                buf[idx + 1] = px.g;
                buf[idx + 3] = Math.max(buf[idx + 3], px.a);
                if (rOffsetX !== 0) {
                  const rx = ppx + rOffsetX;
                  if (rx >= 0 && rx < W) { const rIdx = (rowOff + rx) << 2; buf[rIdx] = px.r; buf[rIdx + 3] = Math.max(buf[rIdx + 3], px.a); }
                } else { buf[idx] = px.r; }
                if (bOffsetX !== 0) {
                  const bxp = ppx + bOffsetX;
                  if (bxp >= 0 && bxp < W) { const bIdx = (rowOff + bxp) << 2; buf[bIdx + 2] = px.b; buf[bIdx + 3] = Math.max(buf[bIdx + 3], px.a); }
                } else { buf[idx + 2] = px.b; }
              }
            }
          }
          ctx.putImageData(frameData, 0, 0);
          burstRaf = requestAnimationFrame(burstFrame);
        };
        burstRaf = requestAnimationFrame(burstFrame);
      };

      // Assembly loop — runs only during assembly, then stops
      const drawAssemblyFrame = (now) => {
        const elapsed = now - startTime;
        const pixels = pixelsRef.current;
        buf.fill(0);
        let anyMoving = false;

        for (let i = 0, len = pixels.length; i < len; i++) {
          const px = pixels[i];
          const pxDelay = px.delay * 500;
          const progress = Math.max(0, Math.min(1, (elapsed - pxDelay) / ASSEMBLE_MS));
          const ease = 1 - (1 - progress) ** 3;
          px.currentX += (px.targetX - px.currentX) * ease * 0.12;
          px.currentY += (px.targetY - px.currentY) * ease * 0.12;
          if (Math.abs(px.currentX - px.targetX) > 0.3 || Math.abs(px.currentY - px.targetY) > 0.3) {
            anyMoving = true;
          } else {
            px.currentX = px.targetX;
            px.currentY = px.targetY;
          }

          const bx = Math.round(px.currentX);
          const by = Math.round(px.currentY);
          if (bx + pSize <= 0 || bx >= W || by + pSize <= 0 || by >= H) continue;
          for (let dy = 0; dy < pSize; dy++) {
            const py2 = by + dy;
            if (py2 < 0 || py2 >= H) continue;
            const rowOff = py2 * W;
            for (let dx = 0; dx < pSize; dx++) {
              const ppx = bx + dx;
              if (ppx < 0 || ppx >= W) continue;
              const idx = (rowOff + ppx) << 2;
              buf[idx] = px.r;
              buf[idx + 1] = px.g;
              buf[idx + 2] = px.b;
              buf[idx + 3] = px.a;
            }
          }
        }

        ctx.putImageData(frameData, 0, 0);

        if (anyMoving) {
          animRef.current = requestAnimationFrame(drawAssemblyFrame);
        } else {
          // Assembly done — draw final static frame, then schedule 3 glitch bursts and stop
          phaseRef.current = "settled";
          drawStatic();
          // 3 subtle glitch bursts at 2s, 4s, 6s after settling, then fully idle
          setTimeout(runGlitchBurst, 2000);
          setTimeout(runGlitchBurst, 4000);
          setTimeout(runGlitchBurst, 6500);
        }
      };

      animRef.current = requestAnimationFrame(drawAssemblyFrame);
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
