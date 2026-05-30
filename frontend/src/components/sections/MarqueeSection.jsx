import { MARQUEE_ROW_1, MARQUEE_ROW_2 } from '../../constants/data';

function MarqueeTrack({ words, reverse = false }) {
  const styles = ['font-bold text-cream-3', 'font-bold text-ink', 'font-bold italic text-cream-3'];

  const items = words.map((word, i) => (
    <div key={i} className="inline-flex items-center gap-6 px-6">
      <span
        className={`font-playfair whitespace-nowrap ${styles[i % styles.length]}`}
        style={{ fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-1.5px' }}
      >
        {word}
      </span>
      <span className="w-1.5 h-1.5 bg-line rounded-full shrink-0" />
    </div>
  ));

  return (
    <div
      className={`flex whitespace-nowrap py-7 border-b border-line-2 ${reverse ? 'bg-cream-2' : 'bg-cream'}`}
    >
      <div
        className="flex"
        style={{
          animation: reverse
            ? 'marquee 22s linear infinite reverse'
            : 'marquee 30s linear infinite',
        }}
      >
        {items}
        {items}
      </div>
    </div>
  );
}

export default function MarqueeSection() {
  return (
    <div id="marquee" className="overflow-hidden border-b border-line bg-cream">
      <MarqueeTrack words={MARQUEE_ROW_1} />
      <MarqueeTrack words={MARQUEE_ROW_2} reverse />
    </div>
  );
}
