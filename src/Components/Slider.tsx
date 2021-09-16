import React from 'react';

interface SliderInterface {
  value: number;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number
}

function Slider({ value, onChange, min = 1, max = 100, step = 1 } : SliderInterface): React.ReactElement {
  return (
   <input type="range" onChange={(event) => onChange(event.target.value)} min={min} max={max} value={value} step={step} className="range range-primary"></input> 
  );
}

export default Slider;
