import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type Segment = { frac: number; color: string; delay: number };

const Ring: React.FC<{ radius: number; stroke: number }> = ({ radius, stroke }) => (
  <circle
    cx="90"
    cy="90"
    r={radius}
    fill="none"
    stroke="rgba(255,255,255,0.06)"
    strokeWidth={stroke}
  />
);

const Arc: React.FC<{ radius: number; stroke: number; segment: Segment; cumulative: number }> = ({
  radius,
  stroke,
  segment,
  cumulative,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - segment.delay, fps, config: { damping: 200 } });
  const progress = interpolate(s, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const c = 2 * Math.PI * radius;
  const dash = progress * segment.frac * c;

  return (
    <circle
      cx="90"
      cy="90"
      r={radius}
      fill="none"
      stroke={segment.color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeDasharray={`${dash} ${c - dash}`}
      strokeDashoffset={-cumulative * c}
      transform="rotate(-90 90 90)"
    />
  );
};

export const DonutChart: React.FC<{ segments: Omit<Segment, "delay">[]; baseDelay?: number; size?: number }> = ({
  segments,
  baseDelay = 0,
  size = 180,
}) => {
  let cumulative = 0;
  const radius = 70;
  const stroke = 16;

  return (
    <svg width={size} height={size} viewBox="0 0 180 180">
      <Ring radius={radius} stroke={stroke} />
      {segments.map((seg, i) => {
        const el = (
          <Arc
            key={i}
            radius={radius}
            stroke={stroke}
            segment={{ ...seg, delay: baseDelay + i * 10 }}
            cumulative={cumulative}
          />
        );
        cumulative += seg.frac;
        return el;
      })}
    </svg>
  );
};
