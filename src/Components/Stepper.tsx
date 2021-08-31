import React, { useEffect, useRef, useState } from 'react';

function Stepper(): React.ReactElement {
  return (
  <ul className="w-full steps">
    <li className="step step-primary">Register</li> 
    <li className="step step-primary">Choose plan</li> 
    <li className="step">Purchase</li> 
    <li className="step">Receive Product</li>
  </ul>
  );
}

export default Stepper;


