export default function FeaturedProject({
  title,
  description,
  tags,
  link = "#",
  letter = "D",
  category = "",
}) {
  return (
    <div className="grid grid-cols-2 border-b border-line max-[960px]:grid-cols-1">
      {/* Visual */}
      <div className="cursor-hover bg-cream-2 border-r border-line aspect-square flex items-center justify-center overflow-hidden relative group max-[960px]:aspect-video max-[960px]:border-r-0">
        {/* Grid lines overlay */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, var(--color-cream-3) 0px, var(--color-cream-3) 1px, transparent 1px, transparent 40px)`,
          }}
        />
        <div
          className="font-playfair text-[200px] font-black text-cream-3 leading-none tracking-tighter italic transition-transform duration-600 group-hover:scale-112 group-hover:-rotate-4 max-[960px]:text-[120px]"
          style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
        >
          {letter}
        </div>
      </div>

      {/* Info */}
      <div className="p-15 flex flex-col justify-center max-[960px]:p-6 max-[960px]:py-10">
        <div className="font-pixelify text-[12px] text-ink-4 tracking-[2px] uppercase mb-5 flex items-center gap-2.5">
          <span className="inline-block w-5 h-px bg-ink-4" />
          {category}
        </div>
        <h3 className="font-playfair text-[clamp(36px,4vw,56px)] font-black tracking-tight leading-[1.05] mb-5">
          {title.split(" — ").map((part, i) =>
            i === 1 ? (
              <em key={i} className="italic text-ink-3">
                {" "}
                — {part}
              </em>
            ) : (
              <span key={i}>{part}</span>
            ),
          )}
        </h3>
        <p className="text-base font-mono text-ink-2 leading-[1.75] mb-9 font-light max-w-[520px]">
          {description}
        </p>
        <a
          href={link}
          className="cursor-hover inline-flex items-center gap-3 text-xs text-ink tracking-[1.5px] uppercase font-mono font-normal no-underline border-b border-ink pb-1 transition-all duration-200 hover:gap-5 w-fit group"
        >
          Case Study{" "}
          <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
            ↗
          </span>
        </a>
      </div>
    </div>
  );
}
