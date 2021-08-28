import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import background from "./background.png";
import './App.css';
import Stepper from "./Components/Stepper";
import UseOpenCV from "./Hooks/UseOpenCV";
import { computePointillism } from "./Pointillism/pointillism";

function App() {
  const { cv, openCVLoaded } = UseOpenCV();
  const ref = useRef<HTMLImageElement>(null);
  const [progress, setProgress] = useState<number>(0);
  const [runAlgo, setRunAlgo] = useState<boolean>(false);

  useEffect(() => {
    if(runAlgo && ref.current) {
      computePointillism(cv, ref.current, progressCallback);
    }
  }, [cv, runAlgo])


  function loadImage(event: React.ChangeEvent<HTMLInputElement>) {
    if(event && event.target && event.target.files && ref.current) {
      ref.current.src = URL.createObjectURL(event.target.files[0]);
      setRunAlgo(false);
      setProgress(0);
    }
  }

  function progressCallback(progress: number) {
    setProgress(progress);
  }

  function onLoadImage(event: React.ChangeEvent<HTMLImageElement>) {
    setRunAlgo(true);
  }

  return (
    <div className="min-h-screen flex flex-col text-center" style={{ backgroundImage: `linear-gradient(180deg, rgba(55,53,53,0.8) 10%, rgba(200,200,200,0.8) 100%), url(${background})` }}>
      <div className="bg-gray-200 p-6 h-24 bg-opacity-5">
        <h1 className="font-bold text-5xl uppercase">
            Pointillism
        </h1>
      </div>
      <div className="bg-gray-200 p-6 flex-grow bg-opacity-30">
        { openCVLoaded ? 
          <input type="file" onChange={loadImage} /> :
          null
        }
        <p>{`${progress.toFixed(2)} %`}</p>
        <img id="imageSrc" alt="No Image" ref={ref} onLoad={onLoadImage} />
        <canvas id="medianBlur" />
      </div>
      <div className="bg-gray-200 p-6 h-32 bg-opacity-5 flex flex-col justify-end">
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
