export default function SpecialtyCard({ title, sub }) {
  return (
    <div className="cursor-hover border border-line rounded-[14px] p-6 bg-cream transition-all duration-350 hover:bg-ink hover:text-cream hover:-translate-y-0.5 hover:border-ink group">
      <div className="font-playfair text-lg font-bold tracking-tight mb-1">
        {title}
      </div>
      <div className="text-xs text-ink-3 font-mono tracking-[0.5px] transition-colors duration-350 group-hover:text-cream-3">
        {sub}
      </div>
    </div>
  );
}
