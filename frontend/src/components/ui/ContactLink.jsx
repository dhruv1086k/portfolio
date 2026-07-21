import PixelArrow from "./pixelArrow";

export default function ContactLink({ platform, url, handle }) {
  return (
    <a
      href={url}
      target={url.startsWith("mailto:") ? undefined : "_blank"}
      rel="noopener noreferrer"
      className="cursor-hover flex items-center justify-between py-4.5 border-b border-line-2 no-underline text-ink transition-all duration-250 hover:pl-3 group"
    >
      <span className="text-[13px] text-ink-4 font-mono tracking-[1px] uppercase">
        {platform}
      </span>
      <span className="font-mono text-[15px] text-ink-2">{handle}</span>
      <PixelArrow groupHover size={26} />
    </a >
  );
}