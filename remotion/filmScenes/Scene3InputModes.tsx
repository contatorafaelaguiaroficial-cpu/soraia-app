import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CinematicBackground } from "../components/CinematicBackground";
import { CinematicHeadline } from "../components/CinematicHeadline";
import { PremiumPhone } from "../components/PremiumPhone";
import { Sfx } from "../components/VoiceOver";
import { PIcon, pc, WordmarkLogo } from "../premiumTheme";
import { fonts } from "../fonts";

const IconBadge: React.FC<{ icon: React.ReactNode; delay: number }> = ({ icon, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 11, mass: 0.5 } });
  return (
    <div
      style={{
        position: "absolute",
        top: -14,
        left: -14,
        width: 34,
        height: 34,
        borderRadius: 34,
        background: `linear-gradient(150deg, ${pc.gold}, ${pc.goldSoft})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: interpolate(s, [0, 1], [0, 1]),
        transform: `scale(${interpolate(s, [0, 1], [0, 1])})`,
        boxShadow: "0 8px 18px rgba(240,196,122,0.4)",
      }}
    >
      {icon}
    </div>
  );
};

const Bubble: React.FC<{ delay: number; children: React.ReactNode; icon: React.ReactNode }> = ({
  delay,
  children,
  icon,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 14, mass: 0.6 } });
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const x = interpolate(s, [0, 1], [40, 0], { extrapolateRight: "clamp" });
  const scale = interpolate(s, [0, 1], [0.85, 1], { extrapolateRight: "clamp" });

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 22 }}>
      <div
        style={{
          position: "relative",
          opacity,
          transform: `translateX(${x}px) scale(${scale})`,
          transformOrigin: "right center",
          maxWidth: "80%",
          background: "rgba(169,140,255,0.12)",
          border: "1px solid rgba(169,140,255,0.22)",
          borderRadius: 20,
          borderBottomRightRadius: 4,
          padding: "16px 20px",
        }}
      >
        <IconBadge icon={icon} delay={delay - 4} />
        {children}
      </div>
    </div>
  );
};

const Waveform: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 24 }}>
      {new Array(16).fill(0).map((_, i) => {
        const h = 5 + Math.abs(Math.sin(frame / 6 + i * 0.7)) * 18;
        return <div key={i} style={{ width: 3, height: h, borderRadius: 2, background: pc.ink, opacity: 0.85 }} />;
      })}
    </div>
  );
};

export const Scene3InputModes: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phoneS = spring({ frame, fps, config: { damping: 16, mass: 0.7 } });
  const phoneOpacity = interpolate(phoneS, [0, 1], [0, 1]);
  const phoneY = interpolate(phoneS, [0, 1], [50, 0]);

  return (
    <AbsoluteFill>
      <CinematicBackground durationInFrames={duration} glow="gold" />
      <Sfx file="notify.wav" delay={44} volume={0.4} />
      <Sfx file="notify.wav" delay={76} volume={0.4} />
      <Sfx file="notify.wav" delay={108} volume={0.4} />

      <AbsoluteFill style={{ alignItems: "center", padding: "120px 0 0 0" }}>
        <div style={{ marginBottom: 40 }}>
          <CinematicHeadline
            fontSize={58}
            startFrame={6}
            lines={[
              { text: "Envie por áudio,", variant: "bold" },
              { text: "foto ou texto.", variant: "accent" },
            ]}
          />
        </div>

        <div style={{ opacity: phoneOpacity, transform: `translateY(${phoneY}px)` }}>
          <PremiumPhone width={540} height={860}>
            <div style={{ padding: "48px 26px 0 26px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                <WordmarkLogo size={38} fontFamily={fonts.grotesk} />
              </div>

              <Bubble delay={40} icon={<PIcon.Mic color="#241705" />}>
                <Waveform />
              </Bubble>

              <Bubble delay={72} icon={<PIcon.Camera color="#241705" />}>
                <div
                  style={{
                    width: 160,
                    height: 100,
                    borderRadius: 12,
                    background: "linear-gradient(160deg, rgba(240,196,122,0.25), rgba(136,101,232,0.2))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PIcon.Receipt />
                </div>
              </Bubble>

              <Bubble delay={104} icon={<PIcon.Type color="#241705" />}>
                <span style={{ fontFamily: fonts.body, fontSize: 18, color: pc.ink }}>
                  gastei 45 reais no mercado
                </span>
              </Bubble>
            </div>
          </PremiumPhone>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
