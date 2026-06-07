import { useEffect, useRef, useCallback } from "react";

function getAdaptivePixelSize(canvasWidth) {
  if (canvasWidth < 300) return 7;
  if (canvasWidth < 500) return 4;
  if (canvasWidth < 800) return 4;
  return 3;
}

const TRIGGER_RADIUS = 30;
const TRIGGER_RADIUS_SQ = TRIGGER_RADIUS * TRIGGER_RADIUS;

export default function PixelCanvas({
  src,
  pixelSize,
  anchor = "bottom-right",
}) {
  const canvasRef = useRef(null);
  const pixelsRef = useRef([]);
  const phaseRef = useRef("idle");
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const animRef = useRef(null);
  const visibleRef = useRef(true);
  const cacheValidRef = useRef(false);
  const butterflyTriggeredRef = useRef(false);
  const canvasDimsRef = useRef({ W: 0, H: 0 });
  const butterfliesRef = useRef([]);

  /* ── Trigger butterfly animation ──────────────────────────────────────── */
  const triggerButterflies = useCallback(() => {
    const pixels = pixelsRef.current;
    const { W, H } = canvasDimsRef.current;
    const numButterflies = Math.max(
      8,
      Math.min(25, Math.floor(pixels.length / 300)),
    );

    const bfs = [];
    for (let b = 0; b < numButterflies; b++) {
      bfs.push({
        /* Position */
        x: W * (0.15 + Math.random() * 0.7),
        y: H * (0.15 + Math.random() * 0.7),

        /* Flight heading & speed */
        heading: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.0,

        /* ── Natural flight state machine ──
           States: 'glide' | 'burst' | 'hover' | 'turn'
           Each butterfly independently decides when to switch */
        flightState: "glide",
        stateTimer: 0, // frames remaining in current state
        stateTimerMax: 40 + Math.random() * 80, // how long this state lasts

        /* Burst params — sudden dart in a direction */
        burstVx: 0,
        burstVy: 0,

        /* Hover params — gentle bob in place */
        hoverCenterX: 0,
        hoverCenterY: 0,
        hoverPhaseX: Math.random() * Math.PI * 2,
        hoverPhaseY: Math.random() * Math.PI * 2,
        hoverRadius: 8 + Math.random() * 14,

        /* Turn params — arc smoothly to a new heading */
        turnTarget: Math.random() * Math.PI * 2,
        turnSpeed: 0.02 + Math.random() * 0.03,

        /* Wing flap — asymmetric, irregular timing */
        flapPhase: Math.random() * Math.PI * 2,
        flapSpeed: 0.006 + Math.random() * 0.006, // varies per butterfly
        flapSkip: 0, // occasional "skip" mid-flap for realism
        flapSkipTimer: 0,
        wingSize: 10 + Math.random() * 14,

        /* Drift — tiny constant random drift added each frame */
        driftX: (Math.random() - 0.5) * 0.3,
        driftY: (Math.random() - 0.5) * 0.3,

        /* Per-butterfly phase offsets for organic variation */
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
      });
    }
    butterfliesRef.current = bfs;

    for (let i = 0, len = pixels.length; i < len; i++) {
      const px = pixels[i];
      px.bfIdx = i % numButterflies;
      const bf = bfs[px.bfIdx];

      const side = Math.random() < 0.5 ? -1 : 1;
      const t = Math.random();
      const wingSpread = t * bf.wingSize;
      const bodyY = (Math.random() - 0.5) * bf.wingSize * 0.8;
      const archY = -t * t * bf.wingSize * 0.3;

      px.bfOffX = side * wingSpread;
      px.bfOffY = bodyY * (1 - t * 0.5) + archY;
      px.bfSide = side;
      px.bfT = t;
      px.vx = 0;
      px.vy = 0;
    }

    phaseRef.current = "butterflies";
    butterflyTriggeredRef.current = true;
    cacheValidRef.current = false;
  }, []);

  /* ── Mouse handlers ───────────────────────────────────────────────────── */
  const handleMouseEnter = useCallback(() => {
    mouseRef.current.active = true;
    cacheValidRef.current = false;
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      mouseRef.current.x = mx;
      mouseRef.current.y = my;
      mouseRef.current.active = true;
      cacheValidRef.current = false;

      if (
        (phaseRef.current === "settled" ||
          phaseRef.current === "reassembling") &&
        !butterflyTriggeredRef.current
      ) {
        const pixels = pixelsRef.current;
        const isNearPixel = pixels.some((px) => {
          const dx = px.targetX - mx;
          const dy = px.targetY - my;
          return dx * dx + dy * dy < TRIGGER_RADIUS_SQ;
        });
        if (isNearPixel) triggerButterflies();
      }
    },
    [triggerButterflies],
  );

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.active = false;
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;

    if (phaseRef.current === "butterflies" || phaseRef.current === "settled") {
      phaseRef.current = "reassembling";
      butterflyTriggeredRef.current = false;
      cacheValidRef.current = false;
    }
  }, []);

  /* ── Main setup + animation loop ──────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    const ioObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
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

        const imageData = offCtx.getImageData(0, 0, W, H).data;
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
            const noiseOffset = Math.random() * Math.PI * 2;

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
              noiseOffset,
            });
          }
        }

        pixelsRef.current = pixels;
        phaseRef.current = "assembling";
        cacheValidRef.current = false;
        canvasDimsRef.current = { W, H };
        startAnimation(ctx, W, H, pSize);
      };
    };

    /* ── Animation loop ─────────────────────────────────────────────────── */
    const startAnimation = (ctx, W, H, pSize) => {
      const startTime = performance.now();
      const ASSEMBLE_MS = 1800;

      const MOUSE_RADIUS = 110;
      const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS;
      const MOUSE_FORCE = 1.6;
      const NOISE_SPEED = 0.0018;
      const NOISE_AMP = 0.55;
      const VEL_THRESHOLD = 0.15;
      const SPRING = 0.08;
      const DAMPING = 0.88;
      const BF_MORPH_SPRING = 0.012;
      const BF_MORPH_DAMPING = 0.94;
      const REASSEMBLE_SPRING = 0.008;
      const REASSEMBLE_DAMPING = 0.965;

      const frameData = ctx.createImageData(W, H);
      const buf = frameData.data;

      /* ── Natural butterfly flight updater ─────────────────────────────── */
      const updateButterfly = (bf, now) => {
        // Tick the state timer
        bf.stateTimer--;

        // ── State machine: decide next state when timer expires ──
        if (bf.stateTimer <= 0) {
          const roll = Math.random();

          if (bf.flightState === "glide") {
            // After gliding, either burst, hover, or turn
            if (roll < 0.35) {
              bf.flightState = "burst";
              const burstAngle =
                bf.heading + (Math.random() - 0.5) * Math.PI * 0.8;
              const burstStrength = 1.5 + Math.random() * 2.5;
              bf.burstVx = Math.cos(burstAngle) * burstStrength;
              bf.burstVy = Math.sin(burstAngle) * burstStrength;
              bf.stateTimer = 8 + Math.floor(Math.random() * 12); // short burst
            } else if (roll < 0.6) {
              bf.flightState = "hover";
              bf.hoverCenterX = bf.x;
              bf.hoverCenterY = bf.y;
              bf.hoverPhaseX = Math.random() * Math.PI * 2;
              bf.hoverPhaseY = Math.random() * Math.PI * 2;
              bf.stateTimer = 30 + Math.floor(Math.random() * 60);
            } else {
              bf.flightState = "turn";
              // Pick a new heading that is noticeably different
              bf.turnTarget =
                bf.heading +
                (Math.PI * 0.3 + Math.random() * Math.PI * 1.2) *
                  (Math.random() < 0.5 ? 1 : -1);
              bf.turnSpeed = 0.025 + Math.random() * 0.035;
              bf.stateTimer = 20 + Math.floor(Math.random() * 30);
            }
          } else if (bf.flightState === "burst") {
            // After burst, always glide for a bit
            bf.flightState = "glide";
            bf.stateTimer = 40 + Math.floor(Math.random() * 60);
          } else if (bf.flightState === "hover") {
            // After hover, burst away or turn
            if (roll < 0.5) {
              bf.flightState = "burst";
              const burstAngle = Math.random() * Math.PI * 2;
              const burstStrength = 2.0 + Math.random() * 2.0;
              bf.burstVx = Math.cos(burstAngle) * burstStrength;
              bf.burstVy = Math.sin(burstAngle) * burstStrength;
              bf.stateTimer = 10 + Math.floor(Math.random() * 10);
            } else {
              bf.flightState = "glide";
              bf.stateTimer = 50 + Math.floor(Math.random() * 50);
            }
          } else if (bf.flightState === "turn") {
            bf.flightState = "glide";
            bf.stateTimer = 35 + Math.floor(Math.random() * 55);
          }
        }

        // ── Execute current state ──
        if (bf.flightState === "glide") {
          // Smooth forward motion with slight organic wobble
          const t = now * 0.001;
          const wobble = Math.sin(t * 1.8 + bf.phaseX) * 0.012; // subtle heading drift
          bf.heading += wobble;

          bf.x += Math.cos(bf.heading) * bf.speed * 0.7;
          bf.y += Math.sin(bf.heading) * bf.speed * 0.7;

          // Very gentle altitude drift — butterflies tend to drift upward slightly
          bf.y -= 0.08;
        } else if (bf.flightState === "burst") {
          // Quick dart — velocity decays rapidly
          bf.x += bf.burstVx;
          bf.y += bf.burstVy;
          bf.burstVx *= 0.82; // fast decay
          bf.burstVy *= 0.82;
          // Update heading to match burst direction
          if (Math.abs(bf.burstVx) > 0.1 || Math.abs(bf.burstVy) > 0.1) {
            bf.heading = Math.atan2(bf.burstVy, bf.burstVx);
          }
        } else if (bf.flightState === "hover") {
          // Gentle lemniscate-like bob in place
          const t = now * 0.001;
          const hoverSpeed = 0.9 + bf.speed * 0.3;
          bf.x =
            bf.hoverCenterX +
            Math.sin(t * hoverSpeed + bf.hoverPhaseX) * bf.hoverRadius;
          bf.y =
            bf.hoverCenterY +
            Math.sin(t * hoverSpeed * 1.3 + bf.hoverPhaseY) *
              bf.hoverRadius *
              0.5;
          // Drift the hover center very slowly upward
          bf.hoverCenterY -= 0.04;
        } else if (bf.flightState === "turn") {
          // Arc smoothly toward new heading
          let diff = bf.turnTarget - bf.heading;
          // Normalize to [-π, π]
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          bf.heading += diff * bf.turnSpeed;

          // Keep some forward momentum during turn
          bf.x += Math.cos(bf.heading) * bf.speed * 0.5;
          bf.y += Math.sin(bf.heading) * bf.speed * 0.5;
        }

        // ── Persistent micro-drift (always active, every state) ──
        bf.x += bf.driftX;
        bf.y += bf.driftY;
        // Slowly randomize drift so it doesn't become a straight line
        bf.driftX += (Math.random() - 0.5) * 0.04;
        bf.driftY += (Math.random() - 0.5) * 0.04;
        bf.driftX *= 0.97; // dampen so drift stays small
        bf.driftY *= 0.97;

        // ── Soft boundary steering — push back gently before hitting edges ──
        const margin = 0.1;
        if (bf.x < W * margin) bf.heading += 0.04 + Math.random() * 0.02;
        if (bf.x > W * (1 - margin)) bf.heading -= 0.04 + Math.random() * 0.02;
        if (bf.y < H * margin) bf.heading += 0.03 + Math.random() * 0.02;
        if (bf.y > H * (1 - margin)) bf.heading -= 0.03 + Math.random() * 0.02;
        // Hard clamp — don't let them escape entirely
        bf.x = Math.max(W * 0.02, Math.min(W * 0.98, bf.x));
        bf.y = Math.max(H * 0.02, Math.min(H * 0.98, bf.y));

        // ── Wing flap — irregular speed + occasional mid-flap skip ──
        bf.flapSkipTimer--;
        if (bf.flapSkipTimer <= 0) {
          // Randomly skip a half-beat every so often
          bf.flapSkip = Math.random() < 0.15 ? 1 : 0;
          bf.flapSkipTimer = 20 + Math.floor(Math.random() * 40);
        }
        if (!bf.flapSkip) {
          // Burst state = faster flapping; hover = slower, lazier
          const flapMult =
            bf.flightState === "burst"
              ? 1.8
              : bf.flightState === "hover"
                ? 0.5
                : 1.0;
          bf.flapPhase += bf.flapSpeed * flapMult;
        }
      };

      const loop = (now) => {
        animRef.current = requestAnimationFrame(loop);
        if (!visibleRef.current) return;
        if (
          phaseRef.current === "settled" &&
          !mouseRef.current.active &&
          cacheValidRef.current
        )
          return;

        const elapsed = now - startTime;
        const pixels = pixelsRef.current;
        const mouse = mouseRef.current;

        buf.fill(0);
        let anyMoving = false;

        for (let i = 0, len = pixels.length; i < len; i++) {
          const px = pixels[i];
          const phase = phaseRef.current;

          /* ── Assembling ── */
          if (phase === "assembling") {
            const pxDelay = px.delay * 600;
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

            /* ── Butterflies ── */
          } else if (phase === "butterflies") {
            const bfs = butterfliesRef.current;
            const bf = bfs[px.bfIdx];
            if (bf) {
              // Update flight once per butterfly per frame
              if (!bf._updatedFrame || bf._updatedFrame !== now) {
                bf._updatedFrame = now;
                updateButterfly(bf, now);
              }

              // Wing flap — produces natural open/close with variable depth
              const flapAngle = Math.sin(bf.flapPhase);
              // Non-linear: wings spend more time open than closed (like real butterflies)
              const flapScale = 0.2 + Math.pow(Math.abs(flapAngle), 0.6) * 0.8;

              const rawX = px.bfOffX * flapScale;
              const rawY = px.bfOffY;

              const cosH = Math.cos(bf.heading);
              const sinH = Math.sin(bf.heading);
              const rotX = rawX * cosH - rawY * sinH;
              const rotY = rawX * sinH + rawY * cosH;

              const bfTargetX = bf.x + rotX;
              const bfTargetY = bf.y + rotY;

              px.vx =
                (px.vx + (bfTargetX - px.currentX) * BF_MORPH_SPRING) *
                BF_MORPH_DAMPING;
              px.vy =
                (px.vy + (bfTargetY - px.currentY) * BF_MORPH_SPRING) *
                BF_MORPH_DAMPING;
              px.currentX += px.vx;
              px.currentY += px.vy;
            }
            anyMoving = true;

            /* ── Reassembling ── */
          } else if (phase === "reassembling") {
            px.vx =
              (px.vx + (px.targetX - px.currentX) * REASSEMBLE_SPRING) *
              REASSEMBLE_DAMPING;
            px.vy =
              (px.vy + (px.targetY - px.currentY) * REASSEMBLE_SPRING) *
              REASSEMBLE_DAMPING;
            px.currentX += px.vx;
            px.currentY += px.vy;
            if (
              Math.abs(px.currentX - px.targetX) > 0.3 ||
              Math.abs(px.currentY - px.targetY) > 0.3 ||
              Math.abs(px.vx) > 0.08 ||
              Math.abs(px.vy) > 0.08
            ) {
              anyMoving = true;
            } else {
              px.currentX = px.targetX;
              px.currentY = px.targetY;
              px.vx = 0;
              px.vy = 0;
            }

            /* ── Settled ── */
          } else {
            if (mouse.active) {
              const dx = px.currentX - mouse.x;
              const dy = px.currentY - mouse.y;
              const distSq = dx * dx + dy * dy;
              if (distSq < MOUSE_RADIUS_SQ && distSq > 0) {
                const dist = Math.sqrt(distSq);
                const falloff = 1 - dist / MOUSE_RADIUS;
                const smooth = falloff * falloff;
                const shimmerAngle =
                  px.noiseOffset + elapsed * NOISE_SPEED * (1 + smooth * 2);
                px.vx +=
                  (dx / dist) * MOUSE_FORCE * smooth +
                  Math.cos(shimmerAngle) * NOISE_AMP * smooth;
                px.vy +=
                  (dy / dist) * MOUSE_FORCE * smooth +
                  Math.sin(shimmerAngle) * NOISE_AMP * smooth;
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

          /* ── Write pixel to buffer ── */
          const bx = Math.round(px.currentX);
          const by = Math.round(px.currentY);
          if (bx + pSize <= 0 || bx >= W || by + pSize <= 0 || by >= H)
            continue;

          const r = px.r,
            g = px.g,
            b = px.b,
            a = px.a;
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

        if (phaseRef.current === "assembling" && !anyMoving)
          phaseRef.current = "settled";
        if (phaseRef.current === "reassembling" && !anyMoving) {
          phaseRef.current = "settled";
          butterflyTriggeredRef.current = false;
        }
        if (phaseRef.current === "settled" && !anyMoving && !mouse.active)
          cacheValidRef.current = true;
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
  }, [src, pixelSize, anchor]);

  return (
    <canvas
      ref={canvasRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
