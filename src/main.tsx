import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/index.css";
import RPGSheet from "./components/RPGSheet";
import MaskedImageUpload from "./components/MaskedImageUpload";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RPGSheet />
    <MaskedImageUpload />
  </React.StrictMode>
);
