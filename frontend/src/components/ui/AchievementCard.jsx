export default function AchievementCard({ icon, title, description }) {
  return (
    <div className="cursor-hover border border-line rounded-[14px] p-7 transition-all duration-300 hover:border-ink hover:bg-ink hover:text-cream group">
      <div className="text-[28px] mb-3">{icon}</div>
      <div className="font-playfair text-[17px] font-bold mb-1.5">{title}</div>
      <div className="text-[13px] text-ink-3 leading-relaxed transition-colors duration-300 group-hover:text-cream-3">
        {description}
      </div>
    </div>
  );
}
