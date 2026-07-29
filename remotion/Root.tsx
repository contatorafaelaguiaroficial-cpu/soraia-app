import { Composition, Still } from "remotion";
import { Creative } from "./Creative";
import { StaticAd } from "./StaticAd";
import { PremiumFilm } from "./PremiumFilm";

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
      <Still id="SoraiaStaticAd" component={StaticAd} width={1080} height={1350} />
      <Composition
        id="SoraiaPremiumFilm"
        component={PremiumFilm}
        durationInFrames={750}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
