import { motion } from "framer-motion";

const EASE_REVEAL = [0.22, 1, 0.36, 1];

const VARIANT_CONFIG = {
  heading: { duration: 0.7, distance: 40 },
  card: { duration: 0.5, distance: 24 },
  text: { duration: 0.5, distance: 20 },
  default: { duration: 0.55, distance: 28 },
};

export default function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
  once = true,
  variant = "default",
}) {
  const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG.default;

  const directionMap = {
    up: { y: config.distance, x: 0 },
    down: { y: -config.distance, x: 0 },
    left: { y: 0, x: config.distance },
    right: { y: 0, x: -config.distance },
  };

  const offset = directionMap[direction] || directionMap.up;

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: config.duration,
        delay,
        ease: EASE_REVEAL,
      }}
      viewport={{ once, amount: 0.05, margin: "-60px 0px 0px 0px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
