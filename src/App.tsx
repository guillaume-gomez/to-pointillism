import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Stepper from "./Components/Stepper";
import Footer from "./Components/Footer";
import NavBar from "./Components/NavBar";
import Loader from "./Components/Loader";
import CanvasCard from "./Components/CanvasCard";
import gifShot from "gifshot";
import Form from "./Components/Form";

import UseOpenCV from "./Hooks/UseOpenCV";
import { computePointillism, MAX_GRADIANT_SMOOTH_RATIO, CANVAS_IDS, ProcessStateMachineArray, computeBrushThickness } from "./Pointillism/pointillism";

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
  const [brushThickness, setBrushThickness] = useState<number>(1);
  const [paletteSize, setPaletteSize] = useState<number>(20);
  const [brushStroke, setBrushStroke] = useState<number>(1);
  const [brushOpacity, setBrushOpacity] = useState<number>(255);
  const [hue, setHue] = useState<number>(20);
  const [format, setFormat] = useState<string>("jpeg");
  const [saturation, setSaturation] = useState<number>(20);
  const [visibilityCanvas, setVisibilityCanvas] = useState<boolean[]>(initialCanvasCollapse);
  
  useEffect(() => {
    if(runAlgo && ref.current) {
      runGif();
    }
  }, [cv, runAlgo]);


  function runImage() {
    if(!ref.current) {
      return;
    }
    const brushParams = { brushThickness, brushOpacity, brushStroke };

    computePointillism(cv, ref.current, smoothnessGradiant/100, brushParams, paletteSize, hue, saturation, autoresize, progressCallback).then(() => {
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

  async function runGif() {
    if(!ref.current) {
      return;
    }
    let images = [];
    // add loop option
    for(let i = 1; i <= 7; i++) {
      console.log("images");
      const brushParams = { brushThickness, brushOpacity, brushStroke: i };
      await computePointillism(cv, ref.current, smoothnessGradiant/100, brushParams, paletteSize, hue, saturation, autoresize, progressCallback)
      setProgress("");
      setVisibilityCanvas(initialCanvasCollapse);
      if(refFinalResult.current)
      {
        const image = refFinalResult.current.getElementsByTagName("canvas")[0].toDataURL(`image/jpeg`);

        images.push(image);
      }
    }
    gifShot.createGIF({
      images: images,
      gifWidth: ref.current.width,
      gifHeight: ref.current.height,
      interval: 0.1,
    },function(obj: any) {
      if(!obj.error) {
        var image = obj.image,
        animatedImage = document.createElement('img');
        animatedImage.id = "super-truc";
        animatedImage.src = image;
        document.body.appendChild(animatedImage);
      }
    });

    setRunAlgo(false);
  }


/*  useEffect(() => {
    gifShot.createGIF({
      'images': ['http://i.imgur.com/2OO33vX.jpg', 'http://i.imgur.com/qOwVaSN.png', 'http://i.imgur.com/Vo5mFZJ.gif']
    },function(obj: any) {
      if(!obj.error) {
        var image = obj.image,
        animatedImage = document.createElement('img');
        animatedImage.id = "super-truc";
        animatedImage.src = image;
        document.body.appendChild(animatedImage);
      }
    });
  }, [])*/


  function resetDefaultParams() {
    setSmoothnessGradiant((MAX_GRADIANT_SMOOTH_RATIO * 100) /2);
    setBrushThickness(1);
    setPaletteSize(20);
    setBrushStroke(1);
    setBrushOpacity(255);
    setHue(20);
    setFormat("jpeg");
    setSaturation(20);
  }


  function loadImage(event: React.ChangeEvent<HTMLInputElement>) {
    if(event && event.target && event.target.files && ref.current) {
      ref.current.src = URL.createObjectURL(event.target.files[0]);
      ref.current.onload =  (event: any) => {
          const brushThickness = computeBrushThickness(event.target.width, event.target.height);
          setBrushThickness(brushThickness)
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
                  Not fully satisfied 😅.
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
              <Form
                runAlgo={runAlgo}
                loadImage={loadImage}
                smoothnessGradiant={smoothnessGradiant}
                setSmoothnessGradiant={setSmoothnessGradiant}
                brushThickness={brushThickness}
                setBrushThickness={setBrushThickness}
                autoresize={autoresize}
                setAutoresize={setAutoresize}
                format={format}
                setFormat={setFormat}
                paletteSize={paletteSize}
                setPaletteSize={setPaletteSize}
                hue={hue}
                setHue={setHue}
                saturation={saturation}
                setSaturation={setSaturation}
                brushStroke={brushStroke}
                setBrushStroke={setBrushStroke}
                brushOpacity={brushOpacity}
                setBrushOpacity={setBrushOpacity}
                validForm={validForm}
                submit={submit}
                resetDefaultParams={resetDefaultParams}
              />
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
