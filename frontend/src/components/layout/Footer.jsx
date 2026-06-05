import { SITE_CONFIG } from "../../constants/data";

export default function Footer() {
  return (
    <footer className="px-12 py-8 border-t border-line flex items-center justify-between bg-cream max-[960px]:px-6 max-[960px]:py-6 max-[960px]:flex-col max-[960px]:gap-2 max-[960px]:text-center">
      <div className="font-pixelify text-[12px] text-ink-4 tracking-[1px] uppercase">
        © {new Date().getFullYear()} {SITE_CONFIG.name} — All rights reserved
      </div>
      <div className="font-pixelify text-[12px] text-ink-4 tracking-[1px] flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-success animate-blink" />
        Available for opportunities
      </div>
    </footer>
  );
}
