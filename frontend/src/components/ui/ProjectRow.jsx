import { useState } from 'react';

export default function ProjectRow({ num, title, description, tags = [], link = '#' }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={link}
      className="cursor-hover grid grid-cols-[80px_1fr_1fr_120px] items-center px-12 py-8 border-b border-line-2 transition-all duration-250 no-underline text-ink gap-6 max-[960px]:grid-cols-[60px_1fr] max-[960px]:px-6 max-[960px]:py-6"
      style={{ background: hovered ? 'var(--color-cream-2)' : undefined, paddingLeft: hovered ? '56px' : undefined }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="font-mono text-xs text-ink-4 tracking-[1px]">{num}</div>
      <div>
        <div className="font-playfair text-[28px] font-bold tracking-tight max-[960px]:text-xl">
          {title}
        </div>
        <div className="text-sm text-ink-3 leading-relaxed mt-1 max-w-[320px]">
          {description}
        </div>
      </div>
      <div className="flex gap-2 flex-wrap max-[960px]:hidden">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] text-ink-3 border border-line px-3 py-1 rounded-full font-mono"
          >
            {tag}
          </span>
        ))}
      </div>
      <div
        className="text-lg text-ink-3 text-right transition-transform duration-300 max-[960px]:hidden"
        style={{ transform: hovered ? 'translate(4px, -4px)' : 'none' }}
      >
        ↗
      </div>
    </a>
  );
}
