import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../fonts";
import { pc } from "../premiumTheme";

type Line = { text: string; variant?: "bold" | "accent" | "muted" };

export const CinematicHeadline: React.FC<{
  lines: Line[];
  fontSize: number;
  startFrame?: number;
  align?: "left" | "center";
  maxWidth?: number;
}> = ({ lines, fontSize, startFrame = 0, align = "center", maxWidth = 880 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;

  const s = spring({ frame: local, fps, config: { damping: 22, mass: 0.9 } });
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const translateY = interpolate(s, [0, 1], [26, 0], { extrapolateLeft: "clamp" });
  const blur = interpolate(local, [0, 16], [8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wipe = interpolate(s, [0, 1], [100, 0], { extrapolateLeft: "clamp" });

  return (
    <div
      style={{
        maxWidth,
        textAlign: align,
        margin: align === "center" ? "0 auto" : undefined,
        opacity,
        transform: `translateY(${translateY}px)`,
        filter: `blur(${blur}px)`,
        clipPath: `inset(0 ${wipe}% 0 0)`,
      }}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          style={
            line.variant === "accent"
              ? {
                  fontFamily: fonts.serif,
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: fontSize * 0.98,
                  lineHeight: 1.14,
                  backgroundImage: `linear-gradient(95deg, ${pc.gold}, ${pc.purple})`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }
              : {
                  fontFamily: fonts.grotesk,
                  fontWeight: 800,
                  fontSize,
                  lineHeight: 1.08,
                  letterSpacing: -1.6,
                  color: line.variant === "muted" ? pc.mutedInk : pc.ink,
                }
          }
        >
          {line.text}
        </div>
      ))}
    </div>
  );
};
