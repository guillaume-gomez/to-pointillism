import ColorThief from 'colorthief';
import convert from "color-convert";
import { saturate, rotateHue } from "./colorTools";

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