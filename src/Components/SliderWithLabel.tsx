import React from 'react';
import Slider from "./Slider";

interface SliderWithLabelInterface {
  value: number;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
}

function SliderWithLabel({ value, onChange, min = 1, max = 100, step = 1, label } : SliderWithLabelInterface): React.ReactElement {
  return (
   <>
     <div className="flex justify-between">
       <label className="text-base font-semibold">{label}</label>
       <p className="badge badge-lg">{value}</p>
     </div>
     <Slider value={value} onChange={onChange} min={min} max={max} />
    </>
  );
}

export default SliderWithLabel;
