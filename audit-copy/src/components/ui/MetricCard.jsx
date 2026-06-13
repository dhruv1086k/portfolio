export default function MetricCard({ value, label }) {
  return (
    <div className="bg-cream p-5">
      <div className="font-playfair text-4xl font-black tracking-tight">
        {value}
      </div>
      <div className="font-mono text-[11px] text-ink-4 tracking-[1px] uppercase mt-0.5">
        {label}
      </div>
    </div>
  );
}
