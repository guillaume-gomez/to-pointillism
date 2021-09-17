import React, { useState } from 'react';
import Slider from "./Slider";

function ColorComponent(): React.ReactElement {
  const [hue, setHue] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(0);
  const [luminance, setLuminance] = useState<number>(0);
  return (
    <div>
      <label>Hue</label>
      <Slider value={hue} onChange={(value) => setHue(parseInt(value, 10))} min={0} max={255} />
      <label>Saturation</label>
      <Slider value={saturation} onChange={(value) => setSaturation(parseInt(value, 10))} min={0} max={255} />
      <label>Luminance</label>
      <Slider value={luminance} onChange={(value) => setLuminance(parseInt(value, 10))} min={0} max={255} />
    </div>
  );
}

export default ColorComponent;
