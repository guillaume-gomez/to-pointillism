import React from 'react';
import SliderWithLabel from "./SliderWithLabel";
import DataForm from "../reducers/usePointillismParams";

interface BrushComponentInterface {
}

function BrushComponent(props : BrushComponentInterface): React.ReactElement {
  const {
    brushStroke,
    setBrushStroke,
    brushOpacity,
    setBrushOpacity,
  } = DataForm.useContainer();

  return (
    <div>
      <label className="text-lg">Advanced brush settings</label>
      <div className="flex flex-col md:flex-row justify-between gap-5 pt-2">
        <div className="w-full md:w-2/4">
          <SliderWithLabel label="Brush Strokes" value={brushStroke} onChange={(value) => setBrushStroke(parseInt(value, 10))} min={1} max={20} />
          <span className="text-xs">Brush Strokes will change the 'length' of a line</span>
        </div>
        <div className="w-full md:w-2/4">
          <SliderWithLabel label="Brush Opacity" value={brushOpacity} onChange={(value) => setBrushOpacity(parseInt(value, 10))} min={1} max={255} />
          <span className="text-xs">Brush Opacity will change the strengh of the pencil </span>
        </div>
      </div>
    </div>
  );
}

export default BrushComponent;
