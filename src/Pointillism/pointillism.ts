import { Mat } from "opencv-ts";
import { range } from "lodash";
 
import { colorSelect, rangeOfPixels, generateRandomGrid, computeColorProbabilities } from "./tools";
import { generateColorPalette, drawPalette, extendPalette, pixel } from "./palette";
import { toGray, resizeWithRatio } from "./imageProcessingTool";
import { createGradient, smooth, direction, magnitude } from "./gradient";


function radiansToDegrees(radians: number) : number
{
  const pi = Math.PI;
  return radians * (180/pi);
}

type ProcessStateMachine = "palette" | "grey" |"gradiants" |"gradiantSmooth" |"generateGrid" |"medianBlur" | "done";


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

export const ProcessStateMachineArray = [
"palette",
"grey",
"gradiants",
"gradiantSmooth",
"medianBlur",
"generateGrid",
"done"
];

/////////////////////////////////////////////////////////////////////////////////
// Delay in each method is here to "cool down" each step of pointillism algorithm
/////////////////////////////////////////////////////////////////////////////////


export async function generatePalette(imgElement: HTMLImageElement, delay: number = 2000) : Promise<pixel[]> {
  return new Promise((resolve) => {
      let palette = generateColorPalette(imgElement);
      palette = extendPalette(palette);

      drawPalette(CANVAS_IDS[0], palette);
      setTimeout(() => resolve(palette), delay);
  });
}

export async function generateGreyImage(cv: any, src: Mat, delay: number = 2000) : Promise<Mat> {
  return new Promise((resolve) => {
    let grey: Mat = toGray(src);
    cv.imshow(CANVAS_IDS[1], grey);
    setTimeout(() => resolve(grey), delay);
  });
}

export async function generateGradiant(cv: any, grey: Mat, thicknessBrush: number, delay: number = 2000): Promise<[Mat, Mat]> {
  return new Promise((resolve) => {
    const gradiants = createGradient(grey, thicknessBrush);
    cv.imshow(CANVAS_IDS[2], gradiants[0]);
    cv.imshow(CANVAS_IDS[3], gradiants[1]);

    setTimeout(() => resolve(gradiants), delay);
  });
}

export async function generateSmoothGradiant(cv: any, rows: number, cols: number, dstx: Mat, dsty: Mat, delay: number = 2000): Promise<[Mat, Mat]> {
  return new Promise((resolve) => {
    const gradientSmoothingRadius = Math.round(Math.max(rows, cols) / 50);
    const gradientSmooths = smooth(dstx, dsty, gradientSmoothingRadius);
    cv.imshow(CANVAS_IDS[4], gradientSmooths[0]);
    cv.imshow(CANVAS_IDS[5], gradientSmooths[1]);

    setTimeout(() => resolve(gradientSmooths), delay);
  });
}

export async function generateBlurMedian(cv: any, src: Mat, delay: number = 2000) : Promise<Mat> {
  return new Promise((resolve) => {
    console.log("generate blur image")
    let medianBlur = cv.Mat.zeros(src.cols, src.rows, cv.CV_32F);
    cv.medianBlur(src, medianBlur, 11);
    cv.imshow(CANVAS_IDS[6], medianBlur);

    setTimeout(() => resolve(medianBlur), delay);
  });
}

export async function drawPointillism(
  cv: any,
  src: Mat,
  medianBlur: Mat,
  dstxSmooth: Mat,
  dstySmooth: Mat,
  grid: Array<any>,
  palette: pixel[],
  delay: number = 2000
  ) : Promise<unknown> {
  
    const batchSize = 1000;
    const strokeScale = Math.floor(Math.max(src.rows, src.cols) / 1000);

    return new Promise((resolve) => {
      range(0, grid.length, batchSize).forEach(progressIndex => {
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

      cv.imshow(CANVAS_IDS[7],medianBlur);
      setTimeout(() => resolve("ok"), delay);
    });
}


export async function computePointillism(cv: any, imgElement: HTMLImageElement, thicknessBrush: number, progressCallback: (progress: ProcessStateMachine) => void, delay: number = 2000) {
  const palette = await generatePalette(imgElement);
  progressCallback("palette");

  const src = await cv.imread(imgElement);

  const grey = await generateGreyImage(cv, src);
  progressCallback("grey");
  
  const [dstX, dstY] = await generateGradiant(cv, grey, thicknessBrush);
  progressCallback("gradiants")

  const [dstxSmooth, dstySmooth] = await generateSmoothGradiant(cv, src.rows, src.cols, dstX, dstY);
  progressCallback("gradiantSmooth")
  
  grey.delete();
  dstX.delete();
  dstY.delete();

  let medianBlur = await generateBlurMedian(cv, src);
  progressCallback("medianBlur")

  const grid = await generateRandomGrid(src.cols, src.rows);
  setTimeout(() =>  progressCallback("generateGrid"), delay);


  await drawPointillism(cv, src, medianBlur, dstxSmooth, dstySmooth, grid, palette);
  progressCallback("done")

  src.delete();
  medianBlur.delete();
  dstxSmooth.delete();
  dstySmooth.delete();
}