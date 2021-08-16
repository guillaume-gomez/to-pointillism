import cv, { Mat, Rect } from "opencv-ts";
import { generateColorPalette, toGray, drawPalette, extendPalette, resizeWithRatio, resize } from "./tools";

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
      const dst = resizeWithRatio(src, 400, 350);
      
      // algorithm used for final example
      //convert to grayscale
      let grey: Mat = toGray(dst);
      cv.imshow('canvasOutput', grey);

      // clean up
      dst.delete();
      grey.delete();
    };
  }
};