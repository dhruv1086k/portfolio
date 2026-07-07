import { useEffect, useRef } from "react";
import anime from "animejs";
import ScrollReveal from "../common/ScrollReveal";
import SectionNumber from "../common/SectionNumber";
import FeaturedProject from "../ui/FeaturedProject";
import ProjectRow from "../ui/ProjectRow";
import { PROJECTS } from "../../constants/data";

export default function ProjectsSection() {
  const featured = PROJECTS.find((p) => p.featured);
  const others = PROJECTS.filter((p) => !p.featured);

  const sectionRef = useRef(null);
  const countRef = useRef(null);
  const featuredWrapRef = useRef(null);
  const rowRefs = useRef([]);
  const hasPlayed = useRef(false);

  useEffect(() => {
    const obj = { val: 0 };
    anime({
      targets: obj,
      val: PROJECTS.length,
      duration: 1200,
      easing: "easeOutExpo",
      round: 1,
      delay: 300,
      update: () => {
        if (countRef.current) {
          countRef.current.textContent = String(obj.val).padStart(2, "0");
        }
      },
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const headerEls = section.querySelectorAll("[data-header-anim]");
    const featuredWrap = featuredWrapRef.current;
    const rowEls = rowRefs.current.filter(Boolean);

    anime.set(headerEls, {
      opacity: 0,
      translateY: 18,
      filter: "blur(10px)",
    });

    if (featuredWrap) {
      const layers = featuredWrap.querySelectorAll("[data-layer]");
      anime.set(layers, {
        opacity: 0,
        translateY: 24,
        filter: "blur(12px)",
      });
    }

    anime.set(rowEls, {
      opacity: 0,
      translateY: 16,
      filter: "blur(8px)",
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || hasPlayed.current) return;
          hasPlayed.current = true;

          const tl = anime.timeline({
            easing: "easeOutCubic",
          });

          tl.add({
            targets: headerEls,
            opacity: [0, 1],
            translateY: [18, 0],
            filter: ["blur(10px)", "blur(0px)"],
            duration: 700,
            delay: anime.stagger(90),
          });

          if (featuredWrap) {
            const layers = featuredWrap.querySelectorAll("[data-layer]");
            tl.add(
              {
                targets: layers,
                opacity: [0, 1],
                translateY: [24, 0],
                filter: ["blur(12px)", "blur(0px)"],
                duration: 850,
                delay: anime.stagger(120),
              },
              "-=260"
            );
          }

          tl.add(
            {
              targets: rowEls,
              opacity: [0, 1],
              translateY: [16, 0],
              filter: ["blur(8px)", "blur(0px)"],
              duration: 650,
              delay: anime.stagger(85),
            },
            "-=180"
          );

          observer.disconnect();
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [featured]);

  const bindRow = (i) => (el) => {
    if (!el) return;
    rowRefs.current[i] = el;

    const arrow = el.querySelector("[data-row-arrow]");
    const title = el.querySelector("[data-row-title]");

    el.onmouseenter = () => {
      anime({
        targets: el,
        paddingLeft: 24,
        duration: 350,
        easing: "easeOutCubic",
      });
      if (title) {
        anime({
          targets: title,
          translateX: 8,
          duration: 350,
          easing: "easeOutCubic",
        });
      }
      if (arrow) {
        anime({
          targets: arrow,
          translateX: 6,
          opacity: 1,
          duration: 350,
          easing: "easeOutCubic",
        });
      }
    };

    el.onmouseleave = () => {
      anime({
        targets: el,
        paddingLeft: 0,
        duration: 400,
        easing: "easeOutCubic",
      });
      if (title) {
        anime({
          targets: title,
          translateX: 0,
          duration: 400,
          easing: "easeOutCubic",
        });
      }
      if (arrow) {
        anime({
          targets: arrow,
          translateX: 0,
          opacity: 0,
          duration: 400,
          easing: "easeOutCubic",
        });
      }
    };
  };

  return (
    <section id="projects" ref={sectionRef} className="border-b border-line">
      <div className="px-12 pt-20 pb-15 border-b border-line flex items-end justify-between max-[960px]:px-6 max-[960px]:pt-15 max-[960px]:pb-10 max-[960px]:flex-col max-[960px]:items-start max-[960px]:gap-2">
        <div>
          <div data-header-anim>
            <SectionNumber>
              <span className="font-pixelify text-[14px]">
                [04] — Selected Work · 2023–2025
              </span>
            </SectionNumber>
          </div>
          <ScrollReveal>
            <h2
              data-header-anim
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
          </ScrollReveal>
        </div>
        <ScrollReveal>
          <div
            data-header-anim
            className="font-mono text-[11px] text-ink-4 tracking-[2px] uppercase"
          >
            <span ref={countRef}>00</span> Projects
          </div>
        </ScrollReveal>
      </div>

      {featured && (
        <div ref={featuredWrapRef}>
          <FeaturedProject
            title={featured.title}
            description={featured.description}
            tags={featured.tags}
            link={featured.link}
            letter={featured.letter}
            category={featured.category}
          />
        </div>
      )}

      <div>
        {others.map((project, i) => (
          <ScrollReveal key={project.title} delay={i * 0.1}>
            <div ref={bindRow(i)} className="transition-none">
              <ProjectRow
                num={project.num || String(i + 2).padStart(2, "0")}
                title={project.title}
                description={project.description}
                tags={project.tags}
                link={project.link}
              />
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}