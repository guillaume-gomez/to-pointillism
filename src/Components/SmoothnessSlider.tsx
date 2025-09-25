import React from 'react';
import Slider from "./Slider";

interface SmoothnessSliderInterface {
  value: number;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
}

function SmoothnessSlider({ value, onChange, min = 1, max = 100 } : SmoothnessSliderInterface): React.ReactElement {
  return (
    <div className="w-full">
      <div className="flex justify-between text-base font-semibold">
        <label>More Artistic</label>
        <label>More Realistic</label>
      </div>
      <Slider value={value} onChange={onChange} min={min} max={max} step={1}/>
      <div className="flex justify-between">
        <span className="text-xs">The more the algorithm is artistic, the more it will apply distortion on base image.</span>
        <span className="badge badge-secondary badge-lg">{value}</span>
      </div>
   </div>
  );
}

export default SmoothnessSlider;
