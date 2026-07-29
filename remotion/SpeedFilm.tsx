import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { pc } from "./premiumTheme";
import { SceneFade } from "./components/SceneFade";
import { Scene1Speed } from "./speedScenes/Scene1Speed";
import { Scene2Speed } from "./speedScenes/Scene2Speed";
import { Scene3Speed } from "./speedScenes/Scene3Speed";
import { Scene4Speed } from "./speedScenes/Scene4Speed";
import { Scene5Speed } from "./speedScenes/Scene5Speed";
import { Scene6Speed } from "./speedScenes/Scene6Speed";

// Sized from each scene's VO clip (lead-in + speech + tail), targeting the requested 20-25s.
const scenes = [
  { Component: Scene1Speed, duration: 110 },
  { Component: Scene2Speed, duration: 128 },
  { Component: Scene3Speed, duration: 99 },
  { Component: Scene4Speed, duration: 133 },
  { Component: Scene5Speed, duration: 139 },
  { Component: Scene6Speed, duration: 132 },
];

export const SpeedFilm: React.FC = () => {
  let cursor = 0;

  return (
    <AbsoluteFill style={{ background: pc.bg }}>
      <Audio src={staticFile("remotion/sfx/ambient-speed.wav")} volume={0.5} />

      {scenes.map(({ Component, duration }, i) => {
        const from = cursor;
        cursor += duration;
        return (
          <Sequence key={i} from={from} durationInFrames={duration}>
            <SceneFade durationInFrames={duration}>
              <Component duration={duration} />
            </SceneFade>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
