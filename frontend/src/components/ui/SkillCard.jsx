import Pill from "./Pill";

const VARIANT_STYLES = {
  default: "bg-cream border-line hover:border-ink-3",
  dark: "bg-ink text-cream border-ink",
  accent: "bg-accent text-cream border-accent",
};

export default function SkillCard({
  category,
  title,
  technologies,
  variant = "default",
  index,
}) {
  const variantClass = VARIANT_STYLES[variant] || VARIANT_STYLES.default;
  const numColor = variant === "default" ? "text-ink-4" : "text-white/40";
  const pillVariant = variant === "default" ? "default" : variant;

  return (
    /* pixel-card enables .pixel-corner-box hover reveal via CSS */
    <div
      className={`pixel-card cursor-hover border rounded-none p-8 overflow-hidden relative transition-all duration-400 h-full ${variantClass}`}
      style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
    >
      {/* Pixel corner brackets — revealed on hover via CSS */}
      <div className="pixel-corner-box">
        <span className="pc tl" />
        <span className="pc tr" />
        <span className="pc bl" />
        <span className="pc br" />
      </div>

      <div
        className={`font-pixelify text-[12px] ${numColor} tracking-[2px] uppercase mb-5`}
      >
        {category}
      </div>
      <div className="font-playfair text-[22px] font-bold tracking-tight mb-5 leading-snug">
        {title}
      </div>
      <div className="flex flex-wrap gap-[7px]">
        {technologies.map((tech) => (
          <Pill key={tech} variant={pillVariant}>
            {tech}
          </Pill>
        ))}
      </div>

      {/* Large background index number with pixelFlicker animation */}
      <div
        className="font-playfair text-[80px] font-black leading-none tracking-tighter absolute right-6 bottom-3"
        style={{
          opacity: 0.08,
          animation: "pixelFlicker 6s ease-in-out infinite",
          animationDelay: `${index * 0.9}s`,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>
    </div>
  );
}
