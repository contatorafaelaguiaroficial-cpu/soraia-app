import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { pc, Grain } from "../premiumTheme";

export const CinematicBackground: React.FC<{
  durationInFrames: number;
  glow?: "gold" | "purple" | "mixed";
  zoom?: boolean;
}> = ({ durationInFrames, glow = "mixed", zoom = true }) => {
  const frame = useCurrentFrame();
  const scale = zoom ? interpolate(frame, [0, durationInFrames], [1, 1.045]) : 1;

  const glowLayer =
    glow === "gold"
      ? "radial-gradient(90% 70% at 80% 10%, rgba(240,196,122,0.16), transparent 55%)"
      : glow === "purple"
      ? "radial-gradient(90% 70% at 15% 90%, rgba(136,101,232,0.22), transparent 55%)"
      : "radial-gradient(90% 70% at 78% 8%, rgba(240,196,122,0.12), transparent 55%), radial-gradient(90% 70% at 8% 95%, rgba(136,101,232,0.18), transparent 55%)";

  return (
    <AbsoluteFill style={{ background: pc.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <AbsoluteFill style={{ background: glowLayer }} />
        <AbsoluteFill
          style={{
            background: "radial-gradient(140% 120% at 50% 50%, transparent 55%, rgba(0,0,0,0.6) 100%)",
          }}
        />
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};
