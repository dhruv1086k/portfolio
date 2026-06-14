import ScrollReveal from "../common/ScrollReveal";
import SectionNumber from "../common/SectionNumber";
import FeaturedProject from "../ui/FeaturedProject";
import ProjectRow from "../ui/ProjectRow";
import { PROJECTS } from "../../constants/data";

export default function ProjectsSection() {
  const featured = PROJECTS.find((p) => p.featured);
  const others = PROJECTS.filter((p) => !p.featured);

  return (
    <section id="projects" className="border-b border-line">
      {/* Header */}
      <div className="px-12 pt-20 pb-15 border-b border-line flex items-end justify-between max-[960px]:px-6 max-[960px]:pt-15 max-[960px]:pb-10 max-[960px]:flex-col max-[960px]:items-start max-[960px]:gap-2">
        <div>
          <SectionNumber>
            <span className="font-pixelify text-[14px]">
              [04] — Selected Work · 2023–2025
            </span>
          </SectionNumber>
          <ScrollReveal variant="heading">
            <h2
              className="font-playfair font-bold leading-none"
              style={{
                fontSize: "clamp(48px, 6vw, 80px)",
                letterSpacing: "-3px",
              }}
            >
              What I've
              <br />
              <em className="italic font-pixelify">built.</em>
            </h2>
          </ScrollReveal>
        </div>
        <ScrollReveal>
          <div className="font-mono text-[11px] text-ink-4 tracking-[2px] uppercase">
            {String(PROJECTS.length).padStart(2, "0")} Projects
          </div>
        </ScrollReveal>
      </div>

      {/* Featured Project */}
      {featured && (
        <ScrollReveal>
          <FeaturedProject
            title={featured.title}
            description={featured.description}
            tags={featured.tags}
            link={featured.link}
            letter={featured.letter}
            category={featured.category}
          />
        </ScrollReveal>
      )}

      {/* Project List */}
      <div>
        {others.map((project, i) => (
          <ScrollReveal key={project.title} delay={i * 0.08} variant="card">
            <ProjectRow
              num={project.num || String(i + 2).padStart(2, "0")}
              title={project.title}
              description={project.description}
              tags={project.tags}
              link={project.link}
            />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
