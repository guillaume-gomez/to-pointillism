import cv, { Mat, Rect } from "opencv-ts";
import { generateColorPalette, drawPalette, extendPalette, generateRandomGrid } from "./tools";
import { toGray, resizeWithRatio } from "./imageProcessingTool";
import { createGradient, smooth } from "./gradient";

cv.onRuntimeInitialized = () => {
  const imgElement = document.getElementById('imageSrc') as HTMLImageElement;
  const inputElement = document.getElementById('fileInput');
  
  if(inputElement && imgElement) {
    
    inputElement.addEventListener('change', (e : any) => {
      if(e && e.target && e.target.files) {
        (imgElement as HTMLImageElement).src = URL.createObjectURL(e.target.files[0]);
        // use timeout to make sure the data is properly compute
        setTimeout(() => {
          let palette = generateColorPalette(imgElement);
          palette = extendPalette(palette);

          drawPalette("palette-preview", palette);

        }, 1000);
      }
    }, false);

    imgElement.onload = () => {
      const src = cv.imread(imgElement);
      // algorithm used for final example

      //convert to grayscale
      let grey: Mat = toGray(src);
      cv.imshow('canvasOutput', grey);

      const[dstx, dsty] = createGradient(grey);
      cv.imshow('canvasOutputX', dstx);
      cv.imshow('canvasOutputY', dsty);

      const gradientSmoothingRadius = Math.round(Math.max(src.rows, src.cols) / 50);
      const[dstxSmooth, dstySmooth] = smooth(dstx, dsty, gradientSmoothingRadius);
      cv.imshow('canvasOutputXSmooth', dstxSmooth);
      cv.imshow('canvasOutputYSmooth', dstySmooth);

      let medianBlur = new cv.Mat();
      cv.medianBlur(src, medianBlur, 11);
      cv.imshow('medianBlur', medianBlur);

      console.log(generateRandomGrid(src.rows, src.cols));

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