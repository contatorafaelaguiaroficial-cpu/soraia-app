import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors } from "../theme";

export const AmbientBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const x1 = 30 + Math.sin(frame / 90) * 20;
  const y1 = 20 + Math.cos(frame / 110) * 15;
  const x2 = 70 + Math.cos(frame / 100) * 20;
  const y2 = 80 + Math.sin(frame / 130) * 15;

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${x1}% ${y1}%, rgba(169,140,255,0.35), transparent 45%), radial-gradient(circle at ${x2}% ${y2}%, rgba(243,197,109,0.18), transparent 40%)`,
        }}
      />
    </AbsoluteFill>
  );
};
