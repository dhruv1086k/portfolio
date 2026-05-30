export default function Pill({ children, variant = 'default' }) {
  const variants = {
    default:
      'border-line bg-cream-2 text-ink-2 hover:bg-ink hover:text-cream hover:border-ink',
    dark:
      'border-white/15 bg-white/8 text-cream-2 hover:bg-white/20',
    accent:
      'border-white/30 bg-white/15 text-white',
  };

  return (
    <span
      className={`cursor-hover text-xs px-3.5 py-1.5 rounded-full border font-mono tracking-[0.3px] transition-all duration-250 ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
