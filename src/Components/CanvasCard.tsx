import React, { useRef } from 'react';

interface CanvasCardInterface {
  toggleCanvas: () => void;
  title: string;
  canvasId: string;
  collapsible: boolean;
  collapse: boolean;
  format: string;
}

function CanvasCard({ toggleCanvas, title, canvasId, collapsible, collapse, format }: CanvasCardInterface): React.ReactElement {
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const refA = useRef<HTMLAnchorElement>(null);

  function saveImage() {
    if(refCanvas.current && refA.current) {
      const dataURL = refCanvas.current.toDataURL(`image/${format}`);
      (refA.current as any).download = `image.${format}`;
      refA.current.href = dataURL.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    }
  }

  return (
    <div className={`bg-neutral text-neutral-content collapse w-full border rounded-box border-base-300 collapse-arrow ${collapsible ? "" : "collapse-close"}`}>
      <input type="checkbox" checked={collapse} onChange={() => toggleCanvas()}/>
      <div className="collapse-title text-lg font-medium">
        {title}
      </div>
      <div className="collapse-content flex flex-col justify-center gap-3"> 
        <canvas ref={refCanvas} className={`max-w-full rounded-lg`} id={canvasId}/>
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


