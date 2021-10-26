import React from 'react';
import SliderWithLabel from "./SliderWithLabel";

interface ThicknessSliderInterface {
  value: number;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
}

function ThicknessSlider({ value, onChange, min = 1, max = 100 } : ThicknessSliderInterface): React.ReactElement {
  return (
    <div className="w-full">
      <SliderWithLabel label="Thickness "value={value} onChange={onChange} min={min} max={max} step={1}/>
      <span className="text-xs">The thickness of the brush. You can let the algorithm choose for you.</span>
   </div>
  );
}

export default ThicknessSlider;
