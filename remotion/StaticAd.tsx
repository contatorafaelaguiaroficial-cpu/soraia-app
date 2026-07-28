import { AbsoluteFill } from "remotion";
import { fonts } from "./fonts";

const c = {
  bg: "#08070c",
  ink: "#f5f3f7",
  mutedInk: "#b9b3c4",
  faint: "#726c80",
  purple: "#a98cff",
  purpleDeep: "#8865e8",
  gold: "#f0c47a",
  goldSoft: "#e8b45a",
  whatsapp: "#3fd17c",
  hairline: "rgba(245,243,247,0.09)",
  panel: "rgba(255,255,255,0.035)",
};

const Grain: React.FC = () => (
  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.05, mixBlendMode: "overlay" }}>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain)" />
  </svg>
);

const Icon = {
  Signal: () => (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
      <rect x="0" y="7" width="3" height="5" rx="1" fill={c.ink} />
      <rect x="5" y="4.5" width="3" height="7.5" rx="1" fill={c.ink} />
      <rect x="10" y="2.5" width="3" height="9.5" rx="1" fill={c.ink} />
      <rect x="15" y="0" width="3" height="12" rx="1" fill={c.ink} opacity="0.35" />
    </svg>
  ),
  Wifi: () => (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
      <path d="M1 4.5C5.5 0.2 10.5 0.2 15 4.5" stroke={c.ink} strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
      <path d="M3.5 7.2C6.7 4.2 9.3 4.2 12.5 7.2" stroke={c.ink} strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
      <circle cx="8" cy="10.2" r="1.3" fill={c.ink} />
    </svg>
  ),
  Battery: () => (
    <svg width="26" height="13" viewBox="0 0 26 13" fill="none">
      <rect x="0.75" y="0.75" width="21.5" height="11.5" rx="3.25" stroke={c.ink} strokeOpacity="0.5" strokeWidth="1.2" />
      <rect x="2.5" y="2.5" width="18" height="8" rx="1.8" fill={c.ink} />
      <rect x="23" y="4" width="2" height="5" rx="1" fill={c.ink} opacity="0.5" />
    </svg>
  ),
  Scooter: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="5.5" cy="18" r="2.4" stroke={c.gold} strokeWidth="1.6" />
      <circle cx="17.5" cy="18" r="2.4" stroke={c.gold} strokeWidth="1.6" />
      <path d="M5.5 18H10L13.5 9H17" stroke={c.gold} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 9H16.5M15.2 6H18.5" stroke={c.gold} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M10 18H17.5" stroke={c.gold} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  Cart: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 4H5.2L7.6 15.2A2 2 0 0 0 9.55 16.8H18A2 2 0 0 0 19.9 15.3L21.5 8.2H6.2" stroke={c.gold} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="20" r="1.4" fill={c.gold} />
      <circle cx="17.5" cy="20" r="1.4" fill={c.gold} />
    </svg>
  ),
  Car: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 16V12.5L6 7.5H18L20 12.5V16" stroke={c.gold} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16H20V17.6A1 1 0 0 1 19 18.6H17.4A1 1 0 0 1 16.4 17.6V16M4 16V17.6A1 1 0 0 0 5 18.6H6.6A1 1 0 0 0 7.6 17.6V16" stroke={c.gold} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4 12.5H20" stroke={c.gold} strokeWidth="1.6" />
      <circle cx="8" cy="14.3" r="0.9" fill={c.gold} />
      <circle cx="16" cy="14.3" r="0.9" fill={c.gold} />
    </svg>
  ),
  Mic: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="9" y="2.5" width="6" height="11" rx="3" stroke="#0a1a10" strokeWidth="1.6" />
      <path d="M5.5 11.5A6.5 6.5 0 0 0 18.5 11.5" stroke="#0a1a10" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 18V21.5" stroke="#0a1a10" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  ArrowUpRight: ({ color = c.gold }: { color?: string }) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 12L12 4M12 4H5.5M12 4V10.5" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Whatsapp: ({ size = 14, color = c.whatsapp }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C6.48 2 2 6.36 2 11.74C2 13.6 2.52 15.34 3.44 16.83L2.5 22L7.94 20.94C9.34 21.63 10.92 22 12 22C17.52 22 22 17.64 22 12.26C22 6.88 17.52 2 12 2Z"
        fill={color}
        opacity="0.16"
      />
      <path
        d="M8.5 9.3C8.7 8.6 9.1 8.6 9.5 8.6C9.7 8.6 9.9 8.6 10.05 9C10.2 9.4 10.55 10.3 10.6 10.4C10.65 10.5 10.7 10.65 10.6 10.8C10.35 11.25 10 11.4 10.2 11.75C10.9 12.95 11.7 13.5 12.85 14C13 14.05 13.15 14 13.25 13.9C13.5 13.6 13.75 13.15 14 12.85C14.15 12.7 14.35 12.7 14.5 12.75C14.75 12.85 15.9 13.4 16.15 13.55C16.3 13.6 16.4 13.65 16.45 13.75C16.5 13.95 16.5 14.5 16.2 15.1C15.9 15.7 14.85 16.25 14.35 16.3C13.6 16.4 13.15 16.35 12 15.9C10.4 15.3 9.05 14.1 8 12.6C7.5 11.9 7 11.05 7 10.15C7 9.5 7.2 9 7.6 8.6"
        fill={color}
      />
    </svg>
  ),
};

