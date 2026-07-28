import { Composition } from "remotion";
import { Creative } from "./Creative";

export const FPS = 30;
export const DURATION_IN_FRAMES = 702; // ~23.4s
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="SoraiaCreative"
        component={Creative}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
