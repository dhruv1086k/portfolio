import ScrollReveal from "../common/ScrollReveal";
import SpecialtyCard from "../ui/SpecialtyCard";
import { SITE_CONFIG, SPECIALTIES } from "../../constants/data";
import Shuffle from "../ui/ShuffleText";
import { useEffect, useRef } from "react";
import LanyardCard from "../ui/Lanyard";
import BlurText from "../ui/BlurText";
import ScrollRevealBits from "../ui/ScrollRevealBits";
import { PointerHighlight } from "../ui/pointer-highlight";

export default function AboutSection() {
  const portraitRef = useRef(null);

  useEffect(() => {
    const el = portraitRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowLanyard(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      className="grid grid-cols-[1fr_1.4fr] min-h-screen bg-[#F5F2EC] border-b border-line max-[960px]:grid-cols-1"
    >
      {/* Left Column */}
      <div className="px-12 pt-10 pb-20 border-r border-line flex flex-col justify-center sticky top-0 h-screen overflow-hidden max-[960px]:static max-[960px]:h-auto max-[960px]:px-6 max-[960px]:pt-2 max-[960px]:pb-10 max-[960px]:border-r-0 max-[960px]:border-b max-[960px]:border-line">
        {/* Lanyard */}
        <LanyardCard />
      </div>

      {/* Right Column */}
      <div className="px-16 pt-[100px] pb-20 flex flex-col gap-15 max-[960px]:px-6 max-[960px]:pt-15 max-[960px]:pb-15">
        {/* Bio */}
        <div>
          <ScrollReveal variant="heading">
            <h2
              className="font-PT-serif font-bold leading-[1.05] mb-7"
              style={{
                fontSize: "clamp(40px, 5vw, 64px)",
                letterSpacing: "-2.5px",
              }}
            >
              <BlurText
                text="Passionate"
                animateBy="words"
                direction="top"
                delay={100}
                className="font-PT-serif font-bold leading-[1.05] inline"
              />
              <br />
              <BlurText
                text="about "
                animateBy="words"
                direction="top"
                delay={200}
                className="font-PT-serif font-bold leading-[1.05] inline"
              />{" "}
              <Shuffle
                tag="em"
                text="craft."
                className="text-accent font-pixelify not-italic"
                style={{ fontSize: "4rem" }}
                shuffleDirection="right"
                duration={0.35}
                animationMode="evenodd"
                shuffleTimes={1}
                ease="power3.out"
                stagger={0.03}
                threshold={0.1}
                triggerOnce={false}
                triggerOnHover
                respectReducedMotion={true}
                loop={false}
                loopDelay={0}
              />
            </h2>
          </ScrollReveal>
          {SITE_CONFIG.bio.map((paragraph, i) => (
            <div
              key={i}
              className="text-[14px] font-mono text-ink-2 leading-[1.8] font-light max-w-[620px]"
              style={{ marginTop: i > 0 ? "16px" : undefined }}
            >
              <ScrollRevealBits
                baseOpacity={0.1}
                enableBlur
                baseRotation={3}
                blurStrength={4}
              >
                I'm Dhruv Pal, a{" "}
                <PointerHighlight
                  rectangleClassName="bg-orange-100 dark:bg-orange-900 border-orange-300 dark:border-orange-700"
                  pointerClassName="text-orange-500 h-3 w-3"
                  containerClassName="inline-block ml-1"
                >
                  <span className="relative z-50">full-stack developer</span>
                </PointerHighlight>{" "}
                who enjoys building modern web applications. I focus on
                performance, user experience, and clean code. I love creating
                products that solve real problems, from backend systems to
                polished interfaces.
                {/* <div className="mx-auto max-w-lg py-20 text-2xl font-bold tracking-tight md:text-xl"></div> */}
              </ScrollRevealBits>
            </div>
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
      </div>
    </section>
  );
}
