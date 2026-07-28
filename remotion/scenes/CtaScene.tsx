import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AmbientBackground } from "../components/AmbientBackground";
import { VoiceOver, Sfx } from "../components/VoiceOver";
import { colors } from "../theme";
import { fonts } from "../fonts";

const AppIcon: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 11, mass: 0.6 } });
  const scale = interpolate(s, [0, 1], [0.4, 1]);
  const opacity = interpolate(s, [0, 1], [0, 1]);

  return (
    <div
      style={{
        width: 130,
        height: 130,
        borderRadius: 34,
        background: `linear-gradient(135deg, ${colors.purple}, ${colors.goldDeep})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 24px 50px rgba(124,58,237,0.35)",
        opacity,
        transform: `scale(${scale})`,
        marginBottom: 26,
      }}
    >
      <span style={{ fontFamily: fonts.headline, fontSize: 68, color: colors.white }}>S</span>
      <div
        style={{
          position: "absolute",
          marginTop: 78,
          marginLeft: 86,
          width: 42,
          height: 42,
          borderRadius: 42,
          background: colors.whatsapp,
          border: `3px solid ${colors.white}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
        }}
      >
        💬
      </div>
    </div>
  );
};

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoS = spring({ frame: frame - 14, fps, config: { damping: 12, mass: 0.6 } });
  const logoScale = interpolate(logoS, [0, 1], [0.5, 1]);
  const logoOpacity = interpolate(logoS, [0, 1], [0, 1]);

  const subS = spring({ frame: frame - 26, fps, config: { damping: 200 } });
  const subOpacity = interpolate(subS, [0, 1], [0, 1]);

  const btnS = spring({ frame: frame - 38, fps, config: { damping: 200 } });
  const btnOpacity = interpolate(btnS, [0, 1], [0, 1]);
  const btnScale = interpolate(btnS, [0, 1], [0.85, 1]);

  const bounce = Math.abs(Math.sin(frame / 8)) * 10;

  return (
    <AbsoluteFill>
      <AmbientBackground />
      <VoiceOver file="cta.wav" delay={8} />
      <Sfx file="success.wav" delay={0} volume={0.5} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <AppIcon />

        <div
          style={{
            fontFamily: fonts.headline,
            fontSize: 100,
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            backgroundImage: `linear-gradient(90deg, ${colors.purple}, ${colors.goldDeep})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          soraia
        </div>

        <div
          style={{
            opacity: subOpacity,
            fontFamily: fonts.body,
            fontSize: 30,
            color: colors.ink,
            marginTop: 14,
            textAlign: "center",
            padding: "0 90px",
          }}
        >
          sua vida financeira, organizada no WhatsApp
        </div>

        <div
          style={{
            opacity: btnOpacity,
            transform: `scale(${btnScale})`,
            marginTop: 60,
            background: colors.gold,
            color: "#2a1f00",
            fontFamily: fonts.body,
            fontWeight: 800,
            fontSize: 30,
            padding: "22px 44px",
            borderRadius: 100,
            boxShadow: "0 20px 40px rgba(243,197,109,0.4)",
          }}
        >
          FALE COM A SORAIA AGORA
        </div>

        <div
          style={{
            opacity: btnOpacity,
            marginTop: 18,
            fontFamily: fonts.body,
            fontSize: 22,
            color: colors.muted,
          }}
        >
          Grátis para começar
        </div>

        <div
          style={{
            opacity: btnOpacity,
            marginTop: 46,
            transform: `translateY(${-bounce}px)`,
            fontFamily: fonts.body,
            fontSize: 26,
            color: colors.purple,
          }}
        >
          ↑ arraste para cima
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
