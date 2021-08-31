import React, { useEffect, useRef, useState } from 'react';
import arrowDown from './arrow-down.svg';
import background from "./background.png";
import './App.css';
import Stepper from "./Components/Stepper";
import UploadButton from "./Components/UploadButton";
import Loader from "./Components/Loader";
import Slider from "./Components/Slider";
import Footer from "./Components/Footer";
import NavBar from "./Components/NavBar";

import UseOpenCV from "./Hooks/UseOpenCV";
import { computePointillism, MAX_THICKNESS_BRUSH, CANVAS_IDS } from "./Pointillism/pointillism";

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

function App() {
  const { cv, openCVLoaded } = UseOpenCV();

  const ref = useRef<HTMLImageElement>(null);
  const refFinalResult = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState<number>(0);
  const [validForm, setValidForm] = useState<boolean>(false);
  const [runAlgo, setRunAlgo] = useState<boolean>(false);
  const [thicknessBrush, setThicknessBrush] = useState<number>(1);
  const [visibilityCanvas, setVisibilityCanvas] = useState<boolean[]>([false, false, false, false, false, false, false, true]);

  useEffect(() => {
    if(runAlgo && ref.current) {
      computePointillism(cv, ref.current, thicknessBrush / 100, progressCallback);
    }
  }, [cv, runAlgo])


  function loadImage(event: React.ChangeEvent<HTMLInputElement>) {
    if(event && event.target && event.target.files && ref.current) {
      ref.current.src = URL.createObjectURL(event.target.files[0]);
    }
  }

  function progressCallback(progress: number) {
    setProgress(progress);
    if(progress >= 99) {
      setRunAlgo(false);
      setProgress(0);
      if(refFinalResult && refFinalResult.current) {
        refFinalResult.current.scrollIntoView({behavior: "smooth"});
      }
    }
  }


  function submit() {
    setProgress(0);
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
      <div key={id} className="bg-primary p-3 flex flex-col items-center gap-3 w-full">
        <div className="flex justify-between items-center w-full">
          <h2 className="flex self-start text-xl font-bold">{TITLE_FROM_CANVAS_IDS[indexVisibilityCanvas]}</h2>
          <span onClick={() => toggleCanvas(indexVisibilityCanvas)}>
            <img className={`w-5 transform duration-300 ease-in-out ${visibilityCanvas[indexVisibilityCanvas] ? "rotate-180": ""}`} src={arrowDown} />
          </span>
        </div>
        <canvas className={`max-w-full ${visibilityCanvas[indexVisibilityCanvas] ? "" : "hidden"} `} id={id}/>
      </div>
    );
  }

  function renderForm() {
    const content = runAlgo ?
      <Loader width="w-80"/>
    :
    (
      <div className="flex flex-col items-center gap-3 w-full p-4">
        <h2 className="flex self-start text-xl font-bold">Settings</h2>
        <UploadButton onChange={loadImage} />
        <Slider label="thickness brush" value={thicknessBrush} min={1 * 100} max={MAX_THICKNESS_BRUSH * 100} onChange={(value) => setThicknessBrush(parseInt(value))} />
        <div className="flex self-end">
          <button className="btn btn-primary" disabled={!validForm} onClick={submit}>J'aime les haricots</button>
        </div>
      </div>
   );

    return (
      <div className="card glass lg:card-side text-neutral-content">
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundImage: `linear-gradient(180deg, rgba(55,53,53,0.8) 10%, rgba(200,200,200,0.8) 100%), url(${background})` }}>
      <NavBar/>
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
        <div className="w-full flex flex-col items-center gap-2">
          <h2 className="text-xl font-bold">Results</h2>
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
      
      <Footer />
    </div>
  );
}

export default App;
