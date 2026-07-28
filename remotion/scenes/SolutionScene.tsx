import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AmbientBackground } from "../components/AmbientBackground";
import { PhoneFrame } from "../components/PhoneFrame";
import { ChatBubble } from "../components/ChatBubble";
import { colors } from "../theme";
import { fonts } from "../fonts";

export const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleS = spring({ frame, fps, config: { damping: 200 } });
  const titleOpacity = interpolate(titleS, [0, 1], [0, 1]);
  const titleY = interpolate(titleS, [0, 1], [30, 0]);

  const captionS = spring({ frame: frame - 78, fps, config: { damping: 200 } });
  const captionOpacity = interpolate(captionS, [0, 1], [0, 1]);

  return (
    <AbsoluteFill>
      <AmbientBackground />
      <AbsoluteFill style={{ alignItems: "center", padding: "70px 0 0 0" }}>
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            textAlign: "center",
            marginBottom: 34,
          }}
        >
          <div style={{ fontFamily: fonts.body, fontSize: 26, color: colors.gold, fontWeight: 700, letterSpacing: 2 }}>
            CONHEÇA A SORAIA
          </div>
          <div style={{ fontFamily: fonts.headline, fontSize: 52, color: colors.white, marginTop: 8 }}>
            SUA IA FINANCEIRA
          </div>
        </div>

        <PhoneFrame width={720}>
          <AbsoluteFill style={{ background: "#0b0f14", padding: "70px 24px 24px 24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <ChatBubble isAudio fromUser delay={20} bg={colors.whatsapp} />
              <ChatBubble
                fromUser={false}
                text="Anotado! Uber de R$45 em Transporte 🚗"
                delay={45}
                bg="#262130"
                color={colors.white}
              />
              <ChatBubble fromUser text="quanto eu já gastei esse mês?" delay={70} bg={colors.whatsapp} color="#04210f" />
              <ChatBubble
                fromUser={false}
                text="Você já gastou R$ 2.340 até agora 👀"
                delay={95}
                bg="#262130"
                color={colors.white}
              />
            </div>
          </AbsoluteFill>
        </PhoneFrame>

        <div
          style={{
            opacity: captionOpacity,
            marginTop: 34,
            fontFamily: fonts.body,
            fontSize: 30,
            fontWeight: 700,
            color: colors.white,
            textAlign: "center",
            padding: "0 80px",
          }}
        >
          Manda áudio, manda texto. Ela entende tudo.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
