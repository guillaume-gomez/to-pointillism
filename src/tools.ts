import { Mat } from "opencv-ts";
import ColorThief from 'colorthief';
import convert from "color-convert";
import { shuffle, max, sum } from "lodash";

import { saturate, rotateHue } from "./colorTools";

import { bisect_left } from "aureooms-js-bisect";

const PALETTE_BASE_COLOR = 20;
type point = [number, number, number];

export function generateColorPalette(image: HTMLImageElement) : point[] {
  let colorThief = new ColorThief();
  return colorThief.getPalette(image, PALETTE_BASE_COLOR);
}

export function extendPalette(palette: point[]) : point[] {
  const moreSaturatedPalette = palette.map(([red, green, blue]) => {
    const [hue, saturation, lightness] = convert.rgb.hsl(red, green, blue);
    const [_, moreSaturated, __] = saturate([hue, saturation, lightness], 20);
    return convert.hsl.rgb([hue, moreSaturated, lightness]);
  });

  function moreHuePaletteGenerator() {
    return palette.map(([red, green, blue]) => {
      const random = Math.random() * (20 - -20) + -20;
      
      const [hue, saturation, lightness] = convert.rgb.hsl(red, green, blue);
      const [newHue, _, __] = rotateHue([hue, saturation, lightness], random);
      return convert.hsl.rgb([newHue, saturation, lightness]);
    });
  }
  return [...palette.slice(0), ...moreSaturatedPalette, ...moreHuePaletteGenerator(), ...moreHuePaletteGenerator()];
}

export function drawPalette(canvasId: string, palette: point[]) : void {
  let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas.getContext) {
    throw "cannot find canvas to draw palette";
  }
  let context = canvas.getContext('2d') as CanvasRenderingContext2D;

  const nbBaseColor = PALETTE_BASE_COLOR;
  
  const widthColor = canvas.width / nbBaseColor;
  const heightColor = widthColor;

  const yMax = palette.length / nbBaseColor;

  for(let y = 0; y < yMax; ++y) {
    for(let x = 0; x < nbBaseColor; ++x) {
      const [red, green, blue] = palette[x + y * nbBaseColor];
      context.fillStyle = `rgb(${red}, ${green}, ${blue})`;
      context.fillRect(widthColor * x, heightColor * y, widthColor, heightColor);
    }
  }
}

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min +1)) + min;
}

export function generateRandomGrid(width: number, height: number, scale: number = 3) {
  const ratio = (scale / 2) >> 0;
  let grid : Array<any> = [];

  for(let i = 0; i < height; i = i + scale) {
    for(let j = 0; j < width; j = j + scale) {
      const y = getRandomIntInclusive(-ratio, ratio) + i;
      const x = getRandomIntInclusive(-ratio, ratio) + j;
      
      grid.push([y % height, x % width])
    }
  }
  return shuffle(grid);
}

export function rangeOfPixels(image: Mat, grid: Array<[number, number]>, min: number, max: number ) : point[] {
  return grid.slice(min, max).map(([col, row]) => image.ucharPtr(col, row) as point)
}



function distance([x1, y1, z1]: point, [x2, y2, z2]: point): number {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2);
}

function arrayDist(array1: point[], array2: point[]) : number[][] {
  return array1.map( (point1) =>
    array2.map( (point2) => 
      distance(point1, point2)
    )
  );
}

/*
const coords : point[] = [ [35.0456, -85.2672, 0], [35.1174, -89.9711, 0], [35.9728, -83.9422, 0], [36.1667, -86.7833, 0]];

console.log(arrayDist(coords, coords))*/

function arrayMax(array: number[][]) : number[] {
  return array.map((subArray) => max(subArray) as number);
}


export function computeColorProbabilities(pixels: point[], palette: point[], k=9) : number[][] {
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
/*console.log(cumulativeSum([[1, 2, 3], [4, 5, 6]])) */

export function colorSelect(probabilities : number[], palette : point[]): point {
  const r = Math.random();
  const index : number = bisect_left(probabilities, r);

  if(index < palette.length) {
    return palette[index];
  } else {
    return palette[palette.length - 1];
  }
}