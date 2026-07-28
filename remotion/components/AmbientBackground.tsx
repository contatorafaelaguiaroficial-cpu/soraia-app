import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors } from "../theme";

export const AmbientBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const x1 = 20 + Math.sin(frame / 90) * 18;
  const y1 = 12 + Math.cos(frame / 110) * 10;
  const x2 = 82 + Math.cos(frame / 100) * 14;
  const y2 = 88 + Math.sin(frame / 130) * 10;

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${x1}% ${y1}%, rgba(124,58,237,0.14), transparent 45%), radial-gradient(circle at ${x2}% ${y2}%, rgba(243,197,109,0.20), transparent 42%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(124,58,237,0.09) 2px, transparent 2px)",
          backgroundSize: "48px 48px",
          opacity: 0.5,
        }}
      />
    </AbsoluteFill>
  );
};
