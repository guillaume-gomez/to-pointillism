import React from 'react';
import StarMessage from "./StarMessage";

function Footer(): React.ReactElement {
  return (
    <footer className="p-4 footer bg-base-300 text-base-content footer-center p-6">
      <div>
        <p> 2021 - Made By Guillaume Gomez</p>
        <StarMessage 
          projectName={"to-pointillism"}
          projectUrl={"https://github.com/guillaume-gomez/to-pointillism"}
        />
      </div>
    </footer>
  );
}

export default Footer;
