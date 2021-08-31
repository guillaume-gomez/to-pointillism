import React, { useEffect, useRef, useState } from 'react';

interface SliderInterface {
  value: number;
  label: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number
}

function Slider({ value, label, onChange, min = 1, max = 100, step = 1 } : SliderInterface): React.ReactElement {
  return (
    <div className="w-full">
      <div className="flex justify-between">
        <label>More Artistic</label>
        <label>More Realistic</label>
      </div>
      <input type="range" onChange={(event) => onChange(event.target.value)} min={min} max={max} value={value} step={step} className="range range-primary"></input> 
      <span>{value}</span>
   </div>
  );
}

export default Slider;
