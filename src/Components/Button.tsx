import React, { useEffect, useRef, useState } from 'react';
import ReactSlider from "react-slider"

interface ButtonInterface {
  label: string;
  onClick: () => void;
}

function Button({ label, onClick } : ButtonInterface): React.ReactElement {
  return (
    <button onClick={onClick} className="bg-opacity-50 bg-white border-2 border-blue-600 rounded-lg font-bold text-blue-600 px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-600 hover:text-white">
      {label}
    </button>
  );
}

export default Button;


