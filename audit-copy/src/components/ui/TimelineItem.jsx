export default function TimelineItem({ year, title, sub }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-5 py-5 border-b border-line-2 max-[960px]:grid-cols-[90px_1fr]">
      <div className="font-pixelify text-sm text-ink-4 tracking-[1px] pt-0.5">
        {year}
      </div>
      <div>
        <div className="font-instrument font-mono text-[15px] font-medium text-ink mb-0.5">
          {title}
        </div>
        <div className="text-[13px] text-ink-3 font-mono">{sub}</div>
      </div>
    </div>
  );
}
