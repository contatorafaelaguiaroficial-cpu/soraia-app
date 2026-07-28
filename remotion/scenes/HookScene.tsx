import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { AmbientBackground } from "../components/AmbientBackground";
import { SpreadsheetCard } from "../components/SpreadsheetCard";
import { VoiceOver, Sfx } from "../components/VoiceOver";
import { colors } from "../theme";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const gridOpacity = interpolate(frame, [0, 20], [0, 0.5], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <AmbientBackground />
      <VoiceOver file="hook.wav" delay={8} />
      <Sfx file="pop.wav" delay={4} volume={0.35} />

      <AbsoluteFill
        style={{
          opacity: gridOpacity,
          backgroundImage:
            "linear-gradient(rgba(124,58,237,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.12) 1px, transparent 1px)",
          backgroundSize: "90px 90px",
        }}
      />

      <SpreadsheetCard top={220} left={60} width={230} rotate={-10} delay={2} />
      <SpreadsheetCard top={1420} left={640} width={250} rotate={8} delay={18} />

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
          color={colors.ink}
          startFrame={10}
          stagger={8}
          lineHeight={1.05}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
