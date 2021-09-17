import React from 'react';
import Slider from "./Slider";

interface PaletteSizeSliderInterface {
  value: number;
  onChange: (value: string) => void;
}

function PaletteSizeSlider({ value, onChange } : PaletteSizeSliderInterface): React.ReactElement {
  return (
    <div className="w-full">
      <label>Palette Size</label>
      <Slider value={value} onChange={onChange} min={5} max={20} step={1}/>
      <span>{value}</span>
   </div>
  );
}

export default PaletteSizeSlider;
