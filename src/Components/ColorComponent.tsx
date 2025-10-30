import React from 'react';
import SliderWithLabel from "./SliderWithLabel";
import DataForm from "../reducers/usePointillismParams";

function ColorComponent(): React.ReactElement {
    const { 
    hue,
    setHue,
    saturation,
    setSaturation
  } = DataForm.useContainer();

  return (
    <div>
      <label className="text-lg">Advanced palette settings</label>
      <div className="flex flex-col md:flex-row justify-between gap-5 pt-2">
        <div className="w-full md:w-2/4">
          <SliderWithLabel label="Hue Level" value={hue} onChange={(value) => setHue(parseInt(value, 10))} min={0} max={360} />
          <span className="text-xs">Hue level will change the second row in the palette</span>
        </div>
        <div className="w-full md:w-2/4">
          <SliderWithLabel label="Saturation Level" value={saturation} onChange={(value) => setSaturation(parseInt(value, 10))} min={0} max={100} />
          <span className="text-xs">Saturation level will change the third and the fourth rows in the palette </span>
        </div>
      </div>
    </div>
  );
}

export default ColorComponent;
