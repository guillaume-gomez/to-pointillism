import React from 'react';
import SliderWithLabel from "./SliderWithLabel";

interface ColorComponentInterface {
  hue: number;
  saturation: number;
  onChangeHue: (value: number) => void;
  onChangeSaturation: (value: number) => void;
}

function ColorComponent({hue, saturation, onChangeHue, onChangeSaturation } : ColorComponentInterface): React.ReactElement {
  return (
    <div>
      <label className="text-lg">Advanced palette settings</label>
      <div className="flex flex-row justify-between gap-5 pt-2">
        <div className="w-2/4">
          <SliderWithLabel label="Hue Level" value={hue} onChange={(value) => onChangeHue(parseInt(value, 10))} min={0} max={360} />
          <span className="text-xs">Hue level will change the second row in the palette</span>
        </div>
        <div className="divider divider-vertical"></div>
        <div className="w-2/4">
          <SliderWithLabel label="Saturation Level" value={saturation} onChange={(value) => onChangeSaturation(parseInt(value, 10))} min={0} max={100} />
          <span className="text-xs">Saturation level will change the third and the fourth rows in the palette </span>
        </div>
      </div>
    </div>
  );
}

export default ColorComponent;
