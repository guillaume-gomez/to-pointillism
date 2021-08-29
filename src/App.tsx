import React, { useEffect, useRef, useState } from 'react';
import arrowDown from './arrow-down.svg';
import background from "./background.png";
import './App.css';
import Stepper from "./Components/Stepper";
import UploadButton from "./Components/UploadButton";
import Loader from "./Components/Loader";
import Slider from "./Components/Slider";
import Button from "./Components/Button";

import UseOpenCV from "./Hooks/UseOpenCV";
import { computePointillism, MAX_THICKNESS_BRUSH, CANVAS_IDS } from "./Pointillism/pointillism";

function App() {
  const { cv, openCVLoaded } = UseOpenCV();

  const ref = useRef<HTMLImageElement>(null);
  const [progress, setProgress] = useState<number>(0);
  const [runAlgo, setRunAlgo] = useState<boolean>(false);
  const [thicknessBrush, setThicknessBrush] = useState<number>(1);
  const [visibilityCanvas, setVisibilityCanvas] = useState<boolean[]>([false, false, false, false, false, false, true]);

  useEffect(() => {
    if(runAlgo && ref.current) {
      computePointillism(cv, ref.current, thicknessBrush, progressCallback);
    }
  }, [cv, runAlgo])


  function loadImage(event: React.ChangeEvent<HTMLInputElement>) {
    if(event && event.target && event.target.files && ref.current) {
      ref.current.src = URL.createObjectURL(event.target.files[0]);
    }
  }

  function progressCallback(progress: number) {
    setProgress(progress);
    if(progress >= 100) {
      setRunAlgo(false);
    }
  }


  function submit() {
    setProgress(0);
    //setRunAlgo(true);
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
      <div className="bg-yellow-100 p-3 flex flex-col items-center gap-3 w-full">
        <div className="flex justify-between items-center w-full">
          <h2 className="flex self-start text-xl font-bold">{id}</h2>
          <span onClick={() => toggleCanvas(indexVisibilityCanvas)}>
            <img className={`w-5 transform duration-300 ease-in-out ${visibilityCanvas[indexVisibilityCanvas] ? "rotate-180": ""}`} src={arrowDown} />
          </span>
        </div>
        <canvas className={`max-w-full ${visibilityCanvas[indexVisibilityCanvas] ? "" : "hidden"} `} id={id}/>
      </div>
    );
  }

  function renderForm() {
    return (
      <div className="bg-yellow-100 p-3 flex flex-col items-center gap-3 w-full">
        <h2 className="flex self-start text-xl font-bold">Settings</h2>
        <UploadButton onChange={loadImage} />
        <Slider label="thickness brush" value={thicknessBrush} min={1} max={MAX_THICKNESS_BRUSH} onChange={(value) => setThicknessBrush(value)} />
        <div className="flex self-end">
          <Button label="Generate" onClick={submit} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundImage: `linear-gradient(180deg, rgba(55,53,53,0.8) 10%, rgba(200,200,200,0.8) 100%), url(${background})` }}>
      <div className="bg-gray-200 p-6 h-24 bg-opacity-5 text-center">
        <h1 className="font-bold text-5xl uppercase">
            Pointillism
        </h1>
      </div>
      <div className="bg-gray-200 p-6 w-full flex flex-col flex-grow items-center bg-opacity-30 gap-7">
        { openCVLoaded ? 
          renderForm()
          :<div>
            <Loader />
            Load OpenCV library
            </div>
        }
        <img className="hidden" id="imageSrc" alt="No Image" ref={ref}/>
        <div className="w-full flex flex-col items-center gap-2">
          { CANVAS_IDS.map((id, index) => renderCanvas(id, index)) }
        </div>
      </div>
      <div className="text-center bg-gray-200 p-6 h-32 bg-opacity-5 flex flex-col justify-end">
        <footer className="flex flex-col">
          <a href="https://github.com/guillaume-gomez/to-pointillism">
            Source code here
          </a>
          Made By Guillaume Gomez 2021
        </footer>
      </div>
    </div>
  );
}

export default App;
