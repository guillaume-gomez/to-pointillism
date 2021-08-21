import cv, { Mat, Rect } from "opencv-ts";
import { colorSelect, rangeOfPixels, generateColorPalette, drawPalette, extendPalette, generateRandomGrid, computeColorProbabilities } from "./tools";
import { toGray, resizeWithRatio } from "./imageProcessingTool";
import { createGradient, smooth, direction, magnitude } from "./gradient";

function radiansToDegrees(radians: number) : number
{
  const pi = Math.PI;
  return radians * (180/pi);
}

cv.onRuntimeInitialized = () => {
  const imgElement = document.getElementById('imageSrc') as HTMLImageElement;
  const inputElement = document.getElementById('fileInput');
  
  if(inputElement && imgElement) {
    
    inputElement.addEventListener('change', (e : any) => {
      if(e && e.target && e.target.files) {
        (imgElement as HTMLImageElement).src = URL.createObjectURL(e.target.files[0]);
      }
    }, false);

    imgElement.onload = () => {
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

      let medianBlur = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC4);
      cv.medianBlur(src, medianBlur, 11);
      //cv.imshow('medianBlur', medianBlur);

      const grid = generateRandomGrid(src.rows, src.cols);
      const batchSize = 10;
      const strokeScale = Math.floor(Math.max(src.rows, src.cols) / 1000);
      
      // LOOOP
      const pixels = rangeOfPixels(src, grid, 0, batchSize);
      const colorProbabilities = computeColorProbabilities(pixels, palette);
      grid.slice(0,batchSize).forEach(([y, x], index) => {
        const color = colorSelect(colorProbabilities, palette);
        const angle = radiansToDegrees(direction(dstxSmooth, dstySmooth, y, x)) + 90;
        const length = Math.round(strokeScale + strokeScale * Math.sqrt(magnitude(dstxSmooth, dstySmooth, y, x)));
        
        const scalar = new cv.Scalar(color[0], color[1], color[2], 255);
        cv.ellipse(medianBlur, new cv.Point(x, y), new cv.Size(length, strokeScale), angle, 0, 360, scalar, -1, cv.LINE_AA);
      });
      cv.imshow('medianBlur',medianBlur);

      // clean up
      grey.delete();

      dstx.delete();
      dsty.delete();

      dstxSmooth.delete();
      dstySmooth.delete();

      medianBlur.delete();
    };
  }
};