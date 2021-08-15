type colorType = [number, number, number];


export function saturate([hue, saturation, lightness]: colorType, x: number) : colorType {
  return [hue, Math.min(100, saturation + x), lightness];
}


export function desaturate([hue, saturation, lightness]: colorType, x: number) : colorType {
  return [hue, Math.max(0, saturation - x), lightness];
}


export function lighten([hue, saturation, lightness]: colorType, x: number) : colorType {
  return [hue, saturation, Math.min(100, lightness + x)];
}


export function darken([hue, saturation, lightness]: colorType, x: number) : colorType {
  return [hue, saturation, Math.max(0, lightness - x)];
}

export function rotateHue([hue, saturation, lightness]: colorType, rotation: number) : colorType {
  const modulo = (x: number, n: number) : number => (x % n + n) % n;
  const newHue = modulo(hue + rotation, 360);
  return [newHue, saturation, lightness];
}