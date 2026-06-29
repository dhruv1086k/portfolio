import { useState, useRef } from "react";

export default function LanyardCard() {
  const [isLanyardOver, setIsLanyardOver] = useState(false);
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    setIsLanyardOver(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  return (
    <div className="min-h-screen max-lg:min-h-auto max-lg:py-6 flex items-center justify-center px-4">
      <div
        className="flex flex-col items-center"
        style={{
          transformOrigin: "top center",
          animation: "swing 3.8s ease-in-out infinite",
        }}
      >
        {/* Strap */}
        <div
          className="relative overflow-hidden flex-shrink-0"
          style={{
            width: "clamp(28px, 5vw, 36px)",
            height: "clamp(190px, 22vw, 256px)",
            background: "#1e1e1e",
            borderRadius: "2px",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(180deg, transparent, transparent 6px, rgba(255,255,255,0.06) 6px, rgba(255,255,255,0.06) 7px)",
            }}
          />
          <span
            className="absolute top-1/2 left-1/2 text-white/50 tracking-widest whitespace-nowrap font-medium"
            style={{
              fontSize: "clamp(6px, 1vw, 8px)",
              transform: "translate(-50%, -50%) rotate(90deg)",
              fontFamily: "system-ui, sans-serif",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
            }}
          >
            DHRUV PAL · DEVELOPER
          </span>
        </div>

        {/* Clip */}
        <div
          className="flex-shrink-0 shadow-md"
          style={{
            width: "clamp(18px, 3vw, 24px)",
            height: "clamp(6px, 1vw, 8px)",
            borderRadius: "0 0 3px 3px",
            background: "linear-gradient(180deg, #999 0%, #bbb 40%, #777 100%)",
          }}
        />

        {/* Card */}
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{
            width: "clamp(180px, 45vw, 216px)",
            paddingBottom: "clamp(16px, 3vw, 28px)",
            background: "#1e1e1e",
            boxShadow:
              "0 18px 50px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)",
          }}
        >
          {/* Dot texture */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "9px 9px",
              zIndex: 0,
            }}
          />

          {/* Top bar */}
          <div className="h-2.5 w-full" style={{ background: "#2e2e2e" }} />

          {/* Card content */}
          <div
            className="relative z-10"
            style={{
              padding: "clamp(12px, 3vw, 20px) clamp(12px, 3vw, 20px) 0",
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setIsLanyardOver(false)}
          >
            <p
              className="text-white font-bold leading-tight mb-2 font-mono"
              style={{ fontSize: "clamp(20px, 4vw, 30px)" }}
            >
              Dhruv Pal
            </p>
            <p
              className="text-white/45 font-light leading-relaxed mb-4"
              style={{
                fontSize: "clamp(9px, 1.5vw, 11px)",
                fontFamily: "system-ui, sans-serif",
                letterSpacing: "0.01em",
              }}
            >
              Building web applications, solving problems, learning
              continuously, and turning ideas into meaningful digital
              experiences.
            </p>

            {/* Avatar container */}
            <div
              className="rounded-full mx-auto p-[3px]"
              style={{
                width: "clamp(96px, 15vw, 128px)",
                height: "clamp(96px, 15vw, 128px)",
                background: "linear-gradient(135deg, #444 0%, #222 100%)",
                boxShadow:
                  "0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
              }}
            >
              <div className="w-full h-full rounded-full bg-[#2e2e2e] flex items-center justify-center overflow-hidden relative">
                <img
                  src="/lanyardPhoto.png"
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    opacity: isLanyardOver ? 0 : 1,
                    transition: "opacity 0.8s ease",
                  }}
                />
                <video
                  ref={videoRef}
                  src="/lanyardVideo.mp4"
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    opacity: isLanyardOver ? 1 : 0,
                    transition: "opacity 0.8s ease",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes swing {
          0%   { transform: rotate(-7deg); }
          50%  { transform: rotate(7deg); }
          100% { transform: rotate(-7deg); }
        }
        @media (max-width: 480px) {
          @keyframes swing {
            0%   { transform: rotate(-4deg); }
            50%  { transform: rotate(4deg); }
            100% { transform: rotate(-4deg); }
          }
        }
      `}</style>
    </div>
  );
}
