import cv, { Mat, Rect } from "opencv-ts";


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
      const dst: Mat = new cv.Mat(src.cols, src.rows, cv.CV_8UC4);
      cv.resize(src, dst, new cv.Size(500, 500), 0, 0, cv.INTER_AREA);
      const roiRect: Rect = new cv.Rect(0, 0, 200, 200);
      const roi = dst.roi(roiRect);
      cv.imshow('canvasOutput', roi);
      roi.delete();
    };
  }
};