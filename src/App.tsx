import React, { useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import UseOpenCV from "./Hooks/UseOpenCV";
import { computePointillism } from "./Pointillism/app";

function App() {
  const { cv, openCVLoaded } = UseOpenCV();
  const ref = useRef<HTMLImageElement>(null);


  function loadImage(event: React.ChangeEvent<HTMLInputElement>) {
    if(event && event.target && event.target.files && ref.current) {
      ref.current.src = URL.createObjectURL(event.target.files[0]);
    }
  }

  function onChangeImage(event: React.ChangeEvent<HTMLImageElement>) {
    console.log(event.target)
    computePointillism(cv, event.target)
  }

  return (
    <div className="App">
      <header className="App-header">
        { openCVLoaded ? 
          <input type="file" onChange={loadImage} /> :
          null
        }
        <img src={logo} className="App-logo" alt="logo" />
        <img id="imageSrc" alt="No Image" ref={ref} onLoad={onChangeImage} />
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
