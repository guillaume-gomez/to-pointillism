import { Mat } from "opencv-ts";
import { shuffle, max, sum } from "lodash";
import { bisect_left } from "aureooms-js-bisect";

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
  let distances = arrayDist(pixels, palette);
  const maxima = arrayMax(distances);

  distances = subArray(maxima, distances);
  let summ = distances.map(row => sum(row));
  distances = divideArray(summ, distances);

  distances = expArray(k*palette.length, distances);
  summ = distances.map(row => sum(row));
  distances = divideArray(summ, distances);

  return cumulativeSum(distances);
}


function distance([x1, y1, z1]: pixel, [x2, y2, z2]: pixel): number {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2);
}

function arrayDist(array1: pixel[], array2: pixel[]) : number[][] {
  return array1.map( (point1) =>
    array2.map( (point2) => 
      distance(point1, point2)
    )
  );
}

function arrayMax(array: number[][]) : number[] {
  return array.map((subArray) => max(subArray) as number);
}



function subArray(a: number[], b: number[][]) : number[][] {
  return b.map((arrayVal, index) => 
    arrayVal.map(val =>
      (a[index] - val)
    )
  );
}

function divideArray(a: number[], b: number[][]) : number[][] {
  return b.map((arrayVal, index) => 
    arrayVal.map(val =>
      ( val / a[index])
    )
  );
}

function expArray(a: number, b: number[][]) : number[][] {
  return b.map((arrayVal) => 
    arrayVal.map(val =>
       Math.exp(val * a)
    )
  );
}

function cumulativeSum(array: number[][]) : number[][] {
  const cumulativeSumOP = ((sum: number) => (value:number) => sum += value);
  return array.map(row =>
     row.map(cumulativeSumOP(0))
  );
}