import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CinematicBackground } from "../components/CinematicBackground";
import { CinematicHeadline } from "../components/CinematicHeadline";
import { PremiumPhone } from "../components/PremiumPhone";
import { DonutChart } from "../components/DonutChart";
import { Sfx } from "../components/VoiceOver";
import { pc, PIcon } from "../premiumTheme";
import { fonts } from "../fonts";

const legend = [
  { label: "Moradia", value: "40%", color: pc.purple },
  { label: "Alimentação", value: "35%", color: pc.gold },
  { label: "Lazer", value: "25%", color: "#e39bb0" },
];

const LegendRow: React.FC<{ label: string; value: string; color: string; delay: number }> = ({
  label,
  value,
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
        padding: "10px 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 9, height: 9, borderRadius: 9, background: color }} />
        <span style={{ fontFamily: fonts.grotesk, fontSize: 18, fontWeight: 700, color: pc.ink }}>{label}</span>
      </div>
      <span style={{ fontFamily: fonts.grotesk, fontSize: 18, fontWeight: 700, color: pc.mutedInk }}>{value}</span>
    </div>
  );
};

const GoalPanel: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const width = interpolate(s, [0, 1], [0, 68], { extrapolateLeft: "clamp" });

  return (
    <div
      style={{
        opacity,
        marginTop: 20,
        background: pc.panel,
        borderTop: "1px solid rgba(255,255,255,0.09)",
        borderRadius: 24,
        padding: "22px 26px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <PIcon.Target />
          <span style={{ fontFamily: fonts.grotesk, fontSize: 17, fontWeight: 700, color: pc.ink }}>
            Meta: Viagem
          </span>
        </div>
        <span style={{ fontFamily: fonts.grotesk, fontSize: 15, fontWeight: 700, color: pc.goldSoft }}>68%</span>
      </div>
      <div style={{ width: "100%", height: 10, borderRadius: 10, background: "rgba(255,255,255,0.08)" }}>
        <div
          style={{
            width: `${width}%`,
            height: "100%",
            borderRadius: 10,
            background: `linear-gradient(90deg, ${pc.gold}, ${pc.purple})`,
          }}
        />
      </div>
    </div>
  );
};

export const Scene4Dashboard: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phoneS = spring({ frame, fps, config: { damping: 16, mass: 0.7 } });
  const phoneOpacity = interpolate(phoneS, [0, 1], [0, 1]);
  const phoneY = interpolate(phoneS, [0, 1], [50, 0]);

  const balanceS = spring({ frame: frame - 14, fps, config: { damping: 200 } });
  const balanceOpacity = interpolate(balanceS, [0, 1], [0, 1]);

  return (
    <AbsoluteFill>
      <CinematicBackground durationInFrames={duration} glow="mixed" />
      <Sfx file="pop.wav" delay={40} volume={0.28} />

      <AbsoluteFill style={{ alignItems: "center", padding: "110px 0 0 0" }}>
        <div style={{ marginBottom: 36 }}>
          <CinematicHeadline
            fontSize={58}
            startFrame={6}
            lines={[
              { text: "Tudo organizado", variant: "bold" },
              { text: "em um só lugar.", variant: "accent" },
            ]}
          />
        </div>

        <div style={{ opacity: phoneOpacity, transform: `translateY(${phoneY}px)` }}>
          <PremiumPhone width={560} height={980}>
            <div style={{ padding: "48px 30px 0 30px" }}>
              <div
                style={{
                  opacity: balanceOpacity,
                  fontFamily: fonts.grotesk,
                  fontSize: 13,
                  color: pc.faint,
                  letterSpacing: 2,
                }}
              >
                SALDO DISPONÍVEL
              </div>
              <div
                style={{
                  opacity: balanceOpacity,
                  fontFamily: fonts.grotesk,
                  fontSize: 42,
                  fontWeight: 800,
                  letterSpacing: -1.2,
                  color: pc.ink,
                  marginBottom: 24,
                }}
              >
                R$ 4.260,00
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 26,
                  background: pc.panel,
                  borderTop: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: 24,
                  padding: "24px 26px",
                }}
              >
                <DonutChart
                  size={140}
                  baseDelay={28}
                  segments={[
                    { frac: 0.4, color: pc.purple },
                    { frac: 0.35, color: pc.gold },
                    { frac: 0.25, color: "#e39bb0" },
                  ]}
                />
                <div style={{ flex: 1 }}>
                  {legend.map((l, i) => (
                    <LegendRow key={i} {...l} delay={40 + i * 10} />
                  ))}
                </div>
              </div>

              <GoalPanel delay={78} />
            </div>
          </PremiumPhone>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
