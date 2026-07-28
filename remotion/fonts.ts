import { loadFont as loadArchivoBlack } from "@remotion/google-fonts/ArchivoBlack";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: headlineFont } = loadArchivoBlack();
const { fontFamily: bodyFont } = loadInter();

export const fonts = {
  headline: headlineFont,
  body: bodyFont,
};
