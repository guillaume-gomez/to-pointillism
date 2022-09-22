import React, { useRef, ReactNode, RefObject } from 'react';

export interface CardStepInterface {
  toggleCard: () => void;
  title: string;
  collapsible: boolean;
  collapse: boolean;
  save: (anchorRef: RefObject<HTMLAnchorElement>) => void;
  children?: ReactNode
}

function CardStep({ toggleCard, title, collapsible, collapse, save, children }: CardStepInterface): React.ReactElement {
  const refA = useRef<HTMLAnchorElement>(null);
  return (
    <div className={`bg-neutral text-neutral-content collapse w-full border rounded-box border-base-300 collapse-arrow ${collapsible ? "" : "collapse-close"}`}>
      <input type="checkbox" checked={collapse} onChange={() => toggleCard()}/>
      <div className="collapse-title text-lg font-medium">
        {title}
      </div>
      <div className="collapse-content flex flex-col justify-center items-center gap-3">
        {children}
        <div className="flex flex-row self-end">
          <a ref={refA} className="btn btn-primary" onClick={ () => save(refA)}>Save</a>
        </div>
      </div>
    </div>
  );
}

export default CardStep;