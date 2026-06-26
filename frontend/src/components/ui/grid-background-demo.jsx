import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useMotionValue, useSpring, motion } from "framer-motion";

export default function GridBackgroundDemo() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = currentTarget.getBoundingClientRect();
    // Map cursor to -20/+20px offset range
    mouseX.set((clientX / width - 0.5) * 40);
    mouseY.set((clientY / height - 0.5) * 40);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      className="absolute -z-[999] flex h-screen w-full items-center justify-center bg-white dark:bg-black"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Grid layer — shifts with cursor */}
      <motion.div
        className={cn(
          "absolute inset-[-40px]",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
        style={{ x: springX, y: springY }}
      />
      {/* Radial fade mask — stays fixed */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />
    </div>
  );
}
