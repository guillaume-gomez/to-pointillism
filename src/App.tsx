import React from 'react';
import './App.css';
import DataForm from "./reducers/usePointillismParams";
import Footer from "./Components/Footer";
import NavBar from "./Components/NavBar";
import Body from "./Components/AppBody";


function App() {
  return (
    <div className="bg-img">
      <div className="container mx-auto flex flex-col gap-5 bg-neutral">
        <NavBar/>
        <DataForm.Provider>
          <Body />
        </DataForm.Provider>
        <Footer />
      </div>
    </div>
  );
}

export default App;
