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
    setBoomerangGif
  } = DataForm.useContainer();

  return (
    <div>
      <label className="text-lg">Gif settings</label>
      <div className="flex flex-row justify-between items-center gap-5 pt-2">
        <div className="w-1/3">
          <SliderWithLabel label="Number of frame" value={numberOfFramesGif} onChange={(value) => setNumberOfFramesGif(parseInt(value, 10))} min={1} max={7} />
          <span className="text-xs">Number of pointillist images generated for the gif</span>
        </div>
        <div className="divider divider-vertical"></div>
        <div className="w-1/3">
          <SliderWithLabel label="Delay" value={delayGif} onChange={(value) => setDelayGif(parseInt(value, 10))} step={0.1} min={0.1} max={10} />
          <span className="text-xs">Delay between each frame</span>
        </div>
        <div className="w-1/3">
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
