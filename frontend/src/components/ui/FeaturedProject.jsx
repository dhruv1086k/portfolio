import ScrollBlurFade from "../common/ScrollBlurFade";

export default function FeaturedProject({
  title,
  description,
  tags,
  link = "https://codearena.diy/",
  image = "/codeArenaThumbnail.png",
  letter = "CA",
  category = "",
}) {
  return (
    <div className="grid grid-cols-2 border-b border-line max-[960px]:grid-cols-1">
      <div className="cursor-hover bg-cream-2 border-r border-line aspect-square flex items-center justify-center overflow-hidden relative group max-[960px]:aspect-video max-[960px]:border-r-0">
        <ScrollBlurFade
          delay={0}
          duration={900}
          blur={12}
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, var(--color-cream-3) 0px, var(--color-cream-3) 1px, transparent 1px, transparent 40px)`,
          }}
        />

        {image ? (
          <ScrollBlurFade
            delay={90}
            duration={900}
            blur={14}
            className="absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108"
            style={{ willChange: "transform" }}
          >
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </ScrollBlurFade>
        ) : (
          <ScrollBlurFade
            delay={90}
            duration={900}
            blur={14}
            className="font-PT-serif text-[200px] font-black text-cream-3 leading-none tracking-tighter italic transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-112 group-hover:-rotate-4 max-[960px]:text-[120px]"
            style={{ willChange: "transform" }}
          >
            {letter}
          </ScrollBlurFade>
        )}
      </div>

      <div className="p-15 flex flex-col justify-center max-[960px]:p-6 max-[960px]:py-10">
        <ScrollBlurFade
          delay={150}
          duration={650}
          className="font-pixelify text-[12px] text-ink-4 tracking-[2px] uppercase mb-5 flex items-center gap-2.5"
        >
          <span className="inline-block w-5 h-px bg-ink-4" />
          {category}
        </ScrollBlurFade>

        <ScrollBlurFade
          as="h3"
          delay={220}
          duration={700}
          distance={22}
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
        </ScrollBlurFade>

        <ScrollBlurFade
          as="p"
          delay={290}
          duration={650}
          className="text-base font-mono text-ink-2 leading-[1.75] mb-9 font-light max-w-[520px]"
        >
          {description}
        </ScrollBlurFade>

        <ScrollBlurFade
          as="a"
          delay={360}
          duration={650}
          href={link}
          className="cursor-hover inline-flex items-center gap-3 text-xs text-ink tracking-[1.5px] uppercase font-mono font-normal no-underline border-b border-ink pb-1 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:gap-5 w-fit group"
        >
          Case Study{" "}
          <span className="transition-transform duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1">
            ↗
          </span>
        </ScrollBlurFade>
      </div>
    </div>
  );
}