import { useState, useRef, useEffect } from "react";
import anime from "animejs";

export default function GridButton({
  label = "BUTTON",
  onClick,
  href,

  cols = 10,
  cell = 22,
  gap = 4,
  side = 2,

  accentColor = "#FF6A00",
  textColor = "#000",
  bgColor = "#fff",

  fontSize = 12,
  letterSpacing = 2.5,
  fontFamily = "'Mono Space', monospace",
  fontWeight = 700,

  disabled = false,
  className = "",
  style = {},
}) {
  const [hovered, setHovered] = useState(false);
  const svgRef = useRef(null);
  const activeRef = useRef(false);

  const ROWS = 3;
  const totalW = cols * cell + (cols + 1) * gap;
  const totalH = ROWS * cell + (ROWS + 1) * gap;

  const textAreaX = gap + side * (cell + gap);
  const textAreaW = totalW - side * 2 * (cell + gap) - gap * 2;
  const textAreaY = gap + cell + gap;
  const cx = textAreaX + textAreaW / 2;
  const cy = textAreaY + cell / 2;

  const cellPositions = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < cols; c++) {
      const isMiddleRow = r === 1;
      const isSideBox = isMiddleRow && (c < side || c >= cols - side);
      if (isMiddleRow && !isSideBox) continue;
      cellPositions.push({ r, c });
    }
  }

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const boxes = svg.querySelectorAll(".gb-cell");
    const textBg = svg.querySelector(".gb-textbg");
    const label = svg.querySelector(".gb-label");

    anime.remove([boxes, textBg, label]);

    if (hovered) {
      activeRef.current = true;
      anime({
        targets: boxes,
        fill: accentColor,
        stroke: accentColor,
        duration: 300,
        easing: "easeOutQuad",
        delay: anime.stagger(18, { from: "center" }),
      });
    } else {
      activeRef.current = false;
      anime({
        targets: boxes,
        fill: "rgba(0,0,0,0)",
        stroke: textColor,
        duration: 250,
        easing: "easeOutQuad",
        delay: anime.stagger(15, { from: "center" }),
      });
      anime({
        targets: textBg,
        fill: bgColor,
        duration: 250,
        easing: "easeOutQuad",
      });
      anime({
        targets: label,
        fill: textColor,
        duration: 250,
        easing: "easeOutQuad",
      });
    }
  }, [hovered]);

  const events = disabled
    ? {}
    : {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
        onFocus: () => setHovered(true),
        onBlur: () => setHovered(false),
      };

  const svg = (
    <svg
      ref={svgRef}
      width={totalW}
      height={totalH}
      viewBox={`0 0 ${totalW} ${totalH}`}
      style={{ display: "block", verticalAlign: "top" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {cellPositions.map(({ r, c }) => (
        <rect
          key={`${r}-${c}`}
          className="gb-cell"
          x={gap + c * (cell + gap)}
          y={gap + r * (cell + gap)}
          width={cell}
          height={cell}
          fill="rgba(0,0,0,0)"
          stroke={textColor}
          strokeWidth={1.5}
        />
      ))}

      <rect
        className="gb-textbg"
        x={textAreaX}
        y={textAreaY}
        width={textAreaW}
        height={cell}
        fill={bgColor}
      />

      <text
        className="gb-label"
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fill={textColor}
        fontFamily={fontFamily}
        fontSize={fontSize}
        fontWeight={fontWeight}
        letterSpacing={letterSpacing}
      >
        {label}
      </text>
    </svg>
  );

  const base = {
    display: "inline-flex",
    alignItems: "center",
    background: "none",
    border: "none",
    padding: 0,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    userSelect: "none",
    lineHeight: 1,
    verticalAlign: "middle",
    ...style,
  };

  if (href && !disabled) {
    return (
      <a href={href} style={base} className={className} {...events}>
        {svg}
      </a>
    );
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={base}
      className={className}
      {...events}
    >
      {svg}
    </button>
  );
}
