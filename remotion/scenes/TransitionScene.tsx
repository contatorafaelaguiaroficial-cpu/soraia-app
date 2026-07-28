import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";
import { fonts } from "../fonts";
import { VoiceOver, Sfx } from "../components/VoiceOver";

export const TransitionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 10, mass: 0.4 } });
  const scale = interpolate(s, [0, 1], [0.4, 1]);
  const flash = interpolate(frame, [0, 4, 10], [1, 0, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: colors.alert, alignItems: "center", justifyContent: "center" }}>
      <Sfx file="whoosh.wav" delay={0} volume={0.55} />
      <VoiceOver file="transition.wav" delay={5} />
      <div
        style={{
          fontFamily: fonts.headline,
          fontSize: 104,
          color: colors.white,
          textAlign: "center",
          lineHeight: 1.1,
          transform: `scale(${scale})`,
        }}
      >
        <div>ISSO ACABA</div>
        <div>AGORA.</div>
      </div>
      <AbsoluteFill style={{ background: "#ffffff", opacity: flash }} />
    </AbsoluteFill>
  );
};
