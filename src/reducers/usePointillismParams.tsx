import { useState } from "react";
import { createContainer } from "unstated-next";
import { MAX_GRADIANT_SMOOTH_RATIO } from "../Pointillism/pointillism";


function useCreateLifeInGridReducer() {
  const [autoresize, setAutoresize] = useState<boolean>(false);
  const [smoothnessGradiant, setSmoothnessGradiant] = useState<number>((MAX_GRADIANT_SMOOTH_RATIO * 100) /2);
  const [brushThickness, setBrushThickness] = useState<number>(1);
  const [paletteSize, setPaletteSize] = useState<number>(20);
  const [brushStroke, setBrushStroke] = useState<number>(1);
  const [brushOpacity, setBrushOpacity] = useState<number>(255);
  const [hue, setHue] = useState<number>(20);
  const [format, setFormat] = useState<string>("jpeg");
  const [saturation, setSaturation] = useState<number>(20);
  const [numberOfFramesGif, setNumberOfFramesGif] = useState<number>(3);
  const [delayGif, setDelayGif] = useState<number>(0.15);
  const [boomerangGif, setBoomerangGif] = useState<boolean>(true);
  const [changingBrushStrokeGif, setChangingBrushStrokeGif] = useState<number>(0);


  return {
    autoresize,
    setAutoresize,
    smoothnessGradiant,
    setSmoothnessGradiant,
    brushThickness,
    setBrushThickness,
    paletteSize,
    setPaletteSize,
    brushStroke,
    setBrushStroke,
    brushOpacity,
    setBrushOpacity,
    hue,
    setHue,
    format,
    setFormat,
    saturation,
    setSaturation,
    numberOfFramesGif,
    setNumberOfFramesGif,
    delayGif,
    setDelayGif,
    boomerangGif,
    setBoomerangGif,
    changingBrushStrokeGif,
    setChangingBrushStrokeGif
  }
}

export default createContainer(useCreateLifeInGridReducer);