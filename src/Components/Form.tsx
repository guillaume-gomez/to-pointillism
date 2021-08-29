import React, { useEffect, useRef, useState } from 'react';
import Slider from "./Slider";
import UploadButton from "./UploadButton";

export interface dataFormInterface {
  thicknessBrush: number;
  image: File| null;
}

interface FormInterface {
  onSubmit: (data: dataFormInterface) => void;
}

function Form({ onSubmit } : FormInterface): React.ReactElement {
  const [thicknessBrush, setThicknessBrush] = useState<number>(1);
  const [image, setImage] = useState<File|null>(null);

  function loadImage(event: React.ChangeEvent<HTMLInputElement>) {
    if(event && event.target && event.target.files) {
      setImage(event.target.files[0]);
    }
  }

  function submit(event: any) {
    event.preventDefault();
    onSubmit({ thicknessBrush, image });
  }

  return (
    <form onSubmit={submit}>
    <UploadButton onChange={loadImage} />
    <button type="submit">Submit</button>
    </form>
  );
}

export default Form;


