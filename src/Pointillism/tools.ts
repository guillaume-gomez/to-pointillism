import { Mat } from "opencv-ts";
import { shuffle, max, sum } from "lodash";
import { bisect_left } from "aureooms-js-bisect";
import { GPU } from "gpu.js";

const gpu = new GPU();

type pixel = [number, number, number];

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min +1)) + min;
}

// https://web.archive.org/web/20090717035140if_/javascript.about.com/od/problemsolving/a/modulobug.htm
function mod(n : number, m: number) : number {
  return ((n % m) + m) % m;
}

export function generateRandomGrid(width: number, height: number, scale: number = 3) {
  const ratio = (scale / 2) >> 0;
  let grid : Array<any> = [];

  for(let i = 0; i < height; i = i + scale) {
    for(let j = 0; j < width; j = j + scale) {
      const y = getRandomIntInclusive(-ratio, ratio) + i;
      const x = getRandomIntInclusive(-ratio, ratio) + j;

      grid.push([mod(y, height), mod(x, width)])
    }
  }
  return shuffle(grid);
}

export function rangeOfPixels(image: Mat, grid: Array<[number, number]>, min: number, max: number ) : pixel[] {
  return grid.slice(min, max).map(([col, row]) => image.ucharPtr(col, row) as pixel)
}


export function colorSelect(probabilities : number[], palette : pixel[]): pixel {
  const r = Math.random();
  const index : number = bisect_left(probabilities, r);

  if(index < palette.length) {
    return palette[index];
  } else {
    return palette[palette.length - 1];
  }
}

export function computeColorProbabilities(pixels: pixel[], palette: pixel[], k=9) : number[][] {
  let distances = arrayDistGpu(pixels, palette) as number[][];
  //let distances = arrayDist(pixels, palette);
  const maxima = arrayMax(distances);

  subArrayMut(distances, maxima);
  let summ = distances.map(row => sum(row));
  divideArrayMut(distances, summ);

  expArrayMut( distances, k * palette.length);
  summ = distances.map(row => sum(row));
  divideArrayMut(distances, summ);

  return cumulativeSum(distances);
}

function distance([x1, y1, z1]: pixel, [x2, y2, z2]: pixel): number {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2);
}

function arrayDist(array1: pixel[], array2: pixel[]) : number[][] {
  let results = new Array(array1.length);
  for(let i = 0; i < array1.length; i++) {
    results[i] = new Array(array2.length);
    for(let j = 0; j < array2.length; j++) {
      results[i][j] = distance(array1[i], array2[j]);
    }
  }
  return results;
}

// loop are made by gpu lib. Only Distance is rewritten
const arrayDistGpu = gpu.createKernel(function(a: pixel[], b: pixel[]) {
  // eslint-disable-next-line
  return Math.sqrt((a[this.thread.y][0] - b[this.thread.x][0]) ** 2 + (a[this.thread.y][1] - b[this.thread.x][1]) ** 2 + (a[this.thread.y][2] - b[this.thread.x][2]) ** 2)  //distance(a[this.thread.x], b[this.thread.x]);
})
.setOutput([80, 5000]);
//Palette Size max, BatchSize


function arrayMax(array: number[][]) : number[] {
  let results = new Array(array.length);
  for(let i = 0; i < array.length; ++i) {
    results[i] = max(array[i]) as number
  }
  return results;
}

function subArray(a: number[], b: number[][]) : number[][] {
  return b.map((arrayVal, index) => 
    arrayVal.map(val =>
      (a[index] - val)
    )
  );
}

function subArrayMut(a: number[][], b: number[]) : void {
  for(let i = 0; i < a.length; ++i) {
    for(let j = 0; j < a[i].length; ++j) {
      a[i][j] = b[i] - a[i][j];
    }
  }
}

function divideArray(a: number[], b: number[][]) : number[][] {
  return b.map((arrayVal, index) => 
    arrayVal.map(val =>
      ( val / a[index])
    )
  );
}

function divideArrayMut(a: number[][], b: number[]) : void {
  for(let i = 0; i < a.length; ++i) {
    for(let j = 0; j < a[i].length; j++) {
      a[i][j] = a[i][j] / b[i];
    }
  }
}

function expArray(a: number, b: number[][]) : number[][] {
  return b.map((arrayVal) => 
    arrayVal.map(val =>
       Math.exp(val * a)
    )
  );
}

function expArrayMut(a: number[][], b: number) {
  for(let i = 0; i < a.length; ++i) {
    for(let j = 0; j < a[i].length; j++) {
      a[i][j] = Math.exp(a[i][j] * b);
    }
  }
}

function cumulativeSum(array: number[][]) : number[][] {
  const cumulativeSumOP = ((sum: number) => (value:number) => sum += value);

  let results = new Array(array.length);
  for(let i = 0; i < results.length; i++) {
    results[i] = array[i].map(cumulativeSumOP(0))
  }
  return results;
}
