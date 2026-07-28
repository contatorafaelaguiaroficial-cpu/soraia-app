import { AbsoluteFill } from "remotion";
import { AmbientBackground } from "../components/AmbientBackground";
import { AnimatedText } from "../components/AnimatedText";
import { colors } from "../theme";

export const PunchScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <AmbientBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 80px" }}>
        <AnimatedText
          lines={["PARE DE ADIVINHAR."]}
          fontSize={72}
          color={colors.muted}
          startFrame={2}
          stagger={0}
        />
        <div style={{ height: 24 }} />
        <AnimatedText
          lines={["COMECE A SABER."]}
          fontSize={88}
          color={colors.gold}
          startFrame={22}
          stagger={0}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
