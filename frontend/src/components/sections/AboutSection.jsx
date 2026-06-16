import ScrollReveal from "../common/ScrollReveal";
import SectionNumber from "../common/SectionNumber";
import MetricCard from "../ui/MetricCard";
import SpecialtyCard from "../ui/SpecialtyCard";
import TimelineItem from "../ui/TimelineItem";
import { SITE_CONFIG, SPECIALTIES, TIMELINE } from "../../constants/data";
import { CometCard } from "../ui/comet-card";
import CometCardDemo from "../ui/comet-card-demo";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="grid grid-cols-[1fr_1.4fr] min-h-screen bg-[#F5F2EC] border-b border-line max-[960px]:grid-cols-1"
    >
      {/* Left Column */}
      <div className="px-12 pt-10 pb-20 border-r border-line flex flex-col justify-center sticky top-0 h-screen overflow-hidden max-[960px]:static max-[960px]:h-auto max-[960px]:px-6 max-[960px]:pt-15 max-[960px]:pb-10 max-[960px]:border-r-0 max-[960px]:border-b max-[960px]:border-line">
        {/* Portrait */}
        <ScrollReveal>
          <div className="cursor-hover relative flex-1 mb-10 rounded-none flex items-center justify-center group max-[960px]:min-h-[280px]">
            <CometCardDemo />
          </div>
        </ScrollReveal>
      </div>

      {/* Right Column */}
      <div className="px-16 pt-[100px] pb-20 flex flex-col gap-15 max-[960px]:px-6 max-[960px]:pt-15 max-[960px]:pb-15">
        {/* Bio */}
        <div>
          <SectionNumber>
            <span className="font-mono text-[10px]">[02] — About</span>
          </SectionNumber>
          <ScrollReveal variant="heading">
            <h2
              className="font-PT-serif font-bold leading-[1.05] mb-7"
              style={{
                fontSize: "clamp(40px, 5vw, 64px)",
                letterSpacing: "-2.5px",
              }}
            >
              Passionate
              <br />
              about <em className="italic text-accent font-pixelify">craft.</em>
            </h2>
          </ScrollReveal>
          {SITE_CONFIG.bio.map((paragraph, i) => (
            <ScrollReveal key={i} delay={0.08 * (i + 1)} variant="text">
              <p
                className="text-[14px] font-mono text-ink-2 leading-[1.8] font-light max-w-[540px]"
                style={{ marginTop: i > 0 ? "16px" : undefined }}
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            </ScrollReveal>
          ))}
        </div>

        {/* Specialty Cards */}
        <ScrollReveal delay={0.15} variant="card">
          <div className="grid grid-cols-2 gap-3">
            {SPECIALTIES.map((s) => (
              <SpecialtyCard key={s.title} title={s.title} sub={s.sub} />
            ))}
          </div>
        </ScrollReveal>

        {/* Timeline */}
        <ScrollReveal delay={0.2} variant="card">
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
