export default function Tag({ children }) {
  return (
    <span className="cursor-hover text-[11px] tracking-[1.5px] uppercase text-ink-3 border border-line px-4 py-2 rounded-full font-mono font-light transition-all duration-300 hover:text-ink hover:border-ink">
      {children}
    </span>
  );
}
