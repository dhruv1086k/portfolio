import ScrollReveal from "../common/ScrollReveal";
import SectionNumber from "../common/SectionNumber";
import SkillCard from "../ui/SkillCard";
import { SKILLS } from "../../constants/data";

export default function SkillsSection() {
  return (
    <section
      id="skills"
      className="border-b border-line px-12 py-[100px] max-[960px]:px-6 max-[960px]:py-15"
    >
      {/* Header */}
      <div className="flex items-end justify-between mb-20 max-[960px]:flex-col max-[960px]:items-start max-[960px]:gap-4">
        <div>
          <SectionNumber>
            <span className="font-mono text-[12px]">[03] — Stack</span>
          </SectionNumber>
          <ScrollReveal variant="heading">
            <h2
              className="font-playfair font-bold leading-none"
              style={{
                fontSize: "clamp(48px, 6vw, 80px)",
                letterSpacing: "-3px",
              }}
            >
              Tools I<br />
              <em className="italic text-accent font-pixelify">master</em>
              <br />
              daily.
            </h2>
          </ScrollReveal>
        </div>
        <ScrollReveal delay={0.15} variant="text">
          <p className="font-mono max-w-[340px] text-sm text-ink-3 leading-[1.7]">
            From pixel-perfect interfaces to scalable back-end systems — a
            modern, focused toolkit for building exceptional products.
          </p>
        </ScrollReveal>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-3 max-[960px]:grid-cols-1">
        {SKILLS.map((skill, i) => {
          const spanMap = {
            5: "col-span-5",
            7: "col-span-7",
            4: "col-span-4",
            8: "col-span-8",
          };
          const spanClass = `${spanMap[skill.gridSpan] || "col-span-4"} max-[960px]:col-span-1`;
          return (
            <ScrollReveal
              key={skill.category}
              delay={i * 0.08}
              variant="card"
              className={spanClass}
            >
              <SkillCard
                category={skill.category}
                title={skill.title}
                technologies={skill.technologies}
                variant={skill.variant}
                gridSpan={skill.gridSpan}
                index={i}
              />
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
