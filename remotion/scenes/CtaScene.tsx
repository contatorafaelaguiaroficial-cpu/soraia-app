import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AmbientBackground } from "../components/AmbientBackground";
import { colors } from "../theme";
import { fonts } from "../fonts";

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoS = spring({ frame, fps, config: { damping: 12, mass: 0.6 } });
  const logoScale = interpolate(logoS, [0, 1], [0.5, 1]);
  const logoOpacity = interpolate(logoS, [0, 1], [0, 1]);

  const subS = spring({ frame: frame - 12, fps, config: { damping: 200 } });
  const subOpacity = interpolate(subS, [0, 1], [0, 1]);

  const btnS = spring({ frame: frame - 24, fps, config: { damping: 200 } });
  const btnOpacity = interpolate(btnS, [0, 1], [0, 1]);
  const btnScale = interpolate(btnS, [0, 1], [0.85, 1]);

  const bounce = Math.abs(Math.sin(frame / 8)) * 10;

  return (
    <AbsoluteFill>
      <AmbientBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            fontFamily: fonts.headline,
            fontSize: 108,
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            backgroundImage: `linear-gradient(90deg, ${colors.purple}, ${colors.gold})`,
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
            color: colors.white,
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
            color: colors.purpleLight,
          }}
        >
          ↑ arraste para cima
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
