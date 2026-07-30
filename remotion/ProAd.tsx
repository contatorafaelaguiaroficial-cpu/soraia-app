import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "./fonts";
import { Sfx } from "./components/VoiceOver";

const proColor = {
  purpleTop: "#7C1FE0",
  purpleBottom: "#4B0F99",
  purpleDark: "#3B0B7A",
  white: "#ffffff",
  ink: "#241454",
  muted: "rgba(255,255,255,0.7)",
  green: "#2ecc71",
  red: "#ff6b6b",
};

const Diamonds: React.FC = () => (
  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
    <defs>
      <pattern id="diamonds" width="140" height="140" patternTransform="rotate(20)" patternUnits="userSpaceOnUse">
        <path
          d="M70 10 L120 70 L70 130 L20 70 Z"
          fill="none"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="10"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#diamonds)" />
  </svg>
);

const ClockIcon: React.FC = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={proColor.white} strokeWidth="1.8" />
    <path d="M12 7V12L15.5 14" stroke={proColor.white} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ListIcon: React.FC = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="4" width="16" height="16" rx="2.5" stroke={proColor.white} strokeWidth="1.8" />
    <path d="M8 9H16M8 12.5H16M8 16H13" stroke={proColor.white} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const CheckIcon: React.FC = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={proColor.white} strokeWidth="1.8" />
    <path d="M8 12.3L10.8 15L16 9.5" stroke={proColor.white} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
    <path d="M4 12L12 4M12 4H5.5M12 4V10.5" stroke={proColor.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const entries = [
  { label: "Salário", value: "+ R$ 5.120,00", positive: true },
  { label: "Aluguel", value: "- R$ 1.850,00", positive: false },
  { label: "Mercado", value: "- R$ 620,40", positive: false },
  { label: "Freelance", value: "+ R$ 980,00", positive: true },
];

const ScreenList: React.FC = () => (
  <div style={{ padding: "58px 22px 0 22px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 34,
          background: `linear-gradient(150deg, ${proColor.purpleTop}, ${proColor.purpleBottom})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontFamily: fonts.grotesk, fontSize: 15, fontWeight: 800, color: proColor.white }}>S</span>
      </div>
      <span style={{ fontFamily: fonts.grotesk, fontSize: 17, fontWeight: 700, color: proColor.ink }}>
        Soraia Pro
      </span>
    </div>
    <div style={{ fontFamily: fonts.body, fontSize: 13, color: "#8b84a0", letterSpacing: 1.5, marginBottom: 4 }}>
      SALDO ATUAL
    </div>
    <div style={{ fontFamily: fonts.grotesk, fontSize: 34, fontWeight: 800, color: proColor.ink, marginBottom: 20 }}>
      R$ 12.480,60
    </div>
    {entries.map((e, i) => (
      <div
        key={i}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "13px 0",
          borderBottom: "1px solid #efeaf7",
        }}
      >
        <span style={{ fontFamily: fonts.grotesk, fontSize: 16, fontWeight: 700, color: proColor.ink }}>
          {e.label}
        </span>
        <span
          style={{
            fontFamily: fonts.grotesk,
            fontSize: 16,
            fontWeight: 800,
            color: e.positive ? "#12a150" : "#e0435b",
          }}
        >
          {e.value}
        </span>
      </div>
    ))}
  </div>
);

const donutSegments = [
  { frac: 0.36, color: proColor.purpleTop, label: "Moradia" },
  { frac: 0.28, color: "#f0c47a", label: "Alimentação" },
  { frac: 0.22, color: "#ff8fb3", label: "Transporte" },
  { frac: 0.14, color: "#39c98a", label: "Lazer" },
];

const ScreenChart: React.FC<{ active: boolean }> = ({ active }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const radius = 62;
  const stroke = 20;
  const c = 2 * Math.PI * radius;
  let cumulative = 0;

  return (
    <div style={{ padding: "58px 22px 0 22px" }}>
      <div style={{ fontFamily: fonts.grotesk, fontSize: 17, fontWeight: 700, color: proColor.ink, marginBottom: 18 }}>
        Despesas por categoria
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <svg width={160} height={160} viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="#f1eef8" strokeWidth={stroke} />
          {donutSegments.map((seg, i) => {
            const s = spring({ frame: (active ? frame : -1) - i * 6, fps, config: { damping: 200 } });
            const progress = interpolate(s, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const dash = progress * seg.frac * c;
            const el = (
              <circle
                key={i}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${c - dash}`}
                strokeDashoffset={-cumulative * c}
                transform="rotate(-90 80 80)"
              />
            );
            cumulative += seg.frac;
            return el;
          })}
        </svg>
        <div>
          {donutSegments.map((seg, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 9, height: 9, borderRadius: 9, background: seg.color }} />
              <span style={{ fontFamily: fonts.body, fontSize: 14, color: proColor.ink }}>{seg.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      width: 480,
      height: 860,
      borderRadius: 52,
      padding: 10,
      background: "#1a1a24",
      boxShadow: "0 50px 90px rgba(0,0,0,0.45)",
      position: "relative",
    }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 42,
        background: proColor.white,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 14,
          left: "50%",
          transform: "translateX(-50%)",
          width: 110,
          height: 26,
          borderRadius: 18,
          background: "#1a1a24",
          zIndex: 6,
        }}
      />
      {children}
    </div>
  </div>
);

