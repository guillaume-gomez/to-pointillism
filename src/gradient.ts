import cv, { Mat, Size } from "opencv-ts";

interface gradient {
  x: string;
  y: string;
}


export function createGradient(grey: Mat) : [Mat, Mat] {
  function divideByNumber(data: number[], x: number) : number[] {
    return data.map(d => d/x);
  }

  let dstX = new cv.Mat();
  let dstY = new cv.Mat();
  cv.Scharr(grey, dstX, cv.CV_32F, 1, 0, 1, 0, cv.BORDER_DEFAULT);
  cv.Scharr(grey, dstY, cv.CV_32F, 0, 1, 1, 0, cv.BORDER_DEFAULT);

/*  const dstxDiv = cv.matFromArray(dstX.cols, dstX.rows, cv.CV_32F, divideByNumber(dstX.data32F, 15.36));
  const dstyDiv = cv.matFromArray(dstY.cols, dstY.rows, cv.CV_32F, divideByNumber(dstY.data32F, 15.36));
  dstX.delete();
  dstY.delete();
  return [dstxDiv, dstyDiv];*/
  
  return [dstX, dstY]
}

export function smooth(fieldX: Mat, fieldY: Mat, radius: number, iterations: number = 1) : [Mat, Mat] {
  const s = 2 * radius + 1;
  const ksize = new cv.Size(s, s);
  
  let dstX = new cv.Mat();
  let dstY = new cv.Mat();
  for(let i = 0; i < iterations; ++i) {
    cv.GaussianBlur(fieldX, dstX, ksize, 0, 0, cv.BORDER_DEFAULT);
    cv.GaussianBlur(fieldY, dstY, ksize, 0, 0, cv.BORDER_DEFAULT);
  }
  return [dstX, dstY];
}

export function direction(fieldX: Mat, fieldY: Mat, i: number, j: number) : number {
  return Math.atan2(fieldY.floatAt(i, j), fieldX.floatAt(i, j));
}

export function magnitude(fieldX: Mat, fieldY: Mat, i: number, j: number) : number {
  return Math.hypot(fieldX.floatAt(i, j), fieldY.floatAt(i, j));
}
