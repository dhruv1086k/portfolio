import HeroSection from "../components/sections/HeroSection";
import AboutSection from "../components/sections/AboutSection";
import SkillsSection from "../components/sections/SkillsSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import MarqueeSection from "../components/sections/MarqueeSection";
import ExperienceSection from "../components/sections/ExperienceSection";
import ContactSection from "../components/sections/ContactSection";
import GridBackgroundDemo from "@/components/ui/grid-background-demo";

export default function HomePage() {
  return (
    <>
      <GridBackgroundDemo />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <MarqueeSection />
      <ExperienceSection />
      <ContactSection />
    </>
  );
}
