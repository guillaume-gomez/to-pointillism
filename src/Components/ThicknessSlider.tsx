import React from 'react';
import Slider from "./Slider";

interface ThicknessSliderInterface {
  value: number;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
}

function ThicknessSlider({ value, onChange, min = 1, max = 100 } : ThicknessSliderInterface): React.ReactElement {
  return (
    <div className="w-full">
      <div className="flex justify-between">
        <label>More Artistic</label>
        <label>More Realistic</label>
      </div>
      <Slider value={value} onChange={onChange} min={min} max={max} step={1}/>
      <span>{value}</span>
   </div>
  );
}

export default ThicknessSlider;
