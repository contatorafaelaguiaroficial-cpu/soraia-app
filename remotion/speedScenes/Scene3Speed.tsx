import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CinematicBackground } from "../components/CinematicBackground";
import { CinematicHeadline } from "../components/CinematicHeadline";
import { Captions } from "../components/Captions";
import { VoiceOver, Sfx } from "../components/VoiceOver";
import { PremiumPhone } from "../components/PremiumPhone";
import { PIcon, pc, WordmarkLogo } from "../premiumTheme";
import { fonts } from "../fonts";

const Bubble: React.FC<{ delay: number; align: "left" | "right"; children: React.ReactNode }> = ({
  delay,
  align,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 14, mass: 0.6 } });
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const x = interpolate(s, [0, 1], [align === "right" ? 30 : -30, 0], { extrapolateRight: "clamp" });
  const scale = interpolate(s, [0, 1], [0.85, 1], { extrapolateRight: "clamp" });

  return (
    <div style={{ display: "flex", justifyContent: align === "right" ? "flex-end" : "flex-start", marginBottom: 18 }}>
      <div style={{ opacity, transform: `translateX(${x}px) scale(${scale})` }}>{children}</div>
    </div>
  );
};

export const Scene3Speed: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tagS = spring({ frame: frame - 68, fps, config: { damping: 11, mass: 0.5 } });
  const tagOpacity = interpolate(tagS, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const tagScale = interpolate(tagS, [0, 1], [0.6, 1], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill>
      <CinematicBackground durationInFrames={duration} glow="gold" />
      <VoiceOver file="speed/s3.wav" delay={6} />
      <Sfx file="notify.wav" delay={20} volume={0.38} />
      <Sfx file="notify.wav" delay={44} volume={0.38} />
      <Sfx file="success.wav" delay={68} volume={0.42} />

      <AbsoluteFill style={{ alignItems: "center", padding: "130px 0 0 0" }}>
        <CinematicHeadline
          fontSize={58}
          startFrame={4}
          lines={[
            { text: "Foto ou texto", variant: "bold" },
            { text: "também funcionam.", variant: "accent" },
          ]}
        />

        <div style={{ marginTop: 60 }}>
          <PremiumPhone width={540} height={820}>
            <div style={{ padding: "50px 28px 0 28px" }}>
              <WordmarkLogo size={36} fontFamily={fonts.grotesk} />

              <div style={{ marginTop: 34 }}>
                <Bubble delay={20} align="right">
                  <div
                    style={{
                      width: 168,
                      height: 108,
                      borderRadius: 16,
                      background: "linear-gradient(160deg, rgba(240,196,122,0.22), rgba(136,101,232,0.18))",
                      border: "1px solid rgba(240,196,122,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PIcon.Receipt />
                  </div>
                </Bubble>

                <Bubble delay={44} align="right">
                  <div
                    style={{
                      background: "rgba(169,140,255,0.12)",
                      border: "1px solid rgba(169,140,255,0.22)",
                      borderRadius: 20,
                      borderBottomRightRadius: 4,
                      padding: "16px 20px",
                      maxWidth: 320,
                    }}
                  >
                    <span style={{ fontFamily: fonts.body, fontSize: 19, color: pc.ink }}>
                      Recebi R$ 2.500 hoje.
                    </span>
                  </div>
                </Bubble>

                <div
                  style={{
                    opacity: tagOpacity,
                    transform: `scale(${tagScale})`,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      background: "rgba(63,209,124,0.14)",
                      border: "1px solid rgba(63,209,124,0.3)",
                      borderRadius: 100,
                      padding: "10px 16px",
                    }}
                  >
                    <PIcon.TrendUp />
                    <span style={{ fontFamily: fonts.grotesk, fontSize: 16, fontWeight: 700, color: pc.whatsapp }}>
                      Receita detectada · +R$ 2.500,00
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </PremiumPhone>
        </div>
      </AbsoluteFill>

      <Captions text="Também é possível registrar tudo por foto ou texto." from={6} durationInFrames={83} />
    </AbsoluteFill>
  );
};
