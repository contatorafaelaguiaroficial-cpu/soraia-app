import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CinematicBackground } from "../components/CinematicBackground";
import { CinematicHeadline } from "../components/CinematicHeadline";
import { Captions } from "../components/Captions";
import { VoiceOver, Sfx } from "../components/VoiceOver";
import { PremiumPhone } from "../components/PremiumPhone";
import { PIcon, pc, WordmarkLogo } from "../premiumTheme";
import { fonts } from "../fonts";

const Waveform: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 26, opacity }}>
      {new Array(18).fill(0).map((_, i) => {
        const h = 5 + Math.abs(Math.sin(frame / 5 + i * 0.7)) * 20;
        return <div key={i} style={{ width: 3, height: h, borderRadius: 2, background: pc.ink, opacity: 0.9 }} />;
      })}
    </div>
  );
};

export const Scene2Speed: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const morphAt = 58;
  const morphS = spring({ frame: frame - morphAt, fps, config: { damping: 16, mass: 0.6 } });
  const morphProgress = interpolate(morphS, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const bubbleS = spring({ frame: frame - 20, fps, config: { damping: 14, mass: 0.6 } });
  const bubbleOpacity = interpolate(bubbleS, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const bubbleScale = interpolate(bubbleS, [0, 1], [0.7, 1], { extrapolateLeft: "clamp" });

  const catS = spring({ frame: frame - morphAt - 14, fps, config: { damping: 200 } });
  const catOpacity = interpolate(catS, [0, 1], [0, 1], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill>
      <CinematicBackground durationInFrames={duration} glow="purple" />
      <VoiceOver file="speed/s2.wav" delay={6} />
      <Sfx file="notify.wav" delay={20} volume={0.4} />
      <Sfx file="success.wav" delay={morphAt} volume={0.45} />

      <AbsoluteFill style={{ alignItems: "center", padding: "130px 0 0 0" }}>
        <CinematicHeadline
          fontSize={64}
          startFrame={4}
          lines={[
            { text: "Falou. Enviou.", variant: "bold" },
            { text: "Registrou.", variant: "accent" },
          ]}
        />

        <div style={{ marginTop: 70 }}>
          <PremiumPhone width={540} height={760}>
            <div style={{ padding: "50px 28px 0 28px" }}>
              <WordmarkLogo size={36} fontFamily={fonts.grotesk} />

              <div style={{ marginTop: 40, position: "relative", minHeight: 110 }}>
                {/* audio bubble, fades out as it morphs */}
                <div
                  style={{
                    opacity: bubbleOpacity * (1 - morphProgress),
                    transform: `scale(${bubbleScale}) translateY(${-morphProgress * 20}px)`,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(63,209,124,0.16)",
                      border: "1px solid rgba(63,209,124,0.3)",
                      borderRadius: 20,
                      borderBottomRightRadius: 4,
                      padding: "16px 20px",
                    }}
                  >
                    <Waveform opacity={1} />
                  </div>
                </div>

                {/* registered expense row, fades in as morph completes */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    opacity: morphProgress,
                    transform: `translateY(${(1 - morphProgress) * 20}px) scale(${0.85 + morphProgress * 0.15})`,
                    background: pc.panel,
                    borderTop: "1px solid rgba(255,255,255,0.09)",
                    borderRadius: 20,
                    padding: "20px 22px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 42,
                          background: "linear-gradient(160deg, rgba(240,196,122,0.2), rgba(240,196,122,0.05))",
                          border: "1px solid rgba(240,196,122,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <PIcon.Cart />
                      </div>
                      <div>
                        <div style={{ fontFamily: fonts.grotesk, fontSize: 19, fontWeight: 700, color: pc.ink }}>
                          Mercado
                        </div>
                        <div
                          style={{
                            opacity: catOpacity,
                            fontFamily: fonts.body,
                            fontSize: 14,
                            color: pc.goldSoft,
                          }}
                        >
                          Alimentação
                        </div>
                      </div>
                    </div>
                    <span style={{ fontFamily: fonts.grotesk, fontSize: 20, fontWeight: 800, color: pc.ink }}>
                      R$ 185,40
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </PremiumPhone>
        </div>
      </AbsoluteFill>

      <Captions
        text="Envie um áudio e a Soraia transforma a informação em um registro organizado."
        from={6}
        durationInFrames={110}
      />
    </AbsoluteFill>
  );
};
