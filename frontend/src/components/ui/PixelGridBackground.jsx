/* ─────────────────────────────────────────────────────────────────────────
   PixelGridBackground
   Renders a subtle fixed dot-grid overlay across the entire viewport.
   Pure CSS — no JS overhead. pointer-events: none so it's invisible to
   interaction. Adds a "pixel paper" feel to every page.
   ───────────────────────────────────────────────────────────────────────── */

export default function PixelGridBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position:        'fixed',
        inset:           0,
        pointerEvents:   'none',
        zIndex:          0,
        backgroundImage: 'radial-gradient(circle, rgba(14,13,11,0.045) 1px, transparent 1px)',
        backgroundSize:  '20px 20px',
      }}
    />
  );
}
