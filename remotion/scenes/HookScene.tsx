import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { colors } from "../theme";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const gridOpacity = interpolate(frame, [0, 20], [0, 0.18], { extrapolateRight: "clamp" });
  const flicker = 0.05 + Math.abs(Math.sin(frame / 4)) * 0.05;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: gridOpacity,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "90px 90px",
        }}
      />
      <AbsoluteFill style={{ background: colors.alert, opacity: flicker * 0.3 }} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "0 90px",
        }}
      >
        <AnimatedText
          lines={["VOCÊ AINDA", "CONTROLA GASTOS", "NA PLANILHA?"]}
          fontSize={92}
          startFrame={5}
          stagger={8}
          lineHeight={1.05}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
