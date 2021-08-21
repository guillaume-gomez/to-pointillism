import { Mat } from "opencv-ts";
import ColorThief from 'colorthief';
import convert from "color-convert";
import { shuffle } from "lodash";

import { saturate, rotateHue } from "./colorTools";

const PALETTE_BASE_COLOR = 20;

export function generateColorPalette(image: HTMLImageElement) : number[][] {
  let colorThief = new ColorThief();
  return colorThief.getPalette(image, PALETTE_BASE_COLOR);
}

export function extendPalette(palette: number[][]) : number[][] {
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

export function drawPalette(canvasId: string, palette: number[][]) : void {
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

function rangeOfPixels(image: Mat, grid: Array<[number, number]>, min: number, max: number ) : number[][] {
  return grid.slice(min, max).map(([col, row]) => image.ucharPtr(col, row))
}


type point = [number, number, number];

function distance([x1, y1, z1]: point, [x2, y2, z2]: point): number {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2);
}

function arrayDist(array1: point[], array2: point[]) {
  return array1.map( (point1) =>
    array2.map( (point2) => 
      distance(point1, point2)
    )
  );
}

/*
const coords : point[] = [ [35.0456, -85.2672, 0], [35.1174, -89.9711, 0], [35.9728, -83.9422, 0], [36.1667, -86.7833, 0]];

console.log(arrayDist(coords, coords))*/