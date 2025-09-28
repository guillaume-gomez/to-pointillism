import React from 'react';
import SliderWithLabel from "./SliderWithLabel";
import DataForm from "../reducers/usePointillismParams";

interface GifComponentInterface {}

function GifComponent( props : GifComponentInterface): React.ReactElement {
    const {
    numberOfFramesGif,
    setNumberOfFramesGif,
    delayGif,
    setDelayGif,
    boomerangGif,
    setBoomerangGif,
    changingBrushStrokeGif,
    setChangingBrushStrokeGif
  } = DataForm.useContainer();

  return (
    <div>
      <label className="text-lg">Gif settings</label>
      <div className="flex flex-wrap pt-2 -mx-5">
        <div className="sm:w-1/2 lg:w-1/4 px-5 py-3">
          <div className="form-control">
            <span className="label-text text-neutral-content text-base font-semibold">Modify Brush Stroke </span>
            <select
              onChange={(e) =>setChangingBrushStrokeGif(parseInt(e.target.value))}
              value={changingBrushStrokeGif}
              className="select select-bordered select-primary max-w-xs text-black bg-opacity-40"
              >
              <option className="bg-primary" value="0">keep it as it is</option>
              <option className="bg-primary" value="1">Increase</option>
              <option className="bg-primary" value="-1">Decrease</option>
            </select>
            <span className="text-xs">Increase/Decrease the brush stroke between each frame</span>
          </div>
        </div>
        <div className="sm:w-1/2 lg:w-1/4 px-5 py-3">
          <SliderWithLabel label="Number of frame" value={numberOfFramesGif} onChange={(value) => setNumberOfFramesGif(parseInt(value, 10))} min={1} max={10} />
          <span className="text-xs">Number of pointillist images generated for the gif</span>
        </div>
        <div className="sm:w-1/2 lg:w-1/4 px-5 py-3">
          <SliderWithLabel label="Delay" value={delayGif} onChange={(value) => setDelayGif(parseFloat(value))} step={0.01} min={0.1} max={3} />
          <span className="text-xs">Delay between each frame</span>
        </div>
        <div className="sm:w-1/2 lg:w-1/4 px-5 py-3">
          <div className="form-control">
            <label className="cursor-pointer flex justify-between gap-2">
              <span className="label-text text-neutral-content text-base font-semibold">Boomerang Gif </span> 
              <input type="checkbox" checked={boomerangGif} onChange={() => { setBoomerangGif(!boomerangGif) } } className="checkbox checkbox-primary checkbox-md" />
            </label>
            <span className="text-xs">Append reversed frames to make a boomerang effect on your gif</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GifComponent;
