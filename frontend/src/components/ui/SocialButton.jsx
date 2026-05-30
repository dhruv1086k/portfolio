export default function SocialButton({ platform, url }) {
  return (
    <a
      href={url}
      target={url.startsWith('mailto:') ? undefined : '_blank'}
      rel="noopener noreferrer"
      className="cursor-hover text-xs text-ink-2 border border-line px-5 py-2.5 rounded-full no-underline font-mono tracking-[1px] uppercase transition-all duration-300 hover:bg-ink hover:text-cream hover:border-ink"
    >
      {platform}
    </a>
  );
}
