"use client";
import { AsciiArt } from "@/components/ui/ascii-art";

export default function AsciiArtMatrixDemo(props) {
  return (
    <AsciiArt
      src="https://assets.aceternity.com/avatars/manu.webp"
      resolution={80}
      color="#C84B2D"
      animationStyle="matrix"
      inverted
      animateOnView={true}
      animated={true}
      className="mx-auto aspect-square w-full max-w-lg bg-black"
      {...props}
    />
  );
}
