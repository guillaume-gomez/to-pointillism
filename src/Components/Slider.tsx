import React, { useEffect, useRef, useState } from 'react';
import ReactSlider from "react-slider"

interface SliderInterface {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number
}

function Slider({ value, onChange, min = 0.1, max = 15.38, step = 0.01 } : SliderInterface): React.ReactElement {
  return (
    <>
      <label>React Slider</label>
      <ReactSlider
        step={step}
        min={min}
        max={max}
        className="w-full h-3 pr-2 my-4 bg-gray-200 rounded-md cursor-grab -top-0.5"
        thumbClassName="absolute w-5 h-5 -top-0.5 cursor-grab bg-indigo-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 -top-0.5"
        value={value}
        onChange={onChange}
      />
      <span>{value}px</span>
   </>
  );
}

export default Slider;
