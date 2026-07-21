import { useState, useMemo } from "react";

const ARROW_BITMAP = [
    [0, 0, 0, 1, 1, 1],
    [0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 1],
    [0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0],
];

export default function PixelArrow({
    size = 18,
    idleColor = "#9C9891", // matches ink-4 muted tone
    litColor = "#FF6A00", // accent orange
    flashColor = "#FFFFFF",
    groupHover = false,
    className = "",
}) {
    const [hovered, setHovered] = useState(false);

    const pixels = useMemo(() => {
        const cells = [];
        ARROW_BITMAP.forEach((row, r) => {
            row.forEach((filled, c) => {
                if (!filled) return;
                const order = 5 - r + c;
                cells.push({ r, c, order });
            });
        });
        return cells;
    }, []);

    const maxOrder = Math.max(...pixels.map((p) => p.order));
    const cell = size / 6;

    return (
        <span
            className={`pixel-arrow-wrap inline-block align-middle ${className}`}
            style={{ width: size, height: size }}
            onMouseEnter={() => !groupHover && setHovered(true)}
            onMouseLeave={() => !groupHover && setHovered(false)}
        >
            <span
                className={`pixel-arrow-grid relative block ${groupHover ? "group-hover-active" : ""
                    } ${hovered ? "is-hovered" : ""}`}
                style={{ width: size, height: size, "--pixel-idle": idleColor, "--pixel-lit": litColor, "--pixel-flash": flashColor }}
            >
                {pixels.map(({ r, c, order }) => (
                    <span
                        key={`${r}-${c}`}
                        className="pixel-arrow-cell absolute"
                        style={{
                            width: cell - 1.5,
                            height: cell - 1.5,
                            left: c * cell,
                            top: r * cell,
                            animationDelay: `${(order / maxOrder) * 260}ms`,
                            transitionDelay: hovered ? "0ms" : `${((maxOrder - order) / maxOrder) * 120}ms`,
                        }}
                    />
                ))}
            </span>

            <style>{`
  .pixel-arrow-cell {
    background-color: var(--pixel-idle);
    transition: background-color 220ms ease, box-shadow 220ms ease;
  }

  .pixel-arrow-grid.is-hovered .pixel-arrow-cell {
    animation: pixelLightSweep 520ms ease forwards;
  }

  @keyframes pixelLightSweep {
    0% {
      background-color: var(--pixel-idle);
      box-shadow: none;
    }
    35% {
      background-color: var(--pixel-flash);
      box-shadow: 0 0 6px 1px var(--pixel-flash);
    }
    100% {
      background-color: var(--pixel-lit);
      box-shadow: 0 0 5px 0px color-mix(in srgb, var(--pixel-lit) 60%, transparent);
    }
  }

  .group:hover .pixel-arrow-grid.group-hover-active .pixel-arrow-cell {
    animation: pixelLightSweep 520ms ease forwards;
  }
  .group:not(:hover) .pixel-arrow-grid.group-hover-active .pixel-arrow-cell {
    animation: none;
    background-color: var(--pixel-idle);
    box-shadow: none;
  }
`}</style>
        </span>
    );
}