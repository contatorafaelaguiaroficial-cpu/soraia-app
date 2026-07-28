import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AmbientBackground } from "../components/AmbientBackground";
import { AnimatedText } from "../components/AnimatedText";
import { VoiceOver, Sfx } from "../components/VoiceOver";
import { colors } from "../theme";

const Underline: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const width = interpolate(s, [0, 1], [0, 260], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        width,
        height: 10,
        borderRadius: 10,
        background: colors.gold,
        marginTop: 16,
      }}
    />
  );
};

export const PunchScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <AmbientBackground />
      <VoiceOver file="punch.wav" delay={5} />
      <Sfx file="pop.wav" delay={2} volume={0.35} />
      <Sfx file="pop.wav" delay={22} volume={0.4} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 80px" }}>
        <AnimatedText
          lines={["PARE DE ADIVINHAR."]}
          fontSize={70}
          color={colors.muted}
          startFrame={2}
          stagger={0}
        />
        <div style={{ height: 20 }} />
        <AnimatedText
          lines={["COMECE A SABER."]}
          fontSize={88}
          color={colors.ink}
          startFrame={22}
          stagger={0}
        />
        <Underline delay={30} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
