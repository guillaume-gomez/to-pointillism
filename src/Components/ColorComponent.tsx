import React from 'react';
import Slider from "./Slider";

interface ColorComponentInterface {
  hue: number;
  saturation: number;
  onChangeHue: (value: number) => void;
  onChangeSaturation: (value: number) => void;
}

function ColorComponent({hue, saturation, onChangeHue, onChangeSaturation } : ColorComponentInterface): React.ReactElement {
  return (
    <details className="w-full">
      <summary>Advanced palette settings</summary>
      <div className="flex flex-col gap-5">
        <div>
          <label>Hue Level</label>
          <Slider value={hue} onChange={(value) => onChangeHue(parseInt(value, 10))} min={0} max={360} />
          <p>{hue}</p>
          <span className="text-sm">Hue level will change the second row in the palette</span>
        </div>
        <div>
          <label>Saturation Level</label>
          <Slider value={saturation} onChange={(value) => onChangeSaturation(parseInt(value, 10))} min={0} max={100} />
          <p>{saturation}</p>
          <span className="text-sm">Saturation level will change the third and the fourth rows in the palette </span>
        </div>
      </div>
    </details>
  );
}

export default ColorComponent;
