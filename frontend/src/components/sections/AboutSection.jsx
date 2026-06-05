import ScrollReveal from "../common/ScrollReveal";
import SectionNumber from "../common/SectionNumber";
import MetricCard from "../ui/MetricCard";
import SpecialtyCard from "../ui/SpecialtyCard";
import TimelineItem from "../ui/TimelineItem";
import { SITE_CONFIG, SPECIALTIES, TIMELINE } from "../../constants/data";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="grid grid-cols-[1fr_1.4fr] min-h-screen border-b border-line max-[960px]:grid-cols-1"
    >
      {/* Left Column */}
      <div className="px-12 pt-[100px] pb-20 border-r border-line flex flex-col justify-between sticky top-0 h-screen overflow-hidden max-[960px]:static max-[960px]:h-auto max-[960px]:px-6 max-[960px]:pt-15 max-[960px]:pb-10 max-[960px]:border-r-0 max-[960px]:border-b max-[960px]:border-line">
        {/* Portrait */}
        <ScrollReveal>
          <div className="cursor-hover relative flex-1 mb-10 bg-cream-2 rounded-none overflow-hidden flex items-center justify-center group max-[960px]:min-h-[280px]">
            <div
              className="font-playfair font-black text-cream-3 leading-none italic transition-transform duration-600 group-hover:scale-105 group-hover:-rotate-3"
              style={{
                fontSize: "clamp(120px, 18vw, 220px)",
                letterSpacing: "-8px",
                transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
              }}
            >
              {SITE_CONFIG.initials}
            </div>
            {/* Subtle dot-grid overlay — pixel theme accent */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                backgroundImage:
                  "radial-gradient(circle, rgba(14,13,11,0.06) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
                zIndex: 1,
              }}
            />

            <div
              className="absolute bottom-0 left-0 right-0 p-6 z-10"
              style={{
                background:
                  "linear-gradient(to top, rgba(237,233,224,0.95) 60%, transparent)",
              }}
            >
              <div className="font-playfair text-[28px] font-bold tracking-tight">
                {SITE_CONFIG.name}
              </div>
              <div className="text-[10px] text-ink-3 mt-1 font-mono tracking-[1px]">
                {SITE_CONFIG.role}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Metrics */}
        <ScrollReveal delay={0.2}>
          <div className="grid grid-cols-2 gap-px bg-line border border-line rounded-xl overflow-hidden">
            {SITE_CONFIG.metrics.map((metric) => (
              <MetricCard
                key={metric.label}
                value={metric.value}
                label={metric.label}
              />
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* Right Column */}
      <div className="px-16 pt-[100px] pb-20 flex flex-col justify-center gap-15 max-[960px]:px-6 max-[960px]:pt-15 max-[960px]:pb-15">
        {/* Bio */}
        <div>
          <SectionNumber>
            <span className="font-mono text-[10px]">[02] — About</span>
          </SectionNumber>
          <ScrollReveal>
            <h2
              className="font-playfair font-bold leading-[1.05] mb-7"
              style={{
                fontSize: "clamp(40px, 5vw, 64px)",
                letterSpacing: "-2.5px",
              }}
            >
              Passionate
              <br />
              about <em className="italic text-ink-3 font-pixelify">craft.</em>
            </h2>
          </ScrollReveal>
          {SITE_CONFIG.bio.map((paragraph, i) => (
            <ScrollReveal key={i} delay={0.1 * (i + 1)}>
              <p
                className="text-[14px] font-mono text-ink-2 leading-[1.8] font-light max-w-[540px]"
                style={{ marginTop: i > 0 ? "16px" : undefined }}
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            </ScrollReveal>
          ))}
        </div>

        {/* Specialty Cards */}
        <ScrollReveal delay={0.2}>
          <div className="grid grid-cols-2 gap-3">
            {SPECIALTIES.map((s) => (
              <SpecialtyCard key={s.title} title={s.title} sub={s.sub} />
            ))}
          </div>
        </ScrollReveal>

        {/* Timeline */}
        <ScrollReveal delay={0.3}>
          <div className="border-t border-line">
            {TIMELINE.map((item) => (
              <TimelineItem
                key={item.title}
                year={item.year}
                title={item.title}
                sub={item.sub}
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
