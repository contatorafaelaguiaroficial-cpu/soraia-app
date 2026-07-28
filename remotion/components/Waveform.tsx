import { useCurrentFrame } from "remotion";

export const Waveform: React.FC<{ bars?: number; color?: string }> = ({
  bars = 16,
  color = "#ffffff",
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 26 }}>
      {new Array(bars).fill(0).map((_, i) => {
        const h = 5 + Math.abs(Math.sin(frame / 6 + i * 0.7)) * 20;
        return (
          <div
            key={i}
            style={{ width: 3, height: h, borderRadius: 2, background: color, opacity: 0.9 }}
          />
        );
      })}
    </div>
  );
};