const CategoryRow: React.FC<{ icon: React.ReactNode; label: string; amount: string; last?: boolean }> = ({
  icon,
  label,
  amount,
  last,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "17px 0",
      borderBottom: last ? "none" : `1px solid ${c.hairline}`,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 42,
          background: "linear-gradient(160deg, rgba(240,196,122,0.16), rgba(240,196,122,0.04))",
          border: `1px solid rgba(240,196,122,0.18)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <div style={{ fontFamily: fonts.grotesk, fontSize: 20, color: c.ink, fontWeight: 700, letterSpacing: -0.2 }}>
        {label}
      </div>
    </div>
    <div
      style={{
        fontFamily: fonts.grotesk,
        fontSize: 20,
        color: c.mutedInk,
        fontWeight: 700,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {amount}
    </div>
  </div>
);

export const StaticAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: c.bg, overflow: "hidden" }}>
      {/* depth: vignette + soft directional glows */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 90% at 78% 8%, rgba(240,196,122,0.10), transparent 55%), radial-gradient(90% 70% at 4% 96%, rgba(136,101,232,0.16), transparent 55%), radial-gradient(140% 120% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <Grain />

      {/* editorial side tag */}
      <div
        style={{
          position: "absolute",
          left: 26,
          top: "50%",
          transform: "translateY(-50%) rotate(-90deg)",
          transformOrigin: "left center",
          fontFamily: fonts.grotesk,
          fontSize: 13,
          letterSpacing: 4,
          color: c.faint,
          whiteSpace: "nowrap",
        }}
      >
        SORAIA — FINANÇAS COM IA
      </div>

      {/* wordmark */}
      <div style={{ position: "absolute", top: 66, left: 76, display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: `linear-gradient(150deg, ${c.purple}, ${c.purpleDeep})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 16px rgba(136,101,232,0.4), inset 0 1px 0 rgba(255,255,255,0.25)",
          }}
        >
          <span style={{ fontFamily: fonts.grotesk, fontSize: 17, fontWeight: 800, color: c.ink }}>S</span>
        </div>
        <span style={{ fontFamily: fonts.grotesk, fontSize: 20, fontWeight: 700, letterSpacing: 0.5, color: c.ink }}>
          soraia
        </span>
      </div>

      {/* headline block */}
      <div style={{ position: "absolute", top: 168, left: 76, width: 430 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
          <div style={{ width: 22, height: 1.5, background: c.gold }} />
          <span style={{ fontFamily: fonts.grotesk, fontSize: 13, letterSpacing: 2.5, color: c.goldSoft, fontWeight: 700 }}>
            ASSISTENTE FINANCEIRA COM IA
          </span>
        </div>

        <div
          style={{
            fontFamily: fonts.grotesk,
            fontWeight: 800,
            fontSize: 62,
            lineHeight: 1.04,
            letterSpacing: -1.8,
            color: c.ink,
          }}
        >
          Pra onde seu
          <br />
          dinheiro foi
        </div>
        <div
          style={{
            fontFamily: fonts.serif,
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: 62,
            lineHeight: 1.1,
            letterSpacing: -0.5,
            backgroundImage: `linear-gradient(95deg, ${c.gold}, ${c.purple})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            marginTop: 2,
          }}
        >
          esse mês?
        </div>

        <div
          style={{
            fontFamily: fonts.body,
            fontWeight: 400,
            fontSize: 21,
            lineHeight: 1.55,
            color: c.mutedInk,
            marginTop: 26,
            maxWidth: 380,
          }}
        >
          A Soraia organiza e categoriza seus gastos automaticamente — direto na conversa do WhatsApp.
        </div>
      </div>

      {/* phone mockup */}
      <div
        style={{
          position: "absolute",
          right: 6,
          top: 168,
          width: 546,
          height: 1182,
          borderRadius: "56px 56px 0 0",
          padding: 2,
          background: "linear-gradient(160deg, rgba(255,255,255,0.28), rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.10))",
          boxShadow: "0 60px 110px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "54px 54px 0 0",
            background: "#0e0c13",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* dynamic island */}
          <div
            style={{
              position: "absolute",
              top: 20,
              left: "50%",
              transform: "translateX(-50%)",
              width: 118,
              height: 34,
              borderRadius: 20,
              background: "#000",
              zIndex: 6,
            }}
          />

          {/* screen glare */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(115deg, rgba(255,255,255,0.05) 0%, transparent 22%)",
              zIndex: 5,
              pointerEvents: "none",
            }}
          />

          <div style={{ padding: "40px 30px 0 30px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 30,
              }}
            >
              <span style={{ fontFamily: fonts.grotesk, fontSize: 16, fontWeight: 700, color: c.ink }}>9:41</span>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <Icon.Signal />
                <Icon.Wifi />
                <Icon.Battery />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 30 }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 46,
                  background: `linear-gradient(150deg, ${c.purple}, ${c.purpleDeep})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
                }}
              >
                <span style={{ fontFamily: fonts.grotesk, fontSize: 19, fontWeight: 800, color: c.ink }}>S</span>
              </div>
              <div>
                <div style={{ fontFamily: fonts.grotesk, fontSize: 19, color: c.ink, fontWeight: 700 }}>Soraia</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 6, background: c.whatsapp }} />
                  <span style={{ fontFamily: fonts.body, fontSize: 13, color: c.faint }}>online agora</span>
                </div>
              </div>
            </div>

            {/* balance panel */}
            <div
              style={{
                background: c.panel,
                borderTop: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 24,
                padding: "26px 26px 24px 26px",
                marginBottom: 20,
              }}
            >
              <div style={{ fontFamily: fonts.grotesk, fontSize: 13, color: c.faint, letterSpacing: 2 }}>
                SALDO DISPONÍVEL
              </div>
              <div
                style={{
                  fontFamily: fonts.grotesk,
                  fontSize: 44,
                  fontWeight: 800,
                  letterSpacing: -1.2,
                  color: c.ink,
                  marginTop: 6,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                R$ 3.180,42
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12 }}>
                <Icon.ArrowUpRight />
                <span style={{ fontFamily: fonts.body, fontSize: 14, color: c.goldSoft }}>
                  organizado automaticamente
                </span>
              </div>
            </div>

            {/* categories */}
            <div
              style={{
                background: c.panel,
                borderTop: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 24,
                padding: "4px 26px 2px 26px",
              }}
            >
              <CategoryRow icon={<Icon.Scooter />} label="Delivery" amount="R$ 1.220" />
              <CategoryRow icon={<Icon.Cart />} label="Mercado" amount="R$ 980" />
              <CategoryRow icon={<Icon.Car />} label="Transporte" amount="R$ 690" last />
            </div>

            {/* proactive insight message, keeps the screen feeling alive */}
            <div style={{ display: "flex", marginTop: 26 }}>
              <div
                style={{
                  maxWidth: "82%",
                  background: "rgba(169,140,255,0.10)",
                  border: "1px solid rgba(169,140,255,0.20)",
                  borderRadius: 20,
                  borderTopLeftRadius: 4,
                  padding: "16px 20px",
                }}
              >
                <div style={{ fontFamily: fonts.body, fontSize: 16, lineHeight: 1.5, color: c.ink }}>
                  Notei que você gastou <span style={{ color: c.gold, fontWeight: 700 }}>23% a mais</span> em
                  delivery esse mês 👀
                </div>
              </div>
            </div>

            <div style={{ display: "flex", marginTop: 14 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  background: "rgba(169,140,255,0.10)",
                  border: "1px solid rgba(169,140,255,0.20)",
                  borderRadius: 20,
                  borderTopLeftRadius: 4,
                  padding: "14px 18px",
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: 6, background: c.faint }} />
                <div style={{ width: 6, height: 6, borderRadius: 6, background: c.faint, opacity: 0.6 }} />
                <div style={{ width: 6, height: 6, borderRadius: 6, background: c.faint, opacity: 0.3 }} />
              </div>
            </div>
          </div>

          {/* chat input */}
          <div
            style={{
              position: "absolute",
              bottom: 26,
              left: 22,
              right: 22,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 100,
              padding: "14px 14px 14px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontFamily: fonts.body, fontSize: 16, color: c.faint }}>Converse com a Soraia</span>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 38,
                background: `linear-gradient(150deg, #5ee89a, ${c.whatsapp})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 18px rgba(63,209,124,0.35)",
              }}
            >
              <Icon.Mic />
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: "absolute", left: 76, bottom: 78, display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            width: "fit-content",
            padding: "17px 28px",
            borderRadius: 100,
            background: `linear-gradient(135deg, ${c.gold}, ${c.goldSoft})`,
            boxShadow: "0 20px 40px rgba(240,196,122,0.28)",
          }}
        >
          <span style={{ fontFamily: fonts.grotesk, fontWeight: 700, fontSize: 19, letterSpacing: -0.2, color: "#241705" }}>
            Fale com a Soraia
          </span>
          <Icon.ArrowUpRight color="#241705" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Icon.Whatsapp />
          <span style={{ fontFamily: fonts.body, fontSize: 15, color: c.faint }}>
            sua assistente pessoal, 24 horas por dia
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
