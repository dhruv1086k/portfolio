"use client";

import { Link } from "react-router-dom";
import GridLogo from "../ui/GridLogo";
import PixelChipButton from "../ui/pixel-chip-button"
import Profile from "../ui/Profile";
import PixelDivider from "../ui/GridDivider";

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
          <div className="">
            <Profile />
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

          <PixelChipButton
            label="SEND A MESSAGE"
            href="#"
            cols={14}
            cell={11}
            fontSize={12}
            accentColor="#FF6A00"
            textColor="#fff"
            bgColor="#1A1815"
          />
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
          <div className="hidden md:flex mt-10 justify-center lg:justify-end">
            <PixelDivider />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[rgba(240,235,224,0.08)] mb-2" />

      {/* Bottom bar */}
      <div className="flex items-center justify-between gap-6 max-[768px]:flex-col max-[768px]:gap-4 py-3">
        <Link
          to="/"
          className="flex items-center no-underline"
        >
          <GridLogo SQ={10} GAP={2} />
        </Link>

        <p className="font-pixelify text-[13px] tracking-[1.5px] uppercase text-[rgba(240,235,224,0.25)]">
          © {new Date().getFullYear()} Dhruv Pal — All rights reserved
        </p>
      </div>
    </footer >
  );
}
