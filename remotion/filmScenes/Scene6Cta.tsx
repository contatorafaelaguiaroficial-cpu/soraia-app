import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CinematicBackground } from "../components/CinematicBackground";
import { Sfx } from "../components/VoiceOver";
import { pc, PIcon } from "../premiumTheme";
import { fonts } from "../fonts";

const Sparkle: React.FC<{ angle: number; distance: number; delay: number }> = ({ angle, distance, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 9, mass: 0.5 } });
  const d = interpolate(s, [0, 1], [0, distance], { extrapolateLeft: "clamp" });
  const opacity = interpolate(s, [0, 0.3, 1], [0, 1, 0], { extrapolateLeft: "clamp" });
  const x = Math.cos(angle) * d;
  const y = Math.sin(angle) * d;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 6,
        height: 6,
        borderRadius: 6,
        background: pc.gold,
        opacity,
        transform: `translate(${x}px, ${y}px)`,
        boxShadow: `0 0 10px ${pc.gold}`,
      }}
    />
  );
};

export const Scene6Cta: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoS = spring({ frame: frame - 6, fps, config: { damping: 11, mass: 0.6 } });
  const logoOpacity = interpolate(logoS, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const logoScale = interpolate(logoS, [0, 1], [0.55, 1], { extrapolateLeft: "clamp" });

  const subS = spring({ frame: frame - 24, fps, config: { damping: 200 } });
  const subOpacity = interpolate(subS, [0, 1], [0, 1], { extrapolateLeft: "clamp" });

  const btnS = spring({ frame: frame - 42, fps, config: { damping: 200 } });
  const btnOpacity = interpolate(btnS, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const btnScale = interpolate(btnS, [0, 1], [0.85, 1], { extrapolateLeft: "clamp" });

  const bounce = Math.abs(Math.sin(frame / 8)) * 8;
  const sparkles = new Array(10).fill(0).map((_, i) => ({
    angle: (i / 10) * Math.PI * 2,
    distance: 130 + (i % 3) * 30,
    delay: 4 + (i % 4) * 3,
  }));

  return (
    <AbsoluteFill>
      <CinematicBackground durationInFrames={duration} glow="mixed" zoom={false} />
      <Sfx file="success.wav" delay={4} volume={0.5} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative" }}>
          {sparkles.map((sp, i) => (
            <Sparkle key={i} {...sp} />
          ))}
          <div
            style={{
              width: 128,
              height: 128,
              borderRadius: 34,
              background: `linear-gradient(150deg, ${pc.purple}, ${pc.purpleDeep})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 30px 60px rgba(136,101,232,0.4), inset 0 1px 0 rgba(255,255,255,0.25)",
              opacity: logoOpacity,
              transform: `scale(${logoScale})`,
            }}
          >
            <span style={{ fontFamily: fonts.grotesk, fontSize: 64, fontWeight: 800, color: pc.ink }}>S</span>
          </div>
        </div>

        <div
          style={{
            fontFamily: fonts.grotesk,
            fontWeight: 800,
            fontSize: 78,
            letterSpacing: -2,
            marginTop: 26,
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            backgroundImage: `linear-gradient(95deg, ${pc.ink}, ${pc.purple})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Assine a Soraia
        </div>

        <div
          style={{
            opacity: subOpacity,
            fontFamily: fonts.body,
            fontSize: 24,
            color: pc.mutedInk,
            marginTop: 14,
            textAlign: "center",
            padding: "0 100px",
          }}
        >
          Sua assistente financeira com inteligência artificial.
        </div>

        <div
          style={{
            opacity: btnOpacity,
            transform: `scale(${btnScale}) translateY(${-bounce * 0.3}px)`,
            marginTop: 54,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: `linear-gradient(135deg, ${pc.gold}, ${pc.goldSoft})`,
            padding: "20px 40px",
            borderRadius: 100,
            boxShadow: "0 24px 48px rgba(240,196,122,0.32)",
          }}
        >
          <span style={{ fontFamily: fonts.grotesk, fontWeight: 700, fontSize: 22, color: "#241705" }}>
            Comece agora
          </span>
          <PIcon.ArrowUpRight color="#241705" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
