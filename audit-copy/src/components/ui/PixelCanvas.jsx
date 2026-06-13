import {
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";

function getAdaptivePixelSize(canvasWidth) {
  if (canvasWidth < 300) return 7;
  if (canvasWidth < 500) return 4;
  if (canvasWidth < 800) return 4;
  return 3;
}

const TRIGGER_RADIUS = 30;
const TRIGGER_RADIUS_SQ = TRIGGER_RADIUS * TRIGGER_RADIUS;

const ERROR_NAMES = [
  "TypeError",
  "NullRef",
  "SegFault",
  "ENOMEM",
  "StackOverflow",
  "NaN",
  "undefined",
  "404",
  "RangeErr",
  "SyntaxErr",
  "SIGKILL",
  "Deadlock",
  "HeapDump",
  "CORS",
  "InfiniteLoop",
  "RaceCondition",
  "BufferOverflow",
  "OutOfBounds",
  "NullPtr",
  "UnhandledPromise",
];

const C_ORANGE = "#C4501A";
const C_DARK = "#0D0C0A";
const C_PARCH = "#F5F2EB";
const C_BURNT = "#B6451B";
const C_ORG_A = (a) => `rgba(196,80,26,${a})`;
const C_BRN_A = (a) => `rgba(182,69,27,${a})`;
const C_BLK_A = (a) => `rgba(13,12,10,${a})`;

const PixelCanvas = forwardRef(function PixelCanvas(
  {
    src,
    pixelSize,
    anchor = "bottom-right",
    gameMode = false,
    onBugKilled,
    onAllBugsKilled,
    onBugsSpawned, // Change 6: callback to report exact bug count
  },
  ref,
) {
  const canvasRef = useRef(null);
  const pixelsRef = useRef([]);
  const phaseRef = useRef("idle");
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const animRef = useRef(null);
  const visibleRef = useRef(true);
  const cacheValidRef = useRef(false);
  const bugTriggeredRef = useRef(false);
  const canvasDimsRef = useRef({ W: 0, H: 0 });
  const bugsRef = useRef([]);
  const gameModeRef = useRef(gameMode);
  const killedCountRef = useRef(0); // Change 6: track accurate kill count
  const clickPosRef = useRef(null);

  // Change 1: track section bounds for full-section movement
  const sectionBoundsRef = useRef(null);

  useImperativeHandle(ref, () => ({
    triggerGameBugs: () => {
      gameModeRef.current = true;
      killedCountRef.current = 0;
      triggerBugs(true);
    },
    resetGame: () => {
      // ← ADD THIS
      bugsRef.current = [];
      phaseRef.current = "reassembling";
      bugTriggeredRef.current = false;
      gameModeRef.current = false;
      cacheValidRef.current = false;
      // reset all pixel velocities so they spring back cleanly
      const pixels = pixelsRef.current;
      for (let i = 0; i < pixels.length; i++) {
        pixels[i].vx = 0;
        pixels[i].vy = 0;
      }
    },
  }));
  useEffect(() => {
    gameModeRef.current = gameMode;
  }, [gameMode]);

  /* ── Trigger bug animation ─────────────────────────────────────────── */
  const triggerBugs = useCallback(
    (isGame = false) => {
      const pixels = pixelsRef.current;
      const { W, H } = canvasDimsRef.current;

      // Change 1: In game mode, use the full section/viewport for bug area
      // We'll get the section rect for coordinate clamping
      if (isGame && canvasRef.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        // The section is the parent of the canvas's motion wrapper
        // We use viewport-relative coordinates; bugs will roam the full canvas
        // which in game mode is expanded (see HeroSection zIndex/size)
        sectionBoundsRef.current = {
          // Use the full viewport width mapped to canvas coords
          minX: -W * 0.5,
          maxX: W * 1.5,
          minY: -H * 0.5,
          maxY: H * 1.5,
        };
      }

      const numBugs = Math.max(
        12,
        Math.min(35, Math.floor(pixels.length / 200)),
      );

      // Change 6: report exact count to parent
      onBugsSpawned?.(numBugs);

      const bugs = [];
      for (let b = 0; b < numBugs; b++) {
        // Change 4: random freeze duration between 60–300 frames (1–5 seconds at 60fps)
        const freezeDuration = 60 + Math.floor(Math.random() * 240);
        bugs.push({
          id: b,
          alive: true,
          dyingProgress: 0,
          // Change 1: spawn across full canvas width/height
          x: W * 0.05 + Math.random() * W * 0.9,
          y: H * 0.05 + Math.random() * H * 0.9,
          heading: Math.random() * Math.PI * 2,
          speed: 0.7 + Math.random() * 1.8,
          flightState: "scurry",
          stateTimer: 30 + Math.floor(Math.random() * 60),
          zigzagPhase: Math.random() * Math.PI * 2,
          zigzagAmp: 0.08 + Math.random() * 0.15,
          circleDir: Math.random() < 0.5 ? 1 : -1,
          circleCenterX: 0,
          circleCenterY: 0,
          circleRadius: 15 + Math.random() * 30,
          circleAngle: Math.random() * Math.PI * 2,
          scuttlePhase: Math.random() * Math.PI * 2,
          scuttleSpeed: 0.18 + Math.random() * 0.22,
          legLength: 8 + Math.random() * 6,
          numLegs: 4,
          bodyLength: 10 + Math.random() * 8,
          bodyWidth: 7 + Math.random() * 5,
          antennaPhase: Math.random() * Math.PI * 2,
          antennaSpeed: 0.05 + Math.random() * 0.08,
          driftX: (Math.random() - 0.5) * 0.5,
          driftY: (Math.random() - 0.5) * 0.5,
          phaseX: Math.random() * Math.PI * 2,
          errorLabel: ERROR_NAMES[b % ERROR_NAMES.length],
          silk: [],
          morphProgress: 0,
          // Change 4: each bug has its own freeze duration (1–5s)
          freezeDuration,
        });
      }
      bugsRef.current = bugs;

      for (let i = 0, len = pixels.length; i < len; i++) {
        const px = pixels[i];
        px.bugIdx = i % numBugs;
        const bug = bugs[px.bugIdx];

        px.morphFromX = px.currentX;
        px.morphFromY = px.currentY;

        const roll = Math.random();
        if (roll < 0.35) {
          const angle = Math.random() * Math.PI * 2;
          const r = Math.random();
          px.bugOffX = Math.cos(angle) * bug.bodyWidth * r;
          px.bugOffY =
            Math.sin(angle) * bug.bodyLength * r * 0.5 + bug.bodyLength * 0.3;
          px.bugPart = "abdomen";
        } else if (roll < 0.55) {
          const angle = Math.random() * Math.PI * 2;
          const r = Math.random() * 0.8;
          px.bugOffX = Math.cos(angle) * bug.bodyWidth * 0.55 * r;
          px.bugOffY =
            Math.sin(angle) * bug.bodyLength * 0.35 * r - bug.bodyLength * 0.18;
          px.bugPart = "head";
        } else if (roll < 0.88) {
          const legPair = Math.floor(Math.random() * bug.numLegs);
          const side = Math.random() < 0.5 ? -1 : 1;
          const legY = (legPair - 1.5) * (bug.bodyLength * 0.38);
          const legX = side * (bug.bodyWidth + Math.random() * bug.legLength);
          px.bugOffX = legX;
          px.bugOffY = legY;
          px.bugPart = "leg";
          px.legPair = legPair;
          px.legSide = side;
        } else {
          const side = Math.random() < 0.5 ? -1 : 1;
          const t = Math.random();
          px.bugOffX = side * t * bug.bodyWidth * 0.7;
          px.bugOffY = -(bug.bodyLength * 0.4 + t * bug.bodyLength * 0.4);
          px.bugPart = "antenna";
          px.antennaSide = side;
          px.antennaT = t;
        }

        px.vx = 0;
        px.vy = 0;
      }

      phaseRef.current = "morphing";
      bugTriggeredRef.current = true;
      cacheValidRef.current = false;
    },
    [onBugsSpawned],
  );

  /* ── Mouse / click handlers ───────────────────────────────────────── */
  const handleMouseEnter = useCallback(() => {
    mouseRef.current.active = true;
    cacheValidRef.current = false;
  }, []);

  const handleMouseMove = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    mouseRef.current.x = mx;
    mouseRef.current.y = my;
    mouseRef.current.active = true;
    cacheValidRef.current = false;

    // Change 3: Hover on pixel image no longer triggers bug animation
    // (removed hover-trigger logic — only game mode button triggers bugs)
  }, []);

  const handleClick = useCallback(
    (e) => {
      if (!gameModeRef.current) return;
      if (phaseRef.current !== "bugs") return;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      const bugs = bugsRef.current;
      const KILL_RADIUS = 44;
      let closest = null;
      let closestDist = KILL_RADIUS * KILL_RADIUS;

      for (const bug of bugs) {
        if (!bug.alive || bug.dyingProgress > 0) continue;
        const dx = bug.x - cx;
        const dy = bug.y - cy;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < closestDist) {
          closestDist = dist2;
          closest = bug;
        }
      }

      if (closest) {
        closest.dyingProgress = 0.01;
        killedCountRef.current += 1; // Change 6: accurate kill tracking
        onBugKilled?.();

        setTimeout(() => {
          const allDead = bugsRef.current.every(
            (b) => !b.alive || b.dyingProgress >= 1,
          );
          if (allDead) {
            onAllBugsKilled?.(killedCountRef.current); // Change 6: pass accurate count
          }
        }, 900);
      }
    },
    [onBugKilled, onAllBugsKilled],
  );

  // Change 1: In game mode, bugs should move across the FULL section/viewport
  // We attach a global mousemove in game mode to track cursor across the whole section
  useEffect(() => {
    if (!gameMode) return;

    const handleGlobalMove = (e) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleGlobalClick = (e) => {
      if (phaseRef.current !== "bugs") return;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      const bugs = bugsRef.current;
      const KILL_RADIUS = 44;
      let closest = null;
      let closestDist = KILL_RADIUS * KILL_RADIUS;

      for (const bug of bugs) {
        if (!bug.alive || bug.dyingProgress > 0) continue;
        const dx = bug.x - cx;
        const dy = bug.y - cy;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < closestDist) {
          closestDist = dist2;
          closest = bug;
        }
      }

      if (closest) {
        closest.dyingProgress = 0.01;
        killedCountRef.current += 1;
        onBugKilled?.();

        setTimeout(() => {
          const allDead = bugsRef.current.every(
            (b) => !b.alive || b.dyingProgress >= 1,
          );
          if (allDead) {
            onAllBugsKilled?.(killedCountRef.current);
          }
        }, 900);
      }
    };

    window.addEventListener("mousemove", handleGlobalMove);
    window.addEventListener("click", handleGlobalClick);
    return () => {
      window.removeEventListener("mousemove", handleGlobalMove);
      window.removeEventListener("click", handleGlobalClick);
    };
  }, [gameMode, onBugKilled, onAllBugsKilled]);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.active = false;
    // Change 3: on mouse leave from image, just disable repel effect
    // Do NOT trigger bug animation (that's change 3)
    if (!gameModeRef.current) {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
      if (phaseRef.current === "bugs" || phaseRef.current === "settled") {
        phaseRef.current = "reassembling";
        bugTriggeredRef.current = false;
        cacheValidRef.current = false;
      }
    }
  }, []);

  /* ── Main setup + animation loop ──────────────────────────────────── */
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

    /* ── Animation loop ─────────────────────────────────────────────── */
    const startAnimation = (ctx, W, H, pSize) => {
      const startTime = performance.now();
      const ASSEMBLE_MS = 1800;
      const MORPH_DURATION = 1200;
      let morphStartTime = null;

      const MOUSE_RADIUS = 110;
      const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS;
      const MOUSE_FORCE = 1.6;
      const NOISE_SPEED = 0.0018;
      const NOISE_AMP = 0.55;
      const VEL_THRESHOLD = 0.15;
      const SPRING = 0.08;
      const DAMPING = 0.88;
      const BUG_MORPH_SPRING = 0.0009;
      const BUG_MORPH_DAMPING = 0.94;
      const REASSEMBLE_SPRING = 0.0009;
      const REASSEMBLE_DAMPING = 0.965;

      const frameData = ctx.createImageData(W, H);
      const buf = frameData.data;

      /* ── Bug movement updater ──────────────────────────────────── */
      const updateBug = (bug, now) => {
        if (!bug.alive) return;
        if (bug.dyingProgress > 0) {
          bug.dyingProgress += 0.032;
          if (bug.dyingProgress >= 1) {
            bug.alive = false;
            bug.dyingProgress = 1;
            const allDead = bugsRef.current.every((b) => !b.alive);
            if (allDead) onAllBugsKilled?.(killedCountRef.current);
          }
          return;
        }

        bug.stateTimer--;
        bug.silk.push({ x: bug.x, y: bug.y });
        if (bug.silk.length > 30) bug.silk.shift();

        if (bug.stateTimer <= 0) {
          const roll = Math.random();
          if (bug.flightState === "scurry") {
            if (roll < 0.25) {
              // Change 4: freeze for 1–5 random seconds
              bug.flightState = "freeze";
              bug.stateTimer = bug.freezeDuration;
            } else if (roll < 0.5) {
              bug.flightState = "zigzag";
              bug.stateTimer = 20 + Math.floor(Math.random() * 40);
            } else if (roll < 0.7) {
              bug.flightState = "circle";
              bug.circleCenterX = bug.x;
              bug.circleCenterY = bug.y;
              bug.circleAngle = Math.atan2(
                bug.y - bug.circleCenterY,
                bug.x - bug.circleCenterX,
              );
              bug.stateTimer = 25 + Math.floor(Math.random() * 35);
            } else {
              bug.heading += (Math.random() - 0.5) * Math.PI * 1.5;
              bug.stateTimer = 30 + Math.floor(Math.random() * 50);
            }
          } else if (bug.flightState === "freeze") {
            bug.flightState = "scurry";
            bug.heading = Math.random() * Math.PI * 2;
            bug.speed = 1.2 + Math.random() * 1.8;
            bug.stateTimer = 30 + Math.floor(Math.random() * 40);
            // Change 4: re-randomise freeze duration each time
            bug.freezeDuration = 60 + Math.floor(Math.random() * 240);
          } else if (bug.flightState === "zigzag") {
            bug.flightState = "scurry";
            bug.stateTimer = 25 + Math.floor(Math.random() * 45);
          } else if (bug.flightState === "circle") {
            bug.flightState = "scurry";
            bug.heading = Math.random() * Math.PI * 2;
            bug.stateTimer = 20 + Math.floor(Math.random() * 40);
          }
        }

        if (bug.flightState === "scurry") {
          const t = now * 0.001;
          bug.heading += Math.sin(t * 3.5 + bug.phaseX) * 0.025;
          bug.x += Math.cos(bug.heading) * bug.speed;
          bug.y += Math.sin(bug.heading) * bug.speed;
          bug.speed = Math.max(0.5, bug.speed * 0.997);
        } else if (bug.flightState === "zigzag") {
          bug.zigzagPhase += 0.18;
          const perpX = -Math.sin(bug.heading);
          const perpY = Math.cos(bug.heading);
          bug.x +=
            Math.cos(bug.heading) * bug.speed * 0.8 +
            perpX * Math.sin(bug.zigzagPhase) * 5;
          bug.y +=
            Math.sin(bug.heading) * bug.speed * 0.8 +
            perpY * Math.sin(bug.zigzagPhase) * 5;
        } else if (bug.flightState === "circle") {
          bug.circleAngle += 0.07 * bug.circleDir;
          bug.x =
            bug.circleCenterX + Math.cos(bug.circleAngle) * bug.circleRadius;
          bug.y =
            bug.circleCenterY + Math.sin(bug.circleAngle) * bug.circleRadius;
          bug.heading = bug.circleAngle + (Math.PI / 2) * bug.circleDir;
        }

        bug.x += bug.driftX;
        bug.y += bug.driftY;
        bug.driftX += (Math.random() - 0.5) * 0.08;
        bug.driftY += (Math.random() - 0.5) * 0.08;
        bug.driftX *= 0.95;
        bug.driftY *= 0.95;

        // Change 1: bugs roam the full canvas area (not just 6% margin)
        const margin = 0.03;
        if (bug.x < W * margin)
          bug.heading =
            Math.abs(bug.heading % (Math.PI * 2)) + (Math.random() - 0.5) * 0.5;
        if (bug.x > W * (1 - margin))
          bug.heading = Math.PI - bug.heading + (Math.random() - 0.5) * 0.5;
        if (bug.y < H * margin)
          bug.heading =
            Math.abs(bug.heading) * (Math.random() > 0.5 ? 1 : -1) +
            (Math.random() - 0.5) * 0.5;
        if (bug.y > H * (1 - margin))
          bug.heading = -bug.heading + (Math.random() - 0.5) * 0.5;
        bug.x = Math.max(W * margin, Math.min(W * (1 - margin), bug.x));
        bug.y = Math.max(H * margin, Math.min(H * (1 - margin), bug.y));

        bug.scuttlePhase +=
          bug.scuttleSpeed * (bug.flightState === "freeze" ? 0.05 : 1.0);
        bug.antennaPhase +=
          bug.antennaSpeed * (bug.flightState === "freeze" ? 1.5 : 0.8);
      };

      /* ── Draw spider body ─────────────────────────────────────────── */
      const drawSpiders = (bugs) => {
        bugs.forEach((bug) => {
          if (!bug.alive && bug.dyingProgress >= 1) return;

          const alpha =
            bug.dyingProgress > 0 ? Math.max(0, 1 - bug.dyingProgress) : 1;
          const scale = bug.dyingProgress > 0 ? 1 + bug.dyingProgress * 0.5 : 1;

          /* Silk trail */
          if (bug.silk.length > 2 && bug.dyingProgress === 0) {
            ctx.save();
            ctx.lineWidth = 0.6;
            for (let i = 1; i < bug.silk.length; i++) {
              const t = i / bug.silk.length;
              ctx.strokeStyle = C_BRN_A(t * 0.4 * alpha);
              ctx.beginPath();
              ctx.moveTo(bug.silk[i - 1].x, bug.silk[i - 1].y);
              ctx.lineTo(bug.silk[i].x, bug.silk[i].y);
              ctx.stroke();
            }
            ctx.restore();
          }

          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.translate(bug.x, bug.y);
          ctx.scale(scale, scale);
          ctx.rotate(bug.heading + Math.PI / 2);

          const sz = bug.bodyLength;

          /* 8 legs — DARK color */
          for (let s = -1; s <= 1; s += 2) {
            for (let li = 0; li < 4; li++) {
              const phaseOff = li % 2 === 0 ? 0 : Math.PI;
              const swing = Math.sin(bug.scuttlePhase + phaseOff) * 4;
              const spreadY = (li - 1.5) * sz * 0.42;
              const kneeX = s * sz * 0.4;
              const kneeY = spreadY;
              const endX = s * (sz * 1.0 + swing);
              const endY = spreadY + swing * 0.35;
              const midX = (kneeX + endX) * 0.5 + s * sz * 0.15;
              const midY = (kneeY + endY) * 0.5 - sz * 0.22;
              ctx.beginPath();
              ctx.moveTo(kneeX, kneeY);
              ctx.quadraticCurveTo(midX, midY, endX, endY);
              ctx.strokeStyle = C_BLK_A(0.85);
              ctx.lineWidth = 1.1;
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(endX, endY, 1.2, 0, Math.PI * 2);
              ctx.fillStyle = C_DARK;
              ctx.fill();
            }
          }

          /* Abdomen */
          ctx.beginPath();
          ctx.ellipse(0, sz * 0.35, sz * 0.55, sz * 0.68, 0, 0, Math.PI * 2);
          ctx.fillStyle = C_ORANGE;
          ctx.strokeStyle = C_BLK_A(0.9);
          ctx.lineWidth = 0.9;
          ctx.fill();
          ctx.stroke();

          for (let ri = 1; ri <= 2; ri++) {
            ctx.beginPath();
            ctx.ellipse(
              0,
              sz * 0.35,
              sz * 0.55 * (1 - ri * 0.28),
              sz * 0.68 * (1 - ri * 0.28),
              0,
              0,
              Math.PI * 2,
            );
            ctx.strokeStyle = C_BRN_A(0.25 + ri * 0.15);
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }

          /* Cephalothorax */
          ctx.beginPath();
          ctx.ellipse(0, -sz * 0.2, sz * 0.38, sz * 0.4, 0, 0, Math.PI * 2);
          ctx.fillStyle = C_ORANGE;
          ctx.strokeStyle = C_BLK_A(0.8);
          ctx.lineWidth = 0.9;
          ctx.fill();
          ctx.stroke();

          /* 8 eyes */
          const eyes = [
            [-sz * 0.22, -sz * 0.44],
            [-sz * 0.08, -sz * 0.48],
            [sz * 0.08, -sz * 0.48],
            [sz * 0.22, -sz * 0.44],
            [-sz * 0.16, -sz * 0.35],
            [-sz * 0.05, -sz * 0.38],
            [sz * 0.05, -sz * 0.38],
            [sz * 0.16, -sz * 0.35],
          ];
          eyes.forEach(([ex, ey]) => {
            ctx.beginPath();
            ctx.arc(ex, ey, 1.6, 0, Math.PI * 2);
            ctx.fillStyle = C_PARCH;
            ctx.fill();
          });

          /* Pedipalps */
          for (let s = -1; s <= 1; s += 2) {
            const sweep = Math.sin(bug.antennaPhase + s * 0.8) * 3;
            ctx.beginPath();
            ctx.moveTo(s * sz * 0.25, -sz * 0.42);
            ctx.quadraticCurveTo(
              s * (sz * 0.35 + sweep),
              -sz * 0.56,
              s * (sz * 0.3 + sweep * 1.2),
              -sz * 0.68,
            );
            ctx.strokeStyle = C_BLK_A(0.75);
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }

          ctx.restore();

          // Change 5: no background on error label, black text, slightly bigger font
          if (bug.dyingProgress === 0) {
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.font = "bold 10px monospace"; // Change 5: bigger (was 8px)
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            const labelX = bug.x;
            const labelY = bug.y - sz * 1.65;
            // Change 5: no background rect, text only, color is dark/black
            ctx.fillStyle = "#0D0C0A"; // Change 5: black text
            ctx.fillText(bug.errorLabel, labelX, labelY);
            ctx.restore();
          }

          /* Death poof */
          if (bug.dyingProgress > 0 && bug.dyingProgress < 1) {
            ctx.save();
            const p = bug.dyingProgress;
            const numParts = 8;
            for (let i = 0; i < numParts; i++) {
              const angle = (i / numParts) * Math.PI * 2;
              const dist = p * 30;
              const px2 = bug.x + Math.cos(angle) * dist;
              const py2 = bug.y + Math.sin(angle) * dist;
              ctx.beginPath();
              ctx.arc(px2, py2, (1 - p) * 4, 0, Math.PI * 2);
              ctx.fillStyle = C_ORG_A(1 - p);
              ctx.fill();
            }
            ctx.strokeStyle = C_ORANGE;
            ctx.lineWidth = 2;
            ctx.globalAlpha = Math.max(0, 1 - p * 1.5);
            const xs = 8;
            ctx.beginPath();
            ctx.moveTo(bug.x - xs, bug.y - xs);
            ctx.lineTo(bug.x + xs, bug.y + xs);
            ctx.moveTo(bug.x + xs, bug.y - xs);
            ctx.lineTo(bug.x - xs, bug.y + xs);
            ctx.stroke();
            ctx.restore();
          }
        });
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

        /* ── Morphing phase ── */
        if (phaseRef.current === "morphing") {
          if (!morphStartTime) morphStartTime = now;
          const morphElapsed = now - morphStartTime;
          const morphT = Math.min(1, morphElapsed / MORPH_DURATION);
          const ease =
            morphT < 0.5
              ? 4 * morphT * morphT * morphT
              : 1 - Math.pow(-2 * morphT + 2, 3) / 2;

          for (let i = 0, len = pixels.length; i < len; i++) {
            const px = pixels[i];
            const bug = bugsRef.current[px.bugIdx];
            if (!bug) continue;

            let offX = px.bugOffX;
            let offY = px.bugOffY;
            if (px.bugPart === "leg") {
              const legPhaseOffset = (px.legPair % 2) * Math.PI;
              const scuttle = Math.sin(bug.scuttlePhase + legPhaseOffset) * 3.5;
              offX += px.legSide * scuttle;
              offY += scuttle * 0.4;
            }
            const cosH = Math.cos(bug.heading + Math.PI / 2);
            const sinH = Math.sin(bug.heading + Math.PI / 2);
            const rotX = offX * cosH - offY * sinH;
            const rotY = offX * sinH + offY * cosH;
            const bugTargetX = bug.x + rotX;
            const bugTargetY = bug.y + rotY;

            px.currentX = px.targetX + (bugTargetX - px.targetX) * ease;
            px.currentY = px.targetY + (bugTargetY - px.targetY) * ease;

            if (morphT < 0.8) {
              const bx = Math.round(px.currentX);
              const by = Math.round(px.currentY);
              if (bx + pSize > 0 && bx < W && by + pSize > 0 && by < H) {
                const fadeAlpha = Math.round(px.a * (1 - morphT / 0.8));
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
                    buf[idx + 3] = fadeAlpha;
                  }
                }
              }
            }
            anyMoving = true;
          }

          bugsRef.current.forEach((bug) => {
            if (!bug._updatedFrame || bug._updatedFrame !== now) {
              bug._updatedFrame = now;
              bug.scuttlePhase += bug.scuttleSpeed * 0.3;
              bug.antennaPhase += bug.antennaSpeed * 0.3;
            }
          });

          ctx.putImageData(frameData, 0, 0);
          if (morphT >= 1) phaseRef.current = "bugs";
          return;
        }

        for (let i = 0, len = pixels.length; i < len; i++) {
          const px = pixels[i];
          const phase = phaseRef.current;

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
          } else if (phase === "bugs") {
            const bugs = bugsRef.current;
            const bug = bugs[px.bugIdx];
            if (bug && bug.alive) {
              if (!bug._updatedFrame || bug._updatedFrame !== now) {
                bug._updatedFrame = now;
                updateBug(bug, now);
              }
              let offX = px.bugOffX;
              let offY = px.bugOffY;
              if (px.bugPart === "leg") {
                const legPhaseOffset = (px.legPair % 2) * Math.PI;
                const scuttle =
                  Math.sin(bug.scuttlePhase + legPhaseOffset) * 3.5;
                offX += px.legSide * scuttle;
                offY += scuttle * 0.4;
              } else if (px.bugPart === "antenna") {
                const sweep =
                  Math.sin(bug.antennaPhase + px.antennaSide * 0.8) *
                  4 *
                  px.antennaT;
                offX += sweep;
                offY += Math.cos(bug.antennaPhase) * 2 * px.antennaT;
              }
              const cosH = Math.cos(bug.heading + Math.PI / 2);
              const sinH = Math.sin(bug.heading + Math.PI / 2);
              const rotX = offX * cosH - offY * sinH;
              const rotY = offX * sinH + offY * cosH;
              const bugTargetX = bug.x + rotX;
              const bugTargetY = bug.y + rotY;
              px.vx =
                (px.vx + (bugTargetX - px.currentX) * BUG_MORPH_SPRING) *
                BUG_MORPH_DAMPING;
              px.vy =
                (px.vy + (bugTargetY - px.currentY) * BUG_MORPH_SPRING) *
                BUG_MORPH_DAMPING;
              px.currentX += px.vx;
              px.currentY += px.vy;
            }
            anyMoving = true;
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
          } else {
            // Change 3: only repel on hover, never trigger bug animation from hover
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

          if (phase === "bugs") continue;

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
        if (phaseRef.current === "bugs") drawSpiders(bugsRef.current);

        if (phaseRef.current === "assembling" && !anyMoving)
          phaseRef.current = "settled";
        if (phaseRef.current === "reassembling" && !anyMoving) {
          phaseRef.current = "settled";
          bugTriggeredRef.current = false;
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
      onClick={handleClick}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        cursor: gameMode ? "none" : "default", // hide cursor in game mode (custom cursor shown)
      }}
    />
  );
});

export default PixelCanvas;
