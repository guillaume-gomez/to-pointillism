import { Mat, Rect } from "opencv-ts";
import { range } from "lodash";
 
import { colorSelect, rangeOfPixels, generateColorPalette, drawPalette, extendPalette, generateRandomGrid, computeColorProbabilities } from "./tools";
import { toGray, resizeWithRatio } from "./imageProcessingTool";
import { createGradient, smooth, direction, magnitude } from "./gradient";


function radiansToDegrees(radians: number) : number
{
  const pi = Math.PI;
  return radians * (180/pi);
}

export function test(progressCallback: (progress: number) => void) {
  range(0,2000, 5).map(progressIndex => {
    setTimeout(() => {
      progressCallback(progressIndex)
    }, 1000)
  })
}

export async function computePointillism(cv: any, imgElement: HTMLImageElement, progressCallback: (progress: number) => void) {
  const src = cv.imread(imgElement);
  // algorithm used for final example
  let palette = generateColorPalette(imgElement);
      palette = extendPalette(palette);

  // optionnal not related to algorithm
  //drawPalette("palette-preview", palette);


  //convert to grayscale
  let grey: Mat = toGray(src);
  //cv.imshow('canvasOutput', grey);

  const[dstx, dsty] = createGradient(grey);
  //cv.imshow('canvasOutputX', dstx);
  //cv.imshow('canvasOutputY', dsty);

  const gradientSmoothingRadius = Math.round(Math.max(src.rows, src.cols) / 50);
  const[dstxSmooth, dstySmooth] = smooth(dstx, dsty, gradientSmoothingRadius);
  //cv.imshow('canvasOutputXSmooth', dstxSmooth);
  //cv.imshow('canvasOutputYSmooth', dstySmooth);

  let medianBlur = cv.Mat.zeros(src.cols, src.rows, cv.CV_32F);
  cv.medianBlur(src, medianBlur, 11);
  //cv.imshow('medianBlur', medianBlur);

  const grid = generateRandomGrid(src.cols, src.rows);
  const batchSize = 1000;
  const strokeScale = Math.floor(Math.max(src.rows, src.cols) / 1000);
  console.log("begin")
  range(0, grid.length, batchSize).map(progressIndex => {
    setTimeout(() => {
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

  cv.imshow('medianBlur',medianBlur);

  // clean up
  medianBlur.delete();

  dstxSmooth.delete();
  dstySmooth.delete();

  dstx.delete();
  dsty.delete();

  grey.delete();

  src.delete();
}