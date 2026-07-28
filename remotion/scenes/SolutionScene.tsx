import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AmbientBackground } from "../components/AmbientBackground";
import { PhoneFrame } from "../components/PhoneFrame";
import { ChatBubble } from "../components/ChatBubble";
import { VoiceOver, Sfx } from "../components/VoiceOver";
import { colors } from "../theme";
import { fonts } from "../fonts";

const IconBadge: React.FC<{ emoji: string; top: number; left?: number; right?: number; delay: number }> = ({
  emoji,
  top,
  left,
  right,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 10, mass: 0.5 } });
  const scale = interpolate(s, [0, 1], [0, 1]);
  const opacity = interpolate(s, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        right,
        width: 74,
        height: 74,
        borderRadius: 74,
        background: colors.white,
        border: `2px solid ${colors.purpleLight}`,
        boxShadow: "0 16px 30px rgba(90,60,160,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 34,
        opacity,
        transform: `scale(${scale})`,
        zIndex: 6,
      }}
    >
      {emoji}
    </div>
  );
};

export const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleS = spring({ frame, fps, config: { damping: 200 } });
  const titleOpacity = interpolate(titleS, [0, 1], [0, 1]);
  const titleY = interpolate(titleS, [0, 1], [30, 0]);

  const captionS = spring({ frame: frame - 108, fps, config: { damping: 200 } });
  const captionOpacity = interpolate(captionS, [0, 1], [0, 1]);

  return (
    <AbsoluteFill>
      <AmbientBackground />
      <VoiceOver file="solution.wav" delay={10} />
      <Sfx file="notify.wav" delay={15} volume={0.4} />
      <Sfx file="notify.wav" delay={38} volume={0.4} />
      <Sfx file="notify.wav" delay={60} volume={0.4} />
      <Sfx file="notify.wav" delay={85} volume={0.4} />

      <IconBadge emoji="🎤" top={330} left={70} delay={13} />
      <IconBadge emoji="⌨️" top={950} right={70} delay={58} />

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
            CONHEÇA A SORAIA
          </div>
          <div style={{ fontFamily: fonts.headline, fontSize: 52, color: colors.ink, marginTop: 8 }}>
            SUA IA FINANCEIRA
          </div>
        </div>

        <PhoneFrame width={720}>
          <AbsoluteFill style={{ background: colors.screenBg, padding: "70px 24px 24px 24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <ChatBubble isAudio fromUser delay={15} bg={colors.whatsapp} />
              <ChatBubble
                fromUser={false}
                text="Anotado! Uber de R$45 em Transporte 🚗"
                delay={38}
                bg={colors.screenCard}
                color={colors.white}
              />
              <ChatBubble fromUser text="quanto eu já gastei esse mês?" delay={60} bg={colors.whatsapp} color="#04210f" />
              <ChatBubble
                fromUser={false}
                text="Você já gastou R$ 2.340 até agora 👀"
                delay={85}
                bg={colors.screenCard}
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
            color: colors.ink,
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
