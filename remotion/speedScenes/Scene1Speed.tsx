import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CinematicBackground } from "../components/CinematicBackground";
import { CinematicHeadline } from "../components/CinematicHeadline";
import { Captions } from "../components/Captions";
import { VoiceOver, Sfx } from "../components/VoiceOver";
import { PremiumPhone } from "../components/PremiumPhone";
import { PIcon, pc, WordmarkLogo } from "../premiumTheme";
import { fonts } from "../fonts";

const items = [
  { Icon: PIcon.Receipt, sx: -260, sy: -320, delay: 2 },
  { Icon: PIcon.Message, sx: 250, sy: -260, delay: 8 },
  { Icon: () => <PIcon.Mic color={pc.ink} />, sx: -280, sy: 60, delay: 14 },
  { Icon: PIcon.Sheet, sx: 260, sy: 120, delay: 6 },
];

const FlyIn: React.FC<{ Icon: React.FC; sx: number; sy: number; delay: number; converge: number }> = ({
  Icon,
  sx,
  sy,
  delay,
  converge,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inS = spring({ frame: frame - delay, fps, config: { damping: 12, mass: 0.5 } });
  const inOpacity = interpolate(inS, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const inScale = interpolate(inS, [0, 1], [0.3, 1], { extrapolateRight: "clamp" });

  const convS = spring({ frame: frame - converge, fps, config: { damping: 16, mass: 0.7 } });
  const convProgress = interpolate(convS, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = sx * (1 - convProgress);
  const y = sy * (1 - convProgress);
  const convOpacity = interpolate(convProgress, [0, 0.7, 1], [1, 0.6, 0]);
  const convScale = interpolate(convProgress, [0, 1], [1, 0.3]);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        opacity: inOpacity * convOpacity,
        transform: `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${inScale * convScale})`,
        width: 64,
        height: 64,
        borderRadius: 20,
        background: "rgba(255,255,255,0.05)",
        border: `1px solid ${pc.hairline}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
      }}
    >
      <Icon />
    </div>
  );
};

export const Scene1Speed: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const converge = 46;

  const phoneS = spring({ frame: frame - converge, fps, config: { damping: 14, mass: 0.6 } });
  const phoneOpacity = interpolate(phoneS, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const phoneScale = interpolate(phoneS, [0, 1], [0.8, 1], { extrapolateLeft: "clamp" });

  const checkS = spring({ frame: frame - (converge + 18), fps, config: { damping: 10, mass: 0.4 } });
  const checkOpacity = interpolate(checkS, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const checkScale = interpolate(checkS, [0, 1], [0, 1], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill>
      <CinematicBackground durationInFrames={duration} glow="mixed" />
      <VoiceOver file="speed/s1.wav" delay={5} />
      <Sfx file="pop.wav" delay={2} volume={0.28} />
      <Sfx file="pop.wav" delay={8} volume={0.26} />
      <Sfx file="pop.wav" delay={14} volume={0.26} />
      <Sfx file="success.wav" delay={converge + 16} volume={0.4} />

      <AbsoluteFill style={{ alignItems: "center", padding: "150px 0 0 0" }}>
        <CinematicHeadline
          fontSize={62}
          startFrame={4}
          lines={[
            { text: "Sua vida financeira", variant: "bold" },
            { text: "em poucos segundos.", variant: "accent" },
          ]}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {items.map((it, i) => (
          <FlyIn key={i} {...it} converge={converge} />
        ))}

        <div style={{ opacity: phoneOpacity, transform: `scale(${phoneScale})`, position: "relative" }}>
          <PremiumPhone width={360} height={620}>
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
              <WordmarkLogo size={40} fontFamily={fonts.grotesk} />
            </AbsoluteFill>
          </PremiumPhone>
          <div
            style={{
              position: "absolute",
              top: -16,
              right: -16,
              width: 46,
              height: 46,
              borderRadius: 46,
              background: pc.whatsapp,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: checkOpacity,
              transform: `scale(${checkScale})`,
              boxShadow: "0 10px 24px rgba(63,209,124,0.4)",
            }}
          >
            <PIcon.Check color="#04210f" />
          </div>
        </div>
      </AbsoluteFill>

      <Captions text="Organizar suas finanças pode levar poucos segundos." from={5} durationInFrames={95} />
    </AbsoluteFill>
  );
};
