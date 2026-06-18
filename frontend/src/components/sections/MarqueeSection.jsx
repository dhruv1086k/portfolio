import { ROW_1, ROW_2 } from "@/constants/data";
import ScrollVelocity from "../ui/ScrollVelocity";

export default function MarqueeSection() {
  return (
    <div id="marquee" className="overflow-hidden border-b border-line bg-cream">
      <ScrollVelocity
        texts={[ROW_1, ROW_2]}
        velocity={100}
        className="custom-scroll-text"
        numCopies={6}
        damping={50}
        stiffness={400}
      />
    </div>
  );
}
