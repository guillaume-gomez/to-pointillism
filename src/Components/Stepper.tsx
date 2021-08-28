import React, { useEffect, useRef, useState } from 'react';

function Stepper(): React.ReactElement {
  return (
    <div className="max-w-xl mx-auto my-4 border-b-2 pb-4">
      <div className="flex pb-3">
        <div className="flex-1">
        </div>

        <div className="flex-1">
          <div className="w-10 h-10 bg-green-700 mx-auto rounded-full text-lg text-white flex items-center">
            <span className="text-white text-center w-full">
              <i className="fa fa-check w-full fill-current white"></i>
            </span>
          </div>
        </div>


        <div className="w-1/6 align-center items-center align-middle content-center flex">
          <div className="w-full bg-gray-400 rounded items-center align-middle align-center flex-1">
            <div className="bg-green-700-light text-xs leading-none py-1 text-center text-grey-darkest rounded w-full"></div>
          </div>
        </div>
    
        
        <div className="flex-1">
          <div className="w-10 h-10 bg-green-700 mx-auto rounded-full text-lg text-white flex items-center">
            <span className="text-white text-center w-full"><i className="fa fa-check w-full fill-current white"></i></span>
          </div>
        </div>
    
        <div className="w-1/6 align-center items-center align-middle content-center flex">
          <div className="w-full bg-gray-400 rounded items-center align-middle align-center flex-1">
            <div className="bg-green-700-light text-xs leading-none py-1 text-center text-grey-darkest rounded w-1/5"></div>
          </div>
        </div>
    
        <div className="flex-1">
            <div className="w-10 h-10 bg-white border-2 border-grey-light mx-auto rounded-full text-lg text-white flex items-center">
                <span className="text-grey-darker text-center w-full">3</span>
            </div>
        </div>
    
    
        <div className="w-1/6 align-center items-center align-middle content-center flex">
          <div className="w-full bg-gray-400 rounded items-center align-middle align-center flex-1">
            <div className="bg-green-700-light text-xs leading-none py-1 text-center text-grey-darkest rounded w-0"></div>
          </div>
        </div>


        <div className="flex-1">
          <div className="w-10 h-10 bg-white border-2 border-grey-light mx-auto rounded-full text-lg text-white flex items-center">
            <span className="text-grey-darker text-center w-full">4</span>
          </div>
        </div>
    
    
        <div className="flex-1">
        </div>
    </div>
    
    <div className="flex text-xs content-center text-center">
      <div className="w-1/4">
          Invitation received
      </div>
      
      <div className="w-1/4">
          Personal details
      </div>
      
      <div className="w-1/4">
          Application details
      </div>
      
      <div className="w-1/4">
          Confirmation
      </div>
    </div>
  </div>
  );
}

export default Stepper;


