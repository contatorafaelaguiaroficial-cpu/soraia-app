import { AbsoluteFill, Sequence } from "remotion";
import { colors } from "./theme";
import { SceneFade } from "./components/SceneFade";
import { HookScene } from "./scenes/HookScene";
import { PainScene } from "./scenes/PainScene";
import { TransitionScene } from "./scenes/TransitionScene";
import { SolutionScene } from "./scenes/SolutionScene";
import { DashboardScene } from "./scenes/DashboardScene";
import { PunchScene } from "./scenes/PunchScene";
import { CtaScene } from "./scenes/CtaScene";

// Durations are sized around each scene's voice-over clip (lead-in + speech + tail).
const scenes = [
  { Component: HookScene, duration: 106 },
  { Component: PainScene, duration: 84 },
  { Component: TransitionScene, duration: 55 },
  { Component: SolutionScene, duration: 130 },
  { Component: DashboardScene, duration: 125 },
  { Component: PunchScene, duration: 99 },
  { Component: CtaScene, duration: 103 },
];

export const Creative: React.FC = () => {
  let cursor = 0;

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {scenes.map(({ Component, duration }, i) => {
        const from = cursor;
        cursor += duration;
        return (
          <Sequence key={i} from={from} durationInFrames={duration}>
            <SceneFade durationInFrames={duration}>
              <Component />
            </SceneFade>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
