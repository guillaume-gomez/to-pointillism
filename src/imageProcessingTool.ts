import cv, { Mat, Size } from "opencv-ts";

export function resize(image: Mat, width: number, height: number) : Mat {
  const newImage: Mat = new cv.Mat(image.cols, image.rows, cv.CV_8UC4);
  cv.resize(image, newImage, new cv.Size(width, height), 0, 0, cv.INTER_AREA);
  return newImage;
}

export function resizeWithRatio(image: Mat, maxWidth: number, maxHeight: number) : Mat {
  if (maxWidth === 0) {
    throw "resize : maxWidth is equal to zero. Please fill a value > 0";
  }

  if (maxHeight === 0) {
    throw "resize : maxHeight is equal to zero. Please fill a value > 0";
  }

  const ratio = Math.min(1.0, maxWidth / image.cols, maxHeight / image.rows);

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
  cv.cvtColor(imageSource, grey, cv.COLOR_RGB2GRAY)
  return grey;
}

