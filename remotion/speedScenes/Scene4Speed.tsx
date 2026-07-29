import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CinematicBackground } from "../components/CinematicBackground";
import { CinematicHeadline } from "../components/CinematicHeadline";
import { Captions } from "../components/Captions";
import { VoiceOver, Sfx } from "../components/VoiceOver";
import { PremiumPhone } from "../components/PremiumPhone";
import { PIcon, pc, WordmarkLogo } from "../premiumTheme";
import { fonts } from "../fonts";

const StatTile: React.FC<{
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  delay: number;
  from: "left" | "right";
}> = ({ label, value, icon, color, delay, from }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 15, mass: 0.6 } });
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const x = interpolate(s, [0, 1], [from === "left" ? -30 : 30, 0], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        flex: 1,
        opacity,
        transform: `translateX(${x}px)`,
        background: pc.panel,
        borderTop: "1px solid rgba(255,255,255,0.09)",
        borderRadius: 20,
        padding: "18px 20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        {icon}
        <span style={{ fontFamily: fonts.body, fontSize: 14, color: pc.faint }}>{label}</span>
      </div>
      <div style={{ fontFamily: fonts.grotesk, fontSize: 22, fontWeight: 800, color }}>{value}</div>
    </div>
  );
};

const CatRow: React.FC<{ label: string; amount: string; color: string; delay: number }> = ({
  label,
  amount,
  color,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const x = interpolate(s, [0, 1], [16, 0]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        opacity,
        transform: `translateX(${x}px)`,
        padding: "9px 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: 8, background: color }} />
        <span style={{ fontFamily: fonts.grotesk, fontSize: 17, fontWeight: 700, color: pc.ink }}>{label}</span>
      </div>
      <span style={{ fontFamily: fonts.grotesk, fontSize: 17, fontWeight: 700, color: pc.mutedInk }}>{amount}</span>
    </div>
  );
};

export const Scene4Speed: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const balS = spring({ frame: frame - 8, fps, config: { damping: 200 } });
  const balOpacity = interpolate(balS, [0, 1], [0, 1]);

  return (
    <AbsoluteFill>
      <CinematicBackground durationInFrames={duration} glow="mixed" />
      <VoiceOver file="speed/s4.wav" delay={6} />
      <Sfx file="pop.wav" delay={26} volume={0.3} />
      <Sfx file="pop.wav" delay={60} volume={0.28} />

      <AbsoluteFill style={{ alignItems: "center", padding: "110px 0 0 0" }}>
        <CinematicHeadline
          fontSize={56}
          startFrame={4}
          lines={[
            { text: "Acompanhe tudo", variant: "bold" },
            { text: "em um só lugar.", variant: "accent" },
          ]}
        />

        <div style={{ marginTop: 46 }}>
          <PremiumPhone width={560} height={960}>
            <div style={{ padding: "48px 28px 0 28px" }}>
              <WordmarkLogo size={34} fontFamily={fonts.grotesk} />

              <div style={{ opacity: balOpacity, marginTop: 26 }}>
                <div style={{ fontFamily: fonts.grotesk, fontSize: 13, color: pc.faint, letterSpacing: 2 }}>
                  SALDO DO MÊS
                </div>
                <div
                  style={{
                    fontFamily: fonts.grotesk,
                    fontSize: 40,
                    fontWeight: 800,
                    letterSpacing: -1,
                    color: pc.ink,
                  }}
                >
                  R$ 2.980,60
                </div>
              </div>

              <div style={{ display: "flex", gap: 14, marginTop: 20, marginBottom: 22 }}>
                <StatTile
                  label="Receitas"
                  value="R$ 6.240"
                  icon={<PIcon.TrendUp />}
                  color={pc.whatsapp}
                  delay={26}
                  from="left"
                />
                <StatTile
                  label="Despesas"
                  value="R$ 3.259"
                  icon={<PIcon.TrendDown />}
                  color="#e39b9b"
                  delay={34}
                  from="right"
                />
              </div>

              <div
                style={{
                  background: pc.panel,
                  borderTop: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: 22,
                  padding: "6px 22px 4px 22px",
                }}
              >
                <CatRow label="Moradia" amount="R$ 1.290" color={pc.purple} delay={54} />
                <CatRow label="Alimentação" amount="R$ 980" color={pc.gold} delay={64} />
                <CatRow label="Transporte" amount="R$ 640" color="#e39bb0" delay={74} />
                <CatRow label="Lazer" amount="R$ 349" color={pc.purpleDeep} delay={84} />
              </div>
            </div>
          </PremiumPhone>
        </div>
      </AbsoluteFill>

      <Captions
        text="Acompanhe receitas, despesas e movimentações em uma visão simples."
        from={6}
        durationInFrames={113}
      />
    </AbsoluteFill>
  );
};
