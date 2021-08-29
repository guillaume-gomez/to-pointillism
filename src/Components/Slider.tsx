import React, { useEffect, useRef, useState } from 'react';
import ReactSlider from "react-slider"

interface SliderInterface {
  value: number;
  label: string;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number
}

function Slider({ value, label, onChange, min = 1, max = 100, step = 0.01 } : SliderInterface): React.ReactElement {
  return (
    <div className="w-full">
      <label>{label}</label>
      <ReactSlider
        step={step}
        min={min}
        max={max}
        className="w-full h-3 pr-2 my-4 bg-white bg-opacity-50 rounded-md cursor-grab -top-0.5"
        thumbClassName="absolute w-5 h-5 -top-0.5 cursor-grab bg-secondary rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary -top-0.5"
        value={value}
        onChange={onChange}
      />
      <span>{value}px</span>
   </div>
  );
}

export default Slider;
