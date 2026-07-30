import { loadFont as loadArchivoBlack } from "@remotion/google-fonts/ArchivoBlack";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadManrope } from "@remotion/google-fonts/Manrope";
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadBebasNeue } from "@remotion/google-fonts/BebasNeue";

const { fontFamily: headlineFont } = loadArchivoBlack();
const { fontFamily: bodyFont } = loadInter();
const { fontFamily: bebasFont } = loadBebasNeue();
const { fontFamily: manropeFont } = loadManrope("normal", {
  weights: ["500", "700", "800"],
  subsets: ["latin"],
});
const { fontFamily: frauncesFont } = loadFraunces("italic", {
  weights: ["500"],
  subsets: ["latin"],
});

export const fonts = {
  headline: headlineFont,
  body: bodyFont,
  // premium pairing used by the static ad: grotesk + editorial serif accent
  grotesk: manropeFont,
  serif: frauncesFont,
  // ultra-condensed poster display, used by the Pro sales ad
  condensed: bebasFont,
};