const BenefitItem: React.FC<{ icon: React.ReactNode; label: string; delay: number }> = ({ icon, label, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const y = interpolate(s, [0, 1], [16, 0], { extrapolateLeft: "clamp" });

  return (
    <div style={{ opacity, transform: `translateY(${y}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, flex: 1 }}>
      {icon}
      <span style={{ fontFamily: fonts.grotesk, fontSize: 15, fontWeight: 700, color: proColor.white, letterSpacing: 1 }}>
        {label}
      </span>
    </div>
  );
};

const HeadlineLine: React.FC<{ text: string; delay: number; big?: boolean }> = ({ text, delay, big }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 16, mass: 0.7 } });
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const x = interpolate(s, [0, 1], [-40, 0], { extrapolateLeft: "clamp" });

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px)`,
        fontFamily: fonts.condensed,
        fontSize: big ? 108 : 96,
        lineHeight: 0.98,
        color: proColor.white,
        letterSpacing: 1,
        textShadow: "0 6px 18px rgba(0,0,0,0.2)",
      }}
    >
      {text}
    </div>
  );
};

export const ProAd: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgS = spring({ frame, fps, config: { damping: 200 } });
  const bgScale = interpolate(bgS, [0, 1], [1.08, 1]);

  const phoneS = spring({ frame: frame - 34, fps, config: { damping: 13, mass: 0.7 } });
  const phoneOpacity = interpolate(phoneS, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const phoneX = interpolate(phoneS, [0, 1], [120, 0], { extrapolateLeft: "clamp" });
  const phoneRotate = interpolate(phoneS, [0, 1], [24, 12], { extrapolateLeft: "clamp" });

  const badgeS = spring({ frame: frame - 58, fps, config: { damping: 11, mass: 0.5 } });
  const badgeOpacity = interpolate(badgeS, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const badgeScale = interpolate(badgeS, [0, 1], [0.5, 1], { extrapolateLeft: "clamp" });

  const barS = spring({ frame: frame - 96, fps, config: { damping: 200 } });
  const barOpacity = interpolate(barS, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const barY = interpolate(barS, [0, 1], [24, 0], { extrapolateLeft: "clamp" });

  const ctaS = spring({ frame: frame - 118, fps, config: { damping: 200 } });
  const ctaOpacity = interpolate(ctaS, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const ctaPulse = 1 + Math.sin(frame / 10) * 0.025;

  // screen swap: list first, then donut chart, holding each ~2.3s
  const swapCycle = 70;
  const showChart = Math.floor(Math.max(0, frame - 40) / swapCycle) % 2 === 1;
  const swapLocal = (frame - 40) % swapCycle;
  const swapOpacity = interpolate(swapLocal, [0, 10, swapCycle - 10, swapCycle], [1, 1, 1, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Audio src={staticFile("remotion/sfx/ambient-speed.wav")} volume={0.32} />
      <Sfx file="pop.wav" delay={0} volume={0.3} />
      <Sfx file="whoosh.wav" delay={34} volume={0.5} />
      <Sfx file="success.wav" delay={58} volume={0.4} />
      <Sfx file="pop.wav" delay={96} volume={0.3} />
      <Sfx file="notify.wav" delay={118} volume={0.35} />

      <AbsoluteFill
        style={{
          transform: `scale(${bgScale})`,
          background: `linear-gradient(155deg, ${proColor.purpleTop}, ${proColor.purpleBottom})`,
        }}
      >
        <Diamonds />
      </AbsoluteFill>

      <div style={{ position: "absolute", top: 130, left: 64, display: "flex", flexDirection: "column" }}>
        <HeadlineLine text="CONTROLE" delay={4} />
        <HeadlineLine text="SUA VIDA" delay={12} />
        <HeadlineLine text="FINANCEIRA" delay={20} big />
      </div>

      <div
        style={{
          position: "absolute",
          top: 250,
          right: -40,
          opacity: phoneOpacity,
          transform: `translateX(${phoneX}px) rotate(${phoneRotate}deg)`,
        }}
      >
        <PhoneFrame>
          <div style={{ opacity: swapOpacity }}>
            {showChart ? <ScreenChart active={showChart} /> : <ScreenList />}
          </div>
        </PhoneFrame>
      </div>

      <div
        style={{
          position: "absolute",
          top: 700,
          right: 90,
          opacity: badgeOpacity,
          transform: `scale(${badgeScale})`,
          width: 168,
          height: 168,
          borderRadius: 168,
          background: proColor.white,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 24px 50px rgba(0,0,0,0.35)",
        }}
      >
        <span style={{ fontFamily: fonts.grotesk, fontSize: 14, fontWeight: 700, color: proColor.purpleTop, letterSpacing: 1 }}>
          APENAS
        </span>
        <span style={{ fontFamily: fonts.condensed, fontSize: 52, color: proColor.purpleTop, lineHeight: 1 }}>
          19<span style={{ fontSize: 24 }}>,90</span>
        </span>
        <span style={{ fontFamily: fonts.grotesk, fontSize: 13, fontWeight: 700, color: "#9b8fc7" }}>POR MÊS</span>
      </div>

      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 1290,
          opacity: barOpacity,
          transform: `translateY(${barY}px)`,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <BenefitItem icon={<CheckIcon />} label="REGISTRA" delay={96} />
        <BenefitItem icon={<ListIcon />} label="CONTROLA" delay={104} />
        <BenefitItem icon={<ClockIcon />} label="SIMPLIFICA" delay={112} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          bottom: 110,
          opacity: ctaOpacity,
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div
          style={{
            transform: `scale(${ctaPulse})`,
            flex: 1,
            background: proColor.white,
            borderRadius: 100,
            padding: "22px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: "0 20px 44px rgba(0,0,0,0.3)",
          }}
        >
          <span style={{ fontFamily: fonts.condensed, fontSize: 28, letterSpacing: 1, color: proColor.ink }}>
            USAR AGORA!
          </span>
          <ArrowIcon />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 64,
          bottom: 56,
          opacity: ctaOpacity,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 9,
            background: proColor.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontFamily: fonts.grotesk, fontSize: 13, fontWeight: 800, color: proColor.purpleTop }}>
            S
          </span>
        </div>
        <span style={{ fontFamily: fonts.grotesk, fontSize: 18, fontWeight: 700, color: proColor.white }}>
          soraia pro
        </span>
      </div>
    </AbsoluteFill>
  );
};
