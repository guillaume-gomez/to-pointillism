import React, { useRef, ReactNode } from 'react';
import { format as formatFns } from "date-fns";
import { GIF_IMG_ID, CANVAS_IDS } from "../Pointillism/pointillism";

interface CanvasCardInterface {
  toggleCanvas: () => void;
  title: string;
  canvasId: string;
  collapsible: boolean;
  collapse: boolean;
  format: string;
  children?: ReactNode
}

function CanvasCard({ toggleCanvas, title, canvasId, collapsible, collapse, format, children }: CanvasCardInterface): React.ReactElement {
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const refA = useRef<HTMLAnchorElement>(null);

  function saveImage() {
    if(refCanvas.current && refA.current) {
      // in case of intermediate canvas for the gif
      const sanitizedFormat = format === "gif" ? "png" : format;
      const dataURL = refCanvas.current.toDataURL(`image/${sanitizedFormat}`);
      const dateString = formatFns(new Date(), "dd-MM-yyyy-hh-mm");
      (refA.current as any).download = `${dateString}-pointillism.${sanitizedFormat}`;
      refA.current.href = dataURL.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    }
  }

  function saveGif() {
    // the image tag is insert and generated in computePointillismGif function (see pointillism)
    const imageTag = document.getElementById(GIF_IMG_ID) as HTMLImageElement;
    if(imageTag && refA.current) {
      const dateString = formatFns(new Date(), "dd-MM-yyyy-hh-mm");
      (refA.current as any).download = `${dateString}-pointillism.${format}`;
      refA.current.href = imageTag.src;
    }
  }



  return (
    <div className={`bg-neutral text-neutral-content collapse w-full border rounded-box border-base-300 collapse-arrow ${collapsible ? "" : "collapse-close"}`}>
      <input type="checkbox" checked={collapse} onChange={() => toggleCanvas()}/>
      <div className="collapse-title text-lg font-medium">
        {title}
      </div>
      <div className="collapse-content flex flex-col justify-center items-center gap-3"> 
        <canvas ref={refCanvas} className={`max-w-full rounded-lg`} id={canvasId}/>
        { children ?
            children
            : null
        }
        <div className="flex flex-row self-end">
          <a
            ref={refA}
            className="btn btn-primary"
            onClick={
              canvasId === CANVAS_IDS[CANVAS_IDS.length - 1] && format === "gif" ?
                saveGif :
                saveImage
            }
          >
            Save
          </a>
        </div>
        {
          canvasId === CANVAS_IDS[CANVAS_IDS.length -1] ?
           <p className="text-base font-semibold">
             Not fully satisfied 😅.
             Try again by changing default parameters.
           </p>
          : <></>
        }
      </div>
    </div>
  );
}

export default CanvasCard;


