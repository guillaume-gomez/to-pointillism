import React from 'react';
import SliderWithLabel from "./SliderWithLabel";

interface GifComponentInterface {
  numberOfFrame: number;
  delay: number;
  boomerang: boolean;
  onChangeNumberOfFrame: (value: number) => void;
  onChangeDelay: (value: number) => void;
  onChangeBoomerang: (value: boolean) => void;
}

function GifComponent({numberOfFrame, delay, boomerang, onChangeNumberOfFrame, onChangeDelay, onChangeBoomerang } : GifComponentInterface): React.ReactElement {
  return (
    <div>
      <label className="text-lg">Gif settings</label>
      <div className="flex flex-row justify-between items-center gap-5 pt-2">
        <div className="w-1/3">
          <SliderWithLabel label="Number of frame" value={numberOfFrame} onChange={(value) => onChangeNumberOfFrame(parseInt(value, 10))} min={1} max={7} />
          <span className="text-xs">Number of pointillist images generated for the gif</span>
        </div>
        <div className="divider divider-vertical"></div>
        <div className="w-1/3">
          <SliderWithLabel label="Delay" value={delay} onChange={(value) => onChangeDelay(parseInt(value, 10))} step={0.1} min={0.1} max={10} />
          <span className="text-xs">Delay between each frame</span>
        </div>
        <div className="w-1/3">
          <div className="form-control">
            <label className="cursor-pointer flex justify-between gap-2">
              <span className="label-text text-neutral-content text-base font-semibold">Boomerang Gif </span> 
              <input type="checkbox" checked={boomerang} onChange={() => { onChangeBoomerang(!boomerang) } } className="checkbox checkbox-primary checkbox-md" />
            </label>
            <span className="text-xs">Append reversed frames to make a boomerang effect on your gif</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GifComponent;
