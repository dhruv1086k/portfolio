import { useEffect, useRef } from "react";
import anime from "animejs";
import ScrollBlurFade from "../common/ScrollBlurFade";
import SectionNumber from "../common/SectionNumber";
import FeaturedProject from "../ui/FeaturedProject";
import ProjectRow from "../ui/ProjectRow";
import { getScrollDirection } from "../../lib/scrollDirection";
import { PROJECTS } from "../../constants/data";

export default function ProjectsSection() {
  const featured = PROJECTS.find((p) => p.featured);
  const others = PROJECTS.filter((p) => !p.featured);

  const countWrapRef = useRef(null);
  const countRef = useRef(null);
  const countPlayed = useRef(false);

  // Counter counts up every time it re-enters the viewport, and
  // resets back to 00 when it leaves so it can replay.
  useEffect(() => {
    const wrap = countWrapRef.current;
    if (!wrap) return;

    const obj = { val: 0 };
    if (countRef.current) countRef.current.textContent = "00";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          anime.remove(obj);
          const scrollingDown = getScrollDirection() === "down";

          if (entry.isIntersecting) {
            if (scrollingDown) {
              obj.val = 0;
              anime({
                targets: obj,
                val: PROJECTS.length,
                duration: 1000,
                easing: "easeOutExpo",
                round: 1,
                delay: 150,
                update: () => {
                  if (countRef.current) {
                    countRef.current.textContent = String(obj.val).padStart(2, "0");
                  }
                },
              });
            } else {
              obj.val = PROJECTS.length;
              if (countRef.current) {
                countRef.current.textContent = String(PROJECTS.length).padStart(2, "0");
              }
            }
          } else if (!scrollingDown) {
            obj.val = 0;
            if (countRef.current) countRef.current.textContent = "00";
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(wrap);
    return () => {
      observer.disconnect();
      anime.remove(obj);
    };
  }, []);

  return (
    <section id="projects" className="border-b border-line">
      <div className="px-12 pt-20 pb-15 border-b border-line flex items-end justify-between max-[960px]:px-6 max-[960px]:pt-15 max-[960px]:pb-10 max-[960px]:flex-col max-[960px]:items-start max-[960px]:gap-2">
        <div>
          <ScrollBlurFade delay={0} duration={600}>
            <SectionNumber>
              <span className="font-pixelify text-[14px]">
                [04] — Selected Work · 2023–2025
              </span>
            </SectionNumber>
          </ScrollBlurFade>

          <ScrollBlurFade delay={90} duration={700} distance={22}>
            <h2
              className="font-PT-serif font-bold leading-none"
              style={{
                fontSize: "clamp(48px, 6vw, 80px)",
                letterSpacing: "-3px",
              }}
            >
              What I've
              <br />
              <em className="italic font-pixelify">built.</em>
            </h2>
          </ScrollBlurFade>
        </div>

        <ScrollBlurFade delay={160} duration={600} as="div" ref={countWrapRef}>
          <div
            ref={countWrapRef}
            className="font-mono text-[11px] text-ink-4 tracking-[2px] uppercase"
          >
            <span ref={countRef}>00</span> Projects
          </div>
        </ScrollBlurFade>
      </div>

      {featured && (
        <FeaturedProject
          title={featured.title}
          description={featured.description}
          tags={featured.tags}
          link={featured.link}
          letter={featured.letter}
          category={featured.category}
        />
      )}

      <div>
        {others.map((project, i) => (
          <ScrollBlurFade
            key={project.title}
            delay={i * 90}
            duration={600}
            distance={16}
            blur={8}
          >
            <ProjectRow
              num={project.num || String(i + 2).padStart(2, "0")}
              title={project.title}
              description={project.description}
              tags={project.tags}
              link={project.link}
            />
          </ScrollBlurFade>
        ))}
      </div>
    </section>
  );
}