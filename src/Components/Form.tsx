import React, { useState } from 'react';
import BrushComponent from "./BrushComponent";
import ColorComponent from "./ColorComponent";
import UploadButton from "./UploadButton";
import Loader from "./Loader";
import ThicknessSlider from "./ThicknessSlider";
import SmoothnessSlider from "./SmoothnessSlider";
import PaletteSizeSlider from "./PaletteSizeSlider";
import { MAX_GRADIANT_SMOOTH_RATIO } from "../Pointillism/pointillism";


interface FormInterface {
  runAlgo: boolean;
  loadImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  smoothnessGradiant: number;
  setSmoothnessGradiant: (smoothnessGradiant: number) => void;
  brushThickness: number;
  setBrushThickness: (brushThickness: number) => void;
  autoresize: boolean;
  setAutoresize: (autoresize: boolean) => void;
  format: string;
  setFormat: (format: string) => void;
  paletteSize: number;
  setPaletteSize: (paletteSize: number) => void;
  hue: number;
  setHue: (hue: number) => void;
  saturation: number;
  setSaturation: (saturation: number) => void;
  brushStroke: number;
  setBrushStroke: (brushStroke: number) => void;
  brushOpacity: number;
  setBrushOpacity: (brushOpacity: number) => void;
  validForm: boolean;
  submit: () => void;
  resetDefaultParams: () => void;
}

function Form({
  runAlgo,
  loadImage,
  smoothnessGradiant,
  setSmoothnessGradiant,
  brushThickness,
  setBrushThickness,
  autoresize,
  setAutoresize,
  format,
  setFormat,
  paletteSize,
  setPaletteSize,
  hue,
  setHue,
  saturation,
  setSaturation,
  brushStroke,
  setBrushStroke,
  brushOpacity,
  setBrushOpacity,
  validForm,
  submit,
  resetDefaultParams
}: FormInterface): React.ReactElement {

  if(runAlgo) {
    return (
      <div className="card glass text-neutral-content">
        <div className="flex justify-center">
          <Loader width="w-80"/>
        </div>
      </div>
    );
  }

  return (
    <div className="card glass text-neutral-content">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center gap-8 py-4 w-4/5">
          <h2 className="flex text-3xl font-bold">Settings</h2>
          <UploadButton onChange={loadImage} />
          <SmoothnessSlider value={smoothnessGradiant} min={1 * 100} max={MAX_GRADIANT_SMOOTH_RATIO * 100} onChange={(value) => setSmoothnessGradiant(parseInt(value, 10))} />
          <ThicknessSlider value={brushThickness} min={1} max={20} onChange={(value) => setBrushThickness(parseInt(value, 10))} />
          <div className="w-full flex gap-5 items-center">
            <div className="w-2/4">
              <div className="form-control">
                <label className="cursor-pointer flex justify-between gap-2">
                  <span className="label-text text-neutral-content text-base font-semibold">Resize Image </span> 
                  <input type="checkbox" checked={autoresize} onChange={() => { setAutoresize(!autoresize); setBrushThickness(1)} } className="checkbox checkbox-primary checkbox-md" />
                </label>
              </div>
              <span className="text-xs">Recommanded for heavy images on low configuration.</span>
            </div>
            
            <div className="divider divider-vertical"></div>

            <div className="w-2/4 flex flex-col gap-2">
              <select onChange={(e) =>setFormat(e.target.value)} value={format} className="select select-bordered select-primary max-w-xs text-primary bg-opacity-40">
                <option className="bg-accent" disabled>Select output format</option>
                <option className="bg-accent" value="png">Png</option>
                <option className="bg-accent" value="jpeg">Jpeg</option>
              </select>
              <span className="text-xs">Output format of the image. While Png preserve quality, Jpeg is a lightweight format. Brush opacity works only on Png. </span>
            </div>
          </div>
          <details className="w-full">
            <summary className="text-xl">Advanced</summary>
            <div className="flex flex-col gap-8 pt-4">
              <PaletteSizeSlider value={paletteSize} onChange={(value) => setPaletteSize(parseInt(value, 10))}/>
              <ColorComponent
                hue={hue}
                saturation={saturation}
                onChangeHue={setHue}
                onChangeSaturation={setSaturation}
              />
            </div>
            <div className="flex flex-col gap-8 pt-4">
              <BrushComponent
                brushStroke={brushStroke}
                brushOpacity={brushOpacity}
                onChangeBrushStroke={setBrushStroke}
                onChangeBrushOpacity={setBrushOpacity}
              />
            </div>
          </details>
          <div className="w-2/4 flex flex-col gap-5">
            <div className="flex flex-col">
              <button className="btn btn-primary w-full h-16" disabled={!validForm} onClick={submit}>Generate</button>
              <button className="self-end btn btn-link btn-xs italic opacity-80" onClick={resetDefaultParams}>Reset to default params</button>
            </div>
            <p className="text-xs text-center italic opacity-60">We don't collect or share images. Everything is done locally.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Form;

