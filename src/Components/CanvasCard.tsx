import React, { useRef, ReactNode } from 'react';
import * as dateFns from "date-fns";
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
      const dataURL = refCanvas.current.toDataURL(`image/${format}`);
      const dateString = dateFns.format(new Date(), "dd-MM-yyyy-hh-mm");
      (refA.current as any).download = `${dateString}-pointillism.${format}`;
      refA.current.href = dataURL.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
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
          <a ref={refA} className="btn btn-primary" onClick={saveImage}>Save</a>
        </div>
      </div>
    </div>
  );
}

export default CanvasCard;


