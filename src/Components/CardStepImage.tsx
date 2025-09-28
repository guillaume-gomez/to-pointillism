import React, { useRef, type RefObject } from 'react';
import { format as formatFns } from "date-fns";
import CardStep, { type CardStepInterface } from "./CardStep";

interface CardStepImageInterface extends Omit<CardStepInterface, 'save'> {
  canvasId: string;
  format: string;
}

function CardStepImage({ toggleCard, title, canvasId, collapsible, collapse, format, children }: CardStepImageInterface): React.ReactElement {
  const refCanvas = useRef<HTMLCanvasElement>(null);

  function saveImage(anchorRef: RefObject<HTMLAnchorElement>) {
    if(refCanvas.current && anchorRef.current) {
      const dataURL = refCanvas.current.toDataURL(`image/${format}`);
      const dateString = formatFns(new Date(), "dd-MM-yyyy-hh-mm");
      (anchorRef.current as any).download = `${dateString}-pointillism.${format}`;
      anchorRef.current.href = dataURL.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    }
  }

  return (
    <CardStep
      toggleCard={toggleCard}
      title={title}
      collapsible={collapsible}
      collapse={collapse}
      save={saveImage}
    >
      <canvas ref={refCanvas} className={`max-w-full rounded-lg`} id={canvasId}/>
      { children ?
          children
          : null
      }
    </CardStep>
  );
}

export default CardStepImage;


