import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";
import { fonts } from "../fonts";

export const CategoryBar: React.FC<{
  label: string;
  amount: string;
  pct: number;
  color: string;
  delay: number;
}> = ({ label, amount, pct, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const width = interpolate(s, [0, 1], [0, pct], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ width: "100%", marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
          fontFamily: fonts.body,
          fontSize: 22,
          color: colors.white,
        }}
      >
        <span>{label}</span>
        <span style={{ color: colors.gold, fontWeight: 700 }}>{amount}</span>
      </div>
      <div
        style={{
          width: "100%",
          height: 14,
          borderRadius: 8,
          background: "rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ width: `${width}%`, height: "100%", borderRadius: 8, background: color }} />
      </div>
    </div>
  );
};
