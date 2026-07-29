import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CinematicBackground } from "../components/CinematicBackground";
import { Sfx } from "../components/VoiceOver";
import { pc, PIcon } from "../premiumTheme";
import { fonts } from "../fonts";

const words = [
  { text: "Acompanhe.", delay: 4 },
  { text: "Planeje.", delay: 34 },
  { text: "Evolua.", delay: 64 },
];

const WordBeat: React.FC<{ text: string; delay: number; active: boolean }> = ({ text, delay, active }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 16, mass: 0.6 } });
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const x = interpolate(s, [0, 1], [-24, 0], { extrapolateLeft: "clamp" });

  return (
    <div
      style={{
        opacity: opacity * (active ? 1 : 0.4),
        transform: `translateX(${x}px)`,
        fontFamily: fonts.grotesk,
        fontWeight: 800,
        fontSize: 64,
        letterSpacing: -1.6,
        color: active ? pc.ink : pc.mutedInk,
        lineHeight: 1.15,
      }}
    >
      {text}
    </div>
  );
};

const GrowthChart: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [16, duration - 30], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dotOpacity = interpolate(frame, [duration - 34, duration - 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const path = "M10 190 C 120 190, 140 150, 220 140 S 340 60, 420 55 S 540 20, 590 15";

  return (
    <svg width={620} height={220} viewBox="0 0 620 220" fill="none">
      {[40, 90, 140, 190].map((y, i) => (
        <line key={i} x1="10" y1={y} x2="610" y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
      ))}
      <path
        d={path}
        stroke={pc.gold}
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={draw}
        style={{ filter: `drop-shadow(0 0 10px rgba(240,196,122,0.55))` }}
      />
      <circle cx={590} cy={15} r={7} fill={pc.gold} opacity={dotOpacity} style={{ filter: "drop-shadow(0 0 8px rgba(240,196,122,0.8))" }} />
    </svg>
  );
};

export const Scene5Goals: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const badgeS = spring({ frame: frame - (duration - 34), fps, config: { damping: 12, mass: 0.5 } });
  const badgeOpacity = interpolate(badgeS, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const badgeScale = interpolate(badgeS, [0, 1], [0.6, 1], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill>
      <CinematicBackground durationInFrames={duration} glow="gold" />
      <Sfx file="pop.wav" delay={4} volume={0.3} />
      <Sfx file="pop.wav" delay={34} volume={0.3} />
      <Sfx file="pop.wav" delay={64} volume={0.3} />
      <Sfx file="success.wav" delay={duration - 34} volume={0.4} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 50 }}>
          {words.map((w, i) => (
            <WordBeat key={i} {...w} active={frame >= w.delay} />
          ))}
        </div>

        <div style={{ position: "relative" }}>
          <GrowthChart duration={duration} />
          <div
            style={{
              position: "absolute",
              top: -18,
              right: -8,
              opacity: badgeOpacity,
              transform: `scale(${badgeScale})`,
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(240,196,122,0.14)",
              border: "1px solid rgba(240,196,122,0.3)",
              borderRadius: 100,
              padding: "10px 16px",
            }}
          >
            <PIcon.Target />
            <span style={{ fontFamily: fonts.grotesk, fontSize: 16, fontWeight: 700, color: pc.goldSoft }}>
              68% da meta
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
