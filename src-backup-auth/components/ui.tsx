"use client";

import { useEffect, useState } from "react";

export const INK = "#F4F1F8";
export const MUTED = "#9C93AC";
export const CARD_BORDER = "rgba(255,255,255,0.09)";
export const DIVIDER = "rgba(255,255,255,0.08)";
export const NECTARINE = "#8B5CF6";
export const NECTARINE_DARK = "#6D28D9";
export const MINT = "#96C7B3";
export const MINT_DARK = "#6BA48D";
export const LAGOON = "#6398A9";
export const LAGOON_DARK = "#457A8B";
export const PEACH = "#F9B95C";
export const PEACH_DARK = "#E09A38";

export function Card({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-[22px] p-[18px] ${className}`}
      style={{
        background: "linear-gradient(155deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: `1px solid ${CARD_BORDER}`,
        boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 10px 26px rgba(0,0,0,0.30)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const TONES: Record<string, { c: string; d: string; shadow: string }> = {
  nectarine: { c: NECTARINE, d: NECTARINE_DARK, shadow: "rgba(109,40,217,0.32)" },
  mint: { c: MINT, d: MINT_DARK, shadow: "rgba(107,164,141,0.32)" },
  lagoon: { c: LAGOON, d: LAGOON_DARK, shadow: "rgba(69,122,139,0.32)" },
  peach: { c: PEACH, d: PEACH_DARK, shadow: "rgba(224,154,56,0.32)" },
};

export function IconBadge({
  icon: Icon,
  size = 40,
  tone = "nectarine",
}: {
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  size?: number;
  tone?: keyof typeof TONES;
}) {
  const t = TONES[tone];
  return (
    <div
      className="rounded-2xl flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(155deg, ${t.c}, ${t.d})`,
        boxShadow: `0 6px 14px ${t.shadow}`,
      }}
    >
      <Icon size={size * 0.46} color="#FFFFFF" strokeWidth={2.2} />
    </div>
  );
}

export function CircularProgress({
  pct,
  size = 56,
  stroke = 6,
  tone = "nectarine",
  children,
}: {
  pct: number;
  size?: number;
  stroke?: number;
  tone?: keyof typeof TONES;
  children?: React.ReactNode;
}) {
  const t = TONES[tone];
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setAnimated(pct), 80);
    return () => clearTimeout(id);
  }, [pct]);

  const gradId = `ring-${tone}-${size}`;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={t.c} />
            <stop offset="100%" stopColor={t.d} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={c - (animated / 100) * c}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.22,.8,.3,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}
