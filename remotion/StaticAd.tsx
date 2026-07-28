import { AbsoluteFill } from "remotion";
import { fonts } from "./fonts";

const dark = {
  bg: "#0d0b14",
  purple: "#a98cff",
  purpleDeep: "#7c5cff",
  gold: "#f3c56d",
  white: "#f8f6fb",
  muted: "#948fa3",
  card: "#171320",
  cardBorder: "#2b2438",
  whatsapp: "#25d366",
};

const CategoryRow: React.FC<{ emoji: string; label: string; amount: string }> = ({
  emoji,
  label,
  amount,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "18px 0",
      borderBottom: `1px solid ${dark.cardBorder}`,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          background: dark.cardBorder,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
        }}
      >
        {emoji}
      </div>
      <div>
        <div style={{ fontFamily: fonts.body, fontSize: 22, color: dark.white, fontWeight: 700 }}>
          {label}
        </div>
        <div style={{ fontFamily: fonts.body, fontSize: 16, color: dark.muted }}>Este mês</div>
      </div>
    </div>
    <div style={{ fontFamily: fonts.body, fontSize: 22, color: dark.gold, fontWeight: 800 }}>
      {amount}
    </div>
  </div>
);

export const StaticAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: dark.bg, overflow: "hidden" }}>
      {/* decorative giant outline typography bleeding off the edge */}
      <div
        style={{
          position: "absolute",
          left: -110,
          bottom: -160,
          fontFamily: fonts.headline,
          fontSize: 520,
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: `2px ${dark.purple}`,
          opacity: 0.22,
        }}
      >
        S
      </div>
      <div
        style={{
          position: "absolute",
          left: -60,
          top: 520,
          width: 340,
          height: 340,
          borderRadius: 340,
          background: `radial-gradient(circle, ${dark.purple} 0%, transparent 70%)`,
          opacity: 0.18,
        }}
      />

      {/* header mark */}
      <div style={{ position: "absolute", top: 64, left: 64, display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            background: `linear-gradient(135deg, ${dark.purple}, ${dark.gold})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.headline,
            fontSize: 24,
            color: dark.bg,
          }}
        >
          S
        </div>
        <div style={{ fontFamily: fonts.headline, fontSize: 32, color: dark.white }}>soraia</div>
      </div>

      {/* headline */}
      <div style={{ position: "absolute", top: 170, left: 64, width: 420 }}>
        <div
          style={{
            fontFamily: fonts.headline,
            fontSize: 68,
            lineHeight: 1.08,
            color: dark.white,
          }}
        >
          PRA ONDE
          <br />
          SEU DINHEIRO
          <br />
          <span style={{ color: dark.purple }}>FOI ESSE MÊS?</span>
        </div>
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 24,
            lineHeight: 1.4,
            color: dark.muted,
            marginTop: 28,
            maxWidth: 400,
          }}
        >
          A Soraia organiza e categoriza seus gastos automaticamente — direto na conversa do WhatsApp.
        </div>
      </div>

      {/* phone mockup, bottom-anchored and cropped like the reference */}
      <div
        style={{
          position: "absolute",
          right: 24,
          top: 660,
          width: 540,
          height: 980,
          borderRadius: "46px 46px 0 0",
          background: "#121017",
          border: `6px solid #2b2438`,
          borderBottom: "none",
          boxShadow: "0 40px 90px rgba(0,0,0,0.6)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 190,
            height: 26,
            background: "#121017",
            borderBottomLeftRadius: 18,
            borderBottomRightRadius: 18,
            zIndex: 5,
          }}
        />

        <div style={{ padding: "56px 30px 0 30px" }}>
          {/* status bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: fonts.body,
              fontSize: 18,
              color: dark.white,
              marginBottom: 22,
            }}
          >
            <span>9:41</span>
            <span>📶 🔋</span>
          </div>

          {/* whatsapp-style header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 26 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 44,
                background: `linear-gradient(135deg, ${dark.purple}, ${dark.gold})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: fonts.headline,
                fontSize: 20,
                color: dark.bg,
              }}
            >
              S
            </div>
            <div>
              <div style={{ fontFamily: fonts.body, fontSize: 20, color: dark.white, fontWeight: 700 }}>
                Soraia
              </div>
              <div style={{ fontFamily: fonts.body, fontSize: 14, color: dark.whatsapp }}>● online</div>
            </div>
          </div>

          {/* balance card */}
          <div
            style={{
              background: dark.card,
              border: `1px solid ${dark.cardBorder}`,
              borderRadius: 22,
              padding: "24px 26px",
              marginBottom: 22,
            }}
          >
            <div style={{ fontFamily: fonts.body, fontSize: 16, color: dark.muted, letterSpacing: 1 }}>
              SALDO DISPONÍVEL
            </div>
            <div style={{ fontFamily: fonts.headline, fontSize: 46, color: dark.white, marginTop: 6 }}>
              R$ 3.180,42
            </div>
            <div style={{ fontFamily: fonts.body, fontSize: 16, color: dark.gold, marginTop: 8 }}>
              📊 Gastos categorizados automaticamente
            </div>
          </div>

          {/* categories */}
          <div
            style={{
              background: dark.card,
              border: `1px solid ${dark.cardBorder}`,
              borderRadius: 22,
              padding: "6px 26px 4px 26px",
            }}
          >
            <CategoryRow emoji="🛵" label="Delivery" amount="R$ 1.220" />
            <CategoryRow emoji="🛒" label="Mercado" amount="R$ 980" />
            <CategoryRow emoji="🚗" label="Transporte" amount="R$ 690" />
          </div>
        </div>

        {/* chat input bar, anchored at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            left: 24,
            right: 24,
            background: dark.card,
            border: `1px solid ${dark.cardBorder}`,
            borderRadius: 100,
            padding: "16px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontFamily: fonts.body, fontSize: 18, color: dark.muted }}>
            Converse com a Soraia
          </span>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 38,
              background: dark.whatsapp,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            🎤
          </div>
        </div>
      </div>

      {/* CTA footer */}
      <div
        style={{
          position: "absolute",
          left: 64,
          bottom: 64,
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div
          style={{
            background: dark.gold,
            color: "#2a1f00",
            fontFamily: fonts.body,
            fontWeight: 800,
            fontSize: 24,
            padding: "18px 34px",
            borderRadius: 100,
          }}
        >
          FALE COM A SORAIA
        </div>
        <div style={{ fontFamily: fonts.body, fontSize: 18, color: dark.muted }}>
          grátis, no WhatsApp
        </div>
      </div>
    </AbsoluteFill>
  );
};
