import cv, { Mat, Rect, Size } from "opencv-ts";
import ColorThief from 'colorthief'

export function resize(image: Mat, maxWidth: number, maxHeight: number) : Mat {
  if (maxWidth === 0) {
    throw "resize : maxWidth is equal to zero. Please fill a value > 0";
  }

  if (maxHeight === 0) {
    throw "resize : maxHeight is equal to zero. Please fill a value > 0";
  }

  const ratio = Math.min(1.0, maxWidth / image.rows, maxHeight / image.cols);

  if(ratio !== 1.0) {
    const size : Size = new cv.Size(image.cols * ratio, image.rows * ratio);
    let dst = new cv.Mat();
    cv.resize(image, dst, size, 0, 0, cv.INTER_AREA);
    return dst;
  }

  return image
}


export function toGray(imageSource: Mat) : Mat {
  let grey: Mat = new cv.Mat(imageSource.cols, imageSource.rows, cv.CV_8UC4);
  cv.cvtColor(imageSource, grey, cv.COLOR_BGR2GRAY)
  return grey;
}


export function generateColorPalette(image: HTMLImageElement) {
  let colorThief = new ColorThief();
  return colorThief.getPalette(image, 20);
}
