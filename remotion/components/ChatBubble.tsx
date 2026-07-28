import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../fonts";
import { Waveform } from "./Waveform";

export const ChatBubble: React.FC<{
  fromUser?: boolean;
  isAudio?: boolean;
  text?: string;
  delay: number;
  bg: string;
  color?: string;
}> = ({ fromUser = false, isAudio = false, text, delay, bg, color = "#ffffff" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 14, mass: 0.6 } });
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(s, [0, 1], [0.6, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: fromUser ? "flex-end" : "flex-start",
        width: "100%",
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: fromUser ? "right center" : "left center",
      }}
    >
      <div
        style={{
          maxWidth: "78%",
          background: bg,
          color,
          borderRadius: 22,
          borderBottomRightRadius: fromUser ? 4 : 22,
          borderBottomLeftRadius: fromUser ? 22 : 4,
          padding: isAudio ? "16px 20px" : "14px 20px",
          fontFamily: fonts.body,
          fontSize: 24,
          lineHeight: 1.3,
          fontWeight: 500,
        }}
      >
        {isAudio ? <Waveform color={color} /> : text}
      </div>
    </div>
  );
};
