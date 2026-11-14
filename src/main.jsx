import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css'
import { BrowserRouter } from "react-router-dom";
import Toaster from "./components/toast/Toaster";
import WelcomeExperience from "./components/welcome/WelcomeExperience";
import { initLanguage } from "./lib/i18n";

initLanguage();

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
    <WelcomeExperience />
    <Toaster />
  </BrowserRouter>
);
