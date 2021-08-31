import { Mat } from "opencv-ts";
import { range } from "lodash";
 
import { colorSelect, rangeOfPixels, generateRandomGrid, computeColorProbabilities } from "./tools";
import { generateColorPalette, drawPalette, extendPalette } from "./palette";
import { toGray, resizeWithRatio } from "./imageProcessingTool";
import { createGradient, smooth, direction, magnitude } from "./gradient";


function radiansToDegrees(radians: number) : number
{
  const pi = Math.PI;
  return radians * (180/pi);
}

export const MAX_THICKNESS_BRUSH = 15.36;
export const CANVAS_IDS = [
  "drawPalette",
  "greyOutput",
  "canvasOutputX",
  "canvasOutputY",
  "canvasOutputXSmooth",
  "canvasOutputYSmooth",
  "medianBlur",
  "finalResult"
];

export function computePointillism(cv: any, imgElement: HTMLImageElement, thicknessBrush: number , progressCallback: (progress: number) => void) {
  console.log("read image")
  const src = cv.imread(imgElement);
  // algorithm used for final example
  console.log("generate palette")
  let palette = generateColorPalette(imgElement);
      palette = extendPalette(palette);

  // optionnal not related to algorithm
  drawPalette(CANVAS_IDS[0], palette);

  console.log("convert to grey")
  //convert to grayscale
  let grey: Mat = toGray(src);
  cv.imshow(CANVAS_IDS[1], grey);


  console.log("create gradient")
  const[dstx, dsty] = createGradient(grey, thicknessBrush);
  cv.imshow(CANVAS_IDS[2], dstx);
  cv.imshow(CANVAS_IDS[3], dsty);


  console.log("create smooth gradiant")
  const gradientSmoothingRadius = Math.round(Math.max(src.rows, src.cols) / 50);
  const[dstxSmooth, dstySmooth] = smooth(dstx, dsty, gradientSmoothingRadius);
  cv.imshow(CANVAS_IDS[4], dstxSmooth);
  cv.imshow(CANVAS_IDS[5], dstySmooth);

  console.log("generate blur image")
  let medianBlur = cv.Mat.zeros(src.cols, src.rows, cv.CV_32F);
  cv.medianBlur(src, medianBlur, 11);
  cv.imshow(CANVAS_IDS[6], medianBlur);

  console.log("generate random grid")
  const grid = generateRandomGrid(src.cols, src.rows);
  const batchSize = 1000;
  const strokeScale = Math.floor(Math.max(src.rows, src.cols) / 1000);


  console.log("begin draw")
  range(0, grid.length, batchSize).forEach(progressIndex => {
    setTimeout(() => {
      console.log("progress")
        progressCallback( (progressIndex/grid.length) * 100)
    });

    const pixels = rangeOfPixels(src, grid, progressIndex, progressIndex + batchSize);
    const colorProbabilities = computeColorProbabilities(pixels, palette);
    grid.slice(progressIndex, Math.min((progressIndex + batchSize), grid.length)).forEach(([y, x], index) => {
      const color = colorSelect(colorProbabilities[index], palette);
      const angle = radiansToDegrees(direction(dstxSmooth, dstySmooth, y, x)) + 90;
      const length = Math.round(strokeScale + strokeScale * Math.sqrt(magnitude(dstxSmooth, dstySmooth, y, x)));
      const scalar = new cv.Scalar(color[0], color[1], color[2], 255);
      cv.ellipse(medianBlur, new cv.Point(x, y), new cv.Size(length, strokeScale), angle, 0, 360, scalar, -1, cv.LINE_AA);
    });
  });
  console.log("finish")
  //progressElement.style.display = "none";

  cv.imshow(CANVAS_IDS[7],medianBlur);

  // clean up
  medianBlur.delete();

  dstxSmooth.delete();
  dstySmooth.delete();

  dstx.delete();
  dsty.delete();

  grey.delete();

  src.delete();
}
