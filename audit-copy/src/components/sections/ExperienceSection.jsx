import ScrollReveal from "../common/ScrollReveal";
import SectionNumber from "../common/SectionNumber";
import ExperienceItem from "../ui/ExperienceItem";
import AchievementCard from "../ui/AchievementCard";
import { EXPERIENCES, ACHIEVEMENTS } from "../../constants/data";

export default function ExperienceSection() {
  return (
    <section id="experience" className="border-b border-line">
      {/* Header */}
      <div className="px-12 pt-20 pb-15 border-b border-line max-[960px]:px-6 max-[960px]:pt-15 max-[960px]:pb-10">
        <SectionNumber>
          <span className="font-pixelify text-[12px]">
            [05] — Experience & Achievements
          </span>
        </SectionNumber>
        <ScrollReveal>
          <h2
            className="font-playfair font-bold leading-none"
            style={{
              fontSize: "clamp(48px, 6vw, 80px)",
              letterSpacing: "-3px",
            }}
          >
            The journey
            <br />
            so <em className="italic font-pixelify">far.</em>
          </h2>
        </ScrollReveal>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 border-t border-line max-[960px]:grid-cols-1">
        {/* Experience List */}
        <div className="border-r border-line max-[960px]:border-r-0">
          {EXPERIENCES.map((exp, i) => (
            <ScrollReveal key={exp.role + exp.company} delay={i * 0.1}>
              <ExperienceItem
                period={exp.period}
                role={exp.role}
                company={exp.company}
                description={exp.description}
              />
            </ScrollReveal>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="p-12 grid grid-cols-2 gap-4 content-start max-[960px]:p-6">
          {ACHIEVEMENTS.map((ach, i) => (
            <ScrollReveal key={ach.title} delay={(i + 1) * 0.1}>
              <AchievementCard
                icon={ach.icon}
                title={ach.title}
                description={ach.description}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
