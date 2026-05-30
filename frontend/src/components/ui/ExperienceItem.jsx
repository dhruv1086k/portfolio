export default function ExperienceItem({ period, role, company, description }) {
  return (
    <div className="cursor-hover group px-12 py-10 border-b border-line-2 transition-colors duration-250 relative max-[960px]:px-6 max-[960px]:py-8 hover:bg-cream-2">
      {/* Accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent origin-bottom scale-y-0 transition-transform duration-400 group-hover:scale-y-100"
        style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
      />
      <div className="font-mono text-[11px] text-ink-4 tracking-[1.5px] uppercase mb-2.5">
        {period}
      </div>
      <div className="font-playfair text-[26px] font-bold tracking-tight mb-1">
        {role}
      </div>
      <div className="text-[13px] text-accent font-normal mb-3.5 tracking-[0.3px]">
        {company}
      </div>
      <div className="text-sm text-ink-2 leading-[1.7] font-light">{description}</div>
    </div>
  );
}
