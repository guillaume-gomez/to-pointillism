import cv, { Mat, Rect, Size } from "opencv-ts";
import ColorThief from 'colorthief';
import convert from "color-convert";

import { saturate, rotateHue } from "./colorTools";

const PALETTE_BASE_COLOR = 20;

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
  cv.cvtColor(imageSource, grey, cv.COLOR_BGR2GRAY)
  return grey;
}


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
  console.log(yMax)

  for(let y = 0; y < yMax; ++y) {
    for(let x = 0; x < nbBaseColor; ++x) {
      const [red, green, blue] = palette[x + y * nbBaseColor];
      context.fillStyle = `rgb(${red}, ${green}, ${blue})`;
      context.fillRect(widthColor * x, heightColor * y, widthColor, heightColor);
    }
  }
}
