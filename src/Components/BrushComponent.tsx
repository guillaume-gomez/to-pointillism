import React from 'react';
import SliderWithLabel from "./SliderWithLabel";

interface BrushComponentInterface {
  brushStroke: number;
  brushOpacity: number;
  onChangeBrushStroke: (value: number) => void;
  onChangeBrushOpacity: (value: number) => void;
}

function BrushComponent({brushStroke, brushOpacity, onChangeBrushStroke, onChangeBrushOpacity } : BrushComponentInterface): React.ReactElement {
  return (
    <div>
      <label className="text-lg">Advanced brush settings</label>
      <div className="flex flex-row justify-between gap-5 pt-2">
        <div className="w-2/4">
          <SliderWithLabel label="Brush Strokes" value={brushStroke} onChange={(value) => onChangeBrushStroke(parseInt(value, 10))} min={5} max={20} />
          <span className="text-xs">Brush Strokes will change the 'length' of a line</span>
        </div>
        <div className="divider divider-vertical"></div>
        <div className="w-2/4">
          <SliderWithLabel label="Brush Opacity" value={brushOpacity} onChange={(value) => onChangeBrushOpacity(parseInt(value, 10))} min={1} max={255} />
          <span className="text-xs">Brush Opacity will change the strengh of the pencil </span>
        </div>
      </div>
    </div>
  );
}

export default BrushComponent;
