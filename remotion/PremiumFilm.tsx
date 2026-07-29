import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { pc } from "./premiumTheme";
import { SceneFade } from "./components/SceneFade";
import { Scene1Hook } from "./filmScenes/Scene1Hook";
import { Scene2Clutter } from "./filmScenes/Scene2Clutter";
import { Scene3InputModes } from "./filmScenes/Scene3InputModes";
import { Scene4Dashboard } from "./filmScenes/Scene4Dashboard";
import { Scene5Goals } from "./filmScenes/Scene5Goals";
import { Scene6Cta } from "./filmScenes/Scene6Cta";

// Matches the requested 25s script: 3s, 4s, 5s, 5s, 4s, 4s at 30fps.
const scenes = [
  { Component: Scene1Hook, duration: 90 },
  { Component: Scene2Clutter, duration: 120 },
  { Component: Scene3InputModes, duration: 150 },
  { Component: Scene4Dashboard, duration: 150 },
  { Component: Scene5Goals, duration: 120 },
  { Component: Scene6Cta, duration: 120 },
];

export const PremiumFilm: React.FC = () => {
  let cursor = 0;

  return (
    <AbsoluteFill style={{ background: pc.bg }}>
      <Audio src={staticFile("remotion/sfx/ambient.wav")} volume={0.5} />

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
