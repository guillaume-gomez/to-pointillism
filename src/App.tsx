import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import UseOpenCV from "./Hooks/UseOpenCV";
import { computePointillism, test } from "./Pointillism/app";

function App() {
  const { cv, openCVLoaded } = UseOpenCV();
  const ref = useRef<HTMLImageElement>(null);
  const [progress, setProgress] = useState<number>(0);


  function loadImage(event: React.ChangeEvent<HTMLInputElement>) {
    if(event && event.target && event.target.files && ref.current) {
      ref.current.src = URL.createObjectURL(event.target.files[0]);
    }
  }

  function progressCallback(progress: number) {
    setProgress(progress);
  }

  function onLoadImage(event: React.ChangeEvent<HTMLImageElement>) {
     //test(progressCallback);
    computePointillism(cv, event.target, progressCallback);
  }

  return (
    <div className="App">
      <header className="App-header">
        { openCVLoaded ? 
          <input type="file" onChange={loadImage} /> :
          null
        }
        <img src={logo} className="App-logo" alt="logo" />
        <p>{`${progress.toFixed(2)} %`}</p>
        <img id="imageSrc" alt="No Image" ref={ref} onLoad={onLoadImage} />
        <canvas id="medianBlur"></canvas>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
