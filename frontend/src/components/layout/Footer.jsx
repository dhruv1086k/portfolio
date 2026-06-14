"use client";
import AsciiArtMatrixDemo from "@/components/ui/ascii-art-demo-matrix";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#1a1815] text-[#f0ebe0] px-16 pt-20 pb-2 max-[768px]:px-6 max-[768px]:pt-12">
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #C84B2D 30%, #C84B2D 70%, transparent)",
        }}
      />

      {/* Main grid */}
      <div className="grid grid-cols-2 gap-20 mb-20 max-[768px]:grid-cols-1 max-[768px]:gap-12">
        {/* Left — CTA */}
        <div>
          <div className="flex items-center gap-2 font-pixelify text-[11px] tracking-[2.5px] uppercase text-[#C84B2D] mb-6">
            <span className="inline-block w-5 h-px bg-[#C84B2D]" />
            Open to work
          </div>
          {/* ASCII Art portrait — replaces DP watermark */}
          <div className="mt-12 max-w-[150px]">
            <AsciiArtMatrixDemo
              src="/public/logo.png"
              resolution={80}
              color="#C84B2D"
              animationStyle="matrix"
              animationDuration={1.5}
              animateOnView={false}
              className="aspect-square w-full bg-transparent"
            />
          </div>

          <h2
            className="font-pixelify font-bold text-[#f0ebe0] my-8"
            style={{
              fontSize: "clamp(48px, 6vw, 72px)",
              lineHeight: 0.9,
              letterSpacing: "-2px",
            }}
          >
            Let's build
            <br />
            some<span className="text-[#C84B2D]">thing</span>
            <br />
            great.
          </h2>

          <a
            href="mailto:dhruvpal@example.com"
            className="inline-flex items-center gap-3 bg-[#C84B2D] text-[#f0ebe0] font-pixelify text-[13px] tracking-[1.5px] uppercase px-8 py-4 transition-all hover:bg-[#a33a20] hover:-translate-y-px"
          >
            Send a message
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 12L12 2M12 2H5M12 2V9"
                stroke="#f0ebe0"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
          </a>
        </div>

        {/* Right — Nav + status */}
        <div className="flex flex-col justify-between gap-10">
          <div className="grid grid-cols-2 gap-x-8 gap-y-12">
            {[
              {
                title: "Navigate",
                links: ["About", "Work", "Skills", "Blog"],
              },
              {
                title: "Connect",
                links: ["GitHub", "LinkedIn", "Twitter / X", "Resume"],
              },
              {
                title: "Projects",
                links: ["Debatable", "ImageZen", "Alumni Portal"],
              },
              {
                title: "Community",
                links: ["ALFA Coding Club", "BCA Network", "Mentorship"],
              },
            ].map(({ title, links }) => (
              <div key={title}>
                <p className="font-pixelify text-[10px] tracking-[2px] uppercase text-[rgba(240,235,224,0.35)] mb-4">
                  {title}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="group flex items-center gap-1.5 text-[14px] text-[rgba(240,235,224,0.7)] hover:text-[#f0ebe0] transition-colors"
                      >
                        <span className="inline-block w-0 group-hover:w-3 h-px bg-[#C84B2D] transition-all duration-200" />
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Status badge */}
          <div
            className="flex items-center gap-2.5 w-fit px-5 py-3.5"
            style={{ border: "1px solid rgba(200,75,45,0.25)" }}
          >
            <span
              className="w-[7px] h-[7px] rounded-full bg-green-400"
              style={{ animation: "blink 2s ease-in-out infinite" }}
            />
            <span className="font-pixelify text-[11px] tracking-[1.5px] uppercase text-[rgba(240,235,224,0.6)]">
              Available for opportunities
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[rgba(240,235,224,0.08)] mb-2" />

      {/* Bottom bar */}
      <div className="flex items-center justify-between gap-6 flex-wrap">
        <div className="font-pixelify text-[22px] font-bold text-[#f0ebe0]">
          D<span className="text-[#C84B2D]">.</span>PAL
        </div>

        <div className="flex items-center gap-1">
          {[
            {
              label: "GitHub",
              href: "https://github.com",
              svg: (
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              ),
            },
            {
              label: "LinkedIn",
              href: "https://linkedin.com",
              svg: (
                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
              ),
            },
            {
              label: "Twitter",
              href: "https://x.com",
              svg: (
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
              ),
            },
          ].map(({ label, href, svg }) => (
            <a
              key={label}
              href={href}
              title={label}
              className="flex items-center justify-center w-[38px] h-[38px] rounded-sm text-[rgba(240,235,224,0.5)] hover:text-[#f0ebe0] hover:bg-[rgba(240,235,224,0.06)] transition-all"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                {svg}
              </svg>
            </a>
          ))}
        </div>

        <p className="font-pixelify text-[11px] tracking-[1.5px] uppercase text-[rgba(240,235,224,0.25)]">
          © {new Date().getFullYear()} Dhruv Pal — All rights reserved
        </p>
      </div>

    </footer>
  );
}
