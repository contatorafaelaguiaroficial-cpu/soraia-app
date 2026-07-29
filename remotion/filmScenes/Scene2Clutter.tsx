import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CinematicBackground } from "../components/CinematicBackground";
import { CinematicHeadline } from "../components/CinematicHeadline";
import { Sfx } from "../components/VoiceOver";
import { PIcon, pc } from "../premiumTheme";
import { fonts } from "../fonts";

const cards = [
  { Icon: PIcon.Receipt, label: "Recibo", top: 380, left: 90, rotate: -9, delay: 4 },
  { Icon: PIcon.Sheet, label: "Planilha", top: 300, left: 620, rotate: 7, delay: 14 },
  { Icon: PIcon.Note, label: "Anotação", top: 620, left: 700, rotate: 6, delay: 24 },
  { Icon: PIcon.Receipt, label: "Recibo", top: 1180, left: 660, rotate: -6, delay: 34 },
  { Icon: PIcon.Sheet, label: "Planilha", top: 1260, left: 110, rotate: -4, delay: 44 },
];

const ClutterCard: React.FC<(typeof cards)[number] & { duration: number }> = ({
  Icon,
  label,
  top,
  left,
  rotate,
  delay,
  duration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;

  const inS = spring({ frame: local, fps, config: { damping: 14, mass: 0.6 } });
  const opacityIn = interpolate(inS, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const scaleIn = interpolate(inS, [0, 1], [0.75, 1], { extrapolateRight: "clamp" });

  const exitStart = duration - 42;
  const exitLocal = frame - exitStart;
  const opacityOut = interpolate(exitLocal, [0, 30], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const driftY = interpolate(exitLocal, [0, 30], [0, 70], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blurOut = interpolate(exitLocal, [0, 30], [0, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        opacity: opacityIn * opacityOut,
        transform: `translateY(${driftY}px) rotate(${rotate}deg) scale(${scaleIn})`,
        filter: `blur(${blurOut}px)`,
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${pc.hairline}`,
        borderRadius: 20,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
      }}
    >
      <Icon />
      <span style={{ fontFamily: fonts.grotesk, fontSize: 20, fontWeight: 700, color: pc.mutedInk }}>{label}</span>
    </div>
  );
};

export const Scene2Clutter: React.FC<{ duration: number }> = ({ duration }) => {
  return (
    <AbsoluteFill>
      <CinematicBackground durationInFrames={duration} glow="purple" />
      <Sfx file="pop.wav" delay={4} volume={0.3} />
      <Sfx file="pop.wav" delay={24} volume={0.28} />
      <Sfx file="whoosh.wav" delay={duration - 40} volume={0.4} />

      {cards.map((card, i) => (
        <ClutterCard key={i} {...card} duration={duration} />
      ))}

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 90px" }}>
        <CinematicHeadline
          fontSize={72}
          startFrame={18}
          lines={[
            { text: "Chega de informações", variant: "bold" },
            { text: "espalhadas.", variant: "accent" },
          ]}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
