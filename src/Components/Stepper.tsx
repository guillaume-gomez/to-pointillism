import React, { useEffect, useRef, useState } from 'react';
import { findIndex } from "lodash";

interface StepperInterface {
  steps: string[];
  currentStep: string;
}

function Stepper({ steps, currentStep }: StepperInterface): React.ReactElement {
  const [stepIndex, setStepIndex] = useState<number>(0);

  useEffect(()=> {
    const stpIndex = findIndex(steps, (step) => step === currentStep);
    if(stpIndex === -1) {
      setStepIndex(0);
    } else {
      setStepIndex(stpIndex);
    }
  }, [currentStep]);

  return (
    <ul className="w-full steps">
      {
        steps.map((step, index) => {
          if(index <= stepIndex) {
            return <li key={step} className="step step-success text-neutral-content">{step}</li> 
          }
          return <li key={step} className="step text-neutral-content">{step}</li>
        })
      }
    </ul>
  );
}

export default Stepper;


