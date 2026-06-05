export default function AchievementCard({ icon, title, description }) {
  return (
    <div className="pixel-card cursor-hover border border-line rounded-none p-7 transition-all duration-300 hover:border-ink hover:bg-ink hover:text-cream group relative overflow-hidden">
      {/* Pixel corner brackets */}
      <div className="pixel-corner-box">
        <span className="pc tl" />
        <span className="pc tr" />
        <span className="pc bl" />
        <span className="pc br" />
      </div>

      <div className="text-[28px] mb-3">{icon}</div>
      <div className="font-pixelify text-[24px] font-bold mb-1.5">{title}</div>
      <div className="text-[13px] font-mono text-ink-3 leading-relaxed transition-colors duration-300 group-hover:text-cream-3">
        {description}
      </div>
    </div>
  );
}
