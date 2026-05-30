import Pill from './Pill';

const VARIANT_STYLES = {
  default: 'bg-cream border-line hover:border-ink-3',
  dark: 'bg-ink text-cream border-ink',
  accent: 'bg-accent text-cream border-accent',
};

export default function SkillCard({ category, title, technologies, variant = 'default', index }) {
  const variantClass = VARIANT_STYLES[variant] || VARIANT_STYLES.default;
  const numColor = variant === 'default' ? 'text-ink-4' : 'text-white/40';
  const pillVariant = variant === 'default' ? 'default' : variant;

  return (
    <div
      className={`cursor-hover border rounded-2xl p-8 overflow-hidden relative transition-all duration-400 h-full ${variantClass}`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
    >
      <div className={`font-mono text-[10px] ${numColor} tracking-[2px] uppercase mb-5`}>
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
      <div className="font-playfair text-[80px] font-black leading-none tracking-tighter opacity-10 absolute right-6 bottom-3">
        {String(index + 1).padStart(2, '0')}
      </div>
    </div>
  );
}
