import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { AmbientBackground } from "../components/AmbientBackground";
import { VoiceOver } from "../components/VoiceOver";
import { colors } from "../theme";
import { fonts } from "../fonts";

const floaters = [
  { label: "🍔 -R$120", left: "8%", speed: 1.3, delay: 0 },
  { label: "🚗 -R$45", left: "68%", speed: 1.7, delay: 8 },
  { label: "🛒 -R$980", left: "20%", speed: 1.1, delay: 20 },
  { label: "🎬 -R$60", left: "52%", speed: 1.5, delay: 4 },
  { label: "📦 -R$310", left: "78%", speed: 1.2, delay: 15 },
  { label: "❓ ???", left: "38%", speed: 1.4, delay: 26 },
];

export const PainScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <AmbientBackground />
      <VoiceOver file="pain.wav" delay={8} />

      {floaters.map((f, i) => {
        const local = frame - f.delay;
        const y = interpolate(local, [0, 78], [-120, 2000], { extrapolateLeft: "clamp" });
        const opacity = interpolate(local, [0, 12, 62, 78], [0, 0.95, 0.95, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const rotate = local * f.speed * 0.5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: f.left,
              top: y,
              opacity,
              transform: `rotate(${rotate}deg)`,
              fontFamily: fonts.body,
              fontWeight: 700,
              fontSize: 34,
              color: colors.muted,
              background: colors.white,
              border: `1px solid ${colors.purpleLight}`,
              borderRadius: 999,
              padding: "10px 20px",
              boxShadow: "0 14px 30px rgba(90,60,160,0.12)",
            }}
          >
            {f.label}
          </div>
        );
      })}

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 90px" }}>
        <AnimatedText
          lines={["E NUNCA SABE", "PRA ONDE O DINHEIRO", "FOI."]}
          fontSize={80}
          color={colors.ink}
          startFrame={5}
          stagger={8}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
