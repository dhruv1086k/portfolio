import AboutSection from '../components/sections/AboutSection';
import MarqueeSection from '../components/sections/MarqueeSection';

export default function AboutPage() {
  return (
    <>
      <div className="h-20" /> {/* Spacer for fixed nav */}
      <AboutSection />
      <MarqueeSection />
    </>
  );
}
