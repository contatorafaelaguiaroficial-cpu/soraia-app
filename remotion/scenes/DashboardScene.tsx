import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AmbientBackground } from "../components/AmbientBackground";
import { PhoneFrame } from "../components/PhoneFrame";
import { CategoryBar } from "../components/CategoryBar";
import { VoiceOver, Sfx } from "../components/VoiceOver";
import { colors } from "../theme";
import { fonts } from "../fonts";

export const DashboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleS = spring({ frame, fps, config: { damping: 200 } });
  const titleOpacity = interpolate(titleS, [0, 1], [0, 1]);
  const titleY = interpolate(titleS, [0, 1], [30, 0]);

  const insightS = spring({ frame: frame - 95, fps, config: { damping: 200 } });
  const insightOpacity = interpolate(insightS, [0, 1], [0, 1]);
  const insightScale = interpolate(insightS, [0, 1], [0.9, 1]);

  return (
    <AbsoluteFill>
      <AmbientBackground />
      <VoiceOver file="dashboard.wav" delay={10} />
      <Sfx file="pop.wav" delay={15} volume={0.3} />
      <Sfx file="pop.wav" delay={25} volume={0.3} />
      <Sfx file="pop.wav" delay={35} volume={0.3} />
      <Sfx file="pop.wav" delay={45} volume={0.3} />

      <AbsoluteFill style={{ alignItems: "center", padding: "70px 0 0 0" }}>
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            textAlign: "center",
            marginBottom: 34,
          }}
        >
          <div style={{ fontFamily: fonts.body, fontSize: 26, color: colors.goldDeep, fontWeight: 700, letterSpacing: 2 }}>
            E TEM MAIS
          </div>
          <div style={{ fontFamily: fonts.headline, fontSize: 48, color: colors.ink, marginTop: 8 }}>
            ELA ANOTA E ANALISA TUDO
          </div>
        </div>

        <PhoneFrame width={720}>
          <AbsoluteFill style={{ background: colors.screenBg, padding: "70px 34px 24px 34px" }}>
            <div style={{ fontFamily: fonts.body, fontSize: 20, color: colors.muted }}>
              Gastos de julho
            </div>
            <div style={{ fontFamily: fonts.headline, fontSize: 56, color: colors.gold, marginBottom: 30 }}>
              R$ 3.820,00
            </div>

            <CategoryBar label="🛵 Delivery" amount="R$ 1.220" pct={72} color={colors.purple} delay={15} />
            <CategoryBar label="🛒 Mercado" amount="R$ 980" pct={58} color={colors.gold} delay={25} />
            <CategoryBar label="🚗 Transporte" amount="R$ 690" pct={40} color="#ff8e9f" delay={35} />
            <CategoryBar label="🎬 Lazer" amount="R$ 930" pct={55} color={colors.purpleSoft} delay={45} />

            <div
              style={{
                opacity: insightOpacity,
                transform: `scale(${insightScale})`,
                marginTop: 10,
                fontFamily: fonts.body,
                fontSize: 20,
                color: colors.white,
                background: "rgba(124,58,237,0.18)",
                border: `1px solid ${colors.purpleSoft}`,
                borderRadius: 14,
                padding: "14px 16px",
              }}
            >
              📈 Você gastou 23% a mais em delivery esse mês
            </div>
          </AbsoluteFill>
        </PhoneFrame>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
