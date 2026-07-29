export const pc = {
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

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => (
  <svg
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      opacity,
      mixBlendMode: "overlay",
    }}
  >
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain)" />
  </svg>
);

export const PIcon = {
  Signal: () => (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
      <rect x="0" y="7" width="3" height="5" rx="1" fill={pc.ink} />
      <rect x="5" y="4.5" width="3" height="7.5" rx="1" fill={pc.ink} />
      <rect x="10" y="2.5" width="3" height="9.5" rx="1" fill={pc.ink} />
      <rect x="15" y="0" width="3" height="12" rx="1" fill={pc.ink} opacity="0.35" />
    </svg>
  ),
  Wifi: () => (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
      <path d="M1 4.5C5.5 0.2 10.5 0.2 15 4.5" stroke={pc.ink} strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
      <path d="M3.5 7.2C6.7 4.2 9.3 4.2 12.5 7.2" stroke={pc.ink} strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
      <circle cx="8" cy="10.2" r="1.3" fill={pc.ink} />
    </svg>
  ),
  Battery: () => (
    <svg width="26" height="13" viewBox="0 0 26 13" fill="none">
      <rect x="0.75" y="0.75" width="21.5" height="11.5" rx="3.25" stroke={pc.ink} strokeOpacity="0.5" strokeWidth="1.2" />
      <rect x="2.5" y="2.5" width="18" height="8" rx="1.8" fill={pc.ink} />
      <rect x="23" y="4" width="2" height="5" rx="1" fill={pc.ink} opacity="0.5" />
    </svg>
  ),
  Mic: ({ color = "#0a1a10" }: { color?: string }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="9" y="2.5" width="6" height="11" rx="3" stroke={color} strokeWidth="1.6" />
      <path d="M5.5 11.5A6.5 6.5 0 0 0 18.5 11.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 18V21.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  Camera: ({ color = pc.ink }: { color?: string }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7H8L9.2 5H14.8L16 7H18.5A1.5 1.5 0 0 1 20 8.5V17.5A1.5 1.5 0 0 1 18.5 19H5.5A1.5 1.5 0 0 1 4 17.5V8.5Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3.4" stroke={color} strokeWidth="1.6" />
    </svg>
  ),
  Type: ({ color = pc.ink }: { color?: string }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M5 6H19M12 6V19" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  Receipt: ({ color = pc.gold }: { color?: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M6 3H18V21L15.5 19L13 21L10.5 19L8 21L6 19V3Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 8H15M9 11.5H15M9 15H13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Sheet: ({ color = pc.purple }: { color?: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="4" width="17" height="16" rx="2" stroke={color} strokeWidth="1.5" />
      <path d="M3.5 9.5H20.5M9 9.5V20M15 9.5V20" stroke={color} strokeWidth="1.5" />
    </svg>
  ),
  Note: ({ color = "#e39b9b" }: { color?: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M5 4H19V17L15 21H5V4Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M15 21V17H19" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 9H16M8 12.5H13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Target: ({ color = pc.gold }: { color?: string }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.5" fill={color} />
    </svg>
  ),
  Check: ({ color = pc.whatsapp }: { color?: string }) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8.5L6.2 11.5L13 4.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ArrowUpRight: ({ color = pc.gold }: { color?: string }) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 12L12 4M12 4H5.5M12 4V10.5" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export const WordmarkLogo: React.FC<{ size?: number; fontFamily: string }> = ({ size = 34, fontFamily }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.35 }}>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        background: `linear-gradient(150deg, ${pc.purple}, ${pc.purpleDeep})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 6px 16px rgba(136,101,232,0.4), inset 0 1px 0 rgba(255,255,255,0.25)",
      }}
    >
      <span style={{ fontFamily, fontSize: size * 0.5, fontWeight: 800, color: pc.ink }}>S</span>
    </div>
    <span style={{ fontFamily, fontSize: size * 0.58, fontWeight: 700, letterSpacing: 0.5, color: pc.ink }}>
      soraia
    </span>
  </div>
);
