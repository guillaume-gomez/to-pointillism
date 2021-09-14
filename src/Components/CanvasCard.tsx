import React, { useRef } from 'react';

interface CanvasCardInterface {
  toggleCanvas: () => void;
  title: string;
  canvasId: string;
  collapsible: boolean;
  collapse: boolean;
}

function CanvasCard({ toggleCanvas, title, canvasId, collapsible, collapse }: CanvasCardInterface): React.ReactElement {
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const refA = useRef<HTMLAnchorElement>(null);

  function saveImage() {
    if(refCanvas.current && refA.current) {
      const dataURL = refCanvas.current.toDataURL("image/png");
      (refA.current as any).download = "image.png";
      refA.current.href = dataURL.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
      window.open('about:blank','image from canvas');
    }
  }

  return (
    <div className={`bg-neutral text-neutral-content collapse w-full border rounded-box border-base-300 collapse-arrow ${collapsible ? "" : "collapse-close"}`}>
      <input type="checkbox" checked={collapse} onChange={() => toggleCanvas()}/>
      <div className="collapse-title text-xl font-medium">
        {title}
      </div>
      <div className="collapse-content flex flex-col justify-center gap-3"> 
        <canvas ref={refCanvas} className={`max-w-full`} id={canvasId}/>
        <div>
          <div className="flex flex-row-reverse">
            <a ref={refA} className="btn btn-primary" onClick={saveImage}>Save</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CanvasCard;


