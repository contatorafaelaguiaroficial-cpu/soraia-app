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

const scenes = [
  { Component: HookScene, duration: 90 }, // 0:00 - 0:03
  { Component: PainScene, duration: 90 }, // 0:03 - 0:06
  { Component: TransitionScene, duration: 30 }, // 0:06 - 0:07
  { Component: SolutionScene, duration: 120 }, // 0:07 - 0:11
  { Component: DashboardScene, duration: 120 }, // 0:11 - 0:15
  { Component: PunchScene, duration: 90 }, // 0:15 - 0:18
  { Component: CtaScene, duration: 60 }, // 0:18 - 0:20
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
