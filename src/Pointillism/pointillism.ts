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

export function computeThicknessBrush(width: number, height: number) :number {
    const maxSize = Math.max(width, height);
    // linear equation to apply properly the algorithm on both small and large images
    const empiricalRatio = Math.round(0.001709 * maxSize - 0.9158);
    return Math.max(1, empiricalRatio);
}

type ProcessStateMachine = "palette" | "grey" |"gradiants" |"gradiantSmooth" |"generateGrid" |"medianBlur" | "done";


export const MAX_GRADIANT_SMOOTH_RATIO = 15.36;
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


export async function generatePalette(
    imgElement: HTMLImageElement,
    paletteSize: number,
    hue: number,
    saturation: number,
    delay: number = 100
  ) : Promise<pixel[]> {
  return new Promise((resolve) => {
      let palette = generateColorPalette(imgElement, paletteSize);
      palette = extendPalette(palette, hue, saturation);

      drawPalette(CANVAS_IDS[0], palette);
      setTimeout(() => resolve(palette), delay);
  });
}

export async function generateGreyImage(cv: any, src: Mat, delay: number = 100) : Promise<Mat> {
  return new Promise((resolve) => {
    let grey: Mat = toGray(src);
    cv.imshow(CANVAS_IDS[1], grey);
    setTimeout(() => resolve(grey), delay);
  });
}

export async function generateGradiant(cv: any, grey: Mat, smoothnessGradiant: number, delay: number = 100): Promise<[Mat, Mat]> {
  return new Promise((resolve) => {
    const gradiants = createGradient(grey, smoothnessGradiant);
    cv.imshow(CANVAS_IDS[2], gradiants[0]);
    cv.imshow(CANVAS_IDS[3], gradiants[1]);

    setTimeout(() => resolve(gradiants), delay);
  });
}

export async function generateSmoothGradiant(cv: any, rows: number, cols: number, dstx: Mat, dsty: Mat, delay: number = 100): Promise<[Mat, Mat]> {
  return new Promise((resolve) => {
    const gradientSmoothingRadius = Math.round(Math.max(rows, cols) / 50);
    const gradientSmooths = smooth(dstx, dsty, gradientSmoothingRadius);
    cv.imshow(CANVAS_IDS[4], gradientSmooths[0]);
    cv.imshow(CANVAS_IDS[5], gradientSmooths[1]);

    setTimeout(() => resolve(gradientSmooths), delay);
  });
}

export async function generateBlurMedian(cv: any, src: Mat, delay: number = 100) : Promise<Mat> {
  return new Promise((resolve) => {
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
  thicknessBrush: number,
  delay: number = 100
  ) : Promise<unknown> {
    const batchSize = 5000;
    return new Promise((resolve) => {
      range(0, grid.length, batchSize).forEach(progressIndex => {
        const maxSize = Math.min((progressIndex + batchSize), grid.length)
        const pixels = rangeOfPixels(src, grid, progressIndex, maxSize);
        const colorProbabilities = computeColorProbabilities(pixels, palette);

        for(let index = progressIndex; index < maxSize; index++) {
          const [y, x] = grid[index];
          const color = colorSelect(colorProbabilities[index % batchSize], palette);
          const angle = radiansToDegrees(direction(dstxSmooth, dstySmooth, y, x)) + 90;
          const length = Math.round(thicknessBrush + thicknessBrush * Math.sqrt(magnitude(dstxSmooth, dstySmooth, y, x)));
          const scalar = new cv.Scalar(color[0], color[1], color[2], 255);
          cv.ellipse(medianBlur, new cv.Point(x, y), new cv.Size(length, thicknessBrush), angle, 0, 360, scalar, -1, cv.LINE_AA);
        }
      });

      cv.imshow(CANVAS_IDS[7],medianBlur);
      setTimeout(() => resolve("ok"), delay);
    });
}


export async function computePointillism(
    cv: any,
    imgElement: HTMLImageElement,
    smoothnessGradiant: number,
    thicknessBrush: number, 
    paletteSize: number,
    hue: number,
    saturation: number,
    autoResize: boolean,
    progressCallback: (progress: ProcessStateMachine) => void, delay: number = 100
  ) {
  const palette = await generatePalette(imgElement, paletteSize, hue, saturation);
  progressCallback("palette");

  let src = await cv.imread(imgElement);
  if(autoResize) {
    src = resizeWithRatio(src, 1280, 780);
  }

  const grey = await generateGreyImage(cv, src, delay);
  progressCallback("grey");
  
  const [dstX, dstY] = await generateGradiant(cv, grey, smoothnessGradiant, delay);
  progressCallback("gradiants")

  const [dstxSmooth, dstySmooth] = await generateSmoothGradiant(cv, src.rows, src.cols, dstX, dstY, delay);
  progressCallback("gradiantSmooth")
  
  grey.delete();
  dstX.delete();
  dstY.delete();


  let medianBlur = await generateBlurMedian(cv, src, delay);
  progressCallback("medianBlur")

  const grid = generateRandomGrid(src.cols, src.rows);
  setTimeout(() =>  progressCallback("generateGrid"), delay);

  const startTime = performance.now();
  await drawPointillism(cv, src, medianBlur, dstxSmooth, dstySmooth, grid, palette, thicknessBrush, delay);
  progressCallback("done")
  const endTime = performance.now();
  console.log("Pointillism ->", endTime - startTime);

  src.delete();
  medianBlur.delete();
  dstxSmooth.delete();
  dstySmooth.delete();
}