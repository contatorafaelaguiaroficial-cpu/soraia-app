import { AbsoluteFill } from "remotion";
import { CinematicBackground } from "../components/CinematicBackground";
import { CinematicHeadline } from "../components/CinematicHeadline";
import { Sfx } from "../components/VoiceOver";

export const Scene1Hook: React.FC<{ duration: number }> = ({ duration }) => {
  return (
    <AbsoluteFill>
      <CinematicBackground durationInFrames={duration} glow="mixed" />
      <Sfx file="pop.wav" delay={3} volume={0.3} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 90px" }}>
        <CinematicHeadline
          fontSize={76}
          startFrame={6}
          lines={[
            { text: "Organizar o dinheiro", variant: "bold" },
            { text: "não precisa ser", variant: "bold" },
            { text: "complicado.", variant: "accent" },
          ]}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
