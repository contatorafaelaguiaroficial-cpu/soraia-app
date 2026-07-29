import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../fonts";
import { pc } from "../premiumTheme";

export const Captions: React.FC<{ text: string; from: number; durationInFrames: number }> = ({
  text,
  from,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - from;
  const s = spring({ frame: local, fps, config: { damping: 200 } });
  const fadeOut = interpolate(local, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateLeft: "clamp" }) * fadeOut;

  if (local < -5 || local > durationInFrames + 5) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        bottom: 96,
        display: "flex",
        justifyContent: "center",
        opacity,
      }}
    >
      <div
        style={{
          background: "rgba(8,7,12,0.55)",
          backdropFilter: "blur(6px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 18,
          padding: "14px 22px",
          maxWidth: 880,
        }}
      >
        <span
          style={{
            fontFamily: fonts.body,
            fontSize: 22,
            lineHeight: 1.4,
            color: pc.mutedInk,
            textAlign: "center",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};
