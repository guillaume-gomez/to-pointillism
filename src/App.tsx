import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Stepper from "./Components/Stepper";
import UploadButton from "./Components/UploadButton";
import Loader from "./Components/Loader";
import ThicknessSlider from "./Components/ThicknessSlider";
import SmoothnessSlider from "./Components/SmoothnessSlider";
import PaletteSizeSlider from "./Components/PaletteSizeSlider";
import Footer from "./Components/Footer";
import NavBar from "./Components/NavBar";
import CanvasCard from "./Components/CanvasCard";
import ColorComponent from "./Components/ColorComponent";

import UseOpenCV from "./Hooks/UseOpenCV";
import { computePointillism, MAX_GRADIANT_SMOOTH_RATIO, CANVAS_IDS, ProcessStateMachineArray, computeThicknessBrush } from "./Pointillism/pointillism";

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

const initialCanvasCollapse = [false, false, false, false, false, false, false, false];

function App() {
  const { cv, openCVLoaded } = UseOpenCV();

  const ref = useRef<HTMLImageElement>(null);
  const refFinalResult = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState<string>("");
  const [validForm, setValidForm] = useState<boolean>(false);
  const [autoresize, setAutoresize] = useState<boolean>(false);
  const [runAlgo, setRunAlgo] = useState<boolean>(false);
  const [smoothnessGradiant, setSmoothnessGradiant] = useState<number>((MAX_GRADIANT_SMOOTH_RATIO * 100) /2);
  const [thickness, setThickness] = useState<number>(1);
  const [paletteSize, setPaletteSize] = useState<number>(20);
  const [hue, setHue] = useState<number>(20);
  const [format, setFormat] = useState<string>("jpeg");
  const [saturation, setSaturation] = useState<number>(20);
  const [visibilityCanvas, setVisibilityCanvas] = useState<boolean[]>(initialCanvasCollapse);
  
  useEffect(() => {
    if(runAlgo && ref.current) {
      computePointillism(cv, ref.current, smoothnessGradiant/100, thickness, paletteSize, hue, saturation, autoresize, progressCallback).then(() => {
        setRunAlgo(false);
        // show last canvas with the pointillism result
        if(visibilityCanvas[visibilityCanvas.length - 1] === false) {
          toggleCanvas(visibilityCanvas.length - 1);
        }

        if(refFinalResult.current) {
          refFinalResult.current.scrollIntoView({behavior: "smooth"});
        }
      })
    }
  }, [cv, runAlgo])


  function loadImage(event: React.ChangeEvent<HTMLInputElement>) {
    if(event && event.target && event.target.files && ref.current) {
      ref.current.src = URL.createObjectURL(event.target.files[0]);
      ref.current.onload =  (event: any) => {
          const thickness = computeThicknessBrush(event.target.width, event.target.height);
          setThickness(thickness)
      };
    }
  }


  function progressCallback(progress: string) {
    setProgress(progress);
  }


  function submit() {
    setProgress("");
    setVisibilityCanvas(initialCanvasCollapse);
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
                collapse={visibilityCanvas[index]}
                format={format}
              >
                <p className="text-base font-semibold">
                  Not fully satisfied ????.
                  Try again by changing default parameters.
                </p>
              </CanvasCard>
            </div>
          );
        } else {
          return (
            <CanvasCard
              key={id}
              toggleCanvas={() => toggleCanvas(index)}
              title={TITLE_FROM_CANVAS_IDS[index]}
              canvasId={id}
              collapsible={validForm}
              collapse={visibilityCanvas[index]}
              format={format}
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
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center gap-8 py-4 w-4/5">
          <h2 className="flex text-3xl font-bold">Settings</h2>
          <UploadButton onChange={loadImage} />
          <SmoothnessSlider value={smoothnessGradiant} min={1 * 100} max={MAX_GRADIANT_SMOOTH_RATIO * 100} onChange={(value) => setSmoothnessGradiant(parseInt(value, 10))} />
          <ThicknessSlider value={thickness} min={1} max={20} onChange={(value) => setThickness(parseInt(value, 10))} />
          <div className="w-full flex gap-5 items-center">
            <div className="w-2/4">
              <div className="form-control">
                <label className="cursor-pointer flex justify-between gap-2">
                  <span className="label-text text-neutral-content text-base font-semibold">Resize Image </span> 
                  <input type="checkbox" checked={autoresize} onChange={() => { setAutoresize((old) => !old); setThickness(1)} } className="checkbox checkbox-primary checkbox-md" />
                </label>
              </div>
              <span className="text-xs">Recommanded for heavy images on low configuration.</span>
            </div>
            
            <div className="divider divider-vertical"></div>

            <div className="w-2/4 flex flex-col gap-2">
              <select onChange={(e) =>setFormat(e.target.value)} value={format} className="select select-bordered select-primary max-w-xs text-primary bg-opacity-50">
                <option disabled>Select output format</option>
                <option value="png">Png</option>
                <option value="jpeg">Jpeg</option>
              </select>
              <span className="text-xs">Output format of the image. While Png preserve quality, Jpeg is a lightweight format.</span>
            </div>
          </div>
          <details className="w-full">
            <summary className="text-xl">Advanced</summary>
            <div className="flex flex-col gap-8 pt-4">
              <PaletteSizeSlider value={paletteSize} onChange={(value) => setPaletteSize(parseInt(value, 10))}/>
              <ColorComponent hue={hue} saturation={saturation} onChangeHue={setHue} onChangeSaturation={setSaturation} />
            </div>
          </details>
          <div className="w-2/4 flex flex-col gap-2">
            <button className="btn btn-primary w-full h-16" disabled={!validForm} onClick={submit}>Generate</button>
            <p className="text-xs italic opacity-60">We don't collect or share images. Everything is done locally.</p>
          </div>
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
      <div className="container mx-auto flex flex-col gap-5 bg-neutral">
        <NavBar/>
        <div className="flex flex-col px-4 flex flex-col gap-5" >
          <div className="alert alert-warning">
            <div className="flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 mx-2 stroke-current"> 
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg> 
              <label>The algorithm is resource intensive. So it may not finish on mobile phone or low configuration. Please consider using resize option.</label>
            </div>
          </div>
            {
              !openCVLoaded ?
              (<div className="flex flex-col items-center text-neutral-content">
                <Loader/>
                Loading OpenCV library
              </div>)
              :
              renderForm()
            }
            <img className="hidden" id="imageSrc" alt="No Image" ref={ref} onLoad={() => setValidForm(true)}/>
            <div className="w-full flex flex-col items-center gap-8 p-5 card glass text-neutral-content rounded-box">
              <h2 className="text-3xl font-bold text-neutral-content">Results</h2>
              <Stepper steps={ProcessStateMachineArray} currentStep={progress} />
              <div className="w-full flex flex-col items-center gap-2">
                {renderAllCanvas()}
              </div>
            </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
