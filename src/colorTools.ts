
function rgbToLightness(r: number,g: number,b : number) : number {
  return 1/2 * (Math.max(r,g,b) + Math.min(r,g,b));
}
