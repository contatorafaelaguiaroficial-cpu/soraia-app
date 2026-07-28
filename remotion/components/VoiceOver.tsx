import { Audio, Sequence, staticFile } from "remotion";

export const VoiceOver: React.FC<{ file: string; delay?: number; volume?: number }> = ({
  file,
  delay = 0,
  volume = 1,
}) => {
  return (
    <Sequence from={delay}>
      <Audio src={staticFile(`remotion/audio/${file}`)} volume={volume} />
    </Sequence>
  );
};

export const Sfx: React.FC<{ file: string; delay?: number; volume?: number }> = ({
  file,
  delay = 0,
  volume = 0.5,
}) => {
  return (
    <Sequence from={delay}>
      <Audio src={staticFile(`remotion/sfx/${file}`)} volume={volume} />
    </Sequence>
  );
};
