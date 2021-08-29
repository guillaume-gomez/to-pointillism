import React, { useEffect, useRef, useState } from 'react';
import ReactSlider from "react-slider"

interface ButtonInterface {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function Button({ label, onClick, disabled } : ButtonInterface): React.ReactElement {
  const btnclassName = !!disabled ?
    "bg-opacity-50 bg-white border-2 border-secondary rounded-lg font-bold text-secondary px-4 py-3 cursor-not-allowed" :
    "bg-opacity-50 bg-white border-2 border-secondary rounded-lg font-bold text-secondary px-4 py-3 transition duration-300 ease-in-out hover:bg-secondary hover:text-white"

  return (
    <button onClick={onClick} className={btnclassName}>
      {label}
    </button>
  );
}

export default Button;


