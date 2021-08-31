import React, { useEffect, useRef, useState } from 'react';
import arrowDown from './arrow-down.svg';
import './App.css';
import Stepper from "./Components/Stepper";
import UploadButton from "./Components/UploadButton";
import Loader from "./Components/Loader";
import Slider from "./Components/Slider";
import Footer from "./Components/Footer";
import NavBar from "./Components/NavBar";

import UseOpenCV from "./Hooks/UseOpenCV";
import { computePointillism, MAX_THICKNESS_BRUSH, CANVAS_IDS, ProcessStateMachineArray } from "./Pointillism/pointillism";

export const TITLE_FROM_CANVAS_IDS = [
  "Generate Palette",
  "Grey Scale Image",
  "Gradient on X axis",
  "Gradient on Y axis",
  "Gradient on X axis Smooth",
  "Gradient on Y axis Smooth",
  "Generate Median Blur Image",
  "Final Result"
];

const intialCanvasVisibility = [false, false, false, false, false, false, false, false];

function App() {
  const { cv, openCVLoaded } = UseOpenCV();

  const ref = useRef<HTMLImageElement>(null);
  const refFinalResult = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState<string>("");
  const [validForm, setValidForm] = useState<boolean>(false);
  const [runAlgo, setRunAlgo] = useState<boolean>(false);
  const [thicknessBrush, setThicknessBrush] = useState<number>(100);
  const [visibilityCanvas, setVisibilityCanvas] = useState<boolean[]>(intialCanvasVisibility);

  useEffect(() => {
    if(runAlgo && ref.current) {
      computePointillism(cv, ref.current, thicknessBrush/100, progressCallback).then(() => {
        setRunAlgo(false);
        if(refFinalResult.current) {
          refFinalResult.current.scrollIntoView({behavior: "smooth"});
        }
      })
    }
  }, [cv, runAlgo])


  function loadImage(event: React.ChangeEvent<HTMLInputElement>) {
    if(event && event.target && event.target.files && ref.current) {
      ref.current.src = URL.createObjectURL(event.target.files[0]);
    }
  }

  function progressCallback(progress: string) {
    setProgress(progress);
  }


  function submit() {
    setProgress("");
    setVisibilityCanvas(intialCanvasVisibility);
    setRunAlgo(true);
  }

  function toggleCanvas(index: number) {
    const newVisibiltyCanvas = visibilityCanvas.map((value, i) => {
      if(index === i) {
        return !value;
      }
      return value;
    });
    setVisibilityCanvas(newVisibiltyCanvas);
  }

  function renderCanvas(id: string, indexVisibilityCanvas: number) {
    return (
      <div key={id} className={`card glass text-neutral-content collapse w-full border rounded-box border-base-300 collapse-arrow ${validForm ? "" : "collapse-close"}`}>
        <input type="checkbox" onClick={() => toggleCanvas(indexVisibilityCanvas)}/>
        <div className="collapse-title text-xl font-medium">
          {TITLE_FROM_CANVAS_IDS[indexVisibilityCanvas]}
        </div>
        <div className="collapse-content flex flex-col justify-center gap-3"> 
          <canvas className={`border max-w-full ${visibilityCanvas[indexVisibilityCanvas] ? "" : "hidden"} `} id={id}/>
          <div>
            <div className="flex flex-row-reverse">
              <button className="btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderForm() {
    const content = runAlgo ?
      <div className="flex justify-center">
        <Loader width="w-80"/>
      </div>
    :
    (
      <div className="flex flex-col items-center gap-3 w-full p-4">
        <h2 className="flex self-start text-xl font-bold">Settings</h2>
        <UploadButton onChange={loadImage} />
        <Slider label="thickness brush" value={thicknessBrush} min={1 * 100} max={MAX_THICKNESS_BRUSH * 100} onChange={(value) => setThicknessBrush(parseInt(value))} />
        <div className="flex self-end">
          <button className="btn btn-primary" disabled={!validForm} onClick={submit}>Generate</button>
        </div>
      </div>
   );

    return (
      <div className="card glass text-neutral-content">
        {content}
      </div>
    );
  }

  return (
    <div className="bg-img">
      <div className="container mx-auto flex flex-col gap-10 bg-neutral">
        <NavBar/>
        <div className="flex flex-col px-4 flex flex-col gap-5" >
            {
              !openCVLoaded ?
              (<div className="flex flex-col items-center">
                <Loader/>
                Loading OpenCV library
              </div>)
              :
              renderForm()
            }
            <img className="hidden" id="imageSrc" alt="No Image" ref={ref} onLoad={() => setValidForm(true)}/>
            <div className="w-full flex flex-col items-center gap-3 pt-5">
              <h2 className="text-xl font-bold">Results</h2>
              <Stepper steps={ProcessStateMachineArray} currentStep={progress} />
              { CANVAS_IDS.map((id, index) => {
                  if(id === "finalResult") {
                    return (
                      <div className="w-full" key={id} ref={refFinalResult}>
                        {renderCanvas(id, index)}
                      </div>
                    );
                  } else {
                    return renderCanvas(id, index)
                  }
                })
              }
            </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
