import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { colors } from "../theme";
import { fonts } from "../fonts";

const floaters = [
  { label: "-R$120", left: "12%", speed: 1.3, delay: 0 },
  { label: "-R$45", left: "70%", speed: 1.7, delay: 10 },
  { label: "-R$980", left: "25%", speed: 1.1, delay: 25 },
  { label: "-R$60", left: "55%", speed: 1.5, delay: 5 },
  { label: "-R$310", left: "82%", speed: 1.2, delay: 18 },
  { label: "???", left: "40%", speed: 1.4, delay: 32 },
];

export const PainScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      {floaters.map((f, i) => {
        const local = frame - f.delay;
        const y = interpolate(local, [0, 90], [-100, 2000], { extrapolateLeft: "clamp" });
        const opacity = interpolate(local, [0, 15, 75, 90], [0, 0.7, 0.7, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const rotate = local * f.speed * 0.6;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: f.left,
              top: y,
              opacity,
              transform: `rotate(${rotate}deg)`,
              fontFamily: fonts.headline,
              fontSize: 44,
              color: colors.muted,
            }}
          >
            {f.label}
          </div>
        );
      })}

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 90px" }}>
        <AnimatedText
          lines={["E NO FIM DO MÊS,", "NUNCA SABE PRA ONDE", "O DINHEIRO FOI."]}
          fontSize={80}
          color={colors.white}
          startFrame={5}
          stagger={8}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
