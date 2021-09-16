import React from 'react';
import Slider from "./Slider";

interface ThicknessSliderInterface {
  value: number;
  label: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number
}

function ThicknessSlider({ value, label, onChange, min = 1, max = 100, step = 1 } : ThicknessSliderInterface): React.ReactElement {
  return (
    <div className="w-full">
      <div className="flex justify-between">
        <label>More Artistic</label>
        <label>More Realistic</label>
      </div>
      <Slider value={value} onChange={onChange} min={min} max={max} step={step}/>
      <span>{value}</span>
   </div>
  );
}

export default ThicknessSlider;
