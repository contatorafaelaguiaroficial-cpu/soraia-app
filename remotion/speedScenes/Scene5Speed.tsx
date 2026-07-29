import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CinematicBackground } from "../components/CinematicBackground";
import { CinematicHeadline } from "../components/CinematicHeadline";
import { Captions } from "../components/Captions";
import { VoiceOver, Sfx } from "../components/VoiceOver";
import { PIcon, pc } from "../premiumTheme";
import { fonts } from "../fonts";

const bars = [0.4, 0.55, 0.35, 0.7, 0.5, 0.85];

const MiniBarChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 160 }}>
      {bars.map((h, i) => {
        const s = spring({ frame: frame - (10 + i * 6), fps, config: { damping: 200 } });
        const height = interpolate(s, [0, 1], [0, h * 160], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const isLast = i === bars.length - 1;
        return (
          <div
            key={i}
            style={{
              width: 30,
              height,
              borderRadius: 8,
              background: isLast
                ? `linear-gradient(180deg, ${pc.gold}, ${pc.goldSoft})`
                : "rgba(169,140,255,0.35)",
              boxShadow: isLast ? "0 0 20px rgba(240,196,122,0.4)" : undefined,
            }}
          />
        );
      })}
    </div>
  );
};

export const Scene5Speed: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const goalDelay = 62;
  const goalS = spring({ frame: frame - goalDelay, fps, config: { damping: 12, mass: 0.5 } });
  const goalOpacity = interpolate(goalS, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const goalScale = interpolate(goalS, [0, 1], [0.8, 1], { extrapolateLeft: "clamp" });

  const progDelay = 80;
  const progS = spring({ frame: frame - progDelay, fps, config: { damping: 200 } });
  const progWidth = interpolate(progS, [0, 1], [0, 74], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <CinematicBackground durationInFrames={duration} glow="gold" />
      <VoiceOver file="speed/s5.wav" delay={6} />
      <Sfx file="pop.wav" delay={10} volume={0.25} />
      <Sfx file="success.wav" delay={goalDelay} volume={0.4} />
      <Sfx file="pop.wav" delay={progDelay} volume={0.3} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ marginBottom: 56 }}>
          <CinematicHeadline
            fontSize={52}
            startFrame={4}
            maxWidth={760}
            lines={[
              { text: "Menos tempo organizando.", variant: "bold" },
              { text: "Mais clareza para decidir.", variant: "accent" },
            ]}
          />
        </div>

        <MiniBarChart />

        <div
          style={{
            opacity: goalOpacity,
            transform: `scale(${goalScale})`,
            marginTop: 40,
            width: 420,
            background: pc.panel,
            borderTop: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 22,
            padding: "22px 26px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <PIcon.Target />
              <span style={{ fontFamily: fonts.grotesk, fontSize: 18, fontWeight: 700, color: pc.ink }}>
                Meta: Reserva de emergência
              </span>
            </div>
          </div>
          <div style={{ width: "100%", height: 12, borderRadius: 10, background: "rgba(255,255,255,0.08)" }}>
            <div
              style={{
                width: `${progWidth}%`,
                height: "100%",
                borderRadius: 10,
                background: `linear-gradient(90deg, ${pc.gold}, ${pc.purple})`,
              }}
            />
          </div>
        </div>
      </AbsoluteFill>

      <Captions
        text="Economize tempo e tenha mais clareza para planejar os próximos passos."
        from={6}
        durationInFrames={119}
      />
    </AbsoluteFill>
  );
};
