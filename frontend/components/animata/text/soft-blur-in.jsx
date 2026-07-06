"use client";;
import { useMemo } from "react";

import TextAnimator from "./text-animator";

const BASE_SPEC = {
  id: "soft-blur-in",
  target: "per-character",
  enter: {
    durationMs: 900,
    staggerMs: 25,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    from: {
      opacity: 0,
      yPx: 16,
      blurPx: 12,
    },
    to: {
      opacity: 1,
      yPx: 0,
      blurPx: 0,
    },
  },
  exit: {
    durationMs: 600,
    staggerMs: 15,
    easing: "cubic-bezier(0.64, 0, 0.78, 0)",
    from: {
      opacity: 1,
      yPx: 0,
      blurPx: 0,
    },
    to: {
      opacity: 0,
      yPx: -16,
      blurPx: 12,
    },
  },
  swap: {
    mode: "sequential",
  },
};

const DEFAULT_SAMPLES = [
  "Coming into focus.",
  "Edges sharpen up.",
  "Letters land softly.",
];

export default function SoftBlurIn({
  text,
  enter,
  exit,
  speed,
  holdMs,
  gapMs,
  yTravel,
  className
} = {}) {
  const spec = useMemo(() => ({
    ...BASE_SPEC,
    enter: {
      ...BASE_SPEC.enter,
      ...enter,
      from: { ...BASE_SPEC.enter.from, ...enter?.from },
      to: { ...BASE_SPEC.enter.to, ...enter?.to },
    },
    exit: {
      ...BASE_SPEC.exit,
      ...exit,
      from: { ...BASE_SPEC.exit.from, ...exit?.from },
      to: { ...BASE_SPEC.exit.to, ...exit?.to },
    },
  }), [enter, exit]);
  const samples = useMemo(() => {
    if (text == null) return [...DEFAULT_SAMPLES];
    return Array.isArray(text) ? text : [text];
  }, [text]);
  return (
    <TextAnimator
      spec={spec}
      samples={samples}
      speed={speed}
      holdMs={holdMs}
      gapMs={gapMs}
      yTravel={yTravel}
      className={className} />
  );
}
