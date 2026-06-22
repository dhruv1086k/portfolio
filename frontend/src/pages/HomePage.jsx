import { motion } from "framer-motion";
import HeroSection from "../components/sections/HeroSection";
import AboutSection from "../components/sections/AboutSection";
import SkillsSection from "../components/sections/SkillsSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import MarqueeSection from "../components/sections/MarqueeSection";
import ExperienceSection from "../components/sections/ExperienceSection";
import ContactSection from "../components/sections/ContactSection";
import GridBackgroundDemo from "@/components/ui/grid-background-demo";
import CurvedTextSection from "@/components/sections/CurvedTextSection";
import ScrollTextComponent from "@/components/sections/ScrollText";

export default function HomePage() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <GridBackgroundDemo />
      </motion.div>
      <HeroSection />
      <ScrollTextComponent />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <MarqueeSection />
      <ExperienceSection />
      <ContactSection />
      <CurvedTextSection />
    </>
  );
}
