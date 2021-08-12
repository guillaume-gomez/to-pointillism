import cv, { Mat} from "opencv-ts";

class ColorPalette {
  image: Mat;
  paletteSize: number;

  constructor(image: Mat, paletteSize: number = 20) {
    this.image = image;
    this.paletteSize = paletteSize;
  }

}

export default ColorPalette;