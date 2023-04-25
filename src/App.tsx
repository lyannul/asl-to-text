import React from "react";
import Translator from "./components/Translator";
import Modal from "./components/Modal";

function App() {
  return (
    <React.StrictMode>
      <div className="min-h-screen flex flex-col">
        <Translator />
      </div>
    </React.StrictMode>
  );
}

export default App;
