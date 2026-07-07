import { useEffect, useRef } from "react";
import anime from "animejs";

export default function FeaturedProject({
  title,
  description,
  tags,
  link = "https://codearena.diy/",
  letter = "CA",
  category = "",
}) {
  const wrapRef = useRef(null);
  const hasPlayed = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const parts = wrap.querySelectorAll("[data-layer]");

    // Smoother, GPU-friendly starting state
    anime.set(parts, {
      opacity: 0,
      translateY: 26,
      scale: 0.978,
      filter: "blur(14px)",
    });
    anime.set(parts, { translateZ: 0 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || hasPlayed.current) return;

          hasPlayed.current = true;

          anime.timeline({
            // Custom cubic-bezier reads as much softer / more "eased"
            // than easeOutCubic — slow, continuous deceleration with
            // no lingering snap at the end.
            easing: "cubicBezier(.16, 1, .3, 1)",
          })
            .add({
              targets: parts,
              opacity: [0, 1],
              translateY: [26, 0],
              scale: [0.978, 1],
              filter: ["blur(14px)", "blur(0px)"],
              duration: 1400,
              delay: anime.stagger(90, { start: 0 }),
            })
            .add(
              {
                targets: wrap.querySelector(".hero-plate"),
                scale: [1.02, 1],
                duration: 1500,
                easing: "cubicBezier(.16, 1, .3, 1)",
              },
              0
            )
            .add(
              {
                targets: wrap.querySelector(".hero-letter"),
                rotate: [-3, 0],
                translateX: [-10, 0],
                scale: [0.98, 1],
                duration: 1500,
                easing: "cubicBezier(.16, 1, .3, 1)",
              },
              90
            );

          observer.disconnect();
        });
      },
      { threshold: 0.22, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(wrap);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="grid grid-cols-2 border-b border-line max-[960px]:grid-cols-1"
    >
      <div className="hero-plate cursor-hover bg-cream-2 border-r border-line aspect-square flex items-center justify-center overflow-hidden relative group max-[960px]:aspect-video max-[960px]:border-r-0">
        <div
          data-layer
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, var(--color-cream-3) 0px, var(--color-cream-3) 1px, transparent 1px, transparent 40px)`,
          }}
        />
        <div
          data-layer
          className="hero-letter font-PT-serif text-[200px] font-black text-cream-3 leading-none tracking-tighter italic transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-112 group-hover:-rotate-4 max-[960px]:text-[120px]"
          style={{ willChange: "transform" }}
        >
          {letter}
        </div>
      </div>

      <div className="p-15 flex flex-col justify-center max-[960px]:p-6 max-[960px]:py-10">
        <div
          data-layer
          className="font-pixelify text-[12px] text-ink-4 tracking-[2px] uppercase mb-5 flex items-center gap-2.5"
        >
          <span className="inline-block w-5 h-px bg-ink-4" />
          {category}
        </div>

        <h3
          data-layer
          className="font-PT-serif text-[clamp(36px,4vw,56px)] font-black tracking-tight leading-[1.05] mb-5"
        >
          {title.split(" — ").map((part, i) =>
            i === 1 ? (
              <em key={i} className="italic text-ink-3">
                {" "}
                — {part}
              </em>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </h3>

        <p
          data-layer
          className="text-base font-mono text-ink-2 leading-[1.75] mb-9 font-light max-w-[520px]"
        >
          {description}
        </p>

        <a
          data-layer
          href={link}
          className="cursor-hover inline-flex items-center gap-3 text-xs text-ink tracking-[1.5px] uppercase font-mono font-normal no-underline border-b border-ink pb-1 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:gap-5 w-fit group"
        >
          Case Study{" "}
          <span className="transition-transform duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1">
            ↗
          </span>
        </a>
      </div>
    </div>
  );
}