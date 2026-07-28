import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";
import { fonts } from "../fonts";

export const AnimatedText: React.FC<{
  lines: string[];
  fontSize: number;
  color?: string;
  fontFamily?: string;
  align?: "left" | "center" | "right";
  stagger?: number;
  startFrame?: number;
  lineHeight?: number;
  maxWidth?: number;
  letterSpacing?: number;
}> = ({
  lines,
  fontSize,
  color = colors.ink,
  fontFamily = fonts.headline,
  align = "center",
  stagger = 6,
  startFrame = 0,
  lineHeight = 1.05,
  maxWidth,
  letterSpacing,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems:
          align === "center" ? "center" : align === "left" ? "flex-start" : "flex-end",
        maxWidth,
      }}
    >
      {lines.map((line, i) => {
        const localFrame = frame - startFrame - i * stagger;
        const s = spring({ frame: localFrame, fps, config: { damping: 200, mass: 0.5 } });
        const opacity = interpolate(s, [0, 1], [0, 1]);
        const translateY = interpolate(s, [0, 1], [40, 0]);
        return (
          <div
            key={i}
            style={{
              fontFamily,
              fontSize,
              color,
              lineHeight,
              textAlign: align,
              opacity,
              letterSpacing,
              transform: `translateY(${translateY}px)`,
              whiteSpace: "pre-wrap",
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};
