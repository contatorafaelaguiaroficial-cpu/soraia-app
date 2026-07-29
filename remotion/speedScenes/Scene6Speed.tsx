import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CinematicBackground } from "../components/CinematicBackground";
import { CinematicHeadline } from "../components/CinematicHeadline";
import { Captions } from "../components/Captions";
import { VoiceOver, Sfx } from "../components/VoiceOver";
import { PremiumPhone } from "../components/PremiumPhone";
import { PIcon, pc, WordmarkLogo } from "../premiumTheme";
import { fonts } from "../fonts";

export const Scene6Speed: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneS = spring({ frame: frame - 20, fps, config: { damping: 14, mass: 0.6 } });
  const phoneOpacity = interpolate(phoneS, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const phoneScale = interpolate(phoneS, [0, 1], [0.85, 1], { extrapolateLeft: "clamp" });

  const subS = spring({ frame: frame - 62, fps, config: { damping: 200 } });
  const subOpacity = interpolate(subS, [0, 1], [0, 1], { extrapolateLeft: "clamp" });

  const btnS = spring({ frame: frame - 78, fps, config: { damping: 200 } });
  const btnOpacity = interpolate(btnS, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const btnScale = interpolate(btnS, [0, 1], [0.85, 1], { extrapolateLeft: "clamp" });
  const pulse = 1 + Math.sin(frame / 9) * 0.02;

  const glowS = spring({ frame: frame - 4, fps, config: { damping: 200 } });
  const glowOpacity = interpolate(glowS, [0, 1], [0, 1], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill>
      <CinematicBackground durationInFrames={duration} glow="mixed" zoom={false} />
      <VoiceOver file="speed/s6.wav" delay={8} />
      <Sfx file="success.wav" delay={20} volume={0.45} />

      <AbsoluteFill
        style={{
          opacity: glowOpacity,
          background: "radial-gradient(45% 30% at 50% 42%, rgba(169,140,255,0.28), transparent 70%)",
        }}
      />

      <AbsoluteFill style={{ alignItems: "center", padding: "96px 0 0 0" }}>
        <CinematicHeadline
          fontSize={50}
          startFrame={4}
          maxWidth={820}
          lines={[{ text: "Tenha uma assistente financeira", variant: "bold" }, { text: "todos os dias.", variant: "accent" }]}
        />

        <div style={{ opacity: phoneOpacity, transform: `scale(${phoneScale})`, marginTop: 46 }}>
          <PremiumPhone width={420} height={700}>
            <div style={{ padding: "44px 26px 0 26px" }}>
              <WordmarkLogo size={32} fontFamily={fonts.grotesk} />

              <div style={{ marginTop: 28 }}>
                <div style={{ fontFamily: fonts.grotesk, fontSize: 12, color: pc.faint, letterSpacing: 2 }}>
                  SALDO DO MÊS
                </div>
                <div style={{ fontFamily: fonts.grotesk, fontSize: 32, fontWeight: 800, color: pc.ink }}>
                  R$ 2.980,60
                </div>
              </div>

              <div
                style={{
                  marginTop: 22,
                  background: "rgba(169,140,255,0.12)",
                  border: "1px solid rgba(169,140,255,0.22)",
                  borderRadius: 18,
                  borderTopLeftRadius: 4,
                  padding: "14px 18px",
                }}
              >
                <span style={{ fontFamily: fonts.body, fontSize: 15, color: pc.ink }}>
                  Oi! Sua semana está dentro do planejado 👋
                </span>
              </div>
            </div>
          </PremiumPhone>
        </div>

        <div
          style={{
            opacity: subOpacity,
            marginTop: 34,
            fontFamily: fonts.serif,
            fontStyle: "italic",
            fontSize: 34,
            backgroundImage: `linear-gradient(95deg, ${pc.gold}, ${pc.purple})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Assine a Soraia.
        </div>

        <div
          style={{
            opacity: btnOpacity,
            transform: `scale(${btnScale * pulse})`,
            marginTop: 26,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: `linear-gradient(135deg, ${pc.gold}, ${pc.goldSoft})`,
            padding: "18px 36px",
            borderRadius: 100,
            boxShadow: "0 20px 44px rgba(240,196,122,0.32)",
          }}
        >
          <span style={{ fontFamily: fonts.grotesk, fontWeight: 700, fontSize: 20, color: "#241705" }}>
            Começar agora
          </span>
          <PIcon.ArrowUpRight color="#241705" />
        </div>
      </AbsoluteFill>

      <Captions
        text="Assine a Soraia e deixe sua organização financeira mais simples."
        from={8}
        durationInFrames={104}
      />
    </AbsoluteFill>
  );
};
