import { Link, useLocation } from "react-router-dom";
import PixelButton from "../ui/PixelButton";

const NAV_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Work", href: "/#projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const handleNavClick = (e, href) => {
    if (isHome && href.startsWith("/#")) {
      e.preventDefault();
      const id = href.replace("/#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-100 flex items-center justify-between px-12 py-7 mix-blend-multiply max-[960px]:px-6 max-[960px]:py-5">
      <Link
        to="/"
        className="font-playfair text-lg font-bold text-ink no-underline tracking-tight"
      >
        <img className="w-16" src="/public/logo.png" alt="" />
      </Link>

      <div className="flex items-center gap-9">
        <ul className="flex gap-8 list-none max-[960px]:hidden">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-xs text-ink-3 no-underline tracking-[1.5px] uppercase font-normal transition-colors duration-250 hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <PixelButton
          href="#projects"
          pixelSize={6}
          bgColor="#C4501A"
          textColor="#0D0C0A"
        >
          RESUME
        </PixelButton>
      </div>
    </nav>
  );
}
