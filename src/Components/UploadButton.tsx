interface UploadButtonInterface {
  onChange: (imageBase64: string, width: number, height: number) => void;
  imageBase64?: string
}

function UploadButton({ onChange, imageBase64 } : UploadButtonInterface): React.ReactElement {
  
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if(event && event.target && event.target.files) {
      const imageBase64 = URL.createObjectURL(event.target.files[0]);
      onChange(imageBase64, event.target.width, event.target.height);
    }
  }

  return (
      <label className="w-full flex flex-col items-center px-4 py-6 bg-secondary text-primary rounded-lg shadow-lg tracking-wide uppercase border-2 border-primary transition duration-300 ease-in-out bg-opacity-40 cursor-pointer hover:bg-primary hover:text-neutral">
        {
          imageBase64 !== "" ?
            <div className="flex flex-col gap-1 items-center">
              <img src={imageBase64} width={124}/>
              <span> Click again to upload another image </span>
            </div> :
            <>
              <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
              </svg>
              <span className="mt-2 leading-normal">Select a picture</span>
            </>
        }
        <input type='file' accept="image/*" className="hidden" onChange={handleChange} />
      </label>
    
  );
}

export default UploadButton;


