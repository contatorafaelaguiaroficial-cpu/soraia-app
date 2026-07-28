import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";
import { fonts } from "../fonts";

export const TransitionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 10, mass: 0.4 } });
  const scale = interpolate(s, [0, 1], [0.4, 1]);
  const flash = interpolate(frame, [0, 4, 10], [1, 0, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: colors.alert, alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: fonts.headline,
          fontSize: 120,
          color: colors.white,
          transform: `scale(${scale})`,
        }}
      >
        ISSO ACABA.
      </div>
      <AbsoluteFill style={{ background: "#ffffff", opacity: flash }} />
    </AbsoluteFill>
  );
};
