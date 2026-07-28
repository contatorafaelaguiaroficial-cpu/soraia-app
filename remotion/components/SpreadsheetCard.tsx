import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";

export const SpreadsheetCard: React.FC<{
  rotate?: number;
  top?: number | string;
  left?: number | string;
  width?: number;
  delay?: number;
}> = ({ rotate = -8, top = 0, left = 0, width = 260, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const scale = interpolate(s, [0, 1], [0.7, 1]);
  const wobble = Math.sin(frame / 30) * 2;

  const rows = [0.9, 0.6, 0.75, 0.4];

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width,
        opacity,
        transform: `rotate(${rotate + wobble}deg) scale(${scale})`,
        background: colors.white,
        borderRadius: 20,
        padding: 18,
        boxShadow: "0 24px 50px rgba(90, 60, 160, 0.18)",
        border: `1px solid ${colors.purpleLight}`,
      }}
    >
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        <div style={{ width: 10, height: 10, borderRadius: 10, background: colors.alert }} />
        <div style={{ width: 10, height: 10, borderRadius: 10, background: colors.gold }} />
        <div style={{ width: 10, height: 10, borderRadius: 10, background: colors.purpleSoft }} />
      </div>
      {rows.map((w, i) => (
        <div
          key={i}
          style={{
            height: 12,
            width: `${w * 100}%`,
            borderRadius: 6,
            background: i === 0 ? colors.purpleLight : "#efecf7",
            marginBottom: 10,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          top: -18,
          right: -18,
          width: 44,
          height: 44,
          borderRadius: 44,
          background: colors.alert,
          color: colors.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          fontWeight: 900,
          boxShadow: "0 8px 20px rgba(239,68,68,0.4)",
        }}
      >
        ?
      </div>
    </div>
  );
};
