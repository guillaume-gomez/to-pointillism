import React, { useRef, RefObject } from 'react';
import { format as formatFns } from "date-fns";
import CardStep, { CardStepInterface } from "./CardStep";

interface CardStepGifInterface extends Omit<CardStepInterface, 'save'> {
  gifParentId: string;
  canvasId: string
}

function CardStepGif({ toggleCard, title, collapsible, collapse, canvasId, gifParentId, children }: CardStepGifInterface): React.ReactElement {
  const refImage = useRef<HTMLImageElement>(null);

  function saveGif(anchorRef: RefObject<HTMLAnchorElement>) {
    // the image tag is insert and generated in computePointillismGif function (see pointillism)
    if(refImage.current && anchorRef.current) {
      const dateString = formatFns(new Date(), "dd-MM-yyyy-hh-mm");
      (anchorRef.current as any).download = `${dateString}-pointillism.gif`;
      anchorRef.current.href = refImage.current.src;
    }
  }

  return (
    <CardStep
      toggleCard={toggleCard}
      title={title}
      collapsible={collapsible}
      collapse={collapse}
      save={saveGif}
    >
      {/*the canvas id is here to generate image for the gif*/}
      <canvas id={canvasId} style={{width: 0, height: 0}}/>
      <img ref={refImage} id={gifParentId} />
        { children ?
            children
            : null
        }
    </CardStep>
  );
}

export default CardStepGif;


