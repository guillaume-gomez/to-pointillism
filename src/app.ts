import cv, { Mat, Rect } from "opencv-ts";
import { generateColorPalette, toGray, drawPalette } from "./tools";

cv.onRuntimeInitialized = () => {
  const imgElement = document.getElementById('imageSrc') as HTMLImageElement;
  const inputElement = document.getElementById('fileInput');
  
  if(inputElement && imgElement) {
    
    inputElement.addEventListener('change', (e : any) => {
      if(e && e.target && e.target.files) {
        (imgElement as HTMLImageElement).src = URL.createObjectURL(e.target.files[0]);
        // use timeout to make sure the data is properly compute
        setTimeout(() => {
          const palette = generateColorPalette(imgElement)
          drawPalette("palette-preview", palette);

        }, 1000);
      }
    }, false);

    imgElement.onload = () => {
      const src = cv.imread(imgElement);
      const dst: Mat = new cv.Mat(src.cols, src.rows, cv.CV_8UC4);
      cv.resize(src, dst, new cv.Size(500, 500), 0, 0, cv.INTER_AREA);
      const roiRect: Rect = new cv.Rect(0, 0, 200, 200);
      const roi = dst.roi(roiRect);


      // algorithm used for final example
      //convert to grayscale
      let grey: Mat = toGray(roi);
      cv.imshow('canvasOutput', grey);

      // clean up
      dst.delete();
      roi.delete();
      grey.delete();
    };
  }
};