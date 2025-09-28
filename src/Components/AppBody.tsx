import { useEffect, useRef, useState } from 'react';
import Stepper from "./Stepper";
import Loader from "./Loader";
import CardStepImage from "./CardStepImage";
import CardStepGif from "./CardStepGif";
import Form from "./Form";
import DataForm from "../reducers/usePointillismParams";

import UseOpenCV from "../Hooks/UseOpenCV";
import { 
  computePointillism,
  computePointillismGif,
  hideGifID,
  MAX_GRADIANT_SMOOTH_RATIO,
  CANVAS_IDS,
  ProcessStateMachineArray,
  computeBrushThickness
} from "../Pointillism/pointillism";

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

const PARENT_GIF_ID = "gif-parent-id";

const initialCanvasCollapse = [false, false, false, false, false, false, false, false];

function AppBody() {
  const { cv, openCVLoaded } = UseOpenCV();
  const { 
    brushThickness,
    brushOpacity,
    brushStroke,
    paletteSize,
    hue,
    saturation,
    smoothnessGradiant,
    autoresize,
    format,
    setSmoothnessGradiant,
    setBrushThickness,
    setPaletteSize,
    setBrushStroke,
    setBrushOpacity,
    setHue,
    setFormat,
    setSaturation,
    numberOfFramesGif,
    setNumberOfFramesGif,
    delayGif,
    setDelayGif,
    boomerangGif,
    setBoomerangGif,
    changingBrushStrokeGif,
    setChangingBrushStrokeGif
  } = DataForm.useContainer();

  const ref = useRef<HTMLImageElement>(null);
  const [progress, setProgress] = useState<string>("");
  const [validForm, setValidForm] = useState<boolean>(false);
  const [runAlgo, setRunAlgo] = useState<boolean>(false);
  const [visibilityCanvas, setVisibilityCanvas] = useState<boolean[]>(initialCanvasCollapse);
  
  useEffect(() => {
    if(runAlgo) {
      hideGifID();
      if(format === "gif") {
        runGif();
      } else {
        runImage();
      }
    }
  }, [cv, runAlgo]);


  async function runImage() {
    if(!ref.current) {
      return;
    }
    const brushParams = { brushThickness, brushOpacity, brushStroke };
    const paletteParams = { paletteSize, hue, saturation };
    await computePointillism(cv, ref.current, smoothnessGradiant/100, autoresize, brushParams, paletteParams, progressCallback);
    showResultAnimation();
  }

  async function runGif() {
    if(!ref.current) {
      return;
    }
    const brushParams = { brushThickness, brushOpacity, brushStroke };
    const paletteParams = { paletteSize, hue, saturation };
    const gifParams = { delay: delayGif, numberOfFrames: numberOfFramesGif, boomerang: boomerangGif, changingBrushStroke: changingBrushStrokeGif };
    await computePointillismGif(cv, ref.current, smoothnessGradiant/100, autoresize, brushParams, paletteParams, gifParams, PARENT_GIF_ID, progressCallback);
    showResultAnimation();
  }

  function showResultAnimation() {
    setRunAlgo(false);
    // show last canvas with the pointillism result
    if(visibilityCanvas[visibilityCanvas.length - 1] === false) {
      toggleCardStep(visibilityCanvas.length - 1);
    }
    const divTarget = document.getElementById('finalResult'); // point the canvases (on both format)
    if(divTarget) {
      divTarget.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});  
    }
  }

  function resetDefaultParams() {
    setSmoothnessGradiant((MAX_GRADIANT_SMOOTH_RATIO * 100) /2);
    setBrushThickness(1);
    setPaletteSize(20);
    setBrushStroke(1);
    setBrushOpacity(255);
    setHue(20);
    setFormat("jpeg");
    setSaturation(20);
    setNumberOfFramesGif(3);
    setDelayGif(0.15);
    setBoomerangGif(true);
    setChangingBrushStrokeGif(false);
  }


  function loadImage(imageBase64: string, width: number, height: number) {
    const brushThickness = computeBrushThickness(width, height);
    setBrushThickness(brushThickness);
    if(ref.current) {
      ref.current.src = imageBase64;
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

  function toggleCardStep(index: number) {
    const newVisibiltyCanvas = visibilityCanvas.map((value, i) => {
      if(index === i) {
        return !value;
      }
      return value;
    });
    setVisibilityCanvas(newVisibiltyCanvas);
  }

  function renderAllSteps() {
    const infoMessage = (
      <p className="text-base font-semibold">
        Not fully satisfied 😅.
        Try again by changing default parameters.
      </p>
    );

    return CANVAS_IDS.map((id, index) => {
        if(id === "finalResult") {
          switch(format) {
            case "gif":
              return (
                <CardStepGif
                  toggleCard={() => toggleCardStep(index)}
                  title={TITLE_FROM_CANVAS_IDS[index]}
                  collapsible={validForm}
                  collapse={visibilityCanvas[index]}
                  canvasId={id}
                  gifParentId={PARENT_GIF_ID}
                >
                  {infoMessage}
                  <p className="text-base font-semibold">⌛ Please wait for the gif to play before downloading it.</p>
                </CardStepGif>
              );
            default:
              return (
                <CardStepImage
                  key={id}
                  toggleCard={() => toggleCardStep(index)}
                  title={TITLE_FROM_CANVAS_IDS[index]}
                  canvasId={id}
                  collapsible={validForm}
                  collapse={visibilityCanvas[index]}
                  format={format}
                >
                  {infoMessage}
                </CardStepImage>
              );
          }
        } else {
          return (
            <CardStepImage
              key={id}
              toggleCard={() => toggleCardStep(index)}
              title={TITLE_FROM_CANVAS_IDS[index]}
              canvasId={id}
              collapsible={validForm}
              collapse={visibilityCanvas[index]}
              format={format === "gif" ? "jpg" : format}
            />
          );
        }
      });
  }

  return (
      <div className="flex flex-col px-4 flex flex-col gap-5" >
        <div className="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>The algorithm is resource intensive. So it may not finish on mobile phone or low configuration. Please consider using resize option.</span>
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
                validForm={validForm}
                submit={submit}
                resetDefaultParams={resetDefaultParams}
              />
          }
          <img className="hidden" id="imageSrc" alt="converted source" ref={ref} onLoad={() => setValidForm(true)}/>
          <div className="w-full flex flex-col items-center gap-8 p-5 card glass text-neutral-content rounded-box">
            <h2 className="text-3xl font-bold text-neutral-content">Results</h2>
            <Stepper steps={ProcessStateMachineArray} currentStep={progress} />
            <div className="w-full flex flex-col items-center gap-2">
              {renderAllSteps()}
            </div>
          </div>
      </div>
  );
}

export default AppBody;
