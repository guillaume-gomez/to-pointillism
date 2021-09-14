import React, { useEffect, useState } from 'react';
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
    <ul className="steps w-full overflow-auto">
      {
        steps.map((step, index) => {
          if(index <= stepIndex) {
            return (
              <li key={step} className="step step-primary text-neutral-content">
                <span className="hidden lg:block xl:block 2xl:block">{step}</span>
              </li>
            );
          }
          return (
            <li key={step} className="step text-neutral-content">
              <span className="hidden lg:block xl:block 2xl:block">{step}</span>
            </li>
            );
        })
      }
    </ul>
  );
}

export default Stepper;


