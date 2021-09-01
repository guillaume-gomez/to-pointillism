import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { range } from "lodash";
import Stepper from "./Components/Stepper";
import UploadButton from "./Components/UploadButton";
import Loader from "./Components/Loader";
import Slider from "./Components/Slider";
import Footer from "./Components/Footer";
import NavBar from "./Components/NavBar";
import CanvasCard from "./Components/CanvasCard";

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
  const refCanvas = useRef<HTMLCanvasElement[]>([]);

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

  function renderAllCanvas() {
    return CANVAS_IDS.map((id, index) => {
        if(id === "finalResult") {
          return (
            <div className="w-full" key={id} ref={refFinalResult}>
              <CanvasCard
                toggleCanvas={() => toggleCanvas(index)}
                title={TITLE_FROM_CANVAS_IDS[index]}
                canvasId={id}
                collapsible={validForm}
              />
            </div>
          );
        } else {
          return (
            <CanvasCard
              toggleCanvas={() => toggleCanvas(index)}
              title={TITLE_FROM_CANVAS_IDS[index]}
              canvasId={id}
              collapsible={validForm}
            />
          );
        }
      });
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
          <div className="alert alert-warning">
            <div className="flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 mx-2 stroke-current"> 
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg> 
              <label>The algorithm is resource intensive. So it may not finish on mobile phone or low configuration.</label>
            </div>
          </div>
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
            <div className="w-full flex flex-col items-center gap-3 pt-5 border rounded-box">
              <h2 className="text-xl font-bold text-neutral-content">Results</h2>
              <Stepper steps={ProcessStateMachineArray} currentStep={progress} />
              {renderAllCanvas()}
            </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
