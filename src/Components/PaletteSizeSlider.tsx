import React from 'react';
import SliderWithLabel from "./SliderWithLabel";

interface PaletteSizeSliderInterface {
  value: number;
  onChange: (value: string) => void;
}

function PaletteSizeSlider({ value, onChange } : PaletteSizeSliderInterface): React.ReactElement {
  return (
    <div className="w-full">
      <SliderWithLabel label="Palette Size" value={value} onChange={onChange} min={5} max={20} step={1}/>
   </div>
  );
}

export default PaletteSizeSlider;
