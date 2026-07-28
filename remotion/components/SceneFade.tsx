import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const SceneFade: React.FC<{
  durationInFrames: number;
  children: React.ReactNode;
  fadeIn?: number;
  fadeOut?: number;
}> = ({ durationInFrames, children, fadeIn = 10, fadeOut = 10 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, fadeIn, durationInFrames - fadeOut, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
