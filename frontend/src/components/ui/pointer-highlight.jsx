"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useRef, useEffect, useState } from "react";

export function PointerHighlight({
  children,
  rectangleClassName,
  pointerClassName,
  containerClassName,
}) {
  const containerRef = useRef(null);
  const probeRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current || !probeRef.current) return;
      // Width from the container, height from the probe (true font height, no line-height)
      const { width } = containerRef.current.getBoundingClientRect();
      const { height } = probeRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    };

    const timeout = setTimeout(measure, 50);
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);

    return () => {
      clearTimeout(timeout);
      if (containerRef.current) ro.unobserve(containerRef.current);
    };
  }, []);

  const { width: boxWidth, height: boxHeight } = dimensions;

  return (
    <span
      className={cn("relative inline", containerClassName)}
      ref={containerRef}
    >
      {/* Invisible probe — same font as children, line-height:1 so height = cap-height */}
      <span
        ref={probeRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
          lineHeight: 1,
          whiteSpace: "nowrap",
          fontSize: "inherit",
          fontFamily: "inherit",
          fontWeight: "inherit",
          top: 0,
          left: 0,
        }}
      >
        Ag
      </span>

      {children}

      {boxHeight > 0 && boxWidth > 0 && (
        <motion.span
          className="pointer-events-none absolute z-0"
          style={{
            display: "block",
            // Center the box vertically over the text
            top: "50%",
            left: 0,
            translateY: "-50%",
            width: boxWidth,
            height: boxHeight,
          }}
          initial={{ opacity: 0, scale: 0.95, originX: 0, originY: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Border rectangle */}
          <motion.span
            className={cn(
              "absolute inset-0 border border-neutral-800 dark:border-neutral-200",
              rectangleClassName,
            )}
            style={{ display: "block" }}
            initial={{ width: 0, height: 0 }}
            whileInView={{ width: boxWidth, height: boxHeight }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          {/* Pointer cursor */}
          <motion.span
            className="pointer-events-none absolute"
            style={{ display: "block" }}
            initial={{ opacity: 0, x: 0, y: 0 }}
            whileInView={{
              opacity: 1,
              x: boxWidth + 4,
              y: boxHeight + 4,
            }}
            transition={{
              opacity: { duration: 0.1, ease: "easeInOut" },
              duration: 1,
              ease: "easeInOut",
            }}
          >
            <Pointer
              className={cn("h-5 w-5 text-blue-500", pointerClassName)}
              style={{ transform: "rotate(-90deg)" }}
            />
          </motion.span>
        </motion.span>
      )}
    </span>
  );
}

const Pointer = ({ style, ...props }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 16 16"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
    {...props}
  >
    <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
  </svg>
);
