import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div
        className="font-playfair font-black text-cream-3 leading-none mb-6"
        style={{ fontSize: 'clamp(120px, 20vw, 300px)', letterSpacing: '-8px' }}
      >
        404
      </div>
      <h1 className="font-playfair text-4xl font-black tracking-tight mb-4">
        Page not <em className="italic text-ink-3">found.</em>
      </h1>
      <p className="text-ink-3 text-base font-light mb-10 max-w-md">
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <Link
        to="/"
        className="cursor-hover inline-flex items-center gap-3 bg-ink text-cream no-underline text-[13px] tracking-[1px] uppercase px-8 py-4 rounded-full font-instrument font-normal transition-all duration-300 hover:bg-accent"
      >
        ← Back Home
      </Link>
    </section>
  );
}
